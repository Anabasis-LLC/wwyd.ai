'use client';

// 3rd party
import { useState, useEffect, useRef, useCallback } from 'react';
import { showNotification } from '@mantine/notifications';

// package
import {
  Story,
  StoryChapter,
  StoryEnding,
  StoryChoice,
  UserStoryChoice,
  Image,
} from '@wwyd/db';

// lib
import {
  ChapterPrompt,
  generateChapter,
  createStoryChapter,
  isChapterStreamable,
  parseChapter,
  encodeStoryChoices,
} from '@/lib';
import { useSessionUser, useStoryChapter, useUserStoryChoice } from '@/hooks';

// local
import { ReadChapter } from './read-chapter';

/**
 * ReadStory
 */

export type ReadStoryProps = {
  story: Story & { coverImage: Image };
  userChoice?: UserStoryChoice & { choice: StoryChoice };
};

export const ReadStory = ({ story, userChoice }: ReadStoryProps) => {
  const user = useSessionUser();

  const path = userChoice ? userChoice.path : encodeStoryChoices([]);
  const number = userChoice ? userChoice.number + 1 : 1;
  const previousChoice = userChoice?.choice;

  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState<string>('');
  const [chapter, setChapter] = useState<
    StoryChapter & { ending: StoryEnding | null; choices: StoryChoice[] }
  >();

  const buffer = useRef<string>('');

  const chapterQuery = useStoryChapter({
    uuid: story.uuid,
    path,
    options: { cacheTime: 0 },
  });

  const currentChoiceQuery = useUserStoryChoice({
    uuid: story.uuid,
    number,
    options: { cacheTime: 0, enabled: !!user },
  });

  const generate = useCallback(async (prompt: ChapterPrompt) => {
    const generatedText = (
      await generateChapter({
        ...prompt,
        handleLLMNewToken: (token: string) => {
          if (isLoading) {
            buffer.current += token;
            const { ok, index } = isChapterStreamable(buffer.current);

            if (ok) {
              setIsLoading(false);
              setText(buffer.current.substring(index));
            }
          } else {
            setText((prev) => prev + token);
          }
        },
      })
    ).text;

    // TODO: Use a mutation.
    const { ok, val } = await createStoryChapter({
      storyId: story.id,
      path,
      number,
      ...parseChapter(generatedText),
    });

    if (ok) {
      return { ...val, generatedText };
    } else {
      throw new Error(val.error.message);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chapterQuery.response) {
      const { chapter, prompt } = chapterQuery.response;

      if (chapter) {
        setChapter(chapter);
        setTimeout(() => setIsLoading(false), 500);
      } else {
        generate(prompt)
          .then(({ chapter }) => {
            setChapter(chapter);
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              showNotification({ message: error.message, color: 'pink' });
            }
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      // TODO
    }
  }, [chapterQuery.response]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <ReadChapter
      story={story}
      number={number}
      previousChoice={previousChoice}
      currentChoice={currentChoiceQuery.response?.userChoice?.choice}
      text={chapter?.text || text}
      ending={chapter?.ending}
      choices={chapter?.choices}
      isLoading={isLoading}
    />
  );
};
