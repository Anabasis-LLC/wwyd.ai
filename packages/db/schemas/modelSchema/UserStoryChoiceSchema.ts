import { z } from 'zod';

/////////////////////////////////////////
// USER STORY CHOICE SCHEMA
/////////////////////////////////////////

export const UserStoryChoiceSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  userId: z.number().int(),
  storyChoiceId: z.number().int(),
  storyId: z.number().int(),
  path: z.string(),
  number: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserStoryChoice = z.infer<typeof UserStoryChoiceSchema>;

export default UserStoryChoiceSchema;
