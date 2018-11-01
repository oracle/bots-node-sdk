const fs = require('fs');
const os = require('os');
const path = require('path');

let i = 0;
function mkTempDir() {
  const tmp = `_sdkspec_${Date.now() + i}`;
  const dir = path.join(os.tmpdir(), tmp);
  fs.mkdirSync(dir);
  i++;
  return dir;
}

module.exports = {
  mkTempDir,
};
