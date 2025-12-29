/**
 * RelayBridge - Relay Protocol widget wrapper
 */

import { useState, useEffect } from 'react';
import { VStack, HStack, Box, Text, Heading, Button, Badge } from '@chakra-ui/react';
import type { Token } from '@relayprotocol/relay-kit-ui';
import { SwapWidget } from '@relayprotocol/relay-kit-ui';
import { adaptViemWallet } from '@relayprotocol/relay-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useWalletClient } from 'wagmi';
import {
    IS_TESTNET,
    TARGET_CHAIN_ID,
    TARGET_CHAIN_NAME,
    DESTINATION_TOKEN,
    SOURCE_TOKEN_ETH,
    TARGET_TOKEN_ETH,
    colors,
} from '../../config';

interface RelayBridgeProps {
    onBack?: () => void;
}

export function RelayBridge({ onBack }: RelayBridgeProps) {
    const { login } = usePrivy();
    const { chainId } = useAccount();
    const { data: walletClient } = useWalletClient();

    const [fromToken, setFromToken] = useState<Token | undefined>(SOURCE_TOKEN_ETH);
    const [toToken, setToToken] = useState<Token | undefined>(DESTINATION_TOKEN);

    const isOnTargetChain = chainId === TARGET_CHAIN_ID;

    // Adapt wallet for Relay
    const adaptedWallet = walletClient ? adaptViemWallet(walletClient) : undefined;

    // Update source token based on current chain
    useEffect(() => {
        setFromToken(isOnTargetChain ? TARGET_TOKEN_ETH : SOURCE_TOKEN_ETH);
    }, [isOnTargetChain]);

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
                        ⚡ Relay
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
                </HStack>
            </Box>

            {/* Widget */}
            <Box
                borderRadius="16px"
                overflow="hidden"
            >
                <SwapWidget
                    fromToken={fromToken}
                    setFromToken={setFromToken}
                    toToken={toToken}
                    setToToken={setToToken}
                    lockToToken={true}
                    supportedWalletVMs={['evm']}
                    wallet={adaptedWallet}
                    onConnectWallet={login}
                    onAnalyticEvent={(eventName, data) => {
                        console.log('[Relay]', eventName, data);
                    }}
                />
            </Box>

            {/* Footer */}
            <Text color={colors.text.secondary} fontSize="xs" textAlign="center">
                {IS_TESTNET
                    ? '⚠️ Testnet mode - may have low liquidity'
                    : 'Powered by Relay Protocol'}
            </Text>
        </VStack>
    );
}