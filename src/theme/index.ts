import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';
import { colors } from './colors';
import { semanticTokens } from './semantic-tokens';
import { globalStyles } from './global';

const fonts = {
  body: { value: 'var(--font-blackbird), system-ui, sans-serif' },
  heading: { value: 'var(--font-blackbird), system-ui, sans-serif' },

  // Map all old names to the single family (weight handled separately)
  blackbird: { value: 'var(--font-blackbird), system-ui, sans-serif' },
  blackbirdMed: { value: 'var(--font-blackbird), system-ui, sans-serif' },
  blackbirdDemi: { value: 'var(--font-blackbird), system-ui, sans-serif' },
  mdNichrome: { value: 'var(--font-md-nichrome), system-ui, sans-serif' },
};

const breakpoints = {
  sm: { value: '30em' },
  md: { value: '48em' },
  lg: { value: '62em' },
  xl: { value: '75em' },
  '2xl': { value: '96em' },
};

const radii = {
  brand: { value: '10px' },
};

const config = defineConfig({
  globalCss: globalStyles,
  theme: {
    tokens: {
      colors,
      fonts,
      breakpoints,
      radii,
    },
    semanticTokens,
    recipes: {},
    slotRecipes: {},
  },
});

export const system = createSystem(defaultConfig, config);
export default system;
