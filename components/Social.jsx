import { useEffect, useState } from "react";
import { Eye, Shield, PenTool, Users } from "lucide-react";

export const socialProofStats = [
  { metric: "50K+", label: "Active Creators", icon: Users },
  { metric: "2M+", label: "Published Posts", icon: PenTool },
  { metric: "10M+", label: "Monthly Readers", icon: Eye },
  { metric: "99.9%", label: "Uptime", icon: Shield },
];

// Helper to convert string like "50K+" to number
const parseMetric = (metric) => {
  if (metric.includes("K")) return parseFloat(metric) * 1000;
  if (metric.includes("M")) return parseFloat(metric) * 1000000;
  if (metric.includes("%")) return parseFloat(metric);
  return parseFloat(metric);
};

// Format numbers for display
const formatMetric = (num, original) => {
  if (original.includes("K")) return Math.round(num / 1000) + "K+";
  if (original.includes("M")) return Math.round(num / 1000000) + "M+";
  if (original.includes("%")) return num.toFixed(1) + "%";
  return num;
};

export default function SocialProof() {
  const [counters, setCounters] = useState(
    socialProofStats.map(() => 0)
  );

  useEffect(() => {
    const intervals = socialProofStats.map((stat, i) => {
      const target = parseMetric(stat.metric);
      const duration = 2000; // 2 seconds animation
      const stepTime = 20; // ms per step
      const steps = duration / stepTime;
      let currentStep = 0;

      return setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[i] = target * progress;
          return newCounters;
        });
        if (progress === 1) clearInterval(intervals[i]);
      }, stepTime);
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, []);

  return (
    <section className="relative z-10 py-20 px-6 sm:px-8 bg-gradient-to-r from-gray-900 via-purple-900/50 to-blue-900/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-16 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Loved by creators worldwide
          </span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {socialProofStats.map((stat, index) => (
            <div
              key={index}
              className="relative group p-8 bg-gradient-to-tr from-purple-900/40 to-blue-900/20 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-[0_0_60px_rgba(128,0,255,0.4)] transition duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 flex items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-lg group-hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all duration-500">
                <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>

              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400 animate-gradient">
                {formatMetric(counters[index], stat.metric)}
              </div>
              <div className="text-gray-300 text-base sm:text-lg">
                {stat.label}
              </div>
              <div className="absolute inset-0 rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
