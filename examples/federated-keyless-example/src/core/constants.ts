// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const devnetClient = new Aptos(
  new AptosConfig({ network: Network.DEVNET })
);

/// FIXME: Put your issuer url and client id here
export const AUTH0_ISS = ""; // e.g., "https://dev-xxxxxxxx.us.auth0.com/"
export const AUTH0_CLIENT_ID = "";
