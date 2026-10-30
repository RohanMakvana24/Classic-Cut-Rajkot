import React from 'react';
import {
  Phone,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  HeroCropConfig,
} from '../data/barbershopData';

interface HeroSectionProps {
  cropConfig: HeroCropConfig;
  customCutoutUrl?: string | null;
  onOpenInspector: (tab?: 'layers' | 'tokens' | 'docs') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section
      id="top"
      aria-label="Classic Cut Salon Rajkot Hero"
      className="relative min-h-[92vh] xl:min-h-screen w-full overflow-hidden bg-[#080605] border-b border-[#D9A34B]/25 flex items-center"
    >
      {/* LAYER 1: First Uploaded Image (/assets/aistudio/image_5ddfe75b.png) as Full-Bleed Hero Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/aistudio/image_5ddfe75b.png"
          alt="Classic Cut Salon Rajkot luxury interior with barber standing behind classic black and gold barber chair"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
        />

        {/* Subtle Left-Side Dark Gradient Vignette so Left Typography has studio-grade contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#070504]/92 via-[#070504]/58 to-transparent sm:via-[#070504]/42"
        />
        {/* Top & Bottom subtle cinematic vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#070504]/65 via-transparent to-[#070504]/80"
        />
      </div>

      {/* LAYER 2: Foreground Hero Content */}
      <div className="relative z-10 w-full pt-28 pb-14 sm:pt-32 sm:pb-20 lg:py-28">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
          {/* Left-Aligned Hero Content Column matching Image 2 */}
          <div className="max-w-[650px] flex flex-col items-start text-left">
            {/* 1. Location & Google Rating Row */}
            <div className="inline-flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-[13px] text-[#E8E2D9]/90 mb-5">
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#E5B96F] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#E5B96F] fill-[#E5B96F]/20 shrink-0" />
                <span className="font-medium">
                  Pedak Road, Arya Nagar, {BUSINESS_INFO.locality}, {BUSINESS_INFO.region}
                </span>
              </a>

              <span aria-hidden="true" className="hidden sm:inline-block h-3.5 w-[1px] bg-[#E8E2D9]/25" />

