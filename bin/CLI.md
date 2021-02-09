# CLI Developer Tools

This SDK includes a command-line intertace (CLI) to help you create and package custom components and entity event handlers.

```text
Usage: bots-node-sdk [command] [arguments][options]

bots-node-sdk Options:

  -h --help       Display help and usage information
  -v --version    Print version information

Commands:

  init            Create and initialize a component package
  init component  Add a component to a package
  service         Start a service with one or more component packages
  pack            Create a deployable component artifact
```

## CLI Installation

For standalone usage, there are a three ways you can execute CLI commands.

1. Globally install the Bots Node SDK using `npm install -g @oracle/bots-node-sdk`, and use `bots-node-sdk` to invoke the commands.
1. Install the Bots Nods SDK locally as a project dependency, as described later in this section, and use `$(npm bin)/bots-node-sdk` to invoke the commands.
1. Use [`npx`](https://www.npmjs.com/package/npx) to invoke the commands. For example: `npx @oracle/bots-node-sdk`

**Global Usage:**

Here are two ways to create fresh component service package in an empty directory. In this example, the SDK was installed globally.

```shell
# Run in an empty directory
bots-node-sdk init

# or specify a specific path to create and populate the directory
bots-node-sdk init my-project
```

When you use the `bots-node-sdk init` command to create the package, it lists `@oracle/bots-node-sdk` as a devDependency in the `package.json` file. The package file also points to some bots-node-sdk scripts. 

**Local Usage:**

Here's an example of installing `@oracle/bots-node-sdk` as a 
dependency to your project and using the CLI commands accordingly.

```shell
mkdir bot-quickstart
cd bot-quickstart

npm init -y
npm install --save-dev @oracle/bots-node-sdk
$(npm bin)/bots-node-sdk init
```

## Usage

| Command | Description |
|--|--|
| `init` | Generates source code for custom component service or event handler projects |
| `init component` |Adds a component to an existing project |
| `service` |Starts a local server and hosts the component package(s) |
| `pack` |Validates a project and creates a deployable component package |

### 1. Start a project: `init [dest] [options]`

Use this command to scaffold new projects.

When neither `[dest]` nor `--name` are provided, the command writes the artifacts are to the current directory. If you only provide `--name`, then the command creates a directory with the same name and writes the artifacts to that directory. If you don't provide `--name` then the component package is named `my-component-service`.


| Option | Description | Default |
|--|--|--|
| `-l --language` | The language to use: `[t]ypescript` or `[j]avascript` | `javascript` |
| `-c --component-name ` | The name for the initial component in your project | `helloWorld` |
| `-t --component-type ` | The type of component to create: `[c]ustom` or `[e]ntityEventHandler` to create | `custom` |
| `-s --skip-install` | Skip invoking the `npm install` command to install named dependencies after code generation | The command isn't skipped |
| `-r --run` | Start the component service after the command completes | The service isn't started |
| `-n --name ` | The name for the component package.|`my-component-service`|

### 2. Add Components: `init component <name> <type> [dest]`

Run this command in the component package's top-level directory to create a custom component or event handler. The component's language is the same as the language that you specified when you ran the `init` command to create the component package.

If `dest` isn't specified, then the component is written to the `components` directory for JavaScript and the `src/components` directory for TypeScript. If this directory doesn't exist, it will be created.
The component `name` and `type` arguments are required, and `type` must be either `[c]ustom` or `[e]ntityEventHandler`.

For example, to create a new entity event handler component named `resolvePizza`, you can use this command:

```shell
bots-node-sdk init component resolvePizza e
```

### 3. Start Dev Server: `service [...packages] [options]`

Starts a server with one _or more_ component packages. If no packages are provided, then it starts a service for the package that's in the current folder.

If you need to use the `@oracle/bots-node-sdk` dev dependency instead of the globally-installed Bots Node SDK, use `npm start` instead.

> **NOTE:** This command fails if none of the component packages' package.json files specify `express` as a `devDependency`.

| Option | Description | Default |
|--|--|--|
| `-P --port <number>` | The port to use for the service runtime | `3000` |
| `-r --route <path>` | The service endpoint for the components | `/components` |

> **NOTE:** Open a node debugger port on the service with `node --inspect $(which bots-node-sdk) service .`, or, if on Windows,
`node --inspect node_modules/@oracle/bots-node-sdk/bin/sdk.js service .` 

You also can use a node supervisor in the same way.

### 4. Package for Deployment: `pack [options]`

This command packages the components as a `.tgz` file that can be hosted as an express service, uploaded to a skill's embedded container in Digital Assistant, or uploaded to Oracle Mobile Hub.

| Option | Description | Default |
|--|--|--|
|`-d --dry-run`|Validate the project but don't create a `.tgz` file.| `false` |
|`-s --service <type>`|The service type to use in the packaging: `embedded`, `express`, or `mobile-api`<br><br>The command uses standard `npm pack` for `embedded`.|`embedded`|
|`-e --endpoint <url>`|The endpoint to use for the components' metadata | `/components` |
