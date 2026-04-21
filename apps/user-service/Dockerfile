FROM node:20-alpine AS base

RUN corepack enable

WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY libs ./libs
COPY apps/user-service/package.json apps/user-service/

RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build user-service

FROM base AS runner
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/libs ./libs

EXPOSE 3002 50052

CMD ["node", "dist/apps/user-service/main.js"]
