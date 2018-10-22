# Starter Custom Component Service

Standalone example implemementation of a Custom Component runtime

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

## Structure

This example demonstrates the use of component package for custom component code,
and the use of nodejs express service wrapper for runtime

### Component Code

Custom component code is located in the `./custom` directory, which constitues an
independently deployable "package", if using the platform's embedded container.
See [README.md](./custom/README.md) for more information.
