// app/page.tsx
import Features from '@/components/home/features';
import FeaturesTabbie from '@/components/home/featuresTabbie';
import HeroSection from '@/components/home/hero';
import HeroTabbie from '@/components/home/heroTabbie';
import PricingTabbie from '@/components/home/pricingTabbie';


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-cyan-950/60 to-black text-white overflow-hidden">
      {/* Navigation (optional - add if needed) */}
      {/* <nav>...</nav> */}

      {/* Hero Section */}
      <div className="relative  pb-20 md:pt-40 md:pb-32 px-5 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <HeroTabbie />
          
          <FeaturesTabbie/>

          <PricingTabbie/>
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