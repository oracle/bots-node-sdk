function camelize(str) {
  return str.replace(/^\W+/, '').replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/\W/g, '');
}

module.exports = {
  camelize,
};
