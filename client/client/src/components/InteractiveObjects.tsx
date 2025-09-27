import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function InteractiveObjects() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Show 3D objects when scrolled past the hero section
      setIsVisible(scrollY > windowHeight * 0.8);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const objects = [
    { id: 1, size: 60, delay: 0, color: 'bg-blue-500' },
    { id: 2, size: 40, delay: 0.1, color: 'bg-green-500' },
    { id: 3, size: 80, delay: 0.2, color: 'bg-purple-500' },
    { id: 4, size: 50, delay: 0.3, color: 'bg-orange-500' },
  ];

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {objects.map((obj, index) => {
        const offsetX = (index % 2 === 0 ? 1 : -1) * 100;
        const offsetY = (index % 2 === 0 ? 1 : -1) * 50;
        
        return (
          <motion.div
            key={obj.id}
            className={`absolute rounded-full ${obj.color} opacity-70 shadow-2xl`}
            style={{
              width: obj.size,
              height: obj.size,
            }}
            animate={{
              x: mousePosition.x + offsetX - obj.size / 2,
              y: mousePosition.y + offsetY - obj.size / 2,
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20, delay: obj.delay },
              y: { type: "spring", stiffness: 100, damping: 20, delay: obj.delay },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            }}
          />
        );
      })}
      
      {/* Central cursor follower */}
      <motion.div
        className="absolute h-4 w-4 rounded-full bg-white shadow-lg"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </div>
  );
}