/**
 * BungeeLiteWidget - Bungee Lite Widget with JustFlip Theming
 * Uses @socket.tech/bungee package for seamless integration
 * Note: Requires Vercel deployment (localhost blocked by Cloudflare)
 */

import { useRef } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Badge,
} from '@chakra-ui/react';
import { Bungee, type BungeeConfig, type BungeeImperativeAPIType } from '@socket.tech/bungee';
import { usePrivy } from '@privy-io/react-auth';

// Environment config
const BUNGEE_API_KEY = import.meta.env.VITE_BUNGEE_API_KEY || '72a5b4b0-e727-48be-8aa1-5da9d62fe635';

// Chain IDs - Bungee Lite is mainnet only
const BASE_MAINNET_ID = 8453;

// USDC on Base mainnet
const USDC_BASE_MAINNET = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

// JustFlip Theme
const justFlipTheme = {
    width: 'full' as const,
    borderRadius: 'lg' as const,
    fonts: {
        primary: 'Space Grotesk, Inter, sans-serif',
        secondary: 'Space Grotesk, Inter, sans-serif',
    },
    colors: {
        text: {
            primary: '#FFFFFF',
            secondary: '#788690',
            button: '#000000',
            theme: '#FFEE00',
            accent1: '#000000',
            accent2: '#000000',
            accent3: '#FFFFFF',
            accent4: '#FFFFFF',
        },
        bg: {
            layer1: '#101518',
            layer2: '#1A1D21',
            layer3: '#252A2E',
            accent1: '#22C55E',
            accent3: '#EF4444',
            accent4: '#3B82F6',
            main: '#0A0C0E',
            theme: '#FFEE00',
        },
        border: {
            strong: 'rgba(255, 255, 255, 0.1)',
            theme: '#FFEE00',
        },
        icon: {
            primary: '#FFFFFF',
            secondary: '#788690',
            theme: '#FFEE00',
        },
    },
};

interface BungeeLiteWidgetProps {
    onBack?: () => void;
}

export default function BungeeLiteWidget({ onBack }: BungeeLiteWidgetProps) {
    const bungeeRef = useRef<BungeeImperativeAPIType>(null);
    const { login, authenticated } = usePrivy();

    // Use proxy in development to bypass CORS/Cloudflare
    // In production (Vercel), requests go through /api/bungee-proxy
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '/bungee-api' : '/api/bungee-proxy';

    const config: BungeeConfig = {
        apiKey: BUNGEE_API_KEY,
        baseUrl,
        theme: justFlipTheme,
        initialValues: {
            toChain: BASE_MAINNET_ID,
            outputTokens: [USDC_BASE_MAINNET],
            locale: 'en-US',
            sortPreference: 'fast',
            swapSlippage: 1,
        },
        features: {
            internalToasts: true,
            internalTxHistory: true,
        },
        eventHandlers: {
            onFromChainChange: (chain) => {
                console.log('[Bungee] Source chain changed:', chain);
            },
            onToChainChange: (chain) => {
                console.log('[Bungee] Destination chain changed:', chain);
            },
            onFromTokenChange: (token) => {
                console.log('[Bungee] Source token changed:', token);
            },
            onToTokenChange: (token) => {
                console.log('[Bungee] Destination token changed:', token);
            },
            onSwapInitiated: (data) => {
                console.log('[Bungee] Swap initiated:', data);
            },
            onEvent: (eventType, eventData) => {
                console.log('[Bungee] Event:', eventType, eventData);
            },
            onOpenWalletConnect: (network) => {
                console.log('[Bungee] Wallet connect requested for:', network);
                if (!authenticated) {
                    login();
                }
            },
            logEvent: (log) => {
                if (log.error) {
                    console.error('[Bungee] Error:', log.error, log.context);
                }
            },
        },
    };

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
                        🐝 Bungee
                    </Heading>
                </HStack>
                <Text color="#788690" fontSize="sm">
                    Swap & bridge to Base (Mainnet)
                </Text>
                <HStack justify="center" mt={2} gap={2}>
                    <Badge colorScheme="green" fontSize="xs">
                        Mainnet Only
                    </Badge>
                    <Badge colorScheme="yellow" fontSize="xs">
                        Fast Bridging
                    </Badge>
                </HStack>
            </Box>

            {/* Bungee Widget */}
            <Box
                bg="#101518"
                borderRadius="16px"
                border="1px solid rgba(255, 255, 255, 0.1)"
                overflow="hidden"
                p={0}
            >
                <Bungee config={config} ref={bungeeRef} />
            </Box>

            {/* Footer */}
            <Text color="#788690" fontSize="xs" textAlign="center">
                Powered by Bungee • Fast cross-chain swaps (Mainnet only)
            </Text>
        </VStack>
    );
}