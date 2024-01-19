// 3rd party
import {
  QueryKey,
  FetchStatus,
  useQueryClient,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';

// lib
import {
  ExecuteRequestResult,
  GetStoriesResponse,
  getStories,
  CreateStoryRequest,
  createStory,
  GetStoryChapterResponse,
  getStoryChapter,
  GetUserStoryChoiceResponse,
  getUserStoryChoice,
} from '@/lib';

/**
 * Types
 */

export type QueryOptions<T> = {
  retry?: boolean;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  initialData?: T;
  onError?: (error: Error) => void;
};

export type CachedQueryOptions<T> = QueryOptions<T> & {
  checkCache?: QueryKey;
};

export type QueryResult<T> =
  | {
      isLoading: true;
      isError: undefined;
      fetchStatus: FetchStatus;
      response: undefined;
    }
  | {
      isLoading: false;
      isError: true;
      fetchStatus: FetchStatus;
      response: undefined;
    }
  | { isLoading: false; isError: false; fetchStatus: FetchStatus; response: T };

/**
 * asQueryFn
 */

async function asQueryFn<T extends object>(
  requestFn: () => ExecuteRequestResult<T>,
) {
  const { ok, val } = await requestFn();

  if (ok === true) {
    return val;
  } else {
    throw val.error;
  }
}

/**
 * useApi
 */

export type UseApiQueryOptions<T> = QueryOptions<T> & {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
};

export function useApi<T>({
  retry = false,
  refetchOnWindowFocus = false,
  staleTime = 60_000,
  onError = ({ message }: Error) =>
    showNotification({ message, color: 'pink' }),
  ...options
}: UseApiQueryOptions<T>): QueryResult<T> {
  const query = useQuery({
    retry,
    refetchOnWindowFocus,
    staleTime,
    onError,
    ...options,
  });

  if (query.isLoading) {
    return {
      isLoading: true,
      isError: undefined,
      fetchStatus: query.fetchStatus,
      response: undefined,
    };
  } else if (query.isSuccess) {
    return {
      isLoading: false,
      isError: false,
      fetchStatus: query.fetchStatus,
      response: query.data,
    };
  } else {
    return {
      isLoading: false,
      isError: true,
      fetchStatus: query.fetchStatus,
      response: undefined,
    };
  }
}

/**
 * useStories
 */

export type UseStories = {
  options?: QueryOptions<GetStoriesResponse>;
};

export const useStories = ({ options = {} }: UseStories = {}) =>
  useApi({
    queryKey: ['Story'],
    queryFn: () => asQueryFn(getStories),
    ...options,
  });

/**
 * useCreateStory
 *
 * TODO: DRY this up when a second mutation is added.
 */

export const useCreateStory = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateStoryRequest) =>
      asQueryFn(() => createStory(request)),
    onSuccess: () => client.invalidateQueries({ queryKey: ['Story'] }),
    onError: ({ message }: Error) =>
      showNotification({ message, color: 'pink' }),
  });
};

/**
 * useStoryChapter
 */

export type UseStoryChapter = {
  uuid: string;
  path: string;
  options?: QueryOptions<GetStoryChapterResponse>;
};

export const useStoryChapter = ({
  uuid,
  path,
  options = {},
}: UseStoryChapter) =>
  useApi({
    queryKey: ['StoryChapter', { uuid, path }],
    queryFn: () => asQueryFn(() => getStoryChapter({ uuid, path })),
    ...options,
  });

/**
 * useUserStoryChoice
 */

export type UseUserStoryChoice = {
  uuid: string;
  number: number;
  options?: QueryOptions<GetUserStoryChoiceResponse>;
};

export const useUserStoryChoice = ({
  uuid,
  number,
  options = {},
}: UseUserStoryChoice) =>
  useApi({
    queryKey: ['UserStoryChoice', { uuid, number }],
    queryFn: () => asQueryFn(() => getUserStoryChoice({ uuid, number })),
    ...options,
  });
