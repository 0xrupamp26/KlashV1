import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { Market, getCategoryColor } from "@/data/markets";
import { useMarket } from "@/context/MarketContext";
import { Badge } from "@/components/ui/badge";

interface MarketCardProps {
  market: Market;
  index: number;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, index }) => {
  const { getMarketStatus, getMarketBets } = useMarket();
  const status = getMarketStatus(market.id, market.status);
  const bets = getMarketBets(market.id);

  const getStatusDisplay = () => {
    switch (status) {
      case "OPEN":
        return { label: "OPEN", className: "bg-accent text-accent-foreground border-accent" };
      case "WAITING_FOR_SECOND":
        return { label: "WAITING", className: "bg-warning text-warning-foreground border-warning" };
      case "LOCKED":
        return { label: "LOCKED", className: "bg-muted text-muted-foreground border-muted" };
      case "RESOLVED":
        return { label: "RESOLVED", className: "bg-primary text-primary-foreground border-primary" };
      default:
        return { label: status, className: "bg-muted text-muted-foreground border-muted" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/market/${market.id}`}>
        <div className="poster-card p-6 halftone">
          {/* Diagonal accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 -skew-x-12 translate-x-8 -translate-y-4" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Badge 
                variant="outline" 
                className={`${getCategoryColor(market.category)} font-comic text-xs tracking-wider uppercase`}
              >
                {market.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${statusDisplay.className} font-display tracking-wider`}
              >
                {statusDisplay.label}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-display text-xl md:text-2xl tracking-wide mb-3 group-hover:text-primary transition-colors"
                style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
              {market.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {market.description}
            </p>

            {/* Sides - VS style */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-accent/10 border-2 border-accent/30 p-3">
                <span className="text-xs text-muted-foreground block mb-1 font-comic">SIDE A</span>
                <span className="text-sm font-bold text-foreground">{market.sideA}</span>
              </div>
              <span className="font-comic text-2xl text-primary" style={{ textShadow: '2px 2px 0 #000' }}>
                VS
              </span>
              <div className="flex-1 bg-primary/10 border-2 border-primary/30 p-3">
                <span className="text-xs text-muted-foreground block mb-1 font-comic">SIDE B</span>
                <span className="text-sm font-bold text-foreground">{market.sideB}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="h-4 w-4" />
                <span className="font-mono">{bets.length}/2</span>
              </div>
              <div className="flex items-center gap-1 text-foreground font-display tracking-wider group-hover:text-primary transition-colors">
                <span className="text-sm">ENTER</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
