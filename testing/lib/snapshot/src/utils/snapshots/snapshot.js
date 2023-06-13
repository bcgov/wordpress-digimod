const serializeDomElement = require("../serializers/serializeDomElement");
const serializeToHTML = require("../serializers/serializeToHTML");
const compareValues = require("./compareValues");
const { initStore } = require("snap-shot-store");
const path = require("path");
const identity = (x) => x;

const pickSerializer = (asJson, value) => {
  if (Cypress.dom.isJquery(value)) {
    return asJson ? serializeDomElement : serializeToHTML;
  }
  return identity;
};

const newStore = (name) => {
  return initStore(name);
};

const store_snapshot = (store, props = { value, name, path, raiser }) => {
  const expectedPath = path.join(
    props.path ||
      Cypress.config("snapshot").snapshotPath ||
      "cypress/snapshots",
    `${props.name.join("_").replace(/ /gi, "-").replace(/\//gi, "-")}.json`
  );
  cy.task("readFileMaybe", expectedPath).then((exist) => {
    if (exist && !Cypress.env().SNAPSHOT_UPDATE) {
      props.raiser({ value: props.value, expected: JSON.parse(exist) });
    } else {
      cy.writeFile(expectedPath, JSON.stringify(props.value));
    }
  });
};

const set_snapshot = (
  store,
  { snapshotName, snapshotPath, serialized, value }
) => {
  if (!store) return;

  let devToolsLog = { $el: serialized };

  if (Cypress.dom.isJquery(value)) {
    devToolsLog.$el = value;
  }

  const options = {
    name: "snapshot",
    message: Cypress._.last(snapshotName),
    consoleProps: () => devToolsLog,
  };

  if (value) options.$el = value;

  const raiser = ({ value, expected }) => {
    const result = {value:JSON.stringify(expected)!=JSON.stringify(value)}; //compareValues({ expected, value });
    if (!Cypress.env().SNAPSHOT_UPDATE && result.value) {
      if (result.orElse){
      result.orElse((json) => {
        devToolsLog = {
          ...devToolsLog,
          message: json.message,
          expected,
          value,
        };

        throw new Error(
          `Snapshot Difference found.\nPlease Update the Snapshot\n\n${json.message.replaceAll(' ', '&nbsp;')}`
        );
      });
    }else{
      throw new Error(
        `Snapshot Difference found.\nPlease Update the Snapshot\n\n Expected: ${expected.html} \n\n Received: ${value.html}`
      );
    }
    }
  };
  Cypress.log(options);

  store_snapshot(store, {
    value,
    name: snapshotName,
    path: snapshotPath,
    raiser,
  });
};

const get_snapshot_name = (test, custom_name) => {
  const names = test.titlePath;

  const index = custom_name;
  names.push(String(index));

  if (custom_name) return [custom_name];
  return names;
};

module.exports = (value, step, options) => {
  if (typeof step === "object") options = step;
  if (typeof value !== "object" || Array.isArray(value))
    value = { data: value };

  const serializer = pickSerializer(options.json, value);
  const serialized = serializer(value);
  const store = newStore(serialized || {});

  set_snapshot(store, {
    snapshotName: get_snapshot_name(
      Cypress.currentTest,
      options.snapshotName || step
    ),
    snapshotPath: options.snapshotPath,
    serialized,
    value,
  });
};
