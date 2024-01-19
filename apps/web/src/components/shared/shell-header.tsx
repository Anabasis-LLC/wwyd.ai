'use client';

// 3rd party
import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  BoxProps,
  Container,
  Group,
  Avatar,
  Menu,
  Anchor,
  Button,
  useMantineColorScheme,
} from '@mantine/core';
import { FaSun, FaMoon, FaRightFromBracket } from 'react-icons/fa6';

// lib
import { useSessionUser } from '@/hooks/use-session-user';
import { schemeColors, constants } from '@/theme';

// local
import { sofiaPro } from '../assets/fonts';

/**
 * Header
 */

export type ShellHeaderProps = Omit<
  BoxProps,
  'pos' | 'w' | 'h' | 'sx' | 'children'
>;

export function ShellHeader(props: ShellHeaderProps) {
  const pathname = usePathname();
  const user = useSessionUser();

  const onSignOut = useCallback(async () => {
    signOut().finally(() => (window.location.href = '/'));
  }, []);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      pos="fixed"
      w="100%"
      h={constants.dimensions.headerHeight}
      sx={({ colorScheme }) => ({
        zIndex: 2,
        backgroundColor: schemeColors[colorScheme].headerBackgroundColor,
        backdropFilter: 'blur(15px)',
      })}
      {...props}
    >
      <Container>
        <Group position="apart" h={constants.dimensions.headerHeight} noWrap>
          <Anchor
            component={Link}
            href="/"
            prefetch={false}
            size="lg"
            tt="uppercase"
            className={sofiaPro.className}
            color={colorScheme === 'dark' ? 'whiteAlpha.9' : 'blackAlpha.9'}
          >
            What would you do?
          </Anchor>
          <Group noWrap>
            {user ? (
              <>
                {pathname !== '/stories/new' && (
                  <Button
                    component={Link}
                    href="/stories/new"
                    prefetch={false}
                    variant="gradient"
                    gradient={schemeColors[colorScheme].gradient}
                  >
                    Create Story
                  </Button>
                )}
                <Menu position="bottom-end">
                  <Menu.Target>
                    <Anchor>
                      <Avatar
                        src={user.avatarUrl}
                        radius="xl"
                        imageProps={{ referrerPolicy: 'no-referrer' }}
                      />
                    </Anchor>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={
                        isDark ? (
                          <FaSun color="#ffec99" />
                        ) : (
                          <FaMoon color="#7048e8" />
                        )
                      }
                      onClick={() =>
                        toggleColorScheme(isDark ? 'light' : 'dark')
                      }
                    >
                      Dark Mode
                    </Menu.Item>
                    <Menu.Item
                      icon={<FaRightFromBracket />}
                      onClick={onSignOut}
                    >
                      Sign Out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : pathname !== '/get-started' ? (
              <Button
                component={Link}
                href="/get-started"
                prefetch={false}
                variant="gradient"
                gradient={schemeColors[colorScheme].gradient}
              >
                Get Started
              </Button>
            ) : null}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
