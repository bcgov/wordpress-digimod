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
    // console.log('processInnerBlocks(): ', blockItems);

    return blockItems.map(blockItem => {
      let innerBlocks = blockItem['innerBlocks'] || [];
      if (innerBlocks.length) {
        // console.log('recursive..');
        blockItem['innerBlocks'] = processInnerBlocks(innerBlocks);
      }
      let attrs = blockItem['attrs'];
      if (!attrs['content'])
        attrs = {...blockItem['attrs'], 'content':blockItem['innerContent'][0]};

      
      // swap block into meta block if this block is a template block, so user can edit it and save custom fields from gutenberg
      console.log('=== checking inner: ', blockItem['blockName'])
      let insertedBlock = null;
      if(blockItem['blockName']=="multiple-blocks-plugin/template-h3-custom-field"){
          attrs['field_name']=attrs['content'];
          attrs['tag_type']='h3';
          attrs['class_name']="h3-heading";
          insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, blockItem['innerBlocks']);
      }else if (blockItem['blockName']=="multiple-blocks-plugin/template-p-custom-field"){
        attrs['field_name']=attrs['content'];
        attrs['tag_type']='p';
        insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, blockItem['innerBlocks']);
      }else if (blockItem['blockName']=="multiple-blocks-plugin/template-custom-field"){
        
        // todo: do this only one way
        let val = acf.get(attrs['content']);
        if (!val)
            val = acf.getFields({name:attrs['content']})[0].val();
            
        console.log('getting template-custom-field..', attrs['content'])
        console.log('raw contents: ')
        console.log(val);
        // attrs['content']="raw!";

        // insertedBlock = wp.blocks.createBlock("core/html", {"content":val})

        let htmlBlock = wp.blocks.createBlock("core/html", {"content":val})

        // wrap it in a container
        let container = wp.blocks.createBlock("multiple-blocks-plugin/template-acf-wysiwyg-container", {'field_name':attrs['content']}, [htmlBlock]);
        insertedBlock = container;

    }else{
          insertedBlock =  wp.blocks.createBlock(blockItem['blockName'], attrs, blockItem['innerBlocks']);
    }

      return insertedBlock;
    });
  }
  
  
  

function addBlock(){
    // remove all blocks
    wp.data.dispatch( 'core/block-editor' ).removeBlocks(wp.data.select( 'core/block-editor' ).getBlocks().map(k=>k.clientId));

    getTemplate().then((template)=>{
        // console.log('got template: ', template);
        let parsed = parse(template);
        parsed.forEach((blockItem=>{
            // console.log('inserting block: ',blockItem['blockName'], blockItem);
            if (blockItem['blockName']){
                let originalBlockName = blockItem['blockName'];
                

                console.log('== checking block: ', blockItem['blockName']);

                // let insertedBlock = wp.blocks.createBlock(blockItem['blockName'], blockItem['attrs'], blockItem['innerBlocks']);
                let innerBlocksResult = processInnerBlocks(blockItem['innerBlocks']);
                // console.log('innerBlocksResult: ', innerBlocksResult);

                let attrs = blockItem['attrs'];
                if (!attrs['content'])
                    attrs = {...blockItem['attrs'], 'content':blockItem['innerContent'][0]};
                // swap block into meta block if this block is a template block, so user can edit it and save custom fields from gutenberg
                let insertedBlock = null;
                if(blockItem['blockName']=="multiple-blocks-plugin/template-h3-custom-field"){
                    attrs['field_name']=attrs['content'];
                    insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, innerBlocksResult);
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-p-custom-field"){
                    attrs['field_name']=attrs['content'];
                    attrs['tag_type']='p';
                    insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, innerBlocksResult);
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-custom-field"){
                    // todo: do this only one way
                    let val = acf.get(attrs['content']);
                    if (!val)
                        val = acf.getFields({name:attrs['content']})[0].val();

                    console.log('getting template-custom-field..', attrs['content'])
                    console.log('raw contents: ')
                    console.log(val);
                    // attrs['content']="raw!";
                    // insertedBlock =  wp.blocks.createBlock("core/paragraph", attrs, blockItem['innerBlocks']);
                    // insert as html, we'll convert it to blocks later..
                    let htmlBlock = wp.blocks.createBlock("core/html", {"content":val})

                    // wrap it in a container
                    let container = wp.blocks.createBlock("multiple-blocks-plugin/template-acf-wysiwyg-container", {'field_name':attrs['content']}, [htmlBlock]);
                    insertedBlock = container;

                }else{
                    insertedBlock = wp.blocks.createBlock(blockItem['blockName'], attrs, innerBlocksResult);
                }
                
                console.log('actual insert: ', insertedBlock);
                if (originalBlockName!="core/html") // do not render html blocks from the template
                    wp.data.dispatch( 'core/block-editor' ).insertBlock(insertedBlock);
                // console.log('done insert');
            }
        }));
        // console.log('parsed: ', parsed);

        // convert html blocks into actual blocks (to process ACF wysiwyg)
        console.log('CONVERTING HTML BLOCKS to core blocks..');

        function processBlock(block, blocksToProcess) {
            console.log('processBlock: ', block);
            if (block.name === "core/html") {
                blocksToProcess.push(block);
                return blocksToProcess;
                
            }
            
            if (block.innerBlocks.length>0) {
                block.innerBlocks.forEach(function(innerBlock) {
                    console.log('calling recursive..')
                    processBlock(innerBlock,blocksToProcess);
                });
            }
            return blocksToProcess;
        }
            
        let blocksToProcess = [];
        let allBlocks = wp.data.select("core/editor").getBlocks()
        
        allBlocks.forEach(function(block, blockIndex) {
            console.log('passing blocksToProcess: ', blocksToProcess);
            processBlock(block, blocksToProcess);            
        });
        console.log('blockstoprocess: ', blocksToProcess);

        //
        setTimeout(function(){ // todo: RACE CONDITION resolve async issue - probably still running some async stuff above, need to wait for it to finish..
            blocksToProcess.forEach(function(bp){
                wp.data.dispatch("core/editor").replaceBlocks(bp.clientId, wp.blocks.rawHandler({
                    HTML: wp.blocks.getBlockContent(bp)
                }));
            })
            // remove first block - it will be a blank paragraph
            // todo: again need to wait for above..
            wp.data.dispatch( 'core/block-editor' ).removeBlocks(wp.data.select( 'core/block-editor' ).getBlocks().map(k=>k.clientId)[0]);
        },1000)
        // })
        

        
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