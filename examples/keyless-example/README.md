# Aptos Keyless Example

This template provides a minimal setup to get Keyless working on Vite with some ESLint rules.

## Keyless Account
### Configuring Google

Here are the step-by-step instructions for obtaining OAuth credentials for Google:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/welcome) and sign in to your account.
2. Once you’re signed in, click on the project dropdown menu in the top navigation bar and select or create the project you want to use for your OAuth credentials.
3. Click the search bar at the top of the page and search for **"OAuth consent screen"**.
4. Complete the **"Configure Consent Screen"** instructions if you haven’t completed this before.
5. On the left, click **"Credentials"**. Towards the top of the screen click the **"Create Credentials"** dropdown and select **"OAuth client ID"**.
6. Select the **"Web application"** application type.
7. Enter a name for your OAuth client ID, such as **"Local Development"**.
8. In the **"Authorized JavaScript origins"** field, enter the origin of your web application: `http://localhost:5173`
9. In the **"Authorized redirect URIs"** field, enter the URI that Google should redirect users to after they authorize your application. This should be: `http://localhost:5173/callback`.
10. Click the **"Create"** button to create your OAuth client ID.
11. After creating your OAuth client ID, you should see a **"Client ID"** and **"Client Secret"** on the **"Credentials"** page. Copy the **"Client ID"** and paste it into `src/core/constants.ts`

That's it! You should now be able to authenticate with Google in your application.

If you need more help with configuring the Google OAuth App check their docs [here](https://support.google.com/cloud/answer/6158849).

## Federated Keyless Account
### Configuring Auth0

Setting up Auth0 for a federated Keyless account is similar to configuring Google. Follow these steps:

1. Go to the [Auth0 website](https://auth0.com/) and sign in to your account.
2. Navigate to the **"Applications > Applications"** section in the left-hand menu and click the **"Create Application"** button.
    - Select **"Single Page Web Applications"** when prompted.
3. After creating the application, go to the **"Settings"** tab.
    - Copy the **"Domain"** and **"Client ID"** fields (under the **Basic Information** section). Paste these values into the `src/core/constants.ts` file.
4. Scroll down to the **"Application URIs"** section in the same settings page.
    - Set the **"Allowed Callback URLs"** field to: `http://localhost:5173/federated/callback`.
5. Auth0 includes Google login by default. To add other social login options:
    - Go to the **"Authentication > Social"** section in the left-hand menu and click the **"Create Connection"** button.
    - Choose a social provider (e.g., LinkedIn, GitHub, etc.) and follow the configuration steps provided.
6. Create an Ed25519 Aptos account on the Devnet and fund it using the faucet. This account will serve as the JWK account to store and manage the JWK set provided by the issuer (Auth0).
7. Create a `.env` file in the project root and add the following environment variable:
    - `VITE_JWK_ACCOUNT_PRIVATE_KEY=YOUR_APTOS_ACCOUNT_PRIVATE_KEY`
    - This private key is used to publish and manage the JWK set as an on-chain resource.

By completing these steps, your application will be ready to authenticate users using Auth0 with a federated Keyless account.

## Usage

Ensure you have copied your google client id (auth0 issuer url and client id for the federated keyless example) above into the `src/core/constants.ts` file

```bash
bun i
bun dev
```

This will start a development server at `http://localhost:5173`.