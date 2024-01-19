'use client';

// 3rd party
import { Stack, Title, Text, Anchor } from '@mantine/core';

// lib
import { ClientEnv } from '@/lib/env';

/**
 * Privacy
 */

export const Privacy = () => (
  <Stack spacing="xl" py="xl">
    <Stack>
      <Title order={3}>Privacy Policy</Title>
      <Text>
        At {ClientEnv.APP_NAME}, we take your privacy seriously. We understand
        that your data is valuable and we want to ensure that it is protected.
        This privacy policy outlines the information we collect from you and how
        it is used.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Information Collection:</Text>
      <Text>
        When you access our website or use our service, we may collect certain
        information about you, including:
        <ul>
          <li>IP address.</li>
          <li>Browser type and version.</li>
          <li>Operating system.</li>
          <li>Referring website.</li>
          <li>Time and date of access.</li>
          <li>
            This information is used to improve the performance and
            functionality of our website, as well as to understand how our users
            are interacting with our services.
          </li>
        </ul>
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Use of Information:</Text>
      <Text>
        We use the information we collect from you to:
        <ul>
          <li>Provide you with access to our service</li>
          <li>Improve the performance and functionality of our website</li>
          <li>Understand how our users are interacting with our services</li>
          <li>Monitor for and prevent fraud or abuse of our services</li>
        </ul>
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Sharing of Information:</Text>
      <Text>
        We do not share your information with any third parties, except as
        required by law.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Security:</Text>
      <Text>
        We take reasonable measures to protect your information from
        unauthorized access or disclosure. However, please note that no method
        of transmission or storage is completely secure, and we cannot guarantee
        the security of your information.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Changes to this Privacy Policy:</Text>
      <Text>
        We may update this privacy policy from time to time. If we make any
        changes, we will notify you by updating the date at the top of this
        page.
      </Text>
    </Stack>
    <Stack>
      <Text fw="bold">Contact Us:</Text>
      <Text>
        If you have any questions or concerns about this privacy policy, please
        contact us at{' '}
        <Anchor href="mailto:support@anabasis.dev">support@anabasis.dev</Anchor>
        .
      </Text>
    </Stack>
  </Stack>
);
