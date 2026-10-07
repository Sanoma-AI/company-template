import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // DBOS is one runtime per process and the tests share one database: run files one at a time.
    fileParallelism: false,
  },
});
