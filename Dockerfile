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

# Optional: Add environment variables for easier local development
ENV KC_HOSTNAME=localhost
ENV KC_HOSTNAME_STRICT=false
ENV KC_HTTP_ENABLED=true
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

# Automatically run the build command if necessary (for optimized production setup)
USER root
RUN microdnf install -y curl && microdnf clean all
USER 1000
RUN /opt/keycloak/bin/kc.sh build

# Standard entrypoint for dev mode
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
