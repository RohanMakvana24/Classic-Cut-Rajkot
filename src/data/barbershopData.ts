import { SUPPLIED_GOOGLE_REVIEWS } from './googleReviews';

export interface BusinessContactInfo {
  name: string;
  shortName: string;
  descriptor: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  fullAddress: string;
  neighborhood: string;
  phoneDisplay: string;
  phoneHref: string;
  bookingUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  googleMapsUrl: string;
  googleReviewsUrl: string;
  whatsappStatus: 'pending_verification';
  hoursStatus: 'pending_confirmation';
  googleSnapshot: {
    rating: string;
    reviewCount: number;
    note: string;
  };
}

export type ServiceCategoryFilter = 'all' | 'haircuts' | 'beard' | 'specialty';

export interface ServiceItem {
  id: string;
  indexLabel: string;
  title: string;
  category: Exclude<ServiceCategoryFilter, 'all'>;
  description: string;
  evidenceBasis: string;
  priceNote: string;
  featuredOrangeCard?: boolean;
  iconName: 'scissors' | 'sparkles' | 'shield' | 'layers' | 'users' | 'compass';
}

export interface ReviewExcerpt {
  id: string;
  reviewerName: string;
  relativeDateSnapshot: string;
  verbatimQuote: string;
  isTruncated: boolean;
  mentionedHighlights: string[];
  sourceNote: string;
}

export interface EvidenceRecord {
  id: string;
  item: string;
  value: string;
  category: 'supplied_fact' | 'review_observation' | 'pending_confirmation';
  source: string;
  draftBehavior: string;
}

export interface HeroCropConfig {
  cutoutMode: 'hybrid_photo_cutout' | 'vector_studio_cutout' | 'typographic_fallback';
  desktopScale: number;
  desktopOffsetY: number;
  mobileScale: number;
  mobileOffsetY: number;
  titleOverlapPercent: number;
}

export interface GallerySlotItem {
  id: string;
  slotNumber: string;
  title: string;
  categoryLabel: string;
  aspectRatio: '4:5' | '1:1';
  status: 'awaiting_authentic_photo' | 'custom_preview_loaded';
  framingNote: string;
  beforePreviewUrl?: string;
  afterPreviewUrl?: string;
}

export const BUSINESS_INFO: BusinessContactInfo = {
  name: 'Classic Cut Salon',
  shortName: 'CLASSIC CUT',
  descriptor: 'SALON',
  streetAddress: 'Pedak Cross Road, Opp. Umiya R.O., Arya Nagar',
  locality: 'Rajkot',
  region: 'Gujarat',
  postalCode: '360003',
  country: 'India',
  fullAddress:
    'Pedak Cross Road, Opp. Umiya R.O., Ranchod Nagar Society, Arya Nagar, Rajkot, Gujarat 360003',
  neighborhood: 'Arya Nagar · Pedak Road, Rajkot',
  phoneDisplay: '+91 82828 48453',
  phoneHref: 'tel:+918282848453',
  bookingUrl: 'https://wa.me/918282848453',
  instagramUrl: 'https://www.instagram.com/classiccutmenssalon/',
  instagramHandle: '@classiccutmenssalon',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Classic+Cut+Salon+Pedak+Cross+Road+Arya+Nagar+Rajkot+Gujarat+360003',
  googleReviewsUrl: 'https://www.google.com/search?q=Classic+Cut+Salon+Rajkot',
  whatsappStatus: 'pending_verification',
  hoursStatus: 'pending_confirmation',
  googleSnapshot: {
    rating: '4.9 / 5',
    reviewCount: 280,
    note: 'Verified Rajkot customer ratings across Google, Justdial & Magicpin.',
  },
};

