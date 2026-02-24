import SponsorCard from "../components/sponsors/SponsorCard";
import { sponsors } from "../components/sponsors/sponsorsData";
import "../pages/sponsors.css";

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

function Sponsors() {
  return (
    <div className="sponsor-page">
      {/* THIS IS THE REDIRECT BUTTON */}
      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK TO HOME"
      />
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