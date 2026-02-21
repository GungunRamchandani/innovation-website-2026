import { useEffect, useRef, useState } from 'react';

export default function CursorTrail() {
  const [points, setPoints] = useState([]);
  const frameRef = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: counterRef.current++,
        age: 0
      };
      setPoints(prev => [...prev, newPoint].slice(-20));
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      setPoints(prev =>
        prev
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < 20)
      );
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden hidden md:block">
      {points.map((point) => (
        <div
          key={point.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: point.x,
            top: point.y,
            width: `${(20 - point.age) / 3}px`,
            height: `${(20 - point.age) / 3}px`,
            opacity: (20 - point.age) / 20,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 4px #0FB9B1'
          }}
        />
      ))}
    </div>
  );
}
