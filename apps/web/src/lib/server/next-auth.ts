// 3rd party
import { TokenSet, User } from 'next-auth';
import { OAuthUserConfig, OAuthConfig } from 'next-auth/providers';
import Facebook, { FacebookProfile } from 'next-auth/providers/facebook';
import Google, { GoogleProfile } from 'next-auth/providers/google';
import Twitter, { TwitterProfile } from 'next-auth/providers/twitter';
import Discord, { DiscordProfile } from 'next-auth/providers/discord';

// package
import { db } from '@wwyd/db';

// lib
import { ServerEnv } from '@/lib/server';

/**
 * initializeProvider
 */

type Provider<P> = (options: OAuthUserConfig<P>) => OAuthConfig<P>;

type ProviderName = 'Facebook' | 'Google' | 'Twitter' | 'Discord';

type InitializeProviderOptions<P> = {
  provider: Provider<P>;
  name: ProviderName;
  config: OAuthUserConfig<P>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeProvider<P extends Record<string, any>>({
  provider,
  name,
  config,
}: InitializeProviderOptions<P>) {
  const configuration = provider(config);

  return {
    ...configuration,
    profile: async (profile: P, tokens: TokenSet) => {
      const user = await configuration.profile(profile, tokens);

      // TODO: In the case of Facebook and Google we don't get refresh tokens.
      // Are there additional steps needed to generate them?
      const { id } = await findOrCreateUser({
        provider: name,
        user,
        tokens,
      });

      return { ...user, id: id.toString() };
    },
  };
}

/**
 * findOrCreateUser
 */

type FindOrCreateUser = {
  provider: ProviderName;
  user: User;
  tokens: TokenSet;
};

const findOrCreateUser = async ({
  provider,
  user: { id: providerId, email, name, image },
  tokens,
}: FindOrCreateUser) => {
  if (!email || !name) {
    throw new Error(`${provider}: Unable to retrieve email and/or name`);
  }

  let oauthConnection = await db.oauthConnection.findUnique({
    where: { provider_providerId: { provider, providerId } },
    include: { user: true },
  });

  const user =
    oauthConnection?.user ??
    ((await db.user.findUnique({ where: { email } })) ||
      (await db.user.create({ data: { email, name } })));

  if (!oauthConnection) {
    // Twitter uses OAuth.10, so the tokens are named differently:
    // https://next-auth.js.org/providers/twitter
    const accessToken =
      provider === 'Twitter' ? tokens.oauth_token : tokens.access_token;
    const refreshToken =
      provider === 'Twitter' ? tokens.oauth_token_secret : tokens.refresh_token;

    if (typeof accessToken !== 'string') {
      throw new Error(
        `[${provider}] Invalid access token: ${JSON.stringify(tokens)}`,
      );
    }

    if (
      typeof refreshToken !== 'string' &&
      typeof refreshToken !== 'undefined'
    ) {
      throw new Error(
        `[${provider}] Invalid refresh token: ${JSON.stringify(tokens)}`,
      );
    }

    oauthConnection = await db.oauthConnection.create({
      data: {
        user: { connect: { id: user.id } },
        provider,
        providerId,
        email,
        name,
        image,
        accessToken,
        refreshToken,
      },
      include: { user: true },
    });
  }

  if (oauthConnection?.image && !user.avatarUrl) {
    await db.user.update({
      where: { id: user.id },
      data: { avatarUrl: oauthConnection.image },
    });
  }

  return user;
};

/**
 * providers
 */

export const providers = [
  initializeProvider<FacebookProfile>({
    provider: Facebook,
    name: 'Facebook',
    config: {
      clientId:
        process.env.NODE_ENV === 'production'
          ? '1301074450513779'
          : '1185219322155844',
      clientSecret:
        process.env.NODE_ENV === 'production'
          ? ServerEnv.FACEBOOK_CLIENT_SECRET
          : 'cf43305601f9ddbd0e4f8afe7ebba7c2', // This is the client secret for the "Test" app, so it's fine to leak it on GitHub.
    },
  }),
  initializeProvider<GoogleProfile>({
    provider: Google,
    name: 'Google',
    config: {
      clientId:
        '501263315614-qoaieoc1imkm9brv335en8ku7jcmb3us.apps.googleusercontent.com',
      clientSecret: ServerEnv.GOOGLE_CLIENT_SECRET,
    },
  }),
  initializeProvider<TwitterProfile>({
    provider: Twitter,
    name: 'Twitter',
    config: {
      clientId: '3sL2LLjd8ff6F6B5AwZC8ln25',
      clientSecret: ServerEnv.TWITTER_CLIENT_SECRET,
    },
  }),
  initializeProvider<DiscordProfile>({
    provider: Discord,
    name: 'Discord',
    config: {
      clientId: '1105610926851379270',
      clientSecret: ServerEnv.DISCORD_CLIENT_SECRET,
    },
  }),
];