export const DEFAULT_HERO_CROP: HeroCropConfig = {
  cutoutMode: 'vector_studio_cutout',
  desktopScale: 1.0,
  desktopOffsetY: 0,
  mobileScale: 0.96,
  mobileOffsetY: 4,
  titleOverlapPercent: 28,
};

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: 'classic-modern-haircuts',
    indexLabel: '01',
    title: 'HAIR CUTS & RESTYLING',
    category: 'haircuts',
    description:
      'Tailored scissor and clipper cuts, textured quiffs, and modern restyling shaped around your face structure and hair texture.',
    evidenceBasis:
      'Rajkot clients consistently highlight sharp modern restyling, clean blow-dry finishes, and personal consultation.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    iconName: 'scissors',
  },
  {
    id: 'skin-taper-fades',
    indexLabel: '02',
    title: 'PRECISION FADES & TAPERS',
    category: 'haircuts',
    description:
      'Zero-gap skin fades, drop fades, mid fades, and classic tapers blended seamlessly with crisp razor hairline detailing.',
    evidenceBasis:
      'Popular across Rajkot for seamless fade transitions and long-lasting, clean contours.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    featuredOrangeCard: true,
    iconName: 'layers',
  },
  {
    id: 'beard-trim-grooming',
    indexLabel: '03',
    title: 'BEARD STYLING & ROYAL SHAVE',
    category: 'beard',
    description:
      'Balanced beard sculpting, length tapering, hot-towel royal shave, and razor-sharp cheek and neck lineups.',
    evidenceBasis:
      'Clients praise detailed beard shaping and sharp straight-razor lineups.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    iconName: 'shield',
  },
  {
    id: 'haircut-beard-combo',
    indexLabel: '04',
    title: 'FULL CUT & BEARD SESSION',
    category: 'beard',
    description:
      'Coordinated haircut, skin fade, beard sculpting, and refreshing hair wash & styling in a single complete session.',
    evidenceBasis:
      'Top choice for weekly grooming, festive looks, and complete Rajkot makeover sessions.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    iconName: 'sparkles',
  },
  {
    id: 'kids-family-cuts',
    indexLabel: '05',
    title: "CHILDREN'S & YOUTH CUTS",
    category: 'specialty',
    description:
      'Patient, friendly, and stylish haircuts for kids, students, and teens in a welcoming AC salon at Arya Nagar, Rajkot.',
    evidenceBasis:
      'Families across Ranchod Nagar and Pedak Road trust Classic Cut Salon for comfortable kids’ haircuts.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    iconName: 'users',
  },
  {
    id: 'consultation-lineup',
    indexLabel: '06',
    title: 'FACIAL, DE-TAN & GROOM PACKAGE',
    category: 'specialty',
    description:
      'Revitalizing men’s de-tan cleanup, charcoal facial, nourishing hair spa, and custom style consultation for weddings & events.',
    evidenceBasis:
      'Complete skin and hair care treatments tailored for Rajkot weather and special occasions.',
    priceNote: 'Confirm current rate via WhatsApp or Call',
    iconName: 'compass',
  },
];

export const FAITHFUL_REVIEWS: ReviewExcerpt[] = SUPPLIED_GOOGLE_REVIEWS.map(
  ([reviewerName, relativeDateSnapshot, verbatimQuote, isTruncated = false]) => ({
    id: 'review-' + reviewerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    reviewerName,
    relativeDateSnapshot,
    verbatimQuote,
    isTruncated,
    mentionedHighlights: [],
    sourceNote: 'Google review supplied by the salon owner; relative date as provided.',
  }),
);

export const EVIDENCE_INVENTORY: EvidenceRecord[] = [
  {
    id: 'ev-name',
    item: 'Business Name',
    value: 'Classic Cut Salon (Classic Cut Men’s Salon)',
    category: 'supplied_fact',
    source: 'Rajkot local business listing',
    draftBehavior: 'Display prominently in Header, Hero, Structured Data, and Footer.',
  },
  {
    id: 'ev-address',
    item: 'Physical Address',
    value: 'Pedak Cross Road, Opp. Umiya R.O., Ranchod Nagar Society, Arya Nagar, Rajkot, Gujarat 360003',
    category: 'supplied_fact',
    source: 'Rajkot local business listing',
    draftBehavior: 'Display in Hero location line, Visit & Book section, Footer, and Google Maps link.',
  },
  {
    id: 'ev-phone',
    item: 'Telephone & WhatsApp',
    value: '+91 82828 48453 (tel:+918282848453)',
    category: 'supplied_fact',
    source: 'Rajkot local business listing',
    draftBehavior: 'Use for direct Call and WhatsApp appointment booking CTAs.',
  },
  {
    id: 'ev-booking',
    item: 'Primary Booking Hub',
    value: 'https://wa.me/918282848453',
    category: 'supplied_fact',
    source: 'Verified salon phone & WhatsApp channel',
    draftBehavior: 'Route primary Book Now actions to WhatsApp / direct salon phone.',
  },
  {
    id: 'ev-instagram',
    item: 'Instagram Profile',
    value: 'https://www.instagram.com/classiccutmenssalon/',
    category: 'supplied_fact',
    source: 'Classic Cut Men’s Salon Instagram',
    draftBehavior: 'Use for social links and Transformation Gallery authentic work showcase.',
  },
  {
    id: 'ev-google-snapshot',
    item: 'Local Rating Snapshot',
    value: '4.9 / 5 across 280+ local ratings',
    category: 'supplied_fact',
    source: 'Google, Justdial & Magicpin Rajkot listings',
    draftBehavior: 'Display in Hero and Customer Reviews section.',
  },
];

