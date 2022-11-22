# base node image
FROM node:18 as base

EXPOSE 8080

# Enable pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl tmux wget

RUN mkdir /app
WORKDIR /app

RUN set -ex \
  && wget -q https://github.com/DarthSim/overmind/releases/download/v2.3.0/overmind-v2.3.0-linux-amd64.gz \
  && gunzip overmind-v2.3.0-linux-amd64.gz \
  && chmod +x overmind-v2.3.0-linux-amd64 \
  && mv overmind-v2.3.0-linux-amd64 /app/overmind

# Prepare node dependencies
ADD .npmrc pnpm-lock.yaml ./
RUN pnpm fetch 

# Copy over root project files
ADD package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json Procfile ./

# Copy common lib
ADD packages/common/package.json packages/common/tsconfig.json ./packages/common/
ADD packages/common/src ./packages/common/src

# Copy invariant lib lib
ADD packages/invariant/package.json packages/invariant/tsconfig.json ./packages/invariant/
ADD packages/invariant/src ./packages/invariant/src

# Copy website
ADD apps/site/next-env.d.ts apps/site/next.config.js apps/site/package.json apps/site/tsconfig.json ./apps/site/
ADD apps/site/components ./apps/site/components
ADD apps/site/lib ./apps/site/lib
ADD apps/site/pages ./apps/site/pages
ADD apps/site/public ./apps/site/public
ADD apps/site/scripts ./apps/site/scripts
ADD apps/site/styles ./apps/site/styles

# Copy worker
ADD apps/worker/package.json apps/worker/tsconfig.json ./apps/worker/
ADD apps/worker/src ./apps/worker/src

RUN echo "./apps/worker/src:"
RUN ls -lah ./apps/worker/src

# Install dependencies
RUN pnpm install -r --offline

# Build everything!
RUN pnpm build

WORKDIR /app
CMD ["./overmind", "start", "-N", "-r", "site,worker"]