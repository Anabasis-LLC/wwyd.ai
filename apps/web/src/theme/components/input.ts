// 3rd party
import { MantineTheme } from '@mantine/core';

// lib
import { ThemeComponent } from '../types';
import { schemeColors } from '../colors';
import { constants } from '../constants';

const vars = ({ colors, fontSizes, colorScheme }: MantineTheme) => ({
  default: {
    minHeight: '40px',
    fontSize: fontSizes.md,
    fontWeight: 500,
    color: schemeColors[colorScheme].color,
    backgroundColor: schemeColors[colorScheme].inputBackgroundColor,
    border: 'none',
    boxShadow: `inset 0 0 5px rgba(0, 0, 0, 0.05), 0 0 0 1px ${schemeColors[colorScheme].inputBorderColor}`,
    transition: 'all 0.3s ease-in-out',
  },
  placeholder: {
    color: colors.dark[1],
  },
  // modifiers
  hover: {},
  focus: {
    boxShadow: `0 0 0 3px ${
      colors.secondaryAccent[constants.primaryShade[colorScheme]]
    }`,
  },
  invalid: {
    boxShadow: `0 0 0 3px ${colors.pink[constants.primaryShade[colorScheme]]}`,
  },
  disabled: {
    backgroundColor: schemeColors[colorScheme].inputBackgroundColor,
    opacity: 0.5,
  },
});

// https://mantine.dev/core/input/?t=styles-api
export const InputWrapper: ThemeComponent = {
  styles: ({ colorScheme, colors, fontSizes }) => ({
    label: {
      fontFamily: constants.fonts.sofiaPro,
      fontSize: fontSizes.lg,
      color: schemeColors[colorScheme].color,
      marginBottom: constants.spacing.xs,
    },
    description: {
      fontSize: fontSizes.md,
      lineHeight: 1.5,
      color: schemeColors[colorScheme].dimmedColor,
      marginTop: -5,
      marginBottom: constants.spacing.xs,
    },
    error: {
      fontSize: fontSizes.sm,
      fontWeight: 600,
      color: colors.pink[constants.primaryShade[colorScheme]],
      marginTop: constants.spacing.xs,
    },
  }),
};

// https://mantine.dev/core/text-input/?t=styles-api
export const TextInput: ThemeComponent = {
  styles: (theme) => ({
    input: {
      ...vars(theme).default,
      '&:hover': vars(theme).hover,
      '&:focus': vars(theme).focus,
      '&:disabled, &:disabled:hover, &:read-only': vars(theme).disabled,
      '::placeholder': vars(theme).placeholder,
      '&[data-invalid]': {
        color: vars(theme).default.color,
        '&, :focus': vars(theme).invalid,
        '::placeholder': vars(theme).placeholder,
      },
    },
  }),
};

// https://mantine.dev/core/number-input/?t=styles-api
export const NumberInput = TextInput;

// https://mantine.dev/core/textarea/?t=styles-api
export const Textarea = TextInput;

// https://mantine.dev/core/switch/?t=styles-api
export const Switch: ThemeComponent = {
  styles: (theme) => ({
    track: {
      cursor: 'pointer',
      '&:active': {
        opacity: 0.75,
      },
    },
    label: {
      fontSize: theme.fontSizes.md,
      fontWeight: 500,
    },
  }),
};
