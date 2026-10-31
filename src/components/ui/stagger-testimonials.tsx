import { useState, type CSSProperties, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './stagger-testimonials.css';

export interface StaggerTestimonial {
  id: string;
  quote: string;
  name: string;
  detail: string;
  highlight: string;
}

export function StaggerTestimonials({ items }: { items: StaggerTestimonial[] }) {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const move = (steps: number) => setActive(current => (current + steps + items.length) % items.length);
  if (!items.length) return null;
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart !== null) {
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    }
    setTouchStart(null);
  };
  return (
    <div className="stagger-testimonials" role="region" aria-roledescription="carousel" aria-label="Client experiences"
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}>
      <div className="stagger-testimonials__stage" onTouchStart={event => setTouchStart(event.touches[0].clientX)} onTouchEnd={onTouchEnd} onTouchCancel={() => setTouchStart(null)}>
        {items.map((item, index) => {
          let position = (index - active + items.length) % items.length;
          if (position > items.length / 2) position -= items.length;
          const centered = position === 0;
          const initials = item.name.split(/[\s·]+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('');
          return (
            <article key={item.id} className="stagger-testimonials__card" data-active={centered} aria-hidden={!centered}
              style={{ '--position': position, '--tilt': position % 2 ? '3deg' : '-3deg', '--offset': centered ? '-35px' : position % 2 ? '26px' : '5px', zIndex: centered ? 5 : 3 - Math.abs(position) } as CSSProperties}>
              <div className="stagger-testimonials__card-top"><span className="stagger-testimonials__avatar" aria-hidden="true">{initials}</span><Quote size={29} strokeWidth={1.2} aria-hidden="true" /></div>
              <span className="stagger-testimonials__topic">{item.highlight}</span>
              <blockquote><p>“{item.quote}”</p><footer><cite>{item.name}</cite><span>{item.detail}</span></footer></blockquote>
              {!centered && <button type="button" className="stagger-testimonials__select" tabIndex={-1} aria-label="Show this review" onClick={() => move(position)} />}
            </article>
          );
        })}
      </div>
      <div className="stagger-testimonials__controls">
        <button type="button" aria-label="Previous review" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
        <span aria-live="polite" aria-atomic="true"><strong>{String(active + 1).padStart(2, '0')}</strong><span aria-hidden="true"> / </span>{String(items.length).padStart(2, '0')}</span>
        <button type="button" aria-label="Next review" onClick={() => move(1)}><ChevronRight size={20} /></button>
      </div>
      <p className="stagger-testimonials__hint">A few words. A lasting impression.</p>
    </div>
  );
}
