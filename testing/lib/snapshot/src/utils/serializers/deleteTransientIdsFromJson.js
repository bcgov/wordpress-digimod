// remove React and Angular ids, which are transient
module.exports = function deleteTransientIdsFromJson(json) {
  if (json.attributes) {
    delete json.attributes["data-reactid"];

    Object.keys(json.attributes)
      .filter((key) => key.startsWith("_ng"))
      .forEach((attr) => delete json.attributes[attr]);
    delete json.attributes[""];
  }

  if (Array.isArray(json.childNodes)) {
    json.childNodes.forEach(deleteTransientIdsFromJson);
  }
  return json;
};
