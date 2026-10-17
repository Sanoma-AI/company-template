# company-template

The repository a company on [Sanoma](https://github.com/Sanoma-AI/sanoma) starts from: a `sanoma.config.ts`, a `publish-post` workflow with its scenarios, a policy, an empty `resources/` tree and an `AGENTS.md` for the coding agent that works in it.

## Start

In an empty directory:

```sh
npx sanoma
```

That copies this template (it ships inside the `sanoma` package), writes `.env` with a new `SANOMA_SECRETS_KEY`, installs, makes a git repository with a first commit, and runs the company: the worker and the app, on Postgres in Docker when none answers. Needs Node 24.2 or later (not 25), git and Docker.

Or create a repository from this template on GitHub, then in its checkout:

```sh
npm install         # or pnpm install
npx sanoma          # runs the company
```

The `sanoma` package's README is the manual: its commands, `.env`, the lint and the scenarios.

## This repository

It mirrors [`packages/sanoma/template/`](https://github.com/Sanoma-AI/sanoma/tree/main/packages/sanoma/template) in the sanoma repository, where the template is changed and tested (there, `.gitignore` is `gitignore`, since npm drops a package's `.gitignore`). This README and the license are this repository's own.

## License

[Apache License 2.0](LICENSE).

## Contributing

Contributions are accepted under the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). Sign off every commit with `git commit -s`. See the org-wide contributing guide, code of conduct and security policy in [`Sanoma-AI/.github`](https://github.com/Sanoma-AI/.github).
