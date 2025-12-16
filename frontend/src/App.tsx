import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

import { WalletProvider } from "@/context/WalletContext";
import { MarketProvider } from "@/context/MarketContext";
import { Navbar } from "@/components/Navbar";
import { TestnetGuardBanner } from "@/components/TestnetGuardBanner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CustomCursor } from "@/components/CustomCursor";
import Index from "./pages/Index";
import MarketDetail from "./pages/MarketDetail";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


// Route change loading component
const RouteChangeLoader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background-dark/90 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <TestnetGuardBanner />
      <RouteChangeLoader />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/market/:id" element={<MarketDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("klash-visited");
    if (visited) {
      setShowLoading(false);
      setHasVisited(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    sessionStorage.setItem("klash-visited", "true");
    setHasVisited(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider autoConnect={true}>
        <WalletProvider>
          <MarketProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <CustomCursor />
              
              <AnimatePresence mode="wait">
                {showLoading && !hasVisited && (
                  <LoadingScreen onComplete={handleLoadingComplete} />
                )}
              </AnimatePresence>

              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </MarketProvider>
        </WalletProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
};

export default App;
