# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build

# Production stage - serve with Node
FROM node:20-alpine
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files
COPY --from=build /app/dist/student-app-frontend/browser ./dist

# Railway uses PORT environment variable
ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
