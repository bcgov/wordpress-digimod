/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/server-side-render":
/*!******************************************!*\
  !*** external ["wp","serverSideRender"] ***!
  \******************************************/
/***/ ((module) => {

module.exports = window["wp"]["serverSideRender"];

/***/ }),

/***/ "./blocks/search-results/index.js":
/*!****************************************!*\
  !*** ./blocks/search-results/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/server-side-render */ "@wordpress/server-side-render");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('digimod-plugin/search-results', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Digital Gov - Search Results'),
  description: 'Used to display Search Results',
  category: 'digimod-plugin',
  icon: 'search',
  edit: props => {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_server_side_render__WEBPACK_IMPORTED_MODULE_3__, {
      block: "digimod-plugin/search-results",
      attributes: props.attributes
    }));
  }
});

/***/ }),

/***/ "./blocks/vue-blocks/custom-filter-vue-block.js":
/*!******************************************************!*\
  !*** ./blocks/vue-blocks/custom-filter-vue-block.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");




const APP_NAME = 'wcag-filter';
const APP_ROOT_CLASS = 'digimod-vue-app-root';
const APP_BLOCK_CLASS = 'digimod-wcag-filter-app';
class VueAppEditorComponent extends _wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Component {
  componentDidMount() {
    this.initVueApp();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.attributes !== this.props.attributes) {
      this.initVueApp();
    }
  }
  initVueApp() {
    // Assuming 'initVueApp' is a function in your Vue JavaScript that starts the Vue app
    // window.initVueApp('#app');
  }
  render() {
    const {
      className,
      columns,
      postType,
      postTypeLabel
    } = this.props.attributes;
    const postTypes = [{
      label: 'WCAG card',
      value: 'wcag-card'
    }, {
      label: 'Training card',
      value: 'training-card'
    }, {
      label: 'Common Component',
      value: 'common-components'
    }];
    const postTypeOptions = postTypes.map(type => ({
      label: type.label,
      value: type.value
    }));
    const selectedOption = postTypes.find(type => type.value === postType);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: 'Block Settings',
      initialOpen: true
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: 'Card Type',
      value: postType,
      options: postTypeOptions,
      onChange: newPostType => {
        const selectedPostType = postTypes.find(type => type.value === newPostType);
        const newPostTypeLabel = selectedPostType ? selectedPostType.label : postTypeLabel;
        this.props.setAttributes({
          postType: newPostType,
          postTypeLabel: newPostTypeLabel
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: 'Columns',
      value: columns,
      onChange: newColumns => this.props.setAttributes({
        columns: newColumns
      })
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {
      className: `${APP_ROOT_CLASS} ${APP_BLOCK_CLASS} ${className} has-text-align-center has-gray-40-background-color has-background`.trim(),
      'data-vue-app': APP_NAME,
      'data-columns': columns,
      'data-post-type': postType,
      'data-post-type-label': postTypeLabel,
      style: {
        padding: '2rem'
      }
    }, `Card Filtering App Placeholder | ${selectedOption ? selectedOption.label : ''}s selected`));
  }
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('digimod-plugin/custom-filter-block', {
  title: 'Card Filtering App',
  icon: 'filter',
  category: 'common',
  attributes: {
    className: {
      type: 'string',
      default: 'card-filter'
    },
    columns: {
      type: 'number',
      default: 3
    },
    postType: {
      type: 'string',
      default: 'wcag-card' // Set a default option
    },
    postTypeLabel: {
      type: 'string',
      default: 'WCAG card' // Default label
    }
  },
  edit: VueAppEditorComponent,
  save: ({
    attributes
  }) => {
    const {
      className,
      columns,
      postType,
      postTypeLabel
    } = attributes;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)('div', {
      className: `${APP_ROOT_CLASS} ${APP_BLOCK_CLASS} ${className}`.trim(),
      'data-vue-app': APP_NAME,
      'data-columns': columns,
      'data-post-type': postType,
      'data-post-type-label': postTypeLabel
    }, 'Loading Card Filtering App...');
  }
});

/***/ }),

