import { motion } from 'framer-motion';

const Drone = ({ scale = 1, isHovering = true, tilt = 0 }) => {
  return (
    <motion.div
      className="relative"
      style={{ 
        width: 120 * scale, 
        height: 80 * scale,
        transform: `rotate(${tilt}deg)`
      }}
      animate={isHovering ? {
        y: [0, -8, 0],
        rotate: [0, 1, 0, -1, 0],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Drone Body */}
      <svg
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Glow filter */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00ffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0088ff" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="propGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Propeller arms */}
        <motion.g
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        >
          {/* Top-left propeller */}
          <ellipse cx="20" cy="20" rx="15" ry="3" fill="url(#propGradient)" opacity="0.6" />
          <circle cx="20" cy="20" r="4" fill="#00ff88" opacity="0.8" />
          
          {/* Top-right propeller */}
          <ellipse cx="100" cy="20" rx="15" ry="3" fill="url(#propGradient)" opacity="0.6" />
          <circle cx="100" cy="20" r="4" fill="#00ff88" opacity="0.8" />
          
          {/* Bottom-left propeller */}
          <ellipse cx="20" cy="60" rx="15" ry="3" fill="url(#propGradient)" opacity="0.6" />
          <circle cx="20" cy="60" r="4" fill="#00ff88" opacity="0.8" />
          
          {/* Bottom-right propeller */}
          <ellipse cx="100" cy="60" rx="15" ry="3" fill="url(#propGradient)" opacity="0.6" />
          <circle cx="100" cy="60" r="4" fill="#00ff88" opacity="0.8" />
        </motion.g>

        {/* Arm connections */}
        <line x1="20" y1="20" x2="60" y2="40" stroke="url(#bodyGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="100" y1="20" x2="60" y2="40" stroke="url(#bodyGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="20" y1="60" x2="60" y2="40" stroke="url(#bodyGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="100" y1="60" x2="60" y2="40" stroke="url(#bodyGradient)" strokeWidth="2" opacity="0.6" />

        {/* Main body */}
        <ellipse 
          cx="60" 
          cy="40" 
          rx="25" 
          ry="18" 
          fill="rgba(10, 15, 10, 0.9)" 
          stroke="url(#bodyGradient)" 
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Central lens/eye */}
        <circle cx="60" cy="40" r="10" fill="rgba(0, 255, 136, 0.2)" stroke="#00ff88" strokeWidth="1.5" />
        <circle cx="60" cy="40" r="6" fill="#00ff88" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="62" cy="38" r="2" fill="#ffffff" opacity="0.8" />

        {/* Status lights */}
        <circle cx="45" cy="35" r="2" fill="#00ffff" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="35" r="2" fill="#00ffff" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
        </circle>

        {/* Bottom sensor array */}
        <rect x="52" y="55" width="16" height="6" rx="2" fill="rgba(0, 136, 255, 0.3)" stroke="#0088ff" strokeWidth="1" />
        <line x1="55" y1="58" x2="65" y2="58" stroke="#00ffff" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Propeller blur effect */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 0.08, repeat: Infinity }}
        style={{
          background: 'radial-gradient(ellipse at 17% 25%, rgba(0,255,136,0.3) 0%, transparent 30%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 0.08, repeat: Infinity, delay: 0.02 }}
        style={{
          background: 'radial-gradient(ellipse at 83% 25%, rgba(0,255,136,0.3) 0%, transparent 30%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 0.08, repeat: Infinity, delay: 0.04 }}
        style={{
          background: 'radial-gradient(ellipse at 17% 75%, rgba(0,255,136,0.3) 0%, transparent 30%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 0.08, repeat: Infinity, delay: 0.06 }}
        style={{
          background: 'radial-gradient(ellipse at 83% 75%, rgba(0,255,136,0.3) 0%, transparent 30%)',
        }}
      />
    </motion.div>
  );
};

export default Drone;
