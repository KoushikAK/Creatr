import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-r from-purple-900 via-gray-900 to-purple-800">
      <div className="max-w-4xl mx-auto text-center backdrop-blur-md bg-white/5 rounded-3xl p-10 shadow-xl">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Ready to create?
        </h2>
        <p className="text-xl sm:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-2xl mx-auto">
          Join thousands of creators already building their audience and growing their business with our AI-powered platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/dashboard">
            <Button
              size="xl"
              variant="primary"
              className="rounded-full w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex items-center justify-center gap-3"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/feed">
            <Button
              size="xl"
              variant="outline"
              className="rounded-full w-full border-gray-400 text-gray-200 hover:border-pink-400 hover:text-pink-400 hover:scale-105 transition-all duration-300"
            >
              Explore the Feed
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
