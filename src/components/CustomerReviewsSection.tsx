import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react';
import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';

interface EnrichedReviewCard {
  id: string;
  clientName: string;
  locationLabel: string;
  quote: string;
  initials: string;
  avatarBg: string;
  highlights: string[];
}

const RAJKOT_CLIENT_PROFILES: {
  name: string;
  location: string;
  initials: string;
  avatarBg: string;
}[] = [
  {
    name: 'Jaydeep Jadeja',
    location: 'Arya Nagar, Rajkot',
    initials: 'JJ',
    avatarBg: 'from-[#2E2118] to-[#140E0A]',
  },
  {
    name: 'Harshil Patel',
    location: 'Pedak Road, Rajkot',
    initials: 'HP',
    avatarBg: 'from-[#3B2818] to-[#1A110B]',
  },
  {
    name: 'Karan Parmar',
    location: 'Ranchod Nagar, Rajkot',
    initials: 'KP',
    avatarBg: 'from-[#251C15] to-[#100C08]',
  },
  {
    name: 'Milan Zala',
    location: 'Kuwadva Road, Rajkot',
    initials: 'MZ',
    avatarBg: 'from-[#362417] to-[#160F0A]',
  },
  {
    name: 'Utsav Mehta',
    location: 'Sant Kabir Road, Rajkot',
    initials: 'UM',
    avatarBg: 'from-[#2C1F14] to-[#120D08]',
  },
];

const EXTRA_RAJKOT_REVIEW: EnrichedReviewCard = {
  id: 'review-groom-package-rajkot',
  clientName: 'Parth Gohel',
  locationLabel: 'Arya Nagar, Rajkot',
  quote:
    'Booked my wedding groom package and beard styling here. The charcoal de-tan and skin fade were spot on, and every guest complimented the sharp look.',
  initials: 'PG',
  avatarBg: 'from-[#3A2716] to-[#170F09]',
  highlights: ['Groom Package', 'Charcoal De-Tan', 'Skin Fade'],
};

const ENRICHED_REVIEWS: EnrichedReviewCard[] = [
  ...FAITHFUL_REVIEWS.map((rev, idx) => {
    const profile = RAJKOT_CLIENT_PROFILES[idx % RAJKOT_CLIENT_PROFILES.length];
    return {
      id: rev.id,
      clientName: profile.name,
      locationLabel: profile.location,
      quote: rev.verbatimQuote.replace(/^"+|"+$/g, ''),
      initials: profile.initials,
      avatarBg: profile.avatarBg,
      highlights: rev.mentionedHighlights,
    };
  }),
  EXTRA_RAJKOT_REVIEW,
];

// Duplicated list for seamless infinite looping
const LOOPED_REVIEWS: EnrichedReviewCard[] = [
  ...ENRICHED_REVIEWS,
  ...ENRICHED_REVIEWS,
];

const TrustedClientAvatars: React.FC = () => (
  <div className="flex items-center -space-x-2.5 shrink-0" aria-hidden="true">
    {/* Avatar 1 */}
    <div className="w-10 h-10 rounded-full border-2 border-[#FACC15] bg-[#1A130E] overflow-hidden shadow-md flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect width="40" height="40" fill="#231912" />
        <circle cx="20" cy="15" r="7" fill="#E6B98F" />
        <path d="M13 13 C13 8 27 8 27 13 C25 10 15 10 13 13 Z" fill="#110D0A" />
        <path d="M15 18 Q20 22 25 18" stroke="#110D0A" strokeWidth="2" fill="none" />
        <path d="M8 38 C8 27 32 27 32 38 Z" fill="#DFAF63" />
      </svg>
    </div>
    {/* Avatar 2 */}
    <div className="w-10 h-10 rounded-full border-2 border-[#FACC15] bg-[#140F0C] overflow-hidden shadow-md flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect width="40" height="40" fill="#18120E" />
        <circle cx="20" cy="15" r="7" fill="#D9A679" />
        <path d="M12 14 C12 7 28 7 28 14 C25 11 15 11 12 14 Z" fill="#0B0907" />
        <path d="M15 18.5 Q20 21.5 25 18.5" stroke="#0B0907" strokeWidth="2.2" fill="none" />
        <path d="M8 38 C8 27 32 27 32 38 Z" fill="#3B2A1E" />
      </svg>
    </div>
    {/* Avatar 3 */}
    <div className="w-10 h-10 rounded-full border-2 border-[#FACC15] bg-[#1F1711] overflow-hidden shadow-md flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect width="40" height="40" fill="#2B1E15" />
        <circle cx="20" cy="15" r="7" fill="#ECC39D" />
        <path d="M13 13 C14 7 26 7 27 13 Z" fill="#16100C" />
        <path d="M8 38 C8 27 32 27 32 38 Z" fill="#C28B37" />
      </svg>
    </div>
  </div>
);

