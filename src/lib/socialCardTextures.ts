import type { ThemeMode } from '../data/barbershopData';
import { yieldToBrowser } from './scheduleWork';

export interface SocialCardProfile {
  id: string;
  platform: string;
  handle: string;
  category: string;
  headline: string;
  description: string;
  action: string;
  href: string;
}

const WIDTH = 1024;
const HEIGHT = 1440;
const TEXTURE_SCALE = 1;
const imageCache = new Map<string, Promise<HTMLImageElement | null>>();
function loadImage(src: string) {
  if (!imageCache.has(src)) imageCache.set(src, new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  }));
  return imageCache.get(src)!;
}

function rounded(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string) {
  context.beginPath(); context.roundRect(x, y, w, h, r); context.fillStyle = color; context.fill();
}

function cover(context: CanvasRenderingContext2D, image: HTMLImageElement | null, x: number, y: number, w: number, h: number, radius = 0) {
  if (!image) return;
  const scale = Math.max(w / image.width, h / image.height);
  context.save(); context.beginPath(); context.roundRect(x, y, w, h, radius); context.clip();
  context.drawImage(image, x + (w - image.width * scale) / 2, y + (h - image.height * scale) * .3, image.width * scale, image.height * scale);
  context.restore();
}

function text(context: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, color: string, weight = 500, family = 'Outfit') {
  context.font = `${weight} ${size}px "${family}", sans-serif`; context.fillStyle = color; context.fillText(value, x, y);
}

function lines(context: CanvasRenderingContext2D, value: string, x: number, y: number, width: number, size: number, color: string, lineHeight: number, weight = 500, family = 'Outfit') {
  context.font = `${weight} ${size}px "${family}", sans-serif`;
  const result: string[] = []; let line = '';
  for (const word of value.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > width && line) { result.push(line); line = word; } else line = next;
  }
  if (line) result.push(line);
  result.forEach((row, i) => text(context, row, x, y + i * lineHeight, size, color, weight, family));
  return result.length;
}

function arrow(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
  context.beginPath(); context.strokeStyle = color; context.lineWidth = 5; context.lineCap = 'round'; context.lineJoin = 'round';
  context.moveTo(x - 17, y + 17); context.lineTo(x + 17, y - 17); context.moveTo(x - 14, y - 17); context.lineTo(x + 17, y - 17); context.lineTo(x + 17, y + 14); context.stroke();
}

