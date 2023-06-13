const compare = require("snap-shot-compare");
module.exports = function compareValues({ expected, value }) {
  const noColor = false;
  const json = true;
  return compare({ expected, value, noColor, json });
};
