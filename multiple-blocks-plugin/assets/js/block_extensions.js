// ------------
// Allow application of custom html attributes to various blocks, ex aria-label for list elements
// To build run: 
// wp-scripts build --webpack-src-dir=assets/js --output-path=dist
// ------------

// import assign from 'lodash.assign';
import { createHigherOrderComponent } from '@wordpress/compose';
const { addFilter } = wp.hooks;
const { __ } = wp.i18n;
import { select, subscribe } from '@wordpress/data'
import { parse } from '@wordpress/block-serialization-default-parser';

// Enable spacing control on the following blocks
const enableSpacingControlOnBlocks = [
    'core/list',
];


/**
 * Add spacing control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addSpacingControlAttribute = ( settings, name ) => {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableSpacingControlOnBlocks.includes( name ) ) {
        return settings;
    }
    // console.log("APPLY");
    // Use Lodash's assign to gracefully handle if attributes are undefined
    settings.attributes = Object.assign( settings.attributes, {
        ariaLabel: {
            type: 'string',
            default: '',
        },
    } );

    return settings;
};

addFilter( 'blocks.registerBlockType', 'extend-block-example/attribute/spacing', addSpacingControlAttribute );


// APPLY ATTRIBUTE
/**
 * External Dependencies
 */


/**
 * Add custom element class in save element.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
function applyExtraClass( extraProps, blockType, attributes ) {
    // Do nothing if it's another block than our defined ones.
    if ( ! enableSpacingControlOnBlocks.includes( blockType.name ) ) {
        return extraProps;
    }

	const { ariaLabel } = attributes;
	
    // console.log('visibleOnMobile: ', ariaLabel, extraProps, attributes);

	//check if attribute exists for old Gutenberg version compatibility
	//add class only when test = false
	if ( typeof ariaLabel !== 'undefined' && ariaLabel!='' ) {
        // console.log('ASSIGNING, extraprops: ', extraProps);
        Object.assign( extraProps, { 'aria-label': ariaLabel } );
		// extraProps.className = classnames( extraProps.className, 'mobile-hidden' );
	}

	return extraProps;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'editorskit/applyExtraClass',
	applyExtraClass
);

/* ARIA-LABEL FIX END */

/* Add custom classes to core blocks, so that blocks such as headers are styled correctly */

wp.domReady( () => {
    wp.blocks.registerBlockStyle( 'core/post-title', {
      name: '_ h1-heading',
      label: 'Digimod Page Title',
    //   isDefault: true
    } );
    // wp.blocks.unregisterBlockStyle( 'core/post-title', 'default' );
  } );

// function addListBlockClassName( settings, name ) {
//     if ( name == 'core/post-title' ) {
//         console.log("POST_TITLE SETTINGS: ", settings)
//         return settings;
//     }

//     // return lodash.assign( {}, settings, {
//     //     supports: lodash.assign( {}, settings.supports, {
//     //         className: true,
//     //     } ),
//     // } );
//     return settings;
// }

// wp.hooks.addFilter(
//     'blocks.registerBlockType',
//     'multiple-blocks-plugin/override-settings',
//     addListBlockClassName
// );


/* ADD CUSTOM CLASSES TO DEFAULT BLOCKS */
// const ALLOWED_BLOCKS = [ 'core/columns' ];
// const addClassNameInEditor = createHigherOrderComponent((BlockEdit) => {
//     return (props) => {
//         const { name, attributes } = props;
        
//         console.log('A: ', name)
//         // return early from the block modification
//         if (! ALLOWED_BLOCKS.includes(name)) {
//             return <BlockEdit {...props} />;
//         }
//         console.log('C: ', name)
//         const {
//             className,
//             hasBackgroundPattern,
//             backgroundPatternShape,
//             backgroundPatternColor
//         } = attributes;

//         // if ( ! hasBackgroundPattern ) {
//         //     return <BlockEdit {...props} />;
//         // }

