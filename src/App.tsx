import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import HomePage, {type BridgeProvider } from './components/HomePage';
import RelayWidget from './components/RelayWidget';
import BungeeLiteWidget from './components/BungeeLiteWidget';

function App() {
    const [selectedProvider, setSelectedProvider] = useState<BridgeProvider | null>(null);

    const handleBack = () => {
        setSelectedProvider(null);
    };

    return (
        <Flex
            minH="100vh"
            bg="#0A0C0E"
            color="white"
            align="center"
            justify="center"
            py={{ base: 4, md: 8 }}
            px={4}
        >
            <Box w="full" maxW={selectedProvider === null ? '600px' : '480px'}>
                {selectedProvider === null && (
                    <HomePage onSelectProvider={setSelectedProvider} />
                )}

                {selectedProvider === 'relay' && (
                    <RelayWidget onBack={handleBack} />
                )}

                {selectedProvider === 'bungee' && (
                    <BungeeLiteWidget onBack={handleBack} />
                )}
            </Box>
        </Flex>
    );
}

export default App;