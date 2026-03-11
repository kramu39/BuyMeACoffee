# BuyMeACoffee

BuyMeACoffee is an on-chain tipping platform for the Stacks ecosystem that helps creators, builders, and open-source contributors receive support instantly in STX. It combines a clean wallet-first web app with secure Clarity smart contracts so supporters can send tips in seconds, while both sides get transparent, verifiable transactions on-chain.

Built for real-world usage, the project includes a production-ready React + Vite dapp, contract tooling through Clarinet, and deployment/test workflows that make it easy to develop locally and ship confidently.

It is designed to make internet-native support simple: if someone creates value, anyone can send appreciation instantly with STX. Instead of relying on closed donation platforms, tips are executed on-chain with transparent transaction history and wallet-level confirmation.

## Why This Project Matters

BuyMeACoffee solves a practical gap for builders and creators in the Stacks ecosystem:

- Fast support: people can tip in seconds without learning complex DeFi flows
- Transparent by default: transfers are verifiable on-chain
- Wallet-first trust: users approve transactions from their own wallets
- Shareable growth loop: creators can distribute tip links across social channels

For creators, this means a lightweight funding stream.
For supporters, this means simple, direct, and auditable payments.

## What You Can Do With It

- Connect a Stacks wallet from the dapp
- Generate and share tip links
- Send STX tips with post-condition protection
- View transaction outcomes and inspect them in the explorer
- Run and iterate smart contracts locally before deployment

## How It Works (High Level)

1. A supporter opens the dapp and connects a wallet.
2. The app prepares a contract call with strict post-conditions.
3. The wallet displays what will be transferred before signing.
4. On confirmation, the transaction is broadcast to Stacks.
5. Results can be verified publicly in the explorer.

## Project Status

This repository currently contains multiple contract variants:

- `contracts/buy-me-coffee-token.clar`: token contract (wired in `Clarinet.toml` and deployment plans)
- `contracts/tip.clar`: direct STX tipping contract
- `contracts/buy-me-coffee.clar`: additional BuyMeCoffee contract variant

Important: the dapp is currently configured to call the `tip` contract on mainnet in `dapp/src/lib/stacks.ts`.

## Repository Structure

```text
BuyMeACoffee/
├── Clarinet.toml                    # Clarinet project + contract registration
├── contracts/
│   ├── buy-me-coffee-token.clar
│   ├── buy-me-coffee.clar
│   └── tip.clar
├── deployments/
│   ├── default.mainnet-plan.yaml
│   └── default.testnet-plan.yaml
├── dapp/                            # React/Vite frontend
├── settings/                        # Clarinet network settings
├── tests/                           # Clarinet/Vitest tests (if added)
├── package.json                     # root test tooling scripts
└── vitest.config.ts                 # root vitest config for Clarinet SDK
```

## Tech Stack

- Smart contracts: Clarity
- Contract tooling: Clarinet
- Frontend: React + TypeScript + Vite + Tailwind
- Wallet/connect: `@stacks/connect`
- Stacks tx helpers: `@stacks/transactions`
- Testing: Vitest + Clarinet SDK

## Prerequisites

- Node.js 18+
- pnpm or npm
- Clarinet CLI
- Optional: ngrok (for remote mobile wallet testing against local dapp)

## Quick Start

### 1. Install root dependencies (tests/tooling)

```bash
cd /workspaces/BuyMeACoffee
npm install
```

### 2. Install dapp dependencies

```bash
cd /workspaces/BuyMeACoffee/dapp
pnpm install
```

### 3. Start frontend

```bash
cd /workspaces/BuyMeACoffee/dapp
pnpm dev
```

Default local URL is usually `http://localhost:8080`.

### 4. Check contracts with Clarinet

```bash
cd /workspaces/BuyMeACoffee
clarinet check
```

## Frontend Commands

From `dapp/`:

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm test
```

## Root Test Commands

From repository root:

```bash
npm test
npm run test:report
npm run test:watch
```

## Smart Contract Notes

### `tip.clar`

- Public function: `tip(recipient, amount)`
- Transfers STX directly from sender to recipient
- Emits a `print` event with transfer metadata

### `buy-me-coffee-token.clar`

- SIP-010 fungible token implementation
- Registered in `Clarinet.toml`
- Referenced by current deployment plans

## Deployment

Deployment plans are in `deployments/`:

- `default.testnet-plan.yaml`
- `default.mainnet-plan.yaml`

Apply deployment (example):

```bash
cd /workspaces/BuyMeACoffee
clarinet deployment apply --testnet
```

Before deploying:

1. Confirm sender principals in deployment plan files
2. Confirm contract names used by frontend match deployed contracts
3. Confirm network (`testnet` vs `mainnet`) in frontend config

## Frontend Contract/Network Configuration

Current frontend constants live in `dapp/src/lib/stacks.ts`:

- `CONTRACT_ADDRESS`
- `CONTRACT_NAME`
- `NETWORK`

If you deploy under a different contract name or network, update these values accordingly.

## Post-Conditions (Security)

The tip flow uses STX post-conditions with deny mode:

- post-condition type: `stx-postcondition`
- condition: `eq`
- amount: exact uSTX being tipped
- mode: `deny`

This ensures wallet-signed transactions cannot move more STX than expected.

## Vercel + SPA Routing

The dapp includes `dapp/vercel.json` with a rewrite to `index.html` for client-side routing refresh/direct links.

## ngrok + Vite Host Allowlist

If using ngrok for wallet testing, the ngrok host must be allowed by Vite. Configure this in `dapp/vite.config.ts` under `server.allowedHosts`.

## Troubleshooting

### Vite: host blocked

Error:

`Blocked request. This host is not allowed.`

Fix: add the host to `server.allowedHosts` in `dapp/vite.config.ts` and restart `pnpm dev`.

### Stacks transaction: invalid postConditionMode

With `@stacks/connect` `request()`, use string mode values like `"deny"` rather than enum numeric values.

### APT install errors (e.g. unrelated repo GPG issues)

If apt is blocked by another broken source, install tools like ngrok via direct binary download instead of apt.

## Suggested Next Cleanup

To reduce confusion, standardize on one contract path for production:

1. Keep dapp + deployment plans + `Clarinet.toml` all pointing to the same contract
2. Rename/remove unused contract variants
3. Add integration tests that call the exact contract used by frontend
