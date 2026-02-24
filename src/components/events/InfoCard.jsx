import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const isMobile = window.innerWidth < 768;
// 🎛 MANUAL MOBILE CONTROLS
const MOBILE_CARD_SHIFT_X = -160;  // ← adjust left/right
const MOBILE_CARD_SHIFT_Y = -170;   // ↑↓ adjust up/down

const InfoCard = ({ 
  category, 
  description, 
  events, 
  route,
  isVisible,
  color = '#00ff88',
  onClose,
  position = { x: 0, y: 0 }
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEnter = () => {
    navigate("CardGrid", {
    state: {
      category,
      events,
    },
  });
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isVisible) return null;

  // Calculate card position to keep it within viewport
  const cardWidth = 320;
  const cardHeight = 420;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Adjust position to keep card in viewport
  let cardX = position.x;
  let cardY = position.y - cardHeight / 2;
  
  // Horizontal bounds
  if (cardX + cardWidth / 2 > viewportWidth - 20) {
    cardX = viewportWidth - cardWidth / 2 - 20;
  }
  if (cardX - cardWidth / 2 < 20) {
    cardX = cardWidth / 2 + 20;
  }
  
  // Vertical bounds
  if (cardY < 80) {
    cardY = 80;
  }
  if (cardY + cardHeight > viewportHeight - 20) {
    cardY = viewportHeight - cardHeight - 20;
  }

  return (
    <motion.div
      className="fixed z-50"
      style={{
        left: isMobile
    ? `calc(50% + ${MOBILE_CARD_SHIFT_X}px)`
    : "36.5%",
  top: isMobile
    ? `calc(50% + ${MOBILE_CARD_SHIFT_Y}px)`
    : "19%",
  transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1]
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <motion.button
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,50,50,0.8), rgba(200,0,0,0.8))',
          border: '2px solid rgba(255,100,100,0.5)',
          boxShadow: '0 0 15px rgba(255,0,0,0.5)',
        }}
        onClick={handleClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>

      <motion.div
        className="relative w-80 h-96 perspective-1000"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,255,255,0.05) 50%, rgba(0,136,255,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${color}50`,
            boxShadow: `0 0 30px ${color}30, inset 0 0 30px ${color}10`,
          }}
          onClick={handleFlip}
        >
          {/* Card glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${color}40 0%, transparent 50%)`,
            }}
          />

          {/* Icon */}
          <div className="relative mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `2px solid ${color}60`,
                boxShadow: `0 0 20px ${color}40`
              }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.5">
                {category === 'Climate & Sustainability' && (
                  <>
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </>
                )}
                {category === 'AI for Social Impact' && (
                  <>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </>
                )}
                {category === 'Healthcare Innovation' && (
                  <>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    <circle cx="12" cy="12" r="10" opacity="0.3" />
                  </>
                )}
                {category === 'Smart Cities & Mobility' && (
                  <>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </>
                )}
                {category === 'Education & Accessibility' && (
                  <>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </>
                )}
                {category === 'Cybersecurity for Good' && (
                  <>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <circle cx="12" cy="11" r="3" fill={color} fillOpacity="0.3" />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="relative text-xl font-bold mb-3" style={{ color }}>
            {category}
          </h3>

          {/* Description */}
          <p className="relative text-sm text-gray-300 leading-relaxed flex-grow">
            {description}
          </p>

          {/* Flip hint */}
          <div className="relative mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            
           <span style={{ fontSize: "20px", color: "white" }}>
        <b>Click to explore events</b>
          </span>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,255,255,0.05) 50%, rgba(0,136,255,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${color}50`,
            boxShadow: `0 0 30px ${color}30, inset 0 0 30px ${color}10`,
          }}
          onClick={handleFlip}
        >
          {/* Card glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 70% 80%, ${color}40 0%, transparent 50%)`,
            }}
          />

          {/* Back title */}
          <h3 className="relative text-lg font-bold mb-4" style={{ color }}>
            Events
          </h3>

          {/* Events list */}
          <div className="relative flex-grow overflow-y-auto pr-1">
            <ul className="space-y-2">
              {events.map((event, index) => (
                <motion.li
                  key={index}
                  className="text-sm text-gray-300 p-2 rounded-lg"
                  style={{ 
                    background: `${color}10`,
                    borderLeft: `2px solid ${color}`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                >
                  {event}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Enter button */}
          <motion.button
            className="relative mt-4 w-full py-3 px-6 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${color}40, ${color}20)`,
              color,
              border: `1px solid ${color}60`,
              boxShadow: `0 0 20px ${color}30`
            }}
            whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${color}50` }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
          >
            Enter
          </motion.button>

          {/* Flip back hint */}
          <div className="relative mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
            
            <span>Click to flip back</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InfoCard;
