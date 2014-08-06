/**
 * @fileoverview Provide router utility.
 * routerManager is the center of the logic.
 * ViewModels register themselves at this 
 */

var routerManager = (function() {
  'use strict';

  /**
   * @function getHash
   * Get the pure hash of current page
   * @return {string} Current hash without leading #.
   */
  function getHash() {
    var hash = location.hash.substr(1),
        qs = parseLocationParams(window.location);
    if (qs["_escaped_fragment_"]) {
      return qs["_escaped_fragment_"];
    }
    if (hash.charAt(0) == '!') {
      hash = hash.substr(1);
    }
    return hash;
  }

  /**
   * @function parseQueryParams
   * Parses query parameters.
   * @param {string} query The query part of a URL.
   * @return {object} Dictionary containing name value pairs for URL
   */
  function parseQueryParams(query) {
    var params = {};
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      //storing key-value pairs of params into params object. Here it basically functions as a dictionary
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

  /**
   * @function parseHash()
   * Parse the hash and call the registered handler.
   * Call 404 handler if no registered handler found.
   * The Core of initializing connection
   */
  function parseHash() {
    var hashString = getHash(), query;
    //find the start of query string
    var q_pos = hashString.indexOf('?');
    //if there's no query string, null the query object
    if (q_pos === -1) {
      query = {};
    }
    else {
      //slice off the query string, and parse it into a query dictionary
      query = hashString.slice(q_pos + 1, hashString.length);
      query = parseQueryParams(query);
      //Get rid of the query part in the hashString
      hashString = hashString.slice(0, q_pos);
    }
    if (hashString.length === 0) {
      //Call default
      //Replace to default route
      this.pushState(this.defaultRouter.url, true);
      return;
    }
    //append a forward slash to the hashString if there isn't one
    if (hashString[hashString.length - 1] !== '/') {
      hashString = hashString + '/';
    }
    for (var i = 0; i < this.routers.length; i++) {
      var router = this.routers[i];
      //If hashString matches the RegEx specified by router.re, then...
      if (router.re.test(hashString)) {
        var args;
        //Passing a function as the second parameter for the replace() makes it execute the function
        //for every matching substring.
        hashString.replace(router.re, function() {
          //Calling indexOf as the arguments object, supplying an argument of 0
          var end = Array.prototype.indexOf.call(arguments, 0);
          args = Array.prototype.slice.call(arguments, 1, end);
          for (var i = 0; i < args.length; i++) {
            args[i] = decodeComponent(args[i]);
          }
        });
        args.push(query);
        router.callback.apply(router, args);
        return;
      }
    }
    //None found
    cr.notFoundHandler(hashString);
  }

  /**
   * @function globalInitialization()
   * Makes initializations which must hook at the document level.
   */
  function globalInitialization() {
    window.addEventListener('authload', (function() {
      window.onpopstate = parseHash.bind(this);
      this.parseHash();
    }).bind(this));

    this.routers = [];
    this.notFoundHandler = function() {};
    this.defaultRouter = {
      url: '',
      callback: function() {},
      re: new RegExp(''),
    };
  }

  /**
   * @function encodeComponent(url)
   * encode part of component to push between slashes.
   * @param {string} url The url to be encoded.
   * @return {string} The encoded component.
   */
  function encodeComponent(url) {
    //replace / to !1, ! to !0
    return url.replace('!', '!0').replace('/', '!1');
  }

  /**
   * @function decodeComponent(component)
   * decode part of component between slashes.
   * @param {string} componnet The component to be encoded.
   * @return {string} The decoded component.
   */
  function decodeComponent(componnet) {
    //replace !1 to /, !0 to !
    return componnet.replace('!1', '/').replace('!0', '!')
  }

  /**
   * @function pushState(url, replace, custom)
   * Push a state into history.
   * @param {string} url The url to be pushed.
   * @param {bool} replace If true, allow no history events to be created.
   * @param {bool} custom If true, do not call router handler.
   */
  function pushState(url, replace, custom) {
    if (url === getHash()) {
      //Maybe click twice. Do nothing
      return;
    }
    var historyFunction = !replace ? window.history.pushState :
                                     window.history.replaceState,
        prefix = this.prefix == 0 ? '#' : '#!';
    historyFunction.call(window.history, {}, '', prefix + url);
    if (!custom) {
      this.parseHash();
    }
  }

  /**
   * @function registerRule(pattern, isDefault, callback)
   * Register a router rule.
   * @param {RegExp} pattern The pattern to be pushed.
   * @param {bool} isDefault If true, register handler as defaultRouter.
   * @param {function} callback The function to call when router accesses.
   */
  function registerRule(pattern, isDefault, callback) {
    assert(pattern instanceof RegExp, "Regular Expression wanted");
    var router = {
      url: pattern.source.replace('\\/', '/'),
      callback: callback, 
      re: new RegExp("^" + pattern.source + "$"),
    };
    this.routers.push(router);
    if (isDefault === true) {
      this.defaultRouter = router;
    }
  }

  /**
   * Subscribe to ga.js
   */
  function markTracker() {
    if (window.ga) {
      ga('send', 'pageview', {
        'page': cr.settings['url_base'] + getHash()
      });
    }
  }

  return {
    globalInitialization: globalInitialization,
    encodeComponent: encodeComponent,
    decodeComponent: decodeComponent,
    pushState: pushState,
    registerRule: registerRule,
    parseHash: parseHash,
    markTracker: markTracker,
    prefix: 0,
  };
})();

routerManager.globalInitialization();
