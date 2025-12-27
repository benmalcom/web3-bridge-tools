/**
 * Simple useWallet hook for Bridge Test
 * Uses Privy hooks directly without full WalletProvider
 */

import { useMemo, useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import type { Address } from 'viem';
import { CHAIN_ID } from './wallet.config';
import { shortenAddress } from './utils';

// Known chain names
const CHAIN_NAMES: Record<number, string> = {
    // Mainnets
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
    97: 'BNB Testnet',
    5003: 'Mantle Sepolia',
};

export interface UseWalletReturn {
    // State
    isConnected: boolean;
    isReady: boolean;
    address: Address | null;
    shortAddress: string;

    // Chain info (actual chain user is on)
    currentChainId: number | null;
    currentChainName: string | null;

    // Target chain (where we want them to bridge to)
    targetChainId: number;
    targetChainName: string;
    isOnTargetChain: boolean;

    // Wallet info
    walletType: 'embedded' | 'external' | null;

    // Actions
    connect: () => void;
    disconnect: () => Promise<void>;
    switchToTargetChain: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
    const { ready, authenticated, login, logout } = usePrivy();
    const { wallets } = useWallets();
    const [currentChainId, setCurrentChainId] = useState<number | null>(null);

    // Get active wallet (prefer external, fallback to embedded)
    const activeWallet = useMemo(() => {
        if (wallets.length === 0) return null;

        // Prefer external wallet (MetaMask, etc.)
        const external = wallets.find(w => w.walletClientType !== 'privy');
        if (external) return external;

        // Fallback to embedded
        return wallets.find(w => w.walletClientType === 'privy') || null;
    }, [wallets]);

    // Fix: Cast the handler or use proper typing
    useEffect(() => {
        async function detectChain() {
            if (!activeWallet) {
                setCurrentChainId(null);
                return;
            }

            try {
                const provider = await activeWallet.getEthereumProvider();
                const chainIdHex = await provider.request({ method: 'eth_chainId' });
                setCurrentChainId(parseInt(chainIdHex as string, 16));

                // Listen for chain changes - use type assertion for EIP-1193 event
                const handleChainChanged = (newChainId: unknown) => {
                    if (typeof newChainId === 'string') {
                        setCurrentChainId(parseInt(newChainId, 16));
                    }
                };

                provider.on('chainChanged', handleChainChanged as Parameters<typeof provider.on>[1]);

                return () => {
                    provider.removeListener('chainChanged', handleChainChanged as Parameters<typeof provider.removeListener>[1]);
                };
            } catch (e) {
                console.error('Failed to detect chain:', e);
            }
        }

        detectChain();
    }, [activeWallet]);

    const address = (activeWallet?.address as Address) || null;
    const isConnected = authenticated && !!activeWallet && ready;

    const walletType = useMemo(() => {
        if (!activeWallet) return null;
        return activeWallet.walletClientType === 'privy' ? 'embedded' : 'external';
    }, [activeWallet]);

    const currentChainName = currentChainId
        ? (CHAIN_NAMES[currentChainId] || `Chain ${currentChainId}`)
        : null;

    const targetChainName = CHAIN_NAMES[CHAIN_ID] || `Chain ${CHAIN_ID}`;

    // Switch wallet to target chain
    const switchToTargetChain = async () => {
        if (!activeWallet) return;

        try {
            await activeWallet.switchChain(CHAIN_ID);
        } catch (e) {
            console.error('Failed to switch chain:', e);
        }
    };

    return {
        isConnected,
        isReady: ready,
        address,
        shortAddress: address ? shortenAddress(address) : '',
        currentChainId,
        currentChainName,
        targetChainId: CHAIN_ID,
        targetChainName,
        isOnTargetChain: currentChainId === CHAIN_ID,
        walletType,
        connect: login,
        disconnect: logout,
        switchToTargetChain,
    };
}