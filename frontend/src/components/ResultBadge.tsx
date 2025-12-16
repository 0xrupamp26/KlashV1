import React from "react";
import { motion } from "framer-motion";
import { Trophy, XCircle, RefreshCw, Percent, DollarSign } from "lucide-react";
import { MarketResult } from "@/context/MarketContext";
import { Market } from "@/data/markets";

interface ResultBadgeProps {
  result: MarketResult;
  market: Market;
  userSide?: "A" | "B";
}

export const ResultBadge: React.FC<ResultBadgeProps> = ({ result, market, userSide }) => {
  const isWinner = userSide === result.winner;
  const isRefund = result.winner === "refund";

  const getWinnerLabel = () => {
    if (isRefund) return "Refund (Same side)";
    return result.winner === "A" ? market.sideA : market.sideB;
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-card border border-border rounded-xl p-6 space-y-4"
    >
      {/* Result Header */}
      <div className="flex items-center justify-center gap-3">
        {isRefund ? (
          <RefreshCw className="h-8 w-8 text-warning animate-spin" style={{ animationDuration: "3s" }} />
        ) : (
          <Trophy className="h-8 w-8 text-warning" />
        )}
        <h3 className="font-display text-2xl tracking-wider">
          {isRefund ? "Market Refunded" : "Market Resolved"}
        </h3>
      </div>

      {/* Winner */}
      <div className="text-center py-4 bg-muted/50 rounded-lg">
        <span className="text-sm text-muted-foreground block mb-1">
          {isRefund ? "Outcome" : "Winner"}
        </span>
        <span className="font-display text-xl text-foreground">
          {getWinnerLabel()}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground block">Total Pool</span>
          <span className="font-bold text-foreground">{result.totalPool} APT</span>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <Percent className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground block">Protocol Fee (2%)</span>
          <span className="font-bold text-foreground">{result.fee.toFixed(2)} APT</span>
        </div>
        <div className="text-center p-3 bg-accent/20 rounded-lg">
          <Trophy className="h-5 w-5 mx-auto mb-1 text-accent" />
          <span className="text-xs text-muted-foreground block">Winner Receives</span>
          <span className="font-bold text-accent">{result.winnerPayout.toFixed(2)} APT</span>
        </div>
      </div>

      {/* User Status */}
      {userSide && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center p-4 rounded-lg ${
            isRefund
              ? "bg-warning/20 border border-warning/30"
              : isWinner
              ? "bg-accent/20 border border-accent/30"
              : "bg-destructive/20 border border-destructive/30"
          }`}
        >
          {isRefund ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5 text-warning" />
              <span className="font-display text-lg text-warning">Your stake was refunded</span>
            </div>
          ) : isWinner ? (
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="font-display text-lg text-accent">Congratulations! You won!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <XCircle className="h-5 w-5 text-destructive-foreground" />
              <span className="font-display text-lg text-destructive-foreground">Better luck next time!</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
