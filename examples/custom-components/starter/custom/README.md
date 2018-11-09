# Starter Custom Component Package

This example source is in format of a Component Package. Component Packages are the recommended way to organize Bots Custom Components code and allow the custom component code to be more portable to different runtime environments.

A Component Package contains the component code of one or more custom components. The package as a unit can be loaded within an application, constituting a complete service runtime. The same component package can thus be used for running in different environments.  

A Component Package consists of the following:

- package.json
- main.js
- .npmignore
- component file(s)

## Usage

```shell
# install dependencies
npm install

# start server
npm start

# get component metadata
curl -X GET localhost:3000/components

# invoke custom component
curl -H "Content-Type: application/json" -d @./spec/sample.req.json localhost:3000/components/hello.world
```

### package.json

The `package.json` file needs to have a "main" entry that is entry point for
the consuming application.  The example "main" entry is "main.js".

The `package.json` file has an optional entry for _"@oracle/bots-node-sdk"_ in
`devDependencies`, as the Bots Node SDK is used to assist dev/test of the component
package. Alternatively, the version spec of the SDK could also be listed in `peerDependencies`.

> **NOTE:** Certain runtime environments do not specify a required sdk version,
therefore the version specified by the component package's dependency will be inspected.

```javascript
{
  "name": "custom-component-default-pkg",
  "version": "1.0.0",
  "main": "main.js",
  "dependencies": {},
  "devDependencies": {
    "@oracle/bots-node-sdk": "^2.1.0"
  }
}
```

### main.js

main.js exports the settings of the Component package. It has the following properties:

| | |
|--|--|
| `components` | **Required** property to specify the list of components the package exports. The value can be one of the formats below |
| `cwd` | _Optional_ propety to specify the working directory from which paths in `components` are based |

---

`components` can be an object with property names being component names, and property value being the corresponding component module. For example:

```javascript
module.exports = {
  components: {
      'hello.world': require('./components/hello.world')
  }
};
```

This format is the same format as `registry.js` for users of prior samples.
Therefore, you could **simply rename** a `registry.js` to `main.js`, or specify
accordingly in `package.json`.

---

`components` can be a string, or array of paths to component files or directories. For example:

```javascript
module.exports = {
  components: [
    './components/hello.world'
  ]
};
```

or

```javascript
module.exports = {
  components: [
    './components'
  ]
};
```

or

```javascript
module.exports = {
  components: './components'
};
```

The main.js file will thus export all component modules or file/directory as the component package content.

### .npmignore

The .npmignore file is used when exporting the Component Package (see below). It simply excludes the .tgz file from being included within the package archive.

### component file(s)

There could be 1 or more component file(s) in a package.  Component files can be organized in different sub-directories, or paths within your project, as long as they are listed in the main `exports`.
Each custom component implementation exposes its `metadata()` and `invoke()` methods.  See the [example](./components/hello.world.js) and additional [documentation](https://oracle.github.io/bots-node-sdk/#custom-component-code)

## Export the Component Package

A Component Package can be exported for deployment by running `npm pack` into a .tgz file.  This .tgz file contains all custom files needed to construct a complete custom component runtime. 

## Running in Nodejs Express

See [starter example](../README.md) and
[CLI](https://github.com/oracle/bots-node-sdk/blob/master/bin/CLI.md) documentation
