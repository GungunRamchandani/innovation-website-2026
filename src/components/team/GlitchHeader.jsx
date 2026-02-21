import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function GlitchHeader({ text, className = "" }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);

      const nextGlitch = Math.random() * 5000 + 2000;
      setTimeout(triggerGlitch, nextGlitch);
    };

    const timer = setTimeout(triggerGlitch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.h1
        className="relative z-10 font-display text-4xl md:text-6xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80"
        animate={{
          x: isGlitching ? [0, -2, 2, -1, 1, 0] : 0,
          textShadow: isGlitching
            ? "2px 0 #0FB9B1, -2px 0 #ff00de"
            : "0 0 20px rgba(15, 185, 177, 0.5)"
        }}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.h1>

      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 -ml-1 text-primary opacity-70 animate-pulse font-display text-4xl md:text-6xl font-bold tracking-widest uppercase clip-path-inset">
            {text}
          </span>
          <span className="absolute top-0 left-0 ml-1 text-purple-500 opacity-70 animate-pulse font-display text-4xl md:text-6xl font-bold tracking-widest uppercase clip-path-inset-2">
            {text}
          </span>
        </>
      )}
    </div>
  );
}
