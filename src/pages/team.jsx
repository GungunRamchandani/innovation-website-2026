import CursorTrail from '../components/team/CursorTrail';
import GlitchHeader from '../components/team/GlitchHeader';
import MemberCard from '../components/team/MemberCard';
import MouseLight from '../components/team/MouseLight';
import { developmentTeam, technicalPanel } from '../components/team/team-data';
import WaveBackground from '../components/team/WaveBackground';
import './team.css';

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
          </div>

          <GlitchHeader text="Meet The Team" />
        </header>

        {/* ================= TECHNICAL PANEL ================= */}
        <section className="mb-24 w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-primary" />
              <h2 className="font-display text-2xl md:text-3xl text-primary tracking-widest uppercase text-glow">
                Technical Panel
              </h2>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-mono tracking-wider">
              // ARCHITECTS_OF_INNOVATION
            </p>
          </div>

          {/* Kajal Israni - Centered Solo */}
          <div className="team-centered-row">
            <div className="team-centered-card">
              <MemberCard
                key={technicalPanel[0].id}
                member={technicalPanel[0]}
                index={0}
                variant="large"
              />
            </div>
          </div>

          {/* 🔥 Responsive Grid - Remaining Members */}
          <div className="team-grid">
            {technicalPanel.slice(1).map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                index={idx + 1}
                variant="large"
              />
            ))}
          </div>
        </section>

        {/* ================= DEVELOPMENT TEAM ================= */}
        <section className="mb-16 w-full">
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

          {/* First 3 cards - Centered Row */}
          <div className="team-centered-row">
            {developmentTeam.slice(0, 3).map((member, idx) => (
              <div key={member.id} className="team-centered-card">
                <MemberCard
                  member={member}
                  index={idx}
                  variant="small"
                />
              </div>
            ))}
          </div>

          {/* 🔥 Responsive Grid - Remaining Members */}
          <div className="team-grid">
            {developmentTeam.slice(3).map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                index={idx + 3}
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