// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  Groth16Zkp,
  KeylessAccount,
  SignedGroth16Signature,
} from "@aptos-labs/ts-sdk";
import { isValidEphemeralKeyPair } from "./ephemeral";
import { decodeIdToken, isValidIdToken } from "./idToken";

/**
 * Encoding for the KeylessAccount class to be stored in localStorage
 *
 * TODO: Replace with seralizer
 */
export const KeylessAccountEncoding = {
  decode: (e: any) =>
    // TODO: Add training wheel signature
    KeylessAccount.fromJWTAndProof({
      ephemeralKeyPair: e.ephemeralKeyPair,
      jwt: e.jwt,
      pepper: e.pepper,
      proof: new SignedGroth16Signature({
        extraField: e.proof.extraField,
        overrideAudVal: e.proof.overrideAudVal,
        proof: new Groth16Zkp({
          a: e.proof.proof.a,
          b: e.proof.proof.b,
          c: e.proof.proof.c,
        }),
      }),
    }),
  encode: (e: KeylessAccount) =>
    // TODO: Add training wheel signature
    ({
      __type: "KeylessAccount",
      ephemeralKeyPair: e.ephemeralKeyPair,
      jwt: e.jwt,
      pepper: e.pepper,
      proof: {
        extraField: e.proof.extraField,
        overrideAudVal: e.proof.overrideAudVal,
        proof: { a: e.proof.proof.a, b: e.proof.proof.b, c: e.proof.proof.c },
      },
    }),
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
