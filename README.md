<p align="center">
    <i>🚀 <a href="https://keycloakify.dev">Keycloakify</a> v11 starter 🚀</i>
    <br/>
    <br/>
</p>

# Quick start

```bash
git clone https://github.com/keycloakify/keycloakify-starter
cd keycloakify-starter
yarn install # Or use an other package manager, just be sure to delete the yarn.lock if you use another package manager.
```

# Testing the theme locally

[Documentation](https://docs.keycloakify.dev/testing-your-theme)

# How to customize the theme

[Documentation](https://docs.keycloakify.dev/css-customization)

# Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).  
The `mvn` command must be in the $PATH.

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

```bash
npm run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.  
You can customize this behavior, see documentation [here](https://docs.keycloakify.dev/features/compiler-options/keycloakversiontargets).

# Initializing the account theme

```bash
npx keycloakify initialize-account-theme
```

# Initializing the email theme

```bash
npx keycloakify initialize-email-theme
```

# GitHub Actions

The starter comes with a generic GitHub Actions workflow that builds the theme and publishes
the jars [as GitHub releases artifacts](https://github.com/keycloakify/keycloakify-starter/releases/tag/v10.0.0).  
To release a new version **just update the `package.json` version and push**.

To enable the workflow go to your fork of this repository on GitHub then navigate to:
`Settings` > `Actions` > `Workflow permissions`, select `Read and write permissions`.

---

# Custom 2FA & Email Verification Flow

This repository bundles custom JavaScript authenticators (`check-email-verified.js` and `mark-email-verified.js`) into a custom JAR file that is deployed alongside the Keycloak theme. These scripts allow for a **Conditional 2FA Flow**:
* **Verified users** bypass the 2FA OTP step entirely.
* **Unverified users** are prompted for email OTP, and upon successful entry, their email is automatically marked as verified so they won't be prompted again.

## 1. Deployed Custom Authenticators

* **Condition - Email Not Verified** (`check-email-verified.js`): Checks if the authenticating user has a verified email address. If they do, it bypasses the OTP step. If they don't, it triggers the fallback to OTP.
* **Mark Email Verified Script** (`mark-email-verified.js`): Executed immediately after a successful OTP verification to mark the user's email as verified in Keycloak.

---

## 2. Authentication Flow Configuration (Browser Flow)

To configure the conditional 2FA flow in your Keycloak Admin Console:

### Target Flow Structure
```text
▼ 🔀 browser with email check forms (Alternative)
  ■ Step: Username Password Form (Required)
  ▼ 🔀 Check email verified (Required)
    ▼ 🔀 Bypass or OTP Flow (Alternative)
      ■ Step: Condition - Email Not Verified (Alternative)  <-- Custom Script
      ▼ 🔀 OTP and Mark Verified Flow (Alternative)
        ■ Step: Email OTP (Required)                        <-- 2FA OTP Step
        ■ Step: Mark Email Verified Script (Required)       <-- Custom Script
```

### Step-by-Step UI Actions
1. **Navigate** to **Authentication** in the Keycloak Admin Console.
2. Select or duplicate your main **Browser Flow** (e.g., `browser with email check forms`).
3. Set **Username Password Form** to `Required`.
4. Click **Add flow** to create a sub-flow named `Check email verified`. Set its requirement to **`Required`**.
5. Inside the `Check email verified` sub-flow, click **Add flow** to create a nested sub-flow named `Bypass or OTP Flow`. Set its requirement to **`Alternative`**.
6. Inside the `Bypass or OTP Flow` sub-flow:
   * Click **Add execution**, choose **`Condition - Email Not Verified`**, and set it to **`Alternative`**.
   * Click **Add flow** to create a nested sub-flow named `OTP and Mark Verified Flow`. Set its requirement to **`Alternative`**.
7. Inside the `OTP and Mark Verified Flow` sub-flow:
   * Click **Add execution**, choose your **`Email OTP`** authenticator, and set it to **`Required`**.
   * Click **Add execution**, choose **`Mark Email Verified Script`**, and set it to **`Required`**.

---

## 3. Registration & Verification Flow Configuration

When a new user registers, we want to ensure their email is verified and that they only see the OTP verification when necessary.

### Target Registration Flow Structure
```text
▼ 🔀 Registration (Required)
  ■ Step: Registration Profile (Required)
  ■ Step: Password Validation (Required)
  ■ Step: Email Verification (Optional / Disabled)          <-- Handled by 2FA on first login
```

### Steps for Registration Setup:
1. **Disable Keycloak's default Verify Email Action**:
   * Navigate to **Realm Settings** > **Login** tab.
   * Ensure **Verify email** is turned **OFF**. (We don't need Keycloak's separate, blocking verification email since our OTP 2FA flow serves as both the second factor and the verification gate on their first login!).
2. **First Login Experience**:
   * When a new user registers, their email is unverified.
   * During their first login, Keycloak executes the `Check email verified` flow.
   * The `Condition - Email Not Verified` script sees the email is unverified and triggers the `OTP and Mark Verified Flow`.
   * The user receives an OTP code in their email.
   * Once they enter the OTP, the `Mark Email Verified Script` automatically marks their email as verified in Keycloak.
   * On all subsequent logins, they bypass the OTP!
