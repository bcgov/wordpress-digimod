!function(){"use strict";var e,t={195:function(){var e=window.wp.blocks,t=window.wp.element,l=(window.wp.components,window.wp.i18n,window.wp.blockEditor),n=(window.wp.data,window.React);const s="undefined"!=typeof window;class i extends n.Component{constructor(e){super(e),this.props=e,this.scrollTargetIds=this.props.scrollTargetIds,this.activeNavClass=this.props.activeNavClass,this.scrollDuration=Number(this.props.scrollDuration)||1e3,this.headerBackground="true"===this.props.headerBackground,this.offset=this.props.offset||0,this.scrollElementSelector=this.props.scrollElementSelector,this.onScroll=this.onScroll.bind(this),this.props.router&&"HashRouter"===this.props.router?(this.homeDefaultLink="#/",this.hashIdentifier="#/#"):(this.homeDefaultLink="/",this.hashIdentifier="#")}onScroll(){let e,t,l=null,n=null,i=null;s&&(this.scrollElementSelector?(l=document.querySelectorAll(this.scrollElementSelector)[0].scrollTop,n=document.querySelectorAll(this.scrollElementSelector)[0].clientHeight,i=document.querySelectorAll(this.scrollElementSelector)[0].scrollHeight):(n=window.innerHeight,l=window.pageYOffset,i=document.body.scrollHeight));let r=[];this.scrollTargetIds.forEach(((l,n)=>{if(!document.getElementById(l))return void console.warn(`react-scrollspy-nav: no element with id ${l} present in the DOM`);let s,i;if(this.scrollElementSelector){let n=document.getElementById(l+"_link");const r=document.querySelectorAll(this.scrollElementSelector)[0].getBoundingClientRect();s=document.getElementById(l).getBoundingClientRect(),i=n.getBoundingClientRect(),e=s.top-r.top,t=i.top-r.top}else e=document.getElementById(l).offsetTop-(this.headerBackground?document.querySelector("div[data-nav='list']").scrollHeight:0);(s.top<=i.top||0==n)&&r.push(l)})),this.scrollTargetIds.forEach(((e,t)=>{r.at(-1)==e?this.getNavLinkElement(e).classList.add(this.activeNavClass):this.getNavLinkElement(e).classList.remove(this.activeNavClass)}))}isInViewport(e,t){const l=e.getBoundingClientRect();return l.top>=0&&l.left>=0&&l.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&l.right<=(window.innerWidth||document.documentElement.clientWidth)}easeInOutQuad(e,t,l,n){return(e/=n/2)<1?l/2*e*e+t:-l/2*(--e*(e-2)-1)+t}scrollTo(e,t,l){let n=t-e,i=0,r=()=>{i+=10;let t=this.easeInOutQuad(i,e,n,l);s&&window.scrollTo(0,t),i<l&&setTimeout(r,10)};r()}getNavLinkElement(e){return document.querySelector(`a[href='${this.hashIdentifier}${e}']`)}getNavToSectionID(e){return e.includes(this.hashIdentifier)?e.replace(this.hashIdentifier,""):""}clearOtherNavLinkActiveStyle(e){this.scrollTargetIds.map(((t,l)=>{t!==e&&this.getNavLinkElement(t).classList.remove(this.activeNavClass)}))}componentDidMount(){let e=null;s&&(e=this.scrollElementSelector?document.querySelectorAll('[aria-label="Editor content"]')[0]:window),s&&e.addEventListener("scroll",this.onScroll)}componentWillUnmount(){s&&window.removeEventListener("scroll",this.onScroll)}componentDidUpdate(){try{this.getNavLinkElement(this.scrollTargetIds[0]).classList.add(this.activeNavClass)}catch(e){}}render(){return(0,t.createElement)("div",{"data-nav":"list"},this.props.children)}}var r=JSON.parse('{"u2":"multiple-blocks-plugin/scrollspy"}');(0,e.registerBlockType)(r.u2,{edit:function(e){let{attributes:n,setAttributes:s,isSelected:r}=e;const{level:o,content:a}=n;return(0,t.createElement)("div",(0,l.useBlockProps)(),(0,t.createElement)("div",{className:"scrollspyContainer"},(0,t.createElement)("div",{className:"scrollspy",role:"navigation","aria-label":"on this page"},(0,t.createElement)("h2",{className:"scrollspyOnThisPage h3-heading","aria-hidden":"true"},"On this page:"),(0,t.createElement)(i,{scrollTargetIds:["mission1","mission2","mission3","mission4"],offset:100,activeNavClass:"active-scrollspy",scrollDuration:"1000",scrollElementSelector:'[aria-label="Editor content"]'},(0,t.createElement)("div",{className:"scrollspy_highlight"}),(0,t.createElement)("ul",null,(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission1",id:"mission1_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Connected services"))),(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission2",id:"mission2_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Digital Trust"))),(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission3",id:"mission3_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Reliable and sustainable technology"))),(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission4",id:"mission4_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Digitally equipped BC Public Service"))),(0,t.createElement)("li",{class:"scrollSpyButtonWrapper"},(0,t.createElement)("a",{class:"scrollSpyButton",href:"#"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Download the plan (PDF, 101.7KB)"))))))))},save:function(e){let{attributes:l}=e;return(0,t.createElement)("div",{className:"scrollspyContainer"},(0,t.createElement)("div",{className:"scrollspy",role:"navigation","aria-label":"on this page",style:{top:"116px"}},(0,t.createElement)("h2",{className:"scrollspyOnThisPage h3-heading","aria-hidden":"true"},"On this page:"),(0,t.createElement)("div",{"react-component":"ScrollspyNav",scrollTargetIds:'["mission1", "mission2", "mission3", "mission4"]',offset:"100",activeNavClass:"active-scrollspy",scrollDuration:"1000"},(0,t.createElement)("div",{className:"scrollspy_highlight"}),(0,t.createElement)("ul",null,(0,t.createElement)("li",null,(0,t.createElement)("a",{className:"active-scrollspy",href:"#mission1",id:"mission1_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Connected services"))),(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission2",id:"mission2_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Digital Trust"))),(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission3",id:"mission3_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Reliable and sustainable technology"))),(0,t.createElement)("li",null,(0,t.createElement)("a",{href:"#mission4",id:"mission4_link"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Digitally equipped BC Public Service"))),(0,t.createElement)("li",{class:"scrollSpyButtonWrapper"},(0,t.createElement)("a",{class:"scrollSpyButton",href:"#"},(0,t.createElement)("span",{class:"scrollSpyLinkContent"},"Download the plan (PDF, 101.7KB)")))))))}})}},l={};function n(e){var s=l[e];if(void 0!==s)return s.exports;var i=l[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.m=t,e=[],n.O=function(t,l,s,i){if(!l){var r=1/0;for(m=0;m<e.length;m++){l=e[m][0],s=e[m][1],i=e[m][2];for(var o=!0,a=0;a<l.length;a++)(!1&i||r>=i)&&Object.keys(n.O).every((function(e){return n.O[e](l[a])}))?l.splice(a--,1):(o=!1,i<r&&(r=i));if(o){e.splice(m--,1);var c=s();void 0!==c&&(t=c)}}return t}i=i||0;for(var m=e.length;m>0&&e[m-1][2]>i;m--)e[m]=e[m-1];e[m]=[l,s,i]},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,431:0};n.O.j=function(t){return 0===e[t]};var t=function(t,l){var s,i,r=l[0],o=l[1],a=l[2],c=0;if(r.some((function(t){return 0!==e[t]}))){for(s in o)n.o(o,s)&&(n.m[s]=o[s]);if(a)var m=a(n)}for(t&&t(l);c<r.length;c++)i=r[c],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(m)},l=self.webpackChunkmultiple_blocks_plugin=self.webpackChunkmultiple_blocks_plugin||[];l.forEach(t.bind(null,0)),l.push=t.bind(null,l.push.bind(l))}();var s=n.O(void 0,[431],(function(){return n(195)}));s=n.O(s)}();