# Webhook Starter

Quick start application for Oracle Bot Webhook channel development.

## Usage

This starter uses environment variables for the webhook channel configuration - these can remain empty for simple test. Developers may choose alternate
approaches at their discretion. Additionally, the `WebhookClient` class supports
a callback function for `channel` configuration and is called with the express `req`
object on outbound messages - `webhook.receiver()`. Channel callback function may
return a Promise, or the configuration directly.

```shell
BOT_WEBHOOK_URL="https://..."
BOT_WEBHOOK_SECRET="..."
```

```shell
# install dependencies
npm install

# start server
node index.js

# send test message (will error without actual bot webhook channel configured)
curl -H "Content-Type: application/json" -d @sample.req.json localhost:3000/test/message
```