import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import { createSocialCardTextures, type SocialCardProfile } from '../lib/socialCardTextures';
import type { ThemeMode } from '../data/barbershopData';
import { scheduleWork } from '../lib/scheduleWork';
import './SocialLanyardCard.css';

const Lanyard = lazy(() => import('./ui/Lanyard'));

class LanyardBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function SocialLanyardCard({ profile, index, theme, review, children, isSelected, getStage }: {
  profile: SocialCardProfile;
  index: number;
  theme: ThemeMode;
  review?: { name: string; quote: string };
  children: ReactNode;
  isSelected: boolean;
  getStage: () => HTMLElement | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLAnchorElement>(null);
  const [nearby, setNearby] = useState(false);
  const [reduced, setReduced] = useState(true);
  const reducedRef = useRef(true);
  const [textures, setTextures] = useState<Awaited<ReturnType<typeof createSocialCardTextures>> | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [flipSignal, setFlipSignal] = useState(0);
  const [back, setBack] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setReady(false); }, []);
  const getEventTarget = useCallback(() => viewportRef.current, []);
  const onAction = useCallback(() => actionRef.current?.click(), []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (reducedRef.current === media.matches) return;
      reducedRef.current = media.matches; setReduced(media.matches); setReady(false);
    };
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '240px 0px' });
    observer.observe(root.closest('.salon-social') || root); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!nearby || reduced || failed) return;
    const svg = rootRef.current?.querySelector('.community-card__top svg')?.cloneNode(true) as SVGSVGElement | undefined;
    if (!svg) return;
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); svg.setAttribute('width', '96'); svg.setAttribute('height', '96');
    const color = { instagram: '#d2af7b', facebook: '#1877f2', google: '#4285f4', youtube: '#e52d27' }[profile.id] ?? '#d2af7b';
    const markup = new XMLSerializer().serializeToString(svg).replace(/currentColor/g, color);
    let alive = true;
    scheduleWork(() => createSocialCardTextures(profile, index, theme, markup, review)).then(result => { if (alive) setTextures(result); }).catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [nearby, reduced, failed, profile, index, theme, review]);

  const enabled = Boolean(textures && !reduced && !failed);
  const active = enabled && ready;
  return <div ref={rootRef} className="social-lanyard" data-ready={active} data-face={back ? 'back' : 'front'} data-status={active ? 'ready' : failed ? 'fallback' : reduced ? 'reduced-motion' : !nearby ? 'waiting' : textures ? 'rendering' : 'artwork'}>
    <div className="social-lanyard__fallback" aria-hidden={active || undefined}>{children}</div>
    <div ref={viewportRef} className="social-lanyard__viewport" aria-hidden="true">
      {enabled && textures && <LanyardBoundary onError={onError}><Suspense fallback={null}><Lanyard
        frontImage={textures.front} backImage={textures.back} strapImage={textures.strap}
        imageFit="cover" cardColor={theme === 'dark' || profile.id === 'instagram' ? '#27201a' : '#fffdf9'}
        orientation="portrait" finish="matte" cornerRadius={0.3} size={0.7} anchor="center"
        anchorInset={0.01} strapLength={0.08} strapColor="#211b16" strapWidth={0.65} metal="silver"
        gravity={1} damping={0.6} elasticity={0.45} breeze={isSelected && !compact ? 0.12 : 0} interactive intro={!compact} touchScroll
        className="social-lanyard__visual" flipSignal={flipSignal} getEventTarget={getEventTarget} getStage={getStage}
        onReady={onReady} onError={onError} onFlip={setBack} onAction={onAction}
      /></Suspense></LanyardBoundary>}
    </div>
    {active && <div className="social-lanyard__controls">
      <span className="sr-only">{profile.platform}: Classic Cut Salon, {profile.handle}. {profile.description}</span>
      <button type="button" aria-label={`Turn ${profile.platform} card to ${back ? 'front' : 'back'}`} onClick={() => setFlipSignal(value => value + 1)}><RotateCw size={13} aria-hidden="true" /><span>{back ? 'Front' : 'Turn card'}</span></button>
      <a ref={actionRef} href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.action} — Classic Cut Salon`}>{profile.action.replace(' on ', ' ')}<ArrowUpRight size={13} aria-hidden="true" /></a>
    </div>}
  </div>;
}
