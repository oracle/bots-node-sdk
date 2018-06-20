# Custom Component Starter

Quick start application for Oracle Bot Custom Component development.

## Usage

```shell
# install dependencies
npm install
# start server
node index.js
# get component metadata (endpoint for service configuration in bots platform)
curl -X GET localhost:3000/components
# invoke custom component
curl -H "Content-Type: application/json" -d @sample.req.json localhost:3000/components/hello.world
```