import { baseSepolia } from 'viem/chains';

// Network Configuration
export const CHAIN = baseSepolia;
export const CHAIN_ID = baseSepolia.id;

// USDC Contract Address on Base Sepolia
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const;

// Tip Amounts (in USDC, 6 decimals)
export const VIEWPORT_TIP_AMOUNT = '0.0001'; // One-time tip when post is 100% visible
export const ENGAGEMENT_TIP_AMOUNT = '0.0001'; // Tip every 4 seconds when post is clicked

// Payment Settings
export const BATCH_SIZE = 10; // Number of tips to batch together
export const BATCH_TIMEOUT_MS = 2500; // Send batch after 5 seconds even if not full
export const ENGAGEMENT_TIP_INTERVAL_MS = 4000; // Pay every 4 seconds during engagement

// Neynar API
export const NEYNAR_API_BASE = 'https://api.neynar.com';

// ERC-20 Transfer ABI
export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: 'success', type: 'bool' }]
  }
] as const;