/***/ "./blocks/vue-blocks/glossary-vue-block.js":
/*!*************************************************!*\
  !*** ./blocks/vue-blocks/glossary-vue-block.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");





const APP_NAME = 'glossary';
const APP_ROOT_CLASS = 'digimod-vue-app-root';
const APP_BLOCK_CLASS = 'digimod-glossary-block';
const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALLOWED_HTML_TAGS = new Set(['p', 'div', 'span', 'strong', 'br', 'a']);
const ALLOWED_HTML_ATTRIBUTES = {
  p: new Set(['style']),
  div: new Set(['style']),
  span: new Set(['style']),
  a: new Set(['href', 'target', 'rel', 'title', 'aria-label', 'style'])
};
const TITLE_HEADING_OPTIONS = [{
  label: 'H1',
  value: 'h1'
}, {
  label: 'H2',
  value: 'h2'
}, {
  label: 'H3',
  value: 'h3'
}, {
  label: 'H4',
  value: 'h4'
}];
function getHeadingCascade(titleHeadingLevel = 'h1') {
  const titleIndex = Math.max(HEADING_LEVELS.indexOf(titleHeadingLevel), 0);
  return {
    title: HEADING_LEVELS[titleIndex],
    letter: HEADING_LEVELS[Math.min(titleIndex + 1, HEADING_LEVELS.length - 1)],
    entry: HEADING_LEVELS[Math.min(titleIndex + 2, HEADING_LEVELS.length - 1)]
  };
}
function sanitizeUrl(url = '') {
  const trimmedUrl = url.trim();
  if (!trimmedUrl || /^\s*(javascript:|data:)/i.test(trimmedUrl)) {
    return '';
  }
  return trimmedUrl;
}
function sanitizeLimitedHtml(html = '') {
  if (!html) {
    return '';
  }
  const parser = new window.DOMParser();
  const documentFragment = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const sourceRoot = documentFragment.body.firstElementChild;
  const outputRoot = window.document.createElement('div');
  const appendChildren = (sourceNode, targetNode) => {
    Array.from(sourceNode.childNodes).forEach(childNode => {
      if (window.Node.TEXT_NODE === childNode.nodeType) {
        targetNode.appendChild(window.document.createTextNode(childNode.textContent || ''));
        return;
      }
      if (window.Node.ELEMENT_NODE !== childNode.nodeType) {
        return;
      }
      const tagName = childNode.tagName.toLowerCase();
      if (!ALLOWED_HTML_TAGS.has(tagName)) {
        appendChildren(childNode, targetNode);
        return;
      }
      const sanitizedElement = window.document.createElement(tagName);
      Array.from(childNode.attributes).forEach(attribute => {
        if (!ALLOWED_HTML_ATTRIBUTES[tagName]?.has(attribute.name)) {
          return;
        }
        if ('href' === attribute.name) {
          const safeUrl = sanitizeUrl(attribute.value);
          if (!safeUrl) {
            return;
          }
          sanitizedElement.setAttribute('href', safeUrl);
          return;
        }
        sanitizedElement.setAttribute(attribute.name, attribute.value);
      });
      if ('_blank' === sanitizedElement.getAttribute('target') && !sanitizedElement.getAttribute('rel')) {
        sanitizedElement.setAttribute('rel', 'noopener noreferrer');
      }
      appendChildren(childNode, sanitizedElement);
      targetNode.appendChild(sanitizedElement);
    });
  };
  if (sourceRoot) {
    appendChildren(sourceRoot, outputRoot);
  }
  return outputRoot.innerHTML;
}
function prepareLimitedPreviewHtml(value = '') {
  const normalizedValue = value.replace(/\r\n?/g, '\n').trim();
  if (!normalizedValue) {
    return '';
  }
  const htmlCandidate = /<[a-z!/]/i.test(normalizedValue) ? normalizedValue : normalizedValue.split(/\n{2,}/).map(paragraph => `${paragraph.replace(/\n/g, '<br />')}`).join('');
  return sanitizeLimitedHtml(htmlCandidate);
}
class GlossaryVueBlockEditorComponent extends _wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Component {
  render() {
    const {
      className,
      title,
      titleHeadingLevel,
      intro,
      searchToolsTitle,
      showAllLabel,
      showTagCounts,
      browseTitle,
      suggestTitle,
      suggestBody,
      suggestEmail
    } = this.props.attributes;
    const headingCascade = getHeadingCascade(titleHeadingLevel);
    const introPreviewHtml = prepareLimitedPreviewHtml(intro);
    const suggestBodyPreviewHtml = prepareLimitedPreviewHtml(suggestBody);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
      title: "Glossary Settings",
      initialOpen: true
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: "Glossary title",
      value: title,
      onChange: value => this.props.setAttributes({
        title: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: "Glossary title heading level",
      value: titleHeadingLevel,
      options: TITLE_HEADING_OPTIONS,
      onChange: value => this.props.setAttributes({
        titleHeadingLevel: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextareaControl, {
      label: "Intro text",
      value: intro,
      help: "HTML allowed: p, div, span, strong, br, a",
      onChange: value => this.props.setAttributes({
        intro: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: "Sidebar title",
      value: searchToolsTitle,
      onChange: value => this.props.setAttributes({
        searchToolsTitle: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: "Clear button label",
      value: showAllLabel,
      onChange: value => this.props.setAttributes({
        showAllLabel: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: "Show tag counts in chip",
      checked: !!showTagCounts,
      onChange: value => this.props.setAttributes({
        showTagCounts: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: "Letter navigation title",
      value: browseTitle,
      onChange: value => this.props.setAttributes({
        browseTitle: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: "Contact section title",
      value: suggestTitle,
      onChange: value => this.props.setAttributes({
        suggestTitle: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextareaControl, {
      label: "Contact body",
      value: suggestBody,
      help: "HTML allowed: p, div, span, strong, br, a",
      onChange: value => this.props.setAttributes({
        suggestBody: value
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: "Contact email",
      value: suggestEmail,
      help: "Only add the email address",
      onChange: value => this.props.setAttributes({
        suggestEmail: value
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `${APP_ROOT_CLASS} ${APP_BLOCK_CLASS} ${className} has-white-background-color has-background`.trim(),
      "data-vue-app": APP_NAME,
      style: {
        border: '1px dashed #d3d3d3',
        borderRadius: '1rem',
        padding: '1.5rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      style: {
        color: 'rgb(162, 0, 0)',
        fontSize: '0.8rem',
        fontWeight: '700',
        letterSpacing: '0.04em',
        marginTop: 0,
        textTransform: 'uppercase'
      }
    }, "Definitions Glossary Block"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'minmax(200px, 28%) minmax(0, 1fr)'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'grid',
        gap: '1rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        alignItems: 'flex-start',
        background: '#fff',
        borderBottom: '1px solid rgb(241,241,241)',
        display: 'flex',
        justifyContent: 'space-between',
        paddingBlock: '1rem 0.5rem',
        paddingInline: 0
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        fontSize: '1.15rem',
        margin: 0
      }
    }, searchToolsTitle), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      type: "button",
      style: {
        background: 'transparent',
        border: 0,
        color: '#003366',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 700,
        margin: '0 0.33rem',
        padding: '0 0.66rem',
        textDecoration: 'underline'
      }
    }, showAllLabel)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      style: {
        color: 'rgb(162, 0, 0)',
        fontWeight: 'bold',
        marginBottom: 0,
        marginTop: '1rem'
      }
    }, "Auto-generated filterable tags chips", ' ', (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        fontWeight: 'normal',
        marginBottom: 0
      }
    }, showTagCounts ? 'Tag counts: visible' : 'Tag counts: hidden'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        fontSize: '1.15rem',
        borderBottom: '1px solid rgb(231,231,231)',
        paddingBlockEnd: '0.5rem'
      }
    }, browseTitle), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      style: {
        color: 'rgb(162, 0, 0)',
        fontWeight: 'bold',
        marginBottom: 0
      }
    }, "Auto-generated scroll-to letter links")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        background: '#f5f5f5',
        borderRadius: '0.25rem',
        padding: '1rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        fontSize: '1.15rem',
        marginBottom: 0
      }
    }, suggestTitle), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        fontSize: '1rem',
        marginBottom: 0
      },
      dangerouslySetInnerHTML: {
        __html: suggestBodyPreviewHtml
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        fontSize: '1rem',
        marginBottom: 0
      }
    }, "Email ", suggestEmail))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        paddingInline: '0.5rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(headingCascade.title, {
      style: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        marginTop: 0
      }
    }, title, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        color: 'rgb(162, 0, 0)',
        fontSize: '1rem',
        fontWeight: 'normal',
        position: 'relative',
        top: '-0.5rem'
      }
    }, ' ', "(", headingCascade.title.toUpperCase(), ")")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        marginBottom: '1rem'
      },
      dangerouslySetInnerHTML: {
        __html: introPreviewHtml
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        background: '#fff',
        borderRadius: '0.75rem',
        marginBottom: '1rem',
        padding: 0
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(headingCascade.letter, {
      style: {
        borderBottom: '1px solid #d3d3d3',
        fontSize: '1.75rem',
        marginBottom: 0,
        marginTop: 0
      }
    }, "A", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        color: 'rgb(162, 0, 0)',
        fontSize: '1rem',
        fontWeight: 'normal',
        paddingBottom: '0.5rem',
        position: 'relative',
        top: '-0.35rem'
      }
    }, ' ', "(", headingCascade.letter.toUpperCase(), ")"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        background: '#eef4ff',
        borderRadius: '0.75rem',
        fontSize: '1rem',
        padding: '1rem'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(headingCascade.entry, {
      style: {
        fontSize: '1.25rem',
        marginBottom: '0.5rem',
        marginTop: 0
      }
    }, "Aardvark", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        color: 'rgb(162, 0, 0)',
        fontSize: '1rem',
        fontWeight: 'normal',
        position: 'relative',
        top: '-0.15rem'
      }
    }, ' ', "(", headingCascade.entry.toUpperCase(), ")")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        color: 'rgb(162, 0, 0)'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, "Aggregated glossary terms "), "imported from site Definitions posts which are using the ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null, "'Show in glossary' "), "setting. Output includes grouped letter titles for navigation and definition-link dialog behaviours."))))));
  }
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('digimod-plugin/glossary-block', {
  title: 'Glossary',
  description: 'A two-column defintions-powered glossary with letter navigation and tag filtering.',
  icon: 'book-alt',
  category: 'common',
  attributes: {
    className: {
      type: 'string',
      default: 'digimod-glossary-block'
    },
    title: {
      type: 'string',
      default: 'Glossary'
    },
    titleHeadingLevel: {
      type: 'string',
      default: 'h1'
    },
    intro: {
      type: 'string',
      default: "It's important to have a shared vocabulary. The official CSBC glossary is the definitive guide for all BC Public Service employees."
    },
    searchToolsTitle: {
      type: 'string',
      default: 'Search tools'
    },
    showAllLabel: {
      type: 'string',
      default: 'Show all'
    },
    showTagCounts: {
      type: 'boolean',
      default: true
    },
    browseTitle: {
      type: 'string',
      default: 'Jump to'
    },
    suggestTitle: {
      type: 'string',
      default: 'Suggest a new glossary term'
    },
    suggestBody: {
      type: 'string',
      default: 'Send us your submission for review.'
    },
    suggestEmail: {
      type: 'string',
      default: 'do.contentdesign@gov.bc.ca'
    }
  },
  edit: GlossaryVueBlockEditorComponent,
  save: () => null
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./Src/admin.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_search_results_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blocks/search-results/index.js */ "./blocks/search-results/index.js");
/* harmony import */ var _blocks_vue_blocks_custom_filter_vue_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blocks/vue-blocks/custom-filter-vue-block.js */ "./blocks/vue-blocks/custom-filter-vue-block.js");
/* harmony import */ var _blocks_vue_blocks_glossary_vue_block_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blocks/vue-blocks/glossary-vue-block.js */ "./blocks/vue-blocks/glossary-vue-block.js");



const domReady = () => {
  // Search for and disabled the SearchWP quoted searches toggle. It causes some issue with metrics link tracking leading to a timeout when following links.
  //	Quoted search will continue to work even if turned off.
  const isSearchWPSettings = document.querySelector('body.searchwp_page_searchwp-settings');
  if (isSearchWPSettings) {
    const quotedSearchesToggle = document.querySelector('#swp-quoted_search_support');
    if (quotedSearchesToggle) {
      quotedSearchesToggle.setAttribute('disabled', 'disabled');
      let tmpWarning = document.createElement('p');
      tmpWarning.style.fontWeight = 'bold';
      tmpWarning.textContent = 'On the DigitalGov Website this must remain off to prevent issues with metrics tracking. Quoted searches will still work even with this disabled.';
      quotedSearchesToggle.parentNode.parentNode.appendChild(tmpWarning);
    }
  }
};
if ('complete' === document.readyState) {
  domReady();
} else {
  document.addEventListener('DOMContentLoaded', domReady);
}
})();

/******/ })()
;
//# sourceMappingURL=admin.js.map