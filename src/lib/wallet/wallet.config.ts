/**
 * Wallet Configuration for Bridge Test
 * Uses Base mainnet by default, testnet optional
 */

import { base, baseSepolia } from 'viem/chains';

/**
 * Environment mode
 * Set USE_TESTNET=true in .env to use testnet
 */
const USE_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';

/**
 * Chain Configuration
 */
export const defaultChain = USE_TESTNET ? baseSepolia : base;
export const CHAIN_ID = defaultChain.id; // 8453 (mainnet) or 84532 (testnet)
export const CHAIN_NAME = defaultChain.name;
export const IS_TESTNET = USE_TESTNET;

/**
 * RPC endpoints
 */
export const RPC_URL = USE_TESTNET
    ? 'https://sepolia.base.org'
    : 'https://mainnet.base.org';

/**
 * Block explorer
 */
export const BLOCK_EXPLORER = USE_TESTNET
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';

/**
 * Supported chains for bridging
 */
export const supportedChains = [defaultChain];

/**
 * Get Privy App ID from environment
 */
export function getPrivyAppId(): string {
    const appId = import.meta.env.VITE_PRIVY_APP_ID;

    if (!appId) {
        throw new Error('VITE_PRIVY_APP_ID is not set in environment variables');
    }

    return appId;
}