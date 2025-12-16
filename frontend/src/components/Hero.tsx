import React from "react";
import { motion } from "framer-motion";
import klashLogo from "@/assets/klash-logo.svg";
import { Button } from "@/components/ui/button";
import { ArrowDown, Zap } from "lucide-react";

export const Hero: React.FC = () => {
  const scrollToMarkets = () => {
    document.getElementById("markets")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Solid dark base with diagonal stripes */}
      <div className="absolute inset-0 bg-background-dark" />
      <div className="absolute inset-0 diagonal-stripes" />
      
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone-large" />

      {/* Harsh diagonal accent blocks */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 skew-x-12 -mr-20" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-foreground/5 -skew-x-12 -ml-20" />

      {/* Comic-style burst shapes */}
      <motion.div 
        className="absolute top-20 right-10 md:right-32 font-comic text-6xl md:text-8xl text-primary/20 select-none"
        animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ textShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
      >
        VS
      </motion.div>
      
      <motion.div 
        className="absolute bottom-32 left-10 md:left-20 font-comic text-4xl md:text-6xl text-foreground/10 select-none rotate-12"
        animate={{ rotate: [12, 8, 12] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        FIGHT!
      </motion.div>

      {/* Corner frame elements */}
      <div className="absolute top-20 left-4 md:left-8 w-24 md:w-32 h-24 md:h-32 border-l-4 border-t-4 border-primary" />
      <div className="absolute top-20 right-4 md:right-8 w-24 md:w-32 h-24 md:h-32 border-r-4 border-t-4 border-foreground" />
      <div className="absolute bottom-20 left-4 md:left-8 w-24 md:w-32 h-24 md:h-32 border-l-4 border-b-4 border-foreground" />
      <div className="absolute bottom-20 right-4 md:right-8 w-24 md:w-32 h-24 md:h-32 border-r-4 border-b-4 border-primary" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logo with harsh shadow */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Hard shadow */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary/30 blur-sm" />
            <motion.img
              src={klashLogo}
              alt="Klash"
              className="relative h-28 md:h-44 lg:h-52 w-auto mx-auto"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                filter: 'drop-shadow(6px 6px 0 rgba(255,0,0,0.8)) drop-shadow(-2px -2px 0 rgba(255,255,255,0.3))'
              }}
            />
          </div>
        </motion.div>

        {/* Tagline with comic styling */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wider mb-6 text-foreground"
          style={{ 
            textShadow: '4px 4px 0 hsl(var(--primary)), 6px 6px 0 rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px rgba(255,255,255,0.3)'
          }}
        >
          Put your money where
          <br />
          <span 
            className="text-primary inline-block"
            style={{ 
              textShadow: '4px 4px 0 #000, 6px 6px 0 rgba(255,255,255,0.2)'
            }}
          >
            the mouth is.
          </span>
        </motion.h1>

        {/* Description in speech bubble style */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-10 space-y-4"
        >
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            We turn real controversies into head-to-head prediction markets on chain.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 border-2 border-dashed border-muted-foreground/30">
            <Zap className="h-4 w-4 text-warning" />
            <p className="text-sm text-muted-foreground">
              Alpha runs on testnet • Simulated resolution • 2% protocol fee
            </p>
          </div>
        </motion.div>

        {/* CTA buttons with pop-art styling */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            variant="hero" 
            size="xl" 
            onClick={scrollToMarkets}
            className="comic-border !border-foreground !shadow-[6px_6px_0_hsl(var(--primary))]"
          >
            Explore Markets
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-foreground hover:bg-foreground hover:text-secondary"
          >
            How It Works
          </Button>
        </motion.div>

        {/* Stamp decoration */}
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0 }}
          animate={{ opacity: 1, rotate: -12, scale: 1 }}
          transition={{ delay: 1, duration: 0.3, ease: "backOut" }}
          className="absolute top-32 right-8 md:right-20 hidden lg:block"
        >
          <div className="stamp text-sm">
            TESTNET ONLY
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="cursor-pointer"
            onClick={scrollToMarkets}
          >
            <div className="p-2 border-2 border-muted-foreground/50 rounded-sm">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom red line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
    </section>
  );
};
