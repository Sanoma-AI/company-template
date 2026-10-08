import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // DBOS is one runtime per process: run files one at a time.
    fileParallelism: false,
    // `testDatabaseUrl` from @sanoma/testing appends a suffix per file to this database's name.
    env: {
      SANOMA_TEST_DATABASE_URL:
        process.env.SANOMA_TEST_DATABASE_URL ?? "postgresql://postgres:dbos@localhost:5434/company_test",
    },
  },
});
