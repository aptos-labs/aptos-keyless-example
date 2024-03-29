# Aptos Keyless Example

This template provides a minimal setup to get Keyless working on Vite with some ESLint rules.

## Configuring Google

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

## Usage

Ensure you have copied your google client id above into the `src/core/constants.ts` file

```bash
bun i
bun dev
```

This will start a development server at `http://localhost:5173`.
