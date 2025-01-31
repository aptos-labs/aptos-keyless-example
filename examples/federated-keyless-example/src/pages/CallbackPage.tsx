import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFederatedKeylessAccounts } from "../core/useFederatedKeylessAccounts.ts";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { updateFederatedKeylessJwkSet } from "../core/jwk.ts";

function CallbackPage() {
  const isLoading = useRef(false);
  const switchKeylessAccount = useFederatedKeylessAccounts(
    (state) => state.switchKeylessAccount
  );
  const navigate = useNavigate();

  const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
  const idToken = fragmentParams.get("id_token");

  useEffect(() => {
    // This is a workaround to prevent firing twice due to strict mode
    if (isLoading.current) return;
    isLoading.current = true;

    async function deriveAccount(idToken: string) {
      try {
        // Publish or update the JWK set
        // Note: In production, create a JWK account and publish the JWK set to that account in a separate logic.
        //       Ensure that the JWK set on the JWK account is updated whenever a key rotation occurs by the issuer.
        const privateKey = new Ed25519PrivateKey(import.meta.env.VITE_JWK_ACCOUNT_PRIVATE_KEY as string);
        const jwkAccount = Account.fromPrivateKey({ privateKey });
        await updateFederatedKeylessJwkSet(jwkAccount); // Call this during initialization or after a JWK set rotation.
        await switchKeylessAccount(idToken, jwkAccount.accountAddress);
        navigate("/home");
      } catch (error) {
        navigate("/");
      }
    }

    if (!idToken) {
      navigate("/");
      return;
    }

    deriveAccount(idToken);
  }, [idToken, isLoading, navigate, switchKeylessAccount]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed tracking-wider">
        <span className="absolute flex h-3 w-3 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Redirecting...
      </div>
    </div>
  );
}

export default CallbackPage;
