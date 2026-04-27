# Step 1: Build the Keycloakify theme
FROM node:20-slim AS builder

# Install Maven which is required by Keycloakify to build the theme JAR
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build-keycloak-theme

# Step 2: Create the Keycloak image with the theme installed
# Aligned with the root docker-compose version
FROM quay.io/keycloak/keycloak:26.6.1

# Copy the theme jar. Keycloakify generates specific jars for different versions.
# For Keycloak 26+, we use the "all-other-versions" jar.
COPY --from=builder /app/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/

# Automatically run the build command if necessary (for optimized production setup)
# (Skipping curl installation as Keycloak 26+ uses ubi9-micro base image which lacks a package manager)
RUN /opt/keycloak/bin/kc.sh build

# Standard entrypoint for dev mode
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
