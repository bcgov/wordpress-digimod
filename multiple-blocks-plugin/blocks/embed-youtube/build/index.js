!function(){"use strict";var e,n={721:function(){var e=window.wp.blocks,n=window.wp.element,o=(window.wp.i18n,window.wp.data,window.wp.blockEditor);const{select:r}=wp.data;window.wp.blockSerializationDefaultParser;var t=JSON.parse('{"u2":"multiple-blocks-plugin/embed-youtube"}');(0,e.registerBlockType)(t.u2,{edit:function(e){const{clientId:t}=e;console.log(e);const l=(0,o.useBlockProps)(),i=((0,o.useInnerBlocksProps)(l),r("core/editor").getBlocksByClientId(t)[0]),u=i.innerBlocks;return console.log("blocks: ",i,u),(0,n.createElement)(o.InnerBlocks,{template:[["core/embed",{url:"https://youtu.be/D4DhfV7splA",type:"video",providerNameSlug:"youtube"}]],templateLock:"all"})},save:function(e){return null}})}},o={};function r(e){var t=o[e];if(void 0!==t)return t.exports;var l=o[e]={exports:{}};return n[e](l,l.exports,r),l.exports}r.m=n,e=[],r.O=function(n,o,t,l){if(!o){var i=1/0;for(p=0;p<e.length;p++){o=e[p][0],t=e[p][1],l=e[p][2];for(var u=!0,c=0;c<o.length;c++)(!1&l||i>=l)&&Object.keys(r.O).every((function(e){return r.O[e](o[c])}))?o.splice(c--,1):(u=!1,l<i&&(i=l));if(u){e.splice(p--,1);var s=t();void 0!==s&&(n=s)}}return n}l=l||0;for(var p=e.length;p>0&&e[p-1][2]>l;p--)e[p]=e[p-1];e[p]=[o,t,l]},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};r.O.j=function(n){return 0===e[n]};var n=function(n,o){var t,l,i=o[0],u=o[1],c=o[2],s=0;if(i.some((function(n){return 0!==e[n]}))){for(t in u)r.o(u,t)&&(r.m[t]=u[t]);if(c)var p=c(r)}for(n&&n(o);s<i.length;s++)l=i[s],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(p)},o=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];o.forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o))}();var t=r.O(void 0,[431],(function(){return r(721)}));t=r.O(t)}();