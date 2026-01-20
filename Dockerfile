# Use Playwright base image with Node.js
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci

# Copy the rest of the application
COPY . .

# Create directories for test outputs
RUN mkdir -p test-results playwright-report downloads

# Set environment variables for headless mode in container
ENV CI=true
ENV NODE_ENV=test

# Default command to run tests
CMD ["npm", "test"]
