!function(){"use strict";var e,n={108:function(){var e=window.wp.blocks,n=window.wp.element,t=(window.wp.i18n,window.wp.blockEditor),r=JSON.parse('{"u2":"multiple-blocks-plugin/template-badges-custom-field"}');(0,e.registerBlockType)(r.u2,{edit:function(e){const{attributes:r,setAttributes:o}=e;return(0,n.createElement)("div",null," BADGES:",(0,n.createElement)(t.RichText,{tagName:"p",value:r.content,allowedFormats:[],onChange:e=>{o({content:e})},placeholder:"checkbox field name..."}))},save:function(e){return null}})}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var u=1/0;for(s=0;s<e.length;s++){t=e[s][0],o=e[s][1],i=e[s][2];for(var l=!0,c=0;c<t.length;c++)(!1&i||u>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[c])}))?t.splice(c--,1):(l=!1,i<u&&(u=i));if(l){e.splice(s--,1);var a=o();void 0!==a&&(n=a)}}return n}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[t,o,i]},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,u=t[0],l=t[1],c=t[2],a=0;if(u.some((function(n){return 0!==e[n]}))){for(o in l)r.o(l,o)&&(r.m[o]=l[o]);if(c)var s=c(r)}for(n&&n(t);a<u.length;a++)i=u[a],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(s)},t=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[431],(function(){return r(108)}));o=r.O(o)}();