//         // const backgroundPatternColorClassName = `has-${backgroundPatternColor}-background-pattern-color`;
//         // const backgroundPatternShapeClassName = `has-${backgroundPatternShape}-background-pattern-shape`;
//         return <BlockEdit {...props} className={`row`} />;
//         // return <BlockEdit {...props} className={`${className || ''} ayooo`} />;
//     };
// }, 'addClassNameInEditor');

// addFilter(
//     'editor.BlockListBlock',
//     'multiple-blocks-plugin/addClassNameInEditor',
//     addClassNameInEditor,
// );

// function saveSpacingAttributes(props, block, attributes) {

//     // return early from the block modification
//     if (! ALLOWED_BLOCKS.includes(block.name)) {
//         return props;
//     }

//     const {
//         className,
//         hasBackgroundPattern,
//         backgroundPatternShape,
//         backgroundPatternColor
//     } = attributes;

//     // if ( ! hasBackgroundPattern ) {
//     //     return props;
//     // }

//     // const backgroundPatternColorClassName = `has-${backgroundPatternColor}-background-pattern-color`;
//     // const backgroundPatternShapeClassName = `has-${backgroundPatternShape}-background-pattern-shape`;
//     console.log('save apply: ', block.name);
//     // return {...props, className: `${className || ''} has-background-pattern ${backgroundPatternColorClassName} ${backgroundPatternShapeClassName}`};
//     return {...props, className: `row`};
// }

// addFilter(
//     'blocks.getSaveContent.extraProps',
//     'namespace/backgroundPatterns/saveSpacingAttributes',
//     saveSpacingAttributes,
// );

// MANUALLY POPULATE EDITOR
function getTemplate(){
    console.log('getTemplate()..')
    return fetch("http://localhost:8888/wp-json/multiple-blocks-plugin/v1/author/1")
        .then((response) => {
            return response.json();
            
            // Do something with response
        }).then((jsn)=>{
            console.log('fetched: ', jsn);
            return jsn.content;
        })
        .catch(function (err) {
            console.log("Unable to fetch -", err);
        });
}


function processInnerBlocks(blockItems) {
    console.log('processInnerBlocks(): ', blockItems);

    return blockItems.map(blockItem => {
      let innerBlocks = blockItem['innerBlocks'] || [];
      if (innerBlocks.length) {
        console.log('recursive..');
        blockItem['innerBlocks'] = processInnerBlocks(innerBlocks);
      }
      return wp.blocks.createBlock(blockItem['blockName'], blockItem['attrs'], blockItem['innerBlocks']);
    });
  }
  
  
  

function addBlock(){
    getTemplate().then((template)=>{
        // console.log('got template: ', template);
        let parsed = parse(template);
        parsed.forEach((blockItem=>{
            console.log('inserting block: ', blockItem);
            if (blockItem['blockName']){
                // let insertedBlock = wp.blocks.createBlock(blockItem['blockName'], blockItem['attrs'], blockItem['innerBlocks']);
                let insertedBlock = wp.blocks.createBlock(blockItem['blockName'], blockItem['attrs'], processInnerBlocks(blockItem['innerBlocks']));

                // wp.data.dispatch( 'core/block-editor' ).insertBlock(insertedBlock);
            }
        }));
        // console.log('parsed: ', parsed);
    });
    

    // // console.log('addBlock()');
    // let content = "Test content";
    // let name = 'core/paragraph';
    // let insertedBlock = wp.blocks.createBlock(name, {
    //     content: content,
    // });
    // // wp.data.dispatch('core/editor').insertBlocks(insertedBlock);
    // wp.data.dispatch( 'core/block-editor' ).insertBlock(insertedBlock);
}


function whenEditorIsReady() {
    // console.log('whenEditorIsReady()');
    return new Promise((resolve) => {
        const unsubscribe = subscribe(() => {
            // This will trigger after the initial render blocking, before the window load event
            // This seems currently more reliable than using __unstableIsEditorReady
            if (select('core/editor').isCleanNewPost() || select('core/block-editor').getBlockCount() > 0) {
                unsubscribe()
                resolve()
            }
        })
    })
}

whenEditorIsReady().then(() => {
    addBlock();
  })