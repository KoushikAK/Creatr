"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Image,
  Sparkles,
  Wand2,
  Plus,
  Minus,
  RotateCcw,
  RotateCw,
  Maximize,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { generateBlogContent, improveContent } from "@/app/actions/gemini";
import { BarLoader } from "react-spinners";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
if (typeof window !== "undefined")
  import("react-quill-new/dist/quill.snow.css");

const quillConfig = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["image", "video"],
      ],
      handlers: { image: function () {} },
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  },
  formats: [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "link",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "image",
    "video",
  ],
};

export default function PostEditorContent({
  form,
  setQuillRef,
  onImageUpload,
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedValues = watch();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const quillInternalRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const LOCAL_STORAGE_KEY = "post_editor_draft_v1";

  useEffect(() => {
    if (setQuillRef) setQuillRef(quillInternalRef);

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (
          saved.content &&
          (!watchedValues.content || watchedValues.content === "<p><br></p>")
        ) {
          setValue("content", saved.content);
          toast.message("Draft restored from browser storage");
        }
      }
    } catch (e) {}

    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        quillInternalRef.current?.getEditor?.().history.redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        setTimeout(
          () => quillInternalRef.current?.getEditor?.().history.undo(),
          50
        );
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      try {
        const data = {
          content: watchedValues.content,
          title: watchedValues.title,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        setLastSavedAt(new Date());
        setAutoSaving(false);
      } catch (e) {
        console.error("Autosave failed", e);
      }
    }, 1500);
    setAutoSaving(true);
    return () => clearTimeout(autosaveTimerRef.current);
  }, [watchedValues.content, watchedValues.title]);

  const handleSaveDraft = () => {
    try {
      const data = {
        content: watchedValues.content,
        title: watchedValues.title,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setLastSavedAt(new Date());
      toast.success("Draft saved to browser storage");
    } catch (e) {
      toast.error("Failed to save draft");
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success("Draft cleared from browser storage");
  };

  const getQuillModules = () => ({
    ...quillConfig.modules,
    toolbar: {
      ...quillConfig.modules.toolbar,
      handlers: { image: () => onImageUpload?.("content") },
    },
  });

  const handleAI = async (type, improvementType = null) => {
    const { title, content, category, tags } = watchedValues;

    if (type === "generate") {
      if (!title?.trim())
        return toast.error("Please add a title before generating content");
      if (
        content &&
        content !== "<p><br></p>" &&
        !window.confirm("This will replace your existing content. Continue?")
      )
        return;
      setIsGenerating(true);
    } else {
      if (!content || content === "<p><br></p>")
        return toast.error("Please add some content before improving it");
      setIsImproving(true);
    }

    try {
      const result =
        type === "generate"
          ? await generateBlogContent(title, category, tags || [])
          : await improveContent(content, improvementType);

      if (result.success) {
        setValue("content", result.content);
        toast.success(
          `Content ${type === "generate" ? "generated" : improvementType + "d"} successfully!`
        );
      } else {
        toast.error(result.error || "AI returned an error");
      }
    } catch (error) {
      console.error(`Failed to ${type} content:`, error);
      toast.error(`Failed to ${type} content. Please try again.`);
    } finally {
      type === "generate" ? setIsGenerating(false) : setIsImproving(false);
    }
  };

  const undo = () => quillInternalRef.current?.getEditor?.().history.undo();
  const redo = () => quillInternalRef.current?.getEditor?.().history.redo();
  const toggleFullscreen = () => setIsFullscreen((s) => !s);

  const wordCount = (html) => {
    if (!html) return 0;
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  };

  const readingTime = (words) => Math.max(1, Math.ceil(words / 200));

  const hasTitle = watchedValues.title?.trim();
  const hasContent =
    watchedValues.content && watchedValues.content !== "<p><br></p>";

  return (
    <>
      <main
        className={`max-w-5xl mx-auto px-8 py-12 transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-auto" : ""}`}
      >
        <div className="space-y-8">
          {/* Featured Image with Premium Styling */}
          {watchedValues.featuredImage ? (
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <img
                src={watchedValues.featuredImage}
                alt="Featured"
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-4">
                <Button
                  onClick={() => onImageUpload?.("featured")}
                  variant="premiumGlass"
                  size="lg"
                  className="shadow-xl backdrop-blur-md transition-all duration-200 transform hover:scale-105"
                >
                  Change Image
                </Button>
                <Button
                  onClick={() => setValue("featuredImage", "")}
                  variant="destructive"
                  size="lg"
                  className="shadow-xl backdrop-blur-md bg-red-500/90 hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onImageUpload?.("featured")}
              className="w-full h-48 border-2 border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center space-y-5 hover:border-purple-500/50 hover:bg-slate-800/30 transition-all duration-300 group relative overflow-hidden shadow-lg backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col items-center space-y-5">
                <div className="p-4 rounded-full bg-slate-800/50 group-hover:bg-purple-500/20 transition-all duration-300 ring-1 ring-slate-700/50 group-hover:ring-purple-500/50">
                  <Image className="h-10 w-10 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <p className="text-slate-200 text-xl font-semibold tracking-tight">
                    Add a featured image
                  </p>
                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    Upload and transform with AI
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Premium Title Input */}
          <div className="relative">
            <Input
              {...register("title")}
              placeholder="Your story begins here..."
              className="border-0 text-5xl font-bold bg-transparent placeholder:text-slate-600/50 text-white p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 tracking-tight"
              style={{ fontSize: "3rem", lineHeight: "1.1", fontWeight: "800" }}
            />
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            {errors.title && (
              <p className="text-red-400 mt-3 text-sm font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Premium Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-xl">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {!hasContent ? (
                <Button
                  onClick={() => handleAI("generate")}
                  disabled={!hasTitle || isGenerating || isImproving}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02]"
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate with AI
                </Button>
              ) : (
                <div className="grid grid-cols-3 w-full lg:w-auto gap-3">
                  {[
                    {
                      type: "enhance",
                      icon: Sparkles,
                      color:
                        "from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/25 hover:shadow-amber-500/30",
                    },
                    {
                      type: "expand",
                      icon: Plus,
                      color:
                        "from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/25 hover:shadow-emerald-500/30",
                    },
                    {
                      type: "simplify",
                      icon: Minus,
                      color:
                        "from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/25 hover:shadow-blue-500/30",
                    },
                  ].map(({ type, icon: Icon, color }) => (
                    <Button
                      key={type}
                      onClick={() => handleAI("improve", type)}
                      disabled={isGenerating || isImproving}
                      size="lg"
                      className={`bg-gradient-to-r ${color} text-white shadow-lg disabled:opacity-50 font-semibold transition-all duration-200 hover:shadow-xl hover:scale-[1.02]`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="lg"
                onClick={undo}
                title="Undo (Ctrl/Cmd+Z)"
                className="hover:bg-slate-700/50 hover:text-purple-400 transition-all duration-200 border border-slate-700/30 hover:border-purple-500/50 shadow-sm hover:shadow-lg hover:shadow-purple-500/10"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={redo}
                title="Redo (Ctrl/Cmd+Y)"
                className="hover:bg-slate-700/50 hover:text-purple-400 transition-all duration-200 border border-slate-700/30 hover:border-purple-500/50 shadow-sm hover:shadow-lg hover:shadow-purple-500/10"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              <div className="w-px h-8 bg-slate-700/50 mx-1 hidden sm:block"></div>
              <Button
                onClick={handleSaveDraft}
                title="Save draft (Ctrl/Cmd+S)"
                size="lg"
                className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 hover:from-emerald-600/40 hover:to-emerald-500/40 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-500/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 font-semibold"
              >
                <Save className="h-5 w-5 mr-2" />
                Save
              </Button>
              <Button
                onClick={clearDraft}
                title="Clear local draft"
                size="lg"
                className="bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600/40 hover:to-red-500/40 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500/50 shadow-sm hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200 font-semibold"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Clear
              </Button>
              <div className="w-px h-8 bg-slate-700/50 mx-1 hidden sm:block"></div>
              <Button
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
                size="lg"
                className="hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200 border border-slate-700/30 hover:border-blue-500/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Premium Loading Bar */}
          {(isGenerating || isImproving || autoSaving) && (
            <div className="relative overflow-hidden rounded-full h-1 bg-slate-800/50">
              <BarLoader width={"100%"} color="#A78BFA" height={4} />
            </div>
          )}

          {/* Premium Editor Container */}
          <div
            className={`bg-slate-800/20 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30 shadow-2xl ${isFullscreen ? "h-[calc(100vh-180px)] overflow-auto" : ""}`}
          >
            <ReactQuill
              ref={quillInternalRef}
              theme="snow"
              value={watchedValues.content}
              onChange={(content) => setValue("content", content)}
              modules={getQuillModules()}
              formats={quillConfig.formats}
              placeholder="Tell your story... or let AI craft it for you"
              style={{
                minHeight: "500px",
                fontSize: "1.125rem",
                lineHeight: "1.8",
              }}
            />
            {errors.content && (
              <p className="text-red-400 mt-3 text-sm font-medium">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Premium Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-xl">
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-slate-300">
                  {wordCount(watchedValues.content)} words
                </span>
              </div>
              <div className="w-px h-4 bg-slate-700/50"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-slate-300">
                  {(wordCount(watchedValues.content) / 5).toFixed(0)} characters
                </span>
              </div>
              <div className="w-px h-4 bg-slate-700/50"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-300">
                  {readingTime(wordCount(watchedValues.content))} min read
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {(() => {
                if (autoSaving) {
                  return (
                    <span className="text-amber-400 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                      Saving...
                    </span>
                  );
                } else if (lastSavedAt) {
                  return (
                    <span className="text-emerald-400 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      Saved at {lastSavedAt.toLocaleTimeString()}
                    </span>
                  );
                } else {
                  return (
                    <span className="text-slate-500 font-medium">
                      Not saved yet
                    </span>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .ql-editor {
          color: white !important;
          font-size: 1.125rem !important;
          line-height: 1.8 !important;
          padding: 0 !important;
          min-height: 500px !important;
        }
        .ql-editor::before {
          color: rgb(100, 116, 139) !important;
          font-style: normal !important;
        }
        .ql-toolbar {
          border: none !important;
          padding: 1rem !important;
          position: sticky !important;
          top: 100px !important;
          background: rgba(30, 41, 59, 0.6) !important;
          backdrop-filter: blur(20px) !important;
          z-index: 30 !important;
          border-radius: 1rem !important;
          margin-bottom: 1.5rem !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(71, 85, 105, 0.3) !important;
        }
        .ql-container {
          border: none !important;
        }
        .ql-snow .ql-tooltip {
          background: rgb(30, 41, 59) !important;
          border: 1px solid rgb(71, 85, 105) !important;
          color: white !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
          border-radius: 0.5rem !important;
        }
        .ql-snow .ql-picker {
          color: white !important;
        }
        .ql-snow .ql-picker-options {
          background: rgb(30, 41, 59) !important;
          border: 1px solid rgb(71, 85, 105) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
        }
        .ql-snow .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: white !important;
        }
        .ql-snow .ql-stroke {
          stroke: white !important;
        }
        .ql-toolbar button:hover {
          background: rgba(147, 51, 234, 0.2) !important;
          border-radius: 0.375rem !important;
        }
        .ql-editor h1 {
          font-size: 2.5rem !important;
          font-weight: 800 !important;
          color: white !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          line-height: 1.2 !important;
        }
        .ql-editor h2 {
          font-size: 2rem !important;
          font-weight: 700 !important;
          color: white !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.3 !important;
        }
        .ql-editor h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: rgba(255, 255, 255, 0.95) !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ql-editor p {
          margin-bottom: 1rem !important;
        }
        .ql-editor blockquote {
          border-left: 4px solid rgb(147, 51, 234) !important;
          color: rgb(203, 213, 225) !important;
          padding-left: 1.5rem !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
          font-style: italic !important;
          background: rgba(147, 51, 234, 0.05) !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
          margin: 1.5rem 0 !important;
        }
        .ql-editor a {
          color: rgb(167, 139, 250) !important;
          text-decoration: none !important;
          border-bottom: 1px solid rgba(167, 139, 250, 0.3) !important;
          transition: all 0.2s !important;
        }
        .ql-editor a:hover {
          color: rgb(196, 181, 253) !important;
          border-bottom-color: rgb(196, 181, 253) !important;
        }
        .ql-editor code {
          background: rgba(51, 65, 85, 0.6) !important;
          color: rgb(252, 165, 165) !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.375rem !important;
          font-size: 0.95em !important;
          border: 1px solid rgba(71, 85, 105, 0.3) !important;
        }
        .ql-editor pre {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(71, 85, 105, 0.3) !important;
          border-radius: 0.75rem !important;
          padding: 1.5rem !important;
          margin: 1.5rem 0 !important;
        }
        .ql-editor ul,
        .ql-editor ol {
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
        }
        .ql-editor li {
          margin-bottom: 0.5rem !important;
          padding-left: 0.5rem !important;
        }
        .ql-editor img {
          border-radius: 0.75rem !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          margin: 2rem 0 !important;
        }
      `}</style>
    </>
  );
}
