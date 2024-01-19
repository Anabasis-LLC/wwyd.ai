'use client';

// 3rd party
import { Grid } from '@mantine/core';

// package
import type { Story, User, Image } from '@wwyd/db';

// lib
import { useStories } from '@/hooks';
import { StoryCard } from '@/components/shared';

/**
 * ListStories
 */

export type ListStoriesProps = {
  stories: (Story & { user: User; coverImage: Image })[];
};

export const ListStories = ({ stories }: ListStoriesProps) => {
  const storiesQuery = useStories({ options: { initialData: { stories } } });

  return (
    <Grid py="xl">
      {storiesQuery.response?.stories.map((story) => (
        <Grid.Col key={story.id} span={12} xs={6} md={4}>
          <StoryCard story={story} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
