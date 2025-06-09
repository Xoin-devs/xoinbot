# Add a build stage to install Python, make, and g++ only during the build process.
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Install Python, make, and g++ for node-gyp dependencies.
RUN apk add --no-cache python3 python3-dev make g++

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Create the final image without Python, make, and g++.
FROM node:22-alpine
LABEL org.opencontainers.image.source=https://github.com/Xoin-devs/xoinbot

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy dependencies from the build stage.
COPY --from=build /usr/src/app/node_modules ./node_modules

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

CMD ["node", "bot.js"]
