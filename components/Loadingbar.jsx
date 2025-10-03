"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Example: simulate loading
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 h-1 w-full z-50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            transformOrigin: "0% 50%",
            background:
              "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b, #10b981)",
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
