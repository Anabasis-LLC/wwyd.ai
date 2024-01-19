'use client';

// 3rd party
import {
  ActionIconProps,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { FaSun, FaMoon } from 'react-icons/fa6';

/**
 * ToggleColorScheme
 */

export type ToggleColorSchemeProps = Omit<
  ActionIconProps,
  'children' | 'onClick'
>;

export function ToggleColorScheme(props: ToggleColorSchemeProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="transparent"
      color={isDark ? 'yellow' : 'violet'}
      onClick={() => toggleColorScheme(isDark ? 'light' : 'dark')}
      {...props}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </ActionIcon>
  );
}
