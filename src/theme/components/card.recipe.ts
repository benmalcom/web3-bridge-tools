import { defineSlotRecipe } from '@chakra-ui/react';

export const cardRecipe = defineSlotRecipe({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: {
      bg: 'bg',
      color: 'text',
      borderRadius: '2xl',
      boxShadow: 'md',
      p: 6,
    },
    header: {
      mb: 4,
      fontWeight: 'bold',
      fontSize: 'lg',
    },
    body: {
      fontSize: 'md',
    },
  },
});
