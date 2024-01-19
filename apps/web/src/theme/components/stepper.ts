// lib
import { ThemeComponent } from '../types';
import { schemeColors } from '../colors';

/**
 * Stepper
 */

export const Stepper: ThemeComponent = {
  defaultProps: () => ({
    color: 'gray.5',
    size: 'xs',
  }),
  styles: ({ colorScheme }) => ({
    // https://mantine.dev/core/stepper/?t=styles-api
    stepIcon: {
      border: 0,
      backgroundColor: 'transparent',
      '&[data-progress]': {
        backgroundColor: 'transparent',
      },
      '&[data-completed]': {
        backgroundColor: 'transparent',
      },
    },
    stepCompletedIcon: {
      color: 'transparent',
    },
    stepBody: {
      marginLeft: 5,
      marginTop: 5,
    },
    stepLabel: {
      color: schemeColors[colorScheme].dimmedColor,
    },
  }),
};
