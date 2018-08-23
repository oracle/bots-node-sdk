#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const indexFile = path.resolve('docs', 'index.html');
let index = fs.readFileSync(indexFile).toString();

// update heading anchors with corresponding id attr
index = index.replace(/<(h[1-6])>([\w\s-]+)<\/h[1-6]>/gi, (match, p1, p2) => {
  return `<${p1} id="${p2.replace(/\W+/g, '-').toLowerCase()}">${p2}</${p1}>`;
});

// remove [nodoc] blocks
index = index.replace(/<!--\s*\[nodoc\]\s*-->[\s\S]+?(?=<!)<!--\s*\[\/nodoc\]\s*-->/g, '');

fs.writeFileSync(indexFile, index);
