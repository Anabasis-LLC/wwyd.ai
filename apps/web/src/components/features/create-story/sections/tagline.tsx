// 3rd party
import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Flex, Stack, Group, Title, Text, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { FaFloppyDisk, FaWandSparkles, FaDice } from 'react-icons/fa6';

// lib
import { CreateStoryRequest, generateTitle, generateTagline } from '@/lib';
import { useRequiredSessionUser } from '@/hooks';
import { Warning, StoryCard } from '@/components/shared';

// local
import { SectionProps, Section } from './section';
import { ContinueButton } from './continue-button';

/**
 * Tagline
 */

export const Tagline = ({ onContinue, ...props }: SectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [title, setTitle] = useState<string>();
  const [tagline, setTagline] = useState<string>();

  const user = useRequiredSessionUser();

  const {
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<CreateStoryRequest>();

  const cover = watch('cover');
  const warning = errors.title?.message || errors.tagline?.message;

  const onGenerate = useCallback(async () => {
    const isReady = await trigger(['hook', 'endings']);

    if (!isReady) {
      return showNotification({
        message: 'Fix the errors above first.',
        color: 'pink',
      });
    }

    setIsGenerating(true);

    try {
      const [hook, endings] = getValues(['hook', 'endings']);

      const inputs = {
        hook,
        endings: endings.map(({ text }) => `- ${text}`).join('\n'),
      };

      let isTitleTokenGenerated = false;
      let isTaglineTokenGenerated = false;

      setTitle(
        await generateTitle({
          ...inputs,
          handleLLMNewToken: (token) =>
            setTitle((prev) => {
              const value = isTitleTokenGenerated ? prev + token : token;
              isTitleTokenGenerated = true;
              return value;
            }),
        }),
      );

      setTagline(
        await generateTagline({
          ...inputs,
          handleLLMNewToken: (token) =>
            setTagline((prev) => {
              const value = isTaglineTokenGenerated ? prev + token : token;
              isTaglineTokenGenerated = true;
              return value;
            }),
        }),
      );

      setIsGenerated(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showNotification({ message: error.message, color: 'pink' });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [trigger, getValues]);

  const onGenerateOrContinue = useCallback(async () => {
    if (!isGenerated) {
      return await onGenerate();
    }

    setValue('title', title || '');
    setValue('tagline', tagline || '');
    onContinue({ step, validate: ['title', 'tagline'] });
  }, [isGenerated, onGenerate, title, tagline, setValue, onContinue]);

  const step = 'tagline';

  return (
    <Section title="Title / Tagline" step={step} {...props}>
      <Flex
        direction={{ base: 'column', xs: 'row' }}
        align={{ base: 'stretch', xs: 'center' }}
        gap="xl"
      >
        <Stack sx={{ flex: 1 }}>
          <Title order={5}>Generate a title and tagline:</Title>
          <StoryCard
            story={{
              title: title || '[Title Goes Here]',
              tagline: tagline || '[Tagline goes here.]',
              coverImage: cover,
              user,
            }}
            contentEditable={isGenerated && !isGenerating}
            onTitleChanged={(e) => setTitle(e.target.innerText)}
            onTaglineChanged={(e) => setTagline(e.target.innerText)}
          />
          {warning && <Warning message={warning} />}
          {isGenerated && (
            <Group noWrap>
              <Text size="sm" color="dimmed">
                You can edit the title and tagline by clicking on them, or roll
                the dice and re-generate them.
              </Text>
              <Button
                variant="light"
                color="gray"
                size="xs"
                tt="uppercase"
                onClick={onGenerate}
                loading={isGenerating}
              >
                <FaDice />
              </Button>
            </Group>
          )}
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <ContinueButton
            icon={isGenerated ? <FaFloppyDisk /> : <FaWandSparkles />}
            onClick={onGenerateOrContinue}
            loading={!isGenerated && isGenerating}
            disabled={isGenerated && isGenerating}
            ta="center"
          >
            {isGenerated ? 'Save & Continue' : 'Generate'}
          </ContinueButton>
        </Stack>
      </Flex>
    </Section>
  );
};
