!function(){"use strict";var e,n={938:function(){var e=window.wp.blocks,n=window.wp.element,t=(window.wp.i18n,window.wp.blockEditor),r=JSON.parse('{"u2":"multiple-blocks-plugin/template-conditional-custom-field"}');(0,e.registerBlockType)(r.u2,{edit:function(e){const{attributes:r,setAttributes:o}=e;return(0,t.useBlockProps)(),(0,n.createElement)("div",{style:{border:"2px solid rgb(35 64 117)",paddingTop:"8px",position:"relative"}},(0,n.createElement)("style",null,"\n            .condFieldEdit{\n              background: rgb(242 242 242); \n              display: inline-block; \n              padding-right:5px;\n            }\n            "),(0,n.createElement)("div",{style:{position:"absolute",top:"-14px",paddingBottom:"5px"}},(0,n.createElement)("p",{style:{background:"rgb(242 242 242)",marginLeft:"9px",width:"227px",display:"inline-block",paddingLeft:"5px"}},"Render if custom field exists:"),(0,n.createElement)(t.RichText,{className:"condFieldEdit",tagName:"p",onChange:e=>{o({content:e})},value:r.content,allowedFormats:[],placeholder:"custom field name"})),(0,n.createElement)(t.InnerBlocks,null))},save:function(e){return(0,n.createElement)(t.InnerBlocks.Content,null)}})}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var l=1/0;for(p=0;p<e.length;p++){t=e[p][0],o=e[p][1],i=e[p][2];for(var c=!0,u=0;u<t.length;u++)(!1&i||l>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[u])}))?t.splice(u--,1):(c=!1,i<l&&(l=i));if(c){e.splice(p--,1);var a=o();void 0!==a&&(n=a)}}return n}i=i||0;for(var p=e.length;p>0&&e[p-1][2]>i;p--)e[p]=e[p-1];e[p]=[t,o,i]},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,l=t[0],c=t[1],u=t[2],a=0;if(l.some((function(n){return 0!==e[n]}))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(u)var p=u(r)}for(n&&n(t);a<l.length;a++)i=l[a],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(p)},t=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[431],(function(){return r(938)}));o=r.O(o)}();