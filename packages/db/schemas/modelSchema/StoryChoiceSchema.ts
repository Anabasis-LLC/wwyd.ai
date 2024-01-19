import { z } from 'zod';

/////////////////////////////////////////
// STORY CHOICE SCHEMA
/////////////////////////////////////////

export const StoryChoiceSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  storyId: z.number().int(),
  chapterId: z.number().int(),
  number: z.number().int(),
  text: z.string(),
  summary: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type StoryChoice = z.infer<typeof StoryChoiceSchema>;

export default StoryChoiceSchema;
