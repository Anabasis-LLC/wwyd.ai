// local
import { GET, POST } from '../fetch';
import { executeRequest } from '../execute-request';
import {
  GetUserStoryChoiceRequest,
  GetUserStoryChoiceResponseSchema,
  CreateUserStoryChoiceRequest,
  CreateUserStoryChoiceResponseSchema,
} from '../schemas';

/**
 * getUserStoryChoice
 */

export const getUserStoryChoice = ({
  uuid,
  number,
}: GetUserStoryChoiceRequest) =>
  executeRequest({
    request: GET({ path: `/api/stories/${uuid}/user-story-choices/${number}` }),
    schema: GetUserStoryChoiceResponseSchema,
  });

/**
 * createUserStoryChoice
 */

export const createUserStoryChoice = (data: CreateUserStoryChoiceRequest) =>
  executeRequest({
    request: POST({
      path: '/api/user-story-choices',
      body: { type: 'json', data },
    }),
    schema: CreateUserStoryChoiceResponseSchema,
  });
