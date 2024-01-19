// 3rd party
import { NextRequest, NextResponse } from 'next/server';

// package
import { Prisma, db } from '@wwyd/db';

// lib
import {
  CreateStoryChapterRequestSchema,
  CreateStoryChapterResponse,
  ErrorResponse,
} from '@/lib';

/**
 * POST /api/story-chapters
 *
 * Called by `createStoryChapter`.
 */

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateStoryChapterResponse | ErrorResponse>> {
  const result = CreateStoryChapterRequestSchema.safeParse(
    await request.json(),
  );

  if (!result.success) {
    return NextResponse.json(
      { status: 400, message: result.error.message },
      { status: 400 },
    );
  }

  const { storyId, storyEndingId, choices, ...rest } = result.data;

  const create: Prisma.StoryChapterCreateInput = {
    story: { connect: { id: storyId } },
    ...rest,
  };

  // If we're creating the final chapter then connect an ending.
  // Otherwise, create the chapter's choices.
  // Throw an error if we don't have `storyEndingId` or `choices`.
  if (storyEndingId) {
    create.ending = { connect: { id: storyEndingId } };
  } else if (choices) {
    create.choices = {
      createMany: {
        data: choices.map((text) => ({ storyId, number: rest.number, text })),
      },
    };
  } else {
    return NextResponse.json(
      {
        status: 400,
        message: 'You must specify one of: storyEndingId, choices.',
      },
      { status: 400 },
    );
  }

  const chapter = await db.storyChapter.create({
    data: create,
    include: { ending: true, choices: true },
  });

  return NextResponse.json({ chapter });
}
