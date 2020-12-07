!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(n){var t=this.constructor;return this.then(function(e){return t.resolve(n()).then(function(){return e})},function(e){return t.resolve(n()).then(function(){return t.reject(e)})})}var n=setTimeout;function o(){}function f(e){if(!(this instanceof f))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],l(e,this)}function r(o,r){for(;3===o._state;)o=o._value;0!==o._state?(o._handled=!0,f._immediateFn(function(){var e=1===o._state?r.onFulfilled:r.onRejected;if(null!==e){var n;try{n=e(o._value)}catch(t){return void u(r.promise,t)}i(r.promise,n)}else(1===o._state?i:u)(r.promise,o._value)})):o._deferreds.push(r)}function i(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof f)return e._state=3,e._value=n,void c(e);if("function"==typeof t)return void l((o=t,r=n,function(){o.apply(r,arguments)}),e)}e._state=1,e._value=n,c(e)}catch(i){u(e,i)}var o,r}function u(e,n){e._state=2,e._value=n,c(e)}function c(e){2===e._state&&0===e._deferreds.length&&f._immediateFn(function(){e._handled||f._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)r(e,e._deferreds[n]);e._deferreds=null}function a(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function l(e,n){var t=!1;try{e(function(e){t||(t=!0,i(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}f.prototype["catch"]=function(e){return this.then(null,e)},f.prototype.then=function(e,n){var t=new this.constructor(o);return r(this,new a(e,n,t)),t},f.prototype["finally"]=e,f.all=function(n){return new f(function(r,i){if(!n||"undefined"==typeof n.length)throw new TypeError("Promise.all accepts an array");var f=Array.prototype.slice.call(n);if(0===f.length)return r([]);var u=f.length;function c(n,e){try{if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void t.call(e,function(e){c(n,e)},i)}f[n]=e,0==--u&&r(f)}catch(o){i(o)}}for(var e=0;e<f.length;e++)c(e,f[e])})},f.resolve=function(n){return n&&"object"==typeof n&&n.constructor===f?n:new f(function(e){e(n)})},f.reject=function(t){return new f(function(e,n){n(t)})},f.race=function(r){return new f(function(e,n){for(var t=0,o=r.length;t<o;t++)r[t].then(e,n)})},f._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){n(e,0)},f._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var t=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in t?t.Promise.prototype["finally"]||(t.Promise.prototype["finally"]=e):t.Promise=f});

// the below is an adapted version of https://github.com/davidchambers/Base64.js/ for cocos-2d-x
// the only modification is to explictly assign the polyfill to the window object.
var object = window;

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
    this.message = message;
}
InvalidCharacterError.prototype = new Error;
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

// encoder
// [https://gist.github.com/999166] by [https://github.com/nignag]
object.btoa || (
object.btoa = function (input) {
    var str = String(input);
    for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars, output = '';
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
    charCode = str.charCodeAt(idx += 3/4);
    if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
    }
    return output;
});

// decoder
// [https://gist.github.com/1020396] by [https://github.com/atk]
object.atob || (
object.atob = function (input) {
    var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
    if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
    }
    return output;
});
