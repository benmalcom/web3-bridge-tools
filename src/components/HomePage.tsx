/**
 * HomePage - Bridge provider selection
 * Minimal component - just picks provider
 */

import {
    Box,
    VStack,
    Text,
    Button,
    HStack,
    Badge,
    SimpleGrid,
} from '@chakra-ui/react';

export type BridgeProvider = 'relay' | 'lifi';

interface HomePageProps {
    onSelectProvider: (provider: BridgeProvider) => void;
}

const providers = [
    {
        id: 'relay' as BridgeProvider,
        name: 'Relay',
        emoji: '⚡',
        description: 'Fast cross-chain swaps',
        features: ['70+ chains', 'Instant', 'Testnet'],
        color: '#FFEE00',
    },
    {
        id: 'lifi' as BridgeProvider,
        name: 'LI.FI',
        emoji: '🔀',
        description: 'Best rate aggregator',
        features: ['30+ bridges', 'Best rates', 'Multi-chain'],
        color: '#9F7AEA',
    },
];

export default function HomePage({ onSelectProvider }: HomePageProps) {
    return (
        <VStack gap={4} w="full">
            {/* Simple header */}
            <Text color="#788690" fontSize="sm">
                Get USDC to start betting
            </Text>

            {/* Provider Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} w="full">
                {providers.map((p) => (
                    <Box
                        key={p.id}
                        bg="#101518"
                        borderRadius="12px"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        p={4}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ borderColor: p.color, transform: 'translateY(-2px)' }}
                        onClick={() => onSelectProvider(p.id)}
                    >
                        <HStack justify="space-between" mb={2}>
                            <HStack gap={2}>
                                <Text fontSize="xl">{p.emoji}</Text>
                                <Text color="white" fontWeight="600">{p.name}</Text>
                            </HStack>
                        </HStack>

                        <Text color="#788690" fontSize="xs" mb={3}>
                            {p.description}
                        </Text>

                        <HStack gap={1} flexWrap="wrap" mb={3}>
                            {p.features.map((f) => (
                                <Badge key={f} bg="#1A1D21" color="#788690" fontSize="2xs" px={1.5} py={0.5}>
                                    {f}
                                </Badge>
                            ))}
                        </HStack>

                        <Button bg={p.color} color="black" size="sm" w="full" _hover={{ opacity: 0.9 }}>
                            Use {p.name}
                        </Button>
                    </Box>
                ))}
            </SimpleGrid>
        </VStack>
    );
}