!function(){"use strict";const{addFilter:e}=wp.hooks,t=["core/list"];var o=window.wp.element,n=window.wp.hooks,r=window.wp.compose,i=window.wp.blockEditor,a=window.wp.components;const l=(0,r.createHigherOrderComponent)((e=>t=>{if("core/image"!==t.name)return(0,o.createElement)(e,t);const{attributes:n,setAttributes:r}=t,{templatedURL:l,templatedCustomField:s}=n;return(0,o.createElement)(o.Fragment,null,(0,o.createElement)(e,t),(0,o.createElement)(i.InspectorAdvancedControls,null,(0,o.createElement)(a.TextControl,{label:"Shortcode URL",onChange:e=>r({templatedURL:e}),value:l}),(0,o.createElement)(a.TextControl,{label:"Template custom field URL",onChange:e=>r({templatedCustomField:e}),value:s})))}),"withInspectorControls");e("blocks.registerBlockType","multiple-blocks-plugin/attribute/aria_label",((e,o)=>t.includes(o)?(e.attributes=Object.assign(e.attributes,{ariaLabel:{type:"string",default:""}}),e):e)),e("blocks.getSaveContent.extraProps","multiple-blocks-plugin/applyAriaLabelAttribute",(function(e,o,n){if(!t.includes(o.name))return e;const{ariaLabel:r}=n;return void 0!==r&&""!=r&&Object.assign(e,{"aria-label":r}),e})),wp.domReady((()=>{wp.blocks.registerBlockStyle("core/post-title",{name:"_ h1-heading",label:"Digimod Page Title"})})),function e(t,o,n){null!=document.querySelector(t)?n():setTimeout((()=>e(t,o,n)),o)}(".edit-post-header__settings",100,(function(){const e=window.location.href;var t=new URL(e).searchParams.get("post");jQuery(".edit-post-header__settings").prepend(`<button onclick="window.open('https://digital-gov-frontend-test-c0cce6-test.apps.silver.devops.gov.bc.ca/wordpress-preview/${t}','_blank');" type="button" class="components-button editor-post-switch-to-draft is-tertiary">Preview on digital.gov.bc.ca</button>`)})),(0,n.addFilter)("blocks.registerBlockType","extending-gutenberg/add-attributes",((e,t)=>{if("core/image"!==t)return e;const o={...e.attributes,templatedURL:{type:"string",default:""},templatedCustomField:{type:"string",default:""}};return{...e,attributes:o}})),(0,n.addFilter)("editor.BlockEdit","extending-gutenberg/edit",l)}();