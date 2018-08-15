# Starter Custom Component Service Example

## Usage

```shell
# install dependencies
npm install

# start server
npm start

# get component metadata
curl -X GET localhost:3000/components

# invoke custom component
curl -H "Content-Type: application/json" -d @cc_package/spec/sample.req.json localhost:3000/components/hello.world
```

## Structure

This example demonstrates the use of component package for custom component code, and the use of nodejs express service wrapper for runtime

### Component Package

The component package is the cc_package directory that contains the custom component code.  See [cc_package/README.md](cc_package/README.md) for more information.

### Service Wrapper (expressjs)

This project minus the /cc_package directory is the service wrapper.  You can use the service wrapper to run any component package by replacing the /cc_package directory

```shell
# replace content of cc_package with your components

npm install

npm start
```