              <a
                href={BUSINESS_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#E5B96F] transition-colors"
              >
                <Star className="w-4 h-4 text-[#E5B96F] fill-[#E5B96F] shrink-0" />
                <span>
                  <strong className="text-[#FFFFFF] font-semibold">4.9</strong>{' '}
                  <span className="text-[#C9B8A6]">({BUSINESS_INFO.googleSnapshot.reviewCount}+ reviews)</span>
                </span>
              </a>
            </div>

            {/* 2. Wide-Tracked Uppercase Kicker: PREMIUM SALON · RAJKOT */}
            <p className="text-[10px] sm:text-[13px] font-medium uppercase tracking-[0.32em] sm:tracking-[0.42em] text-[#DED6C8] mb-2 sm:mb-3">
              CLASSIC CUT SALON · RAJKOT
            </p>

            {/* 3. 3D Extruded / Beveled Headline ("SHARPER / EVERYDAY") + Overlapping Gold Script ("Look Good") */}
            <div
              style={{ transform: 'rotate(-2.2deg)' }}
              className="relative my-1 sm:my-2 select-none max-w-full"
            >
              <h1 className="flex flex-col items-start leading-[0.92]">
                <span className="text-3d-sharper text-[2.85rem] sm:text-[5.1rem] md:text-[6.1rem] lg:text-[6.6rem] tracking-[-0.02em]">
                  SHARPER
                </span>
                <span className="text-3d-everyday text-[2.7rem] sm:text-[4.8rem] md:text-[5.7rem] lg:text-[6.2rem] tracking-[-0.02em] mt-0.5">
                  EVERYDAY
                </span>
              </h1>

              {/* Cursive Gold Signature Script overlapping the bottom-right of EVERYDAY */}
              <span
                aria-hidden="true"
                className="font-script-lookgood block text-[2.35rem] sm:text-[3.9rem] md:text-[4.5rem] leading-none -mt-4 sm:-mt-8 ml-20 sm:ml-48 md:ml-56 rotate-[-3deg]"
              >
                Look Good
              </span>
            </div>

            {/* 4. Two-Line Value Proposition Copy */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-[16px] text-[#E6E0D6]/90 leading-relaxed max-w-md font-normal">
              Precision cuts. Classic styles. Modern looks.
              <br />
              Your style, our expertise.
            </p>

            {/* 5. Dual Pill CTA Buttons ("Book Your Chair ->" & "Call the Shop") */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <a
                href={BUSINESS_INFO.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#EDD08D] via-[#DBA958] to-[#C28B37] hover:from-[#F5DC9C] hover:to-[#CF9640] text-[#0E0A07] font-semibold text-sm sm:text-[15px] px-7 py-3.5 sm:px-8 sm:py-4 shadow-[0_10px_28px_rgba(219,169,88,0.32)] transition-all cursor-pointer group focus-ring"
              >
                <Calendar className="w-4 h-4 text-[#0E0A07] stroke-[2.2]" />
                <span>Book Your Chair</span>
                <ArrowRight className="w-4 h-4 text-[#0E0A07] group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={BUSINESS_INFO.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#E6E0D6]/35 hover:border-[#E5B96F] bg-[#120E0B]/75 hover:bg-[#1B1410]/90 text-[#F7F1E8] font-medium text-sm sm:text-[15px] px-7 py-3.5 sm:px-8 sm:py-4 backdrop-blur-sm transition-all cursor-pointer focus-ring"
              >
                <Phone className="w-4 h-4 text-[#E5B96F]" />
                <span>Call the Shop</span>
              </a>
            </div>

            {/* 6. Bottom 3 Feature Highlight Items — 3-col Grid on Mobile, Flex with Dividers on sm+ */}
            <div className="mt-9 sm:mt-12 pt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-7 w-full sm:w-auto">
              {/* Feature 1: Precision Haircuts */}
              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  className="text-[#E5B96F] shrink-0 sm:w-7 sm:h-7"
                >
                  <line x1="7" y1="24" x2="25" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="25" y1="24" x2="7" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="7.5" cy="25.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="24.5" cy="25.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <div className="text-[11px] sm:text-[13px] leading-snug text-[#E8E2D9]">
                  <div className="font-medium">Precision</div>
                  <div className="text-[#C9B8A6]">Haircuts</div>
                </div>
              </div>

              <span aria-hidden="true" className="hidden sm:block h-8 w-[1px] bg-[#E8E2D9]/18" />

              {/* Feature 2: Beard Grooming */}
              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  className="text-[#E5B96F] shrink-0 sm:w-7 sm:h-7"
                >
                  <path
                    d="M9 12 C9 8, 12 6, 16 6 C20 6, 23 8, 23 12 L23 16 C23 22, 19.5 26, 16 27 C12.5 26, 9 22, 9 16 Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M11 17 Q16 15 21 17 M12 20 Q16 22 20 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-[11px] sm:text-[13px] leading-snug text-[#E8E2D9]">
                  <div className="font-medium">Beard</div>
                  <div className="text-[#C9B8A6]">Grooming</div>
                </div>
              </div>

              <span aria-hidden="true" className="hidden sm:block h-8 w-[1px] bg-[#E8E2D9]/18" />

              {/* Feature 3: Premium Products */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B96F] stroke-[1.6] shrink-0" />
                <div className="text-[11px] sm:text-[13px] leading-snug text-[#E8E2D9]">
                  <div className="font-medium">Premium</div>
                  <div className="text-[#C9B8A6]">Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right-Side Vertical SCROLL Indicator matching Image 2 */}
        <a
          href="#services"
          aria-label="Scroll down to services"
          className="hidden lg:flex flex-col items-center gap-3 absolute right-6 xl:right-8 bottom-8 z-20 text-[#E8E2D9]/75 hover:text-[#E5B96F] transition-colors"
        >
          <span className="h-10 w-[1px] bg-gradient-to-b from-transparent via-[#E8E2D9]/45 to-[#E5B96F]" />
          <span
            style={{ writingMode: 'vertical-rl' }}
            className="font-mono text-[10px] uppercase tracking-[0.28em] rotate-180"
          >
            SCROLL
          </span>
          <div className="w-5 h-9 rounded-full border border-[#E8E2D9]/55 flex flex-col items-center justify-center gap-1.5 py-1.5">
            <span className="w-1 h-1 rounded-full bg-[#E5B96F] animate-bounce" />
            <span className="w-1 h-1 rounded-full bg-[#E8E2D9]/50" />
          </div>
        </a>
      </div>
    </section>
  );
};
