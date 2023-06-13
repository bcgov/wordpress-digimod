module.exports = (html) => {
  const dataReactId = /data\-reactid="[\.\d\$\-abcdfef]+"/g;
  const angularId = /_ng(content|host)\-[0-9a-z-]+(="")?/g;
  return html.replace(dataReactId, "").replace(angularId, "");
};
