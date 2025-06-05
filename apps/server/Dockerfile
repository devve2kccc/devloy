FROM oven/bun:latest
WORKDIR /app

# 1) Copy only the files needed for install
COPY bun.lock package.json ./
COPY apps/server/package.json apps/server/

# 2) Install dependencies
RUN bun install

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# 3) Copy your source code
COPY apps/server ./
COPY apps/server/types ./types

# 4) Expose & run
EXPOSE 4000
CMD ["bun", "run", "dev"]
