/**
 * Chain Configuration
 */

import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';

// Environment
export const IS_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';

// Target chain (where user needs to be)
export const TARGET_CHAIN = IS_TESTNET ? baseSepolia : base;
export const TARGET_CHAIN_ID = TARGET_CHAIN.id;
export const TARGET_CHAIN_NAME = IS_TESTNET ? 'Base Sepolia' : 'Base';

// Source chains (for bridging)
export const SOURCE_CHAIN = IS_TESTNET ? sepolia : mainnet;
export const SOURCE_CHAIN_ID = SOURCE_CHAIN.id;

// All supported chains
export const SUPPORTED_CHAINS = IS_TESTNET
    ? [baseSepolia, sepolia]
    : [base, mainnet];