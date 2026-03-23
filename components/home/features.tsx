// features.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // assuming you have a cn utility (like clsx + tailwind-merge)

const moods = [
  {
    id: "studying",
    name: "Studying",
    icon: "📚",
    color: "bg-amber-700 hover:bg-amber-800",
    activeColor: "bg-amber-600",
    gif: "/gifs/peeko-studying.gif",
    description: "Deep Focus Mode",
    details: [
      "Eyes narrow to 45%",
      "Pulse rate: 122 bpm slowly",
      "Avoids distractions — only reacts to gentle taps",
      "Interaction: Low",
      "Sensory: Alert",
    ],
  },
  {
    id: "happy",
    name: "Happy",
    icon: "😊",
    color: "bg-emerald-600 hover:bg-emerald-700",
    activeColor: "bg-emerald-500",
    gif: "/gifs/peeko-happy.gif",
    description: "Joyful Expression",
    details: [
      "Bright wide eyes",
      "Gentle smiling mouth",
      "Small bouncing animation",
      "Duration: ~3.5 seconds loop",
      "Interaction: High",
    ],
  },
  {
    id: "focused",
    name: "Focused",
    icon: "🔍",
    color: "bg-blue-700 hover:bg-blue-800",
    activeColor: "bg-blue-600",
    gif: "/gifs/peeko-focused.gif",
    description: "Intense Concentration",
    details: [
      "Eyes slightly squinted",
      "Minimal blinking",
      "Head tilt forward",
      "Pulse rate: 108 bpm",
      "Sensory: Very high",
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    color: "bg-purple-700 hover:bg-purple-800",
    activeColor: "bg-purple-600",
    gif: "/gifs/peeko-gaming.gif",
    description: "In The Zone",
    details: [
      "Excited wide eyes",
      "Rapid blinking during action",
      "Small head movements",
      "Mouth slightly open",
      "Duration: reactive loop",
    ],
  },
  {
    id: "sleepy",
    name: "Sleepy",
    icon: "😴",
    color: "bg-indigo-700 hover:bg-indigo-800",
    activeColor: "bg-indigo-600",
    gif: "/gifs/sleepy.gif",
    description: "Low Energy Mode",
    details: [
      "Half-closed droopy eyes",
      "Slow blinking",
      "Head slowly nodding",
      "Pulse rate: 68 bpm",
      "Interaction: Very low",
    ],
  },
  {
    id: "eating",
    name: "Eating",
    icon: "🍜",
    color: "bg-orange-600 hover:bg-orange-700",
    activeColor: "bg-orange-500",
    gif: "/gifs/peeko-eating.gif",
    description: "Snack Time",
    details: [
      "Chewing animation",
      "Contented half-smile",
      "Eyes gently closed sometimes",
      "Small happy swaying",
      "Duration: 4–6 seconds loop",
    ],
  },
];

export default function Features() {
  const [activeMood, setActiveMood] = useState(moods[0]); // default: studying

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-cyan-950 to-black text-white rounded-3xl">
      <div className="container mx-auto px-6">
        {/* Mood Carousel */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            A Soul in Every Pixel
          </h2>

          <div className="flex justify-center">
            <div className="inline-flex bg-cyan-900/20 backdrop-blur-sm p-3 rounded-4xl border border-cyan-700/50 shadow-xl overflow-hidden">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setActiveMood(mood)}
                  className={cn(
                    "flex flex-col items-center px-5 py-3 mx-1 rounded-full transition-all duration-300 min-w-[90px]",
                    activeMood.id === mood.id
                      ? `bg-cyan-900 shadow-lg shadow-black/40 scale-105`
                      : `bg-cyan-900/20 hover:scale-105`
                  )}
                >
                  <span className="text-3xl mb-1.5">{mood.icon}</span>
                  <span className="text-sm font-medium">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Mood Display */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-cyan-900/60 backdrop-blur-md rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* GIF / Visual Area */}
              <div className="md:w-3/5 bg-black/40 relative aspect-video md:aspect-auto">
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                  {activeMood.gif ? (
                    <div className="relative w-full max-w-[420px] mx-auto">
                      <Image
                        src={activeMood.gif}
                        alt={`${activeMood.name} Peeko expression`}
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-xl shadow-2xl"
                        unoptimized // gifs usually need unoptimized in Next.js
                        priority
                      />
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xl">
                      Loading expression...
                    </div>
                  )}
                </div>

                {/* Subtle overlay info */}
                <div className="absolute bottom-4 left-4 right-4 md:hidden">
                  <div className="bg-black/60 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm">
                    <p className="font-semibold">{activeMood.description}</p>
                  </div>
                </div>
              </div>

              {/* Text Details */}
              <div className="p-8 md:p-12 md:w-2/5 flex flex-col justify-center">
                <div className="mb-6 md:mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {activeMood.description}
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base">
                    Currently Active • {activeMood.name} Mood
                  </p>
                </div>

                <ul className="space-y-3 md:space-y-4 text-slate-300">
                  {activeMood.details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-400 mr-3 mt-1.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-slate-700/50 text-xs text-slate-500">
                  RENDER: EXPRESSION_V2.64 // {activeMood.name.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}