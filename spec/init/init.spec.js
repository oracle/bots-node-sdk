const OracleBot = require("../main");
const express = require('express');
const bodyParser = require('body-parser');

const { ParserMiddleware } = require("../../middleware/parser");
const { CommonProvider } = require("../../common/provider");

describe('Initialization', () => {

  let upstream;
  beforeAll(() => {
    // assign some unknown parsers
    upstream = {
      json: bodyParser.json(),
      urlencoded: bodyParser.urlencoded({extended: true}),
    };
  });
  
  it('should set logger', () => {
    let spy = spyOn(CommonProvider, 'register');
    OracleBot.init(null, {
      logger: console,
      parser: false,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should add parsers', () => {
    const router = express.Router();
    OracleBot.init(router);
    expect(router.stack.some(layer => layer.name.match(/parser/i))).toBe(true);
  });

  it('should support parser bypass', () => {
    let spy = spyOn(ParserMiddleware, 'extend');
    OracleBot.init(null, {parser: false});
    expect(spy).not.toHaveBeenCalled();
  });

  it('should support json parser bypass', () => {
    const router = express.Router();
    OracleBot.init(router, {
      parser: { json: false }
    });
    expect(router.stack.some(layer => layer.name.match(/jsonparser/i))).toBe(false);
  });

  it('should support urlencoded parser bypass', () => {
    const router = express.Router();
    OracleBot.init(router, {
      parser: { urlencoded: false }
    });
    expect(router.stack.some(layer => layer.name.match(/urlencoded/))).toBe(false);
  });

  it('should replace body parser middleware on application', () => {
    // apply unknown body parser
    const app = express();
    app.use(upstream.json);
    app.use(upstream.urlencoded);
    // test for replacement
    expect(app._router.stack.some(layer => layer.handle === upstream.json)).toBe(true);
    expect(app._router.stack.some(layer => layer.handle === upstream.urlencoded)).toBe(true);
    OracleBot.init(app);
    expect(app._router.stack.some(layer => layer.handle === upstream.json)).toBe(false);
    expect(app._router.stack.some(layer => layer.handle === upstream.urlencoded)).toBe(false);
  });

  it('should replace body parser middleware on router', () => {
    // apply unknown body parser
    const router = express.Router();
    router.use(upstream.json);
    router.use(upstream.urlencoded);
    // test for replacement
    expect(router.stack.some(layer => layer.handle === upstream.json)).toBe(true);
    expect(router.stack.some(layer => layer.handle === upstream.urlencoded)).toBe(true);
    OracleBot.init(router);
    expect(router.stack.some(layer => layer.handle === upstream.json)).toBe(false);
    expect(router.stack.some(layer => layer.handle === upstream.urlencoded)).toBe(false);
  });

});