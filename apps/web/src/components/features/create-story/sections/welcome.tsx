// 3rd party
import { Flex, Stack, Title, Text } from '@mantine/core';
import { FaRocket } from 'react-icons/fa6';

// local
import { SectionProps, Section } from './section';
import { ContinueButton } from './continue-button';

/**
 * Welcome
 */

export const Welcome = ({ onContinue, ...props }: SectionProps) => {
  const step = 'welcome';

  return (
    <Section step={step} {...props}>
      <Flex
        direction={{ base: 'column', xs: 'row' }}
        align={{ base: 'stretch', xs: 'center' }}
        gap="xl"
      >
        <Stack sx={{ flex: 1 }}>
          <Title order={4}>
            Write thrilling stories starring your friends or favorite
            celebrities and fictional characters.
          </Title>
          <Text color="dimmed">
            Not a writer? No problem. Our AI helps make every tale a blast.
            It&apos;s your world, your story. Let the adventure begin!
          </Text>
        </Stack>
        <ContinueButton
          icon={<FaRocket />}
          onClick={() => onContinue({ step })}
          ta="center"
          sx={{ flex: 1 }}
        >
          Let&apos;s Go
        </ContinueButton>
      </Flex>
    </Section>
  );
};
