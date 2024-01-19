// 3rd party
import type { MantineThemeOverride, ColorScheme } from '@mantine/core';

// lib
import * as components from './components';
import { themeColors, customMantineColors } from './colors';
import { constants } from './constants';

/**
 * theme
 *
 * https://mantine.dev/theming/theme-object/
 * https://mantine.dev/theming/colors/#colors-index-reference
 */

export const theme: MantineThemeOverride = {
  colors: customMantineColors,
  fontFamily: constants.fonts.inter,
  shadows: constants.shadows,
  fontSizes: constants.fontSizes,
  headings: { fontFamily: constants.fonts.sofiaPro },
  globalStyles: () => ({
    '::selection': {
      color: themeColors.white,
      background: themeColors.fuschia,
    },
    // This doesn't work with server components so it's been added to
    // globals.css.
    //
    // body: {},
    // 'body.dark': {},
  }),
  components,
};

/**
 * defaultColorScheme
 *
 * https://mantine.dev/guides/dark-theme/
 */

export const defaultColorScheme: ColorScheme = 'dark';
