!function(){"use strict";var e,n={570:function(){var e=window.wp.blocks,n=window.wp.element,t=(window.wp.components,window.wp.i18n,window.wp.blockEditor);window.wp.data;var r=JSON.parse('{"u2":"multiple-blocks-plugin/template-acf-wysiwyg-container"}');(0,e.registerBlockType)(r.u2,{edit:function(e){let{attributes:r,setAttributes:i,isSelected:l}=e;const{field_name:o,field_value:a,tag_type:c,class_name:u}=r;return(0,n.useEffect)((()=>{let e=null;void 0!==acf.getFields({name:o})[0]?(e=acf.getFields({name:o})[0].val(),console.log("ACF REMOVE: ",o,acf.getFields({name:o})[0]),acf.set(o,e),acf.getFields({name:o})[0].remove()):acf.get(o)&&(e=acf.get(o)),e&&i({...r,field_value:e})}),[acf.getFields({name:o})[0]]),(0,n.createElement)(t.InnerBlocks,null)},save:function(e){let{attributes:r}=e;return(0,n.createElement)(t.InnerBlocks.Content,null)}})}},t={};function r(e){var i=t[e];if(void 0!==i)return i.exports;var l=t[e]={exports:{}};return n[e](l,l.exports,r),l.exports}r.m=n,e=[],r.O=function(n,t,i,l){if(!t){var o=1/0;for(s=0;s<e.length;s++){t=e[s][0],i=e[s][1],l=e[s][2];for(var a=!0,c=0;c<t.length;c++)(!1&l||o>=l)&&Object.keys(r.O).every((function(e){return r.O[e](t[c])}))?t.splice(c--,1):(a=!1,l<o&&(o=l));if(a){e.splice(s--,1);var u=i();void 0!==u&&(n=u)}}return n}l=l||0;for(var s=e.length;s>0&&e[s-1][2]>l;s--)e[s]=e[s-1];e[s]=[t,i,l]},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={826:0,431:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var i,l,o=t[0],a=t[1],c=t[2],u=0;if(o.some((function(n){return 0!==e[n]}))){for(i in a)r.o(a,i)&&(r.m[i]=a[i]);if(c)var s=c(r)}for(n&&n(t);u<o.length;u++)l=o[u],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(s)},t=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var i=r.O(void 0,[431],(function(){return r(570)}));i=r.O(i)}();