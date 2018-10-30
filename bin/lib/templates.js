const fs = require('fs');
const path = require('path');

function writeTemplates(from, to, vars) {
  const list = fs.readdirSync(from);
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }
  list.forEach(filename => {
    const src = path.join(from, filename);
    const stat = fs.statSync(src);
    const dest = path.join(to, filename.replace(/^_+/, ''));
    if (stat.isDirectory()) {
      return writeTemplates(src, dest, vars);
    }
    return writeTemplate(src, dest, vars);
  });
}

function writeTemplate(src, dest, vars) {
  if (fs.existsSync(dest)) {
    console.warn(`WARN: ${dest} already exists`);
    return;
  }
  console.log(`Writing file: ${dest}`);
  const template = fs.readFileSync(src).toString();
  const output = vars ? Object.keys(vars).reduce((temp, prop) => {
    return temp.replace(new RegExp(`{{${prop}}}`, 'gi'), vars[prop]);
  }, template) : template;
  return fs.writeFileSync(dest, output);
}

module.exports = {
  writeTemplate,
  writeTemplates,
};
