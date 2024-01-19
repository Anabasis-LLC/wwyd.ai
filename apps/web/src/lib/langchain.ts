// 3rd party
import { OpenAI } from '@langchain/openai';
import { LLMChain } from 'langchain/chains';

// local
import { ChapterPrompt } from './api';
import * as Prompts from './prompts';

/**
 * Models
 */

const gpt4 = new OpenAI({
  modelName: 'gpt-4',
  openAIApiKey: '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', // TODO
  temperature: 0.9,
  streaming: true,
});

const gpt35 = new OpenAI({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: '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', // TODO
  temperature: 0.9,
  streaming: true,
});

type TokenHandler = { handleLLMNewToken?: (token: string) => void };

/**
 * generateTitle
 */

export const generateTitle = async ({
  handleLLMNewToken,
  ...inputs
}: Prompts.TitleInput & TokenHandler): Promise<string> =>
  (
    await new LLMChain({ llm: gpt35, prompt: Prompts.title }).call(inputs, [
      { handleLLMNewToken },
    ])
  ).text.replace(/[."]+/g, '');

/**
 * generateTagline
 */

export const generateTagline = async ({
  handleLLMNewToken,
  ...inputs
}: Prompts.TaglineInput & TokenHandler): Promise<string> =>
  (
    await new LLMChain({ llm: gpt35, prompt: Prompts.tagline }).call(inputs, [
      { handleLLMNewToken },
    ])
  ).text.replace(/[."]+/g, '');

/**
 * generateChapter
 */

export type GenerateChapterOptions = ChapterPrompt & TokenHandler;

export const generateChapter = async ({
  number,
  chapterCount,
  hook,
  tagline,
  choices,
  endings,
  handleLLMNewToken,
}: GenerateChapterOptions) => {
  const prompt =
    number === 1
      ? Prompts.firstChapter
      : number >= chapterCount
      ? Prompts.finalChapter
      : Prompts.nextChapter;

  const chain = new LLMChain({ llm: gpt4, prompt });

  const inputs: Prompts.ChapterInput = {
    number: number.toString(),
    chapterCount: chapterCount.toString(),
    hook,
    tagline,
    choices: choices.map(({ summary }) => `- ${summary}`).join('\n'),
    endings: endings
      .map(({ id, text }) => `- Ending ID ${id}: ${text}`)
      .join('\n'),
  };

  return chain.call(inputs, [{ handleLLMNewToken }]);
};

/**
 * generateChoiceSummary
 */

export const generateChoiceSummary = async ({
  handleLLMNewToken,
  ...inputs
}: Prompts.ChoiceSummaryInput & TokenHandler) =>
  new LLMChain({ llm: gpt35, prompt: Prompts.choiceSummary }).call(inputs, [
    { handleLLMNewToken },
  ]);

/**
 * isChapterStreamable
 */

// Obscure the text until we're past the chapter title. This allows
// us to pass data (using key-value pairs above the title) without
// leaking it to the user while in streaming mode.
export const isChapterStreamable = (text: string) => {
  const index = text.search(/Chapter \d+:/g);
  return { ok: index > -1, index };
};

/**
 * parseChapter
 */

export type ParsedChapter =
  | { type: 'next'; text: string; choices: string[] }
  | { type: 'final'; text: string; storyEndingId: number };

export const parseChapter = (text: string): ParsedChapter => {
  if (text.includes('Choice 1:')) {
    const [parsedText, ...choices] = text
      .split(/Choice \d+:/i)
      .map((substr: string) => substr.trim().replace(/\.$/g, ''));

    if (
      typeof parsedText === 'undefined' ||
      typeof choices === 'undefined' ||
      choices.length === 0
    ) {
      throw new Error('Failed to parse choices.');
    }

    return { type: 'next', text: parsedText, choices };
  } else if (text.includes('Ending ID:')) {
    const [_, storyEndingId, parsedText] = text
      .split(/Ending ID: (\d+)/i)
      .map((substr: string) => substr.trim());

    if (
      typeof storyEndingId === 'undefined' ||
      typeof parsedText === 'undefined'
    ) {
      throw new Error('Failed to parse storyEndingId');
    }

    return {
      type: 'final',
      text: parsedText,
      storyEndingId: parseInt(storyEndingId),
    };
  } else {
    throw new Error('Failed to parse chapter.');
  }
};
