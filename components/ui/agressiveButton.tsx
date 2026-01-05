// components/AggressiveButton.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AggressiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function AggressiveButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: AggressiveButtonProps) {
  const baseStyles = 'font-bold tracking-wider uppercase transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-6 text-lg',
  };

  const variantStyles = {
    primary:
      'bg-black text-[#00ff7b] border-2 border-[#00ff7b] shadow-lg shadow-[#00ff7b]/30 hover:bg-[#00ff7b] hover:text-black hover:shadow-[#00ff7b]/50 hover:border-[#00ff7b]',
    outline:
      'bg-transparent text-[#00ff7b] border-2 border-[#00ff7b] hover:bg-[#00ff7b] hover:text-black hover:shadow-lg hover:shadow-[#00ff7b]/40',
    ghost:
      'bg-transparent text-[#00ff7b] border-2 border-transparent hover:bg-[#00ff7b]/10 hover:border-[#00ff7b] hover:shadow-md',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} 
                 relative overflow-hidden 
                 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff7b]/20 before:to-transparent 
                 before:-translate-x-full before:transition-transform before:duration-700 
                 hover:before:translate-x-full`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}