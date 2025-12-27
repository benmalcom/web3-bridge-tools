/**
 * HomePage - Select bridge provider
 */

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
export type BridgeProvider = 'relay' | 'bungee';

interface HomePageProps {
    onSelectProvider: (provider: BridgeProvider) => void;
}

// Provider card data
const providers = [
    {
        id: 'relay' as BridgeProvider,
        name: 'Relay Protocol',
        emoji: '⚡',
        description: 'Fast cross-chain swaps with instant execution',
        features: ['70+ chains', 'ETH → USDC', 'Testnet support', 'No API key'],
        color: '#FFEE00',
        badge: 'Recommended',
        badgeColor: 'yellow',
    },
    {
        id: 'bungee' as BridgeProvider,
        name: 'Bungee',
        emoji: '🐝',
        description: 'Intent-based bridging with best execution',
        features: ['Multi-chain', 'Fast fills', 'EVM & Solana', 'Mainnet only'],
        color: '#FF6B00',
        badge: 'Fast',
        badgeColor: 'orange',
    },
];

export default function HomePage({ onSelectProvider }: HomePageProps) {
    const IS_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';
    const { authenticated, login } = usePrivy();

    const handleProviderSelect = (providerId: BridgeProvider) => {
        if (!authenticated) {
            login();
            return;
        }
        // Bungee doesn't work in testnet
        if (providerId === 'bungee' && IS_TESTNET) {
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
                {providers.map((provider) => {
                    const isBungeeTestnet = provider.id === 'bungee' && IS_TESTNET;
                    const isDisabled = !authenticated || isBungeeTestnet;

                    return (
                        <Box
                            key={provider.id}
                            bg="#101518"
                            borderRadius="16px"
                            border="1px solid"
                            borderColor="rgba(255, 255, 255, 0.1)"
                            p={5}
                            cursor={isDisabled ? 'not-allowed' : 'pointer'}
                            opacity={isDisabled ? 0.6 : 1}
                            transition="all 0.2s"
                            _hover={!isDisabled ? {
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
                                disabled={isDisabled}
                            >
                                {!authenticated
                                    ? 'Connect Wallet First'
                                    : isBungeeTestnet
                                        ? 'Mainnet Only'
                                        : `Use ${provider.name}`
                                }
                            </Button>
                        </Box>
                    );
                })}
            </SimpleGrid>

            {/* Info */}
            <Box textAlign="center" py={4}>
                <Text color="#788690" fontSize="xs">
                    All providers bridge to USDC on {IS_TESTNET ? 'Base Sepolia' : 'Base'}
                </Text>
                <Text color="#464D53" fontSize="xs" mt={1}>
                    JustFlip • 1% platform fee
                </Text>
            </Box>
        </VStack>
    );
}