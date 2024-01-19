'use client';

// 3rd party
import React, { useState } from 'react';
import type { OAuthProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';
import { Stack, Button, Title, LoadingOverlay } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

// lib
import { OAuthProviderIcon } from '@/components/assets/icons';
import { schemeColors, themeColors } from '@/theme';
import { fireEvent } from '@/lib';

/**
 * Continue
 */

export type ContinueProps = {
  providerTypes?: Partial<OAuthProviderType>[];
  label?: string;
  callbackUrl?: string;
};

export function Continue({
  providerTypes = process.env.NODE_ENV === 'production'
    ? ['google', 'twitter', 'discord']
    : ['facebook', 'google', 'twitter', 'discord'],
  label = 'Continue with...',
  callbackUrl,
}: ContinueProps) {
  const [selectedProvider, setSelectedProvider] = useState<OAuthProviderType>();

  const { colorScheme } = useMantineColorScheme();

  return (
    <Stack align="center">
      <Title order={5} c={themeColors.pureWhite}>
        {label}
      </Title>
      <Button.Group pos="relative">
        <LoadingOverlay
          visible={!!selectedProvider}
          overlayColor={schemeColors[colorScheme].backgroundColor}
          radius="xl"
          loaderProps={{
            color: themeColors.fuschia,
          }}
        />
        {providerTypes.map((providerType) => (
          <Button
            key={providerType}
            size="lg"
            variant="subtle"
            color={colorScheme === 'dark' ? 'violet' : 'blackAlpha'}
            onClick={() => {
              fireEvent({
                event: 'landing_start_registration',
                provider: providerType,
              });
              setSelectedProvider(providerType);
              signIn(providerType, { callbackUrl });
            }}
          >
            <OAuthProviderIcon providerType={providerType} />
          </Button>
        ))}
      </Button.Group>
    </Stack>
  );
}
