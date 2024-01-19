// 3rd party
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// package
import { db } from '@wwyd/db';

// lib
import {
  generateStoryMetadata,
  getSessionUser,
  createUserStoryChoice,
} from '@/lib/server';
import { ShellPage } from '@/app/shell-page';
import { ReadStory } from '@/components/features/read-story';

/**
 * Params
 */

export type Params = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * metadata
 */

export async function generateMetadata(
  { params: { slug } }: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return generateStoryMetadata({ slug, parent });
}

/**
 * Page: /stories/[slug]
 */

export default async function Page({ params: { slug }, searchParams }: Params) {
  const story = await db.story.findUnique({
    where: { slug },
    include: { coverImage: true },
  });

  if (!story) {
    notFound();
  }

  const sessionUser = await getSessionUser();

  const choice =
    typeof searchParams.choice === 'string'
      ? await db.storyChoice.findUnique({
          where: { uuid: searchParams.choice },
        })
      : null;

  if (sessionUser && choice) {
    const { path } = await createUserStoryChoice({
      userId: sessionUser.id,
      storyId: choice.storyId,
      storyChoiceId: choice.id,
    });

    redirect(`/stories/${story.slug}/${path}?source=landing`);
  }

  return (
    <ShellPage
      sessionUser={sessionUser}
      requireAuthentication={false}
      container={false}
    >
      <ReadStory story={story} />
    </ShellPage>
  );
}
