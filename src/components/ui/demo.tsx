// Demo preview for the grid testimonials marquee component.
// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO

import { TestimonialsMarquee } from '@/components/ui/grid-testimonials-marquee';

const row = [
  {
    id: 'demo-1',
    name: 'Rajkot Local Client',
    handle: 'Verified Rajkot Review',
    avatarColor: '#1a73e8',
    content: 'Best men’s salon on Pedak Cross Road. They take time to understand the fade you want.',
    highlights: ['Pedak Cross Road'],
    rating: 5,
  },
  {
    id: 'demo-2',
    name: 'Ranchod Nagar Regular',
    handle: 'Verified Rajkot Review',
    avatarColor: '#a142f4',
    content: 'Sharp skin fade and clean beard lineup every single visit.',
    highlights: ['skin fade', 'beard lineup'],
    rating: 5,
  },
];

export default function DemoOne() {
  return <TestimonialsMarquee firstRow={row} secondRow={[...row].reverse()} />;
}
