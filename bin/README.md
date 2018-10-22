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

Installation is automatic when the `@oracle/bots-node-sdk` is installed as a
dependency to your application.

```shell
mkdir bot-quickstart
cd bot-quickstart

npm init -y
npm install --save-dev @oracle/bots-node-sdk
$(npm bin)/bots-node-sdk init --run
```

> Initializes a new Custom Component package

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

- `-s --skip-install` - Instruct the command to skip `npm install` after code generation
- `-r --run` - Starts the custom component service after install completes
- `-n --name <name>` - Specify a name for the component package. If not provided, the directory name, or existing `package.json` name will be used
- `-c --component-name <name>` - Use a name other than the default `hello.world` for the initial component in your project

### 2. Add Components: `init component [options] <dest>`

This command will initialize a _new_ Custom Component within an **existing** component
package, and write to the `<dest>` output path.

- `-n --name <name>` - Provide a name for the custom component

### 3. Start Dev Server: `service [options] [...packages]`

Starts a server with one _or more_ Component Packages. **NOTE** this requires
`express` as a `devDependency` in at least one of the component packages, and
will error if not found.

- `-P --port <number>` - Use a port other than the default `:3000` for the service
- `-r --route <path>` - Defines the service endpoint for Custom Components

### 4. Package for Deployment: `pack [options]`

Most often, custom implementations can be packaged with `npm pack` or `zip`
depending on the deployment target. The `pack` command here is intended to
provide validation and convenience methods for creating a deployable artifact.

- `-d --dry-run` - Flag to peform project validations without emitting any specific archive. **TIP:** Useful addition to `prepack` or `test` scripts