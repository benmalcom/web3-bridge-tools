/**
 * RelaySwapModal - Relay Protocol SwapWidget in a modal
 */

import {
    Dialog,
    Portal,
    CloseButton,
} from '@chakra-ui/react';
import { SwapWidget } from '@relayprotocol/relay-kit-ui';
import type { Token } from '@relayprotocol/relay-kit-ui';
import { adaptViemWallet } from '@relayprotocol/relay-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletClient } from 'wagmi';

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
    fromToken: Token | undefined;
    setFromToken: (token: Token | undefined) => void;
    toToken: Token | undefined;
    setToToken: (token: Token | undefined) => void;
    isOnTargetChain: boolean;
}

export default function RelaySwapModal({
                                      isOpen,
                                      onClose,
                                      fromToken,
                                      setFromToken,
                                      toToken,
                                      setToToken,
                                      isOnTargetChain,
                                  }: SwapModalProps) {
    const { login } = usePrivy();
    const { data: walletClient } = useWalletClient();

    // Adapt wallet for Relay
    const adaptedWallet = walletClient
        ? adaptViemWallet(walletClient)
        : undefined;

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => !e.open && onClose()}
            size="sm"
        >
            <Portal>
                <Dialog.Backdrop bg="rgba(0, 0, 0, 0.8)" />
                <Dialog.Positioner>
                    <Dialog.Content
                        bg="#101518"
                        borderRadius="16px"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        mx={4}
                    >
                        <Dialog.Header borderBottom="1px solid" borderColor="#2B3237" p={4}>
                            <Dialog.Title color="white" fontSize="lg" fontWeight="600">
                                {isOnTargetChain ? 'Swap to USDC' : 'Bridge & Swap'}
                            </Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton
                                    size="sm"
                                    color="#788690"
                                    _hover={{ color: 'white' }}
                                    position="absolute"
                                    right={4}
                                    top={4}
                                />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <Dialog.Body p={4} display="flex" justifyContent="center">


                            {/* Relay SwapWidget */}
                            <SwapWidget
                                fromToken={fromToken}
                                setFromToken={setFromToken}
                                toToken={toToken}
                                setToToken={setToToken}
                                lockToToken={true}
                                supportedWalletVMs={['evm']}
                                wallet={adaptedWallet}
                                onConnectWallet={login}
                                onAnalyticEvent={(event, data) => {
                                    console.log('[Relay]', event, data);
                                }}
                                onSwapSuccess={(result) => {
                                    console.log('[Relay] Success!', result);
                                    onClose();
                                }}
                                onSwapError={(error, data) => {
                                    console.error('[Relay] Error:', error, data);
                                }}
                            />
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}