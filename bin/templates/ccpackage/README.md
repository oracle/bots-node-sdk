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

> **TIP:** Use `npm run {{sdkBin}}` for additional CLI help and usage information.

This component package is ready to run as a local development service. Once the
service starts you may use a local tunnel, such as [`ngrok`](https://ngrok.com/),
and configure an _External_ Service to connect the components to your Skill.

```shell
npm start
# or run with additional options
npm run {{sdkBin}} -- service .
```

## Deployment

As this package is designed to be installed and run with a corresponding service
wrapper, simply `npm pack` and upload the resulting `.tgz` to the _Embedded Container_.

```shell
npm pack
# or validate and package
npm run {{sdkBin}} -- pack .
```