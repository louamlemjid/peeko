'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const primaryDarkBlue = '#00B7B5';

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroSection = document.querySelector('#hero-section');
    if (!heroSection) {
      console.log('ScrollUpButton: No element with id="hero-section" found. Using fallback threshold of 300px.');
    }

    const heroSectionHeight = heroSection ? heroSection.getBoundingClientRect().height : 300;

    //console.log('ScrollUpButton: Hero section height:', heroSectionHeight);

    const toggleVisibility = () => {
      const scrollY = window.scrollY;
      //console.log('ScrollUpButton: Current scrollY:', scrollY, 'Threshold:', heroSectionHeight);
      if (scrollY > heroSectionHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', toggleVisibility);
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[1000]"
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={buttonVariants}
    >
      <button
        onClick={scrollToTop}
        className="inline-flex items-center justify-center bg-foreground font-extrabold 
          p-3 rounded-full shadow-xl  transition-all duration-300 
          focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
        style={{ color: primaryDarkBlue }}
        aria-label="Retourner en haut de la page"
        type="button"
      >
        <ArrowUp className="h-6 w-6" style={{ color: primaryDarkBlue }} />
      </button>
    </motion.div>
  );
};

export default ScrollUpButton;