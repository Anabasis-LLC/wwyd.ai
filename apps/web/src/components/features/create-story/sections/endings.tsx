// 3rd party
import { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, Grid, Textarea, Title, Text, Button } from '@mantine/core';
import { FaTrash, FaCirclePlus } from 'react-icons/fa6';

// lib
import { CreateStoryRequest } from '@/lib';

// local
import { SectionProps, Section } from './section';
import { ContinueButton } from './continue-button';
import { Warning } from '@/components/shared';

/**
 * Endings
 */

export const Endings = ({ onContinue, ...props }: SectionProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateStoryRequest>();

  const {
    fields: endings,
    append,
    remove,
  } = useFieldArray({ control, name: 'endings' });

  const onAddEnding = useCallback(() => append({ text: '' }), [append]);

  const onDeleteEnding = useCallback(
    (index: number) => () => remove(index),
    [remove],
  );

  const step = 'endings';

  return (
    <Section step={step} {...props}>
      <Box>
        <Title order={5}>Describe your endings:</Title>
        <Text color="dimmed">
          These are used to generate the final chapters of your story and are
          also shown to readers. You must have at least 2 endings and can have
          as many as 10.
        </Text>
      </Box>
      {endings.map((field, index) => (
        <Grid key={field.id}>
          <Grid.Col span={11}>
            <Textarea
              {...register(`endings.${index}.text`)}
              placeholder={
                index === 0
                  ? 'Example: You survived the night!'
                  : index === 1
                  ? 'Example: A psycho masked murderer catches and kills you!'
                  : undefined
              }
              error={
                errors.endings
                  ? errors.endings[index]?.text?.message
                  : undefined
              }
              autosize
              minRows={1}
              maxRows={5}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Button
              variant="light"
              color="gray"
              size="xs"
              onClick={onDeleteEnding(index)}
            >
              <FaTrash />
            </Button>
          </Grid.Col>
        </Grid>
      ))}
      <Grid>
        <Grid.Col pos="relative" offset={11} span={1}>
          <Button variant="light" color="gray" size="xs" onClick={onAddEnding}>
            <FaCirclePlus />
          </Button>
        </Grid.Col>
      </Grid>
      {errors.endings?.message && <Warning message={errors.endings?.message} />}
      <ContinueButton
        onClick={() => onContinue({ step, validate: ['endings'] })}
      />
    </Section>
  );
};
