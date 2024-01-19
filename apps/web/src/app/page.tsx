// package
import { db } from '@wwyd/db';

// lib
import { getSessionUser } from '@/lib/server';
import { ShellPage } from '@/app/shell-page';
import { ListStories } from '@/components/features/list-stories';

/**
 * Page
 */

export default async function Page() {
  const sessionUser = await getSessionUser();

  const stories = await db.story.findMany({
    include: { user: true, coverImage: true },
    take: 30,
  });

  return (
    <ShellPage
      sessionUser={sessionUser}
      requireAuthentication={false}
      footer={!sessionUser}
    >
      <ListStories stories={stories} />
    </ShellPage>
  );
}
