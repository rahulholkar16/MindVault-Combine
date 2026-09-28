FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=5473

COPY --from=builder /app/dist ./dist

EXPOSE 5473

CMD ["bun", "x", "serve", "-s", "dist", "-l", "5473"]