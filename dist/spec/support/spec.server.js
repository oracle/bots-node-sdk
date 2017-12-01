"use strict";
const express = require("express");
const auth = require("basic-auth");
const OracleBot = require("../main");
const CONF = require("./spec.config");
const app = express();
// Add basic-auth for unit tests, not part of core middleware
app.use((req, res, next) => {
    const requestCredentials = auth(req);
    if (!requestCredentials || requestCredentials.name !== CONF.auth.user || requestCredentials.pass !== CONF.auth.pass) {
        res.status(401)
            .set('WWW-Authenticate', 'Basic realm="OracleBot Default Custom Component Service"')
            .end('Access denied');
    }
    else {
        next();
    }
});
// add prefixed /component middleware
app.use(CONF.componentPrefix, OracleBot.Middleware.init({
    root: __dirname,
    parser: CONF.parser,
    component: {
        baseDir: 'example/components',
        register: [
            './example/more.components/a.component'
        ]
    }
}));
// apply parser at the top level too.
app.use(OracleBot.Middleware.init({
    parser: CONF.parser
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
    // console.log(`spec server listening on :${CONF.port}`);
});
module.exports = server;
//# sourceMappingURL=spec.server.js.map