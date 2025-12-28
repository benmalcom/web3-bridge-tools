/**
 * HomePage - Select bridge provider
 */

import { useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    HStack,
    Badge,
    SimpleGrid,
} from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';

// Provider type
export type BridgeProvider = 'relay' | 'lifi';

interface HomePageProps {
    onSelectProvider: (provider: BridgeProvider) => void;
}

// Provider card data
const providers = [
    {
        id: 'relay' as BridgeProvider,
        name: 'Relay',
        emoji: '⚡',
        description: 'Fast cross-chain swaps with instant execution',
        features: ['70+ chains', 'Instant fills', 'Testnet support'],
        color: '#FFEE00',
        badge: 'Recommended',
        badgeColor: 'yellow',
    },
    {
        id: 'lifi' as BridgeProvider,
        name: 'LI.FI',
        emoji: '🔀',
        description: 'Aggregates 30+ bridges & DEXs for best rates',
        features: ['Best rates', 'Multi-chain', 'Route optimization'],
        color: '#9F7AEA',
        badge: 'Aggregator',
        badgeColor: 'purple',
    },
];

export default function HomePage({ onSelectProvider }: HomePageProps) {
    const IS_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';
    const { authenticated, login, logout, user } = usePrivy();
    const [copied, setCopied] = useState(false);

    // Get wallet address
    const walletAddress = user?.wallet?.address;
    const shortAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : null;

    const handleCopyAddress = async () => {
        if (walletAddress) {
            await navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleProviderSelect = (providerId: BridgeProvider) => {
        if (!authenticated) {
            login();
            return;
        }
        onSelectProvider(providerId);
    };

    return (
        <VStack gap={6} align="stretch" w="full" maxW="600px" mx="auto" p={4}>
            {/* Header */}
            <Box textAlign="center" py={4}>
                <Heading size="xl" color="white" mb={2}>
                    💰 Fund Your Wallet
                </Heading>
                <Text color="#788690" fontSize="md">
                    {authenticated
                        ? 'Choose a bridge provider to get USDC on Base'
                        : 'Connect your wallet to get started'
                    }
                </Text>
                <HStack justify="center" gap={2} mt={2}>
                    {IS_TESTNET && (
                        <Badge colorScheme="orange" fontSize="xs">
                            TESTNET MODE
                        </Badge>
                    )}
                    {!authenticated && (
                        <Badge colorScheme="red" fontSize="xs">
                            WALLET NOT CONNECTED
                        </Badge>
                    )}
                </HStack>
            </Box>

            {/* Wallet Status */}
            {authenticated && shortAddress && (
                <HStack
                    justify="center"
                    gap={3}
                    bg="#101518"
                    p={3}
                    borderRadius="12px"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                >
                    <HStack gap={2}>
                        <Box w={2} h={2} bg="#22C55E" borderRadius="full" />
                        <Text
                            color="white"
                            fontSize="sm"
                            fontFamily="mono"
                            cursor="pointer"
                            onClick={handleCopyAddress}
                            _hover={{ color: '#FFEE00' }}
                            title="Click to copy"
                        >
                            {shortAddress}
                        </Text>
                        <Button
                            size="xs"
                            variant="ghost"
                            color={copied ? '#22C55E' : '#788690'}
                            _hover={{ color: '#FFEE00' }}
                            onClick={handleCopyAddress}
                            px={1}
                            minW="auto"
                        >
                            {copied ? '✓' : '📋'}
                        </Button>
                    </HStack>
                    <Button
                        size="sm"
                        variant="ghost"
                        color="#788690"
                        _hover={{ color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }}
                        onClick={() => logout()}
                    >
                        Disconnect
                    </Button>
                </HStack>
            )}

            {/* Connect Wallet Button (when not connected) */}
            {!authenticated && (
                <Button
                    bg="#FFEE00"
                    color="black"
                    size="lg"
                    onClick={() => login()}
                    _hover={{ opacity: 0.9 }}
                >
                    Connect Wallet
                </Button>
            )}

            {/* Provider Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {providers.map((provider) => (
                    <Box
                        key={provider.id}
                        bg="#101518"
                        borderRadius="16px"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        p={5}
                        cursor={authenticated ? 'pointer' : 'not-allowed'}
                        opacity={authenticated ? 1 : 0.6}
                        transition="all 0.2s"
                        _hover={authenticated ? {
                            borderColor: provider.color,
                            transform: 'translateY(-2px)',
                        } : {}}
                        onClick={() => handleProviderSelect(provider.id)}
                    >
                        {/* Header with emoji and badge */}
                        <HStack justify="space-between" align="center" mb={2}>
                            <HStack gap={2}>
                                <Text fontSize="2xl">{provider.emoji}</Text>
                                <Text color="white" fontSize="lg" fontWeight="600">
                                    {provider.name}
                                </Text>
                            </HStack>
                            <Badge
                                colorScheme={provider.badgeColor}
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="full"
                            >
                                {provider.badge}
                            </Badge>
                        </HStack>

                        {/* Description */}
                        <Text color="#788690" fontSize="sm" mb={3}>
                            {provider.description}
                        </Text>

                        {/* Features */}
                        <HStack gap={2} flexWrap="wrap" mb={4}>
                            {provider.features.map((feature) => (
                                <Badge
                                    key={feature}
                                    bg="#1A1D21"
                                    color="#788690"
                                    fontSize="xs"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                >
                                    {feature}
                                </Badge>
                            ))}
                        </HStack>

                        {/* Button */}
                        <Button
                            bg={provider.color}
                            color="black"
                            size="lg"
                            w="full"
                            _hover={{ opacity: 0.9 }}
                            disabled={!authenticated}
                        >
                            {authenticated ? `Use ${provider.name}` : 'Connect Wallet First'}
                        </Button>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Info */}
            <Box textAlign="center" py={4}>
                <Text color="#788690" fontSize="xs">
                    Bridge to USDC on {IS_TESTNET ? 'Base Sepolia' : 'Base'}
                </Text>
                <Text color="#464D53" fontSize="xs" mt={1}>
                    JustFlip • 1% platform fee
                </Text>
            </Box>
        </VStack>
    );
}