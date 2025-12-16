import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Market } from "@/data/markets";
import { Loader2, Users, Lock } from "lucide-react";

interface BetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  market: Market;
  onPlaceBet: (side: "A" | "B", amount: number) => void;
  disabled?: boolean;
  existingBets?: number;
}

export const BetDialog: React.FC<BetDialogProps> = ({
  open,
  onOpenChange,
  market,
  onPlaceBet,
  disabled,
  existingBets = 0,
}) => {
  const [step, setStep] = useState<"mode" | "side" | "amount">("mode");
  const [selectedMode, setSelectedMode] = useState<"1v1" | "multi">("1v1");
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeSelect = () => {
    if (selectedMode === "1v1") {
      setStep("side");
    }
  };

  const handleSideSelect = () => {
    if (selectedSide) {
      setStep("amount");
    }
  };

  const handleSubmit = async () => {
    if (!selectedSide || !amount || parseFloat(amount) <= 0) return;
    
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    onPlaceBet(selectedSide, parseFloat(amount));
    setIsSubmitting(false);
    
    // Reset state
    setStep("mode");
    setSelectedMode("1v1");
    setSelectedSide(null);
    setAmount("");
    onOpenChange(false);
  };

  const resetDialog = () => {
    setStep("mode");
    setSelectedMode("1v1");
    setSelectedSide(null);
    setAmount("");
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) resetDialog();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wider">
            Place Your Bet
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {market.title}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Mode Selection */}
          {step === "mode" && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-4"
            >
              <p className="text-sm text-muted-foreground">
                How many players should this market run with?
              </p>

              <RadioGroup
                value={selectedMode}
                onValueChange={(v) => setSelectedMode(v as "1v1" | "multi")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 border border-border hover:border-accent transition-colors cursor-pointer">
                  <RadioGroupItem value="1v1" id="1v1" />
                  <Label htmlFor="1v1" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span className="font-semibold">Exactly 2 players (1v1)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Head-to-head betting, winner takes all (minus 2% fee)
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border border-border opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="multi" id="multi" disabled />
                  <Label htmlFor="multi" className="flex-1">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span className="font-semibold">More than 2 players</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Multiple participants, pool-based payouts
                    </p>
                  </Label>
                </div>
              </RadioGroup>

              <Button
                variant="success"
                className="w-full"
                onClick={handleModeSelect}
                disabled={selectedMode !== "1v1"}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Side Selection */}
          {step === "side" && (
            <motion.div
              key="side"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-4"
            >
              <p className="text-sm text-muted-foreground">
                Which side do you believe will win?
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSide("A")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedSide === "A"
                      ? "border-accent bg-accent/20"
                      : "border-border bg-muted/30 hover:border-accent/50"
                  }`}
                >
                  <span className="text-xs text-muted-foreground block mb-2">
                    Side A
                  </span>
                  <span className="font-display text-lg">{market.sideA}</span>
                </button>

                <button
                  onClick={() => setSelectedSide("B")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedSide === "B"
                      ? "border-primary bg-primary/20"
                      : "border-border bg-muted/30 hover:border-primary/50"
                  }`}
                >
                  <span className="text-xs text-muted-foreground block mb-2">
                    Side B
                  </span>
                  <span className="font-display text-lg">{market.sideB}</span>
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("mode")}
                >
                  Back
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleSideSelect}
                  disabled={!selectedSide}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Amount */}
          {step === "amount" && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 pt-4"
            >
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <span className="text-xs text-muted-foreground">Your pick:</span>
                <p className="font-display text-lg">
                  {selectedSide === "A" ? market.sideA : market.sideB}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Stake Amount (APT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-input border-border text-lg"
                  min="0"
                  step="0.1"
                />
                <div className="flex gap-2">
                  {[1, 5, 10, 25].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="flex-1 py-1 rounded bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
                    >
                      {preset} APT
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-xs text-warning">
                  ⚠️ This is a testnet demo. No real funds are used. A 2% protocol fee applies to all winning bets.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("side")}
                >
                  Back
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!amount || parseFloat(amount) <= 0 || isSubmitting || disabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing...
                    </>
                  ) : (
                    "Place Bet"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
