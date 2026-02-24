import MemberCard from '../components/team/MemberCard';
import WaveBackground from '../components/team/WaveBackground';
import MouseLight from '../components/team/MouseLight';
import CursorTrail from '../components/team/CursorTrail';
import GlitchHeader from '../components/team/GlitchHeader';
import { technicalPanel, developmentTeam } from '../components/team/team-data';
import './team.css';

const GlobalBackButton = ({ destinationUrl, label = "Back to Events" }) => {
  const handleBackClick = () => {
    window.location.href = destinationUrl;
  };

  return (
    <button
      onClick={handleBackClick}
      style={{
        // Positioning
        position: 'fixed',
        top: '30px',
        left: '30px',
        zIndex: 9999,

        // Layout & Shape
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 28px',
        borderRadius: '16px',

        // Glassmorphism Styling
        background: 'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)',
        backdropFilter: 'blur(10px)', // This creates the frosted glass look
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        cursor: 'pointer',

        // Typography
        fontFamily: "'Inter', sans-serif",
        fontSize: '16px',
        fontWeight: '600',

        // Effects
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        transition: 'all 0.3s ease-in-out',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(54, 63, 67, 0.9) 0%, rgba(22, 28, 30, 0.9) 100%)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Modern Slim Arrow Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>

      <span>{label}</span>
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