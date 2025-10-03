"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const dots = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 5}s`,
    }));
    setParticles(dots);
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 py-16 px-6 sm:px-12 mt-24 overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl animate-ping" />
      </div>

      {/* Fake Particles */}
      <div className="absolute inset-0 -z-10">
        {particles.map((dot, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-bounce"
            style={{
              top: dot.top,
              left: dot.left,
              animationDuration: dot.duration,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 relative">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-purple-400 to-blue-400 bg-gradient-to-r bg-clip-text">
            Creatr
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
            Designing the future of digital experiences — sleek, immersive, and
            human-centered.
          </p>

          {/* Socials */}
          <div className="flex space-x-4 mt-6">
            <Link
              href="https://twitter.com"
              className="p-2 rounded-xl border border-purple-600/40 hover:border-purple-500 hover:text-purple-400 transition-all duration-300 backdrop-blur-md bg-gray-800/40"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com"
              className="p-2 rounded-xl border border-purple-600/40 hover:border-purple-500 hover:text-purple-400 transition-all duration-300 backdrop-blur-md bg-gray-800/40"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              className="p-2 rounded-xl border border-purple-600/40 hover:border-purple-500 hover:text-purple-400 transition-all duration-300 backdrop-blur-md bg-gray-800/40"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-2"
        >
          {/* Site Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wide mb-4">
              Site
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* App Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wide mb-4">
              App
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/feed"
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  Feed
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Newsletter / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-white text-sm font-semibold tracking-wide mb-4">
            Stay in the Loop
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Get early access to product drops and insights for the future.
          </p>
          <form className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-xl bg-gray-900/60 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-purple-500 backdrop-blur-md"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 text-white font-medium shadow-lg shadow-purple-600/30 animate-pulse"
            >
              Join
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <div className="mt-16 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 relative">
        <p>© {new Date().getFullYear()} Creatr. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">
          Crafted with <span className="text-purple-400">⚡</span> in the future.
        </p>
      </div>
    </footer>
  );
}
