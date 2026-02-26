import { useState } from 'react';
import Timeline from '../components/timeline/timeline';
import Timeline2 from '../components/timeline/timeline2';
import Timeline3 from '../components/timeline/timeline3';
import './timeline.css';

import { useEffect } from "react";

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
    <div className="App timeline-page">
      {/* THIS IS THE REDIRECT BUTTON */}
      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK"
      />

      <main>
        <div className="nav-overlay">
          <button
            className={`nav-link ${selectedDay === 1 ? 'active' : ''}`}
            onClick={() => setSelectedDay(1)}
          >
            9th April
          </button>
          <button
            className={`nav-link ${selectedDay === 2 ? 'active' : ''}`}
            onClick={() => setSelectedDay(2)}
          >
            10th April
          </button>
          <button
            className={`nav-link ${selectedDay === 3 ? 'active' : ''}`}
            onClick={() => setSelectedDay(3)}
          >
            11th April
          </button>
        </div>
        {renderContent()}
      </main>

    </div>
  );
}

export default timeline;
