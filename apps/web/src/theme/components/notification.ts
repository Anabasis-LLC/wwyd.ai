// lib
import { ThemeComponent } from '../types';

/**
 * Notification
 */

export const Notification: ThemeComponent = {
  styles: ({ colorScheme, colors, shadows }) => ({
    // https://mantine.dev/core/notification/?t=styles-api
    root: {
      fontWeight: 500,
      border: `1px solid ${
        colorScheme === 'dark' ? colors.blackAlpha[7] : colors.blackAlpha[3]
      }`,
      boxShadow: shadows.sm,
    },
  }),
};
