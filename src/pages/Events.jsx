import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CardGrid from "../components/events/CardGrid";
import Drone from '../components/events/Drone';
import EnergySeed from '../components/events/EnergySeed';
import EnergyTrail from '../components/events/EnergyTrail';
import InfoCard from '../components/events/InfoCard';
import InfoPage from "../components/events/InfoPage";
import IntroSequence from '../components/events/IntroSequence';

const categories = [
  {
    name: 'Growth Grid',
    description: 'A series of hands-on workshops designed to provide practical skills, real-world exposure, and in-depth learning in emerging technologies and technical domains.',
    events: ['AIML Bootcamp', 'Engineering Simulation', 'ESP32 Workshop', 'CyberSkills Workshop'],
    route: '/climate',
    color: '#00ff88'
  },
  {
    name: 'Hack Genesis',
    description: 'A series of competitive hackathons that challenge participants to innovate, collaborate, and build impactful software and hardware solutions within a limited time frame.',
    events: ['Software Hackathon', 'Mission: HARDWARE', 'NAVIRA Hackathon'],
    route: '/ai',
    color: '#00ffff'
  },
  {
    name: 'Play Field',
    description: 'A category of exciting games featuring interactive, skill-based, and strategy-driven events that combine technology, logic, teamwork, and competitive fun.',
    events: ['The StARburst Theory', 'Structural Showdown', 'Chrono Escape', 'Tech Trials', 'Mini Carnival', 'QuadraClash', 'Algorithm Human-Bot', 'Esports Arena', 'Grid Bid'],
    route: '/healthcare',
    color: '#4ade80'
  },
  {
    name: 'Skill Clash',
    description: 'A competitive category featuring skill-based challenges that test coding, innovation, problem-solving, design thinking, and technical expertise through high-intensity contests.',
    events: ['Code Conquer', 'Zero UI Challenge', 'E-Move', 'ProtoSprint', 'Buildathon', 'Ideathon', 'BotSprint'],
    route: '/smartcities',
    color: '#0088ff'
  },
  {
    name: 'Tech Frontier',
    description: 'A forward-looking category showcasing cutting-edge technologies and innovation-driven events that explore AI, cloud computing, digital twins, data science, and open-source advancements.',
    events: ['CommitVerse', 'AI Cloud Event', 'CodeNova', 'TechExpo', 'CTF', 'Datasprint', 'TechTangle'],
    route: '/education',
    color: '#22d3ee'
  },
  {
    name: 'Equity Edge',
    description: 'A business-focused category featuring entrepreneurial, trade, and strategy-driven events that test innovation, financial acumen, leadership, and decision-making under real-world scenarios.',
    events: ['Founder Courtroom', 'BeTrade', 'Idea Forge'],
    route: '/security',
    color: '#34d399'
  }
];

