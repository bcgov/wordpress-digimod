!function(){"use strict";var e,o={721:function(){var e=window.wp.blocks,o=window.wp.element,n=(window.wp.i18n,window.wp.data,window.wp.blockEditor);const{select:r}=wp.data;var t=window.wp.blockSerializationDefaultParser,l=JSON.parse('{"u2":"multiple-blocks-plugin/embed-youtube"}');(0,e.registerBlockType)(l.u2,{edit:function(e){const{clientId:t}=e;console.log(e);const l=(0,n.useBlockProps)(),c=((0,n.useInnerBlocksProps)(l),r("core/editor").getBlocksByClientId(t)[0]),i=c.innerBlocks;return console.log("blocks: ",c,i),(0,o.createElement)(n.InnerBlocks,{template:[["core/embed",{url:"https://youtu.be/D4DhfV7splA",type:"video",providerNameSlug:"youtube"}]],templateLock:"all"})},save:function(e){console.log("save"),console.log(e);const r=n.useBlockProps.save(),l=n.useInnerBlocksProps.save(r);console.log(l);let c=(0,t.parse)(l.children.props.children),i="";return i=c[0]?c[0].attrs.url:e.attributes.url,(0,o.createElement)("div",{"react-component":"ReactPlayer",url:i})}})}},n={};function r(e){var t=n[e];if(void 0!==t)return t.exports;var l=n[e]={exports:{}};return o[e](l,l.exports,r),l.exports}r.m=o,e=[],r.O=function(o,n,t,l){if(!n){var c=1/0;for(a=0;a<e.length;a++){n=e[a][0],t=e[a][1],l=e[a][2];for(var i=!0,s=0;s<n.length;s++)(!1&l||c>=l)&&Object.keys(r.O).every((function(e){return r.O[e](n[s])}))?n.splice(s--,1):(i=!1,l<c&&(c=l));if(i){e.splice(a--,1);var u=t();void 0!==u&&(o=u)}}return o}l=l||0;for(var a=e.length;a>0&&e[a-1][2]>l;a--)e[a]=e[a-1];e[a]=[n,t,l]},r.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},function(){var e={826:0,431:0};r.O.j=function(o){return 0===e[o]};var o=function(o,n){var t,l,c=n[0],i=n[1],s=n[2],u=0;if(c.some((function(o){return 0!==e[o]}))){for(t in i)r.o(i,t)&&(r.m[t]=i[t]);if(s)var a=s(r)}for(o&&o(n);u<c.length;u++)l=c[u],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(a)},n=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];n.forEach(o.bind(null,0)),n.push=o.bind(null,n.push.bind(n))}();var t=r.O(void 0,[431],(function(){return r(721)}));t=r.O(t)}();