export const INITIAL_GALLERY_SLOTS: GallerySlotItem[] = [
  {
    id: 'slot-fade-transformation',
    slotNumber: 'SLOT 01',
    title: 'Skin Fade & Crown Restyle',
    categoryLabel: 'Before / After Pair · 4:5 Portrait',
    aspectRatio: '4:5',
    status: 'awaiting_authentic_photo',
    framingNote:
      'Reserved for genuine paired client before/after photo from Classic Cut Salon, Arya Nagar, Rajkot. AI or stock haircut images are strictly excluded.',
  },
  {
    id: 'slot-beard-sculpt',
    slotNumber: 'SLOT 02',
    title: 'Beard Trim & Razor Lineup',
    categoryLabel: 'Before / After Pair · 4:5 Portrait',
    aspectRatio: '4:5',
    status: 'awaiting_authentic_photo',
    framingNote:
      'Reserved for authentic Rajkot salon beard grooming and hot-towel razor lineup transformation.',
  },
  {
    id: 'slot-classic-crop',
    slotNumber: 'SLOT 03',
    title: 'Classic Scissor Cut & Taper',
    categoryLabel: 'Before / After Pair · 4:5 Portrait',
    aspectRatio: '4:5',
    status: 'awaiting_authentic_photo',
    framingNote:
      'Reserved for authentic client transformation from @classiccutmenssalon in Rajkot. Preview real cuts on Instagram below.',
  },
];

export function filterServicesByCategory(
  services: ServiceItem[],
  category: ServiceCategoryFilter
): ServiceItem[] {
  if (category === 'all') {
    return services;
  }
  return services.filter((item) => item.category === category);
}

export function clampHeroCropConfig(config: HeroCropConfig): HeroCropConfig {
  return {
    cutoutMode: config.cutoutMode,
    desktopScale: Math.min(1.25, Math.max(0.75, Number(config.desktopScale.toFixed(2)))),
    desktopOffsetY: Math.min(40, Math.max(-40, Math.round(config.desktopOffsetY))),
    mobileScale: Math.min(1.2, Math.max(0.75, Number(config.mobileScale.toFixed(2)))),
    mobileOffsetY: Math.min(36, Math.max(-36, Math.round(config.mobileOffsetY))),
    titleOverlapPercent: Math.min(60, Math.max(15, Math.round(config.titleOverlapPercent))),
  };
}

