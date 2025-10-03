"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function HeroSection() {
  const avatars = [
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  ];

  // Framer Motion parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [15, -15]);
  const rotateY = useTransform(x, [-50, 50], [-15, 15]);

  // Initialize particles safely
  const particlesInit = useCallback(async (engine) => {
    // loadFull ensures all tsparticles features are loaded
    await loadFull(engine);
  }, []);

  return (
    <section className="relative z-10 mt-48 px-4 sm:px-6 overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          background: { color: "transparent" },
          particles: {
            number: { value: 60 },
            color: { value: ["#8b5cf6", "#3b82f6", "#10b981"] },
            shape: { type: "circle" },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 4 } },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: true,
              outModes: "out",
            },
            links: {
              enable: true,
              distance: 120,
              color: "#ffffff",
              opacity: 0.1,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <h1 className="text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white drop-shadow-xl">
              <span className="block">Create.</span>
              <span className="block font-light italic text-purple-400">
                Publish.
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Grow.
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl">
              The AI-powered platform that turns your ideas into{" "}
              <span className="text-purple-400 font-semibold">
                engaging content
              </span>{" "}
              and helps you build a thriving creator business.
            </p>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
            <Link href="/dashboard">
              <Button
                size="xl"
                variant="primary"
                className="rounded-full w-full sm:w-auto text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Creating for Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button
                variant="outline"
                size="xl"
                className="rounded-full w-full sm:w-auto border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300 shadow-lg"
              >
                Explore the Feed
              </Button>
            </Link>
          </div>

          {/* Creators */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {avatars.map((src) => (
                  <motion.div
                    key={src}
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black shadow-md overflow-hidden"
                    whileHover={{ scale: 1.3 }}
                  >
                    <Image
                      src={src}
                      alt={`Creator`}
                      fill
                      className="rounded-full object-cover"
                      sizes="48px"
                    />
                  </motion.div>
                ))}
              </div>
              <span className="text-gray-300 font-medium">10k+ creators</span>
            </div>
          </div>
        </div>

        {/* Right Side: Banner */}
        <Image
          src="/banner.png"
          alt="Platform Banner"
          width={500}
          height={700}
          className="w-full h-auto object-contain rounded-2xl shadow-2xl"
          priority
        />
      </div>
    </section>
  );
}
