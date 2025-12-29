/**
 * WalletBar - Compact wallet status display
 */

import { HStack, Box, Text, Button, Badge, Clipboard } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useFundingState } from '../../hooks';
import { colors } from '../../config';

export function WalletBar() {
    const { logout } = usePrivy();
    const { shortAddress, address, usdcBalanceFormatted, isOnTargetChain, targetChainName } =
        useFundingState();

    return (
        <HStack
            justify="space-between"
            w="full"
            bg={colors.bg.card}
            px={4}
            py={3}
            borderRadius="12px"
            border={`1px solid ${colors.border.default}`}
        >
            {/* Left: Address + Copy */}
            <Clipboard.Root value={address || ''}>
                <HStack gap={2}>
                    <Box
                        w={2}
                        h={2}
                        bg={isOnTargetChain ? colors.status.success : colors.status.warning}
                        borderRadius="full"
                    />
                    <Clipboard.Trigger asChild>
                        <Text
                            color={colors.text.primary}
                            fontSize="sm"
                            fontFamily="mono"
                            cursor="pointer"
                            _hover={{ color: colors.primary }}
                        >
                            {shortAddress}
                        </Text>
                    </Clipboard.Trigger>
                    <Clipboard.Trigger asChild>
                        <Text
                            fontSize="xs"
                            cursor="pointer"
                            color={colors.text.secondary}
                            _hover={{ color: colors.primary }}
                        >
                            <Clipboard.Indicator copied="✓" />
                        </Text>
                    </Clipboard.Trigger>
                </HStack>
            </Clipboard.Root>

            {/* Right: Balance + Disconnect */}
            <HStack gap={3}>
                <Text color={colors.text.secondary} fontSize="sm">
                    {usdcBalanceFormatted} USDC
                </Text>
                {!isOnTargetChain && (
                    <Badge colorScheme="orange" fontSize="xs">
                        Not {targetChainName}
                    </Badge>
                )}
                <Button
                    size="xs"
                    variant="ghost"
                    color={colors.text.secondary}
                    _hover={{ color: colors.status.error, bg: 'rgba(239, 68, 68, 0.1)' }}
                    onClick={() => logout()}
                >
                    Disconnect
                </Button>
            </HStack>
        </HStack>
    );
}