import React from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { TrustedBy } from "@/components/TrustedBy";
import { useMarket } from "@/context/MarketContext";
import { Zap, Shield, Target } from "lucide-react";

const Index: React.FC = () => {
  const { markets } = useMarket();
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Trusted By Section */}
      <TrustedBy />

      {/* Markets Section */}
      <section id="markets" className="py-20 bg-background-dark relative">
        {/* Halftone overlay */}
        <div className="absolute inset-0 halftone opacity-30" />
        
        {/* Diagonal stripes */}
        <div className="absolute inset-0 diagonal-stripes opacity-30" />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-primary hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-foreground hidden md:block" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-comic text-primary text-lg tracking-wider">
              CHOOSE YOUR BATTLE
            </span>
            <h2 
              className="font-display text-4xl md:text-5xl tracking-wider mb-4 text-foreground"
              style={{ textShadow: '4px 4px 0 rgba(255,0,0,0.3)' }}
            >
              Live Markets
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pick a controversy. Pick a side. Put your (testnet) money where your mouth is.
            </p>
            
            {/* Decorative line */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="w-20 h-1 bg-primary" />
              <div className="w-3 h-3 bg-foreground rotate-45" />
              <div className="w-20 h-1 bg-primary" />
            </div>
          </motion.div>

          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {markets.map((market, index) => (
              <MarketCard key={market.id} market={market} index={index} />
            ))}
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground" />
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 fight-poster opacity-20" />
        <div className="absolute inset-0 noise-overlay" />
        
        {/* Diagonal accent */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/5 -skew-x-12 -ml-32" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-comic text-muted-foreground text-sm tracking-wider">
              HOW TO
            </span>
            <h2 
              className="font-display text-4xl md:text-5xl tracking-wider mb-4 text-foreground"
              style={{ textShadow: '3px 3px 0 rgba(255,0,0,0.2)' }}
            >
              Join The Arena
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, transparent, on-chain prediction markets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Pick a Market",
                description: "Browse live controversies and find one you have a strong opinion about.",
                number: "01",
              },
              {
                icon: Zap,
                title: "Place Your Bet",
                description: "Choose your side, stake your APT, and wait for an opponent to match.",
                number: "02",
              },
              {
                icon: Shield,
                title: "Win Big",
                description: "If your side wins, collect the pool minus a 2% protocol fee.",
                number: "03",
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="poster-card p-8 text-center relative"
              >
                {/* Step number */}
                <div 
                  className="absolute -top-4 -left-4 font-comic text-6xl text-primary/20"
                  style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}
                >
                  {step.number}
                </div>
                
                <div className="w-16 h-16 mx-auto mb-6 border-4 border-foreground flex items-center justify-center bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 
                  className="font-display text-2xl tracking-wider mb-3"
                  style={{ textShadow: '2px 2px 0 rgba(255,0,0,0.2)' }}
                >
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Top and bottom lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background-dark border-t-4 border-foreground relative">
        <div className="absolute inset-0 noise-overlay" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-display text-muted-foreground text-lg tracking-wider">
            Klash Alpha • Running on Aptos Testnet • No real funds used
          </p>
          <p className="text-muted-foreground/50 text-xs mt-2 font-mono">
            © 2025 Klash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
