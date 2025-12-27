export const semanticTokens = {
  colors: {
    // Backgrounds
    'bg.body': {
      value: {
        base: '{colors.white}',
        _dark: '{colors.dark.800}',
      },
    },
    'bg.primary': {
      value: {
        base: '{colors.primary.500}',
        _dark: '{colors.primary.400}',
      },
    },
    'bg.secondary': {
      value: {
        base: '{colors.gray.50}',
        _dark: '{colors.dark.900}',
      },
    },
    'bg.gradient': {
      value: {
        base: 'linear(to-b, #FFFFFF, #F3F4F6)',
        _dark: 'linear(to-b, #0A0B14, #121527)',
      },
    },

    // Text colors
    'text.body': {
      value: {
        base: '{colors.gray.800}',
        _dark: '{colors.splash.text.primary}',
      },
    },
    'text.muted': {
      value: {
        base: '{colors.gray.500}',
        _dark: '{colors.gray.400}',
      },
    },

    // Links
    'link.default': {
      value: {
        base: '{colors.splash.primary}',
        _dark: '{colors.white}',
      },
    },
    'link.hover': {
      value: {
        base: '{colors.primary.600}',
        _dark: '{colors.splash.primary}',
      },
    },
  },
};
