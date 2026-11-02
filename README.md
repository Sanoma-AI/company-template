# company-template

The repository a company on [Sanoma Cloud](https://www.sanoma.work) starts from: sign-up makes a private copy of it in your own GitHub account, writes you into `resources/people.ts` and your database and host into `resources/sanoma/infra.ts`, and runs it at `<company>.sanoma.work`. A company's operations as code: workflows that call vendors through connectors, the people who use it, Cedar policies that decide which calls wait for someone's approval, and the vendor objects it owns, declared as data. [AGENTS.md](AGENTS.md) describes the layout and the rules; the `sanoma` package's README (`node_modules/sanoma/README.md`) is the manual.

To start one without Sanoma Cloud, `npx sanoma` in an empty directory writes the same layout for a laptop, with the `sanoma` package's own template.

## Run

Needs Node 26 or later and pnpm (with [mise](https://mise.jdx.dev), `mise install` sets both up from `.mise.toml`).

```sh
pnpm install
pnpm dev      # the company's own Postgres (.sanoma/postgres), the worker and the app, at the printed address
pnpm check    # tsc, the lint, the policies, what the worker would refuse, the sites' build and types, and every scenario
```

Credentials never go in this repository: `.env` (ignored) holds this machine's, and the app's connector pages store a vendor's encrypted in the database. On Sanoma Cloud the host delivers them.

## License

[Apache License 2.0](LICENSE).

## Contributing

Contributions are accepted under the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). Sign off every commit with `git commit -s`. See the org-wide contributing guide, code of conduct and security policy in [`Sanoma-AI/.github`](https://github.com/Sanoma-AI/.github).
