// 3rd party
import { NextRequest, NextResponse } from 'next/server';

// package
import { db } from '@wwyd/db';

// lib
import { GetStoryChapterResponse, ErrorResponse } from '@/lib';
import { decodeStoryPath } from '@/lib';

/**
 * GET /api/stories/[uuid]/story-chapters/[path]
 *
 * Called by `getStoryChapter`.
 */

export async function GET(
  request: NextRequest,
  { params: { uuid, path } }: { params: { uuid: string; path: string } },
): Promise<NextResponse<GetStoryChapterResponse | ErrorResponse>> {
  const story = await db.story.findUniqueOrThrow({ where: { uuid } });
  const choiceIds = decodeStoryPath(path);

  const choices = (
    await db.storyChoice.findMany({
      where: { OR: choiceIds.map((id) => ({ id })) },
      orderBy: { number: 'asc' },
      select: { id: true, text: true, summary: true },
    })
  ).filter((choice) => choice.summary !== null) as {
    id: number;
    text: string;
    summary: string;
  }[];

  if (choices.length !== choiceIds.length) {
    return NextResponse.json(
      {
        status: 400,
        message:
          'Invalid path (one or more choices are missing or have a null summary).',
      },
      { status: 400 },
    );
  }

  const { endings } = await db.story.findUniqueOrThrow({
    where: { id: story.id },
    include: { endings: { select: { id: true, text: true } } },
  });

  const chapter = await db.storyChapter.findUnique({
    where: {
      storyId_path: { storyId: story.id, path },
    },
    include: { ending: true, choices: true },
  });

  const prompt = {
    number: choices.length + 1,
    chapterCount: story.chapterCount,
    hook: story.hook,
    tagline: story.tagline,
    choices,
    endings,
  };

  return NextResponse.json({ chapter, prompt });
}
