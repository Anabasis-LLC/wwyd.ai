// 3rd party
import type { OAuthProviderType } from 'next-auth/providers';

import { FaFacebook, FaGoogle, FaTwitter, FaDiscord } from 'react-icons/fa6';

/**
 * OAuthProviderIcon
 */

export type OAuthProviderIconProps = {
  providerType: OAuthProviderType;
};

export function OAuthProviderIcon({ providerType }: OAuthProviderIconProps) {
  if (providerType === 'facebook') {
    return <FaFacebook />;
  } else if (providerType === 'google') {
    return <FaGoogle />;
  } else if (providerType === 'twitter') {
    return <FaTwitter />;
  } else if (providerType === 'discord') {
    return <FaDiscord />;
  } else {
    return null;
  }
}
