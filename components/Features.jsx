"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Search, ImageIcon, BarChart3, Users, PenTool } from "lucide-react";
import { motion } from "framer-motion";

export const features = [
  {
    icon: PenTool,
    title: "AI Writing Assistant",
    desc: "Smart suggestions for titles, content, and SEO optimization.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Community Building",
    desc: "Grow your audience with engagement tools and follower insights.",
    color: "from-green-500 to-yellow-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    desc: "Track performance with detailed metrics and visual dashboards.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Calendar,
    title: "Content Scheduling",
    desc: "Plan and schedule content with smart notifications.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: ImageIcon,
    title: "AI Image Transformations",
    desc: "Background removal, smart crop, and text overlays instantly.",
    color: "from-red-500 to-purple-500",
  },
  {
    icon: Search,
    title: "Content Discovery",
    desc: "Explore trending content and discover emerging creators.",
    color: "from-emerald-500 to-green-500",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 100 },
  }),
};

export default function FeaturesGrid() {
  return (
    <section
      id="features"
      className="relative z-10 py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-900 to-purple-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              Everything you need
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            From AI-powered writing assistance to advanced analytics, we provide the ultimate toolkit for modern creators.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <Card className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/30 backdrop-blur-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-6 sm:p-8 flex flex-col items-start">
                  <motion.div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${feature.color}`}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl sm:text-2xl mb-3 text-white group-hover:text-indigo-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-400 sm:text-base">{feature.desc}</p>

                  <motion.div
                    className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-20 blur-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
