!function(){"use strict";var e,n={19:function(){var e=window.wp.blocks,n=window.wp.element,t=(window.wp.i18n,window.wp.blockEditor),r=JSON.parse('{"u2":"multiple-blocks-plugin/dm-cons-list"}');(0,e.registerBlockType)(r.u2,{edit:function(e){const{attributes:r,setAttributes:o}=e;return(0,t.useBlockProps)(),(0,n.createElement)("div",{class:"col-sm-12 col-md-6"},(0,n.createElement)(t.InnerBlocks,{template:[["core/list",{className:"consList",ariaLabel:"cons list"}]],templateLock:!1}))},save:function(e){return(0,n.createElement)("div",{class:"col-sm-12 col-md-6"},(0,n.createElement)(t.InnerBlocks.Content,null))}})}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var l=t[e]={exports:{}};return n[e](l,l.exports,r),l.exports}r.m=n,e=[],r.O=function(n,t,o,l){if(!t){var i=1/0;for(a=0;a<e.length;a++){t=e[a][0],o=e[a][1],l=e[a][2];for(var c=!0,s=0;s<t.length;s++)(!1&l||i>=l)&&Object.keys(r.O).every((function(e){return r.O[e](t[s])}))?t.splice(s--,1):(c=!1,l<i&&(i=l));if(c){e.splice(a--,1);var u=o();void 0!==u&&(n=u)}}return n}l=l||0;for(var a=e.length;a>0&&e[a-1][2]>l;a--)e[a]=e[a-1];e[a]=[t,o,l]},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,l,i=t[0],c=t[1],s=t[2],u=0;if(i.some((function(n){return 0!==e[n]}))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var a=s(r)}for(n&&n(t);u<i.length;u++)l=i[u],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(a)},t=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[431],(function(){return r(19)}));o=r.O(o)}();