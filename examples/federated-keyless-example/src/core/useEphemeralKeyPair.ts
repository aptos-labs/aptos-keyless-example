// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from "react";
import { createEphemeralKeyPair } from "./ephemeral";
import { useFederatedKeylessAccounts } from "./useFederatedKeylessAccounts.ts";

export default function useEphemeralKeyPair() {
  const { commitEphemeralKeyPair, getEphemeralKeyPair } = useFederatedKeylessAccounts();

  const ephemeralKeyPair = useMemo(() => {
    let keyPair = getEphemeralKeyPair();

    // If no key pair is found, create a new one and commit it to the store
    if (!keyPair) {
      keyPair = createEphemeralKeyPair();
      commitEphemeralKeyPair(keyPair);
    }

    return keyPair;
  }, [commitEphemeralKeyPair, getEphemeralKeyPair]);

  return ephemeralKeyPair;
}
