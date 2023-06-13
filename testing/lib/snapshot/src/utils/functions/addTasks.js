const readFileMaybe = require("../tasks/readFileMaybe");

module.exports = (on, config) => {
  on("task", { readFileMaybe });
};
