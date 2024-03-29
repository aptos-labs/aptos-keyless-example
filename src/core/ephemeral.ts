// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Ed25519PrivateKey, EphemeralKeyPair } from "@aptos-labs/ts-sdk";

/**
 * TODO: Replace with seralizer
 */
export const EphemeralKeyPairEncoding = {
  decode: (e: any) =>
    new EphemeralKeyPair({
      blinder: e.blinder,
      expiryDateSecs: BigInt(e.expiryDateSecs),
      privateKey: new Ed25519PrivateKey(e.privateKey),
    }),
  encode: (e: EphemeralKeyPair) => ({
    __type: "EphemeralKeyPair",
    blinder: e.blinder,
    expiryDateSecs: e.expiryDateSecs.toString(),
    privateKey: e.privateKey.toString(),
  }),
};

export const validateEphemeralKeyPair = (
  keyPair: EphemeralKeyPair
): EphemeralKeyPair | undefined =>
  isValidEphemeralKeyPair(keyPair) ? keyPair : undefined;

const TWENTY_FOUR_HOURS_IN_SECONDS: bigint = BigInt(24 * 60 * 60);
export const nowSeconds = (): bigint => {
  return BigInt(Math.floor(Date.now() / 1000));
}
export const isValidEphemeralKeyPair = (keyPair: EphemeralKeyPair): boolean => {
  return nowSeconds() <= keyPair.expiryDateSecs;
};

/**
 * Create a new ephemeral key pair with a random private key and nonce.
 *
 * @param params Additional parameters for the ephemeral key pair
 */
export const createEphemeralKeyPair = ({
  expiryDateSecs = nowSeconds() + TWENTY_FOUR_HOURS_IN_SECONDS,
  privateKey = Ed25519PrivateKey.generate(),
  ...options
}: Partial<ConstructorParameters<typeof EphemeralKeyPair>[0]> = {}) =>
  new EphemeralKeyPair({ expiryDateSecs, privateKey, ...options });
