import { AUTH0_CLIENT_ID, AUTH0_ISS, GOOGLE_CLIENT_ID } from "../core/constants";
import { normalizeUrl } from "../core/utils.ts";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import GoogleLogo from "../components/GoogleLogo";

function LoginPage() {
  const ephemeralKeyPair = useEphemeralKeyPair();

  const createRedirectUrl = (authRedirectUrl: string, clientId: string, callbackPath: string): string => {
    const url = new URL(authRedirectUrl);
    const searchParams = new URLSearchParams({
      /**
       * Replace with your own client ID
       */
      client_id: clientId,
      /**
       * The redirect_uri must be registered in the IAM provider (e.g., Google Developer Console, Auth0 dashboard, etc.).
       * This callback page parses the id_token from the URL fragment and combines it with the ephemeral key pair to
       * derive the keyless account.
       *
       * window.location.origin == http://localhost:5173
       */
      redirect_uri: `${window.location.origin}${callbackPath}`,
      /**
       * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
       * for SPAs as it does not require a backend server.
       */
      response_type: "id_token",
      scope: "openid email profile",
      nonce: ephemeralKeyPair.nonce,
    });
    url.search = searchParams.toString();

    return url.toString();
  };

  const googleRedirectUrl = createRedirectUrl("https://accounts.google.com/o/oauth2/v2/auth", GOOGLE_CLIENT_ID, "/callback");
  const auth0RedirectUrl = createRedirectUrl(`${normalizeUrl(AUTH0_ISS)}authorize`, AUTH0_CLIENT_ID, "/federated/callback");

  return (
    <div className="flex items-center justify-center h-screen w-screen px-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to Aptos</h1>
        <p className="text-lg mb-8">
          Sign in with your Google account to continue
        </p>
        <a
          href={googleRedirectUrl}
          className="flex justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all"
        >
          <GoogleLogo />
          Sign in with Google
        </a>
        <a
          href={auth0RedirectUrl}
          className="flex justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all mt-4"
        >
          Sign in with Auth0
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
