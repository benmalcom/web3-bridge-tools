/**
 * Wallet Module for Bridge Test
 */

// Hook
export { useWallet } from './useWallet';
export type { UseWalletReturn } from './useWallet';


// Config
export {
    CHAIN_ID,
    CHAIN_NAME,
    defaultChain,
    supportedChains,
    getPrivyAppId,
    RPC_URL,
    BLOCK_EXPLORER,
    IS_TESTNET
} from './wallet.config';

// Registry
export { TOKENS, getTokenConfig, getTokenConfigByAddress } from './registry';
export type { TokenConfig } from './registry';

// Utils
export {
    shortenAddress,
    formatBalance,
    formatBalanceWithSymbol,
    isValidAddress,
} from './utils';

// Types
export type { WalletState } from './types';