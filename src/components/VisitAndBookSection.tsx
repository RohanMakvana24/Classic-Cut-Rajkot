import React, { useState } from 'react';
import { MapPin, Phone, Calendar, Navigation, ArrowUpRight, Plus, Minus, RotateCcw, Copy, Check } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import './VisitAndBookSection.css';

const PLACE_ID = 'ChIJDz3mzNO1WTkR7HhDiGWnnB4';
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=Classic+Cut+Salon+Rajkot&destination_place_id=${PLACE_ID}`;

export const VisitAndBookSection: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.fullAddress);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="salon-visit">
      <div className="salon-visit__heading">
        <div><p className="salon-visit__eyebrow">YOUR NEXT GOOD HAIR DAY STARTS HERE</p><h2 id="contact-heading">VISIT &amp; <span>BOOK</span></h2></div>
        <p>A familiar corner. A fresh new look.<br />Find your chair at Classic Cut Salon, Rajkot.</p>
      </div>

      <div className="salon-location">
        <div className="salon-location__visual">
            <div className="salon-location__world" style={{ transform: `scale(${zoom})` }}>
              <img src="/assets/location/classic-cut-neighborhood.png" alt="Miniature architectural illustration inspired by Classic Cut Salon’s ivory storefront, gold arched entrance and potted palms" loading="lazy" decoding="async" draggable={false} />
              <a className="salon-location__pin" href={DIRECTIONS} target="_blank" rel="noopener noreferrer" aria-label="Get directions to Classic Cut Salon">
                <span className="salon-location__pin-label">CLASSIC CUT <span>YOUR CHAIR IS HERE</span></span>
                <MapPin aria-hidden="true" /><span className="salon-location__pin-ring" />
              </a>
            </div>

        </div>
        <div className="salon-location__veil" aria-hidden="true" />
        <div className="salon-location__intro">
          <p className="salon-visit__eyebrow">OUR LITTLE CORNER OF RAJKOT</p>
          <h3>Great hair.<br />{' '}Right here.</h3>
          <p>Pedak Cross Road,<br />opposite Umiya R.O., Arya Nagar.</p>
          <a className="salon-visit__button" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17} /></a>
        </div>


        <a className="salon-location__shop" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">
          <div className="salon-location__shop-photo"><img src="/assets/location/classic-cut-neighborhood.png" alt="Classic Cut Salon storefront illustration" loading="lazy" /></div>
          <div className="salon-location__shop-info"><div><strong>Classic Cut Salon</strong><p><MapPin size={13} /><span>Pedak Cross Road · Arya Nagar<br />Rajkot, Gujarat 360003</span></p></div><span className="salon-location__shop-arrow"><ArrowUpRight size={18} /></span></div>
        </a>

        <div className="salon-location__zoom" role="group" aria-label="Illustration zoom">
          <button type="button" aria-label="Zoom in illustration" disabled={zoom >= 1.4} onClick={() => setZoom(value => Math.min(1.4, +(value + .1).toFixed(1)))}><Plus size={18} /></button>
          <button type="button" aria-label="Zoom out illustration" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, +(value - .1).toFixed(1)))}><Minus size={18} /></button>
          <button type="button" aria-label="Reset illustration view" onClick={() => setZoom(1)}><RotateCcw size={15} /></button>
        </div>
        <span className="salon-location__caption">Storefront-inspired illustration</span>
      </div>

      <div className="salon-visit__details">
        <div className="salon-visit__address"><span className="salon-visit__detail-icon"><Navigation size={20} /></span><div><h3>Find us in Arya Nagar</h3><p>{BUSINESS_INFO.fullAddress}</p><button type="button" onClick={copyAddress}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Address copied' : 'Copy address'}</button></div></div>
        <div className="salon-visit__booking"><div><p className="salon-visit__eyebrow">LET’S MAKE IT YOUR DAY</p><h3>Your chair is waiting.</h3><p>Message us for appointments and today’s availability.</p></div><div className="salon-visit__actions"><a className="salon-visit__button" href={BUSINESS_INFO.bookingUrl} target="_blank" rel="noopener noreferrer"><Calendar size={16} /> Book on WhatsApp <ArrowUpRight size={16} /></a><a className="salon-visit__call" href={BUSINESS_INFO.phoneHref}><Phone size={14} /> {BUSINESS_INFO.phoneDisplay}</a></div></div>
      </div>
    </section>
  );
};
