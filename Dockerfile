# Step 1: Build Stage (Stage 1)
# We use Node 24.18 with Alpine Linux because it is very lightweight.
FROM node:24.18-alpine AS builder

# Set the working directory inside the container for all subsequent commands
WORKDIR /app

RUN npm install -g pnpm

# Copy workspace configuration and dependency definitions
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Install all dependencies (including devDependencies needed for compiling the project)
RUN pnpm install --frozen-lockfile

# Copy the rest of the backend source files into the container
COPY backend/ ./backend/

# Generate Prisma Client and Build NestJS app
RUN pnpm --filter backend exec prisma generate
RUN pnpm --filter backend run build


# Step 2: Production Run Stage (Stage 2)
# We start fresh from a clean Node 24.18 Alpine image to keep the image slim.
FROM node:24.18-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Install pnpm in the final image to restore production dependencies
RUN npm install -g pnpm

# Copy workspace configuration and dependency definitions
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm --filter backend install --prod --frozen-lockfile

# Copy package configurations, prisma schemas, and built folder ('dist') from builder
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/prisma.config.ts ./backend/prisma.config.ts
COPY --from=builder /app/backend/dist ./backend/dist

# Generate standard Prisma Client in production
RUN pnpm --filter backend exec prisma generate

WORKDIR /app/backend

# Document that the container will listen on port 3000
EXPOSE 3000

# Set environment variables for production execution
ENV PORT=3000
ENV NODE_ENV=production

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/src/main"]

