// The deployment's credential store and explicit bootstrap bindings. Cloud sign-up replaces
// this file with its managed KMS store configuration; secret values stay in protected host config.
// A local or BYOC deployment can select its own store here without changing connector references.
export const secrets = {
  bindings: {
    SANOMA_SIGNING_KEY: { bootstrap: "SANOMA_SIGNING_KEY" },
    SANOMA_SECRETS_KEY: { bootstrap: "SANOMA_SECRETS_KEY" },
  },
} as const;
