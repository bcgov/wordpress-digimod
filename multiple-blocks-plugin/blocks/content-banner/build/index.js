!function(){"use strict";var e,n={61:function(){var e=window.wp.blocks;function n(){return n=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},n.apply(this,arguments)}var t=window.wp.element,r=(window.wp.i18n,window.wp.blockEditor),o=JSON.parse('{"u2":"multiple-blocks-plugin/content-banner"}');(0,e.registerBlockType)(o.u2,{edit:function(e){const{attributes:o,setAttributes:i}=e,l=(0,r.useBlockProps)();return(0,t.createElement)("div",n({className:"wp-block-group alignwide"},l),(0,t.createElement)("div",{id:"main-content-anchor",className:"content-banner-wrapper container"},(0,t.createElement)("div",{className:"row middle-xs"},(0,t.createElement)(r.InnerBlocks,{template:[["multiple-blocks-plugin/dm-content-banner-content",{}],["multiple-blocks-plugin/dm-content-banner-image",{}]],templateLock:"all"}))))},save:function(e){return(0,t.createElement)("div",{className:"wp-block-group alignwide"},(0,t.createElement)("div",{id:"main-content-anchor",className:"content-banner-wrapper container"},(0,t.createElement)("div",{className:"row middle-xs"},(0,t.createElement)(r.InnerBlocks.Content,null))))}})}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var l=1/0;for(s=0;s<e.length;s++){t=e[s][0],o=e[s][1],i=e[s][2];for(var a=!0,c=0;c<t.length;c++)(!1&i||l>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[c])}))?t.splice(c--,1):(a=!1,i<l&&(l=i));if(a){e.splice(s--,1);var u=o();void 0!==u&&(n=u)}}return n}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[t,o,i]},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,l=t[0],a=t[1],c=t[2],u=0;if(l.some((function(n){return 0!==e[n]}))){for(o in a)r.o(a,o)&&(r.m[o]=a[o]);if(c)var s=c(r)}for(n&&n(t);u<l.length;u++)i=l[u],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(s)},t=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[431],(function(){return r(61)}));o=r.O(o)}();