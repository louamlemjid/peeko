// components/Slider.tsx (or page.tsx if using directly as a page)

'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AnimationCard from './animationCard';


interface Animation {
  id: number;
  name: string;
  gifUrl: string;
}

const animations: Animation[] = [
  {
    id: 1,
    name: 'Confetti Burst',
    gifUrl: '/1.gif', // Replace with real URLs
  },
  {
    id: 2,
    name: 'Loading Spinner',
    gifUrl: '/2.gif',
  },
  {
    id: 3,
    name: 'Success Check',
    gifUrl: '/3.gif',
  }
];

export default function Slider() {
  return (
    <section className="py-12 px-4 bg-background">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-200">
        Choose an Animation
      </h2>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={30}
        navigation={true} // Enables prev/next arrows
        pagination={{ clickable: true }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
        className="animations-swiper max-w-7xl mx-auto"
      >
        {animations.map((anim) => (
          <SwiperSlide key={anim.id}>
            <div className="px-2">
              <AnimationCard
                gifUrl={anim.gifUrl}
                name={anim.name}
                onUse={() => console.log(`Selected: ${anim.name}`)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}