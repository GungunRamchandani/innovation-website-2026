import MemberCard from '../components/team/MemberCard';
import WaveBackground from '../components/team/WaveBackground';
import MouseLight from '../components/team/MouseLight';
import CursorTrail from '../components/team/CursorTrail';
import GlitchHeader from '../components/team/GlitchHeader';
import { technicalPanel, developmentTeam } from '../components/team/team-data';

export default function Team() {
  return (
    <div className="min-h-screen relative overflow-x-hidden text-foreground selection:bg-primary selection:text-black">
      
      {/* Background Effects */}
      <WaveBackground />
      <MouseLight />
      <CursorTrail />

      <main className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex flex-col">
        
        {/* ================= HEADER ================= */}
        <header className="text-center mb-20 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.3em]">
              System Online
            </span>
          </div>

          <GlitchHeader text="Meet The Team" />

          <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed font-light">
            Architects of the future. We are the digital vanguard pushing the boundaries of what is possible.
          </p>
        </header>

        {/* ================= TECHNICAL PANEL ================= */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-primary" />
              <h2 className="font-display text-2xl md:text-3xl text-primary tracking-widest uppercase text-glow">
                Technical Panel
              </h2>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-mono tracking-wider">
              // CORE_SYSTEM_ARCHITECTS
            </p>
          </div>

          {/* 🔥 4 Cards Per Row */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
              rowGap: '3rem'
            }}
          >
            {technicalPanel.map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                index={idx}
                variant="large"
              />
            ))}
          </div>
        </section>

        {/* ================= DEVELOPMENT TEAM ================= */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-purple-500" />
              <h2
                className="font-display text-2xl md:text-3xl text-purple-400 tracking-widest uppercase"
                style={{
                  textShadow:
                    '0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3)',
                }}
              >
                Development Team
              </h2>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            <p className="text-muted-foreground text-sm font-mono tracking-wider">
              // CODE_BUILDERS
            </p>
          </div>

          {/* 🔥 4 Cards Per Row */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              rowGap: '2.5rem',
              width: 'fit-content',
              margin: '0 auto'
            }}
          >
            {developmentTeam.map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                index={idx}
                variant="small"
              />
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="mt-auto pt-20 pb-8 text-center border-t border-white/5">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            &copy; 2024 TechFest Core System • Version 2.0.4
          </p>
        </footer>
      </main>
    </div>
  );
}