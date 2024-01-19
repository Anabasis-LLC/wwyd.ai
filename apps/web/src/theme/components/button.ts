// lib
import { ThemeComponent } from '../types';
import { schemeColors, themeColors, isMantineColor, alpha } from '../colors';
import { constants } from '../constants';

/**
 * Button
 */

// https://mantine.dev/core/button/?t=styles-api
export const Button: ThemeComponent = {
  defaultProps: () => ({
    size: 'md',
    radius: 'xl',
    loaderPosition: 'left',
  }),
  styles: ({ colorScheme }) => ({
    root: {
      fontFamily: constants.fonts.sofiaPro,
      '&[data-disabled]': {
        backgroundColor:
          colorScheme === 'dark'
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(0, 0, 0, 0.25)',
        color: schemeColors[colorScheme].color,
        opacity: 0.25,
        cursor: 'not-allowed',
        pointerEvents: 'auto',
      },
    },
  }),
  variants: {
    filled: (_theme, props) => ({
      root: {
        color:
          props.color === 'primaryAccent'
            ? themeColors.primaryAccentComplement
            : props.color === 'secondaryAccent'
            ? themeColors.secondaryAccentComplement
            : undefined,
      },
    }),
    light: ({ colorScheme, colors }, props) => ({
      root: {
        backgroundColor: alpha(
          colors[props.color][constants.primaryShade[colorScheme]],
          0.25,
        ),
      },
    }),
    subtle: ({ colorScheme, colors }, props) => ({
      root: {
        '&:hover': {
          backgroundColor: alpha(
            colors[props.color][constants.primaryShade[colorScheme]],
            0.25,
          ),
        },
      },
    }),
    outline: ({ colorScheme }, props) => ({
      root: {
        color: !isMantineColor(props.color)
          ? schemeColors[colorScheme].color
          : undefined,
        borderWidth: '3px',
      },
    }),
    gradient: () => ({
      root: {
        color: '#fff !important',
        textShadow: '0 1px 0px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
};
