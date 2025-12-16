import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import klashLogo from "@/assets/klash-logo.svg";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const popArtShapes = [
    { text: "BOOM!", rotation: -15, delay: 0.2, x: -200, y: -150 },
    { text: "CLASH!", rotation: 12, delay: 0.4, x: 180, y: -120 },
    { text: "POW!", rotation: -8, delay: 0.6, x: -220, y: 140 },
    { text: "RAGE!", rotation: 20, delay: 0.8, x: 200, y: 160 },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Diagonal stripes background */}
      <div className="absolute inset-0 diagonal-stripes opacity-50" />
      
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone-large opacity-30" />

      {/* Pop-art shapes */}
      {popArtShapes.map((shape, index) => (
        <motion.div
          key={shape.text}
          initial={{ scale: 0, rotate: shape.rotation - 30, opacity: 0 }}
          animate={{ 
            scale: [0, 1.3, 1], 
            rotate: shape.rotation,
            opacity: 1
          }}
          transition={{ 
            delay: shape.delay, 
            duration: 0.5,
            ease: "backOut"
          }}
          className="absolute font-comic text-4xl md:text-6xl select-none"
          style={{ 
            left: `calc(50% + ${shape.x}px)`,
            top: `calc(50% + ${shape.y}px)`,
            color: index % 2 === 0 ? '#ff0000' : '#ffffff',
            textShadow: '4px 4px 0 #000, -2px -2px 0 #000',
            WebkitTextStroke: '2px black'
          }}
        >
          <motion.span
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              repeatDelay: 1 
            }}
            className="inline-block"
          >
            {shape.text}
          </motion.span>
        </motion.div>
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Jittery Logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.02, 0.98, 1],
            rotate: [-2, 2, -1, 1, 0]
          }}
          transition={{ 
            duration: 0.3, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="mb-8"
        >
          <motion.img
            src={klashLogo}
            alt="Klash"
            className="h-40 md:h-56 w-auto drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-comic text-2xl text-foreground mb-8 tracking-wider"
          style={{ textShadow: '2px 2px 0 #ff0000' }}
        >
          ENTERING THE ARENA...
        </motion.p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ ease: "linear" }}
          style={{
            boxShadow: '0 0 20px #ff0000, 0 0 40px #ff0000'
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-4 border-t-4 border-primary" />
      <div className="absolute top-4 right-4 w-20 h-20 border-r-4 border-t-4 border-primary" />
      <div className="absolute bottom-8 left-4 w-20 h-20 border-l-4 border-b-4 border-foreground" />
      <div className="absolute bottom-8 right-4 w-20 h-20 border-r-4 border-b-4 border-foreground" />
    </motion.div>
  );
};
