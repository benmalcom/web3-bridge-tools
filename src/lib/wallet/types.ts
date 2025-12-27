/**
 * Wallet Types for Bridge Test
 */

import type { Address } from 'viem';

/**
 * Token configuration
 */
export interface TokenConfig {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    logo?: string;
}

/**
 * Wallet state for UI
 */
export interface WalletState {
    isConnected: boolean;
    address: Address | null;
    chainId: number;
}