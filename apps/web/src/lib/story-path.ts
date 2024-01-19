// 3rd party
import { Base64 } from 'js-base64';
import { z } from 'zod';

// package
import type { StoryChoice, UserStoryChoice } from '@wwyd/db';

/**
 * StoryPath
 */

export const storyPathSchema = z.array(z.number());

export type StoryPath = z.infer<typeof storyPathSchema>;

/**
 * encodeStoryChoices
 */

export const encodeStoryChoices = (storyChoices: StoryChoice[]) =>
  encodeStoryChoiceIds(storyChoices.map(({ id }) => id));

/**
 * encodeUserStoryChoices
 */

export const encodeUserStoryChoices = (userStoryChoices: UserStoryChoice[]) =>
  encodeStoryChoiceIds(
    userStoryChoices.map(({ storyChoiceId }) => storyChoiceId),
  );

/**
 * encodeStoryChoiceIds
 */

export const encodeStoryChoiceIds = (storyChoiceIds: number[]) =>
  Base64.encode(JSON.stringify(storyChoiceIds), true);

/**
 * decodeStoryPath
 */

export const decodeStoryPath = (path: string) => {
  const object = JSON.parse(Base64.decode(path));
  const result = storyPathSchema.safeParse(object);

  if (result.success) {
    return result.data;
  } else {
    throw new Error('Invalid story path.');
  }
};