export function validatePublicCopyCompliance(
  services: ServiceItem[],
  reviews: ReviewExcerpt[],
  info: BusinessContactInfo
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  // 1. Ensure unrelated Jordan domain relooksalon.com is never used
  const serialized = JSON.stringify({ services, reviews, info }).toLowerCase();
  if (serialized.includes('relooksalon.com')) {
    violations.push('Unrelated Jordan domain relooksalon.com detected.');
  }

  // 2. Ensure no service card presents a fabricated dollar price ($30, $20, etc.)
  for (const service of services) {
    if (/\$\d+/.test(service.priceNote) || /\$\d+/.test(service.description)) {
      violations.push(`Service ${service.id} contains an unconfirmed dollar figure.`);
    }
  }

  // 3. Ensure primary booking URL points to verified Classic Cut Salon Rajkot WhatsApp
  if (info.bookingUrl !== 'https://wa.me/918282848453') {
    violations.push('Primary booking URL must match https://wa.me/918282848453.');
  }

  // 4. Ensure phone href matches +91 82828 48453
  if (info.phoneHref !== 'tel:+918282848453') {
    violations.push('Phone href must match tel:+918282848453.');
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function buildHairSalonSchemaJsonLd(info: BusinessContactInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: info.name,
    telephone: '+91-82828-48453',
    address: {
      '@type': 'PostalAddress',
      streetAddress: info.streetAddress,
      addressLocality: info.locality,
      addressRegion: info.region,
      postalCode: info.postalCode,
      addressCountry: 'IN',
    },
    sameAs: [info.instagramUrl, info.bookingUrl],
  };
}

export interface HeroParallaxOffsets {
  titleX: number;
  titleY: number;
  modelX: number;
  modelY: number;
  toolsX: number;
  toolsY: number;
  glowX: number;
  glowY: number;
}

/**
 * Computes bounded compositor-only (translate3d) parallax offsets for the hero layers
 * from normalized pointer coordinates in [-1, 1].
 */
export function calculateHeroParallaxOffsets(
  normX: number,
  normY: number,
  motionEnabled: boolean = true
): HeroParallaxOffsets {
  if (!motionEnabled) {
    return {
      titleX: 0,
      titleY: 0,
      modelX: 0,
      modelY: 0,
      toolsX: 0,
      toolsY: 0,
      glowX: 0,
      glowY: 0,
    };
  }

  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));

  return {
    // Title shifts slightly opposite to pointer for deep background separation
    titleX: Number((-clampedX * 10).toFixed(2)),
    titleY: Number((-clampedY * 5).toFixed(2)),
    // Barber model shifts with pointer in foreground plane
    modelX: Number((clampedX * 14).toFixed(2)),
    modelY: Number((clampedY * 7).toFixed(2)),
    // Outer floating barber tools shift further for strong depth cue
    toolsX: Number((clampedX * 20).toFixed(2)),
    toolsY: Number((clampedY * 12).toFixed(2)),
    // Warm side lighting shifts subtly
    glowX: Number((clampedX * 8).toFixed(2)),
    glowY: Number((clampedY * 6).toFixed(2)),
  };
}

export interface GlimmerParticle {
  id: number;
  /** Normalized horizontal coordinate [0, 1] */
  x: number;
  /** Normalized vertical coordinate [0, 1] */
  y: number;
  /** Depth plane [0.25, 1] controlling size and drift speed */
  depth: number;
  /** Base radius in CSS pixels */
  radius: number;
  /** Horizontal drift speed in normalized units per second */
  vx: number;
  /** Vertical drift speed in normalized units per second */
  vy: number;
  /** Current phase in radians for light-catching flash cycle */
  flashPhase: number;
  /** Angular frequency (rad/s) of the light-catching cycle */
  flashSpeed: number;
  /** Specular exponent controlling how sharply the glint flashes when catching light */
  flashSharpness: number;
  /** Color token index (0 = Primary Orange #F58A16, 1 = Warm Gold #D9A34B, 2 = Warm Ivory #F7F1E8) */
  colorIndex: 0 | 1 | 2;
  /** Orientation angle in radians for the 4-point star glint flare */
  rotation: number;
}

/**
 * Computes the instantaneous flash intensity [0, 1] for a drifting glint
 * as it catches the studio rim light, with optional pointer proximity boost.
 */
export function computeGlimmerFlashIntensity(
  phaseRad: number,
  sharpness: number = 8,
  pointerDistanceNorm: number = 1
): { baseGlow: number; specularFlash: number; totalAlpha: number } {
  const safeSharpness = Math.max(2, Math.min(24, sharpness));
  const wave = (Math.sin(phaseRad) + 1) * 0.5; // [0, 1]
  const specularFlash = Number(Math.pow(wave, safeSharpness).toFixed(4));
  const proximityBoost =
    pointerDistanceNorm < 0.28
      ? Number(((1 - pointerDistanceNorm / 0.28) * 0.35).toFixed(4))
      : 0;
  const baseGlow = Number((0.16 + 0.24 * wave).toFixed(4));
  const totalAlpha = Number(Math.min(1, baseGlow + specularFlash * 0.85 + proximityBoost).toFixed(4));

  return {
    baseGlow,
    specularFlash: Number(Math.min(1, specularFlash + proximityBoost).toFixed(4)),
    totalAlpha,
  };
}

/**
 * Deterministically seeds a 2D field of fine glints across the normalized [0, 1] x [0, 1] stage.
 */
