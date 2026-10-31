import React from 'react';
import { ThemeMode } from '../data/barbershopData';

interface BrandLogoProps {
  size?: 'default' | 'lg';
  theme?: ThemeMode;
  className?: string;
}

/** Official Classic Cut identity: intertwined CC monogram + diamond detail. */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'default',
  theme = 'dark',
  className = '',
}) => {
  const isLarge = size === 'lg';
  const isLight = theme === 'light';

  return (
    <a
      href="#top"
      aria-label="Classic Cut Salon — Back to top"
      className={`group inline-flex items-center shrink-0 select-none focus-ring ${
        isLarge ? 'gap-3' : 'gap-2.5'
      } ${className}`}
    >
      <img
        src="/assets/brand/classic-cut-icon-cropped.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        style={{
          filter: isLight
            ? 'brightness(0) saturate(100%) invert(37%) sepia(64%) saturate(1010%) hue-rotate(359deg) brightness(86%) contrast(91%)'
            : 'none',
        }}
        className={`shrink-0 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
          isLarge ? 'h-[46px] w-[43px]' : 'h-8 w-[30px] md:h-[38px] md:w-[35px]'
        }`}
      />

      <span className="flex min-w-0 flex-col justify-center">
        <span className="flex items-baseline whitespace-nowrap leading-none">
          <span
            className={`font-display font-medium uppercase tracking-[0.025em] ${
              isLight ? 'text-[#20150F]' : 'text-[#FFF8ED]'
            } ${isLarge ? 'text-[24px] sm:text-[27px]' : 'text-[16px] md:text-[21px]'}`}
          >
            Classic
          </span>
          <span
            className={`ml-[0.28em] font-display font-medium uppercase tracking-[0.025em] ${
              isLight ? 'text-[#8F5A1A]' : 'text-[#E5B96F]'
            } ${isLarge ? 'text-[24px] sm:text-[27px]' : 'text-[16px] md:text-[21px]'}`}
          >
            Cut
          </span>
        </span>

        <span className="mt-1 flex items-center justify-center gap-1.5">
          <span
            className={`h-px w-5 ${
              isLight ? 'bg-gradient-to-r from-transparent to-[#A96F1E]' : 'bg-gradient-to-r from-transparent to-[#E5B96F]'
            }`}
          />
          <span
            className={`font-sans text-[7px] md:text-[8px] font-medium uppercase tracking-[0.52em] leading-none ${
              isLight ? 'text-[#6A5040]' : 'text-[#D8CBBB]'
            }`}
          >
            Salon
          </span>
          <span
            className={`h-px w-5 ${
              isLight ? 'bg-gradient-to-r from-[#A96F1E] to-transparent' : 'bg-gradient-to-r from-[#E5B96F] to-transparent'
            }`}
          />
        </span>
      </span>
    </a>
  );
};
