// 3rd party
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@mantine/core';

// lib
import { CreateStoryRequest } from '@/lib';

// local
import { SectionProps, Section } from './section';
import { ContinueButton } from './continue-button';

/**
 * Hook
 */

export const Hook = ({ onContinue, ...props }: SectionProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateStoryRequest>();

  const step = 'hook';

  return (
    <Section step={step} {...props}>
      <Textarea
        {...register('hook')}
        label="Begin your story with an attention-grabbing hook:"
        description={`A story hook is a narrative device used at the beginning of a story or novel to quickly engage the reader's interest.`}
        placeholder={`Example: It's Halloween night and you've made plans to go out with your girlfriends. You all decide to wear scary masks for the night. You meet the group at the mall at 9pm and get into a truck to head to the party. Your phone rings - it's your best friend. "Where are you? We're all waiting for you."`}
        error={errors.hook?.message}
        autosize
        minRows={4}
        maxRows={8}
      />
      <ContinueButton
        onClick={() => onContinue({ step, validate: ['hook'] })}
      />
    </Section>
  );
};
