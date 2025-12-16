import React, { createContext, useContext, useState, ReactNode } from "react";
import { Market, MarketStatus, markets as initialMarkets } from "@/data/markets";

export interface Bet {
  marketId: string;
  side: "A" | "B";
  amount: number;
  address: string;
  timestamp: number;
}

export interface MarketResult {
  marketId: string;
  winner: "A" | "B" | "refund";
  totalPool: number;
  fee: number;
  winnerPayout: number;
}

interface NewMarketInput {
  title: string;
  description: string;
  sideA: string;
  sideB: string;
  createdBy: string;
}

interface MarketContextType {
  bets: Bet[];
  results: Map<string, MarketResult>;
  marketStatuses: Map<string, MarketStatus>;
  markets: Market[];
  placeBet: (bet: Bet) => void;
  getMarketBets: (marketId: string) => Bet[];
  getMarketStatus: (marketId: string, defaultStatus: MarketStatus) => MarketStatus;
  setMarketStatus: (marketId: string, status: MarketStatus) => void;
  resolveMarket: (marketId: string) => MarketResult | null;
  getPortfolioForAddress: (address: string) => { bet: Bet; result?: MarketResult }[];
  isViewingAsOpponent: boolean;
  setViewingAsOpponent: (viewing: boolean) => void;
  opponentAddress: string;
  addMarket: (input: NewMarketInput) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const PLATFORM_FEE = 0.02;

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [results, setResults] = useState<Map<string, MarketResult>>(new Map());
  const [marketStatuses, setMarketStatuses] = useState<Map<string, MarketStatus>>(new Map());
  const [isViewingAsOpponent, setViewingAsOpponent] = useState(false);
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const opponentAddress = "0x0pp0n3nt...d3m0";

  const placeBet = (bet: Bet) => {
    setBets((prev) => [...prev, bet]);
  };

  const getMarketBets = (marketId: string) => {
    return bets.filter((b) => b.marketId === marketId);
  };

  const getMarketStatus = (marketId: string, defaultStatus: MarketStatus): MarketStatus => {
    return marketStatuses.get(marketId) || defaultStatus;
  };

  const setMarketStatus = (marketId: string, status: MarketStatus) => {
    setMarketStatuses((prev) => {
      const newMap = new Map(prev);
      newMap.set(marketId, status);
      return newMap;
    });
  };

  const resolveMarket = (marketId: string): MarketResult | null => {
    const marketBets = getMarketBets(marketId);
    if (marketBets.length < 2) return null;

    const bet1 = marketBets[0];
    const bet2 = marketBets[1];

    let winner: "A" | "B" | "refund";

    if (bet1.side === bet2.side) {
      winner = "refund";
    } else {
      winner = Math.random() > 0.5 ? "A" : "B";
    }

    const totalPool = bet1.amount + bet2.amount;
    const fee = winner === "refund" ? 0 : totalPool * PLATFORM_FEE;
    const winnerPayout = winner === "refund" ? totalPool : totalPool - fee;

    const result: MarketResult = {
      marketId,
      winner,
      totalPool,
      fee,
      winnerPayout,
    };

    setResults((prev) => {
      const newMap = new Map(prev);
      newMap.set(marketId, result);
      return newMap;
    });

    setMarketStatus(marketId, "RESOLVED");

    return result;
  };

  const getPortfolioForAddress = (address: string) => {
    const userBets = bets.filter((b) => b.address === address);
    return userBets.map((bet) => ({
      bet,
      result: results.get(bet.marketId),
    }));
  };

  const addMarket = (input: NewMarketInput) => {
    const newMarket: Market = {
      id: `user-${Date.now()}`,
      title: input.title,
      description: input.description,
      sideA: input.sideA,
      sideB: input.sideB,
      status: "OPEN",
      category: "User Created",
    };
    setMarkets((prev) => [newMarket, ...prev]);
  };

  return (
    <MarketContext.Provider
      value={{
        bets,
        results,
        marketStatuses,
        markets,
        placeBet,
        getMarketBets,
        getMarketStatus,
        setMarketStatus,
        resolveMarket,
        getPortfolioForAddress,
        isViewingAsOpponent,
        setViewingAsOpponent,
        opponentAddress,
        addMarket,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
};
