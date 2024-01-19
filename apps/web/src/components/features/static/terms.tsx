'use client';

// 3rd party
import { Stack, Title, Text, Anchor } from '@mantine/core';

// lib
import { ClientEnv } from '@/lib/env';

/**
 * Terms
 */

export const Terms = () => (
  <Stack spacing="xl" py="xl">
    <Stack>
      <Title order={3}>Terms of Service</Title>
      <Text>
        By using the service provided by {ClientEnv.APP_NAME}, you agree to the
        following terms of service.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Use of the service:</Text>
      <Text>
        You are granted a limited, non-exclusive, non-transferable, and
        revocable license to use our service for the purpose of accessing the
        functionality provided by our website.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Restrictions:</Text>
      <Text>
        You are not allowed to use our service for any illegal or unauthorized
        purposes, including but not limited to:
        <ul>
          <li>
            Attempting to access our service using methods other than those
            provided by us.
          </li>
          <li>
            Using our service in a manner that negatively impacts the
            performance or functionality of our website.
          </li>
          <li>
            Attempting to gain unauthorized access to our systems or networks.
          </li>
        </ul>
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Liability:</Text>
      <Text>
        We will not be liable for any damages or losses resulting from your use
        of our service.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Changes to Terms of Service:</Text>
      <Text>
        We reserve the right to modify or update these terms of service at any
        time without prior notice.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Termination:</Text>
      <Text>
        We reserve the right to terminate your access to our service at any time
        and for any reason, including but not limited to violation of these
        terms of service.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Governing Law:</Text>
      <Text>
        These terms of service and your use of our service shall be governed by
        and construed in accordance with the laws of the state of California.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Dispute Resolution:</Text>
      <Text>
        Any dispute arising out of or relating to these terms of service or the
        use of our service will be resolved through binding arbitration in
        accordance with the rules of the American Arbitration Association.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Contact Us:</Text>
      <Text>
        If you have any questions or concerns about these terms of service,
        please contact us at{' '}
        <Anchor href="mailto:support@anabasis.dev">support@anabasis.dev</Anchor>
        .
      </Text>
    </Stack>
  </Stack>
);