const PlaceholderPage = ({ title, color }) => (
  <motion.div
    className="min-h-screen flex flex-col items-center justify-center p-8"
    style={{ background: '#050805' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="text-center"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color }}>
        {title}
      </h1>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl">
        This section is under development. Check back soon for updates on events, speakers, and registration details.
      </p>
      <motion.a
        href="/"
        className="inline-block px-8 py-4 rounded-xl font-semibold text-lg"
        style={{ 
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          color,
          border: `2px solid ${color}60`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Home
      </motion.a>
    </motion.div>
  </motion.div>
);

const Home = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [activeSeed, setActiveSeed] = useState(null);
  const [droneTarget, setDroneTarget] = useState(null);
  const [isDroneMoving, setIsDroneMoving] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  const [trailCoords, setTrailCoords] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const [droneTilt, setDroneTilt] = useState(0);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const isMobile = useMobileLayout();

  
const GlobalBackButton = ({ destinationUrl, label = "Back" }) => {
    const handleBackClick = () => {
        window.location.href = destinationUrl;
    };

    return (
        <>
          

            <style>{`
        @media (max-width: 768px) {
          .global-back-btn {
            display: none !important;
          }
        }
      `}</style>

      <button
        onClick={handleBackClick}
        className="global-back-btn" // Added class name here
        style={{
          // Positioning
          position: 'fixed',
          top: '30px',
          left: '30px',
          zIndex: 9999,

          // Layout & Shape
          display: 'flex', // This is overridden by the media query on mobile
          alignItems: 'center',
          gap: '12px',
          padding: '12px 28px',
          borderRadius: '16px',

          // Glassmorphism Styling
          background: 'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
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
    </>
    );
};

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Calculate seed position in pixels from center
  /*const calculateSeedPixelPosition = (index) => {
    const angle = (index * 360) / 6 - 90;
    const radius = 240;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };*/
 const calculateSeedPixelPosition = (index) => {
  const angle = (index * 360) / 6 - 90;

  const radius = isMobile ? 100 : 240;

  let x = Math.cos((angle * Math.PI) / 180) * radius;
  let y = Math.sin((angle * Math.PI) / 180) * radius;

    /*if (isMobile) {
      x = 70;   // now valid
    }*/

  return { x, y };
};

  // Get absolute screen position for a seed
  /*const getSeedScreenPosition = (index) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const seedPos = calculateSeedPixelPosition(index);
    
    return {
      x: centerX + seedPos.x,
      y: centerY + seedPos.y
    };
  };*/
  const getSeedScreenPosition = (index) => {
  const container = containerRef.current;
  if (!container) return { x: 0, y: 0 };
  
  const rect = container.getBoundingClientRect();

  // 👇 SHIFT ENTIRE SYSTEM LEFT ON MOBILE
  const centerX = isMobile 
    ? rect.width / 2 - 200   // ← adjust this value
    : rect.width / 2;

  const centerY = rect.height / 2;

  const seedPos = calculateSeedPixelPosition(index);
  
  return {
    x: centerX + seedPos.x,
    y: centerY + seedPos.y
  };
};

  const handleSeedClick = useCallback((index) => {
    if (activeSeed === index) return;

    const seedPos = calculateSeedPixelPosition(index);
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate positions
    const targetX = centerX + seedPos.x;
    const targetY = centerY + seedPos.y;
    const currentDroneX = centerX + (droneTarget?.x || 0);
    const currentDroneY = centerY + (droneTarget?.y || 0);

    // Set trail coordinates
    setTrailCoords({
      startX: currentDroneX,
      startY: currentDroneY,
      endX: targetX,
      endY: targetY
    });

    // Calculate tilt based on direction
    const deltaX = targetX - currentDroneX;
    const tilt = Math.max(-20, Math.min(20, deltaX / 15));
    setDroneTilt(tilt);

    // Show trail
    setShowTrail(true);
    setTimeout(() => setShowTrail(false), 1500);

    // Move drone
    setIsDroneMoving(true);
    setDroneTarget({ x: seedPos.x, y: seedPos.y });

    // Set card position at seed location
    setCardPosition(getSeedScreenPosition(index));

    // Activate seed after drone arrives
    setTimeout(() => {
      setActiveSeed(index);
      setIsDroneMoving(false);
      setDroneTilt(0);
    }, 800);
  }, [activeSeed, droneTarget]);

  const handleBackgroundClick = useCallback(() => {
    if (activeSeed !== null) {
      // Close the card and return drone to center
      setActiveSeed(null);
      
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const currentDroneX = centerX + (droneTarget?.x || 0);
      const currentDroneY = centerY + (droneTarget?.y || 0);

      // Set trail for return journey
      setTrailCoords({
        startX: currentDroneX,
        startY: currentDroneY,
        endX: centerX,
        endY: centerY
      });

      setShowTrail(true);
      setTimeout(() => setShowTrail(false), 1500);

      setIsDroneMoving(true);
      setDroneTarget(null);

      setTimeout(() => {
        setIsDroneMoving(false);
      }, 800);
    }
  }, [activeSeed, droneTarget]);

  const handleCloseCard = useCallback(() => {
    setActiveSeed(null);
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const currentDroneX = centerX + (droneTarget?.x || 0);
    const currentDroneY = centerY + (droneTarget?.y || 0);

    setTrailCoords({
      startX: currentDroneX,
      startY: currentDroneY,
      endX: centerX,
      endY: centerY
    });

    setShowTrail(true);
    setTimeout(() => setShowTrail(false), 1500);

    setIsDroneMoving(true);
    setDroneTarget(null);

    setTimeout(() => {
      setIsDroneMoving(false);
    }, 800);
  }, [droneTarget]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#050805' }}
      onClick={handleBackgroundClick}
    >

      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK"
      />
      <AnimatePresence>
        {!introComplete && <IntroSequence onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Background layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #0a1a0f 0%, #050805 70%)' }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 0.4 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating organic shapes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 0.5 : 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 250 + i * 80,
              height: 250 + i * 80,
              left: `${10 + i * 12}%`,
              top: `${5 + i * 8}%`,
              background: `radial-gradient(circle, rgba(0,255,136,${0.08 - i * 0.01}) 0%, transparent 60%)`,
            }}
            animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Energy lines */}
      <motion.svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 0.3 : 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <defs>
          <linearGradient id="bgEnergy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
            <stop offset="50%" stopColor="#00ff88" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${i * 300} 0 Q ${150 + i * 200} 400 ${i * 250} 900`}
            fill="none"
            stroke="url(#bgEnergy)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: introComplete ? 1 : 0 }}
            transition={{ duration: 2, delay: 0.5 + i * 0.2 }}
          />
        ))}
      </motion.svg>

      {/* Main content */}
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Header */}
        <motion.header
          className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: introComplete ? 0 : -30, opacity: introComplete ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/*<div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,255,255,0.2))',
                  border: '2px solid rgba(0,255,136,0.5)'
                }}
              >
                <svg 
  viewBox="0 0 24 24"
  width="20"
  height="20"
  fill="none"
  stroke="#00ff88"
  strokeWidth="2"
>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>*/}
              <a
  href="https://drive.google.com/drive/folders/1ffGlDJVEEePgJaHZnG11Koh6cKHSC_mI"
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col items-center cursor-pointer"
  style={{ textDecoration: "none" }}
>
  <div
    className="w-16 h-16 rounded-full flex items-center justify-center"
    style={{
      background: 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,255,255,0.2))',
      border: '2px solid rgba(0,255,136,0.5)'
    }}
  >
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="#00ff88"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  </div>
    
  <span
    style={{
      marginTop: "6px",
      fontSize: "16px",
      color: "#00ff88",
      fontWeight: "600",
      letterSpacing: "1px"
    }}
  >
    RULEBOOK
  </span>
</a>

              <h1
                className="text-lg md:text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {['About', 'Events', 'Speakers', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
              ))}
            </nav>
          </div>
        </motion.header>

        {/* Energy Trail */}
        <EnergyTrail
          startX={trailCoords.startX}
          startY={trailCoords.startY}
          endX={trailCoords.endX}
          endY={trailCoords.endY}
          isVisible={showTrail}
        />

        {/* Central area with drone and seeds */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Energy Seeds - all clickable */}
          {introComplete && categories.map((category, index) => (
            <div 
              key={category.name}
              onClick={(e) => { 
                e.stopPropagation(); 
                handleSeedClick(index); 
              }}
              style={{ pointerEvents: 'auto' }}
            >
              <EnergySeed
                category={category.name}
                index={index}
                totalSeeds={6}
                isActive={activeSeed === index}
                isTransforming={activeSeed === index}
                size={isMobile ? 0.75 : 1} 
              />
            </div>
          ))}

          {/* Drone */}
          <motion.div
            className="absolute z-10 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              //x: droneTarget ? droneTarget.x : 5,
              //y: droneTarget ? droneTarget.y : 0,
              x: droneTarget ? (isMobile ? droneTarget.x * 0.9 : droneTarget.x) : 5,
              /*const dronePos = isMobile
  ? getMobileDronePosition(droneTarget)
  : droneTarget || { x: 5, y: 0 };*/

              y: droneTarget ? (isMobile ? droneTarget.y * 0.9 : droneTarget.y) : 0,
              scale: introComplete ? 0.8 : 0,
              opacity: introComplete ? 1 : 0,
            }}
            transition={{
              x: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
              y: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
              scale: { duration: 0.5, delay: 0.3 },
              opacity: { duration: 0.5, delay: 0.3 },
            }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <Drone scale={1.5} isHovering={!isDroneMoving} tilt={droneTilt} />
          </motion.div>
        </div>

        {/* Info Card - positioned at seed location */}
        <AnimatePresence>
          {activeSeed !== null && (
            <InfoCard
              category={categories[activeSeed].name}
              description={categories[activeSeed].description}
              events={categories[activeSeed].events}
              route={categories[activeSeed].route}
              isVisible={true}
              color={categories[activeSeed].color}
              onClose={handleCloseCard}
              position={cardPosition}
            />
          )}
        </AnimatePresence>

        
      </motion.div>
    </div>
  );
};

function Events() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/climate" element={<PlaceholderPage title="Workshops" color="#00ff88" />} />
        <Route path="/ai" element={<PlaceholderPage title="AI for Social Impact" color="#00ffff" />} />
        <Route path="/healthcare" element={<PlaceholderPage title="Healthcare Innovation" color="#4ade80" />} />
        <Route path="/smartcities" element={<PlaceholderPage title="Smart Cities & Mobility" color="#0088ff" />} />
        <Route path="/education" element={<PlaceholderPage title="Education & Accessibility" color="#22d3ee" />} />
        <Route path="/security" element={<PlaceholderPage title="Cybersecurity for Good" color="#34d399" />} />
        <Route path="/CardGrid" element={<CardGrid />} />
        <Route path="/info/:eventName" element={<InfoPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default Events;

/* =========================
   📱 MOBILE LAYOUT OVERRIDE
   Paste below your existing code
   ========================= */

export const useMobileLayout = () => {
  const [isMobileLayout, setIsMobileLayout] = React.useState(
    window.innerWidth <= 768
  );

    /* =========================
   📱 MOBILE LAYOUT OVERRIDE
   ========================= */

/* 🔧 MANUAL MOBILE POSITION CONTROLS */
const MOBILE_SEED_OFFSET_X = 0;   // ← move all seeds left/right
const MOBILE_SEED_OFFSET_Y = 0;     // ← move all seeds up/down

const MOBILE_CARD_OFFSET_X = 0;     // ← move card left/right
const MOBILE_CARD_OFFSET_Y = 0;     // ← move card up/down
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileLayout(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobileLayout;
};

/* 🎯 Seed positions for mobile (perfect circle fit) */
/*export const getMobileSeedPosition = (index, total = 6) => {
  const angle = (index * 360) / total - 90;
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.28;

  return {
    x: Math.cos((angle * Math.PI) / 180) * radius,
    y: Math.sin((angle * Math.PI) / 180) * radius
  };
};*/
export const getMobileSeedPosition = (index, total = 6) => {
  const angle = (index * 360) / total - 90;
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.28;

  let x = Math.cos((angle * Math.PI) / 180) * radius;
  let y = Math.sin((angle * Math.PI) / 180) * radius;

  // ✅ APPLY MANUAL SHIFT
  x += MOBILE_SEED_OFFSET_X;
  y += MOBILE_SEED_OFFSET_Y;

  return { x, y };
};

/* 🚁 Drone offset tuning for mobile */
export const getMobileDronePosition = (target) => {
  if (!target) return { x: 0, y: 0 };

  return {
    x: target.x * 0.92,
    y: target.y * 0.92
  };
};

/* 🪟 Card position for mobile (bottom sheet style) */
export const getMobileCardPosition = () => {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.78
  };
};