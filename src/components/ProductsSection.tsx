import React, { useEffect, useRef, useState } from 'react';
import './ProductsSection.css';
import runwayHtml from './runway/index.html?raw';
import runwayBaseStyles from './runway/style.css?raw';
import runwayStyles from './runway/embed.css?raw';
import runwayBootstrap from './runway/salon.js?raw';
import runwayEngine from './runway/app.js?raw';
import { PRODUCT_ITEMS, BUSINESS_INFO } from '../data/barbershopData';

// Keep the isolated document in Vite's dependency graph. Updating any source
// replaces the complete iframe document instead of leaving old public CSS alive.
const escapeScriptEnd = (source: string) => source.replace(/<\/script/gi, '<\\/script');
const runwayDocument = runwayHtml
  .replace(/<link\b[^>]*href="(?:style|embed)\.css"[^>]*\/?>/g, '')
  .replace('</head>', () => `<style>${runwayBaseStyles}\n${runwayStyles}</style></head>`)
  .replace(/<script\b[^>]*src="salon\.js"[^>]*><\/script>/, () => `<script>window.__RUNWAY_ENGINE_SOURCE = ${escapeScriptEnd(JSON.stringify(runwayEngine))};\n${escapeScriptEnd(runwayBootstrap)}</script>`);

/** The supplied runway export lives in its own document so the salon's global
 * theme, typography and section containment cannot alter the reference design. */
export const ProductsSection: React.FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(560);

  useEffect(() => {
    let viewportWidth = 0;
    let viewportHeight = 0;
    const measure = () => {
      const width = frameRef.current?.clientWidth || window.innerWidth;
      const height = window.innerHeight;
      // Ignore mobile browser chrome changes, matching the original runway.
      if (width < 750 && viewportWidth === width && Math.abs(height - viewportHeight) < 160) return;
      viewportWidth = width;
      viewportHeight = height;
      setFrameHeight(width < 750 ? 820 : 560);
    };
    const receiveHeight = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow || event.data?.type !== 'classic-cut-height') return;
      if ((frameRef.current?.clientWidth || 0) < 750 && Number.isFinite(event.data.height)) setFrameHeight(Math.max(680, Math.ceil(event.data.height)));
    };
    window.addEventListener('message', receiveHeight);
    measure();
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => { window.removeEventListener('resize', measure); window.removeEventListener('message', receiveHeight); observer.disconnect(); };
  }, []);

  return (
    <section id="products" className="products-reference" aria-labelledby="products-heading">
      <div className="products-reference__inner">
        <header className="products-reference__header">
          <div><p className="products-reference__eyebrow">SALON-TESTED ESSENTIALS FOR YOUR EVERYDAY</p>
          <h2 id="products-heading">Our <span>Products.</span></h2></div>
          <p className="products-reference__intro">The salon finish, beyond the chair.<br />Discover your daily essentials.</p>
        </header>
      <iframe
        ref={frameRef}
        title="Our Products — interactive grooming runway"
        srcDoc={runwayDocument}
        onLoad={event => event.currentTarget.contentWindow?.postMessage({
          type: 'classic-cut-products',
          products: PRODUCT_ITEMS,
          bookingUrl: BUSINESS_INFO.bookingUrl,
        }, window.location.origin)}
        className="products-reference__frame"
        style={{ height: frameHeight }}
      />
      </div>
    </section>
  );
};
