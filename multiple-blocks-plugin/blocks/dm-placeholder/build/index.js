!function(){"use strict";var n,e={67:function(){var n=window.wp.blocks,e=window.wp.element,r=(window.wp.i18n,window.wp.blockEditor),t=JSON.parse('{"u2":"multiple-blocks-plugin/dm-placeholder"}');(0,n.registerBlockType)(t.u2,{edit:function(n){const{attributes:t,setAttributes:o}=n;return(0,r.useBlockProps)(),(0,e.createElement)(r.InnerBlocks,null)},save:function(n){return(0,e.createElement)(r.InnerBlocks.Content,null)}})}},r={};function t(n){var o=r[n];if(void 0!==o)return o.exports;var i=r[n]={exports:{}};return e[n](i,i.exports,t),i.exports}t.m=e,n=[],t.O=function(e,r,o,i){if(!r){var u=1/0;for(p=0;p<n.length;p++){r=n[p][0],o=n[p][1],i=n[p][2];for(var l=!0,c=0;c<r.length;c++)(!1&i||u>=i)&&Object.keys(t.O).every((function(n){return t.O[n](r[c])}))?r.splice(c--,1):(l=!1,i<u&&(u=i));if(l){n.splice(p--,1);var s=o();void 0!==s&&(e=s)}}return e}i=i||0;for(var p=n.length;p>0&&n[p-1][2]>i;p--)n[p]=n[p-1];n[p]=[r,o,i]},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={826:0,431:0};t.O.j=function(e){return 0===n[e]};var e=function(e,r){var o,i,u=r[0],l=r[1],c=r[2],s=0;if(u.some((function(e){return 0!==n[e]}))){for(o in l)t.o(l,o)&&(t.m[o]=l[o]);if(c)var p=c(t)}for(e&&e(r);s<u.length;s++)i=u[s],t.o(n,i)&&n[i]&&n[i][0](),n[i]=0;return t.O(p)},r=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var o=t.O(void 0,[431],(function(){return t(67)}));o=t.O(o)}();