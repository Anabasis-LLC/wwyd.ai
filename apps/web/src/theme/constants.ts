// 3rd party
import { inter, lora, sofiaPro } from '@/components/assets/fonts';

/**
 * font stacks
 */

const systemFontStack =
  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji';

const systemMonospaceFontStack =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace';

/**
 * constants
 */

export const constants = {
  dimensions: {
    headerHeight: 80,
  },

  fonts: {
    inter: `${inter.style.fontFamily}, ${systemFontStack}`,
    lora: `${lora.style.fontFamily}, ${systemFontStack}`,
    sofiaPro: `${sofiaPro.style.fontFamily}, ${systemFontStack}`,
    monospace: systemMonospaceFontStack,
  },

  // https://github.com/mantinedev/mantine/blob/6.0.6/src/mantine-styles/src/theme/default-theme.ts#L10
  primaryShade: {
    light: 6,
    dark: 8,
  },

  // https://github.com/mantinedev/mantine/blob/6.0.6/src/mantine-styles/src/theme/default-theme.ts#L36
  shadows: {
    xs: 'rgba(0, 0, 0, 0.1) 0px 1px 6px -1px',
    sm: 'rgba(0, 0, 0, 0.1) 0px 1px 6px -1px',
    md: 'rgba(0, 0, 0, 0.1) 0px 2px 10px -1px',
    lg: 'rgba(0, 0, 0, 0.1) 0px 3px 14px -1px',
    xl: 'rgba(0, 0, 0, 0.1) 0px 4px 18px -1px',
  },

  // https://github.com/mantinedev/mantine/blob/6.0.6/src/mantine-styles/src/theme/default-theme.ts#L44
  fontSizes: {
    xs: '12px', // originally: 0.75rem (12px)
    sm: '13px', // originally: 0.875rem (14px)
    md: '14px', // originally: 1rem (16px)
    lg: '16px', // originally: 1.125rem (18px)
    xl: '18px', // originally: 1.25rem (20px)
  },

  // https://github.com/mantinedev/mantine/blob/6.0.6/src/mantine-styles/src/theme/default-theme.ts#L52
  radius: {
    xs: '0.125rem', // 2px
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '1rem', // 16px
    xl: '2rem', // 32px
  },

  // https://github.com/mantinedev/mantine/blob/6.0.6/src/mantine-styles/src/theme/default-theme.ts#L60
  spacing: {
    xs: 10, // 0.625rem (10px)
    sm: 12, // 0.75rem (12px)
    md: 16, // 1rem (16px)
    lg: 20, // 1.25rem (20px)
    xl: 24, // 1.5rem (24px)
  },

  // https://github.com/mantinedev/mantine/blob/6.0.6/src/mantine-styles/src/theme/default-theme.ts#L68
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
  },
};
