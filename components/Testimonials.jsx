import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Tech Blogger",
    company: "@TechInsights",
    imageId: "1580489944761-15a19d654956",
    content:
      "Creatr transformed how I create content. The AI writing assistant saves me hours every week.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Newsletter Creator",
    company: "@MarketingWeekly",
    imageId: "1507003211169-0a1dd7228f2d",
    content:
      "The email newsletter features are incredible. My subscriber growth increased by 300% in just 3 months.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Content Strategist",
    company: "@CreativeSpace",
    imageId: "1544005313-94ddf0286df2",
    content:
      "Best investment I've made for my content business. The analytics help me understand what my audience loves.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-900 to-gray-950"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            What creators say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real feedback from creators using Creatr to elevate their content game.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 backdrop-blur-lg bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700 rounded-3xl overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-md"
                    />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-gray-300 text-lg italic">
                  &quot;{t.content}&quot;
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                    <Image
                      src={`https://images.unsplash.com/photo-${t.imageId}?w=100&h=100&fit=crop&crop=face`}
                      alt={t.name}
                      fill
                      className="rounded-full border-2 border-gradient-to-r border-purple-400/60 object-cover shadow-lg"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{t.name}</div>
                    <div className="text-gray-400 text-sm">{t.role}</div>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    >
                      {t.company}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
