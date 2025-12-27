/**
 * RelayKit Theme - JustFlip Brand Colors
 */

import type { RelayKitTheme } from '@relayprotocol/relay-kit-ui';

// JustFlip brand colors (from Chakra theme)
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
        6: '#6C757D',
        7: '#2B3237',
        8: '#535B63',
    },
    highlight: '#252B30',
    // Status colors
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F97316',
};

export const relayTheme: RelayKitTheme = {
    // Font
    font: "'Space Grotesk', sans-serif",

    // Primary accent color (JustFlip yellow)
    primaryColor: colors.yellow,
    focusColor: '#E6D700',

    // Subtle backgrounds/borders
    subtleBackgroundColor: colors.gray[2],
    subtleBorderColor: colors.gray[3],

    // Text colors
    text: {
        default: colors.white,
        subtle: colors.gray[4],
        error: colors.error,
        success: colors.success,
    },

    // Input - light background so text is visible
    input: {
        background: colors.gray[2],
        borderRadius: '12px',
        color: colors.white,
    },

    // Buttons
    buttons: {
        primary: {
            color: colors.black,
            background: colors.yellow,
            hover: {
                color: colors.black,
                background: '#E6D700',
            },
        },
        secondary: {
            color: colors.white,
            background: colors.gray[7],
            hover: {
                color: colors.white,
                background: colors.gray[5],
            },
        },
        tertiary: {
            color: colors.white,
            background: colors.gray[2],
            hover: {
                color: colors.white,
                background: colors.gray[3],
            },
        },
        disabled: {
            color: colors.gray[5],
            background: colors.gray[7],
        },
    },

    // Widget container
    widget: {
        background: colors.black,
        borderRadius: '16px',
        card: {
            background: colors.gray[1],
            borderRadius: '12px',
            border: `1px solid ${colors.gray[7]}`,
            gutter: '12px',
        },
        selector: {
            background: colors.gray[2],
            hover: {
                background: colors.highlight,
            },
        },
        swapCurrencyButtonBorderColor: colors.gray[5],
        swapCurrencyButtonBorderWidth: '1px',
        swapCurrencyButtonBorderRadius: '12px',
    },

    // Modal
    modal: {
        background: colors.gray[1],
        border: `1px solid ${colors.gray[7]}`,
        borderRadius: '16px',
    },

    // Dropdown
    dropdown: {
        background: colors.gray[1],
        borderRadius: '12px',
        border: `1px solid ${colors.gray[7]}`,
    },

    // Skeleton loading
    skeleton: {
        background: colors.gray[3],
    },

    // Links
    anchor: {
        color: colors.yellow,
        hover: {
            color: '#E6D700',
        },
    },
};

export default relayTheme;