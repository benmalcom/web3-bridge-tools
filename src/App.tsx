/**
 * App - Demo wrapper for FundingFlow
 */

import { Box, Flex } from '@chakra-ui/react';
import { FundingFlow } from './components/funding';
import { colors } from './config';

function App() {
    return (
        <Flex
            minH="100vh"
            bg="transparent"
            color={colors.text.primary}
            align="center"
            justify="center"
            py={{ base: 4, md: 8 }}
            px={4}
        >
            <Box w="full" maxW="500px">
                <FundingFlow />
            </Box>
        </Flex>
    );
}

export default App;