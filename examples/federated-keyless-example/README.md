# Aptos Federated Keyless Example

This template provides a minimal setup to get Federated Keyless working on Vite with some ESLint rules.

## Configuring Auth0

Setting up Auth0 for a federated Keyless account is similar to configuring Google. Follow these steps:

1. Go to the [Auth0 website](https://auth0.com/) and sign in to your account.
2. Navigate to the **"Applications > Applications"** section in the left-hand menu and click the **"Create Application"** button.
    - Select **"Single Page Web Applications"** when prompted.
3. After creating the application, go to the **"Settings"** tab.
    - Copy the **"Domain"** and **"Client ID"** fields (under the **Basic Information** section). Paste these values into the `src/core/constants.ts` file.
4. Scroll down to the **"Application URIs"** section in the same settings page.
    - Set the **"Allowed Callback URLs"** field to: `http://localhost:5173/callback`.
5. Auth0 includes Google login by default. To add other social login options:
    - Go to the **"Authentication > Social"** section in the left-hand menu and click the **"Create Connection"** button.
    - Choose a social provider (e.g., LinkedIn, GitHub, etc.) and follow the configuration steps provided.
6. Create an Ed25519 (which is default scheme) Aptos account on the Devnet and fund it using the faucet. This account will serve as the JWK account to store and manage the JWK set provided by the issuer (Auth0).
7. Create a `.env` file in the project root and add the following environment variable:
    - `VITE_JWK_ACCOUNT_PRIVATE_KEY=YOUR_APTOS_ACCOUNT_PRIVATE_KEY`
    - This private key is used to publish and manage the JWK set as an on-chain resource.

By completing these steps, your application will be ready to authenticate users using Auth0 with a federated Keyless account.

## Usage

Ensure you have copied your auth0 issuer url and client id above into the `src/core/constants.ts` file, and copied your Aptos devnet account private key into the `.env` file

```bash
bun i
bun dev
```

This will start a development server at `http://localhost:5173`.