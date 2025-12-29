/**
 * ProviderSelect - Bridge provider selection
 */

import { VStack, HStack, Box, Text, Button, Badge, SimpleGrid } from '@chakra-ui/react';
import { BRIDGE_PROVIDERS, colors } from '../../config';
import type { BridgeProvider } from '../../types';

interface ProviderSelectProps {
    onSelect: (provider: BridgeProvider) => void;
}

export function ProviderSelect({ onSelect }: ProviderSelectProps) {
    return (
        <VStack gap={4} w="full">
            <Text color={colors.text.secondary} fontSize="sm">
                Choose a bridge provider
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} w="full">
                {BRIDGE_PROVIDERS.map((p) => (
                    <Box
                        key={p.id}
                        bg={colors.bg.card}
                        borderRadius="12px"
                        border={`1px solid ${colors.border.default}`}
                        p={4}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ borderColor: p.color, transform: 'translateY(-2px)' }}
                        onClick={() => onSelect(p.id)}
                    >
                        <HStack justify="space-between" mb={2}>
                            <HStack gap={2}>
                                <Text fontSize="xl">{p.emoji}</Text>
                                <Text color={colors.text.primary} fontWeight="600">
                                    {p.name}
                                </Text>
                            </HStack>
                        </HStack>

                        <Text color={colors.text.secondary} fontSize="xs" mb={3}>
                            {p.description}
                        </Text>

                        <HStack gap={1} flexWrap="wrap" mb={3}>
                            {p.features.map((f) => (
                                <Badge
                                    key={f}
                                    bg={colors.bg.elevated}
                                    color={colors.text.secondary}
                                    fontSize="2xs"
                                    px={1.5}
                                    py={0.5}
                                >
                                    {f}
                                </Badge>
                            ))}
                        </HStack>

                        <Button
                            bg={p.color}
                            color="black"
                            size="sm"
                            w="full"
                            _hover={{ opacity: 0.9 }}
                        >
                            Use {p.name}
                        </Button>
                    </Box>
                ))}
            </SimpleGrid>
        </VStack>
    );
}