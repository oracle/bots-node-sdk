# CLI Developer Tools

This SDK includes a CLI with developer-oriented productivity tools.
Presently these tools are geared towards **Custom Component** development.

```text
Usage: bots-node-sdk [options] <subcommand> [options]

Options:

  -h --help       Display help and usage information
  -v --version    Print version information

Subcommands:

  init       Initialize a new Custom Component package
  service    Start a service with Custom Component package(s)
  pack       Create a deployable Custom Component artifact
```

## Installation

For standalone usage, there are a two main options.

1. Use [`npx`](https://www.npmjs.com/package/npx) execute commands: `npx @oracle/bots-node-sdk`
1. Install globally: `npm install -g @oracle/bots-node-sdk`

When installed globally, run `bots-node-sdk init` in an empty directory
to generate a new project. Once installed, review the resulting `package.json`
for additional usage of the `@oracle/bots-node-sdk` dependency.

```shell
# in an empty directory
bots-node-sdk init
# or specify a specific path
bots-node-sdk init my-project
```

> Creates a fresh Custom Component package in an empty directory

As an alterative approach, install `@oracle/bots-node-sdk` as a dependency
dependency to your application, and use commands accordingly.

```shell
mkdir bot-quickstart
cd bot-quickstart

npm init -y
npm install --save-dev @oracle/bots-node-sdk
$(npm bin)/bots-node-sdk init
```

> Initializes a new Custom Component package from within an existing node project.

## Usage

| Command | Feature | Description |
|--|--|--|
| `init` | Components | Generates source code for Custom Component projects |
| `init component` | Components | Adds a component to an existing project |
| `service` | Components | Starts a local server for hosting a Component Package |
| `pack` | Components | Validates project and creates a deployable Component Package artifact |

### 1. Start a project: `init [options] [dest]`

Init is the main namespace used to scaffold new projects and/or augment existing
projects with more components. If provided, `[dest]` or `--name` will be used for the output directory.

| Option | Description | Default |
|--|--|--|
| `-s --skip-install` | Instruct the command to skip `npm install` after code generation | `false` |
| `-r --run` | Starts the custom component service after install completes | `false` |
| `-n --name <name>` | Specify a name for the component package. If not provided, the directory name, or existing `package.json` name will be used | |
| `-c --component-name <name>` | Use a name for the initial component in your project | `hello.world` |
| `-t --component-type <type>` | Specify the type `<custom,eventhandler>` of component to create | `custom` |

### 2. Add Components: `init component [options] <dest>`

This command will initialize a _new_ Custom Component within an **existing** component
package, and write to the `<dest>` output path.

| Option | Description | Default |
|--|--|--|
| `-n --name <name>` | Provide a name for the custom component | `hello.world` |
| `-t --type <type>` | Specify the type `<custom,eventhandler>` of component to create | `custom` |
| `-e --entity-name <name>` | Provide the entity name used if the `eventhandler` component type is specified. | `SomeEntity` |

### 3. Start Dev Server: `service [options] [...packages]`

Starts a server with one _or more_ Component Packages. **NOTE** this requires
`express` as a `devDependency` in at least one of the component packages, and
will error if not found.

| Option | Description | Default |
|--|--|--|
| `-P --port <number>` | Specify port used for the service runtime | `3000` |
| `-r --route <path>` | Defines the service endpoint for components | `/components` |

> **NOTE:** Open a node debugger port on the service with `node --inspect $(which bots-node-sdk) service .`, or
`node --inspect node_modules/@oracle/bots-node-sdk/bin/sdk.js service .` if on Windows.
A node supervisor may also be used in the same way.

### 4. Package for Deployment: `pack [options]`

Most often, custom implementations can be packaged with `npm pack` or `zip`
depending on the deployment target. The `pack` command here is intended to
provide validation and convenience methods for creating a deployable artifact.

| Option | Description | Default |
|--|--|--|
| `-d --dry-run` | Flag to peform project validations without emitting any specific archive. **TIP:** Useful addition to `prepack` or `test` scripts | `false` |
| `-s --service <type>` | Specify a service type `<embedded,express,mobile-api>` to use in the packaging (uses standard `npm pack` for `embedded`) | `embedded` |
| `-e --endpoint <url>` | Provide the endpoint to use for components metadata | `/components` |
