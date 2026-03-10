import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/context/WalletContext";
import { isValidStacksAddress, sendTip, getTxExplorerUrl } from "@/lib/stacks";
import { toast } from "sonner";
import { Coffee, ExternalLink } from "lucide-react";

export default function TipPage() {
  const [searchParams] = useSearchParams();
  const { address, isConnected, connect } = useWallet();

  const prefilledTo = searchParams.get("to") || "";
  const prefilledAmount = searchParams.get("amount") || "";

  const [recipient, setRecipient] = useState(prefilledTo);
  const [amount, setAmount] = useState(prefilledAmount);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (prefilledTo) setRecipient(prefilledTo);
    if (prefilledAmount) setAmount(prefilledAmount);
  }, [prefilledTo, prefilledAmount]);

  const handleTip = async () => {
    if (!isConnected || !address) {
      connect();
      return;
    }
    if (!recipient || !isValidStacksAddress(recipient)) {
      toast.error("Invalid Stacks address");
      return;
    }
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setSending(true);
    try {
      await sendTip(
        address,
        recipient,
        amountNum,
        (txId) => {
          toast.success(
            <div className="flex items-center gap-2">
              <span>Tip Sent! ☕</span>
              <a
                href={getTxExplorerUrl(txId)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline flex items-center gap-1"
              >
                View <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          );
        },
        () => {
          toast.info("Transaction cancelled");
        }
      );
    } catch (e: any) {
      toast.error(e.message || "Transaction failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-3xl font-bold text-foreground">Send a Tip</h1>
          <p className="mt-2 text-muted-foreground">
            {prefilledTo ? "You've been invited to send a tip!" : "Tip your favorite builder with STX"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-gradient border border-border rounded-2xl p-6 shadow-soft"
        >
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-foreground">Recipient Address</Label>
              <Input
                placeholder="SP..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                readOnly={!!prefilledTo}
                className="mt-1.5 font-mono text-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground">Amount (STX)</Label>
              <Input
                type="number"
                placeholder="1"
                min="0.000001"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                readOnly={!!prefilledAmount}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum: 0.000001 STX. Suggested: 1+ STX</p>
            </div>

            <Button
              onClick={handleTip}
              disabled={sending}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-green text-base h-12"
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Sending...
                </span>
              ) : !isConnected ? (
                "Connect Wallet to Tip"
              ) : (
                <span className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" /> Send Tip
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
