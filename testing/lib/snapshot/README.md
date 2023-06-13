# @datashard/snapshot

> Adds value / object / DOM element snapshot testing support to Cypress test runner

<details>
<summary>Changes between <code>@datashard/snapshot</code> and <code>@cypress/snapshot</code></summary>
<br>
They're mostly the same, as this is a fork of the Latter, though it's not a drop-in replacement.

Unlike `@cypress/snapshot`, this saves snapshots in their own files with a sensible default and strives to have ongoing Support for future Cypress Versions

</details>

<!-- [![NPM][npm-icon] ][npm-url] -->

## Install

Requires [Node](https://nodejs.org/en/) version 10 or above.

```sh
npm install --save-dev @datashard/snapshot
```

## Import

After installing, you need to add this snippet within your Cypress Support File (default: `cypress/support/e2e.{js,ts}`)

```js
require("@datashard/snapshot").register();
```

This registers a new command to create new snapshot or compare value to old snapshot

and add the following to your `cypress.config.{js,ts}`

```js
  e2e: {
    setupNodeEvents(on, config) {
      require("@datashard/snapshot").tasks(on, config)
    },
```

> **Note** \
> \
> `@datashard/snapshot` **requires** the `readFileMaybe` plugin to be included, which can be easily done using the code above

# Usage

Currently, if you want to take more than one snapshot, you need to pass a Step Name to prevent overwrites / test failures

```js
describe("my tests", () => {
  it("works", () => {
    cy.log("first snapshot");
    cy.wrap({ foo: 42 }).snapshot("foo");
    cy.log("second snapshot");
    cy.wrap({ bar: 101 }).snapshot("bar");
  });
});
```

In the above case, you can find the stored snapshot in their own files, mentioned above them

```jsonc
// cypress/snapshots/my-tests-works-foo.json
{ "foo": 42 }
// cypress/snapshots/my-tests-works-bar.json
{ "bar": 101 }
```

If you change the site values, the saved snapshot will no longer match, throwing an error

(picture taken from `cypress/snapshots/Arrays.json`)
![Snapshot mismatch](.github/assets/updated-mismatch.png)

Click on the `SNAPSHOT` step in the Command Log to see expected and current value printed in the DevTools.

### Options

You can control snapshot comparison and behavior through a few options.

```js
cy.get(...).snapshot({
  snapshotName: 'Snapshot Name',          // Overwrite the generated Snapshot name
  snapshotPath: 'cypress/not_snapshots', // Overwrite where the Snapshot should be stored
  json: false                           // convert DOM elements into JSON
})                                     // when storing in the snapshot file

// will save as
// cypress/not_snapshots/Snapshot-Name.json
```

You can also pass a "Step Name" to the Function

```js
cy.get(...).snapshot("Intercepted API Request")
// will save as
// cypress/snapshots/<context>-<describe>-<it>-Intercepted-API-Request.json
// to prevent duplications
```

or both

```js
cy.get(...).snapshot("Intercepted API Request", {
  snapshotPath: "cypress/snapshots/api",
  snapshotName: "first_intercept"
})

// will save as
// cypress/snapshots/api/first_intercept.json
```

### Configuration

This module provides some configuration options:

#### snapshot.snapshotPath

Sets the default Path for saving Snapshots (default: `cypress/snapshots`)

![Config Screenshot](./.github/assets/config.png)

#### `ENV` CYPRESS_UPDATE_SNAPSHOTS

Lets you pass a Env Variable to update failing Tests with the new Data

#

### Small print

Authors:

- Joshua &lt;[data@shard.wtf](mailto:data@shard.wtf)&gt;
- Gleb Bahmutov &lt;gleb@cypress.io&gt;

<br>
License: MIT - do anything with the code, but don't blame us if it does not work.

Support: If you find any problems with this module [open an issue](https://github.com/datashard/snapshot/issues) on Github

## MIT License

Copyright (c) 2017-2022 Cypress.io &lt;hello@cypress.io&gt; & Joshua &lt;data@shard.wtf&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/@datashard/snapshot.svg?downloads=true
[npm-url]: https://npmjs.org/package/@datashard/snapshot
[semantic-url]: https://github.com/semantic-release/semantic-release
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
