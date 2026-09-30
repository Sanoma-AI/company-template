# company-template

Starting point for a company's own Sanoma configuration repo. Create a new repo from this template, then describe the company's operational configuration (finance, people, identity, billing) as code; Sanoma plans and applies it to the vendors it connects to.

Status: skeleton only; the files below are empty placeholders.

## Contents

```
├── sanoma.config.ts   connectors, versions, state backend
├── resources/         finance/, people/, identity/, billing/ (YAML)
├── policies/          policies in TypeScript (compiled to Cedar)
├── workflows/         workflows such as onboarding and offboarding
└── sanoma.lock        pinned connector and module versions
```

## License

[Apache License 2.0](LICENSE).

## Contributing

Contributions are accepted under the [Developer Certificate of Origin](https://developercertificate.org/) (DCO). Sign off every commit with `git commit -s`. See the org-wide contributing guide, code of conduct and security policy in [`Sanoma-AI/.github`](https://github.com/Sanoma-AI/.github).
