import { defineTokens } from '@chakra-ui/react';

export const colors = defineTokens.colors({
  dark: {
    800: { value: '#0A0B14' },
    900: { value: '#121527' },
  },
  // JustFlip brand colors from SASS variables
  brand: {
    black: { value: '#101518' },
    white: { value: '#fff' },
    yellow: { value: '#FFEE00' },
    gray: {
      1: { value: '#181D22' },
      2: { value: '#1F2429' },
      3: { value: '#464D53' },
      4: { value: '#737D84' },
      5: { value: '#4C535C' },
      6: { value: '#6C757D' },
      7: { value: '#2B3237' },
      8: { value: '#535B63' },
    },
    highlight: { value: '#252B30' },
  },
});
