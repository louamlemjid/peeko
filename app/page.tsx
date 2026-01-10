// app/page.tsx
import { Bot, ShieldCheck, DollarSign, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-indigo-950/60 to-black text-white overflow-hidden">
      {/* Navigation (optional - add if needed) */}
      {/* <nav>...</nav> */}

      {/* Hero Section */}
      <div className="relative  pb-20 md:pt-40 md:pb-32 px-5 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            {/* Left - Text + Features + CTAs */}
            <div className="space-y-12 md:space-y-16 relative z-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-100 to-gray-200">
                Why Choose
                <br />
                <span className="bg-gradient-to-r from-[#FE7F2D] to-primary  bg-clip-text text-transparent">
                  AIAF?
                </span>
              </h1>

             {/* Mobile Image - smaller & centered */}
            <div className="lg:hidden relative mt-12 flex justify-center">
              <div className="relative w-64 sm:w-80 max-w-full">
                <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/50">
                  <div className="absolute inset-0  pointer-events-none z-10" />
                  <Image
                    src="/peekoPoster.jpg"
                    alt="Peeko AI Agent - Mobile"
                    width={320}
                    height={520}
                    className="w-full h-auto "
                    priority
                  />
                </div>

                {/* Small glow effect */}
                <div className="absolute inset-0  blur-xl animate-pulse-slow" />
              </div>
            </div>

              {/* CTA Buttons - visible on all sizes */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 md:pt-8">
                <Link
                  href="/user"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full bg-gradient-to-r from-[#FE7F2D] to-primary hover:from-[#FE7F2D] hover:to-violet-500 transition-all shadow-lg shadow-[#FE7F2D]/40 transform hover:scale-105"
                >
                  Join Now
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full border border-primary/50 bg-black/30 backdrop-blur-sm hover:bg-white/5 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right - Cinematic Image (hidden on mobile, shown from lg+) */}
            <div className="relative hidden lg:block">
              <div className="relative h-[680px] flex items-center justify-center -mr-8">
                {/* Glow + vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE7F2D]/10 via-primary/15 to-transparent blur-3xl animate-pulse-slow z-0" />

                <div className="relative z-20 transform -rotate-3 scale-105 transition-transform duration-700 hover:rotate-0 hover:scale-110">
                  <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/60">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none z-10" />
                    <Image
                      src="/peekoPoster.jpg"
                      alt="Peeko AI Agent - Cinematic"
                      width={420}
                      height={680}
                      className="object-cover brightness-90 contrast-110 saturate-125 drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Accent glows */}
                <div className="absolute top-20 -left-10 w-32 h-32 bg-[#FE7F2D]/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-32 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
              </div>
            </div>

            
             <div className="grid sm:grid-cols-2 gap-6 md:gap-7">
                {[
                  {
                    icon: ShieldCheck,
                    color: 'from-[#FE7F2D]/30 to-primary/30',
                    textColor: 'text-[#FE7F2D]',
                    title: 'True Ownership',
                    desc: 'Full control of your AI agents through NFT ownership',
                  },
                  {
                    icon: Zap,
                    color: 'from-violet-600/30 to-primary/30',
                    textColor: 'text-violet-400',
                    title: 'Professional Infrastructure',
                    desc: 'Enterprise-grade performance with decentralized benefits',
                  },
                  {
                    icon: DollarSign,
                    color: 'from-pink-600/30 to-[#FE7F2D]/30',
                    textColor: 'text-pink-400',
                    title: 'Multiple Revenue Streams',
                    desc: 'Diverse monetization options for AI creators',
                  },
                  {
                    icon: Bot,
                    color: 'from-indigo-600/30 to-violet-600/30',
                    textColor: 'text-indigo-400',
                    title: 'Future-Proof Technology',
                    desc: 'Built on scalable, secure blockchain infrastructure',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group bg-gradient-to-br from-primary/40 to-black backdrop-blur-md border border-primary/20 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.03]"
                  >
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 md:mb-5 transition-transform group-hover:scale-110`}
                    >
                      <item.icon className={`w-6 h-6 md:w-7 md:h-7 ${item.textColor}`} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      {/* Add to globals.css or tailwind.config for animations */}
      {/*
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.08); }
        }
        .animate-pulse-slow { animation: pulse-slow 14s ease-in-out infinite; }
      */}
    </main>
  );
}