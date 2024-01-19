// lib
import { ThemeComponent } from '../types';
import { schemeColors } from '../colors';

/**
 * Menu
 */

export const Menu: ThemeComponent = {
  defaultProps: () => ({
    withArrow: true,
  }),
  styles: ({ colorScheme, colors, shadows }) => ({
    dropdown: {
      boxShadow: shadows.sm,
      backgroundColor: schemeColors[colorScheme].menuBackgroundColor,
      borderColor: schemeColors[colorScheme].menuBorderColor,
    },
    arrow: {
      borderColor: schemeColors[colorScheme].menuBorderColor,
    },
    item: {
      fontWeight: 600,
      color: colorScheme === 'dark' ? colors.gray[4] : colors.gray[6],
      '&:active': {
        opacity: 0.75,
      },
    },
  }),
};
