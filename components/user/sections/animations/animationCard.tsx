// components/AnimationCard.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust path if your Button is elsewhere
import Image from 'next/image';

interface AnimationCardProps {
  /** URL of the .gif animation */
  gifUrl: string;
  /** Name/title of the animation */
  name: string;
  /** Optional callback when "Use this animation" is clicked */
  onUse?: () => void;
}

const AnimationCard: React.FC<AnimationCardProps> = ({
  gifUrl,
  name,
  onUse,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* GIF Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Image
          src={gifUrl}
          alt={name}
          fill
          className="object-contain object-center"
          unoptimized // Important for .gif files to preserve animation
        />
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          {name}
        </h3>

        <Button
          size="lg"
          className="w-full"
          onClick={onUse}
        >
          Use this animation
        </Button>
      </div>

      {/* Optional subtle overlay on hover */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300" />
    </div>
  );
};

export default AnimationCard;