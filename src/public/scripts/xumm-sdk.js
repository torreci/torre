require=function t(e,r,o){function n(s,a){if(!r[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var d=r[s]={exports:{}};e[s][0].call(d.exports,(function(t){return n(e[s][1][t]||t)}),d,d.exports,t,e,r,o)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)n(o[s]);return n}({1:[function(t,e,r){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.JwtUserdata=void 0;const n=t("debug"),i=t("./utils"),s=n.debug("xumm-sdk:xapp:userdata");r.JwtUserdata=class{constructor(t){s("Constructed"),this.Meta=t}list(){return o(this,void 0,void 0,(function*(){const t=yield this.Meta.call("userdata","GET");return i.throwIfError(t),t.keys}))}get(t){var e;return o(this,void 0,void 0,(function*(){const r=Array.isArray(t)?t.join(","):t,o=yield this.Meta.call("userdata/"+r,"GET");return i.throwIfError(o),r.split(",").length>1?o.data:(null===(e=o.data)||void 0===e?void 0:e[r])||{}}))}delete(t){return o(this,void 0,void 0,(function*(){const e=yield this.Meta.call("userdata/"+t,"DELETE");return i.throwIfError(e),e.persisted}))}set(t,e){return o(this,void 0,void 0,(function*(){const r=yield this.Meta.call("userdata/"+t,"POST",e);return i.throwIfError(r),r.persisted}))}}},{"./utils":6,debug:8}],2:[function(t,e,r){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))},n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0}),r.Meta=void 0;const i=t("debug"),s=n(t("fetch-ponyfill")),{fetch:a,Request:u,Response:c,Headers:d}=s.default(),l=t("os-browserify"),h=t("./utils"),f=t("./index"),p=i.debug("xumm-sdk:meta");r.Meta=class{constructor(t,e){this.isBrowser=!1,this.jwtFlow=!1,this.injected=!1,this.endpoint="https://xumm.app",p("Constructed");const r=new RegExp("^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$"),o={split:e.split(":"),uuidv4:""};if(3===o.split.length&&"xApp:OneTimeToken"===o.split.slice(0,2).join(":")?(o.uuidv4=o.split[2],this.jwtFlow=!0):o.split.length>1&&"RAWJWT"===o.split[0]?(this.jwtFlow=!0,this.jwt=o.split.slice(1).join(":")):o.uuidv4=e,!r.test(t)||!r.test(o.uuidv4)){if(!this.jwtFlow)throw new Error("Invalid API Key and/or API Secret. Use dotenv or constructor params.");if(!this.jwt)throw new Error("Invalid API Key and/or OTT (One Time Token). Provide OTT param (2nd param) or make sure `xAppToken` query param is present (Browser)")}return"undefined"!=typeof globalThis&&Object.keys(globalThis).indexOf("window")<0?p("Running in node"):(console.log("XUMM SDK: Running in browser"),this.isBrowser=!0),this.apiKey=t,this.apiSecret=o.uuidv4,this.jwtFlow&&!this.jwt&&(this.authPromise=new Promise((t=>{this.authPromiseResolve=t})),Promise.resolve().then((()=>this.authorize())).catch((t=>{p("Authorize error:",t.message),(null==this?void 0:this.invoker)&&this.invoker.caught(t),this.authPromiseResolve&&this.authPromiseResolve()}))),this}setEndpoint(t){return!!t.match(/^http/)&&(this.endpoint=t.trim(),!0)}authorize(){var t,e,r,n;return o(this,void 0,void 0,(function*(){let o;p("JWT Authorize",this.apiSecret),(null==this?void 0:this.invoker)&&this.invoker.constructor===f.XummSdkJwt&&(o=this.invoker._jwtStore(this,(t=>this.jwt=t)));const i=(null==o?void 0:o.get(this.apiSecret))||(yield this.call("authorize"));if(null===(e=null===(t=i)||void 0===t?void 0:t.error)||void 0===e?void 0:e.code)p("Could not resolve API Key & OTT to JWT (already fetched? Unauthorized?)"),(null==this?void 0:this.invoker)&&this.invoker.constructor===f.XummSdkJwt&&(null===(r=null==this?void 0:this.invoker)||void 0===r?void 0:r.fatalHandler)?this.invoker.fatalHandler(new Error(i.error.reference)):h.throwIfError(i);else{if(!(null===(n=i)||void 0===n?void 0:n.jwt))throw new Error("Unexpected response for xApp JWT authorize request");{const t=i;null==o||o.set(this.apiSecret,t)}}this.authPromiseResolve&&this.authPromiseResolve()}))}call(t,e="GET",r){var n;return o(this,void 0,void 0,(function*(){const o=e.toUpperCase();this.jwtFlow&&!(null==this?void 0:this.jwt)&&this.authPromise&&"authorize"!==t&&(yield this.authPromise);try{let e;void 0!==r&&("object"==typeof r&&null!==r&&(e=JSON.stringify(r)),"string"==typeof r&&(e=r));const n={"Content-Type":"application/json"};this.isBrowser||Object.assign(n,{"User-Agent":`xumm-sdk/node (${l.hostname()}) node-fetch`}),this.jwtFlow?"authorize"===t?Object.assign(n,{"x-api-key":this.apiKey,"x-api-ott":this.apiSecret}):Object.assign(n,{Authorization:"Bearer "+this.jwt}):Object.assign(n,{"x-api-key":this.apiKey,"x-api-secret":this.apiSecret});const i=["authorize","ping","curated-assets","rates","payload","userdata"],s=this.jwtFlow&&i.indexOf(t.split("/")[0])>-1?"jwt":"platform",u=yield a(this.endpoint+"/api/v1/"+s+"/"+t,{method:o,body:e,headers:n});return yield u.json()}catch(e){const r=new Error(`Unexpected response from XUMM API [${o}:${t}]`);throw r.stack=(null===(n=e)||void 0===n?void 0:n.stack)||void 0,r}}))}ping(){var t,e;return o(this,void 0,void 0,(function*(){const r=yield this.call("ping");if(h.throwIfError(r),void 0!==r.auth)return r.auth;if(void 0!==(null===(t=r)||void 0===t?void 0:t.ott_uuidv4))return{application:{uuidv4:r.app_uuidv4,name:r.app_name},jwtData:r};if(void 0!==(null===(e=r)||void 0===e?void 0:e.usertoken_uuidv4))return{application:{uuidv4:r.client_id,name:r.app_name},jwtData:r};throw new Error("Unexpected response for ping request")}))}getCuratedAssets(){return o(this,void 0,void 0,(function*(){return yield this.call("curated-assets")}))}getRates(t){return o(this,void 0,void 0,(function*(){return yield this.call("rates/"+t.trim().toUpperCase())}))}getKycStatus(t){return o(this,void 0,void 0,(function*(){if(t.trim().match(/^r/)){const e=yield this.call("kyc-status/"+t.trim());return(null==e?void 0:e.kycApproved)?"SUCCESSFUL":"NONE"}{const e=yield this.call("kyc-status","POST",{user_token:t});return(null==e?void 0:e.kycStatus)||"NONE"}}))}getTransaction(t){return o(this,void 0,void 0,(function*(){return yield this.call("xrpl-tx/"+t.trim())}))}verifyUserTokens(t){return o(this,void 0,void 0,(function*(){return(yield this.call("user-tokens","POST",{tokens:Array.isArray(t)?t:[t]})).tokens}))}_inject(t){if(this.injected)throw new Error("Cannot `_inject` twice");this.invoker=t}}},{"./index":"xumm-sdk","./utils":6,debug:8,"fetch-ponyfill":11,"os-browserify":13}],3:[function(t,e,r){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.Payload=void 0;const n=t("debug"),i=t("websocket"),s=t("./utils"),a=n.debug("xumm-sdk:payload"),u=n.debug("xumm-sdk:payload:websocket");r.Payload=class{constructor(t){a("Constructed"),this.Meta=t}resolvePayload(t){var e,r,n;return o(this,void 0,void 0,(function*(){if("string"==typeof t)return yield this.get(t,!0);if(void 0!==(null===(e=t)||void 0===e?void 0:e.uuid))return yield this.get(t.uuid,!0);if(void 0!==(null===(n=null===(r=t)||void 0===r?void 0:r.meta)||void 0===n?void 0:n.uuid))return t;throw new Error("Could not resolve payload (not found)")}))}create(t,e=!1){var r;return o(this,void 0,void 0,(function*(){const o=void 0!==t.TransactionType&&void 0===t.txjson,n=yield this.Meta.call("payload","POST",o?{txjson:t}:t);e&&s.throwIfError(n);return void 0!==(null===(r=n)||void 0===r?void 0:r.next)?n:null}))}get(t,e=!1){var r,n;return o(this,void 0,void 0,(function*(){const o="string"==typeof t?t:null==t?void 0:t.uuid,i=yield this.Meta.call("payload/"+o,"GET");e&&s.throwIfError(i);return void 0!==(null===(n=null===(r=i)||void 0===r?void 0:r.meta)||void 0===n?void 0:n.uuid)?i:null}))}subscribe(t,e){var r,n;return o(this,void 0,void 0,(function*(){const a=new s.DeferredPromise,c=yield this.resolvePayload(t);if(c){const t="undefined",s=typeof(null===(r=globalThis)||void 0===r?void 0:r.MockedWebSocket)!==t&&typeof jest!==t?new(null===(n=globalThis)||void 0===n?void 0:n.MockedWebSocket)("ws://xumm.local"):new i.w3cwebsocket(this.Meta.endpoint.replace(/^http/,"ws")+"/sign/"+c.meta.uuid);return a.promise.then((()=>{s.close()})),s.onopen=()=>{u(`Payload ${c.meta.uuid}: Subscription active (WebSocket opened)`)},s.onmessage=t=>o(this,void 0,void 0,(function*(){const r=t.data;let n;try{n=JSON.parse(r.toString())}catch(t){u(`Payload ${c.meta.uuid}: Received message, unable to parse as JSON`,t)}if(n&&e&&void 0===n.devapp_fetched)try{const t=yield e({uuid:c.meta.uuid,data:n,resolve(t){return o(this,void 0,void 0,(function*(){yield a.resolve(t||void 0)}))},payload:c});void 0!==t&&a.resolve(t)}catch(t){u(`Payload ${c.meta.uuid}: Callback exception`,t)}})),s.onclose=t=>{u(`Payload ${c.meta.uuid}: Subscription ended (WebSocket closed)`)},{payload:c,resolve(t){a.resolve(t||void 0)},resolved:a.promise,websocket:s}}throw s.throwIfError(c),Error("Couldn't subscribe: couldn't fetch payload")}))}cancel(t,e=!1){var r,n,i;return o(this,void 0,void 0,(function*(){const o=yield this.resolvePayload(t),a=yield this.Meta.call("payload/"+(null===(r=null==o?void 0:o.meta)||void 0===r?void 0:r.uuid),"DELETE");e&&s.throwIfError(a);return void 0!==(null===(i=null===(n=a)||void 0===n?void 0:n.meta)||void 0===i?void 0:i.uuid)?a:null}))}createAndSubscribe(t,e){return o(this,void 0,void 0,(function*(){const r=yield this.create(t,!0);if(r){const t=yield this.subscribe(r,e);return Object.assign({created:r},t)}throw new Error("Error creating payload or subscribing to created payload")}))}}},{"./utils":6,debug:8,websocket:15}],4:[function(t,e,r){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.Push=void 0;const n=t("debug"),i=t("./JwtUserdata"),s=t("./utils"),a=n.debug("xumm-sdk:xapp");r.Push=class{constructor(t){a("Constructed"),this.Meta=t,this.userdata=new i.JwtUserdata(t)}event(t){return o(this,void 0,void 0,(function*(){const e=yield this.Meta.call("xapp/event","POST",t);return s.throwIfError(e),e}))}notification(t){return o(this,void 0,void 0,(function*(){const e=yield this.Meta.call("xapp/push","POST",t);return s.throwIfError(e),e}))}}},{"./JwtUserdata":1,"./utils":6,debug:8}],5:[function(t,e,r){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.Storage=void 0;const n=t("debug"),i=t("./utils"),s=n.debug("xumm-sdk:storage");r.Storage=class{constructor(t){s("Constructed"),this.Meta=t}get(){return o(this,void 0,void 0,(function*(){const t=yield this.Meta.call("app-storage","GET");return i.throwIfError(t),t.data}))}set(t){return o(this,void 0,void 0,(function*(){const e=yield this.Meta.call("app-storage","POST",t);return i.throwIfError(e),e.stored}))}delete(){return o(this,void 0,void 0,(function*(){const t=yield this.Meta.call("app-storage","DELETE");return i.throwIfError(t),t.stored}))}}},{"./utils":6,debug:8}],6:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.DeferredPromise=r.throwIfError=void 0,r.throwIfError=function(t){var e,r,o,n,i,s;if(void 0!==t.message)throw new Error(t.message);if(void 0===t.next&&void 0===(null===(r=null===(e=t)||void 0===e?void 0:e.meta)||void 0===r?void 0:r.uuid)&&void 0===(null===(n=null===(o=t)||void 0===o?void 0:o.application)||void 0===n?void 0:n.uuidv4)&&void 0!==(null===(s=null===(i=t)||void 0===i?void 0:i.error)||void 0===s?void 0:s.code)){const e=t.error;throw new Error(`Error code ${e.code}, see XUMM Dev Console, reference: ${e.reference}`)}};r.DeferredPromise=class{constructor(){this.resolveFn=t=>{},this.rejectFn=t=>{},this.promise=new Promise(((t,e)=>{this.resolveFn=t,this.rejectFn=e}))}resolve(t){return this.resolveFn(t),this.promise}reject(t){return this.rejectFn(t),this.promise}}},{}],7:[function(t,e,r){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.xApp=void 0;const n=t("debug"),i=t("./JwtUserdata"),s=t("./utils"),a=n.debug("xumm-sdk:xapp");r.xApp=class{constructor(t){a("Constructed"),this.Meta=t,this.userdata=new i.JwtUserdata(t)}get(t){return o(this,void 0,void 0,(function*(){const e=yield this.Meta.call("xapp/ott/"+t,"GET");return s.throwIfError(e),e}))}}},{"./JwtUserdata":1,"./utils":6,debug:8}],8:[function(t,e,r){(function(o){(function(){r.formatArgs=function(t){if(t[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+t[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const r="color: "+this.color;t.splice(1,0,r,"color: inherit");let o=0,n=0;t[0].replace(/%[a-zA-Z%]/g,(t=>{"%%"!==t&&(o++,"%c"===t&&(n=o))})),t.splice(n,0,r)},r.save=function(t){try{t?r.storage.setItem("debug",t):r.storage.removeItem("debug")}catch(t){}},r.load=function(){let t;try{t=r.storage.getItem("debug")}catch(t){}!t&&void 0!==o&&"env"in o&&(t=o.env.DEBUG);return t},r.useColors=function(){if("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},r.storage=function(){try{return localStorage}catch(t){}}(),r.destroy=(()=>{let t=!1;return()=>{t||(t=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})(),r.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],r.log=console.debug||console.log||(()=>{}),e.exports=t("./common")(r);const{formatters:n}=e.exports;n.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}}).call(this)}).call(this,t("_process"))},{"./common":9,_process:14}],9:[function(t,e,r){e.exports=function(e){function r(t){let e,n=null;function i(...t){if(!i.enabled)return;const o=i,n=Number(new Date),s=n-(e||n);o.diff=s,o.prev=e,o.curr=n,e=n,t[0]=r.coerce(t[0]),"string"!=typeof t[0]&&t.unshift("%O");let a=0;t[0]=t[0].replace(/%([a-zA-Z%])/g,((e,n)=>{if("%%"===e)return"%";a++;const i=r.formatters[n];if("function"==typeof i){const r=t[a];e=i.call(o,r),t.splice(a,1),a--}return e})),r.formatArgs.call(o,t);(o.log||r.log).apply(o,t)}return i.namespace=t,i.useColors=r.useColors(),i.color=r.selectColor(t),i.extend=o,i.destroy=r.destroy,Object.defineProperty(i,"enabled",{enumerable:!0,configurable:!1,get:()=>null===n?r.enabled(t):n,set:t=>{n=t}}),"function"==typeof r.init&&r.init(i),i}function o(t,e){const o=r(this.namespace+(void 0===e?":":e)+t);return o.log=this.log,o}function n(t){return t.toString().substring(2,t.toString().length-2).replace(/\.\*\?$/,"*")}return r.debug=r,r.default=r,r.coerce=function(t){if(t instanceof Error)return t.stack||t.message;return t},r.disable=function(){const t=[...r.names.map(n),...r.skips.map(n).map((t=>"-"+t))].join(",");return r.enable(""),t},r.enable=function(t){let e;r.save(t),r.names=[],r.skips=[];const o=("string"==typeof t?t:"").split(/[\s,]+/),n=o.length;for(e=0;e<n;e++)o[e]&&("-"===(t=o[e].replace(/\*/g,".*?"))[0]?r.skips.push(new RegExp("^"+t.substr(1)+"$")):r.names.push(new RegExp("^"+t+"$")))},r.enabled=function(t){if("*"===t[t.length-1])return!0;let e,o;for(e=0,o=r.skips.length;e<o;e++)if(r.skips[e].test(t))return!1;for(e=0,o=r.names.length;e<o;e++)if(r.names[e].test(t))return!0;return!1},r.humanize=t("ms"),r.destroy=function(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")},Object.keys(e).forEach((t=>{r[t]=e[t]})),r.names=[],r.skips=[],r.formatters={},r.selectColor=function(t){let e=0;for(let r=0;r<t.length;r++)e=(e<<5)-e+t.charCodeAt(r),e|=0;return r.colors[Math.abs(e)%r.colors.length]},r.enable(r.load()),r}},{ms:12}],10:[function(t,e,r){var o=function(){if("object"==typeof self&&self)return self;if("object"==typeof window&&window)return window;throw new Error("Unable to resolve global `this`")};e.exports=function(){if(this)return this;if("object"==typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(t){return o()}try{return __global__||o()}finally{delete Object.prototype.__global__}}()},{}],11:[function(t,e,r){(function(t){(function(){!function(t){"use strict";function o(o){var n=o&&o.Promise||t.Promise,i=o&&o.XMLHttpRequest||t.XMLHttpRequest;return function(){var o=Object.create(t,{fetch:{value:void 0,writable:!0}});return function(t,o){"object"==typeof r&&void 0!==e?o(r):"function"==typeof define&&define.amd?define(["exports"],o):o(t.WHATWGFetch={})}(this,(function(t){var e=void 0!==o&&o||"undefined"!=typeof self&&self||void 0!==e&&e,r="URLSearchParams"in e,s="Symbol"in e&&"iterator"in Symbol,a="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(t){return!1}}(),u="FormData"in e,c="ArrayBuffer"in e;if(c)var d=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],l=ArrayBuffer.isView||function(t){return t&&d.indexOf(Object.prototype.toString.call(t))>-1};function h(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t)||""===t)throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function f(t){return"string"!=typeof t&&(t=String(t)),t}function p(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return s&&(e[Symbol.iterator]=function(){return e}),e}function v(t){this.map={},t instanceof v?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function y(t){if(t.bodyUsed)return n.reject(new TypeError("Already read"));t.bodyUsed=!0}function w(t){return new n((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function m(t){var e=new FileReader,r=w(e);return e.readAsArrayBuffer(t),r}function g(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function b(){return this.bodyUsed=!1,this._initBody=function(t){var e;this.bodyUsed=this.bodyUsed,this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:a&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:u&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:r&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():c&&a&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=g(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):c&&(ArrayBuffer.prototype.isPrototypeOf(t)||l(t))?this._bodyArrayBuffer=g(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},a&&(this.blob=function(){var t=y(this);if(t)return t;if(this._bodyBlob)return n.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return n.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return n.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){if(this._bodyArrayBuffer){var t=y(this);return t||(ArrayBuffer.isView(this._bodyArrayBuffer)?n.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):n.resolve(this._bodyArrayBuffer))}return this.blob().then(m)}),this.text=function(){var t,e,r,o=y(this);if(o)return o;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=w(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return n.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),o=0;o<e.length;o++)r[o]=String.fromCharCode(e[o]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return n.resolve(this._bodyText)},u&&(this.formData=function(){return this.text().then(E)}),this.json=function(){return this.text().then(JSON.parse)},this}v.prototype.append=function(t,e){t=h(t),e=f(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},v.prototype.delete=function(t){delete this.map[h(t)]},v.prototype.get=function(t){return t=h(t),this.has(t)?this.map[t]:null},v.prototype.has=function(t){return this.map.hasOwnProperty(h(t))},v.prototype.set=function(t,e){this.map[h(t)]=f(e)},v.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},v.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),p(t)},v.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),p(t)},v.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),p(t)},s&&(v.prototype[Symbol.iterator]=v.prototype.entries);var C=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function T(t,e){if(!(this instanceof T))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r,o,n=(e=e||{}).body;if(t instanceof T){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new v(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new v(e.headers)),this.method=(r=e.method||this.method||"GET",o=r.toUpperCase(),C.indexOf(o)>-1?o:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(n),!("GET"!==this.method&&"HEAD"!==this.method||"no-store"!==e.cache&&"no-cache"!==e.cache)){var i=/([?&])_=[^&]*/;if(i.test(this.url))this.url=this.url.replace(i,"$1_="+(new Date).getTime());else{this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}}function E(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),o=r.shift().replace(/\+/g," "),n=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(o),decodeURIComponent(n))}})),e}function x(t,e){if(!(this instanceof x))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"",this.headers=new v(e.headers),this.url=e.url||"",this._initBody(t)}T.prototype.clone=function(){return new T(this,{body:this._bodyInit})},b.call(T.prototype),b.call(x.prototype),x.prototype.clone=function(){return new x(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new v(this.headers),url:this.url})},x.error=function(){var t=new x(null,{status:0,statusText:""});return t.type="error",t};var _=[301,302,303,307,308];x.redirect=function(t,e){if(-1===_.indexOf(e))throw new RangeError("Invalid status code");return new x(null,{status:e,headers:{location:t}})},t.DOMException=e.DOMException;try{new t.DOMException}catch(e){t.DOMException=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function j(r,o){return new n((function(n,s){var u=new T(r,o);if(u.signal&&u.signal.aborted)return s(new t.DOMException("Aborted","AbortError"));var d=new i;function l(){d.abort()}d.onload=function(){var t,e,r={status:d.status,statusText:d.statusText,headers:(t=d.getAllResponseHeaders()||"",e=new v,t.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(t){return 0===t.indexOf("\n")?t.substr(1,t.length):t})).forEach((function(t){var r=t.split(":"),o=r.shift().trim();if(o){var n=r.join(":").trim();e.append(o,n)}})),e)};r.url="responseURL"in d?d.responseURL:r.headers.get("X-Request-URL");var o="response"in d?d.response:d.responseText;setTimeout((function(){n(new x(o,r))}),0)},d.onerror=function(){setTimeout((function(){s(new TypeError("Network request failed"))}),0)},d.ontimeout=function(){setTimeout((function(){s(new TypeError("Network request failed"))}),0)},d.onabort=function(){setTimeout((function(){s(new t.DOMException("Aborted","AbortError"))}),0)},d.open(u.method,function(t){try{return""===t&&e.location.href?e.location.href:t}catch(e){return t}}(u.url),!0),"include"===u.credentials?d.withCredentials=!0:"omit"===u.credentials&&(d.withCredentials=!1),"responseType"in d&&(a?d.responseType="blob":c&&u.headers.get("Content-Type")&&-1!==u.headers.get("Content-Type").indexOf("application/octet-stream")&&(d.responseType="arraybuffer")),!o||"object"!=typeof o.headers||o.headers instanceof v?u.headers.forEach((function(t,e){d.setRequestHeader(e,t)})):Object.getOwnPropertyNames(o.headers).forEach((function(t){d.setRequestHeader(t,f(o.headers[t]))})),u.signal&&(u.signal.addEventListener("abort",l),d.onreadystatechange=function(){4===d.readyState&&u.signal.removeEventListener("abort",l)}),d.send(void 0===u._bodyInit?null:u._bodyInit)}))}j.polyfill=!0,e.fetch||(e.fetch=j,e.Headers=v,e.Request=T,e.Response=x),t.Headers=v,t.Request=T,t.Response=x,t.fetch=j,Object.defineProperty(t,"__esModule",{value:!0})})),{fetch:o.fetch,Headers:o.Headers,Request:o.Request,Response:o.Response,DOMException:o.DOMException}}()}"function"==typeof define&&define.amd?define((function(){return o})):"object"==typeof r?e.exports=o:t.fetchPonyfill=o}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:void 0!==t?t:this)}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],12:[function(t,e,r){var o=1e3,n=60*o,i=60*n,s=24*i,a=7*s,u=365.25*s;function c(t,e,r,o){var n=e>=1.5*r;return Math.round(t/r)+" "+o+(n?"s":"")}e.exports=function(t,e){e=e||{};var r=typeof t;if("string"===r&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);if(!e)return;var r=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return r*u;case"weeks":case"week":case"w":return r*a;case"days":case"day":case"d":return r*s;case"hours":case"hour":case"hrs":case"hr":case"h":return r*i;case"minutes":case"minute":case"mins":case"min":case"m":return r*n;case"seconds":case"second":case"secs":case"sec":case"s":return r*o;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}(t);if("number"===r&&isFinite(t))return e.long?function(t){var e=Math.abs(t);if(e>=s)return c(t,e,s,"day");if(e>=i)return c(t,e,i,"hour");if(e>=n)return c(t,e,n,"minute");if(e>=o)return c(t,e,o,"second");return t+" ms"}(t):function(t){var e=Math.abs(t);if(e>=s)return Math.round(t/s)+"d";if(e>=i)return Math.round(t/i)+"h";if(e>=n)return Math.round(t/n)+"m";if(e>=o)return Math.round(t/o)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},{}],13:[function(t,e,r){r.endianness=function(){return"LE"},r.hostname=function(){return"undefined"!=typeof location?location.hostname:""},r.loadavg=function(){return[]},r.uptime=function(){return 0},r.freemem=function(){return Number.MAX_VALUE},r.totalmem=function(){return Number.MAX_VALUE},r.cpus=function(){return[]},r.type=function(){return"Browser"},r.release=function(){return"undefined"!=typeof navigator?navigator.appVersion:""},r.networkInterfaces=r.getNetworkInterfaces=function(){return{}},r.arch=function(){return"javascript"},r.platform=function(){return"browser"},r.tmpdir=r.tmpDir=function(){return"/tmp"},r.EOL="\n",r.homedir=function(){return"/"}},{}],14:[function(t,e,r){var o,n,i=e.exports={};function s(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function u(t){if(o===setTimeout)return setTimeout(t,0);if((o===s||!o)&&setTimeout)return o=setTimeout,setTimeout(t,0);try{return o(t,0)}catch(e){try{return o.call(null,t,0)}catch(e){return o.call(this,t,0)}}}!function(){try{o="function"==typeof setTimeout?setTimeout:s}catch(t){o=s}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(t){n=a}}();var c,d=[],l=!1,h=-1;function f(){l&&c&&(l=!1,c.length?d=c.concat(d):h=-1,d.length&&p())}function p(){if(!l){var t=u(f);l=!0;for(var e=d.length;e;){for(c=d,d=[];++h<e;)c&&c[h].run();h=-1,e=d.length}c=null,l=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t)}}function v(t,e){this.fun=t,this.array=e}function y(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];d.push(new v(t,e)),1!==d.length||l||u(p)},v.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=y,i.addListener=y,i.once=y,i.off=y,i.removeListener=y,i.removeAllListeners=y,i.emit=y,i.prependListener=y,i.prependOnceListener=y,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],15:[function(t,e,r){var o;if("object"==typeof globalThis)o=globalThis;else try{o=t("es5-ext/global")}catch(t){}finally{if(o||"undefined"==typeof window||(o=window),!o)throw new Error("Could not determine global this")}var n=o.WebSocket||o.MozWebSocket,i=t("./version");function s(t,e){return e?new n(t,e):new n(t)}n&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach((function(t){Object.defineProperty(s,t,{get:function(){return n[t]}})})),e.exports={w3cwebsocket:n?s:null,version:i}},{"./version":16,"es5-ext/global":10}],16:[function(t,e,r){e.exports=t("../package.json").version},{"../package.json":17}],17:[function(t,e,r){e.exports={name:"websocket",description:"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",keywords:["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],author:"Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",contributors:["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],version:"1.0.34",repository:{type:"git",url:"https://github.com/theturtle32/WebSocket-Node.git"},homepage:"https://github.com/theturtle32/WebSocket-Node",engines:{node:">=4.0.0"},dependencies:{bufferutil:"^4.0.1",debug:"^2.2.0","es5-ext":"^0.10.50","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2",yaeti:"^0.0.6"},devDependencies:{"buffer-equal":"^1.0.0",gulp:"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1",jshint:"^2.0.0",tape:"^4.9.1"},config:{verbose:!1},scripts:{test:"tape test/unit/*.js",gulp:"gulp"},main:"index",directories:{lib:"./lib"},browser:"lib/browser.js",license:"Apache-2.0"}},{}],"xumm-sdk":[function(t,e,r){(function(e){(function(){"use strict";var o=this&&this.__awaiter||function(t,e,r,o){return new(r||(r=Promise))((function(n,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((o=o.apply(t,e||[])).next())}))};Object.defineProperty(r,"__esModule",{value:!0}),r.XummSdkJwt=r.XummSdk=void 0;const n=t("debug"),i=t("./Meta"),s=t("./Storage"),a=t("./Payload"),u=t("./xApp"),c=t("./Push"),d=t("./JwtUserdata"),l=n.debug("xumm-sdk");class h{constructor(t,e){return l("Constructed"),this.Meta=new i.Meta(t||this.getEnv("XUMM_APIKEY"),e||this.getEnv("XUMM_APISECRET")),this.storage=new s.Storage(this.Meta),this.payload=new a.Payload(this.Meta),this.jwtUserdata=new d.JwtUserdata(this.Meta),this.Push=new c.Push(this.Meta),this.xApp=new u.xApp(this.Meta),this.Meta._inject(this),this}getEnv(t){let r="";try{r="undefined"!=typeof Deno&&Deno.env.get(t)||"",r=(null==e?void 0:e.env[t])||""}catch(t){}return r}ping(){return this.Meta.ping()}getCuratedAssets(){return this.Meta.getCuratedAssets()}getRates(t){return this.Meta.getRates(t)}getKycStatus(t){return this.Meta.getKycStatus(t)}getTransaction(t){return this.Meta.getTransaction(t)}verifyUserTokens(t){return this.Meta.verifyUserTokens(t)}verifyUserToken(t){return o(this,void 0,void 0,(function*(){const e=yield this.Meta.verifyUserTokens([t]);return Array.isArray(e)&&1===e.length?e[0]:null}))}setEndpoint(t){return this.Meta.setEndpoint(t)}caught(t){throw t}}r.XummSdk=h;r.XummSdkJwt=class extends h{constructor(t,e,r){var o,n,i,s,a,u,c,d;let h=String(e||"").trim().toLowerCase();const f=36!==t.length;if(!f&&void 0===e&&"undefined"!=typeof window&&void 0!==window.URLSearchParams){const t=new window.URLSearchParams((null===(o=null===window||void 0===window?void 0:window.location)||void 0===o?void 0:o.search)||"");for(const e of t.entries())"xAppToken"===e[0]&&(h=e[1].toLowerCase().trim());if(""===h&&!(null==r?void 0:r.store)&&!(null==r?void 0:r.noAutoRetrieve)&&"string"==typeof(null===(n=null===window||void 0===window?void 0:window.localStorage)||void 0===n?void 0:n.XummSdkJwt))try{const t=null===(s=null===(i=null===window||void 0===window?void 0:window.localStorage)||void 0===i?void 0:i.XummSdkJwt)||void 0===s?void 0:s.split(":"),e=JSON.parse(null===(a=null==t?void 0:t.slice(1))||void 0===a?void 0:a.join(":"));if(null==e?void 0:e.jwt){const r=JSON.parse(atob(null===(u=e.jwt.split("."))||void 0===u?void 0:u[1]));if(null==r?void 0:r.exp){const e=(null==r?void 0:r.exp)-Math.floor((new Date).getTime()/1e3);console.log("Restoring OTT "+(null==t?void 0:t[0])),e>3600?h=null==t?void 0:t[0]:console.log("Skip restore: not valid for one more hour")}}}catch(t){console.log("JWT Restore Error",t)}}super(t,f||""===h?"RAWJWT:"+t:"xApp:OneTimeToken:"+h),this.resolve=t=>{l("OTT data resolved",t)},this.reject=t=>{l("OTT data rejected",t.message)},this.ottResolved=f?Promise.resolve():new Promise(((t,e)=>{this.resolve=t,this.reject=e})),(null==r?void 0:r.fatalHandler)&&(this.fatalHandler=r.fatalHandler),this.store={get(t){var e;if(l("[JwtStore] » Builtin JWT store GET"),"undefined"!=typeof window&&void 0!==window.localStorage&&"string"==typeof window.localStorage.XummSdkJwt){const r=window.localStorage.XummSdkJwt.split(":");if(r[0]===t){l("Restoring OTT from localStorage:",t);try{return JSON.parse(r.slice(1).join(":"))}catch(t){l("Error restoring OTT Data (JWT) from localStorage",null===(e=t)||void 0===e?void 0:e.message)}}}},set(t,e){l("[JwtStore] » Builtin JWT store SET",t),"undefined"!=typeof window&&"undefined"!=typeof localStorage&&(window.localStorage.XummSdkJwt=t+":"+JSON.stringify(e))}},(null===(c=null==r?void 0:r.store)||void 0===c?void 0:c.get)&&(this.store.get=r.store.get),(null===(d=null==r?void 0:r.store)||void 0===d?void 0:d.set)&&(this.store.set=r.store.set),f?(this.reject(new Error("Not in OTT flow: in raw JWT (OAuth2-like) flow")),l("Using JWT (Raw, OAuth2) flow")):l("Using JWT (xApp) flow")}_jwtStore(t,e){if(t&&(null==t?void 0:t.constructor)===i.Meta)return{get:t=>{var e;return l("[JwtStore] Proxy GET"),null===(e=this.store)||void 0===e?void 0:e.get(t)},set:(t,r)=>{var o;return l("[JwtStore] Proxy SET"),this.resolve(r.ott),e(r.jwt),this.jwt=r.jwt,null===(o=this.store)||void 0===o?void 0:o.set(t,r)}};throw new Error("Invalid _jwtStore invoker")}getOttData(){return o(this,void 0,void 0,(function*(){const t=yield this.ottResolved;if(t)return t;throw new Error("Called getOttData on a non OTT-JWT flow")}))}getJwt(){return o(this,void 0,void 0,(function*(){return yield this.ottResolved,this.jwt}))}caught(t){this.reject(t)}}}).call(this)}).call(this,t("_process"))},{"./JwtUserdata":1,"./Meta":2,"./Payload":3,"./Push":4,"./Storage":5,"./xApp":7,_process:14,debug:8}]},{},[]);