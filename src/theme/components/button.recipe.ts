import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'semibold',
    borderRadius: 'xl',
    transition: 'all 0.2s ease',
  },
  variants: {
    variant: {
      solid: {
        bg: '{colors.primary}',
        color: '{colors.white}',
        _hover: {
          bg: '{colors.primaryHover}',
        },
      },
      outline: {
        borderWidth: '2px',
        borderColor: '{colors.primary}',
        color: '{colors.primary}',
        _hover: {
          bg: '{colors.primary}',
          color: '{colors.white}',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});
