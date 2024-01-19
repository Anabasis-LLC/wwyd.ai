// local
import { GET, POST } from '../fetch';
import { executeRequest } from '../execute-request';
import {
  GetStoriesResponseSchema,
  CreateStoryRequest,
  CreateStoryResponseSchema,
} from '../schemas';

/**
 * getStories
 */

export const getStories = () =>
  executeRequest({
    request: GET({ path: '/api/stories' }),
    schema: GetStoriesResponseSchema,
  });

/**
 * createStory
 */

export const createStory = (data: CreateStoryRequest) =>
  executeRequest({
    request: POST({ path: '/api/stories', body: { type: 'json', data } }),
    schema: CreateStoryResponseSchema,
  });
