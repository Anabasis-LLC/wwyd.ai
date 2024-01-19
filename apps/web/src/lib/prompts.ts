import { PromptTemplate } from '@langchain/core/prompts';

/**
 * title
 */

export type TitleInput = Record<(typeof titleVariables)[number], string>;

const titleVariables = ['hook', 'endings'] as const;

export const title = new PromptTemplate({
  inputVariables: Array.from(titleVariables),
  template: `
You wrote a "Choose your own adventure" story with the following hook and possible endings:

HOOK ###
{hook}
###

ENDINGS ###
{endings}
###

Write a short and catch title for this story.
You should output the title and nothing else.
Do not add add a period at the end of the title.
`.trim(),
});

/**
 * tagline
 */

export type TaglineInput = Record<(typeof taglineVariables)[number], string>;

const taglineVariables = ['hook', 'endings'] as const;

export const tagline = new PromptTemplate({
  inputVariables: Array.from(taglineVariables),
  template: `
You have written a "Choose your own adventure" story with the following hook and possible endings.

HOOK ###
{hook}
###

ENDINGS ###
{endings}
###

Write a catchy and clickbaity tagline designed to entice potential readers to read your story.
The tagline should be in the form of a question.

You should output the tagline and nothing else.
The tagline should be less than 100 characters.
`.trim(),
});

/**
 * ChapterInput
 */

export type ChapterInput = Record<(typeof chapterVariables)[number], string>;

const chapterVariables = [
  'number',
  'chapterCount',
  'hook',
  'tagline',
  'choices',
  'endings',
] as const;

/**
 * chapterGuidelines
 */

const chapterGuidelines = `
Offer the reader a set of choices that will guide them to one of the possible endings within the maximally allowed chapters.
Each choice should offer an action in just a few words with no further description.
Each choice should significantly change the likelihoods of the possible endings.
`;

/**
 * firstChapter
 */

export const firstChapter = new PromptTemplate({
  inputVariables: Array.from(chapterVariables),
  template: `
You are given a story hook, a tagline, and a set of possible endings for a "Choose your own adventure" story.

There will be a total of {chapterCount} chapters.

Re-write the hook in the form of the first chapter of the story.

${chapterGuidelines}

HOOK ###
{hook}
###

TAGLINE ###
{tagline}
###

ENDINGS ###
{endings}
###

Use the format below for your output.

FORMAT ###
Chapter {number}:

[Chapter goes here.]

Choice 1: [Choice 1 goes here.]
Choice 2: [Choice 2 goes here.]
Choice 3: [Choice 3 goes here.]
###

Do not output any text below the choices.
Make no mention of the ending IDs in the chapter body or choices.
The chapter should be 150 words or less.
`.trim(),
});

/**
 * nextChapter
 */

export const nextChapter = new PromptTemplate({
  inputVariables: Array.from(chapterVariables),
  template: `
Given a tagline, a set of pre-existing chapter summaries and a set of possible endings, generate the next chapter in the format of a "Choose your own adventure" story.

There will be a total of {chapterCount} chapters.

The next chapter should reveal the outcome of the key decision from the prior chapter, and that outcome should catalyze a dramatic problem that requires another key decision from the reader.

${chapterGuidelines}

TAGLINE ###
{tagline}
###

CHAPTER SUMMARIES ###
{choices}
###

POSSIBLE ENDINGS ###
{endings}
###

Use the format below for your output.

FORMAT ###
Chapter {number}:

[Chapter goes here.]

Choice 1: [Choice 1 goes here.]
Choice 2: [Choice 2 goes here.]
Choice 3: [Choice 3 goes here.]
###

Do not output any text below the choices.
Make no mention of the ending IDs in the chapter body or choices.
The chapter should be 150 words or less.
`.trim(),
});

/**
 * finalChapter
 */

export const finalChapter = new PromptTemplate({
  inputVariables: Array.from(chapterVariables),
  template: `
Given a tagline, a set of pre-existing chapter summaries and a set of possible endings, you will help me generate the final chapter in the story.

The chapter should build on the key decision from the prior chapter and elegantly connect the ending to key decisions from prior chapters.

The story does not need a happy ending.

TAGLINE ###
{tagline}
###

CHAPTER SUMMARIES ###
{choices}
###

POSSIBLE ENDINGS ###
{endings}
###

Use the format below for your output.

FORMAT ###
Ending ID: [Ending ID of the ending chosen from POSSIBLE ENDINGS goes here.]
Chapter {number}:

[Chapter goes here.]
###

Make no mention of the ending IDs in the chapter body or choices.
The chapter should be 150 words or less.
`.trim(),
});

/**
 * choiceSummary
 */

export type ChoiceSummaryInput = Record<
  (typeof choiceSummaryVariables)[number],
  string
>;

const choiceSummaryVariables = ['chapter', 'choice'] as const;

export const choiceSummary = new PromptTemplate({
  inputVariables: Array.from(choiceSummaryVariables),
  template: `
Given context and a choice, offer a brief summary that includes the context and the choice.

CONTEXT
{chapter}

CHOICE
You chose to "{choice}".

Summary:
`.trim(),
});
