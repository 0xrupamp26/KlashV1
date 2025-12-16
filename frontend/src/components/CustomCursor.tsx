import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.poster-card') ||
        target.closest('.card-hover') ||
        target.classList.contains('cursor-pointer');
      
      if (isInteractive) {
        setIsHovering(true);
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 500);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Smooth follow effect (magnetic lag)
  useEffect(() => {
    const animate = () => {
      setSmoothPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: smoothPosition.x - 16,
          y: smoothPosition.y - 16,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 28,
          mass: 0.5
        }}
      >
        <div 
          className={`w-8 h-8 rounded-full border-2 transition-colors duration-200 ${
            isHovering 
              ? 'border-primary bg-primary/20' 
              : 'border-foreground bg-transparent'
          }`}
          style={{
            boxShadow: isHovering 
              ? '0 0 20px rgba(255,0,0,0.5), inset 0 0 10px rgba(255,0,0,0.3)' 
              : 'none'
          }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      >
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            isHovering ? 'bg-primary' : 'bg-foreground'
          }`}
        />
      </motion.div>

      {/* Ripple effect on hover */}
      {showRipple && (
        <motion.div
          className="fixed pointer-events-none z-[9998]"
          initial={{ 
            x: position.x - 20, 
            y: position.y - 20,
            scale: 0,
            opacity: 1
          }}
          animate={{ 
            scale: 3,
            opacity: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-primary" />
        </motion.div>
      )}
    </>
  );
};
