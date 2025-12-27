/**
 * Relay Protocol Configuration
 * API endpoints, chain configs, and constants
 */

// API Endpoints
export const RELAY_API_BASE = 'https://api.relay.link';
export const RELAY_TESTNET_API_BASE = 'https://api.testnets.relay.link';

// Use testnet API based on environment
const USE_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';
export const RELAY_API_URL = USE_TESTNET ? RELAY_TESTNET_API_BASE : RELAY_API_BASE;

// Relay API Endpoints
export const RELAY_ENDPOINTS = {
    quote: `${RELAY_API_URL}/quote/v2`,
    status: `${RELAY_API_URL}/intents/status/v3`,
    chains: `${RELAY_API_URL}/chains`,
} as const;

// Chain IDs
export const CHAIN_IDS = {
    ethereum: 1,
    base: 8453,
    baseSepolia: 84532,
    arbitrum: 42161,
    optimism: 10,
    polygon: 137,
    sepolia: 11155111,
    avalancheFuji: 43113,
    avalanche: 43114,
} as const;

// Chain name lookup
export const CHAIN_NAMES: Record<number, string> = {
    1: 'Ethereum',
    10: 'Optimism',
    137: 'Polygon',
    8453: 'Base',
    42161: 'Arbitrum',
    43114: 'Avalanche',
    56: 'BNB Chain',
    324: 'zkSync Era',
    59144: 'Linea',
    534352: 'Scroll',
    81457: 'Blast',
    7777777: 'Zora',
    // Testnets
    11155111: 'Sepolia',
    84532: 'Base Sepolia',
    421614: 'Arbitrum Sepolia',
    11155420: 'Optimism Sepolia',
    43113: 'Avalanche Fuji',
    80002: 'Polygon Amoy',
};

export function getChainName(chainId: number): string {
    return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

// Target chain for JustFlip (Base)
export const TARGET_CHAIN_ID = USE_TESTNET ? CHAIN_IDS.baseSepolia : CHAIN_IDS.base;

// Native ETH address (zero address)
export const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

// USDC Addresses by chain
export const USDC_ADDRESSES: Record<number, string> = {
    // Mainnet
    [CHAIN_IDS.ethereum]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    [CHAIN_IDS.base]: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    [CHAIN_IDS.arbitrum]: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    [CHAIN_IDS.optimism]: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    [CHAIN_IDS.polygon]: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    // Testnet
    [CHAIN_IDS.baseSepolia]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    [CHAIN_IDS.sepolia]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
};

// Get USDC address for a chain
export function getUsdcAddress(chainId: number): string | undefined {
    return USDC_ADDRESSES[chainId];
}

// Get target USDC address (Base USDC)
export function getTargetUsdcAddress(): string {
    return USDC_ADDRESSES[TARGET_CHAIN_ID]!;
}

// Relay Solver Address (same across all EVM chains)
export const RELAY_SOLVER_ADDRESS = '0xf70da97812cb96acdf810712aa562db8dfa3dbef';

// Popular source chains for bridging
export const SUPPORTED_SOURCE_CHAINS = [
    { id: CHAIN_IDS.ethereum, name: 'Ethereum', symbol: 'ETH' },
    { id: CHAIN_IDS.arbitrum, name: 'Arbitrum', symbol: 'ETH' },
    { id: CHAIN_IDS.optimism, name: 'Optimism', symbol: 'ETH' },
    { id: CHAIN_IDS.polygon, name: 'Polygon', symbol: 'MATIC' },
    { id: CHAIN_IDS.base, name: 'Base', symbol: 'ETH' },
] as const;

// Testnet source chains (Relay supports these)
export const SUPPORTED_TESTNET_CHAINS = [
    { id: CHAIN_IDS.sepolia, name: 'Sepolia', symbol: 'ETH' },
    { id: CHAIN_IDS.baseSepolia, name: 'Base Sepolia', symbol: 'ETH' },
] as const;

// Dynamic chain - includes user's current chain if not in the list
export function getSupportedSourceChains(currentChainId?: number) {
    const baseChains = USE_TESTNET ? SUPPORTED_TESTNET_CHAINS : SUPPORTED_SOURCE_CHAINS;

    // If user is on a chain not in our list, we can still try to bridge from it
    // Relay supports many more chains than we list
    if (currentChainId && !baseChains.some(c => c.id === currentChainId)) {
        // Don't add if it's the target chain
        if (currentChainId !== TARGET_CHAIN_ID) {
            return [
                { id: currentChainId, name: getChainName(currentChainId), symbol: 'ETH' },
                ...baseChains,
            ];
        }
    }

    return baseChains;
}