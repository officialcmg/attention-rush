# AttentionRush ⚡

**Pay Farcaster creators with your attention - no wallet pop-ups!**

Built for Base Builder Quest 11: Onchain apps with no wallet pop-ups using Sub Accounts.

## 🎯 What is AttentionRush?

A Farcaster feed viewer that automatically tips creators based on your attention:

- **Viewport Payments**: Posts that are 100% visible in your viewport get tipped automatically (batched into groups of 10)
- **Engagement Payments**: Click on a post to view details → creator gets tipped every 4 seconds
- **Zero Friction**: Powered by Base Account Sub Accounts with Auto Spend Permissions = NO WALLET POP-UPS

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

**For Local Development:**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in:

```bash
# Get from https://neynar.com
VITE_NEYNAR_API_KEY=your_neynar_api_key

# Get from https://portal.cdp.coinbase.com/
VITE_PAYMASTER_URL=your_paymaster_url
```

**For Netlify Deployment:**

You do NOT need to create a `.env` file. Instead:
1. Go to your Netlify site dashboard
2. Navigate to **Site settings → Environment variables**
3. Add these variables:
   - `VITE_NEYNAR_API_KEY` = your Neynar API key
   - `VITE_PAYMASTER_URL` = your paymaster URL

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and connect your wallet!

## ⛓️ Chain Configuration

### Current Setup

AttentionRush is configured to use **Base Sepolia** testnet by default.

**Configuration file:** `src/constants.ts`

```typescript
import { baseSepolia } from 'viem/chains';

export const CHAIN = baseSepolia;
export const CHAIN_ID = baseSepolia.id;
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // Base Sepolia USDC
```

### How to Add a New Chain

1. **Import the chain from viem:**
```typescript
import { base, baseSepolia, optimism } from 'viem/chains';
```

2. **Update constants.ts:**
```typescript
// For Base Mainnet:
export const CHAIN = base;
export const CHAIN_ID = base.id;
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base Mainnet USDC

// For Optimism:
export const CHAIN = optimism;
export const CHAIN_ID = optimism.id;
export const USDC_ADDRESS = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'; // Optimism USDC
```

3. **Update Base Account SDK config in `src/hooks/useBaseAccount.ts`:**
```typescript
const sdk = createBaseAccountSDK({
  appName: 'AttentionRush',
  appLogoUrl: 'https://base.org/logo.png',
  appChainIds: [CHAIN_ID], // Will use your configured chain
  subAccounts: {
    creation: 'on-connect',
    defaultAccount: 'sub',
  }
});
```

### Chain Switching (Future Enhancement)

To add multi-chain support:

1. Create a chain selector UI component
2. Store selected chain in React state
3. Pass chain ID to Base Account SDK dynamically
4. Re-initialize provider when chain changes

```typescript
// Example multi-chain setup:
const chains = [base, baseSepolia, optimism];
const [selectedChain, setSelectedChain] = useState(baseSepolia);

const sdk = createBaseAccountSDK({
  appChainIds: [selectedChain.id],
  // ... other config
});
```

## 🏗️ Architecture

### Payment Structure

- **Viewport Tip**: `0.0001 USDC` (one-time when post is 100% visible)
- **Engagement Tip**: `0.0001 USDC` (every 4 seconds when viewing post details)

### Key Technologies

- **Base Account SDK**: Sub accounts + auto spend permissions
- **Viem**: Ethereum utilities & transaction encoding
- **Neynar API**: Farcaster feed data
- **Base Sepolia**: Testnet deployment
- **USDC**: Payment token

### Project Structure

```
src/
├── components/
│   ├── Header.tsx         # Wallet connection UI
│   ├── Feed.tsx           # Main feed container
│   ├── CastCard.tsx       # Individual cast with viewport tracking
│   └── CastModal.tsx      # Expanded view for engagement
├── hooks/
│   ├── useBaseAccount.ts        # Base Account SDK setup
│   ├── useFarcaster.ts          # Fetch Farcaster casts
│   ├── useViewportPayments.ts   # Batch viewport payments
│   └── useEngagementPayment.ts  # Per-2s engagement payments
├── utils/
│   └── payments.ts        # Payment encoding & sending
├── constants.ts           # Config & addresses
└── types.ts              # TypeScript interfaces
```

## 💰 How Payments Work

### Viewport Payments (Batched)

1. IntersectionObserver tracks when posts are 100% visible
2. Payments queue up (max 10 or 5-second timeout)
3. Batch sent via `wallet_sendCalls` with multiple USDC transfers
4. No wallet pop-up thanks to sub-account auto-spend

### Engagement Payments (Individual)

1. User clicks post → modal opens
2. Immediate payment on open
3. Recurring payment every 2 seconds via `setInterval`
4. Stops when modal closes

## 🔑 Key Features

- ✅ **No wallet pop-ups** - Sub accounts handle all transactions
- ✅ **Batched payments** - Efficient gas usage
- ✅ **Real-time tracking** - See pending tips in header
- ✅ **Farcaster integration** - Real creators, real content
- ✅ **Gas sponsorship** - Optional paymaster support

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_NEYNAR_API_KEY` | Neynar API key for Farcaster data | Yes |
| `VITE_PAYMASTER_URL` | Base Paymaster URL for gas sponsorship | No |

## 🎨 Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Lightning fast dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icons
- **Base Account SDK** - Sub accounts & spend permissions

## 📜 License

MIT

---

Built with ❤️ for Base Builder Quest 11
