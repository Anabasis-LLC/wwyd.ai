'use client';

// 3rd party
import {
  BoxProps,
  Box,
  Stack,
  Text,
  Transition,
  Skeleton,
  useMantineColorScheme,
  packSx,
} from '@mantine/core';

// lib
import { lora } from '@/components/assets/fonts';

/**
 * StoryPage
 */

export type StoryPageProps = Omit<BoxProps, 'children'> & {
  text: React.ReactNode;
  loading?: boolean;
  animationDelay?: number;
};

export const StoryPage = ({
  text,
  loading = false,
  sx,
  ...props
}: StoryPageProps) => {
  const { colorScheme } = useMantineColorScheme();
  const opacity = colorScheme === 'dark' ? 0.1 : 0.5;

  return (
    <Box
      pos="relative"
      w="100%"
      mih={300}
      className={lora.className}
      sx={[{ whiteSpace: 'pre-wrap', overflowY: 'auto' }, ...packSx(sx)]}
      {...props}
    >
      <Transition mounted={loading} transition="fade" exitDuration={250}>
        {(style) => (
          <Stack
            pos="absolute"
            top={0}
            left={0}
            w="100%"
            spacing={24}
            style={style}
          >
            <Skeleton w={100} h={26} opacity={opacity} />
            <Skeleton w="100%" h={250} opacity={opacity} />
          </Stack>
        )}
      </Transition>
      <Transition mounted={!loading} transition="fade" duration={500}>
        {(style) => (
          <Text size="xl" className={lora.className} style={style}>
            {text}
          </Text>
        )}
      </Transition>
    </Box>
  );
};
