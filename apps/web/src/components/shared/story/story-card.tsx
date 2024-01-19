'use client';

// 3rd party
import { FocusEventHandler } from 'react';
import Link from 'next/link';
import {
  UnstyledButton,
  CardProps,
  Card,
  Stack,
  Box,
  Skeleton,
  Title,
  Text,
  BackgroundImage,
  Avatar,
  Tooltip,
  createStyles,
} from '@mantine/core';

// lib
import { cdnUrl } from '@/lib';
import { lora } from '@/components/assets/fonts';

/**
 * useStyles
 */

const useStyles = createStyles(() => ({
  button: {
    position: 'relative',
    '&:active': {
      top: 1,
    },
  },
  image: {
    '&:hover': {
      opacity: 0.8,
    },
  },
}));

/**
 * StoryCard
 */

export type StoryCardProps = Omit<CardProps, 'children'> & {
  story: {
    slug?: string;
    title?: string;
    tagline?: string;
    coverImage?: { key: string; width: number | null; height: number | null };
    user?: { name: string; avatarUrl?: string | null };
  };
  contentEditable?: boolean;
  onTitleChanged?: FocusEventHandler<HTMLDivElement>;
  onTaglineChanged?: FocusEventHandler<HTMLDivElement>;
};

export const StoryCard = ({
  story: { slug, title, tagline, coverImage, user },
  contentEditable,
  onTitleChanged,
  onTaglineChanged,
  ...props
}: StoryCardProps) => {
  const { classes } = useStyles();

  const card = (
    <Card shadow="xs" withBorder {...props}>
      <Card.Section pos="relative" sx={{ overflow: 'hidden' }}>
        {coverImage ? (
          <BackgroundImage
            h={250}
            src={cdnUrl(coverImage.key)}
            className={classes.image}
          />
        ) : (
          <Skeleton
            h={250}
            sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          />
        )}
        {user?.avatarUrl && (
          <Tooltip
            label={
              <Text size="sm" fw={600}>
                Author: @{user.name}
              </Text>
            }
            color="dark"
            position="left"
            withArrow
          >
            <Avatar
              pos="absolute"
              top={8}
              right={8}
              src={user.avatarUrl}
              size="sm"
              radius="lg"
            />
          </Tooltip>
        )}
        <Box
          pos="absolute"
          bottom={0}
          left={0}
          w="100%"
          p="xs"
          bg="blackAlpha.5"
        >
          <Title
            order={5}
            c="white"
            contentEditable={contentEditable}
            suppressContentEditableWarning
            onBlur={onTitleChanged}
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Title>
        </Box>
      </Card.Section>
      <Stack spacing="xs" mt="sm">
        <Text
          size="sm"
          h={40}
          fw={600}
          contentEditable={contentEditable}
          suppressContentEditableWarning
          onBlur={onTaglineChanged}
          className={lora.className}
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {tagline}
        </Text>
      </Stack>
    </Card>
  );

  return slug ? (
    <UnstyledButton
      component={Link}
      href={`/stories/${slug}`}
      prefetch={false}
      className={classes.button}
    >
      {card}
    </UnstyledButton>
  ) : (
    card
  );
};
