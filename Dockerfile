# Remove npm build from Dockerfile since it is now handled in the pipeline.
# Update Dockerfile to only copy built files and dependencies.
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy dependencies from the pipeline build.
COPY node_modules ./node_modules

# Copy built files from the pipeline.
COPY dist ./dist

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

CMD ["node", "bot.js"]
