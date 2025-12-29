/**
 * Funding Flow Types
 */

export type FundingStatus =
    | 'loading'
    | 'not_connected'
    | 'no_evm_wallet'
    | 'wrong_chain'
    | 'needs_funding'
    | 'ready';

export type BridgeProvider = 'relay' | 'lifi';

export interface FundingState {
    status: FundingStatus;

    // Wallet
    isConnected: boolean;
    hasEvmWallet: boolean;
    address: string | null;
    shortAddress: string | null;

    // Chain
    currentChainId: number | null;
    isOnTargetChain: boolean;
    targetChainId: number;
    targetChainName: string;

    // Balance
    usdcBalance: bigint;
    usdcBalanceFormatted: string;
    minBalance: bigint;

    // Actions
    refetchBalance: () => Promise<void>;
    switchChain: () => Promise<void>;
}

export interface ProviderConfig {
    id: BridgeProvider;
    name: string;
    emoji: string;
    description: string;
    features: string[];
    color: string;
}