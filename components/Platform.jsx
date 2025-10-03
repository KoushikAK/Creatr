"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Settings, TrendingUp, PenTool, CheckCircle } from "lucide-react";

export const platformTabs = [
  {
    title: "Content Creation",
    icon: PenTool,
    description:
      "AI-powered writing tools that help you create engaging content faster than ever before.",
    features: [
      "Smart title suggestions",
      "Content optimization",
      "SEO recommendations",
      "Plagiarism detection",
    ],
  },
  {
    title: "Audience Growth",
    icon: TrendingUp,
    description:
      "Build and engage your community with powerful audience management tools.",
    features: [
      "Follower analytics",
      "Engagement tracking",
      "Community insights",
      "Growth recommendations",
    ],
  },
  {
    title: "Content Management",
    icon: Settings,
    description:
      "Organize and manage your content with comprehensive tools and analytics.",
    features: [
      "Draft system",
      "Post scheduling",
      "Content analytics",
      "Media management",
    ],
  },
];

export default function PlatformShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  // Wrap particlesInit in useCallback to avoid recreation every render
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 bg-gray-900 overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 50, density: { enable: true, area: 800 } },
            color: { value: ["#8b5cf6", "#3b82f6"] },
            shape: { type: "circle" },
            opacity: { value: 0.3, random: true },
            size: { value: 3, random: true },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              outModes: "out",
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: { repulse: { distance: 100 } },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          How it Works
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
          Three powerful modules working together to supercharge your content creation.
        </p>
      </div>

      {/* Tabs + Content */}
      <div className="flex flex-col lg:flex-row gap-10 relative z-10">
        {/* Tabs */}
        <div className="lg:w-1/3 space-y-4 relative">
          {platformTabs.map((tab, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => setActiveTab(index)}
              className={`w-full justify-start h-auto p-6 rounded-2xl transition-all duration-300 border ${
                activeTab === index
                  ? "border-transparent bg-gradient-to-br from-purple-700/30 to-blue-700/30 shadow-xl"
                  : "border-gray-700 bg-gray-800/30 hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeTab === index
                      ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg"
                      : "bg-gray-700/30 text-gray-300"
                  }`}
                >
                  <tab.icon className="w-6 h-6" />
                </div>
                <div className="text-left relative">
                  <h3 className="font-semibold text-lg text-white">{tab.title}</h3>
                  {activeTab === index && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 bottom-0 h-1 w-full rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                    />
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:w-2/3 relative">
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-gray-900/70 border border-gray-800 backdrop-blur-md shadow-2xl rounded-3xl p-6 transition-all duration-500 hover:shadow-3xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-white font-bold mb-2">
                    {platformTabs[activeTab].title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    {platformTabs[activeTab].description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6 mt-4">
                    {platformTabs[activeTab].features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
