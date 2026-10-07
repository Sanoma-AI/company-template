import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { lintWorkflow } from "@sanoma/workflows";
import { describe, expect, it } from "vitest";

// Workflows and policies are replayed after a restart, so they must decide the same way
// every time: no clock, randomness, network or environment, and imports only from
// `@sanoma/*`, zod and relative files. `lintWorkflow` checks for exactly that.
const files = ["workflows", "policies"].flatMap((dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => join(dir, f)),
);

describe("lintWorkflow", () => {
  it.each(files.length ? files : ["(none)"])("%s has no problems", (file) => {
    if (file === "(none)") return;
    expect(lintWorkflow(readFileSync(file, "utf8"), file)).toEqual([]);
  });
});