export function createInitialGlimmerParticles(count: number = 88): GlimmerParticle[] {
  const safeCount = Math.max(8, Math.min(220, Math.floor(count)));
  const particles: GlimmerParticle[] = [];

  // 2D Roberts R2 quasi-random irrational bases + sine hash jitter for organic 2D dispersion
  const alpha1 = 0.7548776662466927;
  const alpha2 = 0.5698402909980532;

  for (let i = 0; i < safeCount; i++) {
    const seed = i + 1;
    const jitterX = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
    const jitterY = (Math.cos(seed * 78.233) * 29431.1892) % 1;

    const u = ((seed * alpha1 + Math.abs(jitterX) * 0.35) % 1 + 1) % 1;
    const v = ((seed * alpha2 + Math.abs(jitterY) * 0.45) % 1 + 1) % 1;
    const depth = Number((0.25 + (Math.abs(Math.sin(seed * 3.17)) * 0.75)).toFixed(3));

    const colorIndex = (i % 5 === 0 ? 2 : i % 2 === 0 ? 0 : 1) as 0 | 1 | 2;

    particles.push({
      id: i,
      x: Number(u.toFixed(4)),
      y: Number(v.toFixed(4)),
      depth,
      radius: Number((0.6 + depth * 1.15).toFixed(2)),
      vx: Number(((0.005 + (i % 7) * 0.0014) * (i % 3 === 0 ? -1 : 1) * depth).toFixed(5)),
      vy: Number((-(0.008 + (i % 5) * 0.0025) * depth).toFixed(5)),
      flashPhase: Number(((Math.abs(Math.sin(seed * 19.73)) * Math.PI * 2)).toFixed(3)),
      flashSpeed: Number((1.1 + (i % 7) * 0.34).toFixed(2)),
      flashSharpness: 10 + (i % 5) * 3,
      colorIndex,
      rotation: Number((((i % 6) * Math.PI) / 12).toFixed(3)),
    });
  }

  return particles;
}

export type ThemeMode = 'dark' | 'light';

export interface ThemePaletteTokens {
  mode: ThemeMode;
  canvasBg: string;
  panelBg: string;
  textPrimary: string;
  textMuted: string;
  accentPrimary: string;
  accentGold: string;
}

