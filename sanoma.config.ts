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
  // One driver per vendor, implementing the connectors' operations: the real one, e.g. `ghostDriver()`
  // from @sanoma/connector-ghost/driver, or its fake, e.g. `fakeGhost({ file: ".sanoma/fake-ghost.json" }).driver`
  // from @sanoma/connector-ghost/fake.
  drivers: [],
  // The fakes a Test run calls instead of the drivers, e.g. `fakeGhost()` from @sanoma/connector-ghost/fake.
  // The Test button on a workflow's page and `describeScenarios` from @sanoma/testing/scenarios run the
  // scenarios in scenarios/ against them; the policy, approvals and ledger stay as in a live run.
  fakes: [],
  scenarios: new URL("./scenarios/", import.meta.url),
  policy,
  ledger: jsonlLedger(".sanoma/ledger"),
  appName: "company",
  databaseUrl: process.env.SANOMA_DATABASE_URL ?? "postgresql://postgres:dbos@localhost:5434/company",
});
