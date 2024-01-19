// 3rd party
import { Controller, useFormContext } from 'react-hook-form';
import { Flex, Stack, NumberInput } from '@mantine/core';

// lib
import { CreateStoryRequest } from '@/lib';

// local
import { SectionProps, Section } from './section';
import { ContinueButton } from './continue-button';

/**
 * ChapterCount
 */

export const ChapterCount = ({ onContinue, ...props }: SectionProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateStoryRequest>();

  const step = 'chapterCount';

  return (
    <Section title="# Chapters" step={step} {...props}>
      <Flex
        direction={{ base: 'column', xs: 'row' }}
        align={{ base: 'stretch', xs: 'center' }}
        gap="xl"
      >
        <Stack sx={{ flex: 1 }}>
          <Controller
            name="chapterCount"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Set the number of chapters:"
                error={errors.chapterCount?.message}
                min={2}
                max={10}
                step={1}
              />
            )}
          />
        </Stack>
        <ContinueButton
          onClick={() => onContinue({ step, validate: ['chapterCount'] })}
          ta="center"
          sx={{ flex: 1 }}
        />
      </Flex>
    </Section>
  );
};
