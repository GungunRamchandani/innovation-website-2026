import { useEffect, useState } from "react";
import SponsorCard from "../components/sponsors/SponsorCard";
import { sponsors } from "../components/sponsors/sponsorsData";
import WaveBackground from "../components/team/WaveBackground";
import "../pages/sponsors.css";

const GlobalBackButton = ({ destinationUrl, label = "Back to Events" }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleBackClick = () => {
    window.location.href = destinationUrl;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hide on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .global-back-btn {
            display: none !important;
          }
        }
      `}</style>

      <button
        onClick={handleBackClick}
        className="global-back-btn"
        style={{
          position: 'fixed',
          top: isScrolled ? '30px' : '140px', // 🔥 dynamic top
          left: '30px',
          zIndex: 9999,

          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 28px',
          borderRadius: '16px',

          background:
            'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',

          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: '600',

          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'top 0.4s ease, transform 0.3s ease, background 0.3s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, rgba(54, 63, 67, 0.9) 0%, rgba(22, 28, 30, 0.9) 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
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
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>

        <span>{label}</span>
      </button>
    </>
  );
};

function Sponsors() {
  return (
    <div className="sponsor-page">
      {/* THIS IS THE REDIRECT BUTTON */}
      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK"
      />
      <WaveBackground />
      {Object.entries(sponsors).map(([category, list]) => (
        <section key={category}>
          <h2 className={`title ${category.toLowerCase()}`}>
            {category} Sponsors
          </h2>


          <div className="grid">
            {list.map((item, i) => (
              <SponsorCard
                key={i}
                logo={item.logo}
                name={item.name}
                url={item.url}
                category={category.toLowerCase()}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


export default Sponsors;