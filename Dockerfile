# Use the official Node.js image.
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and pnpm lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start:dev"]
