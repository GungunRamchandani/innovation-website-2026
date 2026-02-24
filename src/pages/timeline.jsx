import { useState } from 'react';
import Timeline from '../components/timeline/timeline';
import Timeline2 from '../components/timeline/timeline2';
import Timeline3 from '../components/timeline/timeline3';
import './timeline.css';

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
        color: '#8076db', // Matches your drone/neon theme
        border: '2px solid #462bca',
        cursor: 'pointer',
        zIndex: 1000,
        fontWeight: 'bold'
      }}
    >
      ← {label}
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
