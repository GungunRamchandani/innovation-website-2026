import { useState } from 'react';
import Timeline from '../components/timeline/timeline';
import Timeline2 from '../components/timeline/timeline2';
import Timeline3 from '../components/timeline/timeline3';
import './timeline.css';

function timeline() {
  const [selectedDay, setSelectedDay] = useState(1);

  const renderContent = () => {
    switch(selectedDay) {
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