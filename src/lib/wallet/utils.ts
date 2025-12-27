/**
 * Wallet Utilities for Bridge Test
 */

import type { Address } from 'viem';
import { formatUnits } from 'viem';

/**
 * Shorten address for display
 * @example "0x1234...5678"
 */
export function shortenAddress(
    address: Address,
    startChars = 6,
    endChars = 4
): string {
    if (address.length <= startChars + endChars) {
        return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format token balance for display
 * @example formatBalance(1000000n, 6) => "1.00"
 */
export function formatBalance(balance: bigint, decimals: number): string {
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);

    if (num === 0) return '0.00';
    if (num < 0.01) return '<0.01';
    if (num < 1) return num.toFixed(4);
    if (num < 1000) return num.toFixed(2);

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format token balance with symbol
 * @example "1,234.56 USDC"
 */
export function formatBalanceWithSymbol(
    balance: bigint,
    decimals: number,
    symbol: string
): string {
    return `${formatBalance(balance, decimals)} ${symbol}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): address is Address {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}