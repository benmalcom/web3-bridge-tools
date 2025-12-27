/**
 * LiFiWidget - LI.FI Widget for cross-chain bridging and swapping
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
import { LiFiWidget, type WidgetConfig } from '@lifi/widget';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useBalance, useSwitchChain, useChains } from 'wagmi';
import { formatUnits } from 'viem';
import { lifiTheme } from '../theme/lifiTheme';

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

// USDC contract address on target chain
const USDC_ADDRESS = IS_TESTNET
    ? '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    : '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

// Minimum thresholds
const MIN_USDC_TO_BET = 1;

// LI.FI Widget configuration
const getWidgetConfig = (targetChainId: number, usdcAddress: string): WidgetConfig => ({
    integrator: 'JustFlip',
    variant: 'compact',
    subvariant: 'default',
    appearance: 'dark',
    theme: lifiTheme,
    // Lock destination to USDC on Base
    toChain: targetChainId,
    toToken: usdcAddress,
    // Chains config
    chains: {
        allow: IS_TESTNET
            ? [11155111, 84532] // Sepolia, Base Sepolia
            : [1, 8453, 42161, 10, 137], // Ethereum, Base, Arbitrum, Optimism, Polygon
    },
    // Hide wallet management (we use Privy)
    walletConfig: {
        usePartialWalletManagement: true,
    },
    hiddenUI: ['appearance', 'language', 'poweredBy'],
});

interface LiFiWidgetProps {
    onBack?: () => void;
}

export default function LiFiWidgetComponent({ onBack }: LiFiWidgetProps) {
    const { login, logout, authenticated, ready } = usePrivy();
    const { address, chainId, chain } = useAccount();
    const { switchChain } = useSwitchChain();
    const chains = useChains();

    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Chain info
    const isOnTargetChain = chainId === TARGET_CHAIN_ID;
    const currentChainName = chain?.name || `Chain ${chainId}`;
    const targetChain = chains.find((c) => c.id === TARGET_CHAIN_ID);
    const targetChainName = targetChain?.name || (IS_TESTNET ? 'Base Sepolia' : 'Base');

    // Fetch ETH balance on TARGET chain
    const { data: targetEthBalance, isLoading: targetEthLoading } = useBalance({
        address,
        chainId: TARGET_CHAIN_ID,
    });

    // Fetch USDC balance on TARGET chain
    const { data: targetUsdcBalance, isLoading: targetUsdcLoading } = useBalance({
        address,
        token: USDC_ADDRESS as `0x${string}`,
        chainId: TARGET_CHAIN_ID,
    });

    // Fetch ETH balance on CURRENT chain
    const { data: currentChainEthBalance, isLoading: currentEthLoading } = useBalance({
        address,
        chainId: chainId,
    });

    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : '';

    // Format balances
    const targetEthAmount = targetEthBalance
        ? parseFloat(formatUnits(targetEthBalance.value, 18))
        : 0;
    const targetUsdcAmount = targetUsdcBalance
        ? parseFloat(formatUnits(targetUsdcBalance.value, 6))
        : 0;
    const currentChainEthAmount = currentChainEthBalance
        ? parseFloat(formatUnits(currentChainEthBalance.value, 18))
        : 0;

    const isReadyToBet = targetUsdcAmount >= MIN_USDC_TO_BET;

    // Copy address
    const copyAddress = async () => {
        if (!address) return;
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Update loading state
    useEffect(() => {
        if (!authenticated || !address) {
            setIsLoading(false);
            return;
        }
        setIsLoading(targetEthLoading || targetUsdcLoading || currentEthLoading);
    }, [authenticated, address, targetEthLoading, targetUsdcLoading, currentEthLoading]);

    // Handle switch chain
    const handleSwitchChain = () => {
        switchChain({ chainId: TARGET_CHAIN_ID });
    };

    if (!ready) {
        return (
            <Flex minH="200px" align="center" justify="center">
                <Spinner color="#FFEE00" size="lg" />
            </Flex>
        );
    }

    return (
        <VStack gap={4} align="stretch" w="full" maxW="480px" mx="auto" p={4}>
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
                        🌉 LI.FI Bridge
                    </Heading>
                </HStack>
                <Text color="#788690" fontSize="sm">
                    Bridge & swap to {targetChainName} via LI.FI
                </Text>
                <HStack justify="center" mt={2} gap={2}>
                    {IS_TESTNET && (
                        <Badge colorScheme="orange" fontSize="xs">
                            TESTNET
                        </Badge>
                    )}
                    <Badge colorScheme="blue" fontSize="xs">
                        Powered by LI.FI
                    </Badge>
                </HStack>
            </Box>

            {/* Main Content */}
            <Box
                bg="#101518"
                borderRadius="16px"
                border="1px solid rgba(255, 255, 255, 0.1)"
                overflow="hidden"
                p={4}
            >
                {!authenticated ? (
                    <VStack gap={4} p={4}>
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
                    <VStack gap={4} py={4}>
                        <Spinner color="#FFEE00" size="lg" />
                        <Text color="#788690" fontSize="sm">
                            Checking balances...
                        </Text>
                    </VStack>
                ) : (
                    <VStack gap={4}>
                        {/* Status */}
                        {isReadyToBet ? (
                            <HStack justify="center" gap={2}>
                                <Text color="#22C55E" fontSize="lg">✓</Text>
                                <Text color="#22C55E" fontSize="md" fontWeight="600">
                                    Ready to bet!
                                </Text>
                            </HStack>
                        ) : (
                            <Text color="#F97316" fontSize="md" fontWeight="600" textAlign="center">
                                Get USDC to start betting
                            </Text>
                        )}

                        {/* Balance Display */}
                        <Box bg="#1A1D21" borderRadius="12px" p={4} w="full">
                            <Text color="#FFEE00" fontSize="xs" fontWeight="600" mb={2}>
                                {targetChainName} Balance
                            </Text>
                            <HStack justify="space-between" mb={1}>
                                <Text color="#788690" fontSize="sm">USDC</Text>
                                <Text color={isReadyToBet ? '#22C55E' : 'white'} fontSize="sm" fontWeight="600">
                                    {targetUsdcAmount.toFixed(2)} USDC
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text color="#788690" fontSize="sm">ETH</Text>
                                <Text color="white" fontSize="sm" fontWeight="600">
                                    {targetEthAmount.toFixed(4)} ETH
                                </Text>
                            </HStack>
                        </Box>

                        {/* Current chain if different */}
                        {!isOnTargetChain && (
                            <Box bg="#1A1D21" borderRadius="12px" p={4} w="full" opacity={0.8}>
                                <HStack justify="space-between" mb={2}>
                                    <Text color="#788690" fontSize="xs" fontWeight="600">
                                        {currentChainName} (Current)
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
                                    <Text color="#788690" fontSize="sm">ETH</Text>
                                    <Text color="white" fontSize="sm" fontWeight="600">
                                        {currentChainEthAmount.toFixed(4)} ETH
                                    </Text>
                                </HStack>
                            </Box>
                        )}

                        {/* Switch chain button */}
                        {!isOnTargetChain && (
                            <Button
                                onClick={handleSwitchChain}
                                variant="outline"
                                borderColor="#3B82F6"
                                color="#3B82F6"
                                size="md"
                                w="full"
                                _hover={{ bg: '#3B82F6', color: 'white' }}
                            >
                                Switch to {targetChainName}
                            </Button>
                        )}

                        {/* LI.FI Widget */}
                        <Box w="full" className="dark">
                            <LiFiWidget
                                integrator="JustFlip"
                                config={getWidgetConfig(TARGET_CHAIN_ID, USDC_ADDRESS)}
                            />
                        </Box>

                        {/* Footer */}
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

            {/* Footer */}
            <Text color="#788690" fontSize="xs" textAlign="center">
                {IS_TESTNET
                    ? '⚠️ Testnet mode - Limited chain support'
                    : 'Bridge from 30+ chains via LI.FI'}
            </Text>
        </VStack>
    );
}