!function(){"use strict";var e,t={225:function(){var e=window.wp.blocks,t=window.wp.element,n=window.wp.components,l=window.wp.i18n,r=window.wp.blockEditor;window.wp.data;const o=[1,2,3,4],c={className:"block-library-heading-level-dropdown"};function i(e){let{selectedLevel:r,onChange:i}=e;return(0,t.createElement)(n.ToolbarDropdownMenu,{popoverProps:c,icon:(0,t.createElement)(a,{level:r}),label:(0,l.__)("Change heading level"),controls:o.map((e=>{{const n=e===r;return{icon:(0,t.createElement)(a,{level:e,isPressed:n}),label:(0,l.sprintf)(
// translators: %s: heading level e.g: "1", "2", "3"
(0,l.__)("Heading %d"),e),isActive:n,onClick(){i(e)},role:"menuitemradio"}}}))})}function a(e){let{level:l,isPressed:r=!1}=e;const o={1:"M9 5h2v10H9v-4H5v4H3V5h2v4h4V5zm6.6 0c-.6.9-1.5 1.7-2.6 2v1h2v7h2V5h-1.4z",2:"M7 5h2v10H7v-4H3v4H1V5h2v4h4V5zm8 8c.5-.4.6-.6 1.1-1.1.4-.4.8-.8 1.2-1.3.3-.4.6-.8.9-1.3.2-.4.3-.8.3-1.3 0-.4-.1-.9-.3-1.3-.2-.4-.4-.7-.8-1-.3-.3-.7-.5-1.2-.6-.5-.2-1-.2-1.5-.2-.4 0-.7 0-1.1.1-.3.1-.7.2-1 .3-.3.1-.6.3-.9.5-.3.2-.6.4-.8.7l1.2 1.2c.3-.3.6-.5 1-.7.4-.2.7-.3 1.2-.3s.9.1 1.3.4c.3.3.5.7.5 1.1 0 .4-.1.8-.4 1.1-.3.5-.6.9-1 1.2-.4.4-1 .9-1.6 1.4-.6.5-1.4 1.1-2.2 1.6V15h8v-2H15z",3:"M12.1 12.2c.4.3.8.5 1.2.7.4.2.9.3 1.4.3.5 0 1-.1 1.4-.3.3-.1.5-.5.5-.8 0-.2 0-.4-.1-.6-.1-.2-.3-.3-.5-.4-.3-.1-.7-.2-1-.3-.5-.1-1-.1-1.5-.1V9.1c.7.1 1.5-.1 2.2-.4.4-.2.6-.5.6-.9 0-.3-.1-.6-.4-.8-.3-.2-.7-.3-1.1-.3-.4 0-.8.1-1.1.3-.4.2-.7.4-1.1.6l-1.2-1.4c.5-.4 1.1-.7 1.6-.9.5-.2 1.2-.3 1.8-.3.5 0 1 .1 1.6.2.4.1.8.3 1.2.5.3.2.6.5.8.8.2.3.3.7.3 1.1 0 .5-.2.9-.5 1.3-.4.4-.9.7-1.5.9v.1c.6.1 1.2.4 1.6.8.4.4.7.9.7 1.5 0 .4-.1.8-.3 1.2-.2.4-.5.7-.9.9-.4.3-.9.4-1.3.5-.5.1-1 .2-1.6.2-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1l1.1-1.4zM7 9H3V5H1v10h2v-4h4v4h2V5H7v4z",4:"M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm10-2h-1v2h-2v-2h-5v-2l4-6h3v6h1v2zm-3-2V7l-2.8 4H16z",5:"M12.1 12.2c.4.3.7.5 1.1.7.4.2.9.3 1.3.3.5 0 1-.1 1.4-.4.4-.3.6-.7.6-1.1 0-.4-.2-.9-.6-1.1-.4-.3-.9-.4-1.4-.4H14c-.1 0-.3 0-.4.1l-.4.1-.5.2-1-.6.3-5h6.4v1.9h-4.3L14 8.8c.2-.1.5-.1.7-.2.2 0 .5-.1.7-.1.5 0 .9.1 1.4.2.4.1.8.3 1.1.6.3.2.6.6.8.9.2.4.3.9.3 1.4 0 .5-.1 1-.3 1.4-.2.4-.5.8-.9 1.1-.4.3-.8.5-1.3.7-.5.2-1 .3-1.5.3-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1-.1-.1 1-1.5 1-1.5zM9 15H7v-4H3v4H1V5h2v4h4V5h2v10z",6:"M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm8.6-7.5c-.2-.2-.5-.4-.8-.5-.6-.2-1.3-.2-1.9 0-.3.1-.6.3-.8.5l-.6.9c-.2.5-.2.9-.2 1.4.4-.3.8-.6 1.2-.8.4-.2.8-.3 1.3-.3.4 0 .8 0 1.2.2.4.1.7.3 1 .6.3.3.5.6.7.9.2.4.3.8.3 1.3s-.1.9-.3 1.4c-.2.4-.5.7-.8 1-.4.3-.8.5-1.2.6-1 .3-2 .3-3 0-.5-.2-1-.5-1.4-.9-.4-.4-.8-.9-1-1.5-.2-.6-.3-1.3-.3-2.1s.1-1.6.4-2.3c.2-.6.6-1.2 1-1.6.4-.4.9-.7 1.4-.9.6-.3 1.1-.4 1.7-.4.7 0 1.4.1 2 .3.5.2 1 .5 1.4.8 0 .1-1.3 1.4-1.3 1.4zm-2.4 5.8c.2 0 .4 0 .6-.1.2 0 .4-.1.5-.2.1-.1.3-.3.4-.5.1-.2.1-.5.1-.7 0-.4-.1-.8-.4-1.1-.3-.2-.7-.3-1.1-.3-.3 0-.7.1-1 .2-.4.2-.7.4-1 .7 0 .3.1.7.3 1 .1.2.3.4.4.6.2.1.3.3.5.3.2.1.5.2.7.1z"};return o.hasOwnProperty(l)?(0,t.createElement)(n.SVG,{width:"24",height:"24",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",isPressed:r},(0,t.createElement)(n.Path,{d:o[l]})):null}var v=JSON.parse('{"u2":"multiple-blocks-plugin/heading"}');(0,e.registerBlockType)(v.u2,{edit:function(e){let{attributes:l,setAttributes:o,isSelected:c}=e;const{level:a,content:v}=l,s="h"+a;return(0,t.createElement)("div",(0,r.useBlockProps)(),(0,t.createElement)(r.BlockControls,{group:"block"},(0,t.createElement)(i,{selectedLevel:a,onChange:e=>o({level:e})})),(0,t.createElement)(r.InspectorControls,null,(0,t.createElement)(n.PanelBody,{title:"Settings",initialOpen:!0},(0,t.createElement)(n.PanelRow,null,(0,t.createElement)(n.TextControl,{label:"id",onChange:e=>{o({...l,id:e})},value:l.id})))),(0,t.createElement)(r.RichText,{id:l.id,tagName:s,value:v,allowedFormats:[],onChange:e=>{o({...l,content:e})},placeholder:"Heading..."}))},save:function(e){let{attributes:n}=e,l="h"+n.level,o=n.id;const c=n.className||"";return(0,t.createElement)(r.RichText.Content,{id:o,tagName:l,value:n.content,className:c})}})}},n={};function l(e){var r=n[e];if(void 0!==r)return r.exports;var o=n[e]={exports:{}};return t[e](o,o.exports,l),o.exports}l.m=t,e=[],l.O=function(t,n,r,o){if(!n){var c=1/0;for(s=0;s<e.length;s++){n=e[s][0],r=e[s][1],o=e[s][2];for(var i=!0,a=0;a<n.length;a++)(!1&o||c>=o)&&Object.keys(l.O).every((function(e){return l.O[e](n[a])}))?n.splice(a--,1):(i=!1,o<c&&(c=o));if(i){e.splice(s--,1);var v=r();void 0!==v&&(t=v)}}return t}o=o||0;for(var s=e.length;s>0&&e[s-1][2]>o;s--)e[s]=e[s-1];e[s]=[n,r,o]},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,431:0};l.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,o,c=n[0],i=n[1],a=n[2],v=0;if(c.some((function(t){return 0!==e[t]}))){for(r in i)l.o(i,r)&&(l.m[r]=i[r]);if(a)var s=a(l)}for(t&&t(n);v<c.length;v++)o=c[v],l.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return l.O(s)},n=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var r=l.O(void 0,[431],(function(){return l(225)}));r=l.O(r)}();