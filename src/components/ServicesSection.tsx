import { SkeletonImage } from './ui/skeleton-image';
import React, { useState } from 'react';
import {
  Shield,
  ArrowUpRight,
  PhoneCall,
  Calendar,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  SERVICE_ITEMS,
  ServiceCategoryFilter,
  filterServicesByCategory,
} from '../data/barbershopData';
import './ServicesSection.css';
import { SalonServiceIcon } from './SalonServiceIcon';

const CATEGORY_TABS: { id: ServiceCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Services (6)' },
  { id: 'haircuts', label: 'Haircuts & Fades' },
  { id: 'beard', label: 'Beard & Grooming' },
  { id: 'specialty', label: 'Kids & Groom Packages' },
];

const SERVICE_VISUALS: Record<string, { image: string; alt: string; title: string; detail: string; tags: string[]; word: string }> = {
  'classic-modern-haircuts': { image: 'haircut', alt: '3D man showing a freshly styled textured quiff', title: 'Haircuts & Restyling', detail: 'A cut shaped around your face, your texture and your everyday style.', tags: ['Scissor craft', 'Styled finish'], word: 'FRESH' },
  'skin-taper-fades': { image: 'fade', alt: '3D man showing a clean skin fade and textured top', title: 'Fades & Tapers', detail: 'Seamless blends, crisp edges and a fade that looks sharp from every angle.', tags: ['Skin fade', 'Clean lineup'], word: 'SHARP' },
  'beard-trim-grooming': { image: 'beard', alt: '3D man with a sculpted beard holding a beard comb', title: 'Beard & Royal Shave', detail: 'A balanced beard, a precise lineup and a little hot-towel luxury.', tags: ['Beard sculpt', 'Hot towel'], word: 'REFINED' },
  'haircut-beard-combo': { image: 'combo', alt: '3D man with a coordinated fresh haircut and shaped beard', title: 'The Complete Look', detail: 'Haircut, fade and beard detailing, brought together in one fresh session.', tags: ['Cut + beard', 'Full refresh'], word: 'COMPLETE' },
  'kids-family-cuts': { image: 'kids', alt: 'Cheerful 3D boy with a neat short haircut giving a thumbs up', title: 'Little Legends', detail: 'Patient hands, happy faces and school-ready styles for our younger guests.', tags: ['Kids & teens', 'Gentle styling'], word: 'HAPPY' },
  'consultation-lineup': { image: 'facial', alt: '3D man enjoying a charcoal facial treatment and holding a towel', title: 'Skin & Groom Rituals', detail: 'De-tan, charcoal facials and thoughtful grooming for your next big moment.', tags: ['Skin refresh', 'Groom prep'], word: 'GLOW' },
};

