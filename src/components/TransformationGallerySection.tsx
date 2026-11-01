import { lazy, Suspense, useRef } from 'react';
import { Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { useElementInView, useTheme } from '../hooks/useActivity';
import { GallerySkeleton } from './ui/gallery-skeleton';
import { RisingInk } from './ui/rising-ink';

const InfiniteMenu = lazy(() => import('./ui/InfiniteMenu'));

const GALLERY_ITEMS = [
  { image: '/assets/hairstyles/textured-crop.webp', title: 'Textured Crop', description: 'Choppy texture with a clean low fade.' },
  { image: '/assets/hairstyles/modern-quiff.webp', title: 'Modern Quiff', description: 'Lifted volume with neatly tapered sides.' },
  { image: '/assets/hairstyles/classic-side-part.webp', title: 'Classic Side Part', description: 'A clean part with a polished finish.' },
  { image: '/assets/hairstyles/curly-taper-ai.webp', title: 'Curly Taper', description: 'Defined natural curls with a soft temple taper.' },
  { image: '/assets/hairstyles/buzz-fade-ai.webp', title: 'Buzz Fade', description: 'A sharp buzz cut with a smooth skin fade.' },
  { image: '/assets/hairstyles/slick-back-ai.webp', title: 'Slick Back', description: 'Swept-back length with a crisp undercut.' },
  { image: '/assets/hairstyles/wavy-flow-ai.webp', title: 'Wavy Flow', description: 'Natural movement with medium-length layers.' },
  { image: '/assets/hairstyles/french-crop-ai.webp', title: 'French Crop', description: 'A blunt fringe with a clean high fade.' },
  { image: '/assets/hairstyles/modern-mullet-ai.webp', title: 'Modern Mullet', description: 'Textured layers with a subtle burst fade.' },
];

export const TransformationGallerySection = () => {
  const theme = useTheme();
  const stageRef = useRef<HTMLDivElement>(null);
  const nearby = useElementInView(stageRef, { once: true, rootMargin: '240px' });
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

      <div ref={stageRef} className="gallery-immersive-stage relative h-[520px] sm:h-[660px]">
        {nearby ? <Suspense fallback={<GallerySkeleton />}><InfiniteMenu items={GALLERY_ITEMS} count={160} tileSize={0.63} roundness={0.2}
          zoom={1.65} pullBack={1} stretch={0.6} inertia={0.6} autoplay={3}
          grayscale dim={0.5} intro showInfo theme={theme} accentColor={theme === 'light' ? '#2D2118' : '#E5B96F'} /></Suspense> : <GallerySkeleton />}
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
