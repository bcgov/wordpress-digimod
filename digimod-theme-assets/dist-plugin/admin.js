(()=>{"use strict";const e=window.React,t=window.wp.blocks,i=window.wp.blockEditor,s=window.wp.serverSideRender,o=window.wp.i18n;(0,t.registerBlockType)("digimod-plugin/search-results",{title:(0,o.__)("Digital Gov - Search Results"),description:"Used to display Search Results",category:"digimod-plugin",icon:"search",edit:t=>{const o=(0,i.useBlockProps)();return(0,e.createElement)("div",{...o},(0,e.createElement)(s,{block:"digimod-plugin/search-results",attributes:t.attributes}))}});const d=()=>{if(document.querySelector("body.searchwp_page_searchwp-settings")){const e=document.querySelector("#swp-quoted_search_support");if(e){e.setAttribute("disabled","disabled");let t=document.createElement("p");t.style.fontWeight="bold",t.textContent="On the DigitalGov Website this must remain off to prevent issues with metrics tracking. Quoted searches will still work even with this disabled.",e.parentNode.parentNode.appendChild(t)}}};"complete"===document.readyState?d():document.addEventListener("DOMContentLoaded",d)})();