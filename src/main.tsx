import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia, mainnet, sepolia, optimism, arbitrum, polygon } from 'wagmi/chains';
import { RelayKitProvider } from '@relayprotocol/relay-kit-ui';
import { convertViemChainToRelayChain, MAINNET_RELAY_API, TESTNET_RELAY_API } from '@relayprotocol/relay-sdk';
import '@relayprotocol/relay-kit-ui/styles.css';
import '@socket.tech/bungee/styles.css';
import '@socket.tech/bungee/fonts.css';

import App from './App';
import { system } from './theme';
import { relayTheme } from './theme/relayTheme';

// Environment
const IS_TESTNET = import.meta.env.VITE_USE_TESTNET === 'true';
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

if (!PRIVY_APP_ID) {
    throw new Error('Missing VITE_PRIVY_APP_ID');
}

// Wagmi config - include mainnet chains for Bungee even in testnet mode
const wagmiConfig = IS_TESTNET
    ? createConfig({
        chains: [baseSepolia, sepolia, base, mainnet, optimism, arbitrum, polygon],
        transports: {
            [baseSepolia.id]: http(),
            [sepolia.id]: http(),
            [base.id]: http(),
            [mainnet.id]: http(),
            [optimism.id]: http(),
            [arbitrum.id]: http(),
            [polygon.id]: http(),
        },
    })
    : createConfig({
        chains: [base, mainnet, optimism, arbitrum, polygon],
        transports: {
            [base.id]: http(),
            [mainnet.id]: http(),
            [optimism.id]: http(),
            [arbitrum.id]: http(),
            [polygon.id]: http(),
        },
    });

// Relay chains
const relayChains = IS_TESTNET
    ? [baseSepolia, sepolia].map(chain => convertViemChainToRelayChain(chain))
    : [base, mainnet].map(chain => convertViemChainToRelayChain(chain));

// TanStack Query client
const queryClient = new QueryClient();

// Privy supported chains
const privyChains = IS_TESTNET ? [baseSepolia, sepolia] : [base, mainnet];
const defaultChain = IS_TESTNET ? baseSepolia : base;

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <PrivyProvider
                appId={PRIVY_APP_ID}
                config={{
                    appearance: {
                        theme: 'dark',
                        accentColor: '#FFEE00',
                    },
                    loginMethods: ['email', 'wallet'],
                    embeddedWallets: {
                        createOnLogin: 'users-without-wallets',
                    },
                    defaultChain,
                    supportedChains: privyChains,
                }}
            >
                <WagmiProvider config={wagmiConfig}>
                    <RelayKitProvider
                        theme={relayTheme}
                        options={{
                            appName: 'JustFlip',
                            chains: relayChains,
                            baseApiUrl: IS_TESTNET ? TESTNET_RELAY_API : MAINNET_RELAY_API,
                        }}
                    >
                        <ChakraProvider value={system}>
                            <App />
                        </ChakraProvider>
                    </RelayKitProvider>
                </WagmiProvider>
            </PrivyProvider>
        </QueryClientProvider>
    </React.StrictMode>
);