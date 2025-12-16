import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import { CreateMarketDialog } from "./CreateMarketDialog";
import klashLogo from "@/assets/klash-logo.svg";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { wallet, disconnectWallet } = useWallet();
  const location = useLocation();

  const navItems = [
    { label: "MARKETS", path: "/" },
    { label: "PORTFOLIO", path: "/portfolio" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background-dark/95 backdrop-blur-sm border-b-4 border-foreground"
      >
        {/* Red accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
        
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.img
                src={klashLogo}
                alt="Klash"
                className="h-8 w-auto"
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                style={{ filter: 'drop-shadow(2px 2px 0 rgba(255,0,0,0.5))' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-display text-lg tracking-widest transition-colors group ${
                    isActive(item.path) ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  {/* Underline effect */}
                  <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 ${
                      isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Create Market + Wallet Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
                className="font-display tracking-wider border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="mr-1 h-4 w-4" />
                CREATE
              </Button>
              
              {wallet.isConnected ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm border-2 border-dashed border-muted px-3 py-1">
                    <span className="font-mono text-foreground">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={disconnectWallet}
                    className="font-display tracking-wider border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  >
                    DISCONNECT
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="success" 
                  onClick={() => setShowWalletDialog(true)}
                  className="font-display tracking-wider comic-border !border-accent !shadow-[4px_4px_0_hsl(var(--foreground))]"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  CONNECT
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground p-2 border-2 border-foreground hover:bg-foreground hover:text-secondary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background-dark border-t-2 border-foreground"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-display text-xl tracking-widest py-2 border-b-2 border-dashed border-muted ${
                      isActive(item.path) ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(true);
                    setIsOpen(false);
                  }}
                  className="w-full font-display tracking-wider border-2 border-primary text-primary"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  CREATE MARKET
                </Button>
                
                <div className="pt-4 border-t-2 border-foreground">
                  {wallet.isConnected ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground font-mono">
                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={disconnectWallet}
                        className="font-display tracking-wider"
                      >
                        DISCONNECT
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="success"
                      className="w-full font-display tracking-wider"
                      onClick={() => {
                        setShowWalletDialog(true);
                        setIsOpen(false);
                      }}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      CONNECT WALLET
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <ConnectWalletDialog open={showWalletDialog} onOpenChange={setShowWalletDialog} />
      <CreateMarketDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </>
  );
};
