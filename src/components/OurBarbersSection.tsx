import TeamShowcase from './ui/team-showcase';

export function OurBarbersSection() {
  return (
    <section id="barbers" aria-labelledby="barbers-heading" className="our-barbers">
      <div className="our-barbers__inner">
        <header className="our-barbers__header"><div><p>MEET THE TEAM</p><h2 id="barbers-heading">Our <span>Barbers.</span></h2></div><p>A little personality.<br />A lot of attention to detail.</p></header>
        <TeamShowcase />
      </div>
    </section>
  );
}
