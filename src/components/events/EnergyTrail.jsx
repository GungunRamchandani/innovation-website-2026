import { motion } from 'framer-motion';

const EnergyTrail = ({ startX, startY, endX, endY, isVisible }) => {
  if (!isVisible) return null;

  // Calculate control point for curved path
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const controlX = midX + (endY - startY) * 0.2;
  const controlY = midY - (endX - startX) * 0.2;

  // Create quadratic bezier path
  const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <defs>
        <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00ffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0088ff" stopOpacity="0.8" />
        </linearGradient>
        <filter id="trailGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background trail */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#trailGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#trailGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
        transition={{ 
          pathLength: { duration: 0.8, ease: "easeOut" },
          opacity: { duration: 1.5, ease: "easeOut" }
        }}
      />

      {/* Main trail line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#trailGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 0.3] }}
        transition={{ 
          pathLength: { duration: 0.6, ease: "easeOut" },
          opacity: { duration: 1.2, ease: "easeOut" }
        }}
      />

      {/* Animated particles along the path */}
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          r="3"
          fill="#00ff88"
          filter="url(#trailGlow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            offsetDistance: ['0%', '100%'],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: "easeOut"
          }}
          style={{
            offsetPath: `path('${pathD}')`,
          }}
        />
      ))}
    </svg>
  );
};

export default EnergyTrail;
