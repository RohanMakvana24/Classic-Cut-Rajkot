"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useElementInView, usePageVisible } from '@/hooks/useActivity';

export interface TestimonialItem {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  content: string;
  highlights?: string[];
  rating?: number;
}

export interface TestimonialsMarqueeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  firstRow?: TestimonialItem[];
  secondRow?: TestimonialItem[];
  duration?: number;
  pauseOnHover?: boolean;
}

const HighlightedText = ({
  text,
  highlights,
}: {
  text: string;
  highlights?: string[];
}) => {
  if (!highlights || highlights.length === 0) return <>{text}</>;

  const escape = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(`(${highlights.map(escape).join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatched = highlights.some(
          (h) => h.toLowerCase() === part.toLowerCase()
        );
        return isMatched ? (
          <span key={index} className="text-primary font-medium">
            {part}
          </span>
        ) : (
          part
        );
      })}
    </>
  );
};

const RatingStars = ({ rating = 5 }: { rating?: number }) => (
  <span
    className="flex shrink-0 items-center gap-[2px] text-primary"
    aria-label={`${rating} out of 5 stars`}
  >
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={10}
        strokeWidth={1.5}
        fill={index < Math.round(rating) ? "currentColor" : "none"}
        aria-hidden="true"
      />
    ))}
  </span>
);

export const TestimonialCard: React.FC<
  { item: TestimonialItem } & React.HTMLAttributes<HTMLElement>
> = ({ item, className, ...props }) => {
  return (
    <figure
      {...props}
      className={cn(
        "group relative w-[280px] sm:w-[330px] md:w-[390px] lg:w-[420px] shrink-0 select-none",
        "min-h-[190px] md:min-h-[205px] p-5 sm:p-6 flex flex-col justify-start",
        "bg-card/40 hover:bg-card transition-colors duration-500",
        "border-r border-border",
        "after:pointer-events-none after:absolute after:left-0 after:top-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-500 group-hover:after:w-full",
        className
      )}
    >
      <figcaption className="mb-3 flex items-center gap-3 sm:gap-3.5">
        <span
          aria-hidden="true"
          className="grid w-9 h-9 sm:w-10 sm:h-10 place-items-center rounded-full shrink-0 text-xl font-medium text-white"
          style={{ backgroundColor: item.avatarColor }}
        >
          {Array.from(item.name.trim())[0]?.toLocaleUpperCase()}
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="line-clamp-2 text-[13.5px] sm:text-[14px] font-semibold tracking-tight text-foreground">
            {item.name}
          </span>
          <span className="mt-0.5 truncate text-[11.5px] sm:text-[12px] text-muted-foreground">
            {item.handle}
          </span>
        </div>
      </figcaption>

      <blockquote className="m-0 text-[12.5px] sm:text-[13.5px] font-normal leading-[1.55] sm:leading-[1.6] text-muted-foreground/90 whitespace-pre-line">
        &ldquo;
        <HighlightedText text={item.content} highlights={item.highlights} />
        &rdquo;
      </blockquote>

      <div className="mt-auto flex items-center gap-2 pt-3">
        {item.rating !== undefined && <RatingStars rating={item.rating} />}
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          Google review
        </span>
      </div>
    </figure>
  );
};

export const TestimonialsMarquee = React.forwardRef<
  HTMLDivElement,
  TestimonialsMarqueeProps
>(
  (
    {
      firstRow = [],
      secondRow = [],
      duration = 80,
      pauseOnHover = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isRow1Paused, setIsRow1Paused] = React.useState(false);
    const [isRow2Paused, setIsRow2Paused] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inView = useElementInView(rootRef);
    const pageVisible = usePageVisible();
    const paused = !inView || !pageVisible;
    const assignRef = React.useCallback((node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
    }, [ref]);

    if (firstRow.length === 0 && secondRow.length === 0) return null;

    return (
      <div
        ref={assignRef}
        role="region"
        aria-label="Customer Testimonials"
        className={cn(
          "relative w-full bg-background overflow-hidden py-2",
          className
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <style>{`
          @keyframes marquee-scroll-left {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }

          @keyframes marquee-scroll-right {
            0% {
              transform: translate3d(-50%, 0, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          }

          .track-flex-container {
            display: flex;
            width: max-content;
            will-change: transform;
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }

          .marquee-move-left {
            animation: marquee-scroll-left var(--marquee-duration) linear infinite;
          }

          .marquee-move-right {
            animation: marquee-scroll-right var(--marquee-duration) linear infinite;
          }
          .testimonials-marquee__row:focus-within .track-flex-container { animation-play-state: paused !important; }

          @media (prefers-reduced-motion: reduce) {
            .marquee-move-left,
            .marquee-move-right {
              animation: none !important;
            }
            .testimonials-marquee__row { overflow-x: auto; scrollbar-width: thin; scroll-snap-type: x proximity; }
            .testimonials-marquee__row .track-flex-container > [aria-hidden='true'] { display: none; }
            .testimonials-marquee__row figure { scroll-snap-align: start; }
          }
        `}</style>

        {/* Dual Side Gradient Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-background via-background/80 to-transparent sm:w-28 md:w-44" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-background via-background/80 to-transparent sm:w-28 md:w-44" />

        {/* Main Grid Wrapper */}
        <div className="flex w-full flex-col border-y border-border">
          {/* Row 1: Left Scroll */}
          <div
            className="testimonials-marquee__row flex w-full cursor-pointer select-none overflow-hidden border-b border-border focus-visible:outline focus-visible:outline-primary focus-visible:-outline-offset-2"
            tabIndex={0}
            role="group"
            aria-label="Client reviews, first row"
            onPointerEnter={() => pauseOnHover && setIsRow1Paused(true)}
            onPointerLeave={() => pauseOnHover && setIsRow1Paused(false)}
            onPointerDown={() => setIsRow1Paused(true)}
            onPointerUp={() => setIsRow1Paused(false)}
            onPointerCancel={() => setIsRow1Paused(false)}
          >
            <div
              className="track-flex-container marquee-move-left"
              style={{
                animationPlayState: paused || isRow1Paused ? "paused" : "running",
              }}
            >
              <div className="flex flex-nowrap">
                {firstRow.map((item, idx) => (
                  <TestimonialCard
                    key={`r1-primary-${item.id}-${idx}`}
                    item={item}
                    aria-hidden={idx >= firstRow.length}
                  />
                ))}
              </div>
              <div className="flex flex-nowrap" aria-hidden="true">
                {firstRow.map((item, idx) => (
                  <TestimonialCard
                    key={`r1-clone-${item.id}-${idx}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Right Scroll */}
          <div
            className="testimonials-marquee__row flex w-full cursor-pointer select-none overflow-hidden focus-visible:outline focus-visible:outline-primary focus-visible:-outline-offset-2"
            tabIndex={0}
            role="group"
            aria-label="Client reviews, second row"
            onPointerEnter={() => pauseOnHover && setIsRow2Paused(true)}
            onPointerLeave={() => pauseOnHover && setIsRow2Paused(false)}
            onPointerDown={() => setIsRow2Paused(true)}
            onPointerUp={() => setIsRow2Paused(false)}
            onPointerCancel={() => setIsRow2Paused(false)}
          >
            <div
              className="track-flex-container marquee-move-right"
              style={{
                animationPlayState: paused || isRow2Paused ? "paused" : "running",
              }}
            >
              <div className="flex flex-nowrap">
                {secondRow.map((item, idx) => (
                  <TestimonialCard
                    key={`r2-primary-${item.id}-${idx}`}
                    item={item}
                    aria-hidden={idx >= secondRow.length}
                  />
                ))}
              </div>
              <div className="flex flex-nowrap" aria-hidden="true">
                {secondRow.map((item, idx) => (
                  <TestimonialCard
                    key={`r2-clone-${item.id}-${idx}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TestimonialsMarquee.displayName = "TestimonialsMarquee";

export default TestimonialsMarquee;
export const Component = TestimonialsMarquee;
