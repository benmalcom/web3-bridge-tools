/**
 * Theme Constants
 * Use these instead of hardcoded colors
 */

export const colors = {
    // Brand
    primary: '#FFEE00',

    // Backgrounds
    bg: {
        page: '#0A0C0E',
        card: '#101518',
        elevated: '#1A1D21',
    },

    // Text
    text: {
        primary: '#FFFFFF',
        secondary: '#788690',
        muted: '#464D53',
    },

    // Status
    status: {
        success: '#22C55E',
        warning: '#F97316',
        error: '#EF4444',
        info: '#3B82F6',
    },

    // Border
    border: {
        default: 'rgba(255, 255, 255, 0.1)',
        hover: '#FFEE00',
    },

    // Provider colors
    provider: {
        relay: '#FFEE00',
        lifi: '#9F7AEA',
    },
} as const;

// Common component styles
export const cardStyle = {
    bg: colors.bg.card,
    borderRadius: '12px',
    border: `1px solid ${colors.border.default}`,
};

export const buttonPrimaryStyle = {
    bg: colors.primary,
    color: 'black',
    _hover: { opacity: 0.9 },
};