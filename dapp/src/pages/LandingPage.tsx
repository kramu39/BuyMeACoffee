import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Link2, BarChart3, Shield, Wallet, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";

const features = [
  {
    icon: Link2,
    title: "One-Click Tip Links",
    desc: "Create a personalised link in seconds. Pre-fill any STX amount and share it anywhere Twitter, email, or a QR code on a stream.",
    accent: "text-primary",
    glow: "group-hover:shadow-glow-orange",
  },
  {
    icon: Zap,
    title: "Lightning-Fast On-Chain",
    desc: "Tips land directly in the recipient's wallet on Stacks mainnet. No middlemen, no delays  just a confirmed transaction in seconds.",
    accent: "text-yellow-500",
    glow: "group-hover:shadow-[0_0_16px_rgba(234,179,8,0.35)]",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    desc: "Every tip you send or receive shows up instantly. Filter by date, chart your support over time, and export with one click.",
    accent: "text-accent",
    glow: "group-hover:shadow-glow-green",
  },
  {
    icon: Shield,
    title: "Non-Custodial & Safe",
    desc: "Post-conditions are baked into every call so the contract can never move more STX than you approved. Your keys, your coins.",
    accent: "text-blue-400",
    glow: "group-hover:shadow-[0_0_16px_rgba(96,165,250,0.35)]",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const { isConnected, connect } = useWallet();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" />

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              Built on Stacks Mainnet
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
              Tip Builders
              <br />
              <span className="text-primary">Effortlessly</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Empower creators with quick STX tips. Share links, pre-fill amounts, and track transactions seamlessly.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-orange text-base px-8">
                <Link to="/create">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {!isConnected && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={connect}
                  className="text-base px-8 border-border hover:bg-muted"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </motion.div>

          {/* Floating coffee cup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <span className="text-8xl animate-float inline-block">☕</span>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything a builder needs to{" "}
              <span className="text-primary">get tipped</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              From a single shareable link to a full transaction history BuyMeCoffee handles the whole journey on Stacks.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="card-gradient rounded-2xl border border-border p-6 hover:shadow-soft transition-all duration-300 group flex flex-col gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center transition-shadow duration-300 ${f.glow}`}>
                  <f.icon className={`h-6 w-6 ${f.accent}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to support builders?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Connect your wallet and start tipping in seconds.
            </p>
            <Button
              size="lg"
              onClick={isConnected ? undefined : connect}
              asChild={isConnected}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-green text-base px-8"
            >
              {isConnected ? (
                <Link to="/tip-form">Start Tipping ☕</Link>
              ) : (
                <span>Connect Wallet & Start</span>
              )}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
