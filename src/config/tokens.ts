/**
 * Token Configuration
 */

import { IS_TESTNET, TARGET_CHAIN_ID, SOURCE_CHAIN_ID } from './chains';

// USDC addresses
export const USDC_ADDRESS = IS_TESTNET
    ? '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // Base Sepolia
    : '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'; // Base Mainnet

// ETH (native token)
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

// Minimum USDC balance to bet ($1 = 1_000_000 with 6 decimals)
export const MIN_USDC_BALANCE = 1_000_000n;
export const USDC_DECIMALS = 6;

// Token configs for Relay
export const DESTINATION_TOKEN = {
    chainId: TARGET_CHAIN_ID,
    address: USDC_ADDRESS,
    decimals: USDC_DECIMALS,
    name: 'USDC',
    symbol: 'USDC',
    logoURI: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
};

export const SOURCE_TOKEN_ETH = {
    chainId: SOURCE_CHAIN_ID,
    address: ETH_ADDRESS,
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI: 'https://assets.relay.link/icons/currencies/eth.png',
};

export const TARGET_TOKEN_ETH = {
    chainId: TARGET_CHAIN_ID,
    address: ETH_ADDRESS,
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI: 'https://assets.relay.link/icons/currencies/eth.png',
};