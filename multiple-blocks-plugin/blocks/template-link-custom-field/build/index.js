!function(){"use strict";var e,t={803:function(){var e=window.wp.blocks,t=window.wp.element,n=(window.wp.i18n,window.wp.blockEditor),r=window.wp.components,l=JSON.parse('{"u2":"multiple-blocks-plugin/template-link-custom-field"}');(0,e.registerBlockType)(l.u2,{edit:function(e){const{attributes:l,setAttributes:o}=e,i=(0,n.useBlockProps)();return(0,t.createElement)("div",i,(0,t.createElement)("p",{style:{color:"#1890ff"}},(0,t.createElement)(n.RichText,{tagName:"div",value:l.linkText,allowedFormats:[],onChange:e=>{o({linkText:e})},placeholder:"Link text..."}),(0,t.createElement)(n.InspectorControls,null,(0,t.createElement)(r.TextControl,{label:"Link URL custom field",onChange:e=>{o({url:e})},value:l.url}),(0,t.createElement)(r.TextControl,{label:"Link text custom field",onChange:e=>{o({content:e})},value:l.content}))))},save:function(e){return(0,t.createElement)("div",{className:"row",style:{marginTop:"30px"}},(0,t.createElement)("div",{className:"col-xs-12",style:{flexBasis:"auto"}},(0,t.createElement)("div",{className:"ExternalLinkButton"},(0,t.createElement)(n.RichText.Content,{tagName:"p",value:e.attributes.content}),(0,t.createElement)(n.RichText.Content,{tagName:"p",value:e.attributes.url}),(0,t.createElement)(n.RichText.Content,{tagName:"p",value:e.attributes.linkText}))))}})}},n={};function r(e){var l=n[e];if(void 0!==l)return l.exports;var o=n[e]={exports:{}};return t[e](o,o.exports,r),o.exports}r.m=t,e=[],r.O=function(t,n,l,o){if(!n){var i=1/0;for(s=0;s<e.length;s++){n=e[s][0],l=e[s][1],o=e[s][2];for(var a=!0,c=0;c<n.length;c++)(!1&o||i>=o)&&Object.keys(r.O).every((function(e){return r.O[e](n[c])}))?n.splice(c--,1):(a=!1,o<i&&(i=o));if(a){e.splice(s--,1);var u=l();void 0!==u&&(t=u)}}return t}o=o||0;for(var s=e.length;s>0&&e[s-1][2]>o;s--)e[s]=e[s-1];e[s]=[n,l,o]},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,431:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var l,o,i=n[0],a=n[1],c=n[2],u=0;if(i.some((function(t){return 0!==e[t]}))){for(l in a)r.o(a,l)&&(r.m[l]=a[l]);if(c)var s=c(r)}for(t&&t(n);u<i.length;u++)o=i[u],r.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return r.O(s)},n=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var l=r.O(void 0,[431],(function(){return r(803)}));l=r.O(l)}();