import { ArrowUpRight, Star } from 'lucide-react';
import { BUSINESS_INFO, FAITHFUL_REVIEWS } from '../data/barbershopData';
import { StaggerTestimonials } from './ui/stagger-testimonials';

const reviews = FAITHFUL_REVIEWS.map(review => ({
  id: review.id,
  quote: review.verbatimQuote.replace(/^"+|"+$/g, ''),
  name: review.reviewerName,
  detail: 'Classic Cut Salon · Rajkot',
  highlight: review.mentionedHighlights[1] ?? review.mentionedHighlights[0],
}));

export function CustomerReviewsSection() {
  return (
    <section id="reviews" className="client-experiences" aria-labelledby="reviews-heading">
      <header className="client-experiences__header">
        <p className="client-experiences__eyebrow"><span /> WORDS FROM THE CHAIR <span /></p>
        <h2 id="reviews-heading">Inspiring Client<br /><span>Experiences.</span></h2>
        <p>Good hair. Great conversations. A reason to come back.</p>
        <a className="client-experiences__rating" href={BUSINESS_INFO.googleReviewsUrl} target="_blank" rel="noopener noreferrer">
          <span className="client-experiences__stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill="currentColor" />)}</span>
          <strong>{BUSINESS_INFO.googleSnapshot.rating}</strong><span>{BUSINESS_INFO.googleSnapshot.reviewCount}+ client ratings</span><ArrowUpRight size={14} />
        </a>
      </header>
      <StaggerTestimonials items={reviews} />
      <a className="client-experiences__link" href={BUSINESS_INFO.googleReviewsUrl} target="_blank" rel="noopener noreferrer">MORE CLIENT STORIES <ArrowUpRight size={15} /></a>
    </section>
  );
}
