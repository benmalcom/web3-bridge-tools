/**
 * RelayWidget - Relay Protocol SwapWidget with balance checks
 */

import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    HStack,
    Badge,
    Flex,
    Spinner,
    IconButton,
} from '@chakra-ui/react';
import type { Token } from '@relayprotocol/relay-kit-ui';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useBalance, useSwitchChain, useChains } from 'wagmi';
import { formatUnits } from 'viem';
import RelaySwapModal from './RelaySwapModal.tsx';

// Copy icon component
const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

// Check icon component
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// Environment config
const IS_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';
const TARGET_CHAIN_ID = IS_TESTNET ? 84532 : 8453;
const CHAIN_NAME = IS_TESTNET ? 'Base Sepolia' : 'Base';

// USDC contract address on target chain
const USDC_ADDRESS = IS_TESTNET
    ? '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    : '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

// Minimum thresholds
const MIN_USDC_TO_BET = 1; // $1 USDC

// Destination: USDC on Base (or Base Sepolia)
const DESTINATION_TOKEN: Token = {
    chainId: TARGET_CHAIN_ID,
    address: USDC_ADDRESS,
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
    logoURI: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
};

// Source: ETH on target chain (for swap) or other chain (for bridge)
const SOURCE_TOKEN_SWAP: Token = {
    chainId: TARGET_CHAIN_ID,
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI: 'https://assets.relay.link/icons/currencies/eth.png',
};

const SOURCE_TOKEN_BRIDGE: Token = IS_TESTNET
    ? {
        chainId: 11155111, // Sepolia
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
        logoURI: 'https://assets.relay.link/icons/currencies/eth.png',
    }
    : {
        chainId: 1, // Ethereum
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
        logoURI: 'https://assets.relay.link/icons/currencies/eth.png',
    };

interface RelayWidgetProps {
    onBack?: () => void;
}

