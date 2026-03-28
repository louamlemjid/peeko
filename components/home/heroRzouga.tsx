'use client';

import React,{useEffect,useState} from 'react';
import { AlignVerticalJustifyStart, CalendarDays, ShoppingCart } from 'lucide-react';
import LottieAnimation from '@/components/home/LottieAnimation';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
const primaryDarkBlue = '#1d232f'// '#00B7B5';

// Animation variants for text content
const textVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    y:20,
    transition: { duration: 0.8, ease: 'easeIn' },
  },
};
// Animation variants for Lottie animation
const lottieVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 },
  },
};

// Animation variants for button
const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: -60,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.5 },
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const HeroRzouga = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById('navbar'); // Replace with your navbar's ID or selector
      if (navbar) {
        const height = navbar.getBoundingClientRect().height;
        console.log('Navbar height:', height);
        setNavbarHeight(height);
      }
      console.log('Navbar height updated:', navbarHeight);
    };

    updateNavbarHeight(); // Initial height
    
  }, [navbarHeight]);
  return (
    <section
      className={`overflow-hidden text-foreground flex flex-col justify-center h-[80vh] bg-radial from-[#00B7B5] from-0% to-background to-65%`}
      
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* LEFT COLUMN: Text Content */}
        <motion.div
          className="flex flex-col justify-center text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-extrabold leading-tight drop-shadow-md mb-3"
            variants={textVariants}
          >
          <p className="text-5xl mb-6">Meet Peeko </p> 
            Your smart productivity companion.
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg mt-3 max-w-md opacity-90 drop-shadow-sm mx-auto md:mx-0"
            variants={textVariants}
            transition={{ delay: 0.2 }}
          >
         
        Cute, intelligent, and ready to assist. — one click away.
            
          </motion.p>
        </motion.div>

        {/* RIGHT COLUMN: Lottie Animation */}
        <motion.div
          className="flex justify-center items-center"
          initial="hidden"
          animate="visible"
          variants={lottieVariants}
        >
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
            <LottieAnimation />
          </div>
        </motion.div>
      </div>

      {/* Button Section - Now below the main grid content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-center gap-4">
        <motion.button
          onClick={()=>router.push("/user")}
          className="inline-flex items-center justify-center bg-foreground font-extrabold 
            py-2 px-4 text-base sm:py-2.5 sm:px-5 sm:text-base md:py-2.5 md:px-6 md:text-lg lg:text-xl 
            rounded-lg shadow-xl  transition-all duration-300 
            transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white 
            focus:ring-opacity-75 group w-3/4 sm:w-auto text-background"
          
          aria-label="Réservez votre contrôle technique"
          type="button"
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <AlignVerticalJustifyStart 
            className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5 text-background" 
            
          />
          Check Peeko
        </motion.button>
          <motion.button
          onClick={()=>router.push('https://robotxwebsite3.vercel.app/produits/69c7966437ec61ccbc86a63b')}
          className="inline-flex items-center justify-center text-foreground font-extrabold 
            py-2 px-4 text-base sm:py-2.5 sm:px-5 sm:text-base md:py-2.5 md:px-6 md:text-lg lg:text-xl 
            rounded-lg shadow-xl hover:backdrop-blur-none transition-all duration-300 
            transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white 
            focus:ring-opacity-75 group w-3/4 sm:w-auto backdrop-blur-md border-2 border-foreground"
          
          aria-label="Réservez votre contrôle technique"
          type="button"
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ShoppingCart 
            className="mr-2 h-4 w-4 sm:mr-2.5 sm:h-5 sm:w-5" 
            
          />
          Pre-Order
        </motion.button>
      </div>
    </section>
  );
};

export default HeroRzouga;
