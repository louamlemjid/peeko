
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Adjust paths to your components
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Any other paths where you use Tailwind classes
  ],
  theme: {
    extend: {
      // colors: {
      //   // Define your custom colors using the CSS variables
      //   'primary-color': 'var(--primary-color)',
      //   'accent-color': 'var(--accent-color)',
      //   'background-color': 'var(--background)', // You might want these too
      //   'foreground-color': 'var(--foreground)',
      //   'primary' : 'var(--primary)'
      // },
      // If you're using Geist fonts or similar, configure them here:
      fontFamily: {
        // Ensure --font-geist-sans and --font-geist-mono are defined elsewhere (e.g., in _app.tsx or layout.tsx using Next.js fonts)
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      // Add other extensions like animation for your hero section
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // --- START Added for Navbar Mobile Menu ---
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
        // --- END Added for Navbar Mobile Menu ---
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.7s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        // --- START Added for Navbar Mobile Menu ---
        'slide-down': 'slide-down 0.3s ease-out forwards',
        // --- END Added for Navbar Mobile Menu ---
      },
    },
  },
  darkMode: 'class',
};