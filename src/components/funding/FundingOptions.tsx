/**
 * FundingOptions - Bridge or receive funds options
 */

import { VStack, HStack, Box, Text, Heading, Clipboard } from '@chakra-ui/react';
import { useFundingState } from '../../hooks';
import { colors } from '../../config';

interface FundingOptionsProps {
    onBridge: () => void;
}

export function FundingOptions({ onBridge }: FundingOptionsProps) {
    const { address, targetChainName } = useFundingState();

    return (
        <VStack gap={4} w="full" py={4}>
            {/* Header */}
            <VStack gap={1}>
                <Heading size="md" color={colors.text.primary}>
                    Get USDC to start betting
                </Heading>
                <Text color={colors.text.secondary} fontSize="sm">
                    Choose how to fund your wallet
                </Text>
            </VStack>

            {/* Option 1: Bridge */}
            <Box
                w="full"
                bg={colors.bg.card}
                borderRadius="12px"
                border={`1px solid ${colors.border.default}`}
                p={4}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: colors.primary, transform: 'translateY(-2px)' }}
                onClick={onBridge}
            >
                <HStack gap={3} mb={2}>
                    <Text fontSize="xl">⚡</Text>
                    <Text color={colors.text.primary} fontWeight="600">
                        Bridge from another chain
                    </Text>
                </HStack>
                <Text color={colors.text.secondary} fontSize="sm">
                    Have ETH or USDC on Ethereum, Arbitrum, or other chains? Bridge it to{' '}
                    {targetChainName}.
                </Text>
            </Box>

            {/* Option 2: Receive directly */}
            <Clipboard.Root value={address || ''}>
                <Clipboard.Trigger asChild>
                    <Box
                        w="full"
                        bg={colors.bg.card}
                        borderRadius="12px"
                        border={`1px solid ${colors.border.default}`}
                        p={4}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ borderColor: colors.primary }}
                    >
                        <HStack gap={3} mb={2}>
                            <Text fontSize="xl">📋</Text>
                            <Text color={colors.text.primary} fontWeight="600">
                                Receive funds directly
                            </Text>
                            <Clipboard.Indicator
                                copied={
                                    <Text fontSize="xs" color={colors.status.success}>
                                        Copied!
                                    </Text>
                                }
                            />
                        </HStack>
                        <Text color={colors.text.secondary} fontSize="sm" mb={3}>
                            Send USDC on {targetChainName} to this address from any wallet or exchange.
                        </Text>
                        <HStack bg={colors.bg.elevated} p={2} borderRadius="8px" justify="space-between">
                            <Text color={colors.text.primary} fontSize="xs" fontFamily="mono">
                                {address}
                            </Text>
                            <Clipboard.Indicator
                                copied={
                                    <Text color={colors.status.success} fontSize="xs">
                                        ✓ Copied
                                    </Text>
                                }
                            >
                                <Text color={colors.primary} fontSize="xs">
                                    Click to copy
                                </Text>
                            </Clipboard.Indicator>
                        </HStack>
                    </Box>
                </Clipboard.Trigger>
            </Clipboard.Root>
        </VStack>
    );
}