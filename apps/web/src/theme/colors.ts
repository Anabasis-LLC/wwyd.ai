// 3rd party
import {
  MantineThemeColorsOverride,
  MantineGradient,
  Tuple,
  ColorScheme,
} from '@mantine/core';
import { TinyColor, ColorInput } from '@ctrl/tinycolor';

/**
 * lighten
 */

export const lighten = (input: ColorInput, amount: number) =>
  new TinyColor(input).lighten(amount).toHexString();

/**
 * darken
 */

export const darken = (input: ColorInput, amount: number) =>
  new TinyColor(input).darken(amount).toHexString();

/**
 * brighten
 */

export const brighten = (input: ColorInput, amount: number) =>
  new TinyColor(input).brighten(amount).toRgbString();

/**
 * shade
 */

export const shade = (input: ColorInput, amount: number) =>
  new TinyColor(input).shade(amount).toRgbString();

/**
 * alpha
 */

export const alpha = (input: ColorInput, alpha: number) => {
  const color = new TinyColor(input);
  color.setAlpha(alpha);
  return color.toRgbString();
};

/**
 * palette
 */

export function palette(input: ColorInput, step = 4): Tuple<string, 10> {
  return [
    lighten(input, 8 * step),
    lighten(input, 7 * step),
    lighten(input, 6 * step),
    lighten(input, 5 * step),
    lighten(input, 4 * step),
    lighten(input, 3 * step),
    lighten(input, 2 * step),
    lighten(input, 1 * step),
    lighten(input, 0 * step),
    darken(input, 1 * step),
  ];
}

/**
 * repeatPalette
 */

export function repeatPalette(input: ColorInput): Tuple<string, 10> {
  const color = new TinyColor(input).toRgbString();
  return [color, color, color, color, color, color, color, color, color, color];
}

/**
 * color constants
 */

export const $pureWhite = 'rgb(255, 255, 255)';
export const $pureBlack = 'rgb(0, 0, 0)';
export const $white = 'rgb(238, 238, 238)';
export const $black = 'rgb(14, 13, 20)';
export const $razzmatazz = '#ff0050';
export const $brightTurquoise = '#00f2ea';
export const $fuschia = '#f81ce5';
export const $emerald = '#50c878';

/**
 * schemeColors
 *
 * Colors that changed based on the `ColorScheme` (light or dark).
 */

export type SchemeColors = {
  color: string;
  backgroundColor: string;
  translucentColor: string;
  translucentBorderColor: string;
  dimmedColor: string;
  gradient: MantineGradient;
  gradientBackgroundImage: string;
  headerBackgroundColor: string;
  inputBackgroundColor: string;
  inputBorderColor: string;
  menuBackgroundColor: string;
  menuBorderColor: string;
};

export const schemeColors: Record<ColorScheme, SchemeColors> = {
  light: {
    color: $black,
    backgroundColor: $pureWhite,
    translucentColor: 'rgba(0, 0, 0, 0.025)',
    translucentBorderColor: 'rgba(0, 0, 0, 0.1)',
    dimmedColor: '#868e96', // gray.6
    gradient: { from: 'rgb(255, 148, 114)', to: 'rgb(242, 112, 156)' },
    gradientBackgroundImage:
      'linear-gradient(45deg, rgb(255, 148, 114), rgb(242, 112, 156))',
    headerBackgroundColor: 'rgba(0, 0, 0, 0.025)',
    inputBackgroundColor: $pureWhite,
    inputBorderColor: 'rgba(0, 0, 0, .2)',
    menuBackgroundColor: $pureWhite,
    menuBorderColor: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    color: $white,
    backgroundColor: $black,
    translucentColor: 'rgba(24, 23, 30, 0.2)',
    translucentBorderColor: 'rgba(24, 23, 30, 1.0)',
    dimmedColor: '#909296', // dark.2
    gradient: { from: 'rgb(139, 59, 210)', to: 'rgb(47, 30, 152)' },
    gradientBackgroundImage:
      'linear-gradient(45deg, rgb(139, 59, 210), rgb(47, 30, 152))',
    headerBackgroundColor: 'rgba(255, 255, 255, 0.025)',
    inputBackgroundColor: 'rgb(24, 23, 30)',
    inputBorderColor: 'rgba(255, 255, 255, 0.1)',
    menuBackgroundColor: 'rgb(24, 23, 30)',
    menuBorderColor: 'rgba(255, 255, 255, 0.05)',
  },
};

/**
 * themeColors
 *
 * Colors that are constant irrespective of the `ColorScheme`.
 */

export type ThemeColors = {
  primaryAccent: string;
  primaryAccentComplement: string;
  secondaryAccent: string;
  secondaryAccentComplement: string;
  pureWhite: string;
  white: string;
  pureBlack: string;
  black: string;
  razzmatazz: string;
  brightTurquoise: string;
  fuschia: string;
  emerald: string;
  facebook: string;
  google: string;
  discord: string;
  twitter: string;
};

export const themeColors: Record<keyof ThemeColors, string> = {
  primaryAccent: $razzmatazz,
  primaryAccentComplement: lighten($razzmatazz, 45),
  secondaryAccent: $brightTurquoise,
  secondaryAccentComplement: darken($brightTurquoise, 20),
  pureWhite: $pureWhite,
  white: $white,
  pureBlack: $pureBlack,
  black: $black,
  razzmatazz: $razzmatazz,
  brightTurquoise: $brightTurquoise,
  fuschia: $fuschia,
  emerald: $emerald,
  facebook: '#1877f2',
  google: '#4285f4',
  discord: '#5865f2',
  twitter: '#1da1f2',
};

/**
 * customMantineColors
 */

export const customMantineColors: MantineThemeColorsOverride = {
  primaryAccent: palette(themeColors.primaryAccent),
  secondaryAccent: palette(themeColors.secondaryAccent),

  whiteAlpha: [
    'rgba(255, 255, 255, 0.04)',
    'rgba(255, 255, 255, 0.06)',
    'rgba(255, 255, 255, 0.08)',
    'rgba(255, 255, 255, 0.16)',
    'rgba(255, 255, 255, 0.24)',
    'rgba(255, 255, 255, 0.36)',
    'rgba(255, 255, 255, 0.48)',
    'rgba(255, 255, 255, 0.64)',
    'rgba(255, 255, 255, 0.80)',
    'rgba(255, 255, 255, 0.92)',
  ],

  blackAlpha: [
    'rgba(0, 0, 0, 0.04)',
    'rgba(0, 0, 0, 0.06)',
    'rgba(0, 0, 0, 0.08)',
    'rgba(0, 0, 0, 0.16)',
    'rgba(0, 0, 0, 0.24)',
    'rgba(0, 0, 0, 0.36)',
    'rgba(0, 0, 0, 0.48)',
    'rgba(0, 0, 0, 0.64)',
    'rgba(0, 0, 0, 0.80)',
    'rgba(0, 0, 0, 0.92)',
  ],

  facebook: repeatPalette(themeColors.facebook),
  google: repeatPalette(themeColors.google),
  discord: repeatPalette(themeColors.discord),
  twitter: repeatPalette(themeColors.twitter),
};

/**
 * MantineColor
 */

export type MantineColor = (typeof mantineColors)[number];

export const mantineColors = [
  'dark',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'green',
  'lime',
  'yellow',
  'orange',
  'teal',
] as const;

const mantineColorSet = new Set(mantineColors);

/**
 * isMantineColor
 */

export const isMantineColor = (
  color?: MantineColor | string,
): color is MantineColor => mantineColorSet.has(<MantineColor>color);
