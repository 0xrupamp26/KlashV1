import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/context/WalletContext";
import { useMarket } from "@/context/MarketContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Zap } from "lucide-react";

interface CreateMarketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateMarketDialog: React.FC<CreateMarketDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { wallet } = useWallet();
  const { addMarket } = useMarket();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");

  const isValid = title.trim() && description.trim() && sideA.trim() && sideB.trim();

  const handleCreate = () => {
    if (!isValid) return;

    addMarket({
      title: title.trim(),
      description: description.trim(),
      sideA: sideA.trim(),
      sideB: sideB.trim(),
      createdBy: wallet.address,
    });

    toast({
      title: "Market Created!",
      description: "Your controversy is now live.",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setSideA("");
    setSideB("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wider flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Create Market
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Start a new controversy and let the community decide.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-display tracking-wider">
              Controversy Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Will AI replace developers by 2030?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input border-border"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-display tracking-wider">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide context for this controversy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border min-h-[80px]"
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sideA" className="font-display tracking-wider text-success">
                Side A
              </Label>
              <Input
                id="sideA"
                placeholder="e.g., Yes, definitely"
                value={sideA}
                onChange={(e) => setSideA(e.target.value)}
                className="bg-input border-border border-success/30"
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sideB" className="font-display tracking-wider text-destructive">
                Side B
              </Label>
              <Input
                id="sideB"
                placeholder="e.g., No chance"
                value={sideB}
                onChange={(e) => setSideB(e.target.value)}
                className="bg-input border-border border-destructive/30"
                maxLength={50}
              />
            </div>
          </div>

          {!wallet.isConnected && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
              <p className="text-sm text-warning">
                Connect your wallet to create a market.
              </p>
            </div>
          )}

          <Button
            variant="success"
            className="w-full font-display tracking-wider"
            onClick={handleCreate}
            disabled={!isValid || !wallet.isConnected}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Market
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
