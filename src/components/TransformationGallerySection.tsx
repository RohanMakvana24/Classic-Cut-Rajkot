import { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import InfiniteMenu from './ui/InfiniteMenu';
import { RisingInk } from './ui/rising-ink';

const GALLERY_ITEMS = [
  { image: '/assets/hairstyles/textured-crop.webp', title: 'Textured Crop', description: 'Choppy texture with a clean low fade.' },
  { image: '/assets/hairstyles/modern-quiff.webp', title: 'Modern Quiff', description: 'Lifted volume with neatly tapered sides.' },
  { image: '/assets/hairstyles/classic-side-part.webp', title: 'Classic Side Part', description: 'A clean part with a polished finish.' },
];

export const TransformationGallerySection = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return (
  <section id="gallery" aria-labelledby="gallery-heading" className="relative overflow-hidden border-b border-[#DFAF63]/15 bg-[#0C0907] py-20 sm:py-28">
    <div className="relative w-full">
      <div className="mx-auto mb-4 max-w-2xl px-5 text-center sm:mb-6">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[#E5B96F]">
          Style inspiration · Rajkot
        </p>
        <RisingInk
          as="h2"
          id="gallery-heading"
          text="THE CUT IN MOTION"
          color={theme === 'light' ? '#2D2118' : '#F7F1E8'}
          colors={theme === 'light' ? ['#A17438', '#6B451F'] : ['#F4CC82', '#8B541A']}
          lift={0.48}
          radius={1.5}
          className="font-display text-4xl leading-none sm:text-5xl md:text-[3.5rem]"
        />
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#C9B8A6] sm:text-base">
          Explore your next look. AI-generated hairstyle inspiration.
        </p>
      </div>

      <div className="gallery-immersive-stage relative h-[520px] sm:h-[660px]">
        <InfiniteMenu items={GALLERY_ITEMS} count={160} tileSize={0.63} roundness={0.2}
          zoom={1.65} pullBack={1} stretch={0.6} inertia={0.6} autoplay={3}
          grayscale dim={0.5} intro showInfo theme={theme} accentColor={theme === 'light' ? '#2D2118' : '#E5B96F'} />
      </div>

      <div className="mt-9 flex justify-center">
        <a
          href={BUSINESS_INFO.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="gallery-instagram focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em]"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />
          See more on Instagram
        </a>
      </div>
    </div>
  </section>
  );
};
