"use strict";
const express = require("express");
const OracleBot = require("../main");
const CONF = require("./spec.config");
const app = express();
// enable auth/parser at root level
app.use(OracleBot.Middleware.init({
    parser: CONF.parser,
    auth: {
        type: OracleBot.AUTH_TYPE.BASIC,
        credentials: CONF.auth,
    },
}));
// add prefixed /component middleware
app.use(CONF.componentPrefix, OracleBot.Middleware.init({
    root: __dirname,
    component: {
        baseDir: 'example/components',
        register: [
            './example/more.components/a.component'
        ]
    }
}));
// some things behind the bot MW
app.get('/', (req, res) => {
    res.send(CONF.messages.OK);
});
// to test parser
app.post('/echo', (req, res) => {
    res.json(req.body);
});
// export the http.Server for supertest
const server = app.listen(CONF.port, () => {
    console.log(`spec server listening on :${CONF.port}`);
});
module.exports = server;
//# sourceMappingURL=spec.server.js.map