// lib
import { ThemeComponent } from '../types';
import { schemeColors, themeColors } from '../colors';

/**
 * Accordion
 */

export const Accordion: ThemeComponent = {
  defaultProps: () => ({
    variant: 'contained',
    radius: 0,
  }),
  styles: ({ colorScheme }) => ({
    item: {
      borderColor: schemeColors[colorScheme].translucentBorderColor,
      '&[data-active]': {
        backgroundColor: 'transparent',
      },
    },
    control: {
      color: schemeColors[colorScheme].dimmedColor,
      borderLeft: '3px solid transparent',
      '&:hover': {
        backgroundColor: schemeColors[colorScheme].translucentColor,
      },
      '&:active': {
        opacity: 0.75,
      },
      '&[data-active]': {
        color: schemeColors[colorScheme].color,
        backgroundColor: schemeColors[colorScheme].translucentColor,
        borderColor: themeColors.secondaryAccent,
      },
    },
    content: {
      backgroundColor: 'transparent',
      padding: '2rem',
    },
  }),
};
