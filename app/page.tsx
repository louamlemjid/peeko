
// app/page.tsx
import Features from '@/components/home/features';
import FeaturesTabbie from '@/components/home/featuresTabbie';
import GalleryRzouga from '@/components/home/gallery/galleryRzouga';
import HeroSection from '@/components/home/hero';
import HeroRzouga from '@/components/home/heroRzouga';
import HeroTabbie from '@/components/home/heroTabbie';
import PricingTabbie from '@/components/home/pricingTabbie';


export default function Home() {
  
  return (
    <main className="flex-grow w-full">
      {/* Navigation (optional - add if needed) */}
      {/* <nav>...</nav> */}

      {/* Hero Section */}
     
          <HeroRzouga  />
          
          <GalleryRzouga/>
          
     
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