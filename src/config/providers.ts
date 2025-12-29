/**
 * Bridge Provider Configuration
 */

import type { ProviderConfig } from '../types';
import { colors } from './theme';

export const BRIDGE_PROVIDERS: ProviderConfig[] = [
    {
        id: 'relay',
        name: 'Relay',
        emoji: '⚡',
        description: 'Fast cross-chain swaps',
        features: ['70+ chains', 'Instant', 'Testnet'],
        color: colors.provider.relay,
    },
    {
        id: 'lifi',
        name: 'LI.FI',
        emoji: '🔀',
        description: 'Best rate aggregator',
        features: ['30+ bridges', 'Best rates', 'Multi-chain'],
        color: colors.provider.lifi,
    },
];