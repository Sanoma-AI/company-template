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

GitHub Actions runs `pnpm check` on pull requests and pushes to main against a disposable Postgres service. Scenarios use connector fakes; the check neither provisions cloud resources nor needs vendor credentials.

Credentials never go in this repository: `.env` (ignored) holds this machine's, and the app's connector pages store a vendor's encrypted in the database. On Sanoma Cloud the host delivers them.

## Credential storage

`secrets.ts` selects the deployment's store and bootstrap bindings. The template starts with encrypted Postgres and independent host-supplied signing/encryption keys. Managed Cloud signup can replace this file with `managedKmsStore` configuration, supplying only the company's restricted database login and runtime identity bootstrap to its host. That managed integration is tracked in [Sanoma #532](https://github.com/Sanoma-AI/sanoma/issues/532); this template change alone does not deploy it.

For BYOC, select your own supported store in this file, such as Supabase Vault. Moving existing credentials requires an explicit transfer and cutover; changing the configuration does not migrate stored values. Keep the logical secret and connection names stable.

## License

[Apache License 2.0](LICENSE).

## Contributing

Contributions are accepted under the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). Sign off every commit with `git commit -s`. See the org-wide contributing guide, code of conduct and security policy in [`Sanoma-AI/.github`](https://github.com/Sanoma-AI/.github).