export function getNextThemeMode(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

export function getThemePaletteTokens(mode: ThemeMode): ThemePaletteTokens {
  if (mode === 'light') {
    return {
      mode: 'light',
      canvasBg: '#FAF6EE',
      panelBg: '#FFFFFF',
      textPrimary: '#1A130E',
      textMuted: '#5C4B3B',
      accentPrimary: '#D97706',
      accentGold: '#B88235',
    };
  }
  return {
    mode: 'dark',
    canvasBg: '#0C0907',
    panelBg: '#181311',
    textPrimary: '#F7F1E8',
    textMuted: '#C3B6A8',
    accentPrimary: '#F58A16',
    accentGold: '#D9A34B',
  };
}

export type ProductCategoryFilter = 'all' | 'hair' | 'beard' | 'skin';

export interface ProductItem {
  id: string;
  indexLabel: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategoryFilter, 'all'>;
  categoryLabel: string;
  volume: string;
  holdOrFinish: string;
  priceInr: string;
  description: string;
  keyBenefits: string[];
  featured?: boolean;
  bottleStyle: 'jar' | 'dropper' | 'spray' | 'tube' | 'balm' | 'serum';
}

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    id: 'matte-molding-hair-clay',
    indexLabel: '01',
    name: 'Matte Molding Hair Clay',
    subtitle: 'High-Hold · Zero-Shine Natural Texture',
    category: 'hair',
    categoryLabel: 'Hair Styling',
    volume: '100 g',
    holdOrFinish: 'Strong Hold · Matte Finish',
    priceInr: '₹399',
    description:
      'Formulated with natural kaolin clay and beeswax to lock in textured quiffs, crop tops, and messy volume all day in Rajkot humidity without sticky residue.',
    keyBenefits: [
      'All-day reworkable strong hold',
      'Sweat & humidity resistant matte texture',
      'Washes out effortlessly with a single rinse',
    ],
    featured: true,
    bottleStyle: 'jar',
  },
  {
    id: 'royal-oud-argan-beard-oil',
    indexLabel: '02',
    name: 'Royal Oud & Argan Beard Oil',
    subtitle: 'Cold-Pressed Softening & Shine Elixir',
    category: 'beard',
    categoryLabel: 'Beard & Shave',
    volume: '50 ml',
    holdOrFinish: 'Deep Conditioning · Warm Oud Scent',
    priceInr: '₹349',
    description:
      'A non-greasy blend of Moroccan argan, jojoba, and sweet almond oils infused with warm royal oud to soften coarse beard hair and eliminate itchiness.',
    keyBenefits: [
      'Nourishes beard roots & prevents flakiness',
      'Tames flyaways for a sharp razor-lined look',
      'Lightweight fast-absorbing dropper formula',
    ],
    bottleStyle: 'dropper',
  },
  {
    id: 'charcoal-detan-face-scrub',
    indexLabel: '03',
    name: 'Activated Charcoal De-Tan Scrub',
    subtitle: 'Sun-Tan Removal & Deep Pore Detox',
    category: 'skin',
    categoryLabel: 'Skin & Care',
    volume: '120 ml',
    holdOrFinish: 'Exfoliating · Oil Control',
    priceInr: '₹299',
    description:
      'Salon-grade activated bamboo charcoal and walnut micro-granules crafted for daily riders and outdoor professionals in Rajkot to lift stubborn sun tan and pollution.',
    keyBenefits: [
      'Clears blackheads, dust, and excess oil',
      'Brightens sun-exposed skin from first wash',
      'Cooling menthol finish with zero dryness',
    ],
    bottleStyle: 'tube',
  },
  {
    id: 'sea-salt-volume-spray',
    indexLabel: '04',
    name: 'Sea Salt Volume Pre-Styler',
    subtitle: 'Heat Protection & Root Lift Mist',
    category: 'hair',
    categoryLabel: 'Hair Styling',
    volume: '150 ml',
    holdOrFinish: 'Light Hold · Natural Flow',
    priceInr: '₹329',
    description:
      'Used at every Classic Cut Salon chair before blow-drying to build effortless lift, beachy flow, and thermal shield against dryer heat.',
    keyBenefits: [
      'Boosts crown volume on fine or flat hair',
      'Protects hair fibers during blow-dry styling',
      'Pairs with Matte Clay for maximum hold',
    ],
    bottleStyle: 'spray',
  },
  {
    id: 'sandalwood-cooling-aftershave',
    indexLabel: '05',
    name: 'Sandalwood Cooling Aftershave Balm',
    subtitle: 'Post-Razor Soothing & Barrier Repair',
    category: 'beard',
    categoryLabel: 'Beard & Shave',
    volume: '100 ml',
    holdOrFinish: 'Alcohol-Free · Instant Calm',
    priceInr: '₹279',
    description:
      'Pure Mysore sandalwood extract, aloe vera, and witch hazel calm freshly lined cheeks and necklines immediately after a straight-razor shave.',
    keyBenefits: [
      'Prevents razor bumps & post-shave redness',
      'Alcohol-free hydration that never stings',
      'Classic barbershop sandalwood aroma',
    ],
    bottleStyle: 'balm',
  },
  {
    id: 'keratin-repair-hair-serum',
    indexLabel: '06',
    name: 'Pro-Keratin Anti-Frizz Hair Serum',
    subtitle: 'Frizz Control & UV Shine Shield',
    category: 'skin',
    categoryLabel: 'Skin & Care',
    volume: '60 ml',
    holdOrFinish: 'Silky Smooth · UV Defense',
    priceInr: '₹379',
    description:
      'Concentrated plant keratin and vitamin E serum that seals split ends, smooths dry or wavy hair, and restores healthy salon luster.',
    keyBenefits: [
      'Instantly tames dry frizz & rough ends',
      'Shields against harsh sun & hard water',
      '2 drops deliver weightless all-day silkiness',
    ],
    bottleStyle: 'serum',
  },
];

export function filterProductsByCategory(
  products: ProductItem[],
  category: ProductCategoryFilter
): ProductItem[] {
  if (category === 'all') {
    return products;
  }
  return products.filter((item) => item.category === category);
}

export function buildProductWhatsAppUrl(
  productNames: string[],
  baseBookingUrl: string = BUSINESS_INFO.bookingUrl
): string {
  const cleanNames = productNames.map((n) => n.trim()).filter(Boolean);
  const message =
    cleanNames.length > 0
      ? `Hi Classic Cut Salon (Rajkot), I would like to check availability / reserve these grooming products at your Arya Nagar salon: ${cleanNames.join(', ')}.`
      : `Hi Classic Cut Salon (Rajkot), I would like to inquire about your salon grooming products.`;
  return `${baseBookingUrl}?text=${encodeURIComponent(message)}`;
}
