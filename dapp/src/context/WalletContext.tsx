import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { connect as stacksConnect, disconnect as stacksDisconnect, isConnected as stacksIsConnected } from "@stacks/connect";
import { shortenAddress } from "@/lib/stacks";

interface WalletState {
  address: string | null;
  shortAddress: string;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState>({
  address: null,
  shortAddress: "",
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    if (stacksIsConnected()) {
      const stored = localStorage.getItem("stacks-wallet-address");
      if (stored) setAddress(stored);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const response = await stacksConnect({ network: "mainnet" });
      const stxEntry = response.addresses.find((a) => a.symbol === "STX");
      const addr = stxEntry?.address || response.addresses[0]?.address;
      if (addr) {
        setAddress(addr);
        localStorage.setItem("stacks-wallet-address", addr);
      }
    } catch (e) {
      console.error("Wallet connection failed:", e);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    stacksDisconnect();
    setAddress(null);
    localStorage.removeItem("stacks-wallet-address");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        shortAddress: address ? shortenAddress(address) : "",
        isConnected: !!address,
        connect,
        disconnect: disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
