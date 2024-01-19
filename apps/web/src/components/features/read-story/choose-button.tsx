// 3rd party
import { MouseEventHandler } from 'react';
import { ButtonProps, Button, Title, Text, Tooltip } from '@mantine/core';
import { FaArrowRight } from 'react-icons/fa6';

// package
import type { StoryChoice } from '@wwyd/db';

// lib
import { themeColors } from '@/theme';

/**
 * ChooseButton
 */

export type ChooseButtonProps = Omit<ButtonProps, 'children'> & {
  choice: StoryChoice;
  currentChoice?: StoryChoice;
  selectedChoice?: StoryChoice;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const ChooseButton = ({
  choice,
  onClick,
  currentChoice,
  selectedChoice,
  ...props
}: ChooseButtonProps) => {
  const isCurrent = currentChoice?.id === choice.id;
  const isPending = typeof selectedChoice === 'undefined';
  const isChosen = selectedChoice?.id === choice.id;
  const isSkipped = !isPending && !isChosen;

  return (
    <Button
      color="blackAlpha.0"
      size="xl"
      leftIcon={
        isCurrent ? (
          <Tooltip
            label={
              <Text size="sm" fw={600}>
                This was your choice previously.
              </Text>
            }
            color="dark"
            position="top"
            withArrow
          >
            <FaArrowRight color="rgba(255, 255, 255, 0.5)" />
          </Tooltip>
        ) : (
          <FaArrowRight color="rgba(255, 255, 255, 0.25)" />
        )
      }
      radius={0}
      pos="relative"
      miw={300}
      bg="transparent"
      onClick={onClick}
      disabled={isSkipped}
      loading={isChosen}
      loaderPosition="center"
      fullWidth
      styles={({ spacing }) => ({
        root: {
          height: 'auto',
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
          color: themeColors.pureWhite,
          '&[data-disabled]': { color: themeColors.pureWhite },
        },
        inner: {
          justifyContent: 'flex-start',
        },
        label: {
          whiteSpace: 'normal',
        },
      })}
      {...props}
    >
      <Title order={5}>{choice.text}</Title>
    </Button>
  );
};
