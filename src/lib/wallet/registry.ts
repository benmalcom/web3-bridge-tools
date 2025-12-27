/**
 * Token Registry for Bridge Test
 * Supports both Base mainnet and Base Sepolia
 */

import type { Address } from 'viem';

/**
 * Token Configuration
 */
export interface TokenConfig {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    logo?: string;
}

/**
 * Base Mainnet token addresses
 */
export const MAINNET_TOKENS: Record<string, TokenConfig> = {
    USDC: {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logo: '/tokens/usdc.svg',
    },
    ETH: {
        address: '0x0000000000000000000000000000000000000000' as Address,
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logo: '/tokens/eth.svg',
    },
};

/**
 * Base Sepolia token addresses
 */
export const TESTNET_TOKENS: Record<string, TokenConfig> = {
    USDC: {
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logo: '/tokens/usdc.svg',
    },
    ETH: {
        address: '0x0000000000000000000000000000000000000000' as Address,
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logo: '/tokens/eth.svg',
    },
};

/**
 * Get tokens based on environment
 */
export function getTokens(isTestnet: boolean): Record<string, TokenConfig> {
    return isTestnet ? TESTNET_TOKENS : MAINNET_TOKENS;
}

/**
 * Default export - uses env var at runtime
 */
const USE_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';
export const TOKENS = USE_TESTNET ? TESTNET_TOKENS : MAINNET_TOKENS;

/**
 * Get token config by symbol
 */
export function getTokenConfig(symbol: string): TokenConfig | undefined {
    return TOKENS[symbol];
}

/**
 * Get token config by address
 */
export function getTokenConfigByAddress(
    address: Address
): TokenConfig | undefined {
    return Object.values(TOKENS).find(
        token => token.address.toLowerCase() === address.toLowerCase()
    );
}