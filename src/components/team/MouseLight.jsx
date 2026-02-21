import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MouseLight() {
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(-100, springConfig);
  const y = useSpring(-100, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none z-0 hidden md:block"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(15, 185, 177, 0.15) 0%, rgba(15, 185, 177, 0) 70%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
