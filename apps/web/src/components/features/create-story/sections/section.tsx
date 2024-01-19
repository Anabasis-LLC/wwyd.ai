// 3rd party
import React from 'react';
import { capitalize } from 'lodash';
import { FieldPath } from 'react-hook-form';
import { Accordion, Stack } from '@mantine/core';

// lib
import { CreateStoryRequest } from '@/lib';

// local
import type { CreateStoryStep, CreateStoryStepStatus } from '../create-story';
import { Header } from './header';

/**
 * Section
 */

export type SectionProps = {
  currentStep: CreateStoryStep | null;
  statuses: Record<CreateStoryStep, CreateStoryStepStatus>;
  onContinue: (args: {
    step: CreateStoryStep;
    validate?: FieldPath<CreateStoryRequest>[];
  }) => void;
};

export const Section = ({
  title,
  step,
  currentStep,
  statuses,
  children,
}: Omit<SectionProps, 'onContinue'> & {
  title?: string;
  step: CreateStoryStep;
  children: React.ReactNode;
}) => {
  return (
    <Accordion.Item value={step}>
      <Header
        title={title ?? capitalize(step)}
        status={statuses[step]}
        isActive={currentStep === step}
      />
      <Accordion.Panel>
        <Stack>{children}</Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
