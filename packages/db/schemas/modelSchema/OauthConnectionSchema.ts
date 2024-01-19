import { z } from 'zod';

/////////////////////////////////////////
// OAUTH CONNECTION SCHEMA
/////////////////////////////////////////

export const OauthConnectionSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  userId: z.number().int(),
  provider: z.string(),
  providerId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  email: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type OauthConnection = z.infer<typeof OauthConnectionSchema>;

export default OauthConnectionSchema;
