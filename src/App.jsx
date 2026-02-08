import { useState } from 'react';
import Timeline from './components/timeline';
import Timeline2 from './components/timeline2';
import Timeline3 from './components/timeline3';
import './App.css';

function App() {
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
      <header className="header">
        <h1>Timeline Journey</h1>
        <nav className="nav-menu">
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
        </nav>
      </header>
      
      <main>
        {renderContent()}
      </main>
      
      <footer>
        <p>© 2026 Timeline Project</p>
      </footer>
    </div>
  );
}

export default App;