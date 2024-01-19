// lib
import { ThemeComponent } from '../types';

/**
 * Anchor
 */

export const Anchor: ThemeComponent = {
  defaultProps: () => ({
    color: 'violet',
    weight: 600,
  }),
  styles: () => ({
    root: {
      '&:hover': {
        textDecoration: 'none',
        opacity: 0.8,
      },
      '&:active': {
        opacity: 0.6,
      },
    },
  }),
};
