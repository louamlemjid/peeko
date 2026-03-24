'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronDown, Play } from 'lucide-react';

const FeaturesTabbie = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const videoSections = [
    {
      id: 'video-sticks',
      tag: 'How it works',
      title: 'Never get bored with Peeko companion',
      description: 'Always there, never in the way.',
      video: '/videos/aiMarketing.mp4',
      poster: '/video-1.webp',
      progress: '42%'
    },
    {
      id: 'video-hardware',
      tag: 'The hardware',
      title: 'Interact with Peeko through voice commad "Pomodoro"',
      description: 'It celebrates when you finish, focuses when you work.',
      video: '/videos/voicecommand.mp4',
      poster: '/video-3.webp',
      progress: '48%'
    },
    {
      id: 'video-software',
      tag: 'The software',
      title: 'Receive messages from your friends.',
      description: 'One dashboard for your tasks, timers, habits, and expressions.',
      video: '/videos/message.mp4',
      poster: '/video-2.webp',
      progress: '42%'
    }
  ];

  const features = [
    { title: 'Tasks', img: '/task.webp', desc: 'Add tasks, set deadlines, get them done' },
    { title: 'Stats', img: '/stats.webp', desc: 'Track your productivity over time' },
    { title: 'Habits and Reminders', img: '/habits.webp', desc: 'Build routines that last' },
    { title: 'Workspaces', img: '/workspaces.webp', desc: 'Organize projects efficiently' },
    { title: 'Talk (coming soon)', img: '/talk.webp', desc: 'Voice interaction with Tabbie' },
    { title: 'Tools', img: '/tools-ui.webp', desc: 'Built-in focus utilities' },
    { title: 'Smart Insights', img: '/insights.webp', desc: 'AI-driven productivity tips' },
    { title: 'And much more..', img: '/more.webp', desc: 'Discover all the hidden gems' }
  ];

  const socialVideos = [
    { title: 'See it in action', src: '/videos/cute.mp4', poster: '/video2-poster.jpg' },
    { title: 'Tools', src: '/videos/gaming.mp4', poster: '/tools-poster.jpg' },
    { title: 'Animations', src: '/videos/reading.mp4', poster: '/video3-poster.jpg' },
    { title: 'Talk to it', src: '/videos/shortbeatch.mp4', poster: '/video1-poster.jpg' },
  ];

  return (
    <section id="how-it-works" className="bg-[var(--page-bg)]">
      
      {/* 1. Video Feature Sections */}
      {videoSections.map((section) => (
        <div key={section.id} className="flex flex-col items-center py-12 md:py-20 px-4 md:px-6">
          <div className="text-center mb-5 md:mb-12">
            <span className="text-[var(--text-faint)] text-sm font-medium uppercase tracking-widest mb-4 block">
              {section.tag}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)]">
              {section.title}
            </h2>
            <p className="hidden md:block text-base md:text-lg text-[var(--text-muted)] mt-3 md:mt-4 max-w-xl mx-auto">
              {section.description}
            </p>
          </div>
          <div className="w-full max-w-5xl">
            <div className="relative aspect-[4/5] md:aspect-[16/10] max-h-[80vh] rounded-2xl md:rounded-3xl bg-[var(--surface-1)] border border-[var(--border-1)] overflow-hidden">
              <video 
                autoPlay loop muted playsInline 
                poster={section.poster}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={section.video} type="video/mp4" />
              </video>
              {/* Top Progress Bar Decoration */}
              <div className="absolute top-0 left-0 right-0 h-[5px] z-10 bg-gray-500/30">
                <div 
                  className="h-full bg-white/85 shadow-[0_0_4px_rgba(0,0,0,0.3)]" 
                  style={{ width: section.progress }} 
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 2. Social Proof Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[var(--text-faint)] text-sm font-medium uppercase tracking-widest mb-4 block">Quick look</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)]">See it in action</h2>
        </div>
        
        <div className="flex gap-6 justify-center flex-wrap">
          {socialVideos.map((vid, i) => (
            <button key={i} className="group relative w-full md:w-[240px] aspect-[9/16] rounded-2xl  bg-black">
              <video src={vid.src} poster={vid.poster} autoPlay
                loop
                muted
                playsInline
                preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play fill="white" className="ml-1" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white text-sm font-bold">{vid.title}</span>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold uppercase">Tabbie</span>
            </button>
          ))}
          
          {/* Coming Soon Card */}
          <div className="w-full md:w-[240px] aspect-[9/16] rounded-2xl bg-[var(--surface-2)] border border-[var(--border-1)] flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-primary)]">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">Smart Insights</span>
            <span className="text-xs font-bold uppercase opacity-60">Coming soon</span>
          </div>
        </div>
      </section>

      {/* 3. Features Tabs Section */}
      <section id="features" className="flex flex-col items-center py-12 md:py-20 px-4 md:px-6">
        <div className="text-center mb-5 md:mb-12">
          <span className="text-[var(--text-faint)] text-sm font-medium uppercase tracking-widest mb-4 block">And so much more</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)]">Everything you need</h2>
        </div>

        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="relative md:w-[280px] flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => setActiveFeature(i)}
                className={`relative z-10 text-left px-5 py-4 rounded-2xl transition-all whitespace-nowrap ${
                  activeFeature === i ? 'text-[var(--text-primary)] bg-[var(--surface-3)] border border-[var(--border-1)]' : 'text-[var(--text-muted)]'
                }`}
              >
                <span className="text-sm md:text-base font-semibold">{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Feature Display */}
          <div className="flex-1 relative aspect-[16/10] rounded-3xl overflow-hidden bg-[var(--surface-1)] border border-[var(--border-1)] shadow-2xl">
            <Image 
              src={features[activeFeature].img} 
              alt={features[activeFeature].title} 
              fill 
              className="object-cover transition-opacity duration-500" 
            />
            {/* Mobile Info Overlay (Visible only on mobile) */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent md:hidden">
              <p className="text-white font-bold text-xl">{features[activeFeature].title}</p>
              <p className="text-white/80 text-sm mt-1">{features[activeFeature].desc}</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default FeaturesTabbie;