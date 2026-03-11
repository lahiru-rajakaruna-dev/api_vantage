FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json
RUN npm i -g pnpm@latest
COPY . .
RUN pnpm run bulid

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/build /app/build
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
RUN npm i -g pnpm@latest
RUN pnpm install
RUN ls -l

CMD ["pnpm","start"]
