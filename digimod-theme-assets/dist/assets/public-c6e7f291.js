function qs(e,t=document){if(!e)throw new Error("A selector argument is required for the qs function");return t.querySelector(e)}function createBreadcrumbs(e){const t=document.createElement("div");t.classList.add("aioseo-breadcrumbs");const n=createBreadcrumb("Home","/");t.appendChild(n);const o=createBreadcrumbSeparator();for(let r=0;r<e.length;r++){const n=e[r],c=createBreadcrumb(n.name,n.url,r===e.length-1);t.appendChild(o.cloneNode(!0)),t.appendChild(c)}return t}function createBreadcrumb(e,t,n){const o=document.createElement("span");if(o.classList.add("aioseo-breadcrumb"),t){const n=document.createElement("a");n.href=t,n.title=e,n.dataset.text=e,n.textContent=e,o.appendChild(n)}else o.textContent=e;if(!n){const e=createBreadcrumbSeparator();o.parentNode&&o.parentNode.insertBefore(e,o.nextSibling)}return o}function createBreadcrumbSeparator(){const e=document.createElement("span");return e.classList.add("aioseo-breadcrumb-separator"),e.textContent="›",e}const domReady$a=()=>{setTimeout((function(){const e=document.querySelectorAll(".case-study-group");e&&e.forEach((e=>{const t=e.querySelector(".wp-block-post-title");if(t){const n=function findParentElementByClass(e,t){let n=e.parentNode;for(;null!==n&&n.nodeType===Node.ELEMENT_NODE&&!n.classList.contains(t);)n=n.parentNode;return n}(e,"other-studies"),o=document.querySelector("body h1");n&&o&&t.innerText===o.innerText&&e.parentNode.remove();const r=t.querySelector("a");if(r){const n=r.getAttribute("href"),o=document.createElement("a");o.href=n,e.parentNode.insertBefore(o,e),o.appendChild(e),t.replaceChild(r.firstChild,r)}}}));if(document.querySelector("body.single-case-study")){const e=createBreadcrumbs([{name:"Learn",url:"/learning/"},{name:"Case studies",url:"/learning/case-studies/"},{name:document.querySelector(".wp-block-post-title").textContent}]),t=qs(".breadcrumb-placeholder");t&&t.appendChild(e)}}),0)};"complete"===document.readyState?domReady$a():document.addEventListener("DOMContentLoaded",domReady$a);const domReady$9=()=>{setTimeout((function(){const e=document.querySelectorAll(".common-component-group");e&&e.forEach((e=>{const t=e.querySelector(".taxonomy-common_component_category");if(t){const e=t.querySelectorAll(".wp-block-post-terms__separator");e&&e.forEach((e=>e.remove()));const n=t.querySelectorAll('a[rel="tag"]');n&&n.forEach((e=>{const t=document.createElement("span");t.textContent=e.textContent,t.classList.add("tag"),"Active"===e.textContent?e.remove():e.replaceWith(t)}))}const n=e.querySelector(".wp-block-post-title");if(n){const t=n.querySelector("a");if(t){const o=t.getAttribute("href"),r=document.createElement("a");r.href=o,e.parentNode.insertBefore(r,e),r.appendChild(e),n.replaceChild(t.firstChild,t)}}}));if(document.querySelector("body.single-common-component")){const e=document.querySelector(".taxonomy-common_component_category"),t=e.querySelectorAll(".wp-block-post-terms__separator");t&&t.forEach((e=>e.remove()));const n=e.querySelectorAll('a[rel="tag"]');n&&n.forEach((e=>{const t=document.createElement("span");t.textContent=e.textContent,t.classList.add("tag"),"Active"===e.textContent?e.remove():e.replaceWith(t)}));const o=document.querySelector(".getting-started-button");if(o){const e=o.querySelector(".value");if(e){o.className="wp-block-button has-size-regular is-style-default";const t=e.innerText;if(t){const n=document.createElement("a");n.href=t,n.className="wp-block-button__link wp-element-button",n.tabIndex=0,n.innerText="Start using now",e.parentNode.replaceChild(n,e)}}}const r=createBreadcrumbs([{name:"Common components",url:"/common-components/"},{name:document.querySelector(".wp-block-post-title").textContent}]),c=qs(".breadcrumb-placeholder");c&&c.appendChild(r)}}),0)};"complete"===document.readyState?domReady$9():document.addEventListener("DOMContentLoaded",domReady$9);const domReady$8=()=>{setTimeout((function(){const e=document.querySelectorAll(".cop-group");e&&e.forEach((e=>{const t=e.querySelector(".wp-block-post-title");if(t){const n=t.querySelector("a");if(n){const o=n.getAttribute("href"),r=document.createElement("a");r.href=o,e.parentNode.insertBefore(r,e),r.appendChild(e),t.replaceChild(n.firstChild,n)}}}));if(document.querySelector("body.single-cop")){const e=document.querySelectorAll(".cop-name");e&&e.forEach((e=>{const t=e.nextElementSibling;if(t&&t.classList.contains("cop-email")){const n=t.querySelector(".value").textContent.replace("mailto:",""),o=e.querySelector(".value").textContent;if(n&&o){const t=document.createElement("a");t.href=`mailto:${n}`,t.textContent=o,e.querySelector(".value").innerHTML="",e.querySelector(".value").appendChild(t)}t.remove()}}));const t=document.querySelectorAll(".cop-email");t&&t.forEach((e=>{e.remove()}));const n=document.querySelectorAll(".cop-social-link");if(n&&n.forEach((e=>{const t=e.querySelector(".value").textContent;if(t&&""!==t){const n=document.createElement("a");n&&(n.href=t,n.textContent="",e.classList.contains("msteams-link")&&(n.textContent="MS Teams"),e.classList.contains("rocketchat-link")&&(n.textContent="RocketChat"),e.classList.contains("yammer-link")&&(n.textContent="Yammer"),e.classList.contains("website-link")&&(n.textContent="Website")),e.appendChild(n),e.querySelector(".value").remove()}})),0===n.length){const e=document.querySelector(".cop-social-links-group");e&&e.remove()}const o=createBreadcrumbs([{name:"Communities",url:"/communities/"},{name:document.querySelector(".wp-block-post-title").textContent}]),r=qs(".breadcrumb-placeholder");r&&r.appendChild(o)}}),0)};"complete"===document.readyState?domReady$8():document.addEventListener("DOMContentLoaded",domReady$8);const domReady$7=()=>{setTimeout((function(){if(document.querySelector("body.learning")){const e=document.querySelector(".podcast-button");if(e){const t=e.querySelector(".value");if(t){e.className="wp-block-button has-size-regular is-style-underline";const n=t.innerText;if(n){const e=document.createElement("a");e.href=n,e.className="wp-block-button__link wp-element-button",e.tabIndex=0,e.innerText="Listen now",t.parentNode.replaceChild(e,t)}}}}}),0)};"complete"===document.readyState?domReady$7():document.addEventListener("DOMContentLoaded",domReady$7);const bcgovDigiModPlugin_initTrainingPage=function(){requestAnimationFrame((()=>{if(document.querySelector(".post-content.training")){const e=document.querySelectorAll(".card-container .flex-card");e&&e.forEach((e=>{const t=e.querySelector(".card-link");if(t){const n=t.querySelector(".value");if(n){const o=n.innerText;if(o){const r=document.createElement("a");r.href=o,r.className="card-title-link",r.tabIndex=0,e.parentNode.insertBefore(r,e),r.appendChild(e);e.querySelectorAll(".taxonomy-training_categories a").forEach((e=>{const t=document.createElement("span");t.className="training-card-tags",t.textContent=e.textContent,e.parentNode.replaceChild(t,e)}));const c=e.querySelectorAll(".wp-block-post-terms__separator");c&&c.forEach((e=>{e.remove()})),n.parentNode.removeChild(n),t.remove()}}}}))}}))};"complete"===document.readyState?bcgovDigiModPlugin_initTrainingPage():document.addEventListener("DOMContentLoaded",bcgovDigiModPlugin_initTrainingPage());const domReady$6=()=>{setTimeout((function(){const e=document.querySelectorAll(".grid-layout");null!==e&&e.forEach((function(e){const t=e.querySelector(".grid-header");if(t){const n=t.querySelectorAll(".wp-block-heading"),o=e.querySelectorAll(".wp-block-group.flex-card");o&&o.forEach((function(e,t){const o=t%n.length,r=n[o],c=r.innerText,a=r.tagName.toLowerCase(),l=document.createElement(a);l.innerText=c,l.classList.add("wp-block-heading","mobile-only"),e.insertBefore(l,e.firstChild)}))}}))}),0)};"complete"===document.readyState?domReady$6():document.addEventListener("DOMContentLoaded",domReady$6);const domReady$5=()=>{setTimeout((function(){if(document.querySelector("body.home")){const e=document.querySelector(".breadcrumb-navigation-container");e&&e.remove();const t=document.querySelectorAll(".get-started-group");t&&t.forEach((e=>{const t=e.querySelector("h3"),n=t.querySelector("a"),o=e.querySelector(".link-label .value");if(n&&o){const e=n.getAttribute("href");for(o.innerHTML=`<a href="${e}" class="wp-block-button__link has-secondary-brand-color has-text-color has-small-font-size">${o.innerHTML}</a>`,o.classList.remove("value"),o.classList.add("wp-block-button","has-small-font-size","is-style-underline");o.parentNode.classList.length>0;)o.parentNode.classList.remove(o.parentNode.classList.item(0));o.parentNode.classList.add("wp-block-buttons"),t.replaceChild(n.firstChild,n)}}))}}),0)};"complete"===document.readyState?domReady$5():document.addEventListener("DOMContentLoaded",domReady$5);const domReady$4=()=>{setTimeout((function(){const e=document.querySelectorAll("header nav > .wp-block-navigation__container > .wp-block-navigation-item.has-child");e.length>0&&e.forEach((e=>{const t=e.querySelector("header .wp-block-navigation__submenu-container");let n=!1;e.addEventListener("pointerenter",(()=>{if(t){const e=t.querySelector(".wp-block-navigation-item:first-child button");e&&"false"===e.getAttribute("aria-expanded")&&(e.focus(),e.click(),e.blur())}const o=e.querySelector("header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container");if(o&&!n){const e=o.parentNode.parentNode;e.clientHeight<=o.clientHeight&&(e.style.height=`${o.clientHeight}px`),n=!0}})),e.addEventListener("pointerleave",(()=>{const e=t.querySelector(".wp-block-navigation-item:first-child button");e&&e.setAttribute("aria-expanded","false")}))}));const t=document.querySelectorAll("header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container");t.length>0&&t.forEach((e=>{const t=e.parentNode,n=document.createElement("li");n.classList.add("headline");const o=document.createElement("a");o.href=t.firstChild.href,o.textContent=t.firstChild.textContent,o.textContent=t.firstChild.textContent,n.appendChild(o),e.prepend(n),e.style.width="66vw";let r=!1;t.addEventListener("pointerenter",(()=>{const e=t.querySelector("header .wp-block-navigation__submenu-container .wp-block-navigation__submenu-container");e.style.width="66vw";const n=e.parentNode.parentNode,o=e;e&&!r&&(n.clientHeight<=o.clientHeight?(n.style.height=`${o.clientHeight}px`,e.style.height="calc(100% - 3rem)"):(n.style.height=`${n.clientHeight}px`,e.style.height="100%"),r=!0)}))})),setTimeout((function(){const e=document.querySelectorAll("header nav.wp-block-navigation > ul.wp-block-navigation__container > li > ul.wp-block-navigation__submenu-container > li.wp-block-navigation-link > a.wp-block-navigation-item__content");e&&e.forEach((e=>{e.classList.add("no-sub-menu"),e.addEventListener("pointerenter",(e=>{const t=e.target.closest("ul").querySelector("li").querySelector("ul");t&&(t.style.display="none")})),e.addEventListener("pointerleave",(e=>{const t=e.target.closest("ul").querySelector("li").querySelector("ul");t&&(t.style.display="block")}))}))}),50)}),0)};"complete"===document.readyState?domReady$4():document.addEventListener("DOMContentLoaded",domReady$4);const domReady$3=()=>{setTimeout((function(){const e=document.querySelector("header .current-menu-item");if(e){let t=e.closest("ul");const n=e.closest("ul").querySelectorAll(".current-menu-ancestor"),o=e.closest("ul").querySelectorAll(".current-menu-item > ul");if(o&&o.forEach((function(e){e.classList.add("current-menu-ancestor")})),t)for(;null!==t&&t.classList.contains("wp-block-navigation__submenu-container");)t.parentNode.classList.add("current-menu-ancestor"),t=t.parentNode.closest("ul");n&&n.forEach((function(e){e.classList.add("current-menu-ancestor")}))}function highlightMainNavItem(e){if(function hasSubPage(e){const t=document.querySelectorAll(".aioseo-breadcrumbs .aioseo-breadcrumb a");for(const n of t)if(n.href.includes(e))return!0;return!1}(e)){const t=document.querySelectorAll(`.wp-block-navigation-item a[href*="${e}"]`);if(t&&t.length>0){const e=t[0],n=window.location.href;if(e.href!==n){t[t.length-1].classList.add("current-menu-ancestor")}}}}(function getTopLevelNavItems(){const e=document.querySelectorAll(".wp-block-navigation__container .wp-block-navigation-item a"),t=[];return e.forEach((e=>{const n=new URL(e.href).pathname.split("/").filter((e=>e));n.length>0&&t.push(n[0])})),t})().forEach((e=>{highlightMainNavItem(e)}))}),0)};"complete"===document.readyState?domReady$3():document.addEventListener("DOMContentLoaded",domReady$3);const domReady$2=()=>{setTimeout((function(){const e=document.querySelector(".in-page-nav");if(e){const t=Array.from(e.querySelectorAll("a"));let n=!1;if(t){const e=t.map((e=>document.querySelector(e.getAttribute("href"))));if(e){const o=new window.IntersectionObserver((e=>{let o=null;if(e.forEach((e=>{e.isIntersecting&&!o&&(o=e.target)})),o){const e=t.find((e=>e.getAttribute("href")===`#${o.id}`));e&&!n&&(t.forEach((e=>e.parentNode.classList.remove("active"))),e.parentNode.classList.add("active"))}}),{rootMargin:"15% 0% -75% 0%"});e.forEach((e=>{o.observe(e)})),t.forEach((e=>{e.addEventListener("click",(o=>{o.preventDefault(),t.forEach((e=>e.parentNode.classList.remove("active"))),e.parentNode.classList.add("active"),n=!0;const r=document.querySelector(e.getAttribute("href"));r&&(r.scrollIntoView({behavior:"smooth",scrollMarginTop:32}),setTimeout((()=>{r.setAttribute("tabindex","0"),r.focus(),r.removeAttribute("tabindex"),r.style.outline="none"}),1e3)),setTimeout((()=>{n=!1}),1e3)}))}))}t.forEach((e=>e.parentNode.classList.remove("active"))),t[0].parentNode.classList.add("active")}const o=document.querySelector(".sticky");if(o){const e=document.createElement("h2");e.className="mobile-only",e.textContent="On this page",o.insertBefore(e,o.firstChild)}}}),0)};"complete"===document.readyState?domReady$2():document.addEventListener("DOMContentLoaded",domReady$2);const domReady$1=()=>{setTimeout((function(){const e=document.querySelector(".flex-cards"),t=document.querySelectorAll(".flex-card");(e||t)&&t&&t.forEach((e=>{const t=e.querySelector(".card-title");if(t){const n=t.querySelector("a");if(n){n.firstChild?t.replaceChild(n.firstChild,n):t.remove();const o=n.getAttribute("href"),r=document.createElement("a");r.href=o,e.parentNode.insertBefore(r,e),r.appendChild(e),r.classList.add("card-title-link")}}}))}),0)};"complete"===document.readyState?domReady$1():document.addEventListener("DOMContentLoaded",domReady$1);const domReady=()=>{setTimeout((function(){setTimeout((function(){const e=document.querySelectorAll(".bcgov-body-content a");e&&e.forEach((e=>{e.setAttribute("data-text",e.innerText)}))}),50)}),0)};"complete"===document.readyState?domReady():document.addEventListener("DOMContentLoaded",domReady);
