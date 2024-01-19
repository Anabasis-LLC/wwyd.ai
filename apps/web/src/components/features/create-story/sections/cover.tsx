// 3rd party
import { useFormContext } from 'react-hook-form';
import { Flex, Stack, Title } from '@mantine/core';

// lib
import { CreateStoryRequest } from '@/lib';
import { Dropzone, Warning } from '@/components/shared';

// local
import { SectionProps, Section } from './section';
import { ContinueButton } from './continue-button';

/**
 * Cover
 */

export const Cover = ({ onContinue, ...props }: SectionProps) => {
  const {
    setValue,
    resetField,
    formState: { errors },
  } = useFormContext<CreateStoryRequest>();

  const step = 'cover';

  return (
    <Section step={step} {...props}>
      <Flex
        direction={{ base: 'column', xs: 'row' }}
        align={{ base: 'stretch', xs: 'center' }}
        gap="xl"
      >
        <Stack sx={{ flex: 1 }}>
          <Title order={5}>Add cover art:</Title>
          <Dropzone
            onImage={(image) =>
              image ? setValue('cover', image) : resetField('cover')
            }
            onDrop={() => resetField('cover')}
          />
          {errors.cover?.message && <Warning message={errors.cover?.message} />}
        </Stack>
        <ContinueButton
          onClick={() => onContinue({ step, validate: ['cover'] })}
          ta="center"
          sx={{ flex: 1 }}
        />
      </Flex>
    </Section>
  );
};
