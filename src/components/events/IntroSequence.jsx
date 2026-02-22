import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const IntroSequence = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1300),
      setTimeout(() => setPhase(4), 1500),
      setTimeout(() => onComplete(), 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: '#050805' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.8 }}
    >
      {/* Tech City Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* City Grid Floor */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: `
              linear-gradient(to top, rgba(0,255,136,0.1) 0%, transparent 60%),
              linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px),
              linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 60px 60px, 60px 60px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* City Buildings */}
        {[...Array(12)].map((_, i) => {
          const height = 600 + Math.random() * 200;
          const width = 40 + Math.random() * 60;
          const left = 5 + i * 8;
          return (
            <motion.div
              key={i}
              className="absolute -bottom-1/2"
              style={{
                left: `${left}%`,
                width,
                height,
                background: `linear-gradient(180deg, rgba(0,255,136,0.15) 0%, rgba(0,136,255,0.1) 100%)`,
                border: '1px solid rgba(0,255,136,0.2)',
                borderBottom: 'none',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: phase >= 1 ? 1 : 0, 
                opacity: phase >= 1 ? 1 : 0 
              }}
              transition={{ 
                duration: 1, 
                delay: i * 0.1,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            >
              {/* Building windows */}
              {[...Array(5)].map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-2 h-3"
                  style={{
                    left: `${20 + (j % 2) * 50}%`,
                    top: `${20 + j * 15}%`,
                    background: Math.random() > 0.5 ? 'rgba(0,255,136,0.4)' : 'rgba(0,255,255,0.3)',
                    boxShadow: '0 0 10px rgba(0,255,136,0.5)',
                  }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                />
              ))}
            </motion.div>
          );
        })}

        {/* Floating city platforms */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`platform-${i}`}
            className="absolute rounded-lg"
            style={{
              width: 80 + i * 20,
              height: 20,
              left: `${10 + i * 18}%`,
              top: `${20 + i * 10}%`,
              background: 'linear-gradient(90deg, rgba(0,255,136,0.2), rgba(0,255,255,0.2))',
              border: '1px solid rgba(0,255,136,0.3)',
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: phase >= 2 ? 0 : -100, 
              opacity: phase >= 2 ? 1 : 0 
            }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}

        {/* Energy/data streams */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            className="absolute w-px"
            style={{
              left: `${10 + i * 12}%`,
              top: 0,
              bottom: '50%',
              background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.5), transparent)',
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: phase >= 2 ? [0.3, 0.7, 0.3] : 0,
              scaleY: phase >= 2 ? 1 : 0
            }}
            transition={{ 
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              scaleY: { duration: 0.5, delay: i * 0.1 }
            }}
          />
        ))}
      </motion.div>

      {/* Background grid overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 0.5 : 0 }}
        transition={{ duration: 1.5 }}
      />

      {/* Energy lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="energyLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
            <stop offset="50%" stopColor="#00ff88" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${-100 + i * 250} 0 Q ${200 + i * 150} ${300 + i * 50} ${-50 + i * 200} 900`}
            fill="none"
            stroke="url(#energyLine)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 0.6 : 0 }}
            transition={{ duration: 1.5, delay: i * 0.15 }}
          />
        ))}
      </svg>

      {/* Organic shapes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 0.4 : 0 }}
        transition={{ duration: 1 }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 250 + i * 80,
              height: 250 + i * 80,
              left: `${15 + i * 18}%`,
              top: `${10 + i * 12}%`,
              background: `radial-gradient(circle, rgba(0,255,136,${0.12 - i * 0.02}) 0%, transparent 60%)`,
            }}
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Drone */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 3, opacity: 0, y: 100 }}
        animate={{ 
          scale: phase === 0 ? 2.5 : phase === 1 ? 1.8 : phase === 2 ? 1.2 : phase === 3 ? 0.8 : 0.5,
          opacity: 1,
          y: phase >= 3 ? -50 : 0,
          x: phase >= 4 ? 0 : 0
        }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg viewBox="0 0 200 140" className="w-64 h-44 md:w-80 md:h-56" fill="none">
          <defs>
            <linearGradient id="introBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0088ff" stopOpacity="0.9" />
            </linearGradient>
            <filter id="introGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <ellipse cx={i % 2 === 0 ? 35 : 165} cy={i < 2 ? 35 : 105} rx="28" ry="5" fill="rgba(0,255,136,0.25)" filter="url(#introGlow)" />
              <motion.ellipse cx={i % 2 === 0 ? 35 : 165} cy={i < 2 ? 35 : 105} rx="22" ry="4" fill="rgba(0,255,255,0.15)" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 0.08, repeat: Infinity }} />
            </g>
          ))}

          <line x1="35" y1="35" x2="100" y2="70" stroke="url(#introBodyGrad)" strokeWidth="2.5" opacity="0.6" />
          <line x1="165" y1="35" x2="100" y2="70" stroke="url(#introBodyGrad)" strokeWidth="2.5" opacity="0.6" />
          <line x1="35" y1="105" x2="100" y2="70" stroke="url(#introBodyGrad)" strokeWidth="2.5" opacity="0.6" />
          <line x1="165" y1="105" x2="100" y2="70" stroke="url(#introBodyGrad)" strokeWidth="2.5" opacity="0.6" />

          <ellipse cx="100" cy="70" rx="42" ry="30" fill="rgba(10, 15, 10, 0.95)" stroke="url(#introBodyGrad)" strokeWidth="2.5" filter="url(#introGlow)" />
          <circle cx="100" cy="70" r="16" fill="rgba(0,255,136,0.2)" stroke="#00ff88" strokeWidth="1.5" />
          <motion.circle cx="100" cy="70" r="10" fill="#00ff88" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <circle cx="103" cy="67" r="3" fill="#ffffff" opacity="0.9" />

          <motion.circle cx="72" cy="62" r="3" fill="#00ffff" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <motion.circle cx="128" cy="62" r="3" fill="#00ffff" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, delay: 0.6, repeat: Infinity }} />
        </svg>
      </motion.div>

      {/* Text content */}
      <motion.div
        className="absolute bottom-24 left-0 right-0 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ background: 'linear-gradient(135deg, #00ff88, #00ffff, #0088ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          
        </h1>
        <motion.p className="text-base md:text-lg text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: phase >= 4 ? 1 : 0 }} transition={{ duration: 0.6 }}>
          
        </motion.p>
      </motion.div>

      {/* Progress dots */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= phase ? '#00ff88' : '#333' }} animate={{ scale: i === phase ? 1.3 : 1 }} transition={{ duration: 0.2 }} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default IntroSequence;
