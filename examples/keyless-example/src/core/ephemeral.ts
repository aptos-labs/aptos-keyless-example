// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Ed25519PrivateKey, EphemeralKeyPair } from "@aptos-labs/ts-sdk";

export const EphemeralKeyPairEncoding = {
  decode: (e: any) => EphemeralKeyPair.fromBytes(e.data),
  encode: (e: EphemeralKeyPair) => ({
    __type: "EphemeralKeyPair",
    data: e.bcsToBytes(),
  }),
};

export const validateEphemeralKeyPair = (
  keyPair: EphemeralKeyPair
): EphemeralKeyPair | undefined =>
  isValidEphemeralKeyPair(keyPair) ? keyPair : undefined;

export const isValidEphemeralKeyPair = (keyPair: EphemeralKeyPair): boolean => {
  if (keyPair.isExpired()) return false;
  return true;
};

/**
 * Create a new ephemeral key pair with a random private key and nonce.
 *
 * @param params Additional parameters for the ephemeral key pair
 */
export const createEphemeralKeyPair = ({
  expiryDateSecs = BigInt(Math.floor(Date.now() / 1000)) + BigInt(24 * 60 * 60),
  privateKey = Ed25519PrivateKey.generate(),
  ...options
}: Partial<ConstructorParameters<typeof EphemeralKeyPair>[0]> = {}) =>
  new EphemeralKeyPair({ expiryDateSecs, privateKey, ...options });
