import React from 'react';
import { Phone, MapPin, Instagram, ArrowUpRight, ArrowUp, Calendar } from 'lucide-react';
import { BUSINESS_INFO, ThemeMode } from '../data/barbershopData';
import { BrandLogo } from './BrandLogo';
import './Footer.css';

interface FooterProps {
  theme?: ThemeMode;
  onOpenInspector: (initialTab?: 'layers' | 'tokens' | 'docs') => void;
}

const EXPLORE = [
  ['Our Services', '#services'], ['Grooming Essentials', '#products'],
  ['Meet Your Salon', '#about'], ['Our Barbers', '#barbers'],
  ['Style Inspiration', '#gallery'], ['Client Stories', '#reviews'],
];

export const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => (
  <footer className="salon-footer" aria-label="Classic Cut Salon footer">
    <div className="salon-footer__inner">
      <div className="salon-footer__invitation">
        <div><p className="salon-footer__eyebrow">YOUR NEXT CHAPTER STARTS WITH A FRESH CUT</p><h2>Look sharp.<br /><span>Feel like yourself.</span></h2></div>
        <a href={BUSINESS_INFO.bookingUrl} target="_blank" rel="noopener noreferrer" className="salon-footer__book"><span><Calendar size={16} /> LET’S SAVE YOU A CHAIR</span><span className="salon-footer__book-arrow"><ArrowUpRight size={24} strokeWidth={1.5} /></span></a>
      </div>

      <div className="salon-footer__grid">
        <div className="salon-footer__brand"><BrandLogo size="lg" theme={theme} className="salon-footer__logo" /><p>Thoughtful cuts. Confident finishes.<br />A little everyday luxury, right here in Rajkot.</p><span className="salon-footer__local"><span /> ARYA NAGAR, RAJKOT</span></div>
        <nav className="salon-footer__explore" aria-label="Footer navigation"><h3>TAKE A LOOK AROUND</h3><div>{EXPLORE.map(([label, href]) => <a href={href} key={href}>{label}<ArrowUpRight size={12} /></a>)}</div></nav>
        <div className="salon-footer__connect"><h3>LET’S TALK</h3><a href={BUSINESS_INFO.phoneHref}><Phone size={14} /><span>{BUSINESS_INFO.phoneDisplay}</span><ArrowUpRight size={13} /></a><a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={14} /><span>{BUSINESS_INFO.instagramHandle}</span><ArrowUpRight size={13} /></a><a href="#contact"><MapPin size={14} /><span>Pedak Cross Road, Opp. Umiya R.O.<br />Arya Nagar, Rajkot, Gujarat 360003</span><ArrowUpRight size={13} /></a></div>
      </div>

    </div>

    <div className="salon-footer__inner salon-footer__inner--bottom">
      <div className="salon-footer__bottom"><p>© {new Date().getFullYear()} Classic Cut Salon. All rights reserved.</p><span>Crafted for your everyday confidence.</span><a href="#top">Back to top <ArrowUp size={13} /></a></div>
    </div>
  </footer>
);