export default function RelayWidget({ onBack }: RelayWidgetProps) {
    const { login, logout, authenticated, ready } = usePrivy();
    const { address, chainId, chain } = useAccount();
    const { switchChain } = useSwitchChain();
    const chains = useChains();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [fromToken, setFromToken] = useState<Token | undefined>(SOURCE_TOKEN_BRIDGE);
    const [toToken, setToToken] = useState<Token | undefined>(DESTINATION_TOKEN);

    // Copy address to clipboard
    const copyAddress = async () => {
        if (!address) return;
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Chain info - get name from wagmi chains
    const isOnTargetChain = chainId === TARGET_CHAIN_ID;
    const currentChainName = chain?.name || `Chain ${chainId}`;
    const targetChain = chains.find(c => c.id === TARGET_CHAIN_ID);
    const targetChainName = targetChain?.name || CHAIN_NAME;

    // Fetch ETH balance on TARGET chain (Base)
    const { data: targetEthBalance, isLoading: targetEthLoading } = useBalance({
        address,
        chainId: TARGET_CHAIN_ID,
    });

    // Fetch USDC balance on TARGET chain (Base)
    const { data: targetUsdcBalance, isLoading: targetUsdcLoading } = useBalance({
        address,
        token: USDC_ADDRESS as `0x${string}`,
        chainId: TARGET_CHAIN_ID,
    });

    // Fetch ETH balance on CURRENT chain (whatever user is connected to)
    const { data: currentChainEthBalance, isLoading: currentEthLoading } = useBalance({
        address,
        chainId: chainId,
    });

    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : '';

    // Format balances for display
    const targetEthAmount = targetEthBalance
        ? parseFloat(formatUnits(targetEthBalance.value, 18))
        : 0;
    const targetUsdcAmount = targetUsdcBalance
        ? parseFloat(formatUnits(targetUsdcBalance.value, 6))
        : 0;
    const currentChainEthAmount = currentChainEthBalance
        ? parseFloat(formatUnits(currentChainEthBalance.value, 18))
        : 0;

    // Is user ready to bet?
    const isReadyToBet = targetUsdcAmount >= MIN_USDC_TO_BET;

    // Update loading state
    useEffect(() => {
        if (!authenticated || !address) {
            setIsLoading(false);
            return;
        }
        setIsLoading(targetEthLoading || targetUsdcLoading || currentEthLoading);
    }, [authenticated, address, targetEthLoading, targetUsdcLoading, currentEthLoading]);

    // Set appropriate source token based on chain
    useEffect(() => {
        if (isOnTargetChain) {
            setFromToken(SOURCE_TOKEN_SWAP);
        } else {
            setFromToken(SOURCE_TOKEN_BRIDGE);
        }
    }, [isOnTargetChain]);

    // Handle switch to target chain
    const handleSwitchChain = () => {
        switchChain({ chainId: TARGET_CHAIN_ID });
    };

    // Render loading state
    if (!ready) {
        return (
            <Flex minH="200px" align="center" justify="center">
                <Spinner color="#FFEE00" size="lg" />
            </Flex>
        );
    }

    return (
        <VStack
            gap={4}
            align="stretch"
            w="full"
            maxW="460px"
            mx="auto"
            p={4}
            className="dark"
        >
            {/* Header */}
            <Box textAlign="center">
                <HStack justify="center" gap={2} mb={2}>
                    {onBack && (
                        <Button
                            onClick={onBack}
                            variant="ghost"
                            size="sm"
                            color="#788690"
                            _hover={{ color: 'white' }}
                        >
                            ← Back
                        </Button>
                    )}
                    <Heading size="lg" color="white">
                        ⚡ Relay Bridge
                    </Heading>
                </HStack>
                <Text color="#788690" fontSize="sm">
                    Get USDC on {targetChainName} to place bets
                </Text>
                <HStack justify="center" mt={2} gap={2}>
                    {IS_TESTNET && (
                        <Badge colorScheme="orange" fontSize="xs">
                            TESTNET
                        </Badge>
                    )}
                    <Badge colorScheme="yellow" fontSize="xs">
                        Powered by Relay
                    </Badge>
                </HStack>
            </Box>

            {/* Main Card */}
            <Box
                bg="#101518"
                borderRadius="16px"
                border="1px solid rgba(255, 255, 255, 0.1)"
                overflow="hidden"
                p={6}
            >
                {!authenticated ? (
                    // Not connected
                    <VStack gap={4}>
                        <Text color="#788690" textAlign="center">
                            Connect your wallet to get started
                        </Text>
                        <Button
                            onClick={login}
                            bg="#FFEE00"
                            color="black"
                            size="lg"
                            w="full"
                            _hover={{ opacity: 0.9 }}
                        >
                            Connect Wallet
                        </Button>
                    </VStack>
                ) : isLoading ? (
                    // Loading balances
                    <VStack gap={4} py={4}>
                        <Spinner color="#FFEE00" size="lg" />
                        <Text color="#788690" fontSize="sm">
                            Checking balances...
                        </Text>
                    </VStack>
                ) : (
                    // Connected - show balances and actions
                    <VStack gap={4}>
                        {/* Status Badge */}
                        {isReadyToBet ? (
                            <Box textAlign="center">
                                <HStack justify="center" gap={2}>
                                    <Text color="#22C55E" fontSize="lg">✓</Text>
                                    <Text color="#22C55E" fontSize="md" fontWeight="600">
                                        Ready to bet!
                                    </Text>
                                </HStack>
                            </Box>
                        ) : (
                            <Box textAlign="center">
                                <Text color="#F97316" fontSize="md" fontWeight="600">
                                    Get USDC to start betting
                                </Text>
                            </Box>
                        )}

                        {/* Balance Display - Target Chain (Base) */}
                        <Box bg="#1A1D21" borderRadius="12px" p={4} w="full">
                            <Text color="#FFEE00" fontSize="xs" fontWeight="600" mb={2}>
                                {targetChainName} (Betting Chain)
                            </Text>
                            <HStack justify="space-between" mb={1}>
                                <Text color="#788690" fontSize="sm">
                                    USDC
                                </Text>
                                <Text
                                    color={isReadyToBet ? '#22C55E' : 'white'}
                                    fontSize="sm"
                                    fontWeight="600"
                                >
                                    {targetUsdcAmount.toFixed(2)} USDC
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text color="#788690" fontSize="sm">
                                    ETH
                                </Text>
                                <Text color="white" fontSize="sm" fontWeight="600">
                                    {targetEthAmount.toFixed(4)} ETH
                                </Text>
                            </HStack>
                        </Box>

                        {/* Balance Display - Current Chain (if different) */}
                        {!isOnTargetChain && (
                            <Box bg="#1A1D21" borderRadius="12px" p={4} w="full" opacity={0.8}>
                                <HStack justify="space-between" mb={2}>
                                    <Text color="#788690" fontSize="xs" fontWeight="600">
                                        {currentChainName} (Current Chain)
                                    </Text>
                                    <HStack gap={1}>
                                        <Text color="#788690" fontSize="xs" fontFamily="mono">
                                            {shortAddress}
                                        </Text>
                                        <IconButton
                                            aria-label="Copy address"
                                            size="xs"
                                            variant="ghost"
                                            color={copied ? '#22C55E' : '#788690'}
                                            _hover={{ color: 'white' }}
                                            onClick={copyAddress}
                                            minW="auto"
                                            h="auto"
                                            p={1}
                                        >
                                            {copied ? <CheckIcon /> : <CopyIcon />}
                                        </IconButton>
                                    </HStack>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text color="#788690" fontSize="sm">
                                        ETH
                                    </Text>
                                    <Text color="white" fontSize="sm" fontWeight="600">
                                        {currentChainEthAmount.toFixed(4)} ETH
                                    </Text>
                                </HStack>
                                {currentChainEthAmount > 0 && (
                                    <Text color="#3B82F6" fontSize="xs" mt={2}>
                                        ↑ Bridge this to {targetChainName}
                                    </Text>
                                )}
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <VStack gap={2} w="full" pt={2}>
                            {/* Switch Chain Button - show when not on target chain */}
                            {!isOnTargetChain && (
                                <Button
                                    onClick={handleSwitchChain}
                                    variant="outline"
                                    borderColor="#3B82F6"
                                    color="#3B82F6"
                                    size="lg"
                                    w="full"
                                    _hover={{ bg: '#3B82F6', color: 'white' }}
                                >
                                    Switch to {targetChainName}
                                </Button>
                            )}

                            {/* Swap Button - show on target chain only when ETH > 0 */}
                            {isOnTargetChain && targetEthAmount > 0 && (
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    bg="#FFEE00"
                                    color="black"
                                    size="lg"
                                    w="full"
                                    _hover={{ opacity: 0.9 }}
                                >
                                    Swap to USDC
                                </Button>
                            )}

                            {/* Bridge Button - show when not on target chain */}
                            {!isOnTargetChain && (
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    bg="#FFEE00"
                                    color="black"
                                    size="lg"
                                    w="full"
                                    _hover={{ opacity: 0.9 }}
                                >
                                    Bridge & Swap to USDC
                                </Button>
                            )}

                            {/* No funds message - show on target chain with no ETH */}
                            {isOnTargetChain && targetEthAmount === 0 && (
                                <Box bg="#1A1D21" borderRadius="12px" p={4} w="full">
                                    <Text color="#F97316" fontSize="sm" fontWeight="600" mb={2}>
                                        No ETH to swap
                                    </Text>
                                    <Text color="#788690" fontSize="xs" mb={3}>
                                        Send ETH or USDC to your wallet from an exchange (Coinbase, Binance, etc.) or another wallet.
                                    </Text>
                                    <Box bg="#101518" borderRadius="8px" p={3}>
                                        <Text color="#788690" fontSize="xs" mb={1}>
                                            Your {targetChainName} address:
                                        </Text>
                                        <HStack justify="space-between">
                                            <Text color="white" fontSize="xs" fontFamily="mono" wordBreak="break-all">
                                                {address}
                                            </Text>
                                            <IconButton
                                                aria-label="Copy address"
                                                size="xs"
                                                variant="ghost"
                                                color={copied ? '#22C55E' : '#788690'}
                                                _hover={{ color: 'white' }}
                                                onClick={copyAddress}
                                                minW="auto"
                                                h="auto"
                                                p={1}
                                                flexShrink={0}
                                            >
                                                {copied ? <CheckIcon /> : <CopyIcon />}
                                            </IconButton>
                                        </HStack>
                                    </Box>
                                </Box>
                            )}
                        </VStack>

                        {/* Footer info */}
                        <HStack justify="space-between" w="full" pt={2}>
                            <Text color="#788690" fontSize="xs">
                                {shortAddress} • {currentChainName}
                            </Text>
                            <Button
                                onClick={logout}
                                variant="ghost"
                                size="xs"
                                color="#788690"
                                _hover={{ color: '#EF4444' }}
                            >
                                Disconnect
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </Box>

            {/* Swap/Bridge Modal */}
            <RelaySwapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fromToken={fromToken}
                setFromToken={setFromToken}
                toToken={toToken}
                setToToken={setToToken}
                isOnTargetChain={isOnTargetChain}
            />

            {/* Footer */}
            <Text color="#788690" fontSize="xs" textAlign="center">
                {IS_TESTNET
                    ? '⚠️ Testnet mode - Swaps may fail due to low liquidity'
                    : 'Powered by Relay Protocol'}
            </Text>
        </VStack>
    );
}