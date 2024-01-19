'use client';

// 3rd party
import { useState, useCallback, useEffect } from 'react';
import { isEmpty, sortBy } from 'lodash';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Flex,
  Stack,
  Group,
  Box,
  Transition,
  Text,
  Avatar,
  Button,
  Modal,
  Divider,
  CloseButton,
} from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { FaFacebook, FaTwitter, FaArrowRight } from 'react-icons/fa6';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

// package
import type { Story, Image, StoryChoice, StoryEnding } from '@wwyd/db';

// lib
import { cdnUrl, createUserStoryChoice, delay, fireEvent } from '@/lib';
import { useSessionUser } from '@/hooks';
import { constants, schemeColors, themeColors } from '@/theme';
import { lora } from '@/components/assets/fonts';
import { StoryPage, Continue } from '@/components/shared';

// local
import { StoryProgress } from './story-progress';
import { ChooseButton } from './choose-button';

/**
 * ReadChapter
 */

export type ReadChapterProps = {
  story: Story & { coverImage: Image };
  number: number;
  previousChoice?: StoryChoice;
  currentChoice?: StoryChoice;
  text: string;
  ending?: StoryEnding | null;
  choices?: StoryChoice[];
  isLoading: boolean;
};

export const ReadChapter = ({
  story,
  number,
  previousChoice,
  currentChoice,
  text,
  ending,
  choices,
  isLoading,
}: ReadChapterProps) => {
  const user = useSessionUser();

  const [pendingChoice, setPendingChoice] = useState<StoryChoice>();
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice>();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();

  const isBase = useMediaQuery(`(max-width: ${constants.breakpoints.xs}px)`);

  const [opened, { open, close }] = useDisclosure(false);

  const onChoose = useCallback(
    (choice: StoryChoice) => {
      return async () => {
        if (!user) {
          fireEvent({ event: 'landing_choose' });
          setPendingChoice(choice);
          open();
          return;
        }

        setSelectedChoice(choice);

        // TODO: Use a mutation.
        const { ok, val } = await createUserStoryChoice({
          storyId: choice.storyId,
          storyChoiceId: choice.id,
        });

        delay(300).then(() => setIsRedirecting(true));

        if (ok) {
          const {
            story: { slug },
            path,
          } = val.userStoryChoice;

          delay(600).then(() => router.push(`/stories/${slug}/${path}`));
        } else {
          showNotification({ message: val.error.message, color: 'pink' });
        }
      };
    },
    [user, open, router],
  );

  useEffect(() => {
    if (!user) {
      fireEvent({ event: 'landing_visit' });
    }
  }, [user]);

  const shareUrl =
    process.env.NODE_ENV === 'production'
      ? `https://wwyd.ai/stories/${story.slug}`
      : 'https://wwyd.ai';

  const shareTitle = ending
    ? `${story.tagline} - I got: ${ending.text}`
    : story.tagline;

  return (
    <>
      <Flex
        direction="column"
        align="center"
        w={{ base: '100%', xs: 500, sm: 650, md: 800 }}
        mih="100vh"
        mx="auto"
        pt={constants.dimensions.headerHeight}
      >
        <Box
          w="100%"
          mt={{ base: 0, xs: 30 }}
          sx={({ colorScheme, radius }) => ({
            zIndex: 1,
            backgroundColor: schemeColors[colorScheme].backgroundColor,
            borderRadius: radius.sm,
            border: isBase
              ? 0
              : `1px solid ${schemeColors[colorScheme].translucentBorderColor}`,
          })}
        >
          <Stack
            p={30}
            sx={({ colorScheme }) => ({
              backgroundColor: schemeColors[colorScheme].translucentColor,
            })}
          >
            <Group position="apart" noWrap>
              <Group noWrap>
                <Avatar size="xl" src={cdnUrl(story.coverImage.key)} />
                <Box>
                  <Text size="xl" className={lora.className}>
                    {story.title}
                  </Text>
                  <Text size="sm" color="dimmed" className={lora.className}>
                    {story.tagline}
                  </Text>
                </Box>
              </Group>
              <Group
                noWrap
                sx={({ breakpoints }) => ({
                  [`@media (max-width: ${breakpoints.xs})`]: {
                    display: 'none',
                  },
                })}
              >
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <FaFacebook color={themeColors.facebook} />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <FaTwitter color={themeColors.twitter} />
                </TwitterShareButton>
              </Group>
            </Group>
            <StoryProgress progress={number / story.chapterCount} />
          </Stack>
          <Stack p={30}>
            {previousChoice && (
              <Text size="sm" color="dimmed" className={lora.className}>
                You Chose: {previousChoice.text}
              </Text>
            )}
            <StoryPage text={text} loading={isLoading} />
          </Stack>
        </Box>
        <Transition
          mounted={
            !isLoading && !isRedirecting && (!isEmpty(choices) || !!ending)
          }
          transition="pop"
          timingFunction="ease-in-out"
          duration={600}
          exitDuration={300}
        >
          {(style) => (
            <Flex
              direction="column"
              align="center"
              w={{ base: '100%', xs: '98%' }}
              mb={{ base: 0, xs: 30 }}
              p={30}
              style={style}
            >
              <Stack px="xl">
                {ending ? (
                  <Stack>
                    <Text size={24} className={lora.className}>
                      {ending.text}
                    </Text>
                    <Group position="center">
                      <Text maw={200} className={lora.className}>
                        Can your friends top this? Share to find out!
                      </Text>
                      <FacebookShareButton url={shareUrl} quote={shareTitle}>
                        <FaFacebook color={themeColors.facebook} />
                      </FacebookShareButton>
                      <TwitterShareButton url={shareUrl} title={shareTitle}>
                        <FaTwitter color={themeColors.twitter} />
                      </TwitterShareButton>
                    </Group>
                    <Divider />
                    <Button
                      component={Link}
                      href="/"
                      prefetch={false}
                      variant="light"
                      color="dark"
                      rightIcon={<FaArrowRight />}
                      tt="uppercase"
                    >
                      More Stories
                    </Button>
                  </Stack>
                ) : (
                  <Button.Group
                    orientation="vertical"
                    sx={({ colorScheme, radius }) => ({
                      backgroundImage:
                        schemeColors[colorScheme].gradientBackgroundImage,
                      borderRadius: radius.sm,
                    })}
                  >
                    {sortBy(choices, 'id').map((choice) => (
                      <ChooseButton
                        key={choice.id}
                        choice={choice}
                        currentChoice={currentChoice}
                        selectedChoice={selectedChoice}
                        onClick={onChoose(choice)}
                      />
                    ))}
                  </Button.Group>
                )}
              </Stack>
            </Flex>
          )}
        </Transition>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
        styles={({ colorScheme }) => ({
          content: {
            backgroundImage: schemeColors[colorScheme].gradientBackgroundImage,
          },
        })}
      >
        <CloseButton
          variant="filled"
          color="whiteAlpha.1"
          pos="absolute"
          top={12}
          right={12}
          onClick={() => {
            fireEvent({ event: 'landing_choose_cancel' });
            close();
          }}
        />
        <Continue
          label="Find out what happens next..."
          callbackUrl={`/stories/${story.slug}?choice=${pendingChoice?.uuid}`}
        />
      </Modal>
    </>
  );
};
