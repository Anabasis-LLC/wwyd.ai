'use client';

// 3rd party
import Link from 'next/link';
import { Anchor } from '@mantine/core';

// lib
import { schemeColors, themeColors } from '@/theme';
import { sofiaPro } from '@/components/assets/fonts';
import { FullScreen, Continue } from '@/components/shared';

/**
 * GetStarted
 */

export function GetStarted() {
  return (
    <FullScreen
      pos="relative"
      sx={({ colorScheme }) => ({
        backgroundImage: schemeColors[colorScheme].gradientBackgroundImage,
      })}
    >
      <Anchor
        component={Link}
        href="/"
        prefetch={false}
        pos="absolute"
        top={16}
        left={16}
        size="xl"
        color={themeColors.pureWhite}
        className={sofiaPro.className}
      >
        wwyd?
      </Anchor>
      <Continue />
    </FullScreen>
  );
}
