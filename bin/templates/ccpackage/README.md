# Custom Component Package

This project is in format of a Component Package. The Component Package structure
is the recommended way to organize Bots Custom Components code. A Component
Package allows the custom component code to be more portable to different
runtime environments.

## Structure

```text
.
├── .npmignore
├── components
│   └── ...
├── main.js
├── package.json
└── spec
    └── ...
```

| | Description |
|--|--|
| `.npmignore` | Ignore files when packaging as `npm` module |
| `components` | Directory _(default)_ where Component implementations are added |
| `main.js` | Entrypoint for the Custom Component Package configuration |
| `spec` | Placeholder for unit test implementations |

## Development

With `@oracle/bots-node-sdk` as a `devDependency` in a Component Package
gives the project some valuable command line functionality.

```text
npm start
# or
npm run {{sdkBin}} -- service .
```

> **TIP:** Run `npm run {{sdkBin}}` for full help and usage information.

## Deployment

As this package is designed to be installed and run with a corresponding service
wrapper, simply `npm pack` and deploy the resulting tarball.

```text
npm pack
# or
npm run {{sdkBin}} -- pack .
```