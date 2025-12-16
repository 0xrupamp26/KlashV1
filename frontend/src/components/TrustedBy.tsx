import React from "react";
import { motion } from "framer-motion";

// Community logos - using text placeholders styled as logos
const communities = [
  { name: "APTOS", id: "aptos" },
  { name: "MOVEMENT", id: "movement" },
  { name: "PETRA", id: "petra" },
  { name: "PONTEM", id: "pontem" },
  { name: "MARTIAN", id: "martian" },
];

export const TrustedBy: React.FC = () => {
  return (
    <section className="py-12 bg-background-dark relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />
      
      {/* Diagonal line accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="font-comic text-sm text-muted-foreground tracking-[0.3em] uppercase">
            Trusted by
          </span>
          <h3 className="font-display text-2xl tracking-wider mt-1 text-foreground">
            Leading Communities
          </h3>
        </motion.div>

        {/* Logo strip - fight poster style */}
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {communities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="group relative cursor-pointer"
            >
              {/* Glitch/shake on hover */}
              <div className="glitch-hover">
                <span 
                  className="font-display text-xl md:text-2xl tracking-widest text-muted-foreground/60 
                             group-hover:text-foreground transition-colors duration-200
                             relative inline-block"
                  style={{
                    textShadow: 'none',
                  }}
                >
                  {community.name}
                </span>
                
                {/* Red underline on hover */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Corner brackets on hover */}
              <div className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary" />
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-8 gap-4">
          <div className="w-16 h-0.5 bg-muted" />
          <div className="w-2 h-2 bg-primary rotate-45" />
          <div className="w-16 h-0.5 bg-muted" />
        </div>
      </div>
    </section>
  );
};
