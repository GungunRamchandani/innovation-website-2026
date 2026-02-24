import { useState } from 'react';
import Timeline from '../components/timeline/timeline';
import Timeline2 from '../components/timeline/timeline2';
import Timeline3 from '../components/timeline/timeline3';
import './timeline.css';

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

function timeline() {
  const [selectedDay, setSelectedDay] = useState(1);

  const renderContent = () => {
    switch (selectedDay) {
      case 1:
        return <Timeline />;
      case 2:
        return <Timeline2 />;
      case 3:
        return <Timeline3 />;
      default:
        return <Timeline />;
    }
  };

  return (
    <div className="App">
      {/* THIS IS THE REDIRECT BUTTON */}
      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK TO HOME"
      />

      <main>
        <div className="nav-overlay">
          <button
            className={`nav-link ${selectedDay === 1 ? 'active' : ''}`}
            onClick={() => setSelectedDay(1)}
          >
            DAY 1
          </button>
          <button
            className={`nav-link ${selectedDay === 2 ? 'active' : ''}`}
            onClick={() => setSelectedDay(2)}
          >
            DAY 2
          </button>
          <button
            className={`nav-link ${selectedDay === 3 ? 'active' : ''}`}
            onClick={() => setSelectedDay(3)}
          >
            DAY 3
          </button>
        </div>
        {renderContent()}
      </main>

    </div>
  );
}

export default timeline;