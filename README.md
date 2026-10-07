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

The worker uses `SANOMA_DATABASE_URL`, else `postgresql://postgres:dbos@localhost:5434/company`.

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
       await ctx.approval("Review the post", { approver: "editor", links: [post.url] });
       return ctx.ghost.post.publish({ id: post.id });
     },
   });
   ```

   Workflows are replayed after a restart, so they must do the same thing every time: use `ctx.now()` and `ctx.sleep()` instead of `Date` and timers, take configuration as input instead of `process.env`, and import only from `@sanoma/*`, zod and relative files. `pnpm test` lints for this.

3. In `sanoma.config.ts`, add the workflow to `workflows`, its connectors to `connectors`, and a driver for each vendor to `drivers`. Until you have real drivers, `fakeMarketingVendors()` from `@sanoma/testing` fakes Ghost, Resend and Bluesky.
4. Decide what needs approval in `policies/policy.ts`; the comment there shows the pattern.
5. Add a test that starts a worker with the config (`startWorker`), starts the workflow with `SanomaClient`, decides its approvals and checks the ledger.

## Credentials

Vendor credentials live in a secret store, never in this repo. Do not commit tokens, API keys or `.env` files.

## License

[Apache License 2.0](LICENSE).

## Contributing

Contributions are accepted under the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). Sign off every commit with `git commit -s`. See the org-wide contributing guide, code of conduct and security policy in [`Sanoma-AI/.github`](https://github.com/Sanoma-AI/.github).
