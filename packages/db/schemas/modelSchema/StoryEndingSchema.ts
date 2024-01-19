import { z } from 'zod';

/////////////////////////////////////////
// STORY ENDING SCHEMA
/////////////////////////////////////////

export const StoryEndingSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  storyId: z.number().int(),
  text: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type StoryEnding = z.infer<typeof StoryEndingSchema>;

export default StoryEndingSchema;
