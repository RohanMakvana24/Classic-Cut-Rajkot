import { ArrowUpRight, Star } from 'lucide-react';
import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';
import {
  TestimonialsMarquee,
  type TestimonialItem,
} from './ui/grid-testimonials-marquee';

const REVIEW_COLORS = ['#1a73e8', '#a142f4', '#00897b', '#c5221f', '#e37400', '#455a64'];

const cleanQuote = (quote: string) =>
  quote
    .replace(/^["“]+|["”]+$/g, '')
    .trim();

const testimonials: TestimonialItem[] = FAITHFUL_REVIEWS.map((review, index) => ({
  id: review.id,
  name: review.reviewerName,
  handle: review.relativeDateSnapshot,
  avatarColor: REVIEW_COLORS[index % REVIEW_COLORS.length],
  content: cleanQuote(review.verbatimQuote),
  highlights: review.mentionedHighlights,
}));

const rowSplit = Math.ceil(testimonials.length / 2);
const firstRow = testimonials.slice(0, rowSplit);
const secondRow = testimonials.slice(rowSplit);

export function CustomerReviewsSection() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden border-y border-border bg-background py-20 md:py-28"
    >
      {/* Warm accent wash behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-primary/10 via-primary/[0.03] to-transparent"
      />

      <header className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <p className="flex items-center justify-center gap-3.5 text-[9.5px] font-semibold uppercase tracking-[0.26em] text-primary">
          <span aria-hidden="true" className="h-px w-7 bg-border" />
          Words from the chair
          <span aria-hidden="true" className="h-px w-7 bg-border" />
        </p>

        <h2
          id="reviews-heading"
          className="mt-5 font-display text-[clamp(36px,4.3vw,62px)] font-semibold leading-[1.03] tracking-[-0.055em] text-foreground"
        >
          Inspiring Client
          <br />
          <span className="text-primary">Experiences.</span>
        </h2>

        <p className="mt-5 text-[13px] text-muted-foreground">
          Good hair. Great conversations. A reason to come back.
        </p>

        <a
          className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-[4px] border border-border px-4 py-2.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          href={BUSINESS_INFO.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="flex gap-[2px] text-primary" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={13} strokeWidth={1.5} fill="currentColor" />
            ))}
          </span>
          <strong className="text-[12px] font-semibold text-foreground">
            {BUSINESS_INFO.googleSnapshot.rating}
          </strong>
          <span>{BUSINESS_INFO.googleSnapshot.reviewCount}+ client ratings</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>

      <div className="relative z-10 mt-12 md:mt-14">
        <TestimonialsMarquee
          firstRow={firstRow}
          secondRow={secondRow}
          duration={95}
          pauseOnHover
        />
      </div>

      <div className="relative z-10 mt-8 px-5 text-center">
        <a
          className="inline-flex items-center gap-2 border-b border-border pb-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:border-primary"
          href={BUSINESS_INFO.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          More client stories
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
