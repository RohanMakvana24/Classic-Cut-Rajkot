import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Play, Quote } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';
import { SocialLanyardCard } from './SocialLanyardCard';
import { SkeletonImage } from './ui/skeleton-image';
import { useTheme } from '../hooks/useActivity';
import './SocialMediaSection.css';

// Temporary search destinations approved by the owner until exact profiles are supplied.
const FACEBOOK_URL = 'https://www.facebook.com/search/top?q=Classic%20Cut%20Salon%20Rajkot';
const YOUTUBE_URL = 'https://www.youtube.com/results?search_query=Classic+Cut+Salon+Rajkot';
const featuredReview = FAITHFUL_REVIEWS.find(review => review.reviewerName === 'Bharat Makawana');
const CARD_REVIEW = featuredReview ? { name: featuredReview.reviewerName, quote: featuredReview.verbatimQuote } : undefined;
const PROFILES = [
  { id: 'instagram', platform: 'Instagram', Icon: FaInstagram, handle: BUSINESS_INFO.instagramHandle, category: 'THE DAILY EDIT', headline: 'Your next look starts here.', description: 'Fresh cuts, style inspiration, and life behind the chair.', action: 'Follow on Instagram', href: BUSINESS_INFO.instagramUrl },
  { id: 'facebook', platform: 'Facebook', Icon: FaFacebookF, handle: 'Classic Cut · Rajkot', category: 'THE LOCAL CONNECTION', headline: 'Good company. Great cuts.', description: 'Salon updates and familiar faces from your neighbourhood.', action: 'Follow on Facebook', href: FACEBOOK_URL },
  { id: 'google', platform: 'Google', Icon: FcGoogle, handle: 'Arya Nagar, Rajkot', category: 'REAL CLIENT STORIES', headline: 'Your words mean a lot.', description: 'Tell us about your visit. We would love to hear it.', action: 'Review us on Google', href: BUSINESS_INFO.googleReviewsUrl },
  { id: 'youtube', platform: 'YouTube', Icon: FaYoutube, handle: 'Classic Cut Salon', category: 'STYLE IN MOTION', headline: 'A closer look at the craft.', description: 'The details, the process, and the finishing touches.', action: 'Subscribe on YouTube', href: YOUTUBE_URL },
];

function CardClip() {
  const id = useId().replace(/:/g, '');
  return <svg className="community-deck__clip" viewBox="0 0 56 44" fill="none" aria-hidden="true">
    <defs><linearGradient id={`${id}-metal`} x1="28" y1="23" x2="28" y2="42" gradientUnits="userSpaceOnUse"><stop stopColor="#f5efe0" /><stop offset=".2" stopColor="#c2b79e" /><stop offset=".45" stopColor="#f4f0e7" /><stop offset=".7" stopColor="#b0a48c" /><stop offset="1" stopColor="#81765e" /></linearGradient></defs>
    <path d="M19 28 L17 10 Q16 5 21 5 H35 Q40 5 39 10 L37 28" stroke="#746e60" strokeWidth="3.2" strokeLinejoin="round" />
    <path d="M19 27 L17.8 10 Q17 6 21 6 H35 Q39 6 38.2 10 L37 27" stroke="#f2eddf" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 25 Q28 20 44 25 L48 37 Q48 40 44 40 H12 Q8 40 8 37 Z" fill={`url(#${id}-metal)`} stroke="#74776f" />
    <path d="M12 25 Q28 22 44 25" stroke="#fffef5" strokeWidth="1.2" />
    <rect x="9" y="36" width="38" height="3" rx="1.5" fill="#41443e" />
    <path d="M13 36 H43" stroke="#bfc1b7" strokeWidth=".8" />
    <circle cx="16" cy="29" r="1.3" fill="#777d70" /><circle cx="40" cy="29" r="1.3" fill="#777d70" />
  </svg>;
}

