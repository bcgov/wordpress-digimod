!function(){"use strict";var e,n={571:function(){var e=window.wp.blocks,n=window.wp.element,r=(window.wp.i18n,window.wp.blockEditor),t=JSON.parse('{"u2":"multiple-blocks-plugin/dm-card"}');(0,e.registerBlockType)(t.u2,{edit:function(e){const{attributes:t,setAttributes:c}=e;return(0,r.useBlockProps)(),(0,n.createElement)("div",{class:"ant-card ant-card-bordered dm-card"},(0,n.createElement)("div",{class:"ant-card-body"},(0,n.createElement)("div",{class:"cardText"},(0,n.createElement)("div",null,(0,n.createElement)(r.InnerBlocks,null)))))},save:function(e){return(0,n.createElement)("div",{class:"ant-card ant-card-bordered dm-card"},(0,n.createElement)("div",{class:"ant-card-body"},(0,n.createElement)("div",{class:"cardText"},(0,n.createElement)("div",null,(0,n.createElement)(r.InnerBlocks.Content,null)))))}})}},r={};function t(e){var c=r[e];if(void 0!==c)return c.exports;var l=r[e]={exports:{}};return n[e](l,l.exports,t),l.exports}t.m=n,e=[],t.O=function(n,r,c,l){if(!r){var a=1/0;for(s=0;s<e.length;s++){r=e[s][0],c=e[s][1],l=e[s][2];for(var o=!0,i=0;i<r.length;i++)(!1&l||a>=l)&&Object.keys(t.O).every((function(e){return t.O[e](r[i])}))?r.splice(i--,1):(o=!1,l<a&&(a=l));if(o){e.splice(s--,1);var u=c();void 0!==u&&(n=u)}}return n}l=l||0;for(var s=e.length;s>0&&e[s-1][2]>l;s--)e[s]=e[s-1];e[s]=[r,c,l]},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};t.O.j=function(n){return 0===e[n]};var n=function(n,r){var c,l,a=r[0],o=r[1],i=r[2],u=0;if(a.some((function(n){return 0!==e[n]}))){for(c in o)t.o(o,c)&&(t.m[c]=o[c]);if(i)var s=i(t)}for(n&&n(r);u<a.length;u++)l=a[u],t.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return t.O(s)},r=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];r.forEach(n.bind(null,0)),r.push=n.bind(null,r.push.bind(r))}();var c=t.O(void 0,[431],(function(){return t(571)}));c=t.O(c)}();