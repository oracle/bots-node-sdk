# Main @oracle/bots-js-sdk entrypoint

This index is the top level entrypoint to this project.
Each export exposes its corresponding references as a namespace
from the associative '{name}.ts' file. As a result, consumers can access each
namespace as a key in the root module.

```javascript
const OracleBot = require('@oracle/bots-js-sdk');
OracleBot.Middleware //...
OracleBot.Util //...
// etc...
```