import { Scissors, SprayCan, Users } from 'lucide-react';

export function SalonServiceIcon({ serviceId, size = 16 }: { serviceId: string; size?: number }) {
  if (serviceId === 'kids-family-cuts') return <Users size={size} strokeWidth={1.6} aria-hidden="true" />;
  if (serviceId === 'consultation-lineup') return <SprayCan size={size} strokeWidth={1.6} aria-hidden="true" />;
  if (serviceId === 'skin-taper-fades') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 8h10v10a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V8ZM6 4h12v4H6zM8 2v2m4-2v2m4-2v2M10 12h4m-2 3v2" />
    </svg>
  );
  if (serviceId === 'beard-trim-grooming') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4 4 12 1-1 5L3 9l1-5Zm11 6 5 9a2 2 0 0 1-3 2l-6-10M7 6.5l5 .5" />
    </svg>
  );
  return <Scissors size={size} strokeWidth={1.6} aria-hidden="true" />;
}
