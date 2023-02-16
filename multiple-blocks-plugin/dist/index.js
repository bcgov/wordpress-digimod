!function(){"use strict";const{addFilter:e}=wp.hooks,t=["core/list"];var n=window.wp.element,r=window.wp.hooks,o=window.wp.compose,i=window.wp.blockEditor,l=window.wp.components;const a=(0,o.createHigherOrderComponent)((e=>t=>{if("core/image"!==t.name)return(0,n.createElement)(e,t);const{attributes:r,setAttributes:o}=t,{templatedURL:a,templatedCustomField:s}=r;return(0,n.createElement)(n.Fragment,null,(0,n.createElement)(e,t),(0,n.createElement)(i.InspectorAdvancedControls,null,(0,n.createElement)(l.TextControl,{label:"Shortcode URL",onChange:e=>o({templatedURL:e}),value:a}),(0,n.createElement)(l.TextControl,{label:"Template custom field URL",onChange:e=>o({templatedCustomField:e}),value:s})))}),"withInspectorControls"),s=(0,o.createHigherOrderComponent)((e=>t=>{if("core/heading"!==t.name)return(0,n.createElement)(e,t);const{attributes:r,setAttributes:o}=t;return(0,n.createElement)(n.Fragment,null,(0,n.createElement)(e,t),(0,n.createElement)(i.InspectorControls,null))}),"withInspectorControls2");e("blocks.registerBlockType","multiple-blocks-plugin/attribute/aria_label",((e,n)=>t.includes(n)?(e.attributes=Object.assign(e.attributes,{ariaLabel:{type:"string",default:""}}),e):e)),e("blocks.getSaveContent.extraProps","multiple-blocks-plugin/applyAriaLabelAttribute",(function(e,n,r){if(!t.includes(n.name))return e;const{ariaLabel:o}=r;return void 0!==o&&""!=o&&Object.assign(e,{"aria-label":o}),e})),wp.domReady((()=>{wp.blocks.registerBlockStyle("core/post-title",{name:"_ h1-heading",label:"Digimod Page Title"})})),function e(t,n,r){null!=document.querySelector(t)?r():setTimeout((()=>e(t,n,r)),n)}(".edit-post-header__settings",100,(function(){const e=window.location.href;var t=new URL(e).searchParams.get("post");jQuery(".edit-post-header__settings").prepend(`<button onclick="window.open('https://digital-gov-frontend-test-c0cce6-test.apps.silver.devops.gov.bc.ca/wordpress-preview/${t}','_blank');" type="button" class="components-button editor-post-switch-to-draft is-tertiary">Preview on digital.gov.bc.ca</button>`)})),(0,r.addFilter)("blocks.registerBlockType","extending-gutenberg/add-attributes",((e,t)=>{if("core/image"!==t)return e;const n={...e.attributes,templatedURL:{type:"string",default:""},templatedCustomField:{type:"string",default:""}};return{...e,attributes:n}})),(0,r.addFilter)("editor.BlockEdit","extending-gutenberg/edit",a),(0,r.addFilter)("editor.BlockEdit","extending-gutenberg/edit2",s)}();