import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";

interface WalletState {
  isConnected: boolean;
  address: string;
  isOnTestnet: boolean;
  hasFaucetFunds: boolean;
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateTestnetStatus: (isOnTestnet: boolean) => void;
  updateFaucetStatus: (hasFaucetFunds: boolean) => void;
  canTrade: boolean;
}

const defaultWallet: WalletState = {
  isConnected: false,
  address: "",
  isOnTestnet: true, // Default to true for demo
  hasFaucetFunds: true, // Default to true for demo
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(defaultWallet);
  const aptosWallet = useAptosWallet();

  // Sync with Aptos wallet adapter
  useEffect(() => {
    if (aptosWallet.connected && aptosWallet.account?.address) {
      setWallet((prev) => ({
        ...prev,
        isConnected: true,
        address: aptosWallet.account.address.toString(),
      }));
    } else {
      setWallet((prev) => ({
        ...prev,
        isConnected: false,
        address: "",
      }));
    }
  }, [aptosWallet.connected, aptosWallet.account?.address]);

  const connectWallet = async () => {
    try {
      // Find Petra wallet in available wallets
      const petraWallet = aptosWallet.wallets.find(w => w.name === "Petra");
      if (petraWallet) {
        aptosWallet.connect(petraWallet.name);
      } else {
        // Petra not found, open install page
        window.open("https://petra.app/", "_blank");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    aptosWallet.disconnect();
    setWallet(defaultWallet);
  };

  const updateTestnetStatus = (isOnTestnet: boolean) => {
    setWallet((prev) => ({ ...prev, isOnTestnet }));
  };

  const updateFaucetStatus = (hasFaucetFunds: boolean) => {
    setWallet((prev) => ({ ...prev, hasFaucetFunds }));
  };

  const canTrade = wallet.isConnected && wallet.isOnTestnet && wallet.hasFaucetFunds;

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        updateTestnetStatus,
        updateFaucetStatus,
        canTrade,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
