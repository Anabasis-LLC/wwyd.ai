// 3rd party
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Group, Anchor } from '@mantine/core';

// local
import { ToggleColorScheme } from './toggle-color-scheme';
import { schemeColors } from '@/theme';

/**
 * ShellFooter
 */

export const ShellFooter = () => {
  const pathname = usePathname();

  return (
    <Group
      pos="fixed"
      bottom={12}
      right={12}
      position="center"
      spacing="xs"
      px={12}
      py={6}
      sx={({ colorScheme, radius }) => ({
        border: `1px solid ${
          pathname === '/get-started'
            ? 'transparent'
            : schemeColors[colorScheme].translucentBorderColor
        }`,
        borderRadius: radius.sm,
        backdropFilter: 'blur(15px)',
      })}
    >
      <Anchor component={Link} href="/terms" prefetch={false} size="xs">
        Terms
      </Anchor>
      <Anchor component={Link} href="/privacy" prefetch={false} size="xs">
        Privacy
      </Anchor>
      <ToggleColorScheme />
    </Group>
  );
};
