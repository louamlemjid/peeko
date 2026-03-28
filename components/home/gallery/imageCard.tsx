//components/home/gallery/imageCard.tsx
import Image from 'next/image';

interface ImageCardProps {
  imagePath: string;
  alt?: string;
}

export default function ImageCard({ imagePath, alt = "Card image" }: ImageCardProps) {


  return (
   <div className="group relative overflow-hidden rounded-lg  bg-white shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg active:scale-[0.985]">
  <div className="relative w-full h-[38rem] sm:h-[28rem] md:h-[32rem] lg:h-[36rem] overflow-hidden">
    <Image
      src={imagePath}
      alt={alt}
      fill
      className="object-cover transition-all duration-500 group-hover:scale-105"
      sizes="100vw"
      priority={false}
    />
  </div>
</div>
  );
}