!function(){"use strict";var n,e={143:function(){var n=window.wp.blocks,e=window.wp.element,r=(window.wp.i18n,window.wp.blockEditor),t=JSON.parse('{"u2":"multiple-blocks-plugin/dm-3-cols"}');(0,n.registerBlockType)(t.u2,{edit:function(n){const{attributes:t,setAttributes:o}=n;return(0,r.useBlockProps)(),(0,e.createElement)("div",{class:"row"},(0,e.createElement)(r.InnerBlocks,null))},save:function(n){return(0,e.createElement)("div",{class:"row"},(0,e.createElement)(r.InnerBlocks.Content,null))}})}},r={};function t(n){var o=r[n];if(void 0!==o)return o.exports;var i=r[n]={exports:{}};return e[n](i,i.exports,t),i.exports}t.m=e,n=[],t.O=function(e,r,o,i){if(!r){var l=1/0;for(a=0;a<n.length;a++){r=n[a][0],o=n[a][1],i=n[a][2];for(var u=!0,c=0;c<r.length;c++)(!1&i||l>=i)&&Object.keys(t.O).every((function(n){return t.O[n](r[c])}))?r.splice(c--,1):(u=!1,i<l&&(l=i));if(u){n.splice(a--,1);var s=o();void 0!==s&&(e=s)}}return e}i=i||0;for(var a=n.length;a>0&&n[a-1][2]>i;a--)n[a]=n[a-1];n[a]=[r,o,i]},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={826:0,431:0};t.O.j=function(e){return 0===n[e]};var e=function(e,r){var o,i,l=r[0],u=r[1],c=r[2],s=0;if(l.some((function(e){return 0!==n[e]}))){for(o in u)t.o(u,o)&&(t.m[o]=u[o]);if(c)var a=c(t)}for(e&&e(r);s<l.length;s++)i=l[s],t.o(n,i)&&n[i]&&n[i][0](),n[i]=0;return t.O(a)},r=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var o=t.O(void 0,[431],(function(){return t(143)}));o=t.O(o)}();