const fs = require("fs");

module.exports = (filename) => {
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename, "utf8");
  }

  return false;
};
