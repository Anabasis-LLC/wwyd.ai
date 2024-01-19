'use client';

// 3rd party
import React from 'react';
import { FlexProps, Flex } from '@mantine/core';

/**
 * FullScreen
 */

export type FullScreenProps = FlexProps;

export function FullScreen(props: FullScreenProps) {
  return <Flex h="100%" align="center" justify="center" {...props} />;
}
