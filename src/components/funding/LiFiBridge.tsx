/**
 * LiFiBridge - LI.FI widget wrapper
 */

import { useMemo } from 'react';
import { VStack, HStack, Box, Text, Heading, Button, Badge } from '@chakra-ui/react';
import { LiFiWidget, type WidgetConfig } from '@lifi/widget';
import {
    IS_TESTNET,
    TARGET_CHAIN_ID,
    TARGET_CHAIN_NAME,
    USDC_ADDRESS,
    colors,
} from '../../config';

interface LiFiBridgeProps {
    onBack?: () => void;
}

export function LiFiBridge({ onBack }: LiFiBridgeProps) {
    const widgetConfig: WidgetConfig = useMemo(
        () => ({
            integrator: 'JustFlip',
            appearance: 'dark',
            variant: 'compact',
            toChain: TARGET_CHAIN_ID,
            toToken: USDC_ADDRESS,
            hiddenUI: ['appearance', 'language', 'poweredBy'],
            theme: {
                palette: {
                    primary: { main: colors.primary },
                    secondary: { main: colors.text.secondary },
                    background: {
                        default: colors.bg.page,
                        paper: colors.bg.card,
                    },
                    text: {
                        primary: colors.text.primary,
                        secondary: colors.text.secondary,
                    },
                    grey: {
                        200: colors.bg.elevated,
                        300: '#252A2E',
                        700: colors.text.secondary,
                        800: colors.text.muted,
                    },
                    success: { main: colors.status.success },
                    warning: { main: colors.status.warning },
                    error: { main: colors.status.error },
                    info: { main: colors.status.info },
                },
                shape: {
                    borderRadius: 12,
                    borderRadiusSecondary: 8,
                },
                typography: {
                    fontFamily: 'Space Grotesk, Inter, system-ui, sans-serif',
                },
                container: {
                    boxShadow: 'none',
                    borderRadius: '16px',
                },
            },
        }),
        []
    );

    return (
        <VStack gap={4} align="stretch" w="fit-content" mx="auto">
            {/* Header */}
            <Box textAlign="center">
                <HStack justify="center" gap={2} mb={2}>
                    {onBack && (
                        <Button
                            onClick={onBack}
                            variant="ghost"
                            size="sm"
                            color={colors.text.secondary}
                            _hover={{ color: colors.text.primary, bg: 'transparent' }}
                        >
                            ← Back
                        </Button>
                    )}
                    <Heading size="lg" color={colors.text.primary}>
                        🔀 LI.FI
                    </Heading>
                </HStack>
                <Text color={colors.text.secondary} fontSize="sm">
                    Bridge to USDC on {TARGET_CHAIN_NAME}
                </Text>
                <HStack justify="center" mt={2} gap={2}>
                    {IS_TESTNET && (
                        <Badge colorScheme="orange" fontSize="xs">
                            TESTNET
                        </Badge>
                    )}
                    <Badge colorScheme="purple" fontSize="xs">
                        Multi-chain
                    </Badge>
                </HStack>
            </Box>

            {/* Widget */}
            <Box bg={colors.bg.card} borderRadius="16px" overflow="hidden">
                <LiFiWidget integrator="JustFlip" config={widgetConfig} />
            </Box>

            {/* Footer */}
            <Text color={colors.text.secondary} fontSize="xs" textAlign="center">
                Powered by LI.FI • Aggregates 30+ bridges & DEXs
            </Text>
        </VStack>
    );
}