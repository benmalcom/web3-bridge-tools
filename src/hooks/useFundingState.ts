/**
 * useFundingState - Detects wallet funding status
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, http, erc20Abi, formatUnits } from 'viem';
import { TARGET_CHAIN, TARGET_CHAIN_ID, TARGET_CHAIN_NAME } from '../config/chains';
import { USDC_ADDRESS, MIN_USDC_BALANCE, USDC_DECIMALS } from '../config/tokens';
import type { FundingState, FundingStatus } from '../types';

// Create client once
const publicClient = createPublicClient({
    chain: TARGET_CHAIN,
    transport: http(),
});

export function useFundingState(): FundingState {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();

    const [currentChainId, setCurrentChainId] = useState<number | null>(null);
    const [usdcBalance, setUsdcBalance] = useState<bigint>(0n);
    const [isLoading, setIsLoading] = useState(true);

    // Find EVM wallet
    const evmWallet = useMemo(
        () => wallets.find((w) => w.address?.startsWith('0x')),
        [wallets]
    );

    const address = evmWallet?.address || null;
    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : null;

    // Fetch USDC balance
    const fetchBalance = useCallback(async () => {
        if (!address) {
            setUsdcBalance(0n);
            return;
        }

        try {
            const balance = await publicClient.readContract({
                address: USDC_ADDRESS as `0x${string}`,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            });
            setUsdcBalance(balance);
        } catch (err) {
            console.error('[useFundingState] Failed to fetch balance:', err);
            setUsdcBalance(0n);
        }
    }, [address]);

    // Detect chain and listen for changes
    useEffect(() => {
        let cleanup: (() => void) | undefined;

        async function init() {
            setIsLoading(true);

            if (!evmWallet) {
                setCurrentChainId(null);
                setUsdcBalance(0n);
                setIsLoading(false);
                return;
            }

            try {
                const provider = await evmWallet.getEthereumProvider();
                const chainIdHex = await provider.request({ method: 'eth_chainId' });
                setCurrentChainId(parseInt(chainIdHex as string, 16));

                await fetchBalance();

                const handleChainChanged = async (newChainId: unknown) => {
                    if (typeof newChainId === 'string') {
                        setCurrentChainId(parseInt(newChainId, 16));
                        await fetchBalance();
                    }
                };

                provider.on('chainChanged', handleChainChanged as never);
                cleanup = () => provider.removeListener('chainChanged', handleChainChanged as never);
            } catch (err) {
                console.error('[useFundingState] Init failed:', err);
            } finally {
                setIsLoading(false);
            }
        }

        init();
        return () => cleanup?.();
    }, [evmWallet, fetchBalance]);

    // Switch to target chain
    const switchChain = useCallback(async () => {
        if (!evmWallet) return;
        try {
            await evmWallet.switchChain(TARGET_CHAIN_ID);
        } catch (err) {
            console.error('[useFundingState] Switch chain failed:', err);
        }
    }, [evmWallet]);

    // Derive status
    const isOnTargetChain = currentChainId === TARGET_CHAIN_ID;
    const hasSufficientBalance = usdcBalance >= MIN_USDC_BALANCE;

    let status: FundingStatus = 'loading';
    if (!ready || isLoading) {
        status = 'loading';
    } else if (!authenticated) {
        status = 'not_connected';
    } else if (!evmWallet) {
        status = 'no_evm_wallet';
    } else if (!isOnTargetChain) {
        status = 'wrong_chain';
    } else if (!hasSufficientBalance) {
        status = 'needs_funding';
    } else {
        status = 'ready';
    }

    return {
        status,
        isConnected: authenticated,
        hasEvmWallet: !!evmWallet,
        address,
        shortAddress,
        currentChainId,
        isOnTargetChain,
        targetChainId: TARGET_CHAIN_ID,
        targetChainName: TARGET_CHAIN_NAME,
        usdcBalance,
        usdcBalanceFormatted: formatUnits(usdcBalance, USDC_DECIMALS),
        minBalance: MIN_USDC_BALANCE,
        refetchBalance: fetchBalance,
        switchChain,
    };
}