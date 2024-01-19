################################################################################
# BUILDER
################################################################################

FROM node:20.9.0-slim AS builder

ARG DATABASE_URL
ENV DATABASE_URL=DATABASE_URL
ARG FACEBOOK_CLIENT_SECRET
ENV FACEBOOK_CLIENT_SECRET=FACEBOOK_CLIENT_SECRET
ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET
ARG TWITTER_CLIENT_SECRET
ENV TWITTER_CLIENT_SECRET=TWITTER_CLIENT_SECRET
ARG DISCORD_CLIENT_SECRET
ENV DISCORD_CLIENT_SECRET=DISCORD_CLIENT_SECRET
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=OPENAI_API_KEY

WORKDIR /build

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/

COPY ./apps/web/package.json                 ./apps/web/package.json
COPY ./packages/eslint-config/package.json   ./packages/eslint-config/package.json
COPY ./packages/prettier-config/package.json ./packages/prettier-config/package.json
COPY ./packages/tsconfig/package.json        ./packages/tsconfig/package.json
COPY ./packages/db/package.json              ./packages/db/package.json

RUN yarn install

COPY ./apps/web                 ./apps/web
COPY ./packages/eslint-config   ./packages/eslint-config
COPY ./packages/prettier-config ./packages/prettier-config
COPY ./packages/tsconfig        ./packages/tsconfig
COPY ./packages/db              ./packages/db

RUN yarn workspace @wwyd/db prisma generate
RUN yarn workspace @wwyd/web run build
RUN yarn workspaces focus @wwyd/web --production

################################################################################
# RUNNER
################################################################################

FROM node:20.9.0-slim AS runner

ENV NODE_ENV=production

RUN apt update && apt install -y procps curl

WORKDIR /app

COPY --from=builder --chown=node:node /build/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /build/apps/web/public           ./apps/web/public
COPY --from=builder --chown=node:node /build/apps/web/.next/static     ./apps/web/.next/static

USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
