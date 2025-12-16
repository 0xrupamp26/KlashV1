import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export const TestnetGuardBanner: React.FC = () => {
  const { wallet, canTrade } = useWallet();

  if (!wallet.isConnected || canTrade) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-16 left-0 right-0 z-40 bg-warning/20 border-b border-warning/50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-warning">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">
            {!wallet.isOnTestnet && "Switch to Aptos Testnet "}
            {!wallet.isOnTestnet && !wallet.hasFaucetFunds && "and "}
            {!wallet.hasFaucetFunds && "claim faucet funds "}
            to play Klash.{" "}
            <span className="text-muted-foreground">(Demo only – no real funds used)</span>
          </p>
          <a
            href="https://aptos.dev/en/network/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-foreground hover:underline"
          >
            Get Faucet <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
