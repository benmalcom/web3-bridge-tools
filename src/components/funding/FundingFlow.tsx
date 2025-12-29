/**
 * FundingFlow - Main funding flow component
 *
 * Handles all states:
 * - loading
 * - not_connected
 * - no_evm_wallet
 * - wrong_chain
 * - needs_funding
 * - ready
 */

import { useState } from 'react';
import { VStack, Heading, Text, Button, Spinner } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useFundingState } from '../../hooks';
import { colors } from '../../config';
import type { BridgeProvider } from '../../types';
import { WalletBar } from './WalletBar';
import { FundingOptions } from './FundingOptions';
import { ProviderSelect } from './ProviderSelect';
import { RelayBridge } from './RelayBridge';
import { LiFiBridge } from './LiFiBridge';

export function FundingFlow() {
    const { status, switchChain, targetChainName, refetchBalance, usdcBalanceFormatted } =
        useFundingState();
    const { login } = usePrivy();

    const [selectedProvider, setSelectedProvider] = useState<BridgeProvider | null>(null);
    const [showProviders, setShowProviders] = useState(false);

    const handleBack = () => {
        refetchBalance();
        setSelectedProvider(null);
        setShowProviders(false);
    };

    // Loading
    if (status === 'loading') {
        return (
            <VStack gap={4} py={12}>
                <Spinner size="lg" color={colors.primary} />
                <Text color={colors.text.secondary}>Checking wallet...</Text>
            </VStack>
        );
    }

    // Not connected
    if (status === 'not_connected') {
        return (
            <VStack gap={6} py={8}>
                <VStack gap={2}>
                    <Heading size="lg" color={colors.text.primary}>
                        Connect Wallet
                    </Heading>
                    <Text color={colors.text.secondary} fontSize="sm">
                        Connect to start betting
                    </Text>
                </VStack>
                <Button
                    bg={colors.primary}
                    color="black"
                    size="lg"
                    onClick={() => login()}
                    _hover={{ opacity: 0.9 }}
                >
                    Connect Wallet
                </Button>
            </VStack>
        );
    }

    // No EVM wallet
    if (status === 'no_evm_wallet') {
        return (
            <VStack gap={6} py={8}>
                <VStack gap={2}>
                    <Heading size="lg" color={colors.text.primary}>
                        EVM Wallet Required
                    </Heading>
                    <Text color={colors.text.secondary} fontSize="sm" textAlign="center">
                        Please connect MetaMask, Coinbase Wallet,
                        <br />
                        or sign up with email.
                    </Text>
                </VStack>
                <Button
                    bg={colors.primary}
                    color="black"
                    size="lg"
                    onClick={() => login()}
                    _hover={{ opacity: 0.9 }}
                >
                    Connect EVM Wallet
                </Button>
            </VStack>
        );
    }

    // Wrong chain
    if (status === 'wrong_chain') {
        return (
            <VStack gap={4} w="full">
                <WalletBar />
                <VStack gap={4} py={8}>
                    <VStack gap={2}>
                        <Heading size="lg" color={colors.text.primary}>
                            Switch Network
                        </Heading>
                        <Text color={colors.text.secondary} fontSize="sm">
                            Switch to {targetChainName} to continue
                        </Text>
                    </VStack>
                    <Button
                        bg={colors.primary}
                        color="black"
                        size="lg"
                        onClick={switchChain}
                        _hover={{ opacity: 0.9 }}
                    >
                        Switch to {targetChainName}
                    </Button>
                </VStack>
            </VStack>
        );
    }

    // Needs funding
    if (status === 'needs_funding') {
        // Show bridge widget
        if (selectedProvider === 'relay') {
            return <RelayBridge onBack={handleBack} />;
        }
        if (selectedProvider === 'lifi') {
            return <LiFiBridge onBack={handleBack} />;
        }

        // Show provider selection
        if (showProviders) {
            return (
                <VStack gap={4} w="full">
                    <WalletBar />
                    <Button
                        variant="ghost"
                        color={colors.text.secondary}
                        size="sm"
                        alignSelf="flex-start"
                        _hover={{ color: colors.text.primary, bg: 'transparent' }}
                        onClick={() => setShowProviders(false)}
                    >
                        ← Back
                    </Button>
                    <ProviderSelect onSelect={setSelectedProvider} />
                </VStack>
            );
        }

        // Show funding options
        return (
            <VStack gap={4} w="full">
                <WalletBar />
                <FundingOptions onBridge={() => setShowProviders(true)} />
            </VStack>
        );
    }

    // Ready
    if (status === 'ready') {
        // Show bridge widget if adding funds
        if (selectedProvider === 'relay') {
            return <RelayBridge onBack={handleBack} />;
        }
        if (selectedProvider === 'lifi') {
            return <LiFiBridge onBack={handleBack} />;
        }

        // Show provider selection
        if (showProviders) {
            return (
                <VStack gap={4} w="full">
                    <WalletBar />
                    <Button
                        variant="ghost"
                        color={colors.text.secondary}
                        size="sm"
                        alignSelf="flex-start"
                        _hover={{ color: colors.text.primary, bg: 'transparent' }}
                        onClick={() => setShowProviders(false)}
                    >
                        ← Back
                    </Button>
                    <ProviderSelect onSelect={setSelectedProvider} />
                </VStack>
            );
        }

        // Show ready state
        return (
            <VStack gap={4} w="full">
                <WalletBar />
                <VStack
                    gap={4}
                    py={8}
                    bg={colors.bg.card}
                    borderRadius="16px"
                    border={`1px solid ${colors.border.default}`}
                    w="full"
                >
                    <Text fontSize="3xl">✅</Text>
                    <VStack gap={1}>
                        <Heading size="md" color={colors.text.primary}>
                            Wallet Funded
                        </Heading>
                        <Text color={colors.text.secondary} fontSize="sm">
                            {usdcBalanceFormatted} USDC available
                        </Text>
                    </VStack>
                    <Button
                        variant="outline"
                        borderColor={colors.text.secondary}
                        color={colors.text.secondary}
                        bg="transparent"
                        _hover={{
                            borderColor: colors.primary,
                            color: colors.primary,
                            bg: 'transparent',
                        }}
                        onClick={() => setShowProviders(true)}
                    >
                        + Add More Funds
                    </Button>
                </VStack>
            </VStack>
        );
    }

    return null;
}