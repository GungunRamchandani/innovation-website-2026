import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const EnergySeed = ({ 
  category, 
  index, 
  totalSeeds, 
  isActive, 
  isTransforming, 
  onClick
}) => {

  const [isHovered, setIsHovered] = useState(false);

  // ✅ Proper responsive detection (updates on resize)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate position in circle
  const angle = (index * 360) / totalSeeds - 90;

  // ✅ Smaller circle on mobile
  const radius = isMobile ? 140 : 230;

  // ✅ Removed hard -50 offset ONLY on mobile so circle stays centered
  const offset = isMobile ? 0 : 50;
  const MOBILE_SHIFT_X = -34;   // 👈 increase negative to move more left
const MOBILE_SHIFT_Y = 0;     // optional vertical control
  const baseX = Math.cos((angle * Math.PI) / 180) * radius;
const baseY = Math.sin((angle * Math.PI) / 180) * radius;

const x = isMobile ? baseX + MOBILE_SHIFT_X : baseX - 50;
const y = isMobile ? baseY + MOBILE_SHIFT_Y : baseY - 50;
  //const x = Math.cos((angle * Math.PI) / 180) * radius - offset;
  //const y = Math.sin((angle * Math.PI) / 180) * radius - offset;

  const seedColors = {
    'Workshops': '#00ff88',
    'AI for Social Impact': '#00ffff',
    'Healthcare Innovation': '#4ade80',
    'Smart Cities & Mobility': '#0088ff',
    'Education & Accessibility': '#22d3ee',
    'Cybersecurity for Good': '#34d399'
  };

  const color = seedColors[category] || '#00ff88';

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 25 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.3 : isHovered ? 1.15 : 1,
        opacity: 1,
      }}
      transition={{ 
        scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
        opacity: { duration: 0.6, delay: index * 0.08 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              left: '50%',
              top: '50%',
              boxShadow: `0 0 6px ${color}`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 80],
              y: [0, -Math.random() * 100 - 30],
              opacity: [0, 1, 0],
              scale: [0.3, 1.2, 0.2],
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Glow rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}${15 - i * 5} 0%, transparent 70%)`,
            transform: `scale(${1.5 + i * 0.5})`,
          }}
          animate={{
            opacity: isActive ? [0.4 + i * 0.2, 0.8, 0.4 + i * 0.2] : [0.2, 0.4, 0.2],
            scale: isActive ? [1.5 + i * 0.5, 2 + i * 0.5, 1.5 + i * 0.5] : [1.5 + i * 0.5, 1.7 + i * 0.5, 1.5 + i * 0.5],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Seed container */}
      <motion.div
        className={`relative ${isMobile ? "w-14 h-14" : "w-20 h-20"}`}
        animate={{ y: isActive ? 0 : [0, -10, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      >
        <AnimatePresence mode="wait">
          {!isTransforming ? (
            <motion.div
              key="seed"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* ✅ Your SVG unchanged */}
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <defs>
                  <radialGradient id={`seedGrad${index}`} cx="40%" cy="30%" r="60%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                  </radialGradient>
                </defs>
                <ellipse cx="40" cy="40" rx="35" ry="35" fill={`url(#seedGrad${index})`} opacity="0.3" />
                <path d="M40 12 Q55 25 55 45 Q55 62 40 68 Q25 62 25 45 Q25 25 40 12" fill={`url(#seedGrad${index})`} />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="plant"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Plant SVG unchanged */}
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="20" fill={color} opacity="0.5" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Category label */}
<motion.div
  className="absolute left-1/2 whitespace-nowrap"
  style={{
    //top: isMobile ? "58px" : "85px",   // 👈 distance below seed
    //transform: "translateX(-50%)"
    left: "-6%",
  top: isMobile ? "58px" : "70px",
  transform: isMobile
    ? "translate(-70%, -50%)"
    : "translate(-60%, -50%)"
  }}
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: isTransforming || isHovered ? 1 : 0.7, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <span 
    className="text-xs font-medium tracking-wider uppercase"
    style={{ color, textShadow: `0 0 10px ${color}80` }}
  >
    {category}
  </span>
</motion.div>
    </motion.div>
  );
};

export default EnergySeed;