"use client";

import React, { useEffect, useRef } from "react";

/**
 * DynamicCursor (Next.js / React client component)
 * - Smooth following outline + solid center dot
 * - Changes when hovering elements with `data-cursor="hover"` or class `cursor-hover`
 * - Supports 'magnetic' enlarge on elements with `data-cursor="magnetic"`
 *
 * Usage:
 * 1. Import and place <DynamicCursor /> near the root of your app (e.g. _app.js or layout).
 * 2. Mark interactive elements with `data-cursor="hover"` to trigger the hover style, or
 *    `data-cursor="magnetic"` to enable a magnet-like attraction + scaled outline.
 * 3. Customize by passing props: color, dotSize, outlineSize, trailingSpeed.
 *
 * Example:
 *  <button data-cursor="hover">Click me</button>
 *  <a data-cursor="magnetic">I'm magnetic</a>
 */

export default function DynamicCursor({
  color = "#7c3aed",
  dotSize = 8,
  outlineSize = 34,
  trailingSpeed = 0.12,
}) {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const outlinePosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    let isTouch = false;

    function onTouchStart() {
      isTouch = true;
      dot.style.display = "none";
      outline.style.display = "none";
    }

    function onMouseMove(e) {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      // position instant dot
      dot.style.transform = `translate3d(${e.clientX - dotSize / 2}px, ${e.clientY - dotSize / 2}px, 0)`;

      // add small visible state if hidden (keyboard users etc.)
      dot.style.opacity = "1";
      outline.style.opacity = "1";
    }

    function onMouseDown() {
      dot.style.transform += " scale(0.85)"; // slight squash
      dot.style.transition = "transform 120ms ease";
    }
    function onMouseUp() {
      dot.style.transition = "transform 240ms cubic-bezier(.2,.9,.2,1)";
      dot.style.transform = `translate3d(${posRef.current.x - dotSize / 2}px, ${posRef.current.y - dotSize / 2}px, 0)`;
    }

    function raf() {
      const { x: cx, y: cy } = posRef.current;
      const { x: ox, y: oy } = outlinePosRef.current;

      // lerp towards pointer
      outlinePosRef.current.x = ox + (cx - ox) * trailingSpeed;
      outlinePosRef.current.y = oy + (cy - oy) * trailingSpeed;

      outline.style.transform = `translate3d(${outlinePosRef.current.x - outlineSize / 2}px, ${outlinePosRef.current.y - outlineSize / 2}px, 0)`;

      rafRef.current = requestAnimationFrame(raf);
    }

    function onMouseEnter() {
      dot.style.display = "block";
      outline.style.display = "block";
    }

    function handleHoverTargets() {
      // delegate hover events for elements that want cursor interaction
      document.addEventListener(
        "mouseover",
        (ev) => {
          const el = ev.target;
          if (!(el instanceof Element)) return;

          const mode = el.getAttribute("data-cursor") || (el.classList && (el.classList.contains("cursor-hover") ? "hover" : null));
          if (!mode) return;

          if (mode === "hover") {
            outline.classList.add("cursor--hover");
            dot.classList.add("cursor--hover-dot");
          }

          if (mode === "magnetic") {
            outline.classList.add("cursor--magnetic");
            // move outline slightly toward element center
            const r = el.getBoundingClientRect();
            const targetX = r.left + r.width / 2;
            const targetY = r.top + r.height / 2;
            outlinePosRef.current.x = targetX;
            outlinePosRef.current.y = targetY;
          }
        },
        true
      );

      document.addEventListener(
        "mouseout",
        (ev) => {
          const el = ev.target;
          if (!(el instanceof Element)) return;

          const mode = el.getAttribute("data-cursor") || (el.classList && (el.classList.contains("cursor-hover") ? "hover" : null));
          if (!mode) return;

          outline.classList.remove("cursor--hover");
          outline.classList.remove("cursor--magnetic");
          dot.classList.remove("cursor--hover-dot");
        },
        true
      );
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    handleHoverTargets();

    // start raf loop
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [dotSize, outlineSize, trailingSpeed]);

  return (
    <>
      <div
        ref={outlineRef}
        aria-hidden
        className="fixed pointer-events-none z-[9999] transition-transform duration-150 ease-out opacity-90 transform-gpu"
        style={{
          width: outlineSize,
          height: outlineSize,
          borderRadius: outlineSize / 2,
          border: `1px solid ${color}`,
          boxShadow: `0 6px 30px ${hexToRgba(color, 0.14)}, 0 2px 8px ${hexToRgba(color, 0.06)}`,
          mixBlendMode: "screen",
          transform: `translate3d(-9999px, -9999px, 0)`,
        }}
      />

      <div
        ref={dotRef}
        aria-hidden
        className="fixed pointer-events-none z-[10000] transition-transform duration-150 ease-out opacity-100 transform-gpu"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          background: color,
          boxShadow: `0 6px 18px ${hexToRgba(color, 0.18)}`,
          transform: `translate3d(-9999px, -9999px, 0)`,
        }}
      />

      <style jsx>{`
        /* Hovered state: outline grows and becomes stronger */
        .cursor--hover {
          transform: scale(1.35) !important;
          transition: transform 220ms cubic-bezier(.2,.9,.2,1) !important;
          border-width: 1.5px !important;
        }

        .cursor--hover-dot {
          transform: scale(0.68) !important;
        }

        .cursor--magnetic {
          transform: scale(1.8) !important;
          transition: transform 300ms cubic-bezier(.2,.9,.2,1) !important;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.18));
        }

        /* hide native cursor when our custom cursor is active */
        html, body {
          cursor: none;
        }

        /* when using keyboard focus, show native cursor back for accessibility */
        :focus-within, :focus {
          cursor: auto;
        }

        @media (hover: none), (pointer: coarse) {
          /* on touch devices, hide our custom cursor */
          .cursor--hidden { display: none !important; }
          html, body { cursor: auto; }
        }
      `}</style>
    </>
  );
}

// small helper to accept hex like '#7c3aed' or css colors - returns rgba string when hex
function hexToRgba(hexOrColor, alpha = 1) {
  // if already rgba() or contains non-hex chars, return simple rgba fallback via transparentizing
  if (!hexOrColor) return `rgba(124,58,237,${alpha})`;
  try {
    // handle simple hex 3/6
    const hex = hexOrColor.replace("#", "");
    if (!/^[0-9a-fA-F]{3,8}$/.test(hex)) return hexOrColor;
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return hexOrColor;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return hexOrColor;
  }
}
