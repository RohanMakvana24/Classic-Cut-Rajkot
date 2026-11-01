import { ElementType, PointerEvent, useEffect, useRef } from 'react';

type RisingInkProps = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  color?: string;
  colors?: [string, string];
  lift?: number;
  radius?: number;
};

export function RisingInk({
  text,
  as: Tag = 'span',
  id,
  className = '',
  color = '#F7F1E8',
  colors = ['#E5B96F', '#8B541A'],
  lift = 0.5,
  radius = 1.4,
}: RisingInkProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, []);

  const updateLetters = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || !rootRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pointerX = event.clientX;
    const pointerY = event.clientY;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      // Complete layout reads before changing any letter styles.
      const letters = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-rising-letter]') ?? []);
      const boxes = letters.map(letter => letter.getBoundingClientRect());
      const fontSize = letters[0] ? Number.parseFloat(getComputedStyle(letters[0]).fontSize) || 48 : 48;
      letters.forEach((letter, index) => {
        const box = boxes[index];
        const dx = pointerX - (box.left + box.width / 2);
        const dy = pointerY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / (fontSize * radius * 2.15));
        const eased = influence * influence * (3 - 2 * influence);
        const rise = eased * fontSize * lift;
        const tiltX = Math.max(-9, Math.min(9, -dy / fontSize * 7)) * eased;
        const tiltY = Math.max(-12, Math.min(12, dx / fontSize * 9)) * eased;

        letter.style.setProperty('--ink-rise', `${rise.toFixed(2)}px`);
        letter.style.setProperty('--ink-depth', `${(eased * 9).toFixed(2)}px`);
        letter.style.setProperty('--ink-tilt-x', `${tiltX.toFixed(2)}deg`);
        letter.style.setProperty('--ink-tilt-y', `${tiltY.toFixed(2)}deg`);
        letter.style.setProperty('--ink-glow', eased.toFixed(3));
      });
    });
  };

  const resetLetters = () => {
    if (frameRef.current !== null) { cancelAnimationFrame(frameRef.current); frameRef.current = null; }
    rootRef.current?.querySelectorAll<HTMLElement>('[data-rising-letter]').forEach((letter) => {
      letter.style.removeProperty('--ink-rise');
      letter.style.removeProperty('--ink-depth');
      letter.style.removeProperty('--ink-tilt-x');
      letter.style.removeProperty('--ink-tilt-y');
      letter.style.removeProperty('--ink-glow');
    });
  };

  return (
    <Tag
      ref={rootRef}
      id={id}
      className={`rising-ink ${className}`}
      aria-label={text}
      onPointerMove={updateLetters}
      onPointerLeave={resetLetters}
      style={{ '--ink-face': color, '--ink-near': colors[0], '--ink-far': colors[1] }}
    >
      <span aria-hidden="true">
        {text.split(/\s+/).map((word, wordIndex) => (
          <span className="rising-ink__word" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((character, index) => (
              <span className="rising-ink__letter" data-rising-letter key={`${character}-${index}`}>{character}</span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
