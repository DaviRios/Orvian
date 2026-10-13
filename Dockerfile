FROM node:24-bookworm-slim

WORKDIR /workspace

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma

RUN mkdir -p apps/back/src \
  && npm ci

COPY . .

EXPOSE 3000 4200

CMD ["npm", "run", "dev"]
