import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, ArrowRight, Sun, Moon } from 'lucide-react';
import { BUSINESS_INFO, ThemeMode } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenBlueprintInspector?: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#top', active: true },
  { label: 'Services', href: '#services', active: false },
  { label: 'Products', href: '#products', active: false },
  { label: 'Our Barbers', href: '#barbers', active: false },
  { label: 'The Shop', href: '#gallery', active: false },
  { label: 'Contact', href: '#contact', active: false },
];

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const isLight = theme === 'light';
  // In the Hero section (before scrolling), keep the navbar 100% transparent with light/gold foreground.
  // As soon as the user scrolls, transition to the crisp white navbar background with dark/gold foreground.
  const useLightSurface = isScrolled;

  useEffect(() => {
    let frameId = 0;
    let lastScrolled = window.scrollY > 24;
    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 24;
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setIsScrolled(nextScrolled);
        }
        frameId = 0;
      });
    };
    setIsScrolled(lastScrolled);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => firstMobileLinkRef.current?.focus(), 50);
      }
      return next;
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ${
        !isScrolled
          ? 'bg-transparent border-b border-transparent shadow-none'
          : 'bg-white/[0.98] border-b border-[#C28B37]/25 shadow-[0_4px_18px_rgba(20,14,10,0.1)]'
      }`}
    >
      <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-8 lg:px-12 py-2 sm:py-2.5">
        {/* Zone 1: Redesigned Luxury Barber Crest & Wordmark */}
        <BrandLogo theme={useLightSurface ? 'light' : 'dark'} />

        {/* Zone 2: Center Navigation Links */}
        <nav
          aria-label="Primary section navigation"
          className="hidden md:flex items-center gap-7 lg:gap-9 text-[12.5px] font-medium tracking-[0.04em]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 focus-ring ${
                link.active
                  ? useLightSurface
                    ? 'text-[#B87314] font-semibold'
                    : 'text-[#E5B96F] font-semibold'
                  : useLightSurface
                  ? 'text-[#1A130E]/85 hover:text-[#B87314]'
                  : 'text-[#F7F1E8]/85 hover:text-[#E5B96F]'
              }`}
            >
              {link.label}
              {link.active && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                    useLightSurface ? 'bg-[#B87314]' : 'bg-[#E5B96F]'
                  }`}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Zone 3: Theme Switcher (Light / Dark) + Book Now Pill CTA + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Interactive Light / Dark Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            title={isLight ? 'Switch to Dark Studio theme' : 'Switch to Warm Light theme'}
            className={`inline-flex items-center justify-center gap-1.5 w-9 h-9 lg:w-auto lg:px-3.5 rounded-full border text-xs font-medium tracking-[0.04em] transition-all cursor-pointer focus-ring ${
              useLightSurface
                ? 'border-[#C28B37]/50 bg-[#F2EAE0] text-[#1A130E] hover:bg-[#E6D9C6]'
                : 'border-[#DFAF63]/50 bg-[#120E0B]/60 text-[#F7F1E8] hover:border-[#E5B96F] hover:text-[#E5B96F]'
            }`}
          >
            {isLight ? (
              <>
                <Moon className={`w-4 h-4 shrink-0 ${useLightSurface ? 'text-[#9A6519]' : 'text-[#E5B96F]'}`} />
                <span className="hidden lg:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className={`w-4 h-4 shrink-0 ${useLightSurface ? 'text-[#9A6519]' : 'text-[#E5B96F]'}`} />
                <span className="hidden lg:inline">Light</span>
              </>
            )}
          </button>

          <a
            href={BUSINESS_INFO.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full border text-xs font-semibold tracking-[0.06em] transition-all group focus-ring ${
              useLightSurface
                ? 'border-[#B87314] bg-[#1A130E] text-[#FAF6EE] hover:bg-[#B87314] hover:text-[#0C0907] shadow-[0_4px_16px_rgba(26,19,14,0.15)]'
                : 'border-[#DFAF63]/60 bg-[#120E0B]/60 hover:bg-[#DFAF63] text-[#F7F1E8] hover:text-[#0C0907] shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            <Calendar
              className={`w-3.5 h-3.5 transition-colors ${
                useLightSurface
                  ? 'text-[#E5B96F] group-hover:text-[#0C0907]'
                  : 'text-[#DFAF63] group-hover:text-[#0C0907]'
              }`}
            />
            <span>Book Now</span>
            <ArrowRight
              className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all ${
                useLightSurface
                  ? 'text-[#E5B96F] group-hover:text-[#0C0907]'
                  : 'text-[#DFAF63] group-hover:text-[#0C0907]'
              }`}
            />
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={handleToggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors cursor-pointer focus-ring ${
              useLightSurface
                ? 'border-[#C28B37]/50 bg-[#F2EAE0] text-[#1A130E] hover:bg-[#E6D9C6]'
                : 'border-[#DFAF63]/50 bg-[#120E0B]/60 text-[#F7F1E8] hover:border-[#E5B96F] hover:text-[#E5B96F]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile section navigation"
          className={`md:hidden border-b px-5 pt-3 pb-6 shadow-2xl ${
            isLight
              ? 'bg-[#FAF6EE]/98 border-[#C28B37]/35 text-[#1A130E]'
              : 'bg-[#120E0B]/98 border-[#DFAF63]/40 text-[#F7F1E8]'
          }`}
        >
          <ul className="flex flex-col space-y-1">
            {NAV_LINKS.map((link, idx) => (
              <li key={link.label}>
                <a
                  ref={idx === 0 ? firstMobileLinkRef : undefined}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between min-h-[44px] px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus-ring ${
                    isLight
                      ? 'text-[#1A130E] hover:bg-[#EFE6D5] hover:text-[#B87314]'
                      : 'text-[#F7F1E8] hover:bg-[#1E1612] hover:text-[#E5B96F]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[#C28B37] text-xs font-mono">0{idx + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-[#C28B37]/20 flex flex-col sm:flex-row gap-2.5">
            <a
              href={BUSINESS_INFO.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] bg-gradient-to-r from-[#E8C27A] to-[#C89643] text-[#0C0907] rounded-full transition-colors whitespace-nowrap focus-ring"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Your Chair</span>
            </a>
            <a
              href={BUSINESS_INFO.phoneHref}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] border rounded-full transition-colors whitespace-nowrap focus-ring ${
                isLight
                  ? 'border-[#1A130E]/40 text-[#1A130E]'
                  : 'border-[#DFAF63]/60 text-[#F7F1E8]'
              }`}
            >
              Call {BUSINESS_INFO.phoneDisplay}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