export function SocialMediaSection() {
  const [active, setActive] = useState(0);
  const theme = useTheme();
  const stageRef = useRef<HTMLDivElement>(null);
  const getStage = useCallback(() => stageRef.current, []);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gesture = useRef<{ x: number; y: number; index: number; left: number; axis: 'horizontal' | 'vertical' | null } | null>(null);
  const dragFrame = useRef(0);
  useEffect(() => () => { if (scrollTimer.current) clearTimeout(scrollTimer.current); cancelAnimationFrame(dragFrame.current); }, []);
  const nearestCard = () => {
    const stage = stageRef.current; if (!stage) return 0;
    const center = stage.scrollLeft + stage.clientWidth / 2;
    const distances = slots.current.map(slot => slot ? Math.abs(slot.offsetLeft + slot.clientWidth / 2 - center) : Infinity);
    return distances.indexOf(Math.min(...distances));
  };
  const select = (index: number) => {
    const next = (index + PROFILES.length) % PROFILES.length;
    setActive(next);
    const stage = stageRef.current;
    const slot = slots.current[next];
    if (stage && slot && stage.scrollWidth > stage.clientWidth) {
      stage.scrollTo({ left: slot.offsetLeft - (stage.clientWidth - slot.clientWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  };
  const syncAfterScroll = () => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrollTimer.current = null;
      if (gesture.current?.axis === 'horizontal') return;
      stageRef.current?.removeAttribute('data-touch-scrolling');
      setActive(nearestCard());
    }, 140);
  };
  return (
    <section id="social" className="salon-social" aria-labelledby="social-heading">
      <div className="salon-social__inner">
        <header className="salon-social__header">
          <div><p className="salon-social__eyebrow"><span />THE CLASSIC CUT SOCIAL CLUB</p><h2 id="social-heading">Good style.<br /><span>Better company.</span></h2></div>
          <div className="salon-social__intro"><p>The conversation continues beyond the chair.<br />Find your inspiration. Share your experience.<br />Stay part of the Classic Cut circle.</p><a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noopener noreferrer">{BUSINESS_INFO.instagramHandle}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </header>

        <div className="community-deck">
          <div ref={stageRef} className="community-deck__stage" role="group" aria-label="Classic Cut social profiles" onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? PROFILES.length - 1 : (active + (event.key === 'ArrowRight' ? 1 : -1) + PROFILES.length) % PROFILES.length;
            select(next);
            slots.current[next]?.querySelector<HTMLButtonElement>('.community-deck__dot')?.focus({ preventScroll: true });
          }} onTouchStart={event => {
            gesture.current = null;
            const stage = stageRef.current;
            if (event.touches.length !== 1 || !stage || stage.scrollWidth <= stage.clientWidth) return;
            stage.scrollTo({ left: stage.scrollLeft, behavior: 'auto' });
            gesture.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, index: nearestCard(), left: stage.scrollLeft, axis: null };
          }} onTouchMove={event => {
            const start = gesture.current;
            const stage = stageRef.current;
            if (!start || !stage || event.touches.length !== 1) return;
            const dx = event.touches[0].clientX - start.x;
            const dy = event.touches[0].clientY - start.y;
            if (!start.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) start.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
            if (start.axis !== 'horizontal') return;
            stage.dataset.touchScrolling = 'true';
            cancelAnimationFrame(dragFrame.current);
            dragFrame.current = requestAnimationFrame(() => {
              dragFrame.current = 0;
              stage.scrollLeft = start.left - dx;
            });
          }} onTouchEnd={event => {
            const start = gesture.current; gesture.current = null;
            cancelAnimationFrame(dragFrame.current); dragFrame.current = 0;
            if (!start || event.touches.length || !event.changedTouches.length) return;
            const dx = event.changedTouches[0].clientX - start.x;
            if (start.axis === 'horizontal') {
              const step = Math.abs(dx) > 45 ? (dx < 0 ? 1 : -1) : 0;
              select(Math.max(0, Math.min(PROFILES.length - 1, start.index + step)));
              syncAfterScroll();
            }
          }} onTouchCancel={() => {
            gesture.current = null;
            cancelAnimationFrame(dragFrame.current); dragFrame.current = 0;
            select(nearestCard()); syncAfterScroll();
          }} onScroll={() => {
            const stage = stageRef.current;
            if (!stage || stage.scrollWidth <= stage.clientWidth) return;
            syncAfterScroll();
          }}>
            <div className="community-deck__track">
              <div className="community-deck__support" aria-hidden="true"><span /><span /></div>
              {PROFILES.map((profile, index) => <div className="community-deck__slot" key={profile.id} data-platform={profile.id} data-active={active === index} ref={node => { slots.current[index] = node; }} onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(index); }} onFocusCapture={() => setActive(index)}>
                <div className="community-deck__assembly">
                  <SocialLanyardCard profile={profile} index={index} theme={theme} review={CARD_REVIEW} isSelected={active === index} getStage={getStage}>
                  <div className="community-deck__connector" aria-hidden="true"><i /><span /></div>
                  <article className="community-card" aria-labelledby={`social-${profile.id}-title`}>
                    <CardClip />
                    <div className="community-card__top"><span><profile.Icon aria-hidden="true" />{profile.platform}</span><span>0{index + 1}</span></div>
                    <div className="community-card__identity"><span><img src="/assets/brand/classic-cut-icon-cropped.webp" width="27" height="30" alt="" loading="lazy" /></span><div><h3 id={`social-${profile.id}-title`}>Classic Cut Salon</h3><p>{profile.handle}</p></div></div>
                    <div className={`community-card__preview community-card__preview--${profile.id}`}>
                      {profile.id === 'instagram' && <div className="community-card__photos">{['modern-quiff', 'textured-crop', 'classic-side-part'].map((name, i) => <span key={name}><SkeletonImage src={`/assets/hairstyles/${name}.webp`} alt={['Modern quiff inspiration', 'Textured crop inspiration', 'Classic side part inspiration'][i]} loading="lazy" /></span>)}</div>}
                      {profile.id === 'facebook' && <div className="community-card__community"><FaFacebookF aria-hidden="true" /><span>OUR KIND OF COMMUNITY</span><strong>Rooted in Rajkot.<br />Connected by style.</strong><span><MapPin size={10} aria-hidden="true" />Arya Nagar, Rajkot</span></div>}
                      {profile.id === 'google' && <div className="community-card__review"><Quote size={19} strokeWidth={1.3} aria-hidden="true" /><blockquote>{featuredReview?.verbatimQuote}</blockquote><span><i aria-hidden="true">B</i>{featuredReview?.reviewerName}<span>Google review</span></span></div>}
                      {profile.id === 'youtube' && <div className="community-card__video"><SkeletonImage src="/assets/hairstyles/slick-back-ai.webp" alt="Slicked-back hairstyle inspiration" loading="lazy" /><span><Play size={12} fill="currentColor" aria-hidden="true" /></span><small>INSIDE THE CHAIR</small></div>}
                    </div>
                    <div className="community-card__editorial"><span>{profile.category}</span><h4>{profile.headline}</h4><p>{profile.description}</p></div>
                    <a className="community-card__follow" href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.action} — Classic Cut Salon`}>{profile.action}<ArrowUpRight size={15} aria-hidden="true" /></a>
                  </article>
                  </SocialLanyardCard>
                </div>
                <button type="button" className="community-deck__dot" aria-label={`Show ${profile.platform} card`} aria-pressed={active === index} onClick={() => select(index)}><span /></button>
              </div>)}
            </div>
          </div>
          <div className="community-deck__footer"><p><span />Drag to swing. Tap to turn.</p><div><span><strong>0{active + 1}</strong> / 04</span><button type="button" aria-label="Previous social card" onClick={() => select(active - 1)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next social card" onClick={() => select(active + 1)}><ChevronRight size={17} /></button></div></div>
        </div>
      </div>
    </section>
  );
}
