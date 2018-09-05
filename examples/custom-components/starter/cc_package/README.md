# Custom Component Package Example

This example is in format of a Component Package.  Component Package is the recommended way to organize Bots Custom Components code.  Component Package allows the custom component code to be more portable to different runtime environments.

A Component Package contains the component code of one or more custom components.  The package as a unit can be embedded within a Component Service Wrapper to make up a complete Component Service.  There are Component Service Wrappers for different runtime environments.  The same component package can thus be used for running in different environments.  

## Custom Component Package format

A Component Package consists of the following:

- package.json
- main.js
- .npmignore
- component file(s)

### package.json

The package.json file needs to have a "main" entry that is entry point for the consuming wrapper application.  The example "main" entry is "main.js".

The package.json file has an optional entry for "@oracle/bots-node-sdk" in devDependencies, as the Bots Node SDK could be used to assist dev/test of the component package.  The runtime version of the SDK is specified by the service wrapper project package.json.  In some runtime environments, if the service wrapper does not specify the sdk version, the version specified by the component package dev dependency will be inspected.  Alternatively, the version spec of the SDK could also be listed in peerDependencies.

```javascript
{
  "name": "custom-component-default-pkg",
  "version": "1.0.0",
  "main": "main.js",
  "dependencies": {},
  "devDependencies": {
    "@oracle/bots-node-sdk": "^2.0.0"
  }
}
```

### main.js

main.js exports the settings of the package.  It has the following properties:

"components" - this is required property to specify the list of components the package exports.  The "components" property can be in one of the 2 formats below:

First, "components" can be an object with property names being component names, and property value being the corresponding component module.  For example:

```javascript
module.exports = {
  components: {
      'hello.world': require('./components/hello.world')
  }
};
```

This format is the same format as registry.js for users of prior samples.  You could simply rename registry.js to main.js.

Second, "components" can be an array of paths to component file or directory.  For example:

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

The main.js file will thus export all component modules or file/directory as the component package content.

### .npmignore

The .npmignore file is used when exporting the Component Package (see below).  It simply excludes the .tgz file from being included within the package export.

### component file(s)

There could be 1 or more component file(s) in a package.  The component files could be in different sub-directories.  The component code exports a metadata() method and an invoke() method.  See the [example](./components/hello.world.js).  

## Export the Component Package

A Component Package can be exported by running `npm pack` into a .tgz file.  This .tgz file contains all custom files needed to construct a complete custom component service.  The .tgz file can be extracted (tar -xvf name.tgz && mv package cc_package) and used within a Component Service Wrapper.

## Running in Nodejs Express (Component Service Wrapper)

See [starter example](../README.md)


