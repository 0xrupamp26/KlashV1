import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { Wallet, ExternalLink } from "lucide-react";

interface ConnectWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectWalletDialog: React.FC<ConnectWalletDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { connectWallet } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wider">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect your Petra wallet to use Klash on Aptos Testnet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="p-4 border-2 border-dashed border-muted rounded-lg bg-muted/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg">Petra Wallet</h3>
                <p className="text-xs text-muted-foreground">Aptos Ecosystem</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Click below to connect your Petra wallet. Make sure you're on Aptos Testnet.
            </p>
          </div>

          <Button
            variant="success"
            className="w-full font-display tracking-wider"
            onClick={handleConnect}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Petra Wallet
          </Button>

          <div className="text-center">
            <a
              href="https://petra.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Don't have Petra? Install it here
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
            <p className="text-sm text-warning">
              Demo mode: Ensure you're on Aptos Testnet with faucet funds to place bets.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
