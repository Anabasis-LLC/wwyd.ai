// 3rd party
import {
  AccordionControlProps,
  Accordion,
  Group,
  Title,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { FaCircle, FaCircleXmark, FaCircleCheck } from 'react-icons/fa6';

// local
import type { CreateStoryStepStatus } from '../create-story';

/**
 * Header
 */

export type HeaderProps = Omit<AccordionControlProps, 'children'> & {
  title: string;
  status: CreateStoryStepStatus;
  isActive: boolean;
};

export const Header = ({ title, status, isActive, ...props }: HeaderProps) => (
  <Accordion.Control {...props}>
    <Group>
      <HeaderIcon status={status} isActive={isActive} />
      <Title order={6} tt="uppercase">
        {title}
      </Title>
    </Group>
  </Accordion.Control>
);

/**
 * HeaderIcon
 */

type HeaderIconProps = {
  status: CreateStoryStepStatus;
  isActive: boolean;
};

const HeaderIcon = ({ status, isActive }: HeaderIconProps) => {
  const { colorScheme } = useMantineColorScheme();

  let icon;
  let color;

  if (status === 'done') {
    icon = <FaCircleCheck />;
    color = isActive ? 'gray.6' : colorScheme === 'dark' ? 'gray.6' : 'gray.5';
  } else if (status === 'error') {
    icon = <FaCircleXmark />;
    color = 'pink';
  } else {
    icon = <FaCircle />;
    color = isActive ? 'gray.5' : colorScheme === 'dark' ? 'gray.7' : 'gray.3';
  }

  return <Text color={color}>{icon}</Text>;
};
