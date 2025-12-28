/**
 * LiFiWidget - LI.FI Widget with JustFlip Theming
 * Cross-chain bridging and swapping
 */

import { useMemo } from 'react';
import {
    Box,
    HStack,
    Heading,
    Text,
    Button,
    Badge, Flex,
} from '@chakra-ui/react';
import { LiFiWidget, type WidgetConfig } from '@lifi/widget';

// Environment
const IS_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';

// Chain IDs
const BASE_MAINNET = 8453;
const BASE_SEPOLIA = 84532;

// USDC addresses
const USDC_BASE_MAINNET = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
const USDC_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

interface LiFiWidgetProps {
    onBack?: () => void;
}

export default function LiFiWidgetComponent({ onBack }: LiFiWidgetProps) {
    const widgetConfig: WidgetConfig = useMemo(() => ({
        // Integrator name (required)
        integrator: 'JustFlip',

        // Appearance
        appearance: 'dark',

        // Variant - compact for mobile-friendly
        variant: 'compact',

        // Destination chain and token
        toChain: IS_TESTNET ? BASE_SEPOLIA : BASE_MAINNET,
        toToken: IS_TESTNET ? USDC_BASE_SEPOLIA : USDC_BASE_MAINNET,

        // Hide some UI elements for cleaner look
        hiddenUI: ['appearance', 'language', 'poweredBy'],

        // Theme customization
        theme: {
            palette: {
                primary: { main: '#FFEE00' },      // JustFlip yellow
                secondary: { main: '#788690' },    // Muted gray
                background: {
                    default: '#0A0C0E',              // Page background
                    paper: '#101518',                // Card background
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#788690',
                },
                grey: {
                    200: '#1A1D21',
                    300: '#252A2E',
                    700: '#788690',
                    800: '#464D53',
                },
                success: { main: '#22C55E' },
                warning: { main: '#F97316' },
                error: { main: '#EF4444' },
                info: { main: '#3B82F6' },
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
    }), []);

    return (
        <Flex flexDir="column" gap={4} align="center" justify="center" w="full"  mx="auto" p={4} bg="#101518">
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
                        🔀 LI.FI
                    </Heading>
                </HStack>
                <Text color="#788690" fontSize="sm">
                    Cross-chain swap & bridge to {IS_TESTNET ? 'Base Sepolia' : 'Base'}
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

            {/* LI.FI Widget */}
            <Box

                borderRadius="16px"
                overflow="hidden"
            >
                <LiFiWidget integrator="JustFlip" config={widgetConfig} />
            </Box>

            {/* Footer */}
            <Text color="#788690" fontSize="xs" textAlign="center">
                Powered by LI.FI • Aggregates 30+ bridges & DEXs
            </Text>
        </Flex>
    );
}