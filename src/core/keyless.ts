// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { KeylessAccount } from "@aptos-labs/ts-sdk";
import { isValidEphemeralKeyPair } from "./ephemeral";
import { decodeIdToken, isValidIdToken } from "./idToken";

/**
 * Encoding for the KeylessAccount class to be stored in localStorage
 */
export const KeylessAccountEncoding = {
  decode: (e: any) => KeylessAccount.fromBytes(e.data),
  // If the account has a proof, it can be persisted, otherwise,
  // it should not be stored.
  encode: (e: KeylessAccount) =>
    e.proof
      ? {
          __type: "KeylessAccount",
          data: e.bcsToBytes(),
        }
      : undefined,
};

/**
 * If the account has an invalid Ephemeral key pair or idToken, the account needs toe be refreshed with either
 * a new nonce or idToken. If the account is valid, it is returned.
 *
 * @param account - The account to validate.
 * @returns The account if it is valid, otherwise undefined.
 */
export const validateKeylessAccount = (
  account: KeylessAccount
): KeylessAccount | undefined =>
  // Check the Ephemeral key pair expiration
  isValidEphemeralKeyPair(account.ephemeralKeyPair) &&
  // Check the idToken for nonce
  isValidIdToken(account.jwt) &&
  // If the EphemeralAccount nonce algorithm changes, this will need to be updated
  decodeIdToken(account.jwt).nonce === account.ephemeralKeyPair.nonce
    ? account
    : undefined;
