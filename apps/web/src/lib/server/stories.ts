// package
import { db } from '@wwyd/db';

// lib
import { generateChoiceSummary, encodeStoryChoiceIds } from '@/lib';

/**
 * createUserStoryChoice
 */

export const createUserStoryChoice = async ({
  userId,
  storyId,
  storyChoiceId,
}: {
  userId: number;
  storyId: number;
  storyChoiceId: number;
}) => {
  const storyChoice = await db.storyChoice.findUniqueOrThrow({
    where: { id: storyChoiceId },
    include: { chapter: true },
  });

  // Generate the summary for this choice if it hasn't already been generated.
  if (!storyChoice.summary) {
    const summary: string = (
      await generateChoiceSummary({
        chapter: storyChoice.chapter.text,
        choice: storyChoice.text,
      })
    ).text;

    await db.storyChoice.update({
      where: { id: storyChoiceId },
      data: { summary },
      include: { chapter: true },
    });
  }

  const { number } = storyChoice;

  // If the user has already made a choice for this chapter number then
  // delete it along with all of the choices that follow this choice (unless
  // the existing choice is the same as the new choice).
  const existingChoice = await db.userStoryChoice.findUnique({
    where: { userId_storyId_number: { userId, storyId, number } },
    include: { story: true, choice: true },
  });

  if (existingChoice) {
    if (existingChoice.storyChoiceId === storyChoiceId) {
      return existingChoice;
    }

    await db.userStoryChoice.deleteMany({
      where: { storyId, number: { gte: number } },
    });
  }

  const userStoryChoices = await db.userStoryChoice.findMany({
    where: { storyId, userId, number: { lte: number } },
    orderBy: { number: 'asc' },
  });

  return await db.userStoryChoice.create({
    data: {
      path: encodeStoryChoiceIds(
        userStoryChoices
          .map(({ storyChoiceId }) => storyChoiceId)
          .concat([storyChoiceId]),
      ),
      number,
      user: { connect: { id: userId } },
      story: { connect: { id: storyId } },
      choice: { connect: { id: storyChoiceId } },
    },
    include: { story: true, choice: true },
  });
};
