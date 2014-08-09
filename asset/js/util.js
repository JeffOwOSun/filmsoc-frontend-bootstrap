/**
 * util.js
 * contains all the global helper functions
 */

var dirty_listening = []


/**
 * Deep copy an object.
 * @param {Object} obj The object to copy.
 * @return {Object} A new object copied.
 */
function deepCopy(src) {
  if(src == null || typeof(src) !== 'object'){
    return src;
  }

  //Honor native/custom clone methods
  if(typeof src.clone == 'function'){
    return src.clone(true);
  }

  //Special cases:
  //Date
  if (src instanceof Date){
    return new Date(src.getTime());
  }
  //RegExp
  if(src instanceof RegExp){
    return new RegExp(src);
  }
  //DOM Elements
  if(src.nodeType && typeof src.cloneNode == 'function'){
    return src.cloneNode(true);
  }
  //Array, Believe in shallow copy
  if (src instanceof Array){
    return src.slice(0);
  }

  //If we've reached here, we have a regular object, array, or function

  //make sure the returned object has the same prototype as the original
  var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src): src.__proto__);
  if (!proto) {
    proto = src.constructor.prototype; //this line would probably only be reached by very old browsers 
  }
  var ret = Object.create(proto);

  for(var key in src){
    //Note: this does NOT preserve ES5 property attributes like 'writable', 'enumerable', etc.
    //That could be achieved by using Object.getOwnPropertyNames and Object.defineProperty
    ret[key] = deepCopy(src[key]);
  }
  return ret;
}
