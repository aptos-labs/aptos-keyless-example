import { Account } from "@aptos-labs/ts-sdk";
import { AUTH0_ISS, devnetClient } from "./constants.ts";
import { normalizeUrl } from "./utils.ts";

/**
 * Publishes or updates a JWK (JSON Web Key) set as an on-chain resource
 * under the specified account.
 *
 * @param jwkAccount - The account responsible for holding and updating the
 * JWK set associated with the federated keyless account.
 */
export const updateFederatedKeylessJwkSet = async (jwkAccount: Account) => {
  const jwkTxn = await devnetClient.updateFederatedKeylessJwkSetTransaction({
    sender: jwkAccount,
    iss: normalizeUrl(AUTH0_ISS),
  });
  const committedTxn = await devnetClient.signAndSubmitTransaction({
    signer: jwkAccount,
    transaction: jwkTxn,
  });
  await devnetClient.waitForTransaction({transactionHash: committedTxn.hash});
}