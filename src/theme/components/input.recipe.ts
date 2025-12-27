import { defineSlotRecipe } from '@chakra-ui/react';

export const inputSlotRecipe = defineSlotRecipe({
  className: 'chakra-input',
  slots: ['root', 'field', 'addon', 'element'],
  base: {
    field: {
      // CRITICAL: Remove ALL default spacing
      width: 'auto',
      height: 'auto',
      minWidth: '0',
      minHeight: '0',
      paddingInline: '0',
      paddingInlineStart: '0',
      paddingInlineEnd: '0',
      paddingBlock: '0',
      paddingBlockStart: '0',
      paddingBlockEnd: '0',
      padding: '0',
      margin: '0',
      borderRadius: '0',
      borderWidth: '0',
      background: 'transparent',
      outline: '0',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontFamily: 'inherit',
      _focus: {
        boxShadow: 'none',
        outline: 'none',
        borderColor: 'transparent',
      },
      _focusVisible: {
        boxShadow: 'none',
        outline: 'none',
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
