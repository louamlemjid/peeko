'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'My Orders', href: '/userOrders' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          
            <Link href="/" className="flex items-center gap-2 ">
              <div className="relative w-32 aspect-[3/1] "> 
        <Image
          src="/logo.png"
              alt="Logo"
              fill
              className="object-contain block dark:hidden md:ml-4"
             />
                 <Image
              src="/white-logo.png"
          alt="Logo"
             fill
             className="object-contain hidden dark:block md:ml-4"
        />
          </div>
            </Link>

          {/* Desktop Nav */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden md:flex items-center gap-8"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/cart"
              className="text-muted-foreground hover:text-gold transition-colors duration-200"
              aria-label="View cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* <ThemeToggle /> */}

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  variant='outline'
                  className=""
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-gold transition-colors duration-200 py-2"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="w-4 h-4" /> Cart
              </Link>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    variant='outline'
                    className=""
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="mt-4">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}