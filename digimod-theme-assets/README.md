# BCGov Block Theme support framework 
## Provides supplemental scripts and styles

A Vite-based BCGov Block Theme augmentation framework for adding additional built scripts and styles to a specific installation.

This allows for SCSS and vanilla Javascript module-based development by providing assets that can be uploaded as Asset Loader additions to the Media Library and enqueued to either the public facing or admin environment. 

The intent of this environment is to be used for lightweight additions to styles or DOM manipulation that is beyond the scope of what WordPress itself can manage inside the core block theme environment.

## Entry points

For public facing style updates use:
- `/styles/public-additional-styles.scss` for SCSS efforts
- `/scripts/public-additional-scripts.js` for Javascript efforts

There are occasions when the changes made to public facing styles should also be replicated in the block editing environment. So for any admin side specific style updates use:
- `/styles/admin-additional-styles.scss`

## Build files

For watching changes and generating new builds on save:
```
npm run build:watch
```

For one off builds:
```
npm run build
```

Files from either of these commands will be found in **`/dist/assets/`** – as noted above these files should then be uploaded to the Media Library and enqueued for Public or Admin use (or both) respectively. By default only styles are provided for enqueing on the admin side. You are safe to ignore any other files exported to the `dist` directory. It should also be noted that previous files uploaded and enqueued should be removed/deleted from the Media Library so as to not cause errors or unintended consequences.

## Helper functions

Additional helpers Javascript functions are in `/scripts/utils.js`. Should you need to add your own helper functions, this file has been provided and is chunked into its own build file:
- `qs`: a shorthand querySelect which returns the first element matching the given CSS selector within the given parent element
- `qsa`: a shorthand querySelectAll that returns an actual array of all elements matching the given CSS selector within the given parent element
- `createElement`: a better version of document.createElement that allows for creating an HTML element and passing in an object of attributes
- `addGlobalEventListener`: a utility function that attaches an event listener to the given parent element and triggers the callback function only if the event target matches the given selector 
- `findParentElementByClass`: finds the closest ancestor element with the specified class name from the given element