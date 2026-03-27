'use client';

import Lottie from 'lottie-react';
import animationData from '@/public/Phoenix.json';

const LottieAnimation = () => {
  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-2xl">
      <Lottie
        animationData={animationData}
        loop={true}
        // CORRECTED LINE: Set width to '100%'
        style={{ width: '100%', height: 'auto' } as React.CSSProperties}
      />
    </div>
  );
};

export default LottieAnimation;