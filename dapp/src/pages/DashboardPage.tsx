import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { fetchTransactions, microStxToStx, shortenAddress, getTxExplorerUrl, type StacksTransaction } from "@/lib/stacks";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { address, isConnected, connect } = useWallet();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<StacksTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  useEffect(() => {
    if (isConnected && address) {
      loadTxs();
    }
  }, [isConnected, address]);

  const loadTxs = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const txs = await fetchTransactions(address);
      setTransactions(txs);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Connect your wallet</h1>
          <p className="text-muted-foreground mb-6">View your transaction history by connecting your Stacks wallet.</p>
          <Button onClick={connect} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    );
  }

  // Filter STX transfer transactions
  const stxTransferTxs = transactions.filter(
    (tx) => tx.tx_type === "token_transfer" || tx.tx_type === "contract_call"
  );

  const filteredTxs = stxTransferTxs.filter((tx) => {
    if (filter === "sent") return tx.sender_address === address;
    if (filter === "received") return tx.sender_address !== address;
    return true;
  });

  const totalSent = stxTransferTxs
    .filter((tx) => tx.sender_address === address)
    .reduce((sum, tx) => sum + parseInt(tx.fee_rate || "0"), 0);

  const totalReceived = stxTransferTxs
    .filter((tx) => tx.sender_address !== address)
    .length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1 font-mono text-sm">{address}</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadTxs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="card-gradient border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stxTransferTxs.length}</p>
          </div>
          <div className="card-gradient border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Sent</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {stxTransferTxs.filter((t) => t.sender_address === address).length}
            </p>
          </div>
          <div className="card-gradient border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Received</p>
            <p className="text-2xl font-bold text-accent mt-1">{totalReceived}</p>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {(["all", "sent", "received"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tx List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading transactions...</div>
          ) : filteredTxs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No transactions found</div>
          ) : (
            <div className="space-y-2">
              {filteredTxs.map((tx) => {
                const isSent = tx.sender_address === address;
                return (
                  <div
                    key={tx.tx_id}
                    className="card-gradient border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isSent ? "bg-primary/10" : "bg-accent/10"
                        }`}
                      >
                        {isSent ? (
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {isSent ? `To: ${shortenAddress(tx.contract_call?.function_args?.[0]?.repr?.replace("'", "") || "unknown")}` : `From: ${shortenAddress(tx.sender_address)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.burn_block_time_iso ? new Date(tx.burn_block_time_iso).toLocaleDateString() : "Pending"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          tx.tx_status === "success"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {tx.tx_status}
                      </span>
                      <a
                        href={getTxExplorerUrl(tx.tx_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
