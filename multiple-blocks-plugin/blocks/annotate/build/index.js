!function(){"use strict";var n,e={528:function(){var n=window.wp.blocks,e=window.wp.element,t=(window.wp.i18n,window.wp.blockEditor),r=JSON.parse('{"u2":"multiple-blocks-plugin/annotate"}');(0,n.registerBlockType)(r.u2,{edit:function(n){const{attributes:r,setAttributes:o}=n;return(0,t.useBlockProps)(),(0,e.createElement)("div",{class:"dmAnnotate"},(0,e.createElement)(t.RichText,{className:"undefined",tagName:"div",value:r.content,onChange:n=>{o({content:n})},placeholder:"Annotation..."}))},save:function(n){}})}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.m=e,n=[],r.O=function(e,t,o,i){if(!t){var u=1/0;for(s=0;s<n.length;s++){t=n[s][0],o=n[s][1],i=n[s][2];for(var c=!0,l=0;l<t.length;l++)(!1&i||u>=i)&&Object.keys(r.O).every((function(n){return r.O[n](t[l])}))?t.splice(l--,1):(c=!1,i<u&&(u=i));if(c){n.splice(s--,1);var a=o();void 0!==a&&(e=a)}}return e}i=i||0;for(var s=n.length;s>0&&n[s-1][2]>i;s--)n[s]=n[s-1];n[s]=[t,o,i]},r.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={826:0,431:0};r.O.j=function(e){return 0===n[e]};var e=function(e,t){var o,i,u=t[0],c=t[1],l=t[2],a=0;if(u.some((function(e){return 0!==n[e]}))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(l)var s=l(r)}for(e&&e(t);a<u.length;a++)i=u[a],r.o(n,i)&&n[i]&&n[i][0](),n[i]=0;return r.O(s)},t=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var o=r.O(void 0,[431],(function(){return r(528)}));o=r.O(o)}();