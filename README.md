# JustFlip Bridge Test - Relay Protocol Integration

A standalone test app for cross-chain wallet funding using **Relay Protocol** and **Privy** authentication.

## Features

- **Wallet Connection**: Privy-powered auth (email, wallet, social)
- **Balance Detection**: Automatic detection of ETH and USDC on Base
- **Funding State**: Smart detection of user's funding needs
    - ✅ **Ready**: Has USDC on Base → can bet
    - 🔄 **Needs Swap**: Has ETH on Base → swap to USDC
    - 🌉 **Needs Bridge**: Funds on other chains → bridge to Base USDC
- **Relay Integration**: Seamless bridging and swapping via Relay Protocol

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      User Connects Wallet                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Check Balances on Base                     │
└─────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ Has USDC    │    │ Has ETH     │    │ No Funds    │
    │ on Base     │    │ on Base     │    │ on Base     │
    └─────────────┘    └─────────────┘    └─────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ Ready to    │    │ Swap ETH    │    │ Bridge from │
    │ Bet! ✅     │    │ → USDC      │    │ Other Chain │
    └─────────────┘    └─────────────┘    └─────────────┘
                              │                  │
                              └────────┬─────────┘
                                       ▼
                         ┌─────────────────────────┐
                         │    Relay Protocol       │
                         │  (Quote → Execute →     │
                         │   Poll → Complete)      │
                         └─────────────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │   User has USDC on      │
                         │   Base → Ready to Bet!  │
                         └─────────────────────────┘
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Privy App ID:
   ```
   VITE_PRIVY_APP_ID=your-privy-app-id
   VITE_USE_TESTNET=false  # Set to 'true' for Base Sepolia
   ```

3. **Run development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## Architecture

```
src/
├── lib/
│   ├── relay/              # Relay Protocol integration
│   │   ├── relay.config.ts    # API endpoints, chain configs
│   │   ├── relay.types.ts     # TypeScript types
│   │   ├── relay.api.ts       # API client (quote, status)
│   │   ├── wallet-detection.ts # EOA vs Smart Wallet detection
│   │   ├── useRelay.ts        # Main React hook
│   │   └── index.ts           # Barrel export
│   │
│   └── wallet/             # Wallet utilities
│       ├── wallet.config.ts   # Chain config
│       ├── registry.ts        # Token addresses
│       ├── useWallet.ts       # Privy wallet hook
│       ├── useBalances.ts     # Balance fetching
│       └── index.ts           # Barrel export
│
├── components/
│   └── RelayBridgeTest.tsx    # Main UI component
│
├── App.tsx                    # App wrapper
├── main.tsx                   # Entry point
└── theme.ts                   # Chakra UI theme
```

## Relay API Flow

### 1. Get Quote
```typescript
const quote = await getRelayQuote({
  user: walletAddress,
  originChainId: 1,        // Ethereum
  destinationChainId: 8453, // Base
  originCurrency: '0x0...', // ETH
  destinationCurrency: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC
  amount: '1000000000000000000', // 1 ETH in wei
  tradeType: 'EXACT_INPUT',
});
```

### 2. Execute Steps
```typescript
// Execute each step (deposit transaction, signatures)
for (const step of quote.steps) {
  if (step.kind === 'transaction') {
    const txHash = await wallet.sendTransaction(step.items[0].data);
  }
}
```

### 3. Poll Status
```typescript
const status = await pollRelayStatus(requestId, {
  onStatusChange: (s) => console.log('Status:', s.status),
});
// status.status: 'waiting' → 'pending' → 'success'
```

## Key Features

### Wallet Type Detection
Automatically detects EOA vs Smart Wallet to choose optimal transaction flow:
- **EOA**: Uses implicit deposits (1 transaction)
- **Smart Wallet**: Uses explicit deposits (2 transactions, can be batched)

### Error Handling
Comprehensive error handling for common Relay API errors:
- `AMOUNT_TOO_LOW`
- `INSUFFICIENT_LIQUIDITY`
- `NO_SWAP_ROUTES_FOUND`
- `UNSUPPORTED_ROUTE`

### Testnet Support
Set `VITE_USE_TESTNET=true` to use:
- Base Sepolia (chain 84532)
- Sepolia (chain 11155111)
- Relay Testnet API (`api.testnets.relay.link`)

## Integrating into JustFlip

Once tested, the Relay integration can be moved to the main monorepo:

1. Copy `src/lib/relay/` → `packages/api/src/relay/` or create new `@flip/relay` package
2. Update imports in frontend app
3. Add Relay to the wallet funding flow in `apps/frontend`

## Resources

- [Relay Protocol Docs](https://docs.relay.link)
- [Privy Docs](https://docs.privy.io)
- [Viem Docs](https://viem.sh)