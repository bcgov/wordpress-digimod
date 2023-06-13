const serializeToHTML = require("./serializers/serializeToHTML");
const serializeDomElement = require("./serializers/serializeDomElement");
const compareValues = require("./snapshots/compareValues");
const readFileMaybe = require("./tasks/readFileMaybe");
const identity = (x) => x;
const publicProps = (name) => !name.startsWith("__");
const countSnapshots = (snapshots) =>
  Object.keys(snapshots).filter(publicProps).length;

module.exports = {
  serializers: {
    serializeDomElement,
    serializeToHTML,
    identity,
    countSnapshots,
  },
  snapshots: {
    compareValues,
  },

  functions: {
    register: require("./functions/register"),
    tasks: require("./functions/addTasks"),
  },
  tasks: {
    readFileMaybe,
  },
};
