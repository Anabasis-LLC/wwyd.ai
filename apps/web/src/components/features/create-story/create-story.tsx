'use client';

// 3rd party
import React, { useCallback, useEffect, useState } from 'react';
import {
  FormProvider,
  SubmitHandler,
  FieldPath,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Accordion, Stack, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { FaCaretDown, FaPenFancy } from 'react-icons/fa6';

// lib
import { CreateStoryRequest, CreateStoryRequestSchema } from '@/lib';
import { useCreateStory } from '@/hooks';

// local
import {
  Welcome,
  Hook,
  ChapterCount,
  Endings,
  Cover,
  Tagline,
} from './sections';

/**
 * DEFAULT_VALUES
 */

const DEFAULT_VALUES = {
  endings: [...Array(2).keys()].map(() => ({ text: '' })),
};

/**
 * CreateStoryStep
 */

const createStorySteps = [
  'welcome',
  'hook',
  'chapterCount',
  'endings',
  'cover',
  'tagline',
] as const;

export type CreateStoryStep = (typeof createStorySteps)[number];

export type CreateStoryStepStatus = 'pending' | 'error' | 'done';

export type CreateStoryProgress = Record<
  CreateStoryStep,
  CreateStoryStepStatus
>;

/**
 * CreateStory
 */

export const CreateStory = () => {
  const router = useRouter();

  /**
   * State
   */

  const [currentStep, setCurrentStep] = useState<CreateStoryStep | null>(
    'welcome',
  );

  const [statuses, setStatuses] = useState<CreateStoryProgress>({
    welcome: 'done',
    hook: 'pending',
    chapterCount: 'pending',
    endings: 'pending',
    cover: 'pending',
    tagline: 'pending',
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mutations
   */

  const createStory = useCreateStory();

  /**
   * Form
   */

  const methods = useForm<CreateStoryRequest>({
    resolver: zodResolver(CreateStoryRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    setFocus,
    trigger,
    handleSubmit,
    formState: { isValid, errors },
  } = methods;

  /**
   * Callbacks
   */

  const onContinue = useCallback(
    async ({
      step,
      validate,
    }: {
      step: CreateStoryStep;
      validate?: FieldPath<CreateStoryRequest>[];
    }) => {
      // If undefined don't validate.
      // If empty validate all fields.
      // If not empty validate the provided fields.
      const result =
        typeof validate === 'undefined'
          ? true
          : validate.length == 0
          ? await trigger()
          : await trigger(validate);

      if (!result) {
        return;
      }

      setStatuses((prev) => ({ ...prev, [step]: 'done' }));
      const index = createStorySteps.indexOf(step) + 1;
      const nextStep = createStorySteps[index];
      setCurrentStep(nextStep ?? null);
    },
    [trigger],
  );

  const onSubmit: SubmitHandler<CreateStoryRequest> = async (story) => {
    setIsLoading(true);

    try {
      const response = await createStory.mutateAsync(story);
      showNotification({ message: 'Story created.', color: 'secondaryAccent' });
      router.push(`/stories/${response.story.slug}`);
    } catch (error) {
      if (error instanceof Error) {
        showNotification({ message: error.message, color: 'red' });
      }

      setIsLoading(false);
    }
  };

  /**
   * Effects
   */

  useEffect(() => {
    if (currentStep === null) {
      return;
    }

    const focusMap: Partial<
      Record<CreateStoryStep, FieldPath<CreateStoryRequest>>
    > = {
      hook: 'hook',
      chapterCount: 'chapterCount',
      endings: 'endings.0.text',
    };

    const field = focusMap[currentStep];

    if (field) {
      setTimeout(() => setFocus(field), 100);
    }
  }, [currentStep, setFocus]);

  const errorKey = Object.keys(errors).join(',');

  useEffect(() => {
    setStatuses((prev) => ({
      ...prev,
      ...Object.keys(errors).reduce(
        (collect, field) => ({ ...collect, [field]: 'error' }),
        {},
      ),
    }));
  }, [errorKey, errors, isValid]);

  /**
   * Render
   */

  const sharedProps = { currentStep, statuses, onContinue };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Accordion
          value={currentStep}
          onChange={(v) => setCurrentStep(v as CreateStoryStep | null)}
          chevron={<FaCaretDown />}
          py="xl"
        >
          <Welcome {...sharedProps} />
          <Hook {...sharedProps} />
          <ChapterCount {...sharedProps} />
          <Endings {...sharedProps} />
          <Cover {...sharedProps} />
          <Tagline {...sharedProps} />
          <Stack spacing="xl" align="center" py="xl">
            <Button
              type="submit"
              color="primaryAccent"
              size="lg"
              leftIcon={<FaPenFancy />}
              disabled={!!currentStep}
              loading={isLoading}
            >
              Publish Story
            </Button>
          </Stack>
        </Accordion>
      </form>
    </FormProvider>
  );
};
