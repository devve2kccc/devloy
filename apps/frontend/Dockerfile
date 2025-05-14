# 1) Builder using Bun
FROM oven/bun:latest AS builder
WORKDIR /app

# Monorepo metadata for workspaces
COPY bun.lock package.json ./
COPY apps/frontend/package.json apps/frontend/
RUN bun install

# Copy source & build
COPY apps/frontend ./
RUN bun run build

# 2) Runner also on Bun
FROM oven/bun:latest AS runner
WORKDIR /app

# Copy only what we need for production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY apps/frontend/package.json ./
RUN bun install --production

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]
