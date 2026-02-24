import MemberCard from '../components/team/MemberCard';
import WaveBackground from '../components/team/WaveBackground';
import MouseLight from '../components/team/MouseLight';
import CursorTrail from '../components/team/CursorTrail';
import GlitchHeader from '../components/team/GlitchHeader';
import { technicalPanel, developmentTeam } from '../components/team/team-data';
import './team.css';

const GlobalBackButton = ({ destinationUrl, label = "RETURN TO HOME" }) => {
  const handleBackClick = () => {
    // This will send the user to the same URL every time
    window.location.href = destinationUrl;
  };

  return (
    <button
      onClick={handleBackClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#111',
        color: '#12c4be', // Matches your drone/neon theme
        border: '2px solid #0f6e7d',
        cursor: 'pointer',
        zIndex: 1000,
        fontWeight: 'bold'
      }}
    >
      ← {label}
    </button>
  );
};

export default function Team() {
  return (
    <div className="min-h-screen relative overflow-x-hidden text-foreground selection:bg-primary selection:text-black">
      {/* THIS IS THE REDIRECT BUTTON */}
      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK TO HOME"
      />
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

          </div>

          {/* 🔥 Responsive Grid */}
          <div className="team-grid">
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

          {/* 🔥 Responsive Grid */}
          <div className="team-grid">
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