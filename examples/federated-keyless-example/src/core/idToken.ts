// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { jwtDecode } from "jwt-decode";
import { EncryptedScopedIdToken, scopedPayloadSchema } from "./types";

export const decodeIdToken = (jwt: string): EncryptedScopedIdToken =>
  scopedPayloadSchema.parse(jwtDecode(jwt));

export const isValidIdToken = (
  jwt: string | EncryptedScopedIdToken
): boolean => {
  if (typeof jwt === "string") return isValidIdToken(decodeIdToken(jwt));

  // Check whether the token has an expiration, nonce, and is not expired
  if (!jwt.nonce) return false;

  return true;
};

export const validateIdToken = (
  jwt: string | EncryptedScopedIdToken
): EncryptedScopedIdToken | null => {
  if (typeof jwt === "string") return validateIdToken(decodeIdToken(jwt));
  return isValidIdToken(jwt) ? jwt : null;
};
