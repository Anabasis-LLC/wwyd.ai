'use client';

// 3rd party
import { FlexProps, Flex, Box } from '@mantine/core';

/**
 * StoryProgress
 */

export type StoryProgressProps = Omit<FlexProps, 'children'> & {
  progress: number;
};

export const StoryProgress = ({ progress, ...props }: StoryProgressProps) => {
  return (
    <Flex
      w="100%"
      h={8}
      sx={({ colorScheme }) => ({
        backgroundColor:
          colorScheme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
      })}
      {...props}
    >
      <Box w={`${100 * progress}%`} bg="violet" />
    </Flex>
  );
};
