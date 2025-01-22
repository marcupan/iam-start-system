# Use the official Node.js image.
FROM node:18

# Set environment variables
ENV NODE_ENV=development

# Create app directory
WORKDIR /app

# Copy only package.json and pnpm lock file first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and dependencies
RUN npm install -g pnpm \
    && pnpm install

# Copy the rest of the application code
COPY . .

# Create a non-root user for security
RUN useradd -m appuser
USER appuser

# Expose port
EXPOSE 3000

# Start the app in development mode
CMD ["pnpm", "start:dev"]
