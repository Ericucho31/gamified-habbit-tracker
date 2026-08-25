# Step 1: Build Stage (Stage 1)
# We use Node 20 with Alpine Linux because it is very lightweight.
FROM node:20-alpine AS builder

# Set the working directory inside the container for all subsequent commands
WORKDIR /app

# Install pnpm globally since the project uses it for dependency management
RUN npm install -g pnpm

# Copy package definition files to restore dependencies.
# We do this before copying the rest of the source code to leverage Docker's layer caching.
# This means if our code changes but dependencies don't, Docker doesn't re-download them.
COPY backend/package.json backend/pnpm-lock.yaml* ./backend/
COPY backend/pnpm-workspace.yaml* ./backend/

# Move into the backend folder to perform installation and build
WORKDIR /app/backend

# Install all dependencies (including devDependencies needed for compiling the project)
RUN pnpm install --frozen-lockfile

# Copy the rest of the backend source files into the container
COPY backend/ /app/backend/

# Generate Prisma Client and Build NestJS app
RUN pnpm dlx prisma generate
RUN pnpm run build


# Step 2: Production Run Stage (Stage 2)
# We start fresh from a clean Node 20 Alpine image to keep the image slim.
FROM node:20-alpine AS runner

# Set the working directory inside the container
WORKDIR /app/backend

# Install pnpm in the final image to restore production dependencies
RUN npm install -g pnpm

# Copy package configurations, prisma schemas, and built folder ('dist') from builder
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/backend/package.json /app/backend/pnpm-lock.yaml* ./
COPY --from=builder /app/backend/dist ./dist

# Install production dependencies and generate standard @prisma/client
RUN pnpm install --prod --frozen-lockfile
RUN pnpm dlx prisma generate

# Document that the container will listen on port 3000
EXPOSE 3000

# Set environment variables for production execution
ENV PORT=3000
ENV NODE_ENV=production

CMD ["sh", "-c", "pnpm dlx prisma migrate deploy && node dist/src/main"]
