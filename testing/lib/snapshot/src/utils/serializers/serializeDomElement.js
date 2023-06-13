const sd = require("@wildpeaks/snapshot-dom");
const deleteTransientIdsFromJson = require("./deleteTransientIdsFromJson");

// converts DOM element to a JSON object
module.exports = function serializeDomElement($el) {
  // console.log('snapshot value!', $el)
  const json = sd.toJSON($el[0]);
  // console.log('as json', json)

  // hmm, why is value not serialized?
  if ($el.context.value && !json.attributes.value) {
    json.attributes.value = $el.context.value;
  }

  return deleteTransientIdsFromJson(json);
};
