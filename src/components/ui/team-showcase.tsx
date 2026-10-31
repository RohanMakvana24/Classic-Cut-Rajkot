import { SkeletonImage } from './skeleton-image';
import { useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import './team-showcase.css';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Chadrack',
    role: 'director of photography',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQFnmLdpZW78yA/profile-displayphoto-scale_200_200/B4DZvM8NB2JMAY-/0/1768669895649?e=2147483647&v=beta&t=5VGAB-2gYupLNaHvJHECollR25THd-3oR5wngGlQiY4',
    social: { twitter: '#', linkedin: '#', behance: '#' },
  },
  {
    id: '2',
    name: 'Mak VieSAinte',
    role: 'FOUNDER',
    image: '/assets/team/member-2.jpg',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '3',
    name: 'Osiris Balonga',
    role: 'LEAD FRONT-END',
    image: '/assets/team/member-3.jpg',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '4',
    name: 'Jacques',
    role: 'PRODUCT OWNER',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQE-Z7-S1LSYNQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1724143166545?e=2147483647&v=beta&t=6IPCwgOzblGt4p2fEdnY74gMbLyRHii5Ite3A39qQsY',
    social: { linkedin: '#' },
  },
  {
    id: '5',
    name: 'Riche Makso',
    role: 'CTO - PRODUCT DESIGNER',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQEkTAbZLlSrLg/profile-displayphoto-scale_200_200/B4DZoHdu8BGgAY-/0/1761061833315?e=2147483647&v=beta&t=Rg1dBTvq9X2heyhuhBwG2DsEkG65v0vQ35hF2FSeYns',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '6',
    name: 'Jemima',
    role: 'MAKE-UP ARTISTE',
    image: '/assets/team/member-6.jpg',
    social: { instagram: '#' } as TeamMember['social'],
  },
];


interface TeamShowcaseProps { members?: TeamMember[]; }

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId ?? selectedId;
  const columns = [0, 1, 2].map(column => members.filter((_, index) => index % 3 === column));
  return (
    <div className="team-showcase" onMouseLeave={() => setHoveredId(null)}>
      <div className="team-showcase__photos" aria-label="Team portraits">
        {columns.map((column, index) => <div className={`team-showcase__column team-showcase__column--${index + 1}`} key={index}>
          {column.map(member => <PhotoCard key={member.id} member={member} activeId={activeId} onHover={setHoveredId} onSelect={setSelectedId} />)}
        </div>)}
      </div>
      <div className="team-showcase__members" aria-label="Team members">
        {members.map(member => <MemberRow key={member.id} member={member} activeId={activeId} onHover={setHoveredId} onSelect={setSelectedId} />)}
      </div>
    </div>
  );
}

type MemberProps = { member: TeamMember; activeId: string | null; onHover: (id: string | null) => void; onSelect: (id: string | null) => void; };

function PhotoCard({ member, activeId, onHover, onSelect }: MemberProps) {
  const [failed, setFailed] = useState(false);
  return (
    <button type="button" className="team-showcase__photo" data-active={activeId === member.id} data-dimmed={activeId !== null && activeId !== member.id}
      aria-label={`View ${member.name}`} aria-pressed={activeId === member.id}
      onMouseEnter={() => onHover(member.id)} onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(member.id)} onBlur={() => onHover(null)} onClick={() => onSelect(member.id)}>
      {failed ? <span className="team-showcase__fallback" aria-label={`Photo unavailable for ${member.name}`}>{member.name.split(' ').map(part => part[0]).join('')}</span>
        : <SkeletonImage src={member.image} alt={member.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />}
    </button>
  );
}

const SOCIAL_ICONS = { twitter: FaTwitter, linkedin: FaLinkedinIn, instagram: FaInstagram, behance: FaBehance };
const SOCIAL_LABELS = { twitter: 'X / Twitter', linkedin: 'LinkedIn', instagram: 'Instagram', behance: 'Behance' };

function MemberRow({ member, activeId, onHover, onSelect }: MemberProps) {
  return (
    <div className="team-showcase__member" data-active={activeId === member.id} data-dimmed={activeId !== null && activeId !== member.id}
      onMouseEnter={() => onHover(member.id)} onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(member.id)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onHover(null); }}>
      <div className="team-showcase__name-row">
        <button type="button" className="team-showcase__name" onClick={() => onSelect(member.id)} aria-pressed={activeId === member.id}><span className="team-showcase__marker" aria-hidden="true" />{member.name}</button>
        <div className="team-showcase__socials">
          {(Object.entries(member.social ?? {}) as Array<[keyof typeof SOCIAL_ICONS, string]>).map(([network, href]) => {
            const Icon = SOCIAL_ICONS[network];
            return <a key={network} href={href} target={href === '#' ? undefined : '_blank'} rel="noopener noreferrer" aria-label={`${member.name} on ${SOCIAL_LABELS[network]}`} onClick={event => { if (href === '#') event.preventDefault(); }}><Icon size={12} /></a>;
          })}
        </div>
      </div>
      <p>{member.role}</p>
    </div>
  );
}