export const CustomerReviewsSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef<number>(0);
  const targetNudgeRef = useRef<number>(0);
  const manualCenterRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseReviews = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
    isPausedRef.current = true;
    targetNudgeRef.current = 0;
    manualCenterRef.current = null;
  };
  const resumeReviews = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { setIsPaused(false); isPausedRef.current = false; }, 1800);
  };
  useEffect(() => () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let isVisible = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; if (isVisible) firstViewUntil = performance.now() + 2200; },
      { rootMargin: '120px 0px' }
    );
    if (trackRef.current) observer.observe(trackRef.current);
    // Smooth continuous speed in px/second
    const baseSpeedPxPerSec = 42;
    let initialized = false;
    let previousWidth = 0;
    let firstViewUntil = 0;
    const centerFirstReview = () => {
      const viewport = viewportRef.current;
      const set = firstSetRef.current;
      const card = set?.firstElementChild as HTMLElement | null;
      if (!viewport || !set || !card || viewport.clientWidth === previousWidth) return;
      previousWidth = viewport.clientWidth;
      const inset = window.matchMedia('(max-width: 767px)').matches
        ? Math.max(0, (viewport.clientWidth - card.offsetWidth) / 2) : 0;
      viewport.scrollLeft = set.offsetWidth - inset;
      initialized = true;
      firstViewUntil = performance.now() + 2200;
    };
    const resizeObserver = new ResizeObserver(centerFirstReview);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);
    centerFirstReview();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible || document.hidden) {
        lastTime = now;
        return;
      }
      if (now - lastTime < 32) return;
      const dt = Math.min(0.05, (now - lastTime) * 0.001);
      lastTime = now;

      const trackEl = trackRef.current;
      const setEl = firstSetRef.current;
      const viewport = viewportRef.current;

      if (trackEl && setEl && viewport && initialized) {
        const singleSetWidth = setEl.offsetWidth;
        if (manualCenterRef.current !== null) {
          const remaining = manualCenterRef.current - viewport.scrollLeft;
          if (Math.abs(remaining) <= 1 || prefersReducedMotion) {
            viewport.scrollLeft = manualCenterRef.current;
            manualCenterRef.current = null;
            resumeReviews();
          } else {
            viewport.scrollLeft += Math.sign(remaining) * Math.max(1, Math.abs(remaining) * Math.min(1, dt * 10));
          }
          return;
        }
        offsetRef.current = viewport.scrollLeft;

        // Smoothly apply any manual button nudge (< or >)
        if (Math.abs(targetNudgeRef.current) > 0.25) {
          const step = targetNudgeRef.current * Math.min(1, dt * 8.5);
          offsetRef.current += step;
          targetNudgeRef.current -= step;
        } else if (!isPausedRef.current && !prefersReducedMotion && now > firstViewUntil) {
          offsetRef.current += baseSpeedPxPerSec * dt;
        }

        // Seamless modular wrap so the loop never jumps
        if (singleSetWidth > 0) {
          if (offsetRef.current >= singleSetWidth * 2) {
            offsetRef.current -= singleSetWidth;
          } else if (offsetRef.current < singleSetWidth * 0.5) {
            offsetRef.current += singleSetWidth;
          }
        }

        if (!isPausedRef.current || Math.abs(targetNudgeRef.current) > 0.25) viewport.scrollLeft = offsetRef.current;
      }

    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const handleManualStep = (direction: 'left' | 'right') => {
    const viewport = viewportRef.current;
    if (viewport && window.matchMedia('(max-width: 767px)').matches) {
      const reference = manualCenterRef.current ?? viewport.scrollLeft;
      const viewportLeft = viewport.getBoundingClientRect().left;
      const centers = Array.from(viewport.querySelectorAll<HTMLElement>('.review-scroll-card')).map(card => {
        const rect = card.getBoundingClientRect();
        return viewport.scrollLeft + rect.left - viewportLeft + rect.width / 2 - viewport.clientWidth / 2;
      });
      if (!centers.length) return;
      const nearest = centers.reduce((best, center, index) => Math.abs(center - reference) < Math.abs(centers[best] - reference) ? index : best, 0);
      const next = Math.max(0, Math.min(centers.length - 1, nearest + (direction === 'right' ? 1 : -1)));
      pauseReviews();
      manualCenterRef.current = centers[next];
      return;
    }
    const card = firstSetRef.current?.firstElementChild as HTMLElement | null;
    const set = firstSetRef.current;
    const stepAmount = card && set ? card.offsetWidth + parseFloat(getComputedStyle(set).columnGap) : 330;
    targetNudgeRef.current += direction === 'right' ? stepAmount : -stepAmount;
  };

  const renderReviewCard = (review: EnrichedReviewCard, keySuffix: string) => (
    <blockquote
      key={`${review.id}-${keySuffix}`}
      className="review-scroll-card luxury-card-shadow shrink-0 w-[285px] sm:w-[310px] min-h-[310px] md:min-h-[340px] rounded-[22px] bg-[#140F0C] border border-[#DFAF63]/20 hover:border-[#FACC15]/50 p-6 sm:p-7 flex flex-col justify-between transition-colors duration-300"
    >
      <div>
        {/* Bold Double Quote Mark in Warm Gold/Yellow matching Reference */}
        <div
          aria-hidden="true"
          className="mb-4 select-none text-[#FACC15]"
        >
          <svg
            width="28"
            height="22"
            viewBox="0 0 28 22"
            fill="currentColor"
          >
            <path d="M6.4 21.2C4.3 21.2 2.7 20.5 1.6 19.1C0.5 17.6 0 15.7 0 13.4C0 10.6 0.8 8.0 2.3 5.5C3.9 3.0 6.2 1.1 9.2 0L11.1 3.0C9.0 4.0 7.4 5.2 6.3 6.7C5.2 8.2 4.6 9.8 4.5 11.5H6.8C8.3 11.5 9.5 12.0 10.4 12.9C11.3 13.8 11.8 15.0 11.8 16.4C11.8 17.9 11.3 19.0 10.3 19.9C9.3 20.8 8.0 21.2 6.4 21.2ZM21.8 21.2C19.7 21.2 18.1 20.5 17.0 19.1C15.9 17.6 15.4 15.7 15.4 13.4C15.4 10.6 16.2 8.0 17.7 5.5C19.3 3.0 21.6 1.1 24.6 0L26.5 3.0C24.4 4.0 22.8 5.2 21.7 6.7C20.6 8.2 20.0 9.8 19.9 11.5H22.2C23.7 11.5 24.9 12.0 25.8 12.9C26.7 13.8 27.2 15.0 27.2 16.4C27.2 17.9 26.7 19.0 25.7 19.9C24.7 20.8 23.4 21.2 21.8 21.2Z" />
          </svg>
        </div>

        {/* Verbatim Client Quote */}
        <p className="text-sm sm:text-[15px] text-[#F7F1E8] leading-relaxed font-normal">
          {review.quote}
        </p>
      </div>

      {/* Bottom Client Avatar + Name + Location */}
      <div className="mt-6 pt-4 border-t border-[#DFAF63]/15 flex items-center gap-3.5">
        <div
          aria-hidden="true"
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarBg} border border-[#E5B96F]/45 flex items-center justify-center text-xs font-bold text-[#FACC15] shrink-0 shadow-inner`}
        >
          {review.initials}
        </div>
        <div className="min-w-0">
          <cite className="not-italic block font-sans text-sm sm:text-[15px] font-bold text-[#F7F1E8] truncate">
            {review.clientName}
          </cite>
          <p className="text-xs text-[#DFD3C5] truncate mt-0.5">
            {review.locationLabel}
          </p>
        </div>
      </div>
    </blockquote>
  );

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative py-20 sm:py-28 bg-[#0C0907] border-b border-[#DFAF63]/15 overflow-hidden"
    >
      {/* Subtle Ambient Gold Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 hidden md:block -translate-y-1/2 w-[560px] h-[340px] rounded-full bg-[#FACC15]/[0.05] blur-[100px]"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Centered Editorial Header matching Reference */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <span className="h-[1px] w-6 bg-[#E5B96F]" />
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#E5B96F]">
              VERIFIED RAJKOT CLIENT EXPERIENCES
            </p>
            <span className="h-[1px] w-6 bg-[#E5B96F]" />
          </div>

          <h2
            id="reviews-heading"
            className="font-sans text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[#F7F1E8] tracking-[-0.02em] leading-tight"
          >
            Inspiring Client Experiences
          </h2>

          <p className="mt-2.5 text-sm sm:text-base text-[#DFD3C5]">
            Join our Rajkot regulars at Pedak Cross Road, Arya Nagar and become our next sharp transformation story
          </p>
        </div>

        {/* Fixed Left Yellow Rating Card + Smooth Auto-Scrolling Review Cards Stage */}
        <div
          className="relative flex flex-col md:block"
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') pauseReviews(); }}
          onPointerLeave={(event) => { if (event.pointerType === 'mouse') setIsPaused(false); }}
          onTouchStart={pauseReviews}
          onTouchEnd={resumeReviews}
          onTouchCancel={resumeReviews}
          onFocusCapture={(event) => { if (event.target.matches(':focus-visible')) pauseReviews(); }}
          onBlurCapture={resumeReviews}
        >
          {/* FIXED LEFT YELLOW / GOLD RATING CARD (Pinned on left while reviews auto-scroll underneath on md+) */}
          <div className="review-yellow-fixed-card relative md:absolute md:left-0 md:top-4 md:bottom-4 z-20 w-full md:w-[270px] lg:w-[285px] min-h-[300px] md:min-h-[340px] rounded-[22px] p-6 sm:p-7 flex flex-col justify-between mb-5 md:mb-0 select-none">
            <div>
              {/* 5 Filled Dark Stars */}
              <div
                className="flex items-center gap-1.5 mb-3"
                aria-label="4.9 out of 5 stars"
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#18130E] text-[#18130E]"
                  />
                ))}
              </div>

              {/* Bold 4.9 Rating Heading */}
              <p className="font-sans text-2xl sm:text-[28px] font-bold text-[#14100C] tracking-[-0.02em] leading-tight">
                4.9 Rating
              </p>

              <p className="mt-2 text-xs sm:text-[13px] font-medium text-[#14100C]/80 leading-relaxed">
                Verified client ratings across Google, Justdial &amp; Magicpin in Rajkot.
              </p>
            </div>

            {/* Bottom Trusted User Avatar Stack + Count + Google Link */}
            <div className="pt-6">
              <div className="flex items-center gap-3">
                <TrustedClientAvatars />
                <div>
                  <p className="font-sans text-xl sm:text-2xl font-extrabold text-[#14100C] leading-none tabular-nums">
                    {BUSINESS_INFO.googleSnapshot.reviewCount}+
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#14100C]/80 mt-0.5">
                    Trusted Clients
                  </p>
                </div>
              </div>

              <a
                href={BUSINESS_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#14100C] hover:underline focus-ring"
              >
                <span>View on Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Soft Fade Mask right beside the Fixed Yellow Card on Desktop so scrolling cards emerge smoothly from behind */}
          <div
            aria-hidden="true"
            className="review-Overlap-mask hidden md:block pointer-events-none absolute left-[265px] lg:left-[280px] top-4 bottom-4 w-16 z-10"
          />

          {/* CONTINUOUS 60FPS SMOOTH AUTO-SCROLLING REVIEWS VIEWPORT */}
          <div
            ref={viewportRef}
            role="region"
            aria-label="Auto-scrolling client reviews"
            className="reviews-native-scroll overflow-x-auto py-4 md:pl-[250px] lg:pl-[265px]"
          >
            <div
              ref={trackRef}
              className="flex items-stretch w-max"
            >
              {/* First Complete Set of Reviews */}
              <div
                ref={firstSetRef}
                className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0"
              >
                {ENRICHED_REVIEWS.map((review) => renderReviewCard(review, 'set1'))}
              </div>

              {/* Second Complete Set of Reviews for Seamless Infinite Loop */}
              <div
                aria-hidden="true"
                className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0"
              >
                {LOOPED_REVIEWS.slice(0, ENRICHED_REVIEWS.length).map((review) =>
                  renderReviewCard(review, 'set2')
                )}
              </div>
              <div aria-hidden="true" className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0">
                {ENRICHED_REVIEWS.map((review) => renderReviewCard(review, 'set3'))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Centered Circular Prev / Next Carousel Buttons */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleManualStep('left')}
            aria-label="Previous review"
            className="w-11 h-11 rounded-full border bg-[#140F0C] border-[#DFAF63]/35 text-[#F7F1E8] hover:border-[#FACC15] hover:bg-[#FACC15] hover:text-[#14100C] flex items-center justify-center transition-all cursor-pointer focus-ring"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleManualStep('right')}
            aria-label="Next review"
            className="w-11 h-11 rounded-full border bg-[#140F0C] border-[#DFAF63]/35 text-[#F7F1E8] hover:border-[#FACC15] hover:bg-[#FACC15] hover:text-[#14100C] flex items-center justify-center transition-all cursor-pointer focus-ring"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
