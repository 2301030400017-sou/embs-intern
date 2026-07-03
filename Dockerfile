# Stage 1: Build the React client
FROM node:18-alpine AS client-builder
WORKDIR /app
COPY package*.json tsconfig*.json vite.config.ts index.html ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# Stage 2: Set up the Express production server
FROM node:18-alpine
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package configurations and install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend files and database configuration
COPY server/ ./server/

# Copy compiled frontend build from Stage 1
COPY --from=client-builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Run DB seeding on startup, then start Express server
CMD ["sh", "-c", "node server/data/initDb.js && node server/index.js"]
