import { select, subscribe } from '@wordpress/data'
import { parse } from '@wordpress/block-serialization-default-parser';

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
            throw(err);
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
          attrs['field_name']=attrs['field_name'];
          attrs['tag_type']='h3';
          attrs['class_name']="h3-heading";
          insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, blockItem['innerBlocks']);
      }else if (blockItem['blockName']=="multiple-blocks-plugin/template-p-custom-field"){
        attrs['field_name']=attrs['field_name'];
        attrs['tag_type']='p';
        insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, blockItem['innerBlocks']);
      }else if (blockItem['blockName']=="multiple-blocks-plugin/template-h1-custom-field"){
        attrs['field_name']=attrs['field_name'];
        attrs['tag_type']='h1';
        attrs['class_name']='h1-heading';
        insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, blockItem['innerBlocks']);
      }else if (blockItem['blockName']=="core/image"){
        let imgSrc = jQuery(blockItem.innerHTML).find('img').attr('src'); // ugh
        attrs['url']=imgSrc;
        insertedBlock =  wp.blocks.createBlock(blockItem['blockName'], attrs, blockItem['innerBlocks']);
        
      }else if (blockItem['blockName']=="multiple-blocks-plugin/template-custom-field"){
        
        // todo: do this only one way
        let val = acf.get(attrs['field_name']);
        if (!val)
            val = acf.getFields({name:attrs['field_name']})[0].val();
            
        console.log('getting template-custom-field..', attrs['field_name'])
        console.log('raw contents: ')
        console.log(val);
        // attrs['content']="raw!";

        // insertedBlock = wp.blocks.createBlock("core/html", {"content":val})

        let htmlBlock = wp.blocks.createBlock("core/html", {"content":val})
        console.log('htmlBlock: ', htmlBlock);
        // wrap it in a container
        let container = wp.blocks.createBlock("multiple-blocks-plugin/template-acf-wysiwyg-container", {'field_name':attrs['field_name']}, [htmlBlock]);
        insertedBlock = container;
    }else{
          insertedBlock =  wp.blocks.createBlock(blockItem['blockName'], attrs, blockItem['innerBlocks']);
    }

    console.log('inner returns insertedBlock: ', insertedBlock);
   
      return insertedBlock;
    });
  }
  
  
  

function addBlock(){
    // remove all blocks
    wp.data.dispatch( 'core/block-editor' ).removeBlocks(wp.data.select( 'core/block-editor' ).getBlocks().map(k=>k.clientId));

    getTemplate().then((template)=>{
        console.log('got template: ', template);
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
                    attrs['field_name']=attrs['field_name'];
                    insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, innerBlocksResult);
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-p-custom-field"){
                    attrs['field_name']=attrs['field_name'];
                    attrs['tag_type']='p';
                    insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, innerBlocksResult);
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-h1-custom-field"){
                    attrs['field_name']=attrs['field_name'];
                    attrs['tag_type']='h1';
                    insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/meta-block", attrs, innerBlocksResult);
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-custom-field"){
                    // todo: do this only one way
                    let val = acf.get(attrs['field_name']);
                    if (!val)
                        val = acf.getFields({name:attrs['field_name']})[0].val();

                    // console.log('getting template-custom-field..', attrs['content'])
                    // console.log('raw contents: ')
                    // console.log(val);

                    // attrs['content']="raw!";
                    // insertedBlock =  wp.blocks.createBlock("core/paragraph", attrs, blockItem['innerBlocks']);
                    // insert as html, we'll convert it to blocks later..
                    let htmlBlock = wp.blocks.createBlock("core/html", {"content":val})

                    // wrap it in a container
                    let container = wp.blocks.createBlock("multiple-blocks-plugin/template-acf-wysiwyg-container", {'field_name':attrs['field_name']}, [htmlBlock]);
                    insertedBlock = container;
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-conditional-custom-field"){
                    // unwrap
                    let container = wp.blocks.createBlock("multiple-blocks-plugin/template-acf-wysiwyg-container", {'field_name':null}, innerBlocksResult);
                    insertedBlock = container;
                }else if (blockItem['blockName']=="multiple-blocks-plugin/template-badges-custom-field"){
                    // todo: do this only one way
                    let val = acf.get(attrs['field_name']);
                    let allValues = null;

                    if (!val){
                        val = acf.getFields({name:attrs['field_name']})[0].val();
                        let k = acf.getFields({name:attrs['field_name']})[0];
                        allValues = k.$control().find(':checkbox').map(function(){return jQuery(this).val()}).get();
                    }else{
                        allValues = acf.get(attrs['field_name']+"allValues");
                    }
                    console.log('checkbox val: ', val)

                    //---
                    
                    
                    // console.log('getting template-custom-field..', attrs['content'])
                    // console.log('raw contents: ')
                    // console.log(val);

                    attrs['all_values'] = allValues;
                    attrs['field_value'] = val;
                    //---

                    attrs['field_name']=attrs['field_name'];
                    // attrs['tag_type']='p';
                    insertedBlock = wp.blocks.createBlock("multiple-blocks-plugin/template-badges-editor", attrs, innerBlocksResult);
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

export const contentInTemplateEditing = () => {
    console.log('contentInTemplateEditing')
    whenEditorIsReady().then(() => {
        console.log('editor ready');
        if (!wp.data.select("core/edit-site")) // do not fire on full-site editing page
            addBlock();
    })
}