/** Draw card artwork with the site's fonts; no remote rendering service is used. */
export async function createSocialCardTextures(profile: SocialCardProfile, index: number, theme: ThemeMode, iconSvg: string, review?: { name: string; quote: string }) {
  await Promise.all([document.fonts.load('500 60px "Outfit"'), document.fonts.load('600 40px "Plus Jakarta Sans"')]);
  const [logo, quiff, crop, side, slick, icon] = await Promise.all([
    loadImage('/assets/brand/classic-cut-icon-cropped.webp'),
    profile.id === 'instagram' ? loadImage('/assets/hairstyles/modern-quiff.webp') : null,
    profile.id === 'instagram' ? loadImage('/assets/hairstyles/textured-crop.webp') : null,
    profile.id === 'instagram' ? loadImage('/assets/hairstyles/classic-side-part.webp') : null,
    profile.id === 'youtube' ? loadImage('/assets/hairstyles/slick-back-ai.webp') : null,
    loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`),
  ]);
  const dark = profile.id === 'instagram' || theme === 'dark';
  const paper = dark ? '#27201a' : '#fffdf9';
  const ink = dark ? '#fff8ed' : '#2d241b';
  const muted = dark ? '#bcae9b' : '#877766';
  const gold = '#dec094';
  const front = document.createElement('canvas'); front.width = WIDTH * TEXTURE_SCALE; front.height = HEIGHT * TEXTURE_SCALE;
  const c = front.getContext('2d'); if (!c) throw new Error('Canvas unavailable');
  c.scale(TEXTURE_SCALE, TEXTURE_SCALE);
  c.fillStyle = paper; c.fillRect(0, 0, WIDTH, HEIGHT);
  if (icon) c.drawImage(icon, 68, 124, 48, 48);
  text(c, profile.platform, 136, 163, 38, ink, 600);
  c.textAlign = 'right'; text(c, `0${index + 1}`, 956, 163, 30, muted); c.textAlign = 'left';
  rounded(c, 68, 240, 126, 126, 63, '#292119');
  c.beginPath(); c.arc(131, 303, 62, 0, Math.PI * 2); c.lineWidth = 2; c.strokeStyle = '#b89660'; c.stroke();
  if (logo) c.drawImage(logo, 91, 258, 80, 90);
  text(c, 'Classic Cut Salon', 224, 288, 45, ink, 600);
  text(c, profile.handle, 224, 340, 31, muted, 400, 'Plus Jakarta Sans');

  if (profile.id === 'instagram') {
    const gap = 10, w = (888 - gap * 2) / 3;
    [quiff, crop, side].forEach((image, i) => cover(c, image, 68 + i * (w + gap), 422, w, 400, 8));
  } else if (profile.id === 'facebook') {
    rounded(c, 68, 422, 888, 400, 16, '#edf1f3');
    if (icon) { c.save(); c.globalAlpha = .055; c.drawImage(icon, 700, 500, 250, 330); c.restore(); }
    text(c, 'OUR KIND OF COMMUNITY', 116, 491, 22, '#798b96', 600);
    text(c, 'Rooted in Rajkot.', 116, 594, 63, '#354653');
    text(c, 'Connected by style.', 116, 670, 63, '#354653');
    text(c, 'ARYA NAGAR · RAJKOT', 116, 770, 25, '#778a96');
  } else if (profile.id === 'google') {
    rounded(c, 68, 422, 888, 400, 16, '#f1ecdf');
    text(c, '“', 112, 552, 150, '#b59a6c', 400, 'Georgia');
    lines(c, review?.quote ?? 'Every visit has a story.', 116, 594, 776, 49, '#59452a', 63);
    rounded(c, 116, 736, 43, 43, 22, '#ddcfb1'); text(c, (review?.name ?? 'Client')[0], 129, 767, 26, '#6f5a36');
    text(c, review?.name ?? 'Classic Cut client', 177, 768, 26, '#85755d');
    c.textAlign = 'right'; text(c, 'Google review', 908, 768, 23, '#a2957d'); c.textAlign = 'left';
  } else {
    cover(c, slick, 68, 422, 888, 400, 16);
    c.fillStyle = '#00000035'; c.fillRect(68, 422, 888, 400);
    c.beginPath(); c.arc(512, 622, 67, 0, Math.PI * 2); c.fillStyle = '#ffffff26'; c.fill(); c.strokeStyle = '#ffffffcc'; c.lineWidth = 3; c.stroke();
    c.beginPath(); c.moveTo(496, 594); c.lineTo(496, 650); c.lineTo(540, 622); c.closePath(); c.fillStyle = '#fff'; c.fill();
    text(c, 'INSIDE THE CHAIR', 110, 779, 23, '#fff', 600);
  }
  text(c, profile.category, 68, 906, 24, muted);
  const count = lines(c, profile.headline, 68, 991, 888, 61, ink, 70);
  lines(c, profile.description, 68, count > 1 ? 1120 : 1091, 888, 32, muted, 48, 400, 'Plus Jakarta Sans');
  rounded(c, 68, 1220, 888, 135, 16, dark ? gold : '#30261d');
  text(c, profile.action, 116, 1304, 34, dark ? '#30251b' : '#fff7ea', 600, 'Plus Jakarta Sans');
  arrow(c, 882, 1287, dark ? '#30251b' : '#fff7ea');
  text(c, 'CLASSIC CUT / SOCIAL CLUB', 68, 1405, 20, muted);

  await yieldToBrowser();
  const back = document.createElement('canvas'); back.width = WIDTH * TEXTURE_SCALE; back.height = HEIGHT * TEXTURE_SCALE;
  const b = back.getContext('2d'); if (!b) throw new Error('Canvas unavailable');
  b.scale(TEXTURE_SCALE, TEXTURE_SCALE);
  b.fillStyle = '#27201a'; b.fillRect(0, 0, WIDTH, HEIGHT);
  b.strokeStyle = '#a789563d'; b.lineWidth = 2; b.strokeRect(48, 180, 928, 1000);
  if (icon) b.drawImage(icon, 68, 124, 48, 48);
  b.textAlign = 'right'; text(b, profile.platform.toUpperCase(), 956, 158, 27, gold); b.textAlign = 'center';
  if (logo) b.drawImage(logo, 406, 327, 212, 240);
  text(b, 'CLASSIC CUT', 512, 698, 89, '#fff7e9', 600);
  text(b, 'MEN’S SALON · RAJKOT', 512, 759, 30, gold);
  lines(b, profile.headline, 512, 896, 770, 53, '#f5e6cf', 67);
  text(b, profile.handle, 512, 1060, 31, '#bead94', 400, 'Plus Jakarta Sans');
  text(b, 'Tap to turn · Drag to swing', 512, 1140, 24, '#9f8d74');
  b.textAlign = 'left'; rounded(b, 68, 1220, 888, 135, 16, gold);
  text(b, profile.action, 116, 1304, 34, '#30251b', 600, 'Plus Jakarta Sans'); arrow(b, 882, 1287, '#30251b');
  text(b, 'CLASSIC CUT / SOCIAL CLUB', 68, 1405, 20, '#a48d6d');

  const strap = document.createElement('canvas'); strap.width = 320; strap.height = 192;
  const s = strap.getContext('2d'); if (!s) throw new Error('Canvas unavailable');
  s.scale(2, 2);
  s.fillStyle = '#211b16'; s.fillRect(0, 0, 160, 96); s.strokeStyle = '#bda27666'; s.setLineDash([4, 4]); s.beginPath(); s.moveTo(0, 8); s.lineTo(160, 8); s.moveTo(0, 88); s.lineTo(160, 88); s.stroke();
  s.textAlign = 'center'; text(s, 'CC', 80, 65, 47, gold, 600);
  return { front, back, strap };
}
