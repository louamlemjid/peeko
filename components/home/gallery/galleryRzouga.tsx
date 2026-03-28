//components/home/gallery/galleryRzouga.tsx
import ImageCard from './imageCard';
import fs from 'fs';
import path from 'path';

export default function GalleryRzouga() {
  // Read images from the gallery directory (your logic)
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
//   console.log(galleryDir)
  let imageFiles: string[] = [];

  if (fs.existsSync(galleryDir)) {
    imageFiles = fs.readdirSync(galleryDir).filter((file) =>
      /\.(png|jpe?g|gif|webp)$/i.test(file)
    );
  }
// console.log(imageFiles)
  // Sort alphabetically for consistent order
  imageFiles.sort();

  const images = imageFiles.map((fileName) => ({
    src: `/gallery/${fileName}`,
    alt: fileName
      .replace(/\.(png|jpe?g|gif|webp)$/i, '')
      .replace(/-/g, ' ')
      .replace(/_/g, ' '),
  }));

  return (
    <section className="mx-4 sm:mx-8 md:mx-60 mt-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Gallery</h1>
        
      </div>

      {images.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">
            No images found in <code>public/gallery/</code>.<br />
            Add .png, .jpg, .jpeg, .webp or .gif files and restart the dev server.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <ImageCard 
              key={index} 
              imagePath={image.src} 
              alt={image.alt}
            />
          ))}
        </div>
      )}
    </section>
  );
}