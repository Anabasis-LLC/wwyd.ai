'use client';

// 3rd party
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CacheProvider } from '@emotion/react';
import {
  MantineProvider,
  Container,
  ColorScheme,
  ColorSchemeProvider,
  useEmotionCache,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// lib
import { constants, theme, defaultColorScheme } from '@/theme';

// local
import { ShellHeader } from './shell-header';
import { ShellFooter } from './shell-footer';

/**
 * queryClient
 */

const queryClient = new QueryClient();

/**
 * domColorScheme
 */

const domColorScheme = (): ColorScheme | undefined =>
  typeof document === 'undefined'
    ? undefined
    : document.body.classList.contains('dark')
    ? 'dark'
    : document.body.classList.contains('light')
    ? 'light'
    : undefined;

/**
 * detectColorScheme
 */

const detectColorScheme = (colorScheme?: string): ColorScheme | undefined =>
  colorScheme === 'dark'
    ? 'dark'
    : colorScheme === 'light'
    ? 'light'
    : undefined;

/**
 * Shell
 */

export type ShellProps = {
  initialColorScheme?: string;
  container: boolean;
  header: boolean;
  footer: boolean;
  children: React.ReactNode;
};

export function Shell({
  initialColorScheme,
  container,
  header,
  footer,
  children,
}: ShellProps) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    domColorScheme() ||
      detectColorScheme(initialColorScheme) ||
      defaultColorScheme,
  );

  const toggleColorScheme = (nextColorScheme?: ColorScheme) => {
    if (!nextColorScheme || nextColorScheme === colorScheme) {
      return;
    }

    setColorScheme(nextColorScheme);
    setCookie('color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });

    if (typeof document !== 'undefined') {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(nextColorScheme);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={cache}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme, ...theme }}
          >
            <Notifications position="top-right" zIndex={1002} />
            {header && <ShellHeader />}
            {container ? (
              <Container h="100%" pt={constants.dimensions.headerHeight}>
                {children}
              </Container>
            ) : (
              children
            )}
            {footer && <ShellFooter />}
          </MantineProvider>
        </ColorSchemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
