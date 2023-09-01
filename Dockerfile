FROM node:18.17.0-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm run build
CMD ["pnpm", "start"]
