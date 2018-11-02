const fs = require('fs');
const path = require('path');
const Tmpl = require('../../bin/lib/templates');
const Helper = require('./helper');

describe('Templating', () => {
  let tempDir;
  beforeAll(() => tempDir = Helper.mkTempDir());
  beforeAll(() => spyOn(console, 'log'));
  beforeAll(() => spyOn(console, 'warn'));

  it('should write template synchronously', () => {
    // eslint-disable-next-line
    const placeholder = '{{placeholder}}'; // for templating
    const to = path.join(tempDir, 'specfile.js');
    Tmpl.writeTemplate(__filename, to, {placeholder: 'phval'});
    Tmpl.writeTemplate(__filename, to, {}); // intentionally dupe
    expect(console.warn).toHaveBeenCalled();
    expect(fs.existsSync(to)).toBe(true);
    expect(fs.readFileSync(to).toString()).toMatch(/placeholder.+phval/);

  });

  it('should write templates from directory', () => {
    const to = path.join(tempDir, 'tmpl');
    Tmpl.writeTemplates(__dirname, to);
    expect(fs.existsSync(to)).toBe(true);
  });

});
