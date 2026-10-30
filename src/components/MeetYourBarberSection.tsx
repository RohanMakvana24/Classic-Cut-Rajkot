import React, { useState } from 'react';
import { ArrowUpRight, Calendar, Check, Copy, Instagram, Scissors, Users, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import './MeetYourBarberSection.css';

const CONSULTATION_TOPICS = [
  { id: 'fade-style', label: 'Haircut & Fade', summary: 'a tailored haircut and fade' },
  { id: 'beard-sculpt', label: 'Beard Styling', summary: 'beard styling and a razor lineup' },
  { id: 'kids-cut', label: 'Kids Haircut', summary: 'a patient kids haircut' },
  { id: 'full-restyling', label: 'Complete Grooming', summary: 'a complete grooming session' },
];
const CRAFT_POINTS = [
  { icon: MessageCircle, title: 'We listen first', detail: 'Your look. Your routine.' },
  { icon: Scissors, title: 'Made for you', detail: 'A finish that feels right.' },
  { icon: Users, title: 'All ages welcome', detail: 'Big smiles. Little details.' },
];

export const MeetYourBarberSection: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['fade-style']);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const toggleTopic = (id: string) => {
    setSelectedTopics(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setCopyStatus('idle');
  };
  const selectedServices = CONSULTATION_TOPICS.filter(topic => selectedTopics.includes(topic.id));
  const bookingNote = selectedServices.length
    ? `Hi Classic Cut Salon, I would like to book ${selectedServices.map(topic => topic.summary).join(' and ')}.`
    : 'Hi Classic Cut Salon, I would like to book an appointment.';
  const bookingUrl = `${BUSINESS_INFO.bookingUrl}?text=${encodeURIComponent(bookingNote)}`;
  const copyNote = async () => {
    try { await navigator.clipboard.writeText(bookingNote); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="meet-salon">
      <div className="meet-salon__inner">
        <header className="meet-salon__header">
          <div><p className="meet-salon__eyebrow">A LITTLE ABOUT YOUR NEXT FAVOURITE PLACE</p><h2 id="about-heading">Meet Your <span>Salon.</span></h2></div>
          <a className="meet-salon__instagram" href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit Classic Cut Salon on Instagram"><Instagram size={15} /><span>{BUSINESS_INFO.instagramHandle}</span><ArrowUpRight size={16} /></a>
        </header>

        <div className="meet-salon__story">
          <div className="meet-salon__copy">
            <span className="meet-salon__place"><span /> CLASSIC CUT · ARYA NAGAR</span>
            <h3>Big style.<br /><span>Little legends.</span></h3>
            <p>A fresh fade for him. A first big-boy cut for the little one. A good conversation before every snip.</p>
            <p>We shape every look around your face, your routine and what makes you, you.</p>
            <div className="meet-salon__craft">
              {CRAFT_POINTS.map(({ icon: Icon, title, detail }) => <div key={title}><span><Icon size={17} strokeWidth={1.5} /></span><div><strong>{title}</strong><p>{detail}</p></div></div>)}
            </div>
          </div>
          <div className="meet-salon__stage">
            <div className="meet-salon__arch" aria-hidden="true"><span>GOOD<br />HAIR<br />DAYS.</span></div>
            <span className="meet-salon__orbit meet-salon__orbit--one" aria-hidden="true" />
            <span className="meet-salon__orbit meet-salon__orbit--two" aria-hidden="true" />
            <div className="meet-salon__floor" aria-hidden="true" />
            <img src="/assets/characters/men-and-kids-3d.png" alt="Friendly 3D adult and child characters with freshly styled hair, standing together" loading="lazy" decoding="async" width="1254" height="1254" />
            <span className="meet-salon__sticker"><Scissors size={14} /> A little confidence<br /><strong>looks good on everyone.</strong></span>
            <span className="meet-salon__stage-caption">MEN’S GROOMING <span>✦</span> KIDS’ CUTS</span>
          </div>
        </div>

        <div className="meet-salon__planner">
          <div className="meet-salon__services">
            <div className="meet-salon__planner-title"><span className="meet-salon__step">01</span><div><h3>Who’s getting a fresh look?</h3><p>Pick one or more services. We’ll take it from here.</p></div></div>
            <div className="meet-salon__topics" role="group" aria-label="Choose services">
              {CONSULTATION_TOPICS.map(topic => <button type="button" key={topic.id} aria-pressed={selectedTopics.includes(topic.id)} onClick={() => toggleTopic(topic.id)}><span className="meet-salon__checkbox">{selectedTopics.includes(topic.id) && <Check size={12} />}</span>{topic.label}</button>)}
            </div>
            <span className="meet-salon__selected" aria-live="polite">{selectedTopics.length ? `${selectedTopics.length} ${selectedTopics.length === 1 ? 'service' : 'services'} selected` : 'Not sure? Start a conversation with us.'}</span>
          </div>
          <div className="meet-salon__booking">
            <div className="meet-salon__planner-title"><span className="meet-salon__step">02</span><div><h3>Let’s save you a chair.</h3><p>Your message is ready to go.</p></div></div>
            <p className="meet-salon__note">“{bookingNote}”</p>
            <div className="meet-salon__actions"><button type="button" onClick={copyNote} aria-label="Copy booking note">{copyStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}{copyStatus === 'copied' ? 'Copied' : 'Copy note'}</button><a href={bookingUrl} target="_blank" rel="noopener noreferrer"><Calendar size={16} /> Book on WhatsApp <ArrowUpRight size={15} /></a></div>
            {copyStatus === 'error' && <p className="meet-salon__copy-error" role="status">Couldn’t copy. Your message will still open on WhatsApp.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};
