'use strict';

const child_process = require("child_process");
/**
 * Execute child processes as promise
 * @private
 */
class ChildPromise {
  static spawn(command, args, options) {
    return this._child('spawn', command, args, options);
  }
  static exec(command, options) {
    return new Promise((resolve, reject) => {
      const cb = (err, stdout, stderr) => {
        return err ? reject(stderr || err) : resolve(stdout);
      };
      return options ? child_process.exec(command, options, cb) : child_process.exec(command, cb);
    });
  }
  static _child(type, command, args, options) {
    return new Promise((resolve, reject) => {
      let [out, err] = ['', ''];
      const sub = child_process[type](command, args, options);
      if (sub.stdout) {
        sub.stdout.on('data', (data) => out += `${data}`);
      }
      if (sub.stderr) {
        sub.stderr.on('data', (data) => err += `${data}`);
      }
      sub.on('error', e => reject(e));
      sub.on('exit', code => {
        return code === 0 ? resolve(out.trim()) : reject(err);
      });
    });
  }
}
module.exports = {
  ChildPromise,
};
