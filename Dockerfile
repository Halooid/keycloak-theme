# Step 1: Build the Keycloakify theme
FROM node:20-slim AS builder

# Install Maven, curl, and zip which is required by Keycloakify to build the theme JAR and download/package extensions
RUN apt-get update && apt-get install -y maven curl zip && rm -rf /var/lib/apt/lists/*

# Download the Email OTP Authenticator JAR from Maven Central
# Ref: https://github.com/mesutpiskin/keycloak-2fa-email-authenticator
RUN curl -L -o /keycloak-2fa-email-authenticator.jar https://repo1.maven.org/maven2/io/github/mesutpiskin/keycloak-2fa-email-authenticator/26.3.1-KC26.6.1/keycloak-2fa-email-authenticator-26.3.1-KC26.6.1.jar

WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build-keycloak-theme

# Package the custom script authenticator into a JAR from the organized scripts directory
RUN cd /app/scripts/authenticator && zip -r /custom-scripts.jar .

# Step 2: Create the Keycloak image with the theme installed
# Aligned with the root docker-compose version
FROM quay.io/keycloak/keycloak:26.6.1

# Copy the theme jar. Keycloakify generates specific jars for different versions.
# For Keycloak 26+, we use the "all-other-versions" jar.
COPY --from=builder /app/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/

# Copy the Email OTP Authenticator JAR
COPY --from=builder /keycloak-2fa-email-authenticator.jar /opt/keycloak/providers/

# Copy the custom Scripts JAR
COPY --from=builder /custom-scripts.jar /opt/keycloak/providers/

# Automatically run the build command if necessary (for optimized production setup)
# (Skipping curl installation as Keycloak 26+ uses ubi9-micro base image which lacks a package manager)
RUN /opt/keycloak/bin/kc.sh build

# Standard entrypoint for dev mode
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
