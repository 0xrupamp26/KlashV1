import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/context/WalletContext";
import { useMarket } from "@/context/MarketContext";
import { markets } from "@/data/markets";
import { Trophy, Clock, XCircle, RefreshCw, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Portfolio: React.FC = () => {
  const { wallet } = useWallet();
  const { getPortfolioForAddress, isViewingAsOpponent, opponentAddress } = useMarket();

  const currentAddress = isViewingAsOpponent ? opponentAddress : wallet.address;
  const portfolio = getPortfolioForAddress(currentAddress);

  const openBets = portfolio.filter((p) => !p.result);
  const resolvedBets = portfolio.filter((p) => p.result);

  const getMarketTitle = (marketId: string) => {
    return markets.find((m) => m.id === marketId)?.title || "Unknown Market";
  };

  const getMarket = (marketId: string) => {
    return markets.find((m) => m.id === marketId);
  };

  const getBetStatus = (item: typeof portfolio[0]) => {
    if (!item.result) {
      return { icon: Clock, label: "Pending", className: "text-warning" };
    }
    if (item.result.winner === "refund") {
      return { icon: RefreshCw, label: "Refunded", className: "text-warning" };
    }
    if (item.bet.side === item.result.winner) {
      return { icon: Trophy, label: "Won", className: "text-accent" };
    }
    return { icon: XCircle, label: "Lost", className: "text-destructive-foreground" };
  };

  const calculateNetPayout = (item: typeof portfolio[0]) => {
    if (!item.result) return null;
    if (item.result.winner === "refund") return item.bet.amount;
    if (item.bet.side === item.result.winner) return item.result.winnerPayout;
    return 0;
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background-dark">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Wallet className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="font-display text-3xl tracking-wider mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view your portfolio
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background-dark">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl tracking-wider mb-2">
            Portfolio
          </h1>
          <p className="text-muted-foreground">
            Track your bets and winnings
          </p>
          <p className="text-sm text-muted-foreground/70 font-mono mt-2">
            {currentAddress}
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Bets", value: portfolio.length },
            { label: "Open", value: openBets.length },
            { label: "Won", value: resolvedBets.filter((p) => p.result?.winner === p.bet.side).length },
            { label: "Total Staked", value: `${portfolio.reduce((sum, p) => sum + p.bet.amount, 0)} APT` },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-4 text-center"
            >
              <span className="text-sm text-muted-foreground block mb-1">{stat.label}</span>
              <span className="font-display text-2xl">{stat.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-muted">
              <TabsTrigger value="open" className="font-display tracking-wider">
                Open ({openBets.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="font-display tracking-wider">
                Resolved ({resolvedBets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open">
              {openBets.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No open bets</p>
                  <Link to="/">
                    <Button variant="outline">Explore Markets</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {openBets.map((item, index) => {
                    const market = getMarket(item.bet.marketId);
                    const status = getBetStatus(item);

                    return (
                      <motion.div
                        key={`${item.bet.marketId}-${item.bet.timestamp}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-xl border border-border p-6 card-hover"
                      >
                        <Link to={`/market/${item.bet.marketId}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-display text-xl tracking-wide mb-1">
                                {getMarketTitle(item.bet.marketId)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Your pick:{" "}
                                <span className="text-foreground font-semibold">
                                  {item.bet.side === "A" ? market?.sideA : market?.sideB}
                                </span>
                              </p>
                            </div>
                            <Badge className={`${status.className} bg-transparent border`}>
                              <status.icon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div>
                              <span className="text-xs text-muted-foreground block">Stake</span>
                              <span className="font-semibold">{item.bet.amount} APT</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground block">Status</span>
                              <span className="font-semibold text-warning">Waiting for opponent</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resolved">
              {resolvedBets.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No resolved bets yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resolvedBets.map((item, index) => {
                    const market = getMarket(item.bet.marketId);
                    const status = getBetStatus(item);
                    const netPayout = calculateNetPayout(item);

                    return (
                      <motion.div
                        key={`${item.bet.marketId}-${item.bet.timestamp}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-xl border border-border p-6"
                      >
                        <Link to={`/market/${item.bet.marketId}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-display text-xl tracking-wide mb-1">
                                {getMarketTitle(item.bet.marketId)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Your pick:{" "}
                                <span className="text-foreground font-semibold">
                                  {item.bet.side === "A" ? market?.sideA : market?.sideB}
                                </span>
                              </p>
                            </div>
                            <Badge className={`${status.className} bg-transparent border`}>
                              <status.icon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                            <div>
                              <span className="text-xs text-muted-foreground block">Stake</span>
                              <span className="font-semibold">{item.bet.amount} APT</span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">Fee</span>
                              <span className="font-semibold">
                                {item.result?.fee.toFixed(2) || "0"} APT
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground block">Net Payout</span>
                              <span className={`font-semibold ${status.className}`}>
                                {netPayout !== null ? `${netPayout.toFixed(2)} APT` : "-"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;
