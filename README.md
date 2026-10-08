# company-template

Starting point for a company's own Sanoma configuration repo. Create a new repo from this template, then describe the company's business processes as code: workflows that call vendors through connectors, a policy that decides which calls need a person's approval, and a ledger that records what happened. Sanoma runs them durably on Postgres.

Status: early. The `@sanoma/*` packages are at 0.x and the API may change between minor versions.

## Layout

```
├── sanoma.config.ts   workflows, connectors, drivers, policy and ledger for the worker
├── workflows/         one file per workflow (defineWorkflow)
├── policies/          policy.ts (definePolicy): allows everything until you change it
├── resources/         finance/, people/, identity/, billing/ (empty: resources come after the MVP)
└── test/              lint.test.ts checks workflows/ and policies/ are safe to replay
```

Run state goes to `.sanoma/` (ignored), including the ledger: one JSONL file per run in `.sanoma/ledger/`.

## Run

Needs Node 24 or later, pnpm and Docker.

```sh
pnpm install
pnpm db:up      # Postgres 17 on localhost:5434
pnpm test       # also: pnpm typecheck, pnpm lint, pnpm format:check
pnpm db:down
```

The worker uses `SANOMA_DATABASE_URL`, else `postgresql://postgres:dbos@localhost:5434/company`. Tests use databases of their own, one per test file (`testDatabaseUrl("<file>")` from `@sanoma/testing` gives `company_test_<file>`; `SANOMA_TEST_DATABASE_URL` changes the base), so they never pick up runs started against the development one.

Until the `@sanoma/*` packages are published to npm, `pnpm install` cannot resolve them. Build tarballs from the sanoma repo with `pnpm pack`, put them in `.packs/`, and point each dependency at its tarball (`"@sanoma/workflows": "file:.packs/sanoma-workflows-0.1.0.tgz"`), as Sanoma's own configuration repo does.

## Add a workflow

1. Add the connector for each vendor the workflow calls, such as `@sanoma/connector-ghost`.
2. Write `workflows/<name>.ts`. It lists every operation it calls in `uses`, and `ctx` exposes those and nothing else:

   ```ts
   import { ghost } from "@sanoma/connector-ghost";
   import { defineWorkflow } from "@sanoma/workflows";
   import { z } from "zod";

   export default defineWorkflow({
     name: "publish-post",
     trigger: "manual",
     input: z.object({ title: z.string(), html: z.string() }),
     uses: [ghost.post.create, ghost.post.publish, "approval"],
     run: async (ctx, { title, html }) => {
       const post = await ctx.ghost.post.create({ title, html, status: "draft" });
       // Covers the publish, so a policy using `approvedFor` lets it through on this sign-off.
       await ctx.approval("Review the post", { approver: "editor", links: [post.url], covers: [ghost.post.publish] });
       return ctx.ghost.post.publish({ id: post.id });
     },
   });
   ```

   Workflows are replayed after a restart, so they must do the same thing every time: use `ctx.now()` and `ctx.sleep()` instead of `Date` and timers, take configuration as input instead of `process.env`, and import only from `@sanoma/*`, zod and relative files. `pnpm lint` (with the rules `@sanoma/workflows` ships, which `.oxlintrc.json` extends) and `pnpm test` check for this.

3. In `sanoma.config.ts`, add the workflow to `workflows`, its connectors to `connectors`, and a driver for each vendor to `drivers`. Until you have real drivers, each connector's fake stands in: `fakeGhost`, `fakeResend` and `fakeBluesky` from `@sanoma/connector-ghost/fake` and so on. Pass them one `calls` array to see every vendor's calls in one order, and `{ file: ".sanoma/fake-ghost.json" }` to keep a fake's state on disk.
4. Decide what needs approval in `policies/policy.ts`; the comment there shows the pattern (`approvedFor`).
5. Add a test that starts a worker with the config (`startTestWorker` from `@sanoma/testing`, on `testDatabaseUrl("<file>")`), starts the workflow with `SanomaClient` as someone (`startedBy: { id: "alice" }`), decides its approvals (`client.decide(runId, { decision: "approve", by: { id: "editor" } })`) and checks the ledger. Branch on `errorCode(err)`, not `instanceof`.

## Versions

Every run is stamped with the version of the worker that started it, `<appName>@<hash>`, and only a worker on that version picks it up after a restart. The version is automatic: a hash of each workflow's name, the source of its `run` function, its operations and its input schema. It does not see helper functions that `run` calls from elsewhere, the connectors' schemas, the drivers or the policy, so change those with no run in flight. `DBOS__APPVERSION` names a version instead.

When a worker starts, it warns about unfinished runs it will not pick up, naming them: runs started on another version. Run that version to finish them, or reset the local database with `pnpm db:down && pnpm db:up`.

## Credentials

Vendor credentials live in a secret store, never in this repo. Do not commit tokens, API keys or `.env` files.

## License

[Apache License 2.0](LICENSE).

## Contributing

Contributions are accepted under the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). Sign off every commit with `git commit -s`. See the org-wide contributing guide, code of conduct and security policy in [`Sanoma-AI/.github`](https://github.com/Sanoma-AI/.github).
