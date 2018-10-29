const express = require('express');

const app = express();
const service = require('./api');
service(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});