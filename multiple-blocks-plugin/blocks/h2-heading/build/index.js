!function(){"use strict";var e,t={726:function(){var e=window.wp.blocks,t=window.wp.element,n=(window.wp.i18n,window.wp.blockEditor),r=JSON.parse('{"u2":"multiple-blocks-plugin/h2-heading"}');(0,e.registerBlockType)(r.u2,{edit:function(e){const{attributes:r,setAttributes:o}=e;(0,n.useBlockProps)(),console.log("edit props: ",e);let i="";return e.attributes.className&&(i=" "+e.attributes.className),console.log("applying extra: ",i),(0,t.createElement)(n.RichText,{className:"h2-heading"+i,tagName:"h2",value:r.content,allowedFormats:[],onChange:e=>{o({content:e})},placeholder:"Heading..."})},save:function(e){let r="";return e.attributes.className&&(r=" "+e.attributes.className),(0,t.createElement)(n.RichText.Content,{className:"h2-heading"+r,tagName:"h2",value:e.attributes.content})}})}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={exports:{}};return t[e](i,i.exports,r),i.exports}r.m=t,e=[],r.O=function(t,n,o,i){if(!n){var a=1/0;for(c=0;c<e.length;c++){n=e[c][0],o=e[c][1],i=e[c][2];for(var l=!0,s=0;s<n.length;s++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](n[s])}))?n.splice(s--,1):(l=!1,i<a&&(a=i));if(l){e.splice(c--,1);var u=o();void 0!==u&&(t=u)}}return t}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[n,o,i]},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,431:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var o,i,a=n[0],l=n[1],s=n[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(o in l)r.o(l,o)&&(r.m[o]=l[o]);if(s)var c=s(r)}for(t&&t(n);u<a.length;u++)i=a[u],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(c)},n=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var o=r.O(void 0,[431],(function(){return r(726)}));o=r.O(o)}();