// The Sanoma configuration for this company: what the worker runs, against which vendors,
// under which policy, and where the audit record goes.
//
// Never put credentials in this file or anywhere in this repo. Drivers read their
// credentials from the environment (filled from a secret store).
import { defineConfig, jsonlLedger } from "@sanoma/workflows";
import policy from "./policies/policy.ts";

export default defineConfig({
  // Workflows from workflows/, e.g. `import announce from "./workflows/announce.ts"`.
  workflows: [],
  // The connectors (from @sanoma/connector-*) whose operations the workflows use.
  connectors: [],
  // One driver per vendor, implementing the connectors' operations. Until you have real
  // drivers, `fakeMarketingVendors()` from @sanoma/testing fakes Ghost, Resend and Bluesky.
  drivers: [],
  policy,
  ledger: jsonlLedger(".sanoma/ledger"),
  appName: "company",
  databaseUrl: process.env.SANOMA_DATABASE_URL ?? "postgresql://postgres:dbos@localhost:5434/company",
});