export const ServicesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryFilter>('all');
  const [activeCard, setActiveCard] = useState(0);
  const deckRef = React.useRef<HTMLDivElement>(null);
  const dragX = React.useRef(0);
  const dragFrame = React.useRef(0);
  React.useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);
  const paintDrag = () => {
    dragFrame.current = 0;
    const deck = deckRef.current; if (!deck) return;
    deck.dataset.dragging = String(dragX.current !== 0);
    deck.style.setProperty('--deck-drag', `${dragX.current}px`);
    deck.style.setProperty('--deck-drag-tilt', `${dragX.current / 35}deg`);
  };
  const resetDrag = () => { cancelAnimationFrame(dragFrame.current); dragX.current = 0; paintDrag(); touchStart.current = null; };
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);
  const didSwipe = React.useRef(false);
  const visibleServices = filterServicesByCategory(SERVICE_ITEMS, selectedCategory);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-[#0C0907] py-20 md:py-28 border-b border-[#DFAF63]/15 overflow-hidden"
    >
      {/* Subtle Ambient Gold Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 hidden md:block -translate-x-1/2 w-[900px] h-[380px] rounded-full bg-[#DFAF63]/[0.06] blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Section Header + Category Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="h-[1px] w-7 bg-[#E5B96F]" />
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#E5B96F]">
                CRAFT &amp; GROOMING MENU · RAJKOT, GUJARAT
              </p>
            </div>
            <h2
              id="services-heading"
              className="font-display uppercase text-4xl sm:text-5xl md:text-[3.5rem] text-[#F7F1E8] tracking-[-0.01em] leading-none"
            >
              OUR{' '}
              <span className="bg-gradient-to-b from-[#FFF2C6] via-[#E5B96F] to-[#C28B37] bg-clip-text text-transparent">
                SERVICES
              </span>
            </h2>
          </div>

          <div className="hidden md:flex md:flex-wrap items-center gap-3">
            {/* Sleek Category Filter Bar — 2x2 Rounded Grid on Mobile, Pill Bar on sm+ */}
            <div
              role="tablist"
              aria-label="Filter barbershop services by category"
              className="grid grid-cols-2 sm:inline-flex sm:flex-wrap items-center gap-1.5 rounded-2xl sm:rounded-full border border-[#DFAF63]/25 bg-[#140F0C] p-1.5 w-full sm:w-auto self-start lg:self-auto"
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => { setSelectedCategory(tab.id); setActiveCard(0); resetDrag(); }}
                    className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.03em] sm:tracking-[0.06em] text-center transition-all cursor-pointer focus-ring ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E8C27A] via-[#DFAF63] to-[#C58E3D] text-[#090705] shadow-[0_4px_16px_rgba(223,175,99,0.3)]'
                        : 'text-[#C9B8A6] hover:text-[#F7F1E8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Character-led service cards, with mobile swipe navigation. */}
        <div
          ref={deckRef}
          className="service-deck grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          data-dragging="false"
          role="region"
          aria-label="Services — swipe left or right on mobile"
          onTouchStart={(event) => {
            touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            didSwipe.current = false;
          }}
          onTouchMove={(event) => {
            if (!touchStart.current) return;
            const dx = event.touches[0].clientX - touchStart.current.x;
            const dy = event.touches[0].clientY - touchStart.current.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
              didSwipe.current = true;
              dragX.current = Math.max(-110, Math.min(110, dx));
              if (!dragFrame.current) dragFrame.current = requestAnimationFrame(paintDrag);
            }
          }}
          onTouchEnd={() => {
            if (Math.abs(dragX.current) > 40) setActiveCard((current) => (current + (dragX.current < 0 ? 1 : -1) + visibleServices.length) % visibleServices.length);
            resetDrag();
          }}
          onTouchCancel={resetDrag}
          onClickCapture={(event) => {
            if (didSwipe.current) { event.preventDefault(); event.stopPropagation(); }
          }}
        >
          {visibleServices.map((service, index) => {
            const isFeatured = Boolean(service.featuredOrangeCard);
            const visual = SERVICE_VISUALS[service.id];
            const offset = (index - activeCard + visibleServices.length) % visibleServices.length;
            const position = offset > visibleServices.length / 2 ? offset - visibleServices.length : offset;
            return (
              <div
                key={service.id}
                className="service-deck-card"
                data-active={position === 0}
                data-visible={Math.abs(position) <= 1}
                style={{
                  '--deck-position': position,
                  '--deck-depth': Math.abs(position),
                  '--deck-tilt': position === 0 ? 'var(--deck-drag-tilt, 0deg)' : '0deg',
                  '--deck-opacity': position === 0 ? 1 : 0.6,
                  zIndex: visibleServices.length - Math.abs(position),
                } as React.CSSProperties}
              >
              <article className="service-character-card" data-featured={isFeatured}>
                <div className="service-character-card__stage">
                  <div className="service-character-card__arch" aria-hidden="true"><span>{visual.word}</span></div>
                  <span className="service-character-card__spark" aria-hidden="true"><SalonServiceIcon serviceId={service.id} /></span>
                  <SkeletonImage skeletonClassName="image-skeleton--portrait" src={`/assets/characters/services/${visual.image}.webp`} alt={visual.alt} loading="lazy" decoding="async" draggable={false} width="1024" height="1024" />
                  {isFeatured && <span className="service-character-card__signature">THE SIGNATURE CUT</span>}
                </div>
                <div className="service-character-card__body">
                  <div className="service-character-card__eyebrow"><span>SERVICE {service.indexLabel}</span><span><SalonServiceIcon serviceId={service.id} size={15} /></span></div>
                  <h3>{visual.title}</h3>
                  <p>{visual.detail}</p>
                  <div className="service-character-card__tags">{visual.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <div className="service-character-card__actions"><a href={`${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent('Hi Classic Cut Salon, I would like to book ' + visual.title + '.')}`} target="_blank" rel="noopener noreferrer">Book this look <ArrowUpRight size={16} /></a><a href={BUSINESS_INFO.phoneHref} aria-label={`Call for ${visual.title} pricing`}>Call for pricing</a></div>
                </div>
              </article>

              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col items-center gap-4 md:hidden">
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Previous service" onClick={() => setActiveCard((activeCard - 1 + visibleServices.length) % visibleServices.length)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DFAF63]/30 text-[#E5B96F] focus-ring"><ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" /></button>
            <div className="flex items-center gap-2" aria-label="Choose a service">
              {visibleServices.map((service, index) => (
                <button key={service.id} type="button" aria-label={`Show ${service.title}`} aria-pressed={activeCard === index} onClick={() => setActiveCard(index)} className={`h-2 rounded-full transition-all duration-300 focus-ring ${activeCard === index ? 'w-7 bg-[#E5B96F]' : 'w-2 bg-[#DFAF63]/25'}`} />
              ))}
            </div>
            <button type="button" aria-label="Next service" onClick={() => setActiveCard((activeCard + 1) % visibleServices.length)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DFAF63]/30 text-[#E5B96F] focus-ring"><ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9B8A6]" aria-live="polite">Swipe to explore · {activeCard + 1} / {visibleServices.length}</p>
        </div>

        {/* Bottom Custom Consultation & Direct Booking Strip */}
        <div className="luxury-card-shadow mt-10 sm:mt-12 rounded-2xl border border-[#DFAF63]/25 bg-[#140F0C] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-base sm:text-lg font-bold text-[#F7F1E8]">
              Looking for a custom makeover, wedding groom package, or kids haircut timing in Rajkot?
            </p>
            <p className="text-xs sm:text-sm text-[#C9B8A6] mt-1 leading-relaxed">
              Every session at Classic Cut Salon is tailored to your hair texture and consultation. Message us on WhatsApp or call our Arya Nagar, Rajkot salon directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href={BUSINESS_INFO.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-[#E8C27A] via-[#DFAF63] to-[#C58E3D] text-[#090705] font-bold text-xs uppercase tracking-[0.08em] hover:brightness-110 transition-all shadow-[0_8px_24px_rgba(223,175,99,0.28)] focus-ring"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">Book via WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-full border border-[#DFAF63]/45 text-[#F7F1E8] hover:border-[#E5B96F] hover:text-[#E5B96F] font-semibold text-xs uppercase tracking-[0.08em] transition-colors focus-ring"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E5B96F] shrink-0" />
              <span className="truncate">{BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
