// lib
import { ThemeComponent } from '../types';
import { schemeColors } from '../colors';

/**
 * Card
 */

export const Card: ThemeComponent = {
  defaultProps: () => ({
    bg: 'transparent',
  }),
  styles: ({ colorScheme }) => ({
    root: {
      border: `1px solid ${schemeColors[colorScheme].translucentBorderColor} !important`,
    },
  }),
};
