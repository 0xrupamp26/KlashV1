import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Clock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BetDialog } from "@/components/BetDialog";
import { ResultBadge } from "@/components/ResultBadge";
import { getCategoryColor } from "@/data/markets";
import { useWallet } from "@/context/WalletContext";
import { useMarket } from "@/context/MarketContext";
import { toast } from "@/hooks/use-toast";

const MarketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { wallet, canTrade } = useWallet();
  const {
    markets,
    getMarketStatus,
    getMarketBets,
    placeBet,
    setMarketStatus,
    resolveMarket,
    results,
    isViewingAsOpponent,
    setViewingAsOpponent,
    opponentAddress,
  } = useMarket();

  const [showBetDialog, setShowBetDialog] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const market = markets.find((m) => m.id === id);
  
  if (!market) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground font-display text-2xl">MARKET NOT FOUND</p>
      </div>
    );
  }

  const status = getMarketStatus(market.id, market.status);
  const marketBets = getMarketBets(market.id);
  const result = results.get(market.id);
  const currentAddress = isViewingAsOpponent ? opponentAddress : wallet.address;
  const userBet = marketBets.find((b) => b.address === currentAddress);

  const handlePlaceBet = (side: "A" | "B", amount: number) => {
    placeBet({
      marketId: market.id,
      side,
      amount,
      address: currentAddress,
      timestamp: Date.now(),
    });

    const newBets = getMarketBets(market.id);
    
    if (newBets.length === 0) {
      setMarketStatus(market.id, "WAITING_FOR_SECOND");
      toast({
        title: "BET PLACED!",
        description: "Waiting for an opponent to match your bet...",
      });
    } else if (marketBets.length === 1) {
      setMarketStatus(market.id, "LOCKED");
      toast({
        title: "BET MATCHED!",
        description: "Auto-resolving market...",
      });
      
      setIsResolving(true);
      setTimeout(() => {
        const resolvedResult = resolveMarket(market.id);
        setIsResolving(false);
        
        if (resolvedResult) {
          const winnerSide = resolvedResult.winner;
          const isUserWinner = userBet?.side === winnerSide || side === winnerSide;
          
          if (resolvedResult.winner === "refund") {
            toast({
              title: "MARKET REFUNDED",
              description: "Both players chose the same side. Bets refunded.",
            });
          } else if (isUserWinner) {
            toast({
              title: "🏆 YOU WON!",
              description: `Congratulations! You receive ${resolvedResult.winnerPayout.toFixed(2)} APT`,
            });
          } else {
            toast({
              title: "BETTER LUCK NEXT TIME",
              description: "Your opponent won this round.",
              variant: "destructive",
            });
          }
        }
      }, 2000);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-accent text-accent-foreground border-2 border-accent font-display">OPEN</Badge>;
      case "WAITING_FOR_SECOND":
        return <Badge className="bg-warning text-warning-foreground border-2 border-warning font-display animate-pulse">WAITING</Badge>;
      case "LOCKED":
        return <Badge className="bg-muted text-muted-foreground border-2 border-muted font-display">LOCKED</Badge>;
      case "RESOLVED":
        return <Badge className="bg-primary text-primary-foreground border-2 border-primary font-display">RESOLVED</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background-dark relative">
      {/* Background */}
      <div className="absolute inset-0 diagonal-stripes opacity-20" />
      <div className="absolute inset-0 halftone opacity-20" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="font-display tracking-wider hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK TO MARKETS
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="poster-card p-6 halftone"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className={`${getCategoryColor(market.category)} font-comic`}>
                    {market.category}
                  </Badge>
                  {getStatusBadge()}
                </div>

                <h1 
                  className="font-display text-3xl md:text-4xl tracking-wider mb-4"
                  style={{ textShadow: '3px 3px 0 rgba(255,0,0,0.3)' }}
                >
                  {market.title}
                </h1>

                <p className="text-muted-foreground mb-6">
                  {market.description}
                </p>

                {/* Sides Display - VS Style */}
                <div className="flex items-center gap-4">
                  <div className={`flex-1 p-4 border-4 transition-all ${
                    userBet?.side === "A" ? "border-accent bg-accent/10" : "border-foreground/30 bg-muted/30"
                  }`}>
                    <span className="text-xs text-muted-foreground block mb-2 font-comic">SIDE A</span>
                    <span className="font-display text-xl">{market.sideA}</span>
                    {userBet?.side === "A" && (
                      <span className="text-xs text-accent block mt-2 font-mono">YOUR PICK • {userBet.amount} APT</span>
                    )}
                  </div>
                  <span className="font-comic text-4xl text-primary" style={{ textShadow: '3px 3px 0 #000' }}>
                    VS
                  </span>
                  <div className={`flex-1 p-4 border-4 transition-all ${
                    userBet?.side === "B" ? "border-primary bg-primary/10" : "border-foreground/30 bg-muted/30"
                  }`}>
                    <span className="text-xs text-muted-foreground block mb-2 font-comic">SIDE B</span>
                    <span className="font-display text-xl">{market.sideB}</span>
                    {userBet?.side === "B" && (
                      <span className="text-xs text-primary block mt-2 font-mono">YOUR PICK • {userBet.amount} APT</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Resolution State */}
            <AnimatePresence mode="wait">
              {isResolving && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="poster-card p-8 text-center"
                >
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                  <h3 className="font-display text-2xl tracking-wider mb-2">
                    AUTO-RESOLVING...
                  </h3>
                  <p className="text-muted-foreground font-comic">
                    Determining the winner
                  </p>
                </motion.div>
              )}

              {result && !isResolving && (
                <ResultBadge result={result} market={market} userSide={userBet?.side} />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="poster-card p-6"
            >
              <h3 className="font-display text-xl tracking-wider mb-4 border-b-2 border-dashed border-muted pb-2">
                MARKET INFO
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-comic">PARTICIPANTS</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-display text-lg">{marketBets.length} / 2</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-comic">MODE</span>
                  <span className="font-display text-lg">1v1</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-comic">PROTOCOL FEE</span>
                  <span className="font-display text-lg text-primary">2%</span>
                </div>

                {marketBets.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-muted">
                    <span className="text-muted-foreground text-sm font-comic">TOTAL POOL</span>
                    <span className="font-display text-lg text-accent">
                      {marketBets.reduce((sum, b) => sum + b.amount, 0)} APT
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="poster-card p-6"
            >
              {!wallet.isConnected ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4 font-comic">
                    Connect your wallet to place a bet
                  </p>
                  <Button variant="outline" className="w-full font-display" disabled>
                    CONNECT WALLET FIRST
                  </Button>
                </div>
              ) : !canTrade ? (
                <div className="text-center">
                  <p className="text-warning text-sm mb-4 font-comic">
                    Switch to Aptos Testnet and claim faucet funds to trade
                  </p>
                  <Button variant="outline" className="w-full font-display" disabled>
                    PLACE BET
                  </Button>
                </div>
              ) : status === "RESOLVED" ? (
                <div className="text-center">
                  <p className="text-muted-foreground font-comic">
                    This market has been resolved
                  </p>
                </div>
              ) : userBet ? (
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-4 text-warning animate-pulse" />
                  <p className="text-muted-foreground mb-2 font-comic">
                    Waiting for opponent...
                  </p>
                  <p className="text-sm text-muted-foreground/70 font-mono">
                    Your bet: {userBet.amount} APT on {userBet.side === "A" ? market.sideA : market.sideB}
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    variant="success"
                    size="lg"
                    className="w-full mb-4 font-display tracking-wider comic-border !border-accent !shadow-[4px_4px_0_hsl(var(--foreground))]"
                    onClick={() => setShowBetDialog(true)}
                  >
                    PLACE BET
                  </Button>
                  <p className="text-xs text-muted-foreground text-center font-comic">
                    TESTNET ONLY • NO REAL FUNDS
                  </p>
                </>
              )}
            </motion.div>

            {/* Opponent View Toggle */}
            {wallet.isConnected && marketBets.length > 0 && status !== "RESOLVED" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted/30 border-2 border-dashed border-muted p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-display tracking-wider">DEMO MODE</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {isViewingAsOpponent ? "Viewing as opponent" : "Viewing as yourself"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingAsOpponent(!isViewingAsOpponent)}
                    className="font-display text-xs"
                  >
                    {isViewingAsOpponent ? (
                      <>
                        <EyeOff className="mr-2 h-3 w-3" />
                        YOU
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-3 w-3" />
                        OPPONENT
                      </>
                    )}
                  </Button>
                </div>
                {isViewingAsOpponent && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    Address: {opponentAddress}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <BetDialog
        open={showBetDialog}
        onOpenChange={setShowBetDialog}
        market={market}
        onPlaceBet={handlePlaceBet}
        disabled={!canTrade}
        existingBets={marketBets.length}
      />
    </div>
  );
};

export default MarketDetail;
