/**
 * Relay Protocol Integration
 *
 * Provides cross-chain bridging and same-chain swapping via Relay Protocol.
 * Replaces Socket.tech for JustFlip wallet funding.
 *
 * @example
 * ```tsx
 * import { useRelay, TARGET_CHAIN_ID, NATIVE_ETH_ADDRESS } from '@/lib/relay';
 *
 * function BridgeComponent() {
 *   const relay = useRelay(walletAddress);
 *
 *   // Same-chain swap: ETH → USDC on Base
 *   const handleSwap = async () => {
 *     const quote = await relay.getSwapQuote('1000000000000000000'); // 1 ETH
 *     if (quote) {
 *       await relay.executeQuote();
 *     }
 *   };
 *
 *   // Cross-chain bridge: ETH on Ethereum → USDC on Base
 *   const handleBridge = async () => {
 *     const quote = await relay.getBridgeQuote(
 *       1, // Ethereum
 *       NATIVE_ETH_ADDRESS,
 *       '1000000000000000000' // 1 ETH
 *     );
 *     if (quote) {
 *       await relay.executeQuote();
 *     }
 *   };
 * }
 * ```
 */

// Config
export {
    RELAY_API_URL,
    RELAY_ENDPOINTS,
    CHAIN_IDS,
    TARGET_CHAIN_ID,
    NATIVE_ETH_ADDRESS,
    USDC_ADDRESSES,
    getUsdcAddress,
    getTargetUsdcAddress,
    getSupportedSourceChains,
    RELAY_SOLVER_ADDRESS,
} from './relay.config';

