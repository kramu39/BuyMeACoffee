import { request } from "@stacks/connect";
import {
  uintCV,
  principalCV,
  PostConditionMode,
  Pc,
  Cl,
} from "@stacks/transactions";

export const CONTRACT_ADDRESS = "SP29VJHHXFPRQMW6W1VDE9NVR4AZ04V44H3T1X01Y";
export const CONTRACT_NAME = "tip";
export const NETWORK = "mainnet";
export const EXPLORER_URL = "https://explorer.hiro.so";
export const HIRO_API = "https://api.hiro.so";

export const STX_TO_USTX = 1_000_000;
export const MIN_TIP_STX = 0.000001;

export function stxToMicroStx(stx: number): number {
  return Math.floor(stx * STX_TO_USTX);
}

export function microStxToStx(ustx: number): number {
  return ustx / STX_TO_USTX;
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export function isValidStacksAddress(address: string): boolean {
  return /^S[PM][A-Z0-9]{38,}$/.test(address);
}

export function getTxExplorerUrl(txId: string): string {
  return `${EXPLORER_URL}/txid/${txId}?chain=mainnet`;
}

export async function sendTip(
  senderAddress: string,
  recipientAddress: string,
  amountStx: number,
  onFinish: (txId: string) => void,
  onCancel: () => void
) {
  const amountUstx = stxToMicroStx(amountStx);

  const postConditions = [
    Pc.principal(senderAddress).willSendEq(amountUstx).ustx(),
  ];

  try {
    const response = await (request as any)("stx_callContract", {
      contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
      functionName: "tip",
      functionArgs: [principalCV(recipientAddress), uintCV(amountUstx)],
      postConditionMode: PostConditionMode.Deny,
      postConditions,
      network: NETWORK,
    });
    if (response && response.txid) {
      onFinish(response.txid);
    }
  } catch (e: any) {
    if (e?.message?.includes("cancel") || e?.code === 4001) {
      onCancel();
    } else {
      throw e;
    }
  }
}

export interface StacksTransaction {
  tx_id: string;
  sender_address: string;
  tx_type: string;
  tx_status: string;
  block_height: number;
  burn_block_time_iso: string;
  fee_rate: string;
  contract_call?: {
    contract_id: string;
    function_name: string;
    function_args: Array<{ repr: string; name: string; type: string }>;
  };
  stx_transfers?: Array<{
    amount: string;
    sender: string;
    recipient: string;
  }>;
}

export async function fetchTransactions(
  address: string,
  limit = 50
): Promise<StacksTransaction[]> {
  const res = await fetch(
    `${HIRO_API}/extended/v1/address/${address}/transactions?limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch transactions");
  const data = await res.json();
  return data.results || [];
}
