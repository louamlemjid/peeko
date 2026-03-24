'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Play, ArrowRight, CircleCheck, Wrench, Plus } from 'lucide-react';

const PricingTabbie = () => {
  const [mountPosition, setMountPosition] = useState<'side' | 'top'>('side');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "When will Tabbie V1 be ready?",
      a: "I'm actively working on it right now! Tabbie V1 ships in ~30 days after you order. Every Tabbie you buy today is fully compatible with future expansion PCBs."
    },
    {
      q: "What is Tabbie?",
      a: "Tabbie is a desk robot and productivity companion that sticks to your monitor. It pairs with a desktop app to help you manage tasks, plan your day, and run focus timers."
    },
    {
      q: "What platforms do you support?",
      a: "Tabbie supports macOS and Windows."
    },
    {
      q: "How does Tabbie get power?",
      a: "Power comes from a USB-C cable connected to your laptop/PC or any USB power source. Battery support is coming as a separate add-on later."
    },
    {
        q: "Is my data private?",
        a: "Yes. Tabbie stores everything locally on your device. There are no accounts, no cloud sync, and none of your personal data leaves your machine."
    }
  ];

  return (
    <section className="bg-[var(--page-bg)]">
      {/* --- PREORDER SECTION --- */}
      <div id="preorder" className="flex flex-col items-center pt-24 md:pt-20 pb-12 md:pb-20 px-4 md:px-6">
        <div className="text-center mb-6 md:mb-10">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest mb-3 text-[var(--accent-green)]">
            <Sparkles className="h-4 w-4" />
            Batch 2 — Founders Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold text-[var(--text-primary)]">
            Pricing for early supporters (thank youuu 🤍)
          </h2>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-5">
          {/* Main Pricing Card */}
          <div className="overflow-hidden rounded-3xl border border-[var(--border-1)] bg-[var(--surface-1)] shadow-xl">
            {/* Dynamic Preview Header */}
            <div className="relative aspect-video md:aspect-[21/10] bg-black">
              <video
                key={mountPosition}
                autoPlay loop muted playsInline
                poster={`/preview-${mountPosition}.webp`}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={`/preview-${mountPosition}.mp4`} type="video/mp4" />
              </video>
            </div>

            <div className="p-5 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Configuration side */}
                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Choose your setup</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Mount position</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMountPosition('side')}
                      className={`rounded-2xl border p-4 text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                        mountPosition === 'side' 
                        ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--page-bg)] shadow-lg' 
                        : 'border-[var(--border-2)] text-[var(--text-muted)] hover:border-[var(--border-1)]'
                      }`}
                    >
                      Side Mount
                    </button>
                    <button
                      onClick={() => setMountPosition('top')}
                      className={`rounded-2xl border p-4 text-sm font-bold transition-all flex flex-col items-center gap-2 ${
                        mountPosition === 'top' 
                        ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--page-bg)] shadow-lg' 
                        : 'border-[var(--border-2)] text-[var(--text-muted)] hover:border-[var(--border-1)]'
                      }`}
                    >
                      Top Mount
                    </button>
                  </div>

                  <button className="group w-full rounded-2xl border border-[var(--border-1)] bg-[var(--surface-2)] p-3 flex items-center gap-4 transition-colors hover:bg-[var(--surface-3)]">
                    <div className="w-12 h-12 bg-black rounded-lg flex-shrink-0 relative overflow-hidden">
                       <Play className="absolute inset-0 m-auto w-4 h-4 text-white fill-white" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-[var(--text-primary)]">See how it mounts</p>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">30s demo <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </button>
                </div>

                {/* Price side */}
                <div className="bg-[var(--surface-2)] rounded-2xl p-6 border border-[var(--border-1)]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[var(--accent-green-bg)] text-[var(--accent-green)] text-[10px] font-bold px-2 py-1 rounded-full border border-[var(--accent-green-border)]">SAVE $20</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{mountPosition} edition</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-[var(--text-primary)]">$69.99</span>
                    <span className="text-lg text-[var(--text-muted)] line-through">$89.99</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-6">One-time payment, no subscription for core features.</p>

                  <ul className="space-y-3 mb-8">
                    {["1x Tabbie + Desktop App", "Only 250 in Batch 2", "Early features & Priority support"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                        <CircleCheck className="w-4 h-4 text-[var(--accent-green)]" /> {item}
                      </li>
                    ))}
                  </ul>

                  <a href="#" className="block w-full bg-[var(--cta-bg)] text-[var(--cta-fg)] text-center py-4 rounded-full font-bold transition-transform active:scale-95 hover:opacity-90">
                    Pre-order · Ships in 30 days
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="grid grid-cols-3 gap-3">
             {['FAQ', 'Roadmap', 'Refunds'].map(btn => (
                <button key={btn} className="py-3 rounded-full border border-[var(--border-2)] bg-[var(--surface-2)] text-xs font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                    {btn}
                </button>
             ))}
          </div>

          <button className="w-full py-4 rounded-full border border-[var(--border-2)] bg-[var(--surface-2)] flex items-center justify-center gap-2 text-sm font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all">
            <Wrench className="w-4 h-4" /> DIY Open Source Version <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div id="faq" className="py-16 md:py-32 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[var(--text-faint)] text-sm font-medium uppercase tracking-widest mb-2 block">FAQ</span>
          <h2 className="text-4xl font-semibold text-[var(--text-primary)]">Questions & answers</h2>
        </div>

        <div className="divide-y divide-[var(--border-1)]">
          {faqData.map((item, index) => (
            <div key={index} className="py-4">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className="text-lg font-medium text-[var(--text-primary)] group-hover:opacity-70 transition-opacity">
                  {item.q}
                </span>
                <Plus className={`w-6 h-6 text-[var(--text-muted)] transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-[var(--text-tertiary)] leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTabbie;