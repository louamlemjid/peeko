'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const HeroTabbie = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  
  // Video data mapping to the posters/sources in your snippet
  const videos = [
    { id: 'idle', src: '/videos/aiPeeko.mp4', poster: '/hero-idle.gif' },
    { id: 'task', src: '/videos/somad.mp4', poster: '/hero-task.gif' },
    { id: 'focus', src: '/videos/singing.mp4', poster: '/hero-focus.gif' },
    { id: 'relax', src: '/videos/reading.mp4', poster: '/hero-relax.gif' },
    { id: 'angry', src: '/videos/shortbeatch.mp4', poster: '/hero-angry.gif' },
  ];

  const handleNextVideo = () => {
    setActiveVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <section 
      data-section="hero" 
      className="flex flex-col items-center pt-20 md:pt-32 pb-12 md:pb-24 px-4 md:px-6 bg-[var(--page-bg)]"
    >
      {/* Title */}
      <h1 
        className="text-[3.5rem] md:text-[6.5rem] font-bold tracking-tight text-[var(--text-primary)] text-center leading-[0.9]"
        style={{ opacity: 1, transform: 'none' }}
      >
        PEEKO
      </h1>

      {/* Subtitle */}
      <p 
        className="text-base md:text-xl text-[var(--text-tertiary)] font-normal mt-2 md:mt-4 text-center max-w-md px-2 leading-relaxed"
        style={{ opacity: 1, transform: 'none' }}
      >
        Your smart productivity companion.<br />
        A cute robot.
      </p>

      {/* Main App Mockup Container */}
      <div 
        className="w-full max-w-3xl md:max-w-2xl mt-6 md:mt-12" 
        style={{ opacity: 1, transform: 'none' }}
      >
        <div 
          className="rounded-2xl md:rounded-3xl bg-[var(--surface-1)] border border-[var(--border-1)] overflow-hidden" 
          style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 40px' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-b border-[var(--border-1)]">
            <div className="w-[6px] h-[6px] rounded-full animate-pulse bg-[#32D74B]"></div>
            <span className="text-[11px] md:text-xs font-medium text-[var(--text-ghost)] uppercase tracking-wider">
              Peeko App
            </span>
          </div>

          {/* Video Player Area */}
          <div 
            className="relative aspect-[4/5] md:aspect-[4/3] cursor-pointer group"
            onClick={handleNextVideo}
          >
            {videos.map((video, index) => (
              <video
                key={video.id}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={video.poster}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-in-out"
                style={{ opacity: activeVideo === index ? 1 : 0 }}
              >
                <source src={video.src} type="video/mp4" />
              </video>
            ))}

            {/* Pagination Overlay */}
            <div 
              className="absolute bottom-4 right-4 flex items-center gap-2.5 px-5 py-3 rounded-full backdrop-blur-md z-10 transition-transform active:scale-95"
              style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span className="text-lg md:hidden">👉</span>
              <span className="text-base hidden md:inline">👆</span>
              <span className="text-base font-semibold text-white">
                {activeVideo + 1}/{videos.length}
              </span>
            </div>
          </div>

          {/* Footer Indicators */}
          <div className="flex items-center justify-center gap-3 md:gap-2.5 py-3 border-t border-[var(--border-1)]">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveVideo(index)}
                className={`w-3 h-3 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                  activeVideo === index 
                    ? 'bg-[#007AFF] scale-125' 
                    : 'bg-transparent border-2 border-[var(--text-muted)] opacity-50'
                }`}
                style={{
                  boxShadow: activeVideo === index ? 'rgba(0, 122, 255, 0.4) 0px 0px 8px' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* "See how it works" Button */}
      <div className="mt-6 md:mt-10" style={{ opacity: 1 }}>
        <button className="text-[var(--text-muted)] text-sm font-medium flex items-center gap-1.5 hover:text-[var(--text-secondary)] transition-colors group">
          See how it works
          <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default HeroTabbie;