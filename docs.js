#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const indexFile = path.resolve('docs', 'index.html');
let index = fs.readFileSync(indexFile);

index = `${index}`.replace(/<(h[1-6])>([\w\s-]+)<\/h[1-6]>/gi, (match, p1, p2) => {
  return `<${p1} id="${p2.replace(/\W+/g, '-').toLowerCase()}">${p2}</${p1}>`;
});

fs.writeFileSync(indexFile, index);