import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/context/WalletContext";
import { isValidStacksAddress, stxToMicroStx } from "@/lib/stacks";
import { toast } from "sonner";

export default function CreateTipLink() {
  const { address, isConnected } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState(address || "");
  const [amount, setAmount] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-fill address when wallet connects
  if (isConnected && address && !recipientAddress) {
    setRecipientAddress(address);
  }

  const handleGenerate = () => {
    if (!recipientAddress || !isValidStacksAddress(recipientAddress)) {
      toast.error("Please enter a valid Stacks address");
      return;
    }

    const base = `${window.location.origin}/tip?to=${recipientAddress}`;
    const amountNum = parseFloat(amount);
    const link = amountNum > 0 ? `${base}&amount=${amountNum}` : base;
    setGeneratedLink(link);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetLink = () => {
    const text = encodeURIComponent(
      `☕ Buy me a coffee on Stacks! Tip me with STX: ${generatedLink}`
    );
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Create Tip Link</h1>
          <p className="mt-2 text-muted-foreground">
            Generate a shareable link for anyone to tip you with STX
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
              <Label htmlFor="address" className="text-sm font-medium text-foreground">
                Your Stacks Address
              </Label>
              <Input
                id="address"
                placeholder="SP..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Fixed Amount (STX) — optional
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 5"
                min="0"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Generate Link
            </Button>
          </div>

          {generatedLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="bg-muted rounded-xl p-4 break-all text-sm font-mono text-foreground mb-4">
                {generatedLink}
              </div>

              <div className="flex gap-2 mb-6">
                <Button variant="outline" size="sm" onClick={copyLink} className="flex-1">
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={tweetLink} className="flex-1">
                  <Share2 className="h-4 w-4 mr-1" /> Tweet
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="bg-background p-4 rounded-xl border border-border">
                  <QRCodeSVG value={generatedLink} size={180} />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
