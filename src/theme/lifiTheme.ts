/**
 * LI.FI Theme - JustFlip Brand Colors
 */

import type { WidgetConfig } from '@lifi/widget';

// JustFlip brand colors
const colors = {
    black: '#101518',
    white: '#fff',
    yellow: '#FFEE00',
    gray: {
        1: '#181D22',
        2: '#1F2429',
        3: '#464D53',
        4: '#737D84',
        5: '#4C535C',
        7: '#2B3237',
    },
    success: '#22C55E',
    error: '#EF4444',
};

export const lifiTheme: WidgetConfig['theme'] = {
    palette: {
        primary: {
            main: colors.yellow,
        },
        secondary: {
            main: colors.gray[3],
        },
        background: {
            default: colors.black,
            paper: colors.gray[1],
        },
        text: {
            primary: colors.white,
            secondary: colors.gray[4],
        },
        grey: {
            200: colors.gray[7],
            300: colors.gray[5],
            700: colors.gray[3],
            800: colors.gray[2],
        },
        success: {
            main: colors.success,
        },
        error: {
            main: colors.error,
        },
    },
    shape: {
        borderRadius: 12,
        borderRadiusSecondary: 8,
    },
    typography: {
        fontFamily: "'Space Grotesk', sans-serif",
    },
    container: {
        border: `1px solid ${colors.gray[7]}`,
        borderRadius: '16px',
    },
};

export default lifiTheme;