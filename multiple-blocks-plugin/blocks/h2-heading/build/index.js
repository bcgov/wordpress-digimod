!function(){"use strict";var e,t={373:function(){var e=window.wp.blocks,t=window.wp.element,n=(window.wp.i18n,window.wp.blockEditor),r=JSON.parse('{"u2":"multiple-blocks-plugin/h2-heading"}');(0,e.registerBlockType)(r.u2,{edit:function(e){const{attributes:r,setAttributes:i}=e;(0,n.useBlockProps)();let o="";return e.attributes.className&&(o=" "+e.attributes.className),(0,t.createElement)(n.RichText,{className:"h2-heading"+o,tagName:"h2",value:r.content,allowedFormats:[],onChange:e=>{i({content:e})},placeholder:"Heading..."})},save:function(e){let r="";return e.attributes.className&&(r=" "+e.attributes.className),(0,t.createElement)(n.RichText.Content,{className:"h2-heading"+r,tagName:"h2",value:e.attributes.content})}})}},n={};function r(e){var i=n[e];if(void 0!==i)return i.exports;var o=n[e]={exports:{}};return t[e](o,o.exports,r),o.exports}r.m=t,e=[],r.O=function(t,n,i,o){if(!n){var a=1/0;for(c=0;c<e.length;c++){n=e[c][0],i=e[c][1],o=e[c][2];for(var u=!0,l=0;l<n.length;l++)(!1&o||a>=o)&&Object.keys(r.O).every((function(e){return r.O[e](n[l])}))?n.splice(l--,1):(u=!1,o<a&&(a=o));if(u){e.splice(c--,1);var s=i();void 0!==s&&(t=s)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[n,i,o]},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,431:0};r.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,o,a=n[0],u=n[1],l=n[2],s=0;if(a.some((function(t){return 0!==e[t]}))){for(i in u)r.o(u,i)&&(r.m[i]=u[i]);if(l)var c=l(r)}for(t&&t(n);s<a.length;s++)o=a[s],r.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return r.O(c)},n=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var i=r.O(void 0,[431],(function(){return r(373)}));i=r.O(i)}();