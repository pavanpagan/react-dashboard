module.exports =

        __NEXT_REGISTER_PAGE('/', function() {
          var comp = 
      webpackJsonp([3],{

/***/ "./node_modules/axios/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var settle = __webpack_require__("./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__("./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__("./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__("./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__("./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__("./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("development" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__("./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var bind = __webpack_require__("./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__("./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__("./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__("./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__("./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__("./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__("./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__("./node_modules/axios/lib/core/dispatchRequest.js");
var isAbsoluteURL = __webpack_require__("./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__("./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__("./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__("./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__("./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__("./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__("./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__("./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/d3-array/src/array.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return slice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return map; });
var array = Array.prototype;

var slice = array.slice;
var map = array.map;


/***/ }),

/***/ "./node_modules/d3-array/src/ascending.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
});


/***/ }),

/***/ "./node_modules/d3-array/src/bisect.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export bisectRight */
/* unused harmony export bisectLeft */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ascending__ = __webpack_require__("./node_modules/d3-array/src/ascending.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bisector__ = __webpack_require__("./node_modules/d3-array/src/bisector.js");



var ascendingBisect = Object(__WEBPACK_IMPORTED_MODULE_1__bisector__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__ascending__["a" /* default */]);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;
/* harmony default export */ __webpack_exports__["a"] = (bisectRight);


/***/ }),

/***/ "./node_modules/d3-array/src/bisector.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ascending__ = __webpack_require__("./node_modules/d3-array/src/ascending.js");


/* harmony default export */ __webpack_exports__["a"] = (function(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
});

function ascendingComparator(f) {
  return function(d, x) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__ascending__["a" /* default */])(f(d), x);
  };
}


/***/ }),

/***/ "./node_modules/d3-array/src/constant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return function() {
    return x;
  };
});


/***/ }),

/***/ "./node_modules/d3-array/src/cross.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pairs__ = __webpack_require__("./node_modules/d3-array/src/pairs.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;

  if (reduce == null) reduce = __WEBPACK_IMPORTED_MODULE_0__pairs__["a" /* pair */];

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
});


/***/ }),

/***/ "./node_modules/d3-array/src/descending.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
});


/***/ }),

/***/ "./node_modules/d3-array/src/deviation.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__variance__ = __webpack_require__("./node_modules/d3-array/src/variance.js");


/* harmony default export */ __webpack_exports__["a"] = (function(array, f) {
  var v = Object(__WEBPACK_IMPORTED_MODULE_0__variance__["a" /* default */])(array, f);
  return v ? Math.sqrt(v) : v;
});


/***/ }),

/***/ "./node_modules/d3-array/src/extent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
});


/***/ }),

/***/ "./node_modules/d3-array/src/histogram.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__array__ = __webpack_require__("./node_modules/d3-array/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bisect__ = __webpack_require__("./node_modules/d3-array/src/bisect.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constant__ = __webpack_require__("./node_modules/d3-array/src/constant.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__extent__ = __webpack_require__("./node_modules/d3-array/src/extent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__identity__ = __webpack_require__("./node_modules/d3-array/src/identity.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__range__ = __webpack_require__("./node_modules/d3-array/src/range.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ticks__ = __webpack_require__("./node_modules/d3-array/src/ticks.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__threshold_sturges__ = __webpack_require__("./node_modules/d3-array/src/threshold/sturges.js");









/* unused harmony default export */ var _unused_webpack_default_export = (function() {
  var value = __WEBPACK_IMPORTED_MODULE_4__identity__["a" /* default */],
      domain = __WEBPACK_IMPORTED_MODULE_3__extent__["a" /* default */],
      threshold = __WEBPACK_IMPORTED_MODULE_7__threshold_sturges__["a" /* default */];

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = Object(__WEBPACK_IMPORTED_MODULE_6__ticks__["c" /* tickStep */])(x0, x1, tz);
      tz = Object(__WEBPACK_IMPORTED_MODULE_5__range__["a" /* default */])(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[Object(__WEBPACK_IMPORTED_MODULE_1__bisect__["a" /* default */])(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : Object(__WEBPACK_IMPORTED_MODULE_2__constant__["a" /* default */])(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : Object(__WEBPACK_IMPORTED_MODULE_2__constant__["a" /* default */])([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? Object(__WEBPACK_IMPORTED_MODULE_2__constant__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__array__["b" /* slice */].call(_)) : Object(__WEBPACK_IMPORTED_MODULE_2__constant__["a" /* default */])(_), histogram) : threshold;
  };

  return histogram;
});


/***/ }),

/***/ "./node_modules/d3-array/src/identity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return x;
});


/***/ }),

/***/ "./node_modules/d3-array/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bisect__ = __webpack_require__("./node_modules/d3-array/src/bisect.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__bisect__["a"]; });
/* unused harmony reexport bisectRight */
/* unused harmony reexport bisectLeft */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ascending__ = __webpack_require__("./node_modules/d3-array/src/ascending.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__ascending__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bisector__ = __webpack_require__("./node_modules/d3-array/src/bisector.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__bisector__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cross__ = __webpack_require__("./node_modules/d3-array/src/cross.js");
/* unused harmony reexport cross */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__descending__ = __webpack_require__("./node_modules/d3-array/src/descending.js");
/* unused harmony reexport descending */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__deviation__ = __webpack_require__("./node_modules/d3-array/src/deviation.js");
/* unused harmony reexport deviation */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__extent__ = __webpack_require__("./node_modules/d3-array/src/extent.js");
/* unused harmony reexport extent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__histogram__ = __webpack_require__("./node_modules/d3-array/src/histogram.js");
/* unused harmony reexport histogram */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__threshold_freedmanDiaconis__ = __webpack_require__("./node_modules/d3-array/src/threshold/freedmanDiaconis.js");
/* unused harmony reexport thresholdFreedmanDiaconis */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__threshold_scott__ = __webpack_require__("./node_modules/d3-array/src/threshold/scott.js");
/* unused harmony reexport thresholdScott */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__threshold_sturges__ = __webpack_require__("./node_modules/d3-array/src/threshold/sturges.js");
/* unused harmony reexport thresholdSturges */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__max__ = __webpack_require__("./node_modules/d3-array/src/max.js");
/* unused harmony reexport max */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__mean__ = __webpack_require__("./node_modules/d3-array/src/mean.js");
/* unused harmony reexport mean */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__median__ = __webpack_require__("./node_modules/d3-array/src/median.js");
/* unused harmony reexport median */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__merge__ = __webpack_require__("./node_modules/d3-array/src/merge.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_14__merge__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__min__ = __webpack_require__("./node_modules/d3-array/src/min.js");
/* unused harmony reexport min */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pairs__ = __webpack_require__("./node_modules/d3-array/src/pairs.js");
/* unused harmony reexport pairs */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__permute__ = __webpack_require__("./node_modules/d3-array/src/permute.js");
/* unused harmony reexport permute */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__quantile__ = __webpack_require__("./node_modules/d3-array/src/quantile.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_18__quantile__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__range__ = __webpack_require__("./node_modules/d3-array/src/range.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_19__range__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__scan__ = __webpack_require__("./node_modules/d3-array/src/scan.js");
/* unused harmony reexport scan */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__shuffle__ = __webpack_require__("./node_modules/d3-array/src/shuffle.js");
/* unused harmony reexport shuffle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__sum__ = __webpack_require__("./node_modules/d3-array/src/sum.js");
/* unused harmony reexport sum */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ticks__ = __webpack_require__("./node_modules/d3-array/src/ticks.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_23__ticks__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_23__ticks__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_23__ticks__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__transpose__ = __webpack_require__("./node_modules/d3-array/src/transpose.js");
/* unused harmony reexport transpose */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__variance__ = __webpack_require__("./node_modules/d3-array/src/variance.js");
/* unused harmony reexport variance */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__zip__ = __webpack_require__("./node_modules/d3-array/src/zip.js");
/* unused harmony reexport zip */





























/***/ }),

/***/ "./node_modules/d3-array/src/max.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
});


/***/ }),

/***/ "./node_modules/d3-array/src/mean.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__number__ = __webpack_require__("./node_modules/d3-array/src/number.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(values[i]))) sum += value;
      else --m;
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(valueof(values[i], i, values)))) sum += value;
      else --m;
    }
  }

  if (m) return sum / m;
});


/***/ }),

/***/ "./node_modules/d3-array/src/median.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ascending__ = __webpack_require__("./node_modules/d3-array/src/ascending.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__number__ = __webpack_require__("./node_modules/d3-array/src/number.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quantile__ = __webpack_require__("./node_modules/d3-array/src/quantile.js");




/* unused harmony default export */ var _unused_webpack_default_export = (function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = Object(__WEBPACK_IMPORTED_MODULE_1__number__["a" /* default */])(values[i]))) {
        numbers.push(value);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = Object(__WEBPACK_IMPORTED_MODULE_1__number__["a" /* default */])(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return Object(__WEBPACK_IMPORTED_MODULE_2__quantile__["a" /* default */])(numbers.sort(__WEBPACK_IMPORTED_MODULE_0__ascending__["a" /* default */]), 0.5);
});


/***/ }),

/***/ "./node_modules/d3-array/src/merge.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
});


/***/ }),

/***/ "./node_modules/d3-array/src/min.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
});


/***/ }),

/***/ "./node_modules/d3-array/src/number.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return x === null ? NaN : +x;
});


/***/ }),

/***/ "./node_modules/d3-array/src/pairs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pair;
/* unused harmony default export */ var _unused_webpack_default_export = (function(array, f) {
  if (f == null) f = pair;
  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
  while (i < n) pairs[i] = f(p, p = array[++i]);
  return pairs;
});

function pair(a, b) {
  return [a, b];
}


/***/ }),

/***/ "./node_modules/d3-array/src/permute.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
});


/***/ }),

/***/ "./node_modules/d3-array/src/quantile.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__number__ = __webpack_require__("./node_modules/d3-array/src/number.js");


/* harmony default export */ __webpack_exports__["a"] = (function(values, p, valueof) {
  if (valueof == null) valueof = __WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */];
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
});


/***/ }),

/***/ "./node_modules/d3-array/src/range.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
});


/***/ }),

/***/ "./node_modules/d3-array/src/scan.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ascending__ = __webpack_require__("./node_modules/d3-array/src/ascending.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];

  if (compare == null) compare = __WEBPACK_IMPORTED_MODULE_0__ascending__["a" /* default */];

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
});


/***/ }),

/***/ "./node_modules/d3-array/src/shuffle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
});


/***/ }),

/***/ "./node_modules/d3-array/src/sum.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
});


/***/ }),

/***/ "./node_modules/d3-array/src/threshold/freedmanDiaconis.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__array__ = __webpack_require__("./node_modules/d3-array/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ascending__ = __webpack_require__("./node_modules/d3-array/src/ascending.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__number__ = __webpack_require__("./node_modules/d3-array/src/number.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__quantile__ = __webpack_require__("./node_modules/d3-array/src/quantile.js");





/* unused harmony default export */ var _unused_webpack_default_export = (function(values, min, max) {
  values = __WEBPACK_IMPORTED_MODULE_0__array__["a" /* map */].call(values, __WEBPACK_IMPORTED_MODULE_2__number__["a" /* default */]).sort(__WEBPACK_IMPORTED_MODULE_1__ascending__["a" /* default */]);
  return Math.ceil((max - min) / (2 * (Object(__WEBPACK_IMPORTED_MODULE_3__quantile__["a" /* default */])(values, 0.75) - Object(__WEBPACK_IMPORTED_MODULE_3__quantile__["a" /* default */])(values, 0.25)) * Math.pow(values.length, -1 / 3)));
});


/***/ }),

/***/ "./node_modules/d3-array/src/threshold/scott.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__deviation__ = __webpack_require__("./node_modules/d3-array/src/deviation.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function(values, min, max) {
  return Math.ceil((max - min) / (3.5 * Object(__WEBPACK_IMPORTED_MODULE_0__deviation__["a" /* default */])(values) * Math.pow(values.length, -1 / 3)));
});


/***/ }),

/***/ "./node_modules/d3-array/src/threshold/sturges.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
});


/***/ }),

/***/ "./node_modules/d3-array/src/ticks.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = tickIncrement;
/* harmony export (immutable) */ __webpack_exports__["c"] = tickStep;
var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

/* harmony default export */ __webpack_exports__["a"] = (function(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
});

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}


/***/ }),

/***/ "./node_modules/d3-array/src/transpose.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__min__ = __webpack_require__("./node_modules/d3-array/src/min.js");


/* harmony default export */ __webpack_exports__["a"] = (function(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = Object(__WEBPACK_IMPORTED_MODULE_0__min__["a" /* default */])(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
});

function length(d) {
  return d.length;
}


/***/ }),

/***/ "./node_modules/d3-array/src/variance.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__number__ = __webpack_require__("./node_modules/d3-array/src/number.js");


/* harmony default export */ __webpack_exports__["a"] = (function(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
});


/***/ }),

/***/ "./node_modules/d3-array/src/zip.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transpose__ = __webpack_require__("./node_modules/d3-array/src/transpose.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__transpose__["a" /* default */])(arguments);
});


/***/ }),

/***/ "./node_modules/d3-collection/src/entries.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(map) {
  var entries = [];
  for (var key in map) entries.push({key: key, value: map[key]});
  return entries;
});


/***/ }),

/***/ "./node_modules/d3-collection/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nest__ = __webpack_require__("./node_modules/d3-collection/src/nest.js");
/* unused harmony reexport nest */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__set__ = __webpack_require__("./node_modules/d3-collection/src/set.js");
/* unused harmony reexport set */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map__ = __webpack_require__("./node_modules/d3-collection/src/map.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__map__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__keys__ = __webpack_require__("./node_modules/d3-collection/src/keys.js");
/* unused harmony reexport keys */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__values__ = __webpack_require__("./node_modules/d3-collection/src/values.js");
/* unused harmony reexport values */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__entries__ = __webpack_require__("./node_modules/d3-collection/src/entries.js");
/* unused harmony reexport entries */








/***/ }),

/***/ "./node_modules/d3-collection/src/keys.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
});


/***/ }),

/***/ "./node_modules/d3-collection/src/map.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return prefix; });
var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

/* harmony default export */ __webpack_exports__["a"] = (map);


/***/ }),

/***/ "./node_modules/d3-collection/src/nest.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map__ = __webpack_require__("./node_modules/d3-collection/src/map.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = Object(__WEBPACK_IMPORTED_MODULE_0__map__["a" /* default */])(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array, sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();
    else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
});

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__map__["a" /* default */])();
}

function setMap(map, key, value) {
  map.set(key, value);
}


/***/ }),

/***/ "./node_modules/d3-collection/src/set.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map__ = __webpack_require__("./node_modules/d3-collection/src/map.js");


function Set() {}

var proto = __WEBPACK_IMPORTED_MODULE_0__map__["a" /* default */].prototype;

Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function(value) {
    value += "";
    this[__WEBPACK_IMPORTED_MODULE_0__map__["b" /* prefix */] + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set;

  // Copy constructor.
  if (object instanceof Set) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

/* unused harmony default export */ var _unused_webpack_default_export = (set);


/***/ }),

/***/ "./node_modules/d3-collection/src/values.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(map) {
  var values = [];
  for (var key in map) values.push(map[key]);
  return values;
});


/***/ }),

/***/ "./node_modules/d3-color/src/color.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Color;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return darker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return brighter; });
/* harmony export (immutable) */ __webpack_exports__["e"] = color;
/* harmony export (immutable) */ __webpack_exports__["h"] = rgbConvert;
/* harmony export (immutable) */ __webpack_exports__["g"] = rgb;
/* harmony export (immutable) */ __webpack_exports__["b"] = Rgb;
/* unused harmony export hslConvert */
/* harmony export (immutable) */ __webpack_exports__["f"] = hsl;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__define__ = __webpack_require__("./node_modules/d3-color/src/define.js");


function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex3 = /^#([0-9a-f]{3})$/,
    reHex6 = /^#([0-9a-f]{6})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

Object(__WEBPACK_IMPORTED_MODULE_0__define__["a" /* default */])(Color, color, {
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: function() {
    return this.rgb().hex();
  },
  toString: function() {
    return this.rgb() + "";
  }
});

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format])
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

Object(__WEBPACK_IMPORTED_MODULE_0__define__["a" /* default */])(Rgb, rgb, Object(__WEBPACK_IMPORTED_MODULE_0__define__["b" /* extend */])(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: function() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  },
  toString: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

Object(__WEBPACK_IMPORTED_MODULE_0__define__["a" /* default */])(Hsl, hsl, Object(__WEBPACK_IMPORTED_MODULE_0__define__["b" /* extend */])(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}


/***/ }),

/***/ "./node_modules/d3-color/src/cubehelix.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cubehelix;
/* unused harmony export Cubehelix */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__define__ = __webpack_require__("./node_modules/d3-color/src/define.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__("./node_modules/d3-color/src/color.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-color/src/math.js");




var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof __WEBPACK_IMPORTED_MODULE_1__color__["b" /* Rgb */])) o = Object(__WEBPACK_IMPORTED_MODULE_1__color__["h" /* rgbConvert */])(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * __WEBPACK_IMPORTED_MODULE_2__math__["b" /* rad2deg */] - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

Object(__WEBPACK_IMPORTED_MODULE_0__define__["a" /* default */])(Cubehelix, cubehelix, Object(__WEBPACK_IMPORTED_MODULE_0__define__["b" /* extend */])(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* Color */], {
  brighter: function(k) {
    k = k == null ? __WEBPACK_IMPORTED_MODULE_1__color__["c" /* brighter */] : Math.pow(__WEBPACK_IMPORTED_MODULE_1__color__["c" /* brighter */], k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? __WEBPACK_IMPORTED_MODULE_1__color__["d" /* darker */] : Math.pow(__WEBPACK_IMPORTED_MODULE_1__color__["d" /* darker */], k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * __WEBPACK_IMPORTED_MODULE_2__math__["a" /* deg2rad */],
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new __WEBPACK_IMPORTED_MODULE_1__color__["b" /* Rgb */](
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh)),
      this.opacity
    );
  }
}));


/***/ }),

/***/ "./node_modules/d3-color/src/define.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = extend;
/* harmony default export */ __webpack_exports__["a"] = (function(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
});

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}


/***/ }),

/***/ "./node_modules/d3-color/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__color__ = __webpack_require__("./node_modules/d3-color/src/color.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__color__["e"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_0__color__["g"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__color__["f"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lab__ = __webpack_require__("./node_modules/d3-color/src/lab.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_1__lab__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__lab__["b"]; });
/* unused harmony reexport lch */
/* unused harmony reexport gray */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cubehelix__ = __webpack_require__("./node_modules/d3-color/src/cubehelix.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__cubehelix__["a"]; });





/***/ }),

/***/ "./node_modules/d3-color/src/lab.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export gray */
/* harmony export (immutable) */ __webpack_exports__["a"] = lab;
/* unused harmony export Lab */
/* unused harmony export lch */
/* harmony export (immutable) */ __webpack_exports__["b"] = hcl;
/* unused harmony export Hcl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__define__ = __webpack_require__("./node_modules/d3-color/src/define.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__("./node_modules/d3-color/src/color.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-color/src/math.js");




// https://beta.observablehq.com/@mbostock/lab-and-rgb
var K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * __WEBPACK_IMPORTED_MODULE_2__math__["a" /* deg2rad */];
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof __WEBPACK_IMPORTED_MODULE_1__color__["b" /* Rgb */])) o = Object(__WEBPACK_IMPORTED_MODULE_1__color__["h" /* rgbConvert */])(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b) x = z = y; else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

Object(__WEBPACK_IMPORTED_MODULE_0__define__["a" /* default */])(Lab, lab, Object(__WEBPACK_IMPORTED_MODULE_0__define__["b" /* extend */])(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* Color */], {
  brighter: function(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new __WEBPACK_IMPORTED_MODULE_1__color__["b" /* Rgb */](
      lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
      lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * __WEBPACK_IMPORTED_MODULE_2__math__["b" /* rad2deg */];
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function lch(l, c, h, opacity) {
  return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

Object(__WEBPACK_IMPORTED_MODULE_0__define__["a" /* default */])(Hcl, hcl, Object(__WEBPACK_IMPORTED_MODULE_0__define__["b" /* extend */])(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* Color */], {
  brighter: function(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker: function(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb: function() {
    return labConvert(this).rgb();
  }
}));


/***/ }),

/***/ "./node_modules/d3-color/src/math.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return deg2rad; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return rad2deg; });
var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;


/***/ }),

/***/ "./node_modules/d3-format/src/defaultLocale.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return format; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return formatPrefix; });
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locale__ = __webpack_require__("./node_modules/d3-format/src/locale.js");


var locale;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = Object(__WEBPACK_IMPORTED_MODULE_0__locale__["a" /* default */])(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}


/***/ }),

/***/ "./node_modules/d3-format/src/exponent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatDecimal__ = __webpack_require__("./node_modules/d3-format/src/formatDecimal.js");


/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return x = Object(__WEBPACK_IMPORTED_MODULE_0__formatDecimal__["a" /* default */])(Math.abs(x)), x ? x[1] : NaN;
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatDecimal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
/* harmony default export */ __webpack_exports__["a"] = (function(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatGroup.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatNumerals.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatPrefixAuto.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return prefixExponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatDecimal__ = __webpack_require__("./node_modules/d3-format/src/formatDecimal.js");


var prefixExponent;

/* harmony default export */ __webpack_exports__["a"] = (function(x, p) {
  var d = Object(__WEBPACK_IMPORTED_MODULE_0__formatDecimal__["a" /* default */])(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + Object(__WEBPACK_IMPORTED_MODULE_0__formatDecimal__["a" /* default */])(x, Math.max(0, p + i - 1))[0]; // less than 1y!
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatRounded.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatDecimal__ = __webpack_require__("./node_modules/d3-format/src/formatDecimal.js");


/* harmony default export */ __webpack_exports__["a"] = (function(x, p) {
  var d = Object(__WEBPACK_IMPORTED_MODULE_0__formatDecimal__["a" /* default */])(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatSpecifier.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = formatSpecifier;
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  this.fill = match[1] || " ";
  this.align = match[2] || ">";
  this.sign = match[3] || "-";
  this.symbol = match[4] || "";
  this.zero = !!match[5];
  this.width = match[6] && +match[6];
  this.comma = !!match[7];
  this.precision = match[8] && +match[8].slice(1);
  this.trim = !!match[9];
  this.type = match[10] || "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width == null ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};


/***/ }),

/***/ "./node_modules/d3-format/src/formatTrim.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
/* harmony default export */ __webpack_exports__["a"] = (function(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
});


/***/ }),

/***/ "./node_modules/d3-format/src/formatTypes.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatPrefixAuto__ = __webpack_require__("./node_modules/d3-format/src/formatPrefixAuto.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__formatRounded__ = __webpack_require__("./node_modules/d3-format/src/formatRounded.js");



/* harmony default export */ __webpack_exports__["a"] = ({
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return Object(__WEBPACK_IMPORTED_MODULE_1__formatRounded__["a" /* default */])(x * 100, p); },
  "r": __WEBPACK_IMPORTED_MODULE_1__formatRounded__["a" /* default */],
  "s": __WEBPACK_IMPORTED_MODULE_0__formatPrefixAuto__["a" /* default */],
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
});


/***/ }),

/***/ "./node_modules/d3-format/src/identity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return x;
});


/***/ }),

/***/ "./node_modules/d3-format/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__defaultLocale__ = __webpack_require__("./node_modules/d3-format/src/defaultLocale.js");
/* unused harmony reexport formatDefaultLocale */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__defaultLocale__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__defaultLocale__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locale__ = __webpack_require__("./node_modules/d3-format/src/locale.js");
/* unused harmony reexport formatLocale */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__formatSpecifier__ = __webpack_require__("./node_modules/d3-format/src/formatSpecifier.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__formatSpecifier__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__precisionFixed__ = __webpack_require__("./node_modules/d3-format/src/precisionFixed.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__precisionFixed__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__precisionPrefix__ = __webpack_require__("./node_modules/d3-format/src/precisionPrefix.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_4__precisionPrefix__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__precisionRound__ = __webpack_require__("./node_modules/d3-format/src/precisionRound.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_5__precisionRound__["a"]; });








/***/ }),

/***/ "./node_modules/d3-format/src/locale.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__exponent__ = __webpack_require__("./node_modules/d3-format/src/exponent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__formatGroup__ = __webpack_require__("./node_modules/d3-format/src/formatGroup.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__formatNumerals__ = __webpack_require__("./node_modules/d3-format/src/formatNumerals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__formatSpecifier__ = __webpack_require__("./node_modules/d3-format/src/formatSpecifier.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__formatTrim__ = __webpack_require__("./node_modules/d3-format/src/formatTrim.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__formatTypes__ = __webpack_require__("./node_modules/d3-format/src/formatTypes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__formatPrefixAuto__ = __webpack_require__("./node_modules/d3-format/src/formatPrefixAuto.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__identity__ = __webpack_require__("./node_modules/d3-format/src/identity.js");









var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

/* harmony default export */ __webpack_exports__["a"] = (function(locale) {
  var group = locale.grouping && locale.thousands ? Object(__WEBPACK_IMPORTED_MODULE_1__formatGroup__["a" /* default */])(locale.grouping, locale.thousands) : __WEBPACK_IMPORTED_MODULE_7__identity__["a" /* default */],
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? Object(__WEBPACK_IMPORTED_MODULE_2__formatNumerals__["a" /* default */])(locale.numerals) : __WEBPACK_IMPORTED_MODULE_7__identity__["a" /* default */],
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = Object(__WEBPACK_IMPORTED_MODULE_3__formatSpecifier__["a" /* default */])(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!__WEBPACK_IMPORTED_MODULE_5__formatTypes__["a" /* default */][type]) precision == null && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = __WEBPACK_IMPORTED_MODULE_5__formatTypes__["a" /* default */][type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = Object(__WEBPACK_IMPORTED_MODULE_4__formatTrim__["a" /* default */])(value);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + __WEBPACK_IMPORTED_MODULE_6__formatPrefixAuto__["b" /* prefixExponent */] / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = Object(__WEBPACK_IMPORTED_MODULE_3__formatSpecifier__["a" /* default */])(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(Object(__WEBPACK_IMPORTED_MODULE_0__exponent__["a" /* default */])(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
});


/***/ }),

/***/ "./node_modules/d3-format/src/precisionFixed.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__exponent__ = __webpack_require__("./node_modules/d3-format/src/exponent.js");


/* harmony default export */ __webpack_exports__["a"] = (function(step) {
  return Math.max(0, -Object(__WEBPACK_IMPORTED_MODULE_0__exponent__["a" /* default */])(Math.abs(step)));
});


/***/ }),

/***/ "./node_modules/d3-format/src/precisionPrefix.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__exponent__ = __webpack_require__("./node_modules/d3-format/src/exponent.js");


/* harmony default export */ __webpack_exports__["a"] = (function(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Object(__WEBPACK_IMPORTED_MODULE_0__exponent__["a" /* default */])(value) / 3))) * 3 - Object(__WEBPACK_IMPORTED_MODULE_0__exponent__["a" /* default */])(Math.abs(step)));
});


/***/ }),

/***/ "./node_modules/d3-format/src/precisionRound.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__exponent__ = __webpack_require__("./node_modules/d3-format/src/exponent.js");


/* harmony default export */ __webpack_exports__["a"] = (function(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, Object(__WEBPACK_IMPORTED_MODULE_0__exponent__["a" /* default */])(max) - Object(__WEBPACK_IMPORTED_MODULE_0__exponent__["a" /* default */])(step)) + 1;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_airy__ = __webpack_require__("./node_modules/d3-geo-projection/src/airy.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAiry", function() { return __WEBPACK_IMPORTED_MODULE_0__src_airy__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAiryRaw", function() { return __WEBPACK_IMPORTED_MODULE_0__src_airy__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_aitoff__ = __webpack_require__("./node_modules/d3-geo-projection/src/aitoff.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAitoff", function() { return __WEBPACK_IMPORTED_MODULE_1__src_aitoff__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAitoffRaw", function() { return __WEBPACK_IMPORTED_MODULE_1__src_aitoff__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_armadillo__ = __webpack_require__("./node_modules/d3-geo-projection/src/armadillo.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoArmadillo", function() { return __WEBPACK_IMPORTED_MODULE_2__src_armadillo__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoArmadilloRaw", function() { return __WEBPACK_IMPORTED_MODULE_2__src_armadillo__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_august__ = __webpack_require__("./node_modules/d3-geo-projection/src/august.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAugust", function() { return __WEBPACK_IMPORTED_MODULE_3__src_august__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAugustRaw", function() { return __WEBPACK_IMPORTED_MODULE_3__src_august__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_baker__ = __webpack_require__("./node_modules/d3-geo-projection/src/baker.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBaker", function() { return __WEBPACK_IMPORTED_MODULE_4__src_baker__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBakerRaw", function() { return __WEBPACK_IMPORTED_MODULE_4__src_baker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_berghaus__ = __webpack_require__("./node_modules/d3-geo-projection/src/berghaus.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBerghaus", function() { return __WEBPACK_IMPORTED_MODULE_5__src_berghaus__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBerghausRaw", function() { return __WEBPACK_IMPORTED_MODULE_5__src_berghaus__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_boggs__ = __webpack_require__("./node_modules/d3-geo-projection/src/boggs.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBoggs", function() { return __WEBPACK_IMPORTED_MODULE_6__src_boggs__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBoggsRaw", function() { return __WEBPACK_IMPORTED_MODULE_6__src_boggs__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_bonne__ = __webpack_require__("./node_modules/d3-geo-projection/src/bonne.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBonne", function() { return __WEBPACK_IMPORTED_MODULE_7__src_bonne__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBonneRaw", function() { return __WEBPACK_IMPORTED_MODULE_7__src_bonne__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__src_bottomley__ = __webpack_require__("./node_modules/d3-geo-projection/src/bottomley.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBottomley", function() { return __WEBPACK_IMPORTED_MODULE_8__src_bottomley__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBottomleyRaw", function() { return __WEBPACK_IMPORTED_MODULE_8__src_bottomley__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__src_bromley__ = __webpack_require__("./node_modules/d3-geo-projection/src/bromley.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBromley", function() { return __WEBPACK_IMPORTED_MODULE_9__src_bromley__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBromleyRaw", function() { return __WEBPACK_IMPORTED_MODULE_9__src_bromley__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__src_chamberlin__ = __webpack_require__("./node_modules/d3-geo-projection/src/chamberlin.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoChamberlin", function() { return __WEBPACK_IMPORTED_MODULE_10__src_chamberlin__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoChamberlinRaw", function() { return __WEBPACK_IMPORTED_MODULE_10__src_chamberlin__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoChamberlinAfrica", function() { return __WEBPACK_IMPORTED_MODULE_10__src_chamberlin__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__src_collignon__ = __webpack_require__("./node_modules/d3-geo-projection/src/collignon.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCollignon", function() { return __WEBPACK_IMPORTED_MODULE_11__src_collignon__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCollignonRaw", function() { return __WEBPACK_IMPORTED_MODULE_11__src_collignon__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__src_craig__ = __webpack_require__("./node_modules/d3-geo-projection/src/craig.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCraig", function() { return __WEBPACK_IMPORTED_MODULE_12__src_craig__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCraigRaw", function() { return __WEBPACK_IMPORTED_MODULE_12__src_craig__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__src_craster__ = __webpack_require__("./node_modules/d3-geo-projection/src/craster.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCraster", function() { return __WEBPACK_IMPORTED_MODULE_13__src_craster__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCrasterRaw", function() { return __WEBPACK_IMPORTED_MODULE_13__src_craster__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__src_cylindricalEqualArea__ = __webpack_require__("./node_modules/d3-geo-projection/src/cylindricalEqualArea.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCylindricalEqualArea", function() { return __WEBPACK_IMPORTED_MODULE_14__src_cylindricalEqualArea__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCylindricalEqualAreaRaw", function() { return __WEBPACK_IMPORTED_MODULE_14__src_cylindricalEqualArea__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__src_cylindricalStereographic__ = __webpack_require__("./node_modules/d3-geo-projection/src/cylindricalStereographic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCylindricalStereographic", function() { return __WEBPACK_IMPORTED_MODULE_15__src_cylindricalStereographic__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCylindricalStereographicRaw", function() { return __WEBPACK_IMPORTED_MODULE_15__src_cylindricalStereographic__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__src_eckert1_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eckert1.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert1", function() { return __WEBPACK_IMPORTED_MODULE_16__src_eckert1_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert1Raw", function() { return __WEBPACK_IMPORTED_MODULE_16__src_eckert1_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__src_eckert2_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eckert2.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert2", function() { return __WEBPACK_IMPORTED_MODULE_17__src_eckert2_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert2Raw", function() { return __WEBPACK_IMPORTED_MODULE_17__src_eckert2_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__src_eckert3_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eckert3.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert3", function() { return __WEBPACK_IMPORTED_MODULE_18__src_eckert3_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert3Raw", function() { return __WEBPACK_IMPORTED_MODULE_18__src_eckert3_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__src_eckert4_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eckert4.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert4", function() { return __WEBPACK_IMPORTED_MODULE_19__src_eckert4_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert4Raw", function() { return __WEBPACK_IMPORTED_MODULE_19__src_eckert4_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__src_eckert5_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eckert5.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert5", function() { return __WEBPACK_IMPORTED_MODULE_20__src_eckert5_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert5Raw", function() { return __WEBPACK_IMPORTED_MODULE_20__src_eckert5_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__src_eckert6_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eckert6.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert6", function() { return __WEBPACK_IMPORTED_MODULE_21__src_eckert6_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEckert6Raw", function() { return __WEBPACK_IMPORTED_MODULE_21__src_eckert6_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__src_eisenlohr_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/eisenlohr.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEisenlohr", function() { return __WEBPACK_IMPORTED_MODULE_22__src_eisenlohr_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEisenlohrRaw", function() { return __WEBPACK_IMPORTED_MODULE_22__src_eisenlohr_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__src_fahey_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/fahey.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoFahey", function() { return __WEBPACK_IMPORTED_MODULE_23__src_fahey_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoFaheyRaw", function() { return __WEBPACK_IMPORTED_MODULE_23__src_fahey_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__src_foucaut_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/foucaut.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoFoucaut", function() { return __WEBPACK_IMPORTED_MODULE_24__src_foucaut_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoFoucautRaw", function() { return __WEBPACK_IMPORTED_MODULE_24__src_foucaut_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__src_gilbert_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/gilbert.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGilbert", function() { return __WEBPACK_IMPORTED_MODULE_25__src_gilbert_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__src_gingery_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/gingery.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGingery", function() { return __WEBPACK_IMPORTED_MODULE_26__src_gingery_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGingeryRaw", function() { return __WEBPACK_IMPORTED_MODULE_26__src_gingery_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__src_ginzburg4_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburg4.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg4", function() { return __WEBPACK_IMPORTED_MODULE_27__src_ginzburg4_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg4Raw", function() { return __WEBPACK_IMPORTED_MODULE_27__src_ginzburg4_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__src_ginzburg5_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburg5.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg5", function() { return __WEBPACK_IMPORTED_MODULE_28__src_ginzburg5_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg5Raw", function() { return __WEBPACK_IMPORTED_MODULE_28__src_ginzburg5_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__src_ginzburg6_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburg6.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg6", function() { return __WEBPACK_IMPORTED_MODULE_29__src_ginzburg6_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg6Raw", function() { return __WEBPACK_IMPORTED_MODULE_29__src_ginzburg6_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__src_ginzburg8_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburg8.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg8", function() { return __WEBPACK_IMPORTED_MODULE_30__src_ginzburg8_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg8Raw", function() { return __WEBPACK_IMPORTED_MODULE_30__src_ginzburg8_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__src_ginzburg9_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburg9.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg9", function() { return __WEBPACK_IMPORTED_MODULE_31__src_ginzburg9_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGinzburg9Raw", function() { return __WEBPACK_IMPORTED_MODULE_31__src_ginzburg9_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__src_gringorten_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/gringorten.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGringorten", function() { return __WEBPACK_IMPORTED_MODULE_32__src_gringorten_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGringortenRaw", function() { return __WEBPACK_IMPORTED_MODULE_32__src_gringorten_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__src_guyou_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/guyou.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGuyou", function() { return __WEBPACK_IMPORTED_MODULE_33__src_guyou_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGuyouRaw", function() { return __WEBPACK_IMPORTED_MODULE_33__src_guyou_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__src_hammer_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/hammer.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHammer", function() { return __WEBPACK_IMPORTED_MODULE_34__src_hammer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHammerRaw", function() { return __WEBPACK_IMPORTED_MODULE_34__src_hammer_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__src_hammerRetroazimuthal_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/hammerRetroazimuthal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHammerRetroazimuthal", function() { return __WEBPACK_IMPORTED_MODULE_35__src_hammerRetroazimuthal_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHammerRetroazimuthalRaw", function() { return __WEBPACK_IMPORTED_MODULE_35__src_hammerRetroazimuthal_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__src_healpix_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/healpix.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHealpix", function() { return __WEBPACK_IMPORTED_MODULE_36__src_healpix_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHealpixRaw", function() { return __WEBPACK_IMPORTED_MODULE_36__src_healpix_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__src_hill_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/hill.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHill", function() { return __WEBPACK_IMPORTED_MODULE_37__src_hill_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHillRaw", function() { return __WEBPACK_IMPORTED_MODULE_37__src_hill_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__src_homolosine_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/homolosine.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHomolosine", function() { return __WEBPACK_IMPORTED_MODULE_38__src_homolosine_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoHomolosineRaw", function() { return __WEBPACK_IMPORTED_MODULE_38__src_homolosine_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__src_interrupted_index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterrupt", function() { return __WEBPACK_IMPORTED_MODULE_39__src_interrupted_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__src_interrupted_boggs__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/boggs.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterruptedBoggs", function() { return __WEBPACK_IMPORTED_MODULE_40__src_interrupted_boggs__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__src_interrupted_homolosine__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/homolosine.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterruptedHomolosine", function() { return __WEBPACK_IMPORTED_MODULE_41__src_interrupted_homolosine__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__src_interrupted_mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/mollweide.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterruptedMollweide", function() { return __WEBPACK_IMPORTED_MODULE_42__src_interrupted_mollweide__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__src_interrupted_mollweideHemispheres__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/mollweideHemispheres.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterruptedMollweideHemispheres", function() { return __WEBPACK_IMPORTED_MODULE_43__src_interrupted_mollweideHemispheres__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__src_interrupted_sinuMollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/sinuMollweide.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterruptedSinuMollweide", function() { return __WEBPACK_IMPORTED_MODULE_44__src_interrupted_sinuMollweide__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__src_interrupted_sinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/sinusoidal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterruptedSinusoidal", function() { return __WEBPACK_IMPORTED_MODULE_45__src_interrupted_sinusoidal__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__src_kavrayskiy7_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/kavrayskiy7.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoKavrayskiy7", function() { return __WEBPACK_IMPORTED_MODULE_46__src_kavrayskiy7_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoKavrayskiy7Raw", function() { return __WEBPACK_IMPORTED_MODULE_46__src_kavrayskiy7_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__src_lagrange_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/lagrange.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLagrange", function() { return __WEBPACK_IMPORTED_MODULE_47__src_lagrange_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLagrangeRaw", function() { return __WEBPACK_IMPORTED_MODULE_47__src_lagrange_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__src_larrivee__ = __webpack_require__("./node_modules/d3-geo-projection/src/larrivee.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLarrivee", function() { return __WEBPACK_IMPORTED_MODULE_48__src_larrivee__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLarriveeRaw", function() { return __WEBPACK_IMPORTED_MODULE_48__src_larrivee__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__src_laskowski__ = __webpack_require__("./node_modules/d3-geo-projection/src/laskowski.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLaskowski", function() { return __WEBPACK_IMPORTED_MODULE_49__src_laskowski__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLaskowskiRaw", function() { return __WEBPACK_IMPORTED_MODULE_49__src_laskowski__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__src_littrow_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/littrow.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLittrow", function() { return __WEBPACK_IMPORTED_MODULE_50__src_littrow_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLittrowRaw", function() { return __WEBPACK_IMPORTED_MODULE_50__src_littrow_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__src_loximuthal_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/loximuthal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLoximuthal", function() { return __WEBPACK_IMPORTED_MODULE_51__src_loximuthal_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLoximuthalRaw", function() { return __WEBPACK_IMPORTED_MODULE_51__src_loximuthal_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__src_miller__ = __webpack_require__("./node_modules/d3-geo-projection/src/miller.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMiller", function() { return __WEBPACK_IMPORTED_MODULE_52__src_miller__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMillerRaw", function() { return __WEBPACK_IMPORTED_MODULE_52__src_miller__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__ = __webpack_require__("./node_modules/d3-geo-projection/src/modifiedStereographic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographic", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographicRaw", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["g"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographicAlaska", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographicGs48", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographicGs50", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographicMiller", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["f"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoModifiedStereographicLee", function() { return __WEBPACK_IMPORTED_MODULE_53__src_modifiedStereographic__["e"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__src_mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMollweide", function() { return __WEBPACK_IMPORTED_MODULE_54__src_mollweide__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMollweideRaw", function() { return __WEBPACK_IMPORTED_MODULE_54__src_mollweide__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__src_mtFlatPolarParabolic__ = __webpack_require__("./node_modules/d3-geo-projection/src/mtFlatPolarParabolic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMtFlatPolarParabolic", function() { return __WEBPACK_IMPORTED_MODULE_55__src_mtFlatPolarParabolic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMtFlatPolarParabolicRaw", function() { return __WEBPACK_IMPORTED_MODULE_55__src_mtFlatPolarParabolic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__src_mtFlatPolarQuartic__ = __webpack_require__("./node_modules/d3-geo-projection/src/mtFlatPolarQuartic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMtFlatPolarQuartic", function() { return __WEBPACK_IMPORTED_MODULE_56__src_mtFlatPolarQuartic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMtFlatPolarQuarticRaw", function() { return __WEBPACK_IMPORTED_MODULE_56__src_mtFlatPolarQuartic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__src_mtFlatPolarSinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/mtFlatPolarSinusoidal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMtFlatPolarSinusoidal", function() { return __WEBPACK_IMPORTED_MODULE_57__src_mtFlatPolarSinusoidal__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMtFlatPolarSinusoidalRaw", function() { return __WEBPACK_IMPORTED_MODULE_57__src_mtFlatPolarSinusoidal__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__src_naturalEarth__ = __webpack_require__("./node_modules/d3-geo-projection/src/naturalEarth.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoNaturalEarth", function() { return __WEBPACK_IMPORTED_MODULE_58__src_naturalEarth__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoNaturalEarthRaw", function() { return __WEBPACK_IMPORTED_MODULE_58__src_naturalEarth__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__src_nellHammer__ = __webpack_require__("./node_modules/d3-geo-projection/src/nellHammer.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoNellHammer", function() { return __WEBPACK_IMPORTED_MODULE_59__src_nellHammer__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoNellHammerRaw", function() { return __WEBPACK_IMPORTED_MODULE_59__src_nellHammer__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__src_patterson__ = __webpack_require__("./node_modules/d3-geo-projection/src/patterson.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPatterson", function() { return __WEBPACK_IMPORTED_MODULE_60__src_patterson__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPattersonRaw", function() { return __WEBPACK_IMPORTED_MODULE_60__src_patterson__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__src_polyconic__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyconic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPolyconic", function() { return __WEBPACK_IMPORTED_MODULE_61__src_polyconic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPolyconicRaw", function() { return __WEBPACK_IMPORTED_MODULE_61__src_polyconic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__src_polyhedral_index_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/index.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPolyhedral", function() { return __WEBPACK_IMPORTED_MODULE_62__src_polyhedral_index_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__src_polyhedral_butterfly_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/butterfly.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPolyhedralButterfly", function() { return __WEBPACK_IMPORTED_MODULE_63__src_polyhedral_butterfly_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__src_polyhedral_collignon_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/collignon.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPolyhedralCollignon", function() { return __WEBPACK_IMPORTED_MODULE_64__src_polyhedral_collignon_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__src_polyhedral_waterman_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/waterman.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPolyhedralWaterman", function() { return __WEBPACK_IMPORTED_MODULE_65__src_polyhedral_waterman_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__src_project_index__ = __webpack_require__("./node_modules/d3-geo-projection/src/project/index.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoProject", function() { return __WEBPACK_IMPORTED_MODULE_66__src_project_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__src_quincuncial_gringorten_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/quincuncial/gringorten.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGringortenQuincuncial", function() { return __WEBPACK_IMPORTED_MODULE_67__src_quincuncial_gringorten_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__src_quincuncial_peirce_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/quincuncial/peirce.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPeirceQuincuncial", function() { return __WEBPACK_IMPORTED_MODULE_68__src_quincuncial_peirce_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPierceQuincuncial", function() { return __WEBPACK_IMPORTED_MODULE_68__src_quincuncial_peirce_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__src_quantize__ = __webpack_require__("./node_modules/d3-geo-projection/src/quantize.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoQuantize", function() { return __WEBPACK_IMPORTED_MODULE_69__src_quantize__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__src_quincuncial_index_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/quincuncial/index.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoQuincuncial", function() { return __WEBPACK_IMPORTED_MODULE_70__src_quincuncial_index_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__src_rectangularPolyconic__ = __webpack_require__("./node_modules/d3-geo-projection/src/rectangularPolyconic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoRectangularPolyconic", function() { return __WEBPACK_IMPORTED_MODULE_71__src_rectangularPolyconic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoRectangularPolyconicRaw", function() { return __WEBPACK_IMPORTED_MODULE_71__src_rectangularPolyconic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__src_robinson__ = __webpack_require__("./node_modules/d3-geo-projection/src/robinson.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoRobinson", function() { return __WEBPACK_IMPORTED_MODULE_72__src_robinson__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoRobinsonRaw", function() { return __WEBPACK_IMPORTED_MODULE_72__src_robinson__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__src_satellite__ = __webpack_require__("./node_modules/d3-geo-projection/src/satellite.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoSatellite", function() { return __WEBPACK_IMPORTED_MODULE_73__src_satellite__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoSatelliteRaw", function() { return __WEBPACK_IMPORTED_MODULE_73__src_satellite__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_74__src_sinuMollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinuMollweide.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoSinuMollweide", function() { return __WEBPACK_IMPORTED_MODULE_74__src_sinuMollweide__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoSinuMollweideRaw", function() { return __WEBPACK_IMPORTED_MODULE_74__src_sinuMollweide__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_75__src_sinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinusoidal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoSinusoidal", function() { return __WEBPACK_IMPORTED_MODULE_75__src_sinusoidal__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoSinusoidalRaw", function() { return __WEBPACK_IMPORTED_MODULE_75__src_sinusoidal__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_76__src_stitch__ = __webpack_require__("./node_modules/d3-geo-projection/src/stitch.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoStitch", function() { return __WEBPACK_IMPORTED_MODULE_76__src_stitch__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_77__src_times__ = __webpack_require__("./node_modules/d3-geo-projection/src/times.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTimes", function() { return __WEBPACK_IMPORTED_MODULE_77__src_times__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTimesRaw", function() { return __WEBPACK_IMPORTED_MODULE_77__src_times__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_78__src_twoPointAzimuthal__ = __webpack_require__("./node_modules/d3-geo-projection/src/twoPointAzimuthal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTwoPointAzimuthal", function() { return __WEBPACK_IMPORTED_MODULE_78__src_twoPointAzimuthal__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTwoPointAzimuthalRaw", function() { return __WEBPACK_IMPORTED_MODULE_78__src_twoPointAzimuthal__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTwoPointAzimuthalUsa", function() { return __WEBPACK_IMPORTED_MODULE_78__src_twoPointAzimuthal__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_79__src_twoPointEquidistant__ = __webpack_require__("./node_modules/d3-geo-projection/src/twoPointEquidistant.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTwoPointEquidistant", function() { return __WEBPACK_IMPORTED_MODULE_79__src_twoPointEquidistant__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTwoPointEquidistantRaw", function() { return __WEBPACK_IMPORTED_MODULE_79__src_twoPointEquidistant__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTwoPointEquidistantUsa", function() { return __WEBPACK_IMPORTED_MODULE_79__src_twoPointEquidistant__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_80__src_vanDerGrinten__ = __webpack_require__("./node_modules/d3-geo-projection/src/vanDerGrinten.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten", function() { return __WEBPACK_IMPORTED_MODULE_80__src_vanDerGrinten__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrintenRaw", function() { return __WEBPACK_IMPORTED_MODULE_80__src_vanDerGrinten__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_81__src_vanDerGrinten2__ = __webpack_require__("./node_modules/d3-geo-projection/src/vanDerGrinten2.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten2", function() { return __WEBPACK_IMPORTED_MODULE_81__src_vanDerGrinten2__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten2Raw", function() { return __WEBPACK_IMPORTED_MODULE_81__src_vanDerGrinten2__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_82__src_vanDerGrinten3__ = __webpack_require__("./node_modules/d3-geo-projection/src/vanDerGrinten3.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten3", function() { return __WEBPACK_IMPORTED_MODULE_82__src_vanDerGrinten3__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten3Raw", function() { return __WEBPACK_IMPORTED_MODULE_82__src_vanDerGrinten3__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_83__src_vanDerGrinten4__ = __webpack_require__("./node_modules/d3-geo-projection/src/vanDerGrinten4.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten4", function() { return __WEBPACK_IMPORTED_MODULE_83__src_vanDerGrinten4__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoVanDerGrinten4Raw", function() { return __WEBPACK_IMPORTED_MODULE_83__src_vanDerGrinten4__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_84__src_wagner4_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/wagner4.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWagner4", function() { return __WEBPACK_IMPORTED_MODULE_84__src_wagner4_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWagner4Raw", function() { return __WEBPACK_IMPORTED_MODULE_84__src_wagner4_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_85__src_wagner6_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/wagner6.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWagner6", function() { return __WEBPACK_IMPORTED_MODULE_85__src_wagner6_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWagner6Raw", function() { return __WEBPACK_IMPORTED_MODULE_85__src_wagner6_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_86__src_wagner7_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/wagner7.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWagner7", function() { return __WEBPACK_IMPORTED_MODULE_86__src_wagner7_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWagner7Raw", function() { return __WEBPACK_IMPORTED_MODULE_86__src_wagner7_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_87__src_wiechel_js__ = __webpack_require__("./node_modules/d3-geo-projection/src/wiechel.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWiechel", function() { return __WEBPACK_IMPORTED_MODULE_87__src_wiechel_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWiechelRaw", function() { return __WEBPACK_IMPORTED_MODULE_87__src_wiechel_js__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_88__src_winkel3__ = __webpack_require__("./node_modules/d3-geo-projection/src/winkel3.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWinkel3", function() { return __WEBPACK_IMPORTED_MODULE_88__src_winkel3__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoWinkel3Raw", function() { return __WEBPACK_IMPORTED_MODULE_88__src_winkel3__["b"]; });





































































 // DEPRECATED misspelling






















/***/ }),

/***/ "./node_modules/d3-geo-projection/src/airy.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = airyRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function airyRaw(beta) {
  var tanBeta_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(beta / 2),
      b = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(beta / 2)) / (tanBeta_2 * tanBeta_2);

  function forward(x, y) {
    var cosx = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(x),
        cosy = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y),
        siny = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(y),
        cosz = cosy * cosx,
        k = -((1 - cosz ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])((1 + cosz) / 2) / (1 - cosz) : -0.5) + b / (1 + cosz));
    return [k * cosy * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(x), k * siny];
  }

  forward.invert = function(x, y) {
    var r = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(x * x + y * y),
        z = -beta / 2,
        i = 50, delta;
    if (!r) return [0, 0];
    do {
      var z_2 = z / 2,
          cosz_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(z_2),
          sinz_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(z_2),
          tanz_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(z_2),
          lnsecz_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(1 / cosz_2);
      z -= delta = (2 / tanz_2 * lnsecz_2 - b * tanz_2 - r) / (-lnsecz_2 / (sinz_2 * sinz_2) + 1 - b / (2 * cosz_2 * cosz_2));
    } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
    var sinz = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(z);
    return [Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(x * sinz, r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(z)), Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y * sinz / r)];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  var beta = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(airyRaw),
      p = m(beta);

  p.radius = function(_) {
    return arguments.length ? m(beta = _ * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]) : beta * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
  };

  return p
      .scale(179.976)
      .clipAngle(147);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/aitoff.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = aitoffRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function aitoffRaw(x, y) {
  var cosy = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y), sincia = Object(__WEBPACK_IMPORTED_MODULE_1__math__["z" /* sinci */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(cosy * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(x /= 2)));
  return [2 * cosy * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(x) * sincia, Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(y) * sincia];
}

// Abort if [x, y] is not within an ellipse centered at [0, 0] with
// semi-major axis pi and semi-minor axis pi/2.
aitoffRaw.invert = function(x, y) {
  if (x * x + 4 * y * y > __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] + __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return;
  var x1 = x, y1 = y, i = 25;
  do {
    var sinx = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(x1),
        sinx_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(x1 / 2),
        cosx_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(x1 / 2),
        siny = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(y1),
        cosy = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y1),
        sin_2y = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(2 * y1),
        sin2y = siny * siny,
        cos2y = cosy * cosy,
        sin2x_2 = sinx_2 * sinx_2,
        c = 1 - cos2y * cosx_2 * cosx_2,
        e = c ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(cosy * cosx_2) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(f = 1 / c) : f = 0,
        f,
        fx = 2 * e * cosy * sinx_2 - x,
        fy = e * siny - y,
        dxdx = f * (cos2y * sin2x_2 + e * cosy * cosx_2 * sin2y),
        dxdy = f * (0.5 * sinx * sin_2y - e * 2 * siny * sinx_2),
        dydx = f * 0.25 * (sin_2y * sinx_2 - e * siny * cos2y * sinx),
        dydy = f * (sin2y * cosx_2 + e * sin2x_2 * cosy),
        z = dxdy * dydx - dydy * dxdx;
    if (!z) break;
    var dx = (fy * dxdy - fx * dydy) / z,
        dy = (fx * dydx - fy * dxdx) / z;
    x1 -= dx, y1 -= dy;
  } while ((Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dx) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dy) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) && --i > 0);
  return [x1, y1];
};

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(aitoffRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/armadillo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = armadilloRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function armadilloRaw(phi0) {
  var sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi0),
      cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi0),
      sPhi0 = phi0 >= 0 ? 1 : -1,
      tanPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(sPhi0 * phi0),
      k = (1 + sinPhi0 - cosPhi0) / 2;

  function forward(lambda, phi) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        cosLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda /= 2);
    return [
      (1 + cosPhi) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
      (sPhi0 * phi > -Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(cosLambda, tanPhi0) - 1e-3 ? 0 : -sPhi0 * 10) + k + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi) * cosPhi0 - (1 + cosPhi) * sinPhi0 * cosLambda // TODO D3 core should allow null or [NaN, NaN] to be returned.
    ];
  }

  forward.invert = function(x, y) {
    var lambda = 0,
        phi = 0,
        i = 50;
    do {
      var cosLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda),
          sinLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
          cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
          sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
          A = 1 + cosPhi,
          fx = A * sinLambda - x,
          fy = k + sinPhi * cosPhi0 - A * sinPhi0 * cosLambda - y,
          dxdLambda = A * cosLambda / 2,
          dxdPhi = -sinLambda * sinPhi,
          dydLambda = sinPhi0 * A * sinLambda / 2,
          dydPhi = cosPhi0 * cosPhi + sinPhi0 * cosLambda * sinPhi,
          denominator = dxdPhi * dydLambda - dydPhi * dxdLambda,
          dLambda = (fy * dxdPhi - fx * dydPhi) / denominator / 2,
          dPhi = (fx * dydLambda - fy * dxdLambda) / denominator;
      lambda -= dLambda, phi -= dPhi;
    } while ((Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dLambda) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dPhi) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) && --i > 0);
    return sPhi0 * phi > -Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda), tanPhi0) - 1e-3 ? [lambda * 2, phi] : null;
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  var phi0 = 20 * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */],
      sPhi0 = phi0 >= 0 ? 1 : -1,
      tanPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(sPhi0 * phi0),
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(armadilloRaw),
      p = m(phi0),
      stream_ = p.stream;

  p.parallel = function(_) {
    if (!arguments.length) return phi0 * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
    tanPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])((sPhi0 = (phi0 = _ * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]) >= 0 ? 1 : -1) * phi0);
    return m(phi0);
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var lambda = sPhi0 * -180; sPhi0 * lambda < 180; lambda += sPhi0 * 90) sphereStream.point(lambda, sPhi0 * 90);
      while (sPhi0 * (lambda -= phi0) >= -180) { // TODO precision?
        sphereStream.point(lambda, sPhi0 * -Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */] / 2), tanPhi0) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]);
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p
      .scale(218.695)
      .center([0, 28.0974]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/august.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = augustRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function augustRaw(lambda, phi) {
  var tanPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi / 2),
      k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - tanPhi * tanPhi),
      c = 1 + k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda /= 2),
      x = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) * k / c,
      y = tanPhi / c,
      x2 = x * x,
      y2 = y * y;
  return [
    4 / 3 * x * (3 + x2 - 3 * y2),
    4 / 3 * y * (3 + 3 * x2 - y2)
  ];
}

augustRaw.invert = function(x, y) {
  x *= 3 / 8, y *= 3 / 8;
  if (!x && Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) > 1) return null;
  var x2 = x * x,
      y2 = y * y,
      s = 1 + x2 + y2,
      sin3Eta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])((s - Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(s * s - 4 * y * y)) / 2),
      eta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sin3Eta) / 3,
      xi = sin3Eta ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["c" /* arcosh */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y / sin3Eta)) / 3 : Object(__WEBPACK_IMPORTED_MODULE_1__math__["d" /* arsinh */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x)) / 3,
      cosEta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(eta),
      coshXi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["i" /* cosh */])(xi),
      d = coshXi * coshXi - cosEta * cosEta;
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["A" /* sinh */])(xi) * cosEta, 0.25 - d),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(coshXi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(eta), 0.25 + d)
  ];
};

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(augustRaw)
      .scale(66.1603);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/baker.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bakerRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



var sqrt8 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(8),
    phi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(1 + __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */]);

function bakerRaw(lambda, phi) {
  var phi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi);
  return phi0 < __WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */]
      ? [lambda, Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] + phi / 2))]
      : [lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi0) * (2 * __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */] - 1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi0)), Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * (2 * __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */] * (phi0 - __WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */]) - Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi0 / 2)))];
}

bakerRaw.invert = function(x, y) {
  if ((y0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y)) < phi0) return [x, 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["m" /* exp */])(y)) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]];
  var phi = __WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */], i = 25, delta, y0;
  do {
    var cosPhi_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi / 2), tanPhi_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi / 2);
    phi -= delta = (sqrt8 * (phi - __WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */]) - Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(tanPhi_2) - y0) / (sqrt8 - cosPhi_2 * cosPhi_2 / (2 * tanPhi_2));
  } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["l" /* epsilon2 */] && --i > 0);
  return [x / (Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * (sqrt8 - 1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi))), Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * phi];
};

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(bakerRaw)
      .scale(112.314);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/berghaus.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = berghausRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function berghausRaw(lobes) {
  var k = 2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / lobes;

  function forward(lambda, phi) {
    var p = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEquidistantRaw"])(lambda, phi);
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) > __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) { // back hemisphere
      var theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(p[1], p[0]),
          r = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(p[0] * p[0] + p[1] * p[1]),
          theta0 = k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["w" /* round */])((theta - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) / k) + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
          α = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta -= theta0), 2 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta)); // angle relative to lobe end
      theta = theta0 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(α)) - α;
      p[0] = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta);
      p[1] = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta);
    }
    return p;
  }

  forward.invert = function(x, y) {
    var r = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(x * x + y * y);
    if (r > __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) {
      var theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(y, x),
          theta0 = k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["w" /* round */])((theta - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) / k) + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
          s = theta > theta0 ? -1 : 1,
          A = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta0 - theta),
          cotα = 1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(s * Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])((A - __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] - 2 * A) + r * r)));
      theta = theta0 + 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])((cotα + s * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(cotα * cotα - 3)) / 3);
      x = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta), y = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta);
    }
    return __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEquidistantRaw"].invert(x, y);
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  var lobes = 5,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(berghausRaw),
      p = m(lobes),
      projectionStream = p.stream,
      epsilon = 1e-2,
      cr = -Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(epsilon * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]),
      sr = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(epsilon * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]);

  p.lobes = function(_) {
    return arguments.length ? m(lobes = +_) : lobes;
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = projectionStream(stream),
        sphereStream = (p.rotate([0, 0]), projectionStream(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var i = 0, delta = 360 / lobes, delta0 = 2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / lobes, phi = 90 - 180 / lobes, phi0 = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]; i < lobes; ++i, phi -= delta, phi0 -= delta0) {
        sphereStream.point(Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(sr * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi0), cr) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */], Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sr * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi0)) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]);
        if (phi < -90) {
          sphereStream.point(-90, -180 - phi - epsilon);
          sphereStream.point(-90, -180 - phi + epsilon);
        } else {
          sphereStream.point(90, phi + epsilon);
          sphereStream.point(90, phi - epsilon);
        }
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p
      .scale(87.8076)
      .center([0, 17.1875])
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/boggs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = boggsRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");




var k = 2.00276,
    w = 1.11072;

function boggsRaw(lambda, phi) {
  var theta = Object(__WEBPACK_IMPORTED_MODULE_1__mollweide__["c" /* mollweideBromleyTheta */])(__WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */], phi);
  return [k * lambda / (1 / Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi) + w / Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(theta)), (phi + __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(theta)) / k];
}

boggsRaw.invert = function(x, y) {
  var ky = k * y, theta = y < 0 ? -__WEBPACK_IMPORTED_MODULE_2__math__["u" /* quarterPi */] : __WEBPACK_IMPORTED_MODULE_2__math__["u" /* quarterPi */], i = 25, delta, phi;
  do {
    phi = ky - __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(theta);
    theta -= delta = (Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(2 * theta) + 2 * theta - __WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(phi)) / (2 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(2 * theta) + 2 + __WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi) * __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(theta));
  } while (Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */] && --i > 0);
  phi = ky - __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(theta);
  return [x * (1 / Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi) + w / Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(theta)) / k, phi];
};

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(boggsRaw)
      .scale(160.857);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/bonne.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bonneRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parallel1__ = __webpack_require__("./node_modules/d3-geo-projection/src/parallel1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinusoidal.js");




function bonneRaw(phi0) {
  if (!phi0) return __WEBPACK_IMPORTED_MODULE_2__sinusoidal__["b" /* sinusoidalRaw */];
  var cotPhi0 = 1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi0);

  function forward(lambda, phi) {
    var rho = cotPhi0 + phi0 - phi,
        e = rho ? lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) / rho : rho;
    return [rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(e), cotPhi0 - rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(e)];
  }

  forward.invert = function(x, y) {
    var rho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(x * x + (y = cotPhi0 - y) * y),
        phi = cotPhi0 + phi0 - rho;
    return [rho / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(x, y), phi];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__parallel1__["a" /* default */])(bonneRaw)
      .scale(123.082)
      .center([0, 26.1441])
      .parallel(45);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/bottomley.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bottomleyRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function bottomleyRaw(sinPsi) {

  function forward(lambda, phi) {
    var rho = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - phi,
        eta = rho ? lambda * sinPsi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rho) / rho : rho;
    return [rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(eta) / sinPsi, __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(eta)];
  }

  forward.invert = function(x, y) {
    var x1 = x * sinPsi,
        y1 = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - y,
        rho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(x1 * x1 + y1 * y1),
        eta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(x1, y1);
    return [(rho ? rho / Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rho) : 1) * eta / sinPsi, __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - rho];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  var sinPsi = 0.5,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(bottomleyRaw),
      p = m(sinPsi);

  p.fraction = function(_) {
    return arguments.length ? m(sinPsi = +_) : sinPsi;
  };

  return p
      .scale(158.837);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/bromley.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bromleyRaw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");




var bromleyRaw = Object(__WEBPACK_IMPORTED_MODULE_2__mollweide__["b" /* mollweideBromleyRaw */])(1, 4 / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */], __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]);

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(bromleyRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/chamberlin.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = chamberlinRaw;
/* harmony export (immutable) */ __webpack_exports__["a"] = chamberlinAfrica;
/* harmony export (immutable) */ __webpack_exports__["c"] = chamberlin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



// Azimuthal distance.
function distance(dPhi, c1, s1, c2, s2, dLambda) {
  var cosdLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(dLambda), r;
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dPhi) > 1 || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dLambda) > 1) {
    r = Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(s1 * s2 + c1 * c2 * cosdLambda);
  } else {
    var sindPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(dPhi / 2), sindLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(dLambda / 2);
    r = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(sindPhi * sindPhi + c1 * c2 * sindLambda * sindLambda));
  }
  return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(r) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] ? [r, Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(c2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(dLambda), c1 * s2 - s1 * c2 * cosdLambda)] : [0, 0];
}

// Angle opposite a, and contained between sides of lengths b and c.
function angle(b, c, a) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])((b * b + c * c - a * a) / (2 * b * c));
}

// Normalize longitude.
function longitude(lambda) {
  return lambda - 2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["n" /* floor */])((lambda + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / (2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]));
}

function chamberlinRaw(p0, p1, p2) {
  var points = [
    [p0[0], p0[1], Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(p0[1]), Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(p0[1])],
    [p1[0], p1[1], Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(p1[1]), Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(p1[1])],
    [p2[0], p2[1], Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(p2[1]), Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(p2[1])]
  ];

  for (var a = points[2], b, i = 0; i < 3; ++i, a = b) {
    b = points[i];
    a.v = distance(b[1] - a[1], a[3], a[2], b[3], b[2], b[0] - a[0]);
    a.point = [0, 0];
  }

  var beta0 = angle(points[0].v[0], points[2].v[0], points[1].v[0]),
      beta1 = angle(points[0].v[0], points[1].v[0], points[2].v[0]),
      beta2 = __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] - beta0;

  points[2].point[1] = 0;
  points[0].point[0] = -(points[1].point[0] = points[0].v[0] / 2);

  var mean = [
    points[2].point[0] = points[0].point[0] + points[2].v[0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(beta0),
    2 * (points[0].point[1] = points[1].point[1] = points[2].v[0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(beta0))
  ];

  function forward(lambda, phi) {
    var sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
        cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        v = new Array(3), i;

    // Compute distance and azimuth from control points.
    for (i = 0; i < 3; ++i) {
      var p = points[i];
      v[i] = distance(phi - p[1], p[3], p[2], cosPhi, sinPhi, lambda - p[0]);
      if (!v[i][0]) return p.point;
      v[i][1] = longitude(v[i][1] - p.v[1]);
    }

    // Arithmetic mean of interception points.
    var point = mean.slice();
    for (i = 0; i < 3; ++i) {
      var j = i == 2 ? 0 : i + 1;
      var a = angle(points[i].v[0], v[i][0], v[j][0]);
      if (v[i][1] < 0) a = -a;

      if (!i) {
        point[0] += v[i][0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(a);
        point[1] -= v[i][0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(a);
      } else if (i == 1) {
        a = beta1 - a;
        point[0] -= v[i][0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(a);
        point[1] -= v[i][0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(a);
      } else {
        a = beta2 - a;
        point[0] += v[i][0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(a);
        point[1] += v[i][0] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(a);
      }
    }

    point[0] /= 3, point[1] /= 3;
    return point;
  }

  return forward;
}

function pointRadians(p) {
  return p[0] *= __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */], p[1] *= __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */], p;
}

function chamberlinAfrica() {
  return chamberlin([0, 22], [45, 22], [22.5, -22])
      .scale(380)
      .center([22.5, 2]);
}

function chamberlin(p0, p1, p2) { // TODO order matters!
  var c = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoCentroid"])({type: "MultiPoint", coordinates: [p0, p1, p2]}),
      R = [-c[0], -c[1]],
      r = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoRotation"])(R),
      p = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(chamberlinRaw(pointRadians(r(p0)), pointRadians(r(p1)), pointRadians(r(p2)))).rotate(R),
      center = p.center;

  delete p.rotate;

  p.center = function(_) {
    return arguments.length ? center(r(_)) : r.invert(center());
  };

  return p
      .clipAngle(90);
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/collignon.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = collignonRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function collignonRaw(lambda, phi) {
  var alpha = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi));
  return [(2 / __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */]) * lambda * alpha, __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] * (1 - alpha)];
}

collignonRaw.invert = function(x, y) {
  var lambda = (lambda = y / __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] - 1) * lambda;
  return [lambda > 0 ? x * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / lambda) / 2 : 0, Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(1 - lambda)];
};

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(collignonRaw)
      .scale(95.6464)
      .center([0, 30]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/craig.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = craigRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parallel1__ = __webpack_require__("./node_modules/d3-geo-projection/src/parallel1.js");



function craigRaw(phi0) {
  var tanPhi0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi0);

  function forward(lambda, phi) {
    return [lambda, (lambda ? lambda / Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(lambda) : 1) * (Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(lambda) - tanPhi0 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi))];
  }

  forward.invert = tanPhi0 ? function(x, y) {
    if (x) y *= Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(x) / x;
    var cosλ = Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(x);
    return [x, 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(cosλ * cosλ + tanPhi0 * tanPhi0 - y * y) - cosλ, tanPhi0 - y)];
  } : function(x, y) {
    return [x, Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* asin */])(x ? y * Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(x) / x : y)];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__parallel1__["a" /* default */])(craigRaw)
      .scale(249.828)
      .clipAngle(90);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/craster.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = crasterRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



var sqrt3 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(3);

function crasterRaw(lambda, phi) {
  return [sqrt3 * lambda * (2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(2 * phi / 3) - 1) / __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */], sqrt3 * __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi / 3)];
}

crasterRaw.invert = function(x, y) {
  var phi = 3 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y / (sqrt3 * __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */]));
  return [__WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] * x / (sqrt3 * (2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(2 * phi / 3) - 1)), phi];
};

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(crasterRaw)
      .scale(156.19);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/cylindricalEqualArea.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cylindricalEqualAreaRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parallel1__ = __webpack_require__("./node_modules/d3-geo-projection/src/parallel1.js");



function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi) / cosPhi0];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* asin */])(y * cosPhi0)];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__parallel1__["a" /* default */])(cylindricalEqualAreaRaw)
      .parallel(38.58) // acos(sqrt(width / height / pi)) * radians
      .scale(195.044); // width / (sqrt(width / height / pi) * 2 * pi)
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/cylindricalStereographic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cylindricalStereographicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parallel1__ = __webpack_require__("./node_modules/d3-geo-projection/src/parallel1.js");



function cylindricalStereographicRaw(phi0) {
  var cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, (1 + cosPhi0) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi / 2)];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(y / (1 + cosPhi0)) * 2];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__parallel1__["a" /* default */])(cylindricalStereographicRaw)
      .scale(124.75);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eckert1.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eckert1Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function eckert1Raw(lambda, phi) {
  var alpha = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(8 / (3 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]));
  return [
    alpha * lambda * (1 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]),
    alpha * phi
  ];
}

eckert1Raw.invert = function(x, y) {
  var alpha = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(8 / (3 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])),
      phi = y / alpha;
  return [
    x / (alpha * (1 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])),
    phi
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eckert1Raw)
      .scale(165.664);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eckert2.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eckert2Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function eckert2Raw(lambda, phi) {
  var alpha = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(4 - 3 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi)));
  return [
    2 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(6 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) * lambda * alpha,
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 3) * (2 - alpha)
  ];
}

eckert2Raw.invert = function(x, y) {
  var alpha = 2 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 3);
  return [
    x * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(6 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / (2 * alpha),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((4 - alpha * alpha) / 3)
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eckert2Raw)
      .scale(165.664);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eckert3.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eckert3Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function eckert3Raw(lambda, phi) {
  var k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]));
  return [
    2 / k * lambda * (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - 4 * phi * phi / (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]))),
    4 / k * phi
  ];
}

eckert3Raw.invert = function(x, y) {
  var k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])) / 2;
  return [
    x * k / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - y * y * (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / (4 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]))),
    y * k / 2
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eckert3Raw)
      .scale(180.739);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eckert4.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eckert4Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function eckert4Raw(lambda, phi) {
  var k = (2 + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi);
  phi /= 2;
  for (var i = 0, delta = Infinity; i < 10 && Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]; i++) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi);
    phi -= delta = (phi + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi) * (cosPhi + 2) - k) / (2 * cosPhi * (1 + cosPhi));
  }
  return [
    2 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])) * lambda * (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi)),
    2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)
  ];
}

eckert4Raw.invert = function(x, y) {
  var A = y * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])((4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / 2,
      k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(A),
      c = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(k);
  return [
    x / (2 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])) * (1 + c)),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((k + A * (c + 2)) / (2 + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eckert4Raw)
      .scale(180.739);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eckert5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eckert5Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function eckert5Raw(lambda, phi) {
  return [
    lambda * (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi)) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]),
    2 * phi / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])
  ];
}

eckert5Raw.invert = function(x, y) {
  var k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]),
      phi = y * k / 2;
  return [
    k * x / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi)),
    phi
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eckert5Raw)
      .scale(173.044);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eckert6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eckert6Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function eckert6Raw(lambda, phi) {
  var k = (1 + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi);
  for (var i = 0, delta = Infinity; i < 10 && Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]; i++) {
    phi -= delta = (phi + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi) - k) / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi));
  }
  k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]);
  return [
    lambda * (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi)) / k,
    2 * phi / k
  ];
}

eckert6Raw.invert = function(x, y) {
  var j = 1 + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(j / 2);
  return [
    x * 2 * k / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y *= k)),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((y + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(y)) / j)
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eckert6Raw)
      .scale(173.044);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/eisenlohr.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = eisenlohrRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__august__ = __webpack_require__("./node_modules/d3-geo-projection/src/august.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");




var eisenlohrK = 3 + 2 * __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */];

function eisenlohrRaw(lambda, phi) {
  var s0 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(lambda /= 2),
      c0 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(lambda),
      k = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi)),
      c1 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi /= 2),
      t = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(phi) / (c1 + __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c0 * k),
      c = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(2 / (1 + t * t)),
      v = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])((__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c1 + (c0 + s0) * k) / (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c1 + (c0 - s0) * k));
  return [
    eisenlohrK * (c * (v - 1 / v) - 2 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["p" /* log */])(v)),
    eisenlohrK * (c * t * (v + 1 / v) - 2 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["f" /* atan */])(t))
  ];
}

eisenlohrRaw.invert = function(x, y) {
  if (!(p = __WEBPACK_IMPORTED_MODULE_1__august__["a" /* augustRaw */].invert(x / 1.2, y * 1.065))) return null;
  var lambda = p[0], phi = p[1], i = 20, p;
  x /= eisenlohrK, y /= eisenlohrK;
  do {
    var _0 = lambda / 2,
        _1 = phi / 2,
        s0 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(_0),
        c0 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(_0),
        s1 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(_1),
        c1 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(_1),
        cos1 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi),
        k = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(cos1),
        t = s1 / (c1 + __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c0 * k),
        t2 = t * t,
        c = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(2 / (1 + t2)),
        v0 = (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c1 + (c0 + s0) * k),
        v1 = (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c1 + (c0 - s0) * k),
        v2 = v0 / v1,
        v = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(v2),
        vm1v = v - 1 / v,
        vp1v = v + 1 / v,
        fx = c * vm1v - 2 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["p" /* log */])(v) - x,
        fy = c * t * vp1v - 2 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["f" /* atan */])(t) - y,
        deltatDeltaLambda = s1 && __WEBPACK_IMPORTED_MODULE_2__math__["C" /* sqrt1_2 */] * k * s0 * t2 / s1,
        deltatDeltaPhi = (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c0 * c1 + k) / (2 * (c1 + __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c0 * k) * (c1 + __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c0 * k) * k),
        deltacDeltat = -0.5 * t * c * c * c,
        deltacDeltaLambda = deltacDeltat * deltatDeltaLambda,
        deltacDeltaPhi = deltacDeltat * deltatDeltaPhi,
        A = (A = 2 * c1 + __WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * k * (c0 - s0)) * A * v,
        deltavDeltaLambda = (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * c0 * c1 * k + cos1) / A,
        deltavDeltaPhi = -(__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] * s0 * s1) / (k * A),
        deltaxDeltaLambda = vm1v * deltacDeltaLambda - 2 * deltavDeltaLambda / v + c * (deltavDeltaLambda + deltavDeltaLambda / v2),
        deltaxDeltaPhi = vm1v * deltacDeltaPhi - 2 * deltavDeltaPhi / v + c * (deltavDeltaPhi + deltavDeltaPhi / v2),
        deltayDeltaLambda = t * vp1v * deltacDeltaLambda - 2 * deltatDeltaLambda / (1 + t2) + c * vp1v * deltatDeltaLambda + c * t * (deltavDeltaLambda - deltavDeltaLambda / v2),
        deltayDeltaPhi = t * vp1v * deltacDeltaPhi - 2 * deltatDeltaPhi / (1 + t2) + c * vp1v * deltatDeltaPhi + c * t * (deltavDeltaPhi - deltavDeltaPhi / v2),
        denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda;
    if (!denominator) break;
    var deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator,
        deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    lambda -= deltaLambda;
    phi = Object(__WEBPACK_IMPORTED_MODULE_2__math__["q" /* max */])(-__WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */], Object(__WEBPACK_IMPORTED_MODULE_2__math__["r" /* min */])(__WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */], phi - deltaPhi));
  } while ((Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(deltaLambda) > __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(deltaPhi) > __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]) && --i > 0);
  return Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(phi) - __WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */] ? [0, phi] : i && [lambda, phi];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(eisenlohrRaw)
      .scale(62.5271);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/elliptic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = ellipticJi;
/* unused harmony export ellipticJ */
/* harmony export (immutable) */ __webpack_exports__["b"] = ellipticFi;
/* harmony export (immutable) */ __webpack_exports__["a"] = ellipticF;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");


// Returns [sn, cn, dn](u + iv|m).
function ellipticJi(u, v, m) {
  var a, b, c;
  if (!u) {
    b = ellipticJ(v, 1 - m);
    return [
      [0, b[0] / b[1]],
      [1 / b[1], 0],
      [b[2] / b[1], 0]
    ];
  }
  a = ellipticJ(u, m);
  if (!v) return [[a[0], 0], [a[1], 0], [a[2], 0]];
  b = ellipticJ(v, 1 - m);
  c = b[1] * b[1] + m * a[0] * a[0] * b[0] * b[0];
  return [
    [a[0] * b[2] / c, a[1] * a[2] * b[0] * b[1] / c],
    [a[1] * b[1] / c, -a[0] * a[2] * b[0] * b[2] / c],
    [a[2] * b[1] * b[2] / c, -m * a[0] * a[1] * b[0] / c]
  ];
}

// Returns [sn, cn, dn, ph](u|m).
function ellipticJ(u, m) {
  var ai, b, phi, t, twon;
  if (m < __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */]) {
    t = Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(u);
    b = Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(u);
    ai = m * (u - t * b) / 4;
    return [
      t - ai * b,
      b + ai * t,
      1 - m * t * t / 2,
      u - ai
    ];
  }
  if (m >= 1 - __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */]) {
    ai = (1 - m) / 4;
    b = Object(__WEBPACK_IMPORTED_MODULE_0__math__["i" /* cosh */])(u);
    t = Object(__WEBPACK_IMPORTED_MODULE_0__math__["G" /* tanh */])(u);
    phi = 1 / b;
    twon = b * Object(__WEBPACK_IMPORTED_MODULE_0__math__["A" /* sinh */])(u);
    return [
      t + ai * (twon - u) / (b * b),
      phi - ai * t * phi * (twon - u),
      phi + ai * t * phi * (twon + u),
      2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["m" /* exp */])(u)) - __WEBPACK_IMPORTED_MODULE_0__math__["o" /* halfPi */] + ai * (twon - u) / b
    ];
  }

  var a = [1, 0, 0, 0, 0, 0, 0, 0, 0],
      c = [Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(m), 0, 0, 0, 0, 0, 0, 0, 0],
      i = 0;
  b = Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(1 - m);
  twon = 1;

  while (Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(c[i] / a[i]) > __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */] && i < 8) {
    ai = a[i++];
    c[i] = (ai - b) / 2;
    a[i] = (ai + b) / 2;
    b = Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(ai * b);
    twon *= 2;
  }

  phi = twon * a[i] * u;
  do {
    t = c[i] * Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(b = phi) / a[i];
    phi = (Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* asin */])(t) + phi) / 2;
  } while (--i);

  return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi), t = Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi), t / Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi - b), phi];
}

// Calculate F(phi+iPsi|m).
// See Abramowitz and Stegun, 17.4.11.
function ellipticFi(phi, psi, m) {
  var r = Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(phi),
      i = Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(psi),
      sinhPsi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["A" /* sinh */])(i);
  if (r) {
    var cscPhi = 1 / Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(r),
        cotPhi2 = 1 / (Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(r) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(r)),
        b = -(cotPhi2 + m * (sinhPsi * sinhPsi * cscPhi * cscPhi) - 1 + m),
        c = (m - 1) * cotPhi2,
        cotLambda2 = (-b + Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(b * b - 4 * c)) / 2;
    return [
      ellipticF(Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(1 / Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(cotLambda2)), m) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["x" /* sign */])(phi),
      ellipticF(Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])((cotLambda2 / cotPhi2 - 1) / m)), 1 - m) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["x" /* sign */])(psi)
    ];
  }
  return [
    0,
    ellipticF(Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(sinhPsi), 1 - m) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["x" /* sign */])(psi)
  ];
}

// Calculate F(phi|m) where m = k² = sin²α.
// See Abramowitz and Stegun, 17.6.7.
function ellipticF(phi, m) {
  if (!m) return phi;
  if (m === 1) return Object(__WEBPACK_IMPORTED_MODULE_0__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi / 2 + __WEBPACK_IMPORTED_MODULE_0__math__["u" /* quarterPi */]));
  var a = 1,
      b = Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(1 - m),
      c = Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(m);
  for (var i = 0; Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(c) > __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */]; i++) {
    if (phi % __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */]) {
      var dPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(b * Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi) / a);
      if (dPhi < 0) dPhi += __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */];
      phi += dPhi + ~~(phi / __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */]) * __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */];
    } else phi += phi;
    c = (a + b) / 2;
    b = Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(a * b);
    c = ((a = c) - b) / 2;
  }
  return phi / (Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* pow */])(2, i) * a);
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/fahey.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = faheyRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



var faheyK = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(35 * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]);

function faheyRaw(lambda, phi) {
  var t = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi / 2);
  return [lambda * faheyK * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - t * t), (1 + faheyK) * t];
}

faheyRaw.invert = function(x, y) {
  var t = y / (1 + faheyK);
  return [x && x / (faheyK * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - t * t)), 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(t)];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(faheyRaw)
      .scale(137.152);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/foucaut.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = foucautRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function foucautRaw(lambda, phi) {
  var k = phi / 2, cosk = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(k);
  return [ 2 * lambda / __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * cosk * cosk, __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(k)];
}

foucautRaw.invert = function(x, y) {
  var k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(y / __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */]), cosk = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(k), phi = 2 * k;
  return [x * __WEBPACK_IMPORTED_MODULE_1__math__["E" /* sqrtPi */] / 2 / (Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * cosk * cosk), phi];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(foucautRaw)
      .scale(135.264);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/gilbert.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function gilbertForward(point) {
  return [point[0] / 2, Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(point[1] / 2 * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */])) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]];
}

function gilbertInvert(point) {
  return [point[0] * 2, 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(point[1] * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */])) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]];
}

/* harmony default export */ __webpack_exports__["a"] = (function(projectionType) {
  if (projectionType == null) projectionType = __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoOrthographic"];
  var projection = projectionType(),
      equirectangular = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoEquirectangular"])().scale(__WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]).precision(0).clipAngle(null).translate([0, 0]); // antimeridian cutting

  function gilbert(point) {
    return projection(gilbertForward(point));
  }

  if (projection.invert) gilbert.invert = function(point) {
    return gilbertInvert(projection.invert(point));
  };

  gilbert.stream = function(stream) {
    var s1 = projection.stream(stream), s0 = equirectangular.stream({
      point: function(lambda, phi) { s1.point(lambda / 2, Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(-phi / 2 * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */])) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]); },
      lineStart: function() { s1.lineStart(); },
      lineEnd: function() { s1.lineEnd(); },
      polygonStart: function() { s1.polygonStart(); },
      polygonEnd: function() { s1.polygonEnd(); }
    });
    s0.sphere = s1.sphere;
    return s0;
  };

  function property(name) {
    gilbert[name] = function(_) {
      return arguments.length ? (projection[name](_), gilbert) : projection[name]();
    };
  }

  gilbert.rotate = function(_) {
    return arguments.length ? (equirectangular.rotate(_), gilbert) : equirectangular.rotate();
  };

  gilbert.center = function(_) {
    return arguments.length ? (projection.center(gilbertForward(_)), gilbert) : gilbertInvert(projection.center());
  };

  property("clipAngle");
  property("clipExtent");
  property("scale");
  property("translate");
  property("precision");

  return gilbert
      .scale(249.5);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/gingery.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = gingeryRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function gingeryRaw(rho, n) {
  var k = 2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / n,
      rho2 = rho * rho;

  function forward(lambda, phi) {
    var p = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEquidistantRaw"])(lambda, phi),
        x = p[0],
        y = p[1],
        r2 = x * x + y * y;

    if (r2 > rho2) {
      var r = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(r2),
          theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(y, x),
          theta0 = k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["w" /* round */])(theta / k),
          alpha = theta - theta0,
          rhoCosAlpha = rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(alpha),
          k_ = (rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(alpha) - alpha * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rhoCosAlpha)) / (__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - rhoCosAlpha),
          s_ = gingeryLength(alpha, k_),
          e = (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] - rho) / gingeryIntegrate(s_, rhoCosAlpha, __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]);

      x = r;
      var i = 50, delta;
      do {
        x -= delta = (rho + gingeryIntegrate(s_, rhoCosAlpha, x) * e - r) / (s_(x) * e);
      } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);

      y = alpha * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(x);
      if (x < __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) y -= k_ * (x - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]);

      var s = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta0),
          c = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta0);
      p[0] = x * c - y * s;
      p[1] = x * s + y * c;
    }
    return p;
  }

  forward.invert = function(x, y) {
    var r2 = x * x + y * y;
    if (r2 > rho2) {
      var r = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(r2),
          theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(y, x),
          theta0 = k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["w" /* round */])(theta / k),
          dTheta = theta - theta0;

      x = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(dTheta);
      y = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(dTheta);

      var x_halfPi = x - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
          sinx = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(x),
          alpha = y / sinx,
          delta = x < __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] ? Infinity : 0,
          i = 10;

      while (true) {
        var rhosinAlpha = rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(alpha),
            rhoCosAlpha = rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(alpha),
            sinRhoCosAlpha = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rhoCosAlpha),
            halfPi_RhoCosAlpha = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - rhoCosAlpha,
            k_ = (rhosinAlpha - alpha * sinRhoCosAlpha) / halfPi_RhoCosAlpha,
            s_ = gingeryLength(alpha, k_);

        if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) < __WEBPACK_IMPORTED_MODULE_1__math__["l" /* epsilon2 */] || !--i) break;

        alpha -= delta = (alpha * sinx - k_ * x_halfPi - y) / (
          sinx - x_halfPi * 2 * (
            halfPi_RhoCosAlpha * (rhoCosAlpha + alpha * rhosinAlpha * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(rhoCosAlpha) - sinRhoCosAlpha) -
            rhosinAlpha * (rhosinAlpha - alpha * sinRhoCosAlpha)
          ) / (halfPi_RhoCosAlpha * halfPi_RhoCosAlpha));
      }
      r = rho + gingeryIntegrate(s_, rhoCosAlpha, x) * (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] - rho) / gingeryIntegrate(s_, rhoCosAlpha, __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]);
      theta = theta0 + alpha;
      x = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta);
      y = r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta);
    }
    return __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEquidistantRaw"].invert(x, y);
  };

  return forward;
}

function gingeryLength(alpha, k) {
  return function(x) {
    var y_ = alpha * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(x);
    if (x < __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) y_ -= k;
    return Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 + y_ * y_);
  };
}

// Numerical integration: trapezoidal rule.
function gingeryIntegrate(f, a, b) {
  var n = 50,
      h = (b - a) / n,
      s = f(a) + f(b);
  for (var i = 1, x = a; i < n; ++i) s += 2 * f(x += h);
  return s * 0.5 * h;
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var n = 6,
      rho = 30 * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */],
      cRho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(rho),
      sRho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rho),
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(gingeryRaw),
      p = m(rho, n),
      stream_ = p.stream,
      epsilon = 1e-2,
      cr = -Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(epsilon * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]),
      sr = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(epsilon * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]);

  p.radius = function(_) {
    if (!arguments.length) return rho * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
    cRho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(rho = _ * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]);
    sRho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rho);
    return m(rho, n);
  };

  p.lobes = function(_) {
    if (!arguments.length) return n;
    return m(rho, n = +_);
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart(), sphereStream.lineStart();
      for (var i = 0, delta = 2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / n, phi = 0; i < n; ++i, phi -= delta) {
        sphereStream.point(Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(sr * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi), cr) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */], Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sr * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]);
        sphereStream.point(Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(sRho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi - delta / 2), cRho) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */], Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sRho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi - delta / 2)) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]);
      }
      sphereStream.lineEnd(), sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return p
      .rotate([90, -40])
      .scale(91.7095)
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/ginzburg4.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ginzburg4Raw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburgPolyconic.js");



var ginzburg4Raw = Object(__WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__["a" /* default */])(2.8284, -1.6988, 0.75432, -0.18071, 1.76003, -0.38914, 0.042555);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(ginzburg4Raw)
      .scale(149.995);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/ginzburg5.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ginzburg5Raw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburgPolyconic.js");



var ginzburg5Raw = Object(__WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__["a" /* default */])(2.583819, -0.835827, 0.170354, -0.038094, 1.543313, -0.411435,0.082742);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(ginzburg5Raw)
      .scale(153.93);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/ginzburg6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ginzburg6Raw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburgPolyconic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");




var ginzburg6Raw = Object(__WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__["a" /* default */])(5 / 6 * __WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */], -0.62636, -0.0344, 0, 1.3493, -0.05524, 0, 0.045);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(ginzburg6Raw)
      .scale(130.945);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/ginzburg8.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = ginzburg8Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function ginzburg8Raw(lambda, phi) {
  var lambda2 = lambda * lambda,
      phi2 = phi * phi;
  return [
    lambda * (1 - 0.162388 * phi2) * (0.87 - 0.000952426 * lambda2 * lambda2),
    phi * (1 + phi2 / 12)
  ];
}

ginzburg8Raw.invert = function(x, y) {
  var lambda = x,
      phi = y,
      i = 50, delta;
  do {
    var phi2 = phi * phi;
    phi -= delta = (phi * (1 + phi2 / 12) - y) / (1 + phi2 / 4);
  } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  i = 50;
  x /= 1 -0.162388 * phi2;
  do {
    var lambda4 = (lambda4 = lambda * lambda) * lambda4;
    lambda -= delta = (lambda * (0.87 - 0.000952426 * lambda4) - x) / (0.87 - 0.00476213 * lambda4);
  } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  return [lambda, phi];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(ginzburg8Raw)
      .scale(131.747);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/ginzburg9.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ginzburg9Raw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__ = __webpack_require__("./node_modules/d3-geo-projection/src/ginzburgPolyconic.js");



var ginzburg9Raw = Object(__WEBPACK_IMPORTED_MODULE_1__ginzburgPolyconic__["a" /* default */])(2.6516, -0.76534, 0.19123, -0.047094, 1.36289, -0.13965,0.031762);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(ginzburg9Raw)
      .scale(131.087);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/ginzburgPolyconic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");


/* harmony default export */ __webpack_exports__["a"] = (function(a, b, c, d, e, f, g, h) {
  if (arguments.length < 8) h = 0;

  function forward(lambda, phi) {
    if (!phi) return [a * lambda / __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */], 0];
    var phi2 = phi * phi,
        xB = a + phi2 * (b + phi2 * (c + phi2 * d)),
        yB = phi * (e - 1 + phi2 * (f - h + phi2 * g)),
        m = (xB * xB + yB * yB) / (2 * yB),
        alpha = lambda * Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* asin */])(xB / m) / __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */];
    return [m * Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(alpha), phi * (1 + phi2 * h) + m * (1 - Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(alpha))];
  }

  forward.invert = function(x, y) {
    var lambda = __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */] * x / a,
        phi = y,
        deltaLambda, deltaPhi, i = 50;
    do {
      var phi2 = phi * phi,
          xB = a + phi2 * (b + phi2 * (c + phi2 * d)),
          yB = phi * (e - 1 + phi2 * (f - h + phi2 * g)),
          p = xB * xB + yB * yB,
          q = 2 * yB,
          m = p / q,
          m2 = m * m,
          dAlphadLambda = Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* asin */])(xB / m) / __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */],
          alpha = lambda * dAlphadLambda,
          xB2 = xB * xB,
          dxBdPhi = (2 * b + phi2 * (4 * c + phi2 * 6 * d)) * phi,
          dyBdPhi = e + phi2 * (3 * f + phi2 * 5 * g),
          dpdPhi = 2 * (xB * dxBdPhi + yB * (dyBdPhi - 1)),
          dqdPhi = 2 * (dyBdPhi - 1),
          dmdPhi = (dpdPhi * q - p * dqdPhi) / (q * q),
          cosAlpha = Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(alpha),
          sinAlpha = Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(alpha),
          mcosAlpha = m * cosAlpha,
          msinAlpha = m * sinAlpha,
          dAlphadPhi = ((lambda / __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */]) * (1 / Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(1 - xB2 / m2)) * (dxBdPhi * m - xB * dmdPhi)) / m2,
          fx = msinAlpha - x,
          fy = phi * (1 + phi2 * h) + m - mcosAlpha - y,
          deltaxDeltaPhi = dmdPhi * sinAlpha + mcosAlpha * dAlphadPhi,
          deltaxDeltaLambda = mcosAlpha * dAlphadLambda,
          deltayDeltaPhi = 1 + dmdPhi - (dmdPhi * cosAlpha - msinAlpha * dAlphadPhi),
          deltayDeltaLambda = msinAlpha * dAlphadLambda,
          denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda;
      if (!denominator) break;
      lambda -= deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator;
      phi -= deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    } while ((Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(deltaLambda) > __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(deltaPhi) > __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */]) && --i > 0);
    return [lambda, phi];
  };

  return forward;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/gringorten.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = gringortenRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__square__ = __webpack_require__("./node_modules/d3-geo-projection/src/square.js");




function gringortenRaw(lambda, phi) {
  var sLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(lambda),
      sPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi),
      cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
      x = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda) * cosPhi,
      y = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) * cosPhi,
      z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(sPhi * phi);
  lambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(y, z));
  phi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x);
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) lambda %= __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */];
  var point = gringortenHexadecant(lambda > __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4 ? __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - lambda : lambda, phi);
  if (lambda > __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4) z = point[0], point[0] = -point[1], point[1] = -z;
  return (point[0] *= sLambda, point[1] *= -sPhi, point);
}

gringortenRaw.invert = function(x, y) {
  var sx = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x),
      sy = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y),
      x0 = -sx * x,
      y0 = -sy * y,
      t = y0 / x0 < 1,
      p = gringortenHexadecantInvert(t ? y0 : x0, t ? x0 : y0),
      lambda = p[0],
      phi = p[1],
      cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi);
  if (t) lambda = -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - lambda;
  return [sx * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) * cosPhi, -Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)) + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]), sy * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda) * cosPhi)];
};

function gringortenHexadecant(lambda, phi) {
  if (phi === __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) return [0, 0];

  var sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
      r = sinPhi * sinPhi,
      r2 = r * r,
      j = 1 + r2,
      k = 1 + 3 * r2,
      q = 1 - r2,
      z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(j)),
      v = q + r * j * z,
      p2 = (1 - sinPhi) / v,
      p = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(p2),
      a2 = p2 * j,
      a = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a2),
      h = p * q,
      x,
      i;

  if (lambda === 0) return [0, -(h + r * a)];

  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
      secPhi = 1 / cosPhi,
      drdPhi = 2 * sinPhi * cosPhi,
      dvdPhi = (-3 * r + z * k) * drdPhi,
      dp2dPhi = (-v * cosPhi - (1 - sinPhi) * dvdPhi) / (v * v),
      dpdPhi = (0.5 * dp2dPhi) / p,
      dhdPhi = q * dpdPhi - 2 * r * p * drdPhi,
      dra2dPhi = r * j * dp2dPhi + p2 * k * drdPhi,
      mu = -secPhi * drdPhi,
      nu = -secPhi * dra2dPhi,
      zeta = -2 * secPhi * dhdPhi,
      lambda1 = 4 * lambda / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */],
      delta;

  // Slower but accurate bisection method.
  if (lambda > 0.222 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] || phi < __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4 && lambda > 0.175 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) {
    x = (h + r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a2 * (1 + r2) - h * h)) / (1 + r2);
    if (lambda > __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4) return [x, x];
    var x1 = x, x0 = 0.5 * x;
    x = 0.5 * (x0 + x1), i = 50;
    do {
      var g = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a2 - x * x),
          f = (x * (zeta + mu * g) + nu * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x / a)) - lambda1;
      if (!f) break;
      if (f < 0) x0 = x;
      else x1 = x;
      x = 0.5 * (x0 + x1);
    } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x1 - x0) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  }

  // Newton-Raphson.
  else {
    x = __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */], i = 25;
    do {
      var x2 = x * x,
          g2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a2 - x2),
          zetaMug = zeta + mu * g2,
          f2 = x * zetaMug + nu * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x / a) - lambda1,
          df = zetaMug + (nu - mu * x2) / g2;
      x -= delta = g2 ? f2 / df : 0;
    } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  }

  return [x, -h - r * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a2 - x * x)];
}

function gringortenHexadecantInvert(x, y) {
  var x0 = 0,
      x1 = 1,
      r = 0.5,
      i = 50;

  while (true) {
    var r2 = r * r,
        sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(r),
        z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 + r2)),
        v = (1 - r2) + r * (1 + r2) * z,
        p2 = (1 - sinPhi) / v,
        p = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(p2),
        a2 = p2 * (1 + r2),
        h = p * (1 - r2),
        g2 = a2 - x * x,
        g = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(g2),
        y0 = y + h + r * g;
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x1 - x0) < __WEBPACK_IMPORTED_MODULE_1__math__["l" /* epsilon2 */] || --i === 0 || y0 === 0) break;
    if (y0 > 0) x0 = r;
    else x1 = r;
    r = 0.5 * (x0 + x1);
  }

  if (!i) return null;

  var phi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sinPhi),
      cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
      secPhi = 1 / cosPhi,
      drdPhi = 2 * sinPhi * cosPhi,
      dvdPhi = (-3 * r + z * (1 + 3 * r2)) * drdPhi,
      dp2dPhi = (-v * cosPhi - (1 - sinPhi) * dvdPhi) / (v * v),
      dpdPhi = 0.5 * dp2dPhi / p,
      dhdPhi = (1 - r2) * dpdPhi - 2 * r * p * drdPhi,
      zeta = -2 * secPhi * dhdPhi,
      mu = -secPhi * drdPhi,
      nu = -secPhi * (r * (1 + r2) * dp2dPhi + p2 * (1 + 3 * r2) * drdPhi);

  return [__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4 * (x * (zeta + mu * g) + nu * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a2))), phi];
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(Object(__WEBPACK_IMPORTED_MODULE_2__square__["a" /* default */])(gringortenRaw))
      .scale(239.75);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/guyou.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = guyouRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__elliptic__ = __webpack_require__("./node_modules/d3-geo-projection/src/elliptic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__square__ = __webpack_require__("./node_modules/d3-geo-projection/src/square.js");





function guyouRaw(lambda, phi) {
  var k_ = (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] - 1) / (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] + 1),
      k = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(1 - k_ * k_),
      K = Object(__WEBPACK_IMPORTED_MODULE_1__elliptic__["a" /* ellipticF */])(__WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */], k * k),
      f = -1,
      psi = Object(__WEBPACK_IMPORTED_MODULE_2__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_2__math__["F" /* tan */])(__WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */] / 4 + Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(phi) / 2)),
      r = Object(__WEBPACK_IMPORTED_MODULE_2__math__["m" /* exp */])(f * psi) / Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(k_),
      at = guyouComplexAtan(r * Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(f * lambda), r * Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(f * lambda)),
      t = Object(__WEBPACK_IMPORTED_MODULE_1__elliptic__["b" /* ellipticFi */])(at[0], at[1], k * k);
  return [-t[1], (phi >= 0 ? 1 : -1) * (0.5 * K - t[0])];
}

function guyouComplexAtan(x, y) {
  var x2 = x * x,
      y_1 = y + 1,
      t = 1 - x2 - y * y;
  return [
   0.5 * ((x >= 0 ? __WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */] : -__WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */]) - Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* atan2 */])(t, 2 * x)),
    -0.25 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["p" /* log */])(t * t + 4 * x2) +0.5 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["p" /* log */])(y_1 * y_1 + x2)
  ];
}

function guyouComplexDivide(a, b) {
  var denominator = b[0] * b[0] + b[1] * b[1];
  return [
    (a[0] * b[0] + a[1] * b[1]) / denominator,
    (a[1] * b[0] - a[0] * b[1]) / denominator
  ];
}

guyouRaw.invert = function(x, y) {
  var k_ = (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] - 1) / (__WEBPACK_IMPORTED_MODULE_2__math__["D" /* sqrt2 */] + 1),
      k = Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(1 - k_ * k_),
      K = Object(__WEBPACK_IMPORTED_MODULE_1__elliptic__["a" /* ellipticF */])(__WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */], k * k),
      f = -1,
      j = Object(__WEBPACK_IMPORTED_MODULE_1__elliptic__["c" /* ellipticJi */])(0.5 * K - y, -x, k * k),
      tn = guyouComplexDivide(j[0], j[1]),
      lambda = Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* atan2 */])(tn[1], tn[0]) / f;
  return [
    lambda,
    2 * Object(__WEBPACK_IMPORTED_MODULE_2__math__["f" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_2__math__["m" /* exp */])(0.5 / f * Object(__WEBPACK_IMPORTED_MODULE_2__math__["p" /* log */])(k_ * tn[0] * tn[0] + k_ * tn[1] * tn[1]))) - __WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */]
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(Object(__WEBPACK_IMPORTED_MODULE_3__square__["a" /* default */])(guyouRaw))
      .scale(151.496);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/hammer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = hammerRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function hammerRaw(A, B) {
  if (arguments.length < 2) B = A;
  if (B === 1) return __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEqualAreaRaw"];
  if (B === Infinity) return hammerQuarticAuthalicRaw;

  function forward(lambda, phi) {
    var coordinates = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEqualAreaRaw"])(lambda / B, phi);
    coordinates[0] *= A;
    return coordinates;
  }

  forward.invert = function(x, y) {
    var coordinates = __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEqualAreaRaw"].invert(x / A, y);
    coordinates[0] *= B;
    return coordinates;
  };

  return forward;
}

function hammerQuarticAuthalicRaw(lambda, phi) {
  return [
    lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi /= 2),
    2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)
  ];
}

hammerQuarticAuthalicRaw.invert = function(x, y) {
  var phi = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y / 2);
  return [
    x * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi / 2) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
    phi
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var B = 2,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(hammerRaw),
      p = m(B);

  p.coefficient = function(_) {
    if (!arguments.length) return B;
    return m(B = +_);
  };

  return p
    .scale(169.529);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/hammerRetroazimuthal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = hammerRetroazimuthalRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function hammerRetroazimuthalRaw(phi0) {
  var sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi0),
      cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi0),
      rotate = hammerRetroazimuthalRotation(phi0);

  rotate.invert = hammerRetroazimuthalRotation(-phi0);

  function forward(lambda, phi) {
    var p = rotate(lambda, phi);
    lambda = p[0], phi = p[1];
    var sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
        cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        cosLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda),
        z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosLambda),
        sinz = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(z),
        K = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(sinz) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] ? z / sinz : 1;
    return [
      K * cosPhi0 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
      (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) > __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] ? K : -K) // rotate for back hemisphere
        * (sinPhi0 * cosPhi - cosPhi0 * sinPhi * cosLambda)
    ];
  }

  forward.invert = function(x, y) {
    var rho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(x * x + y * y),
        sinz = -Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(rho),
        cosz = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(rho),
        a = rho * cosz,
        b = -y * sinz,
        c = rho * sinPhi0,
        d = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a * a + b * b - c * c),
        phi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(a * c + b * d, b * c - a * d),
        lambda = (rho > __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] ? -1 : 1) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(x * sinz, rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * cosz + y * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi) * sinz);
    return rotate.invert(lambda, phi);
  };

  return forward;
}

// Latitudinal rotation by phi0.
// Temporary hack until D3 supports arbitrary small-circle clipping origins.
function hammerRetroazimuthalRotation(phi0) {
  var sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi0),
      cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi0);

  return function(lambda, phi) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        x = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda) * cosPhi,
        y = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) * cosPhi,
        z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi);
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(y, x * cosPhi0 - z * sinPhi0),
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(z * cosPhi0 + x * sinPhi0)
    ];
  };
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var phi0 = 0,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(hammerRetroazimuthalRaw),
      p = m(phi0),
      rotate_ = p.rotate,
      stream_ = p.stream,
      circle = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoCircle"])();

  p.parallel = function(_) {
    if (!arguments.length) return phi0 * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
    var r = p.rotate();
    return m(phi0 = _ * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]).rotate(r);
  };

  // Temporary hack; see hammerRetroazimuthalRotation.
  p.rotate = function(_) {
    if (!arguments.length) return (_ = rotate_.call(p), _[1] += phi0 * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */], _);
    rotate_.call(p, [_[0], _[1] - phi0 * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]]);
    circle.center([-_[0], -_[1]]);
    return p;
  };

  p.stream = function(stream) {
    stream = stream_(stream);
    stream.sphere = function() {
      stream.polygonStart();
      var epsilon = 1e-2,
          ring = circle.radius(90 - epsilon)().coordinates[0],
          n = ring.length - 1,
          i = -1,
          p;
      stream.lineStart();
      while (++i < n) stream.point((p = ring[i])[0], p[1]);
      stream.lineEnd();
      ring = circle.radius(90 + epsilon)().coordinates[0];
      n = ring.length - 1;
      stream.lineStart();
      while (--i >= 0) stream.point((p = ring[i])[0], p[1]);
      stream.lineEnd();
      stream.polygonEnd();
    };
    return stream;
  };

  return p
      .scale(79.4187)
      .parallel(45)
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/healpix.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = healpixRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__collignon__ = __webpack_require__("./node_modules/d3-geo-projection/src/collignon.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cylindricalEqualArea__ = __webpack_require__("./node_modules/d3-geo-projection/src/cylindricalEqualArea.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");






var healpixParallel = 41 + 48 / 36 + 37 / 3600, // for K=3; TODO automate
    healpixLambert = Object(__WEBPACK_IMPORTED_MODULE_3__cylindricalEqualArea__["a" /* cylindricalEqualAreaRaw */])(0);

function healpixRaw(H) {
  var phi0 = healpixParallel * __WEBPACK_IMPORTED_MODULE_4__math__["v" /* radians */],
      dx = Object(__WEBPACK_IMPORTED_MODULE_2__collignon__["a" /* collignonRaw */])(__WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */], phi0)[0] - Object(__WEBPACK_IMPORTED_MODULE_2__collignon__["a" /* collignonRaw */])(-__WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */], phi0)[0],
      y0 = healpixLambert(0, phi0)[1],
      y1 = Object(__WEBPACK_IMPORTED_MODULE_2__collignon__["a" /* collignonRaw */])(0, phi0)[1],
      dy1 = __WEBPACK_IMPORTED_MODULE_4__math__["E" /* sqrtPi */] - y1,
      k = __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */] / H,
      w = 4 / __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */],
      h = y0 + (dy1 * dy1 * 4) / __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */];

  function forward(lambda, phi) {
    var point,
        phi2 = Object(__WEBPACK_IMPORTED_MODULE_4__math__["a" /* abs */])(phi);
    if (phi2 > phi0) {
      var i = Object(__WEBPACK_IMPORTED_MODULE_4__math__["r" /* min */])(H - 1, Object(__WEBPACK_IMPORTED_MODULE_4__math__["q" /* max */])(0, Object(__WEBPACK_IMPORTED_MODULE_4__math__["n" /* floor */])((lambda + __WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */]) / k)));
      lambda += __WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */] * (H - 1) / H - i * k;
      point = Object(__WEBPACK_IMPORTED_MODULE_2__collignon__["a" /* collignonRaw */])(lambda, phi2);
      point[0] = point[0] * __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */] / dx - __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */] * (H - 1) / (2 * H) + i * __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */] / H;
      point[1] = y0 + (point[1] - y1) * 4 * dy1 / __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */];
      if (phi < 0) point[1] = -point[1];
    } else {
      point = healpixLambert(lambda, phi);
    }
    point[0] *= w, point[1] /= h;
    return point;
  }

  forward.invert = function(x, y) {
    x /= w, y *= h;
    var y2 = Object(__WEBPACK_IMPORTED_MODULE_4__math__["a" /* abs */])(y);
    if (y2 > y0) {
      var i = Object(__WEBPACK_IMPORTED_MODULE_4__math__["r" /* min */])(H - 1, Object(__WEBPACK_IMPORTED_MODULE_4__math__["q" /* max */])(0, Object(__WEBPACK_IMPORTED_MODULE_4__math__["n" /* floor */])((x + __WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */]) / k)));
      x = (x + __WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */] * (H - 1) / H - i * k) * dx / __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */];
      var point = __WEBPACK_IMPORTED_MODULE_2__collignon__["a" /* collignonRaw */].invert(x, 0.25 * (y2 - y0) * __WEBPACK_IMPORTED_MODULE_4__math__["H" /* tau */] / dy1 + y1);
      point[0] -= __WEBPACK_IMPORTED_MODULE_4__math__["s" /* pi */] * (H - 1) / H - i * k;
      if (y < 0) point[1] = -point[1];
      return point;
    }
    return healpixLambert.invert(x, y);
  };

  return forward;
}

function sphere(step) {
  return {
    type: "Polygon",
    coordinates: [
      Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(-180, 180 + step / 2, step).map(function(x, i) { return [x, i & 1 ? 90 - 1e-6 : healpixParallel]; })
      .concat(Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(180, -180 - step / 2, -step).map(function(x, i) { return [x, i & 1 ? -90 + 1e-6 : -healpixParallel]; }))
    ]
  };
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var H = 4,
      m = Object(__WEBPACK_IMPORTED_MODULE_1_d3_geo__["geoProjectionMutator"])(healpixRaw),
      p = m(H),
      stream_ = p.stream;

  p.lobes = function(_) {
    return arguments.length ? m(H = +_) : H;
  };

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() { Object(__WEBPACK_IMPORTED_MODULE_1_d3_geo__["geoStream"])(sphere(180 / H), sphereStream); };
    return rotateStream;
  };

  return p
      .scale(239.75);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/hill.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = hillRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function hillRaw(K) {
  var L = 1 + K,
      sinBt = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(1 / L),
      Bt = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sinBt),
      A = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / (B = __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] + 4 * Bt * L)),
      B,
      rho0 = 0.5 * A * (L + Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(K * (2 + K))),
      K2 = K * K,
      L2 = L * L;

  function forward(lambda, phi) {
    var t = 1 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
        rho,
        omega;
    if (t && t < 2) {
      var theta = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] - phi, i = 25, delta;
      do {
        var sinTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta),
            cosTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta),
            Bt_Bt1 = Bt + Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(sinTheta, L - cosTheta),
            C = 1 + L2 - 2 * L * cosTheta;
        theta -= delta = (theta - K2 * Bt - L * sinTheta + C * Bt_Bt1 -0.5 * t * B) / (2 * L * sinTheta * Bt_Bt1);
      } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["l" /* epsilon2 */] && --i > 0);
      rho = A * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(C);
      omega = lambda * Bt_Bt1 / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */];
    } else {
      rho = A * (K + t);
      omega = lambda * Bt / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */];
    }
    return [
      rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(omega),
      rho0 - rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(omega)
    ];
  }

  forward.invert = function(x, y) {
    var rho2 = x * x + (y -= rho0) * y,
        cosTheta = (1 + L2 - rho2 / (A * A)) / (2 * L),
        theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(cosTheta),
        sinTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta),
        Bt_Bt1 = Bt + Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(sinTheta, L - cosTheta);
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(rho2)) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / Bt_Bt1,
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(1 - 2 * (theta - K2 * Bt - L * sinTheta + (1 + L2 - 2 * L * cosTheta) * Bt_Bt1) / B)
    ];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var K = 1,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(hillRaw),
      p = m(K);

  p.ratio = function(_) {
    return arguments.length ? m(K = +_) : K;
  };

  return p
      .scale(167.774)
      .center([0, 18.67]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/homolosine.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = homolosineRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinusoidal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sinuMollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinuMollweide.js");






function homolosineRaw(lambda, phi) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) > __WEBPACK_IMPORTED_MODULE_4__sinuMollweide__["b" /* sinuMollweidePhi */]
      ? (lambda = Object(__WEBPACK_IMPORTED_MODULE_2__mollweide__["d" /* mollweideRaw */])(lambda, phi), lambda[1] -= phi > 0 ? __WEBPACK_IMPORTED_MODULE_4__sinuMollweide__["d" /* sinuMollweideY */] : -__WEBPACK_IMPORTED_MODULE_4__sinuMollweide__["d" /* sinuMollweideY */], lambda)
      : Object(__WEBPACK_IMPORTED_MODULE_3__sinusoidal__["b" /* sinusoidalRaw */])(lambda, phi);
}

homolosineRaw.invert = function(x, y) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) > __WEBPACK_IMPORTED_MODULE_4__sinuMollweide__["b" /* sinuMollweidePhi */]
      ? __WEBPACK_IMPORTED_MODULE_2__mollweide__["d" /* mollweideRaw */].invert(x, y + (y > 0 ? __WEBPACK_IMPORTED_MODULE_4__sinuMollweide__["d" /* sinuMollweideY */] : -__WEBPACK_IMPORTED_MODULE_4__sinuMollweide__["d" /* sinuMollweideY */]))
      : __WEBPACK_IMPORTED_MODULE_3__sinusoidal__["b" /* sinusoidalRaw */].invert(x, y);
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(homolosineRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/boggs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__boggs__ = __webpack_require__("./node_modules/d3-geo-projection/src/boggs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");



var lobes = [[ // northern hemisphere
  [[-180,   0], [-100,  90], [ -40,   0]],
  [[ -40,   0], [  30,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-160, -90], [-100,   0]],
  [[-100,   0], [ -60, -90], [ -20,   0]],
  [[ -20,   0], [  20, -90], [  80,   0]],
  [[  80,   0], [ 140, -90], [ 180,   0]]
]];

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__boggs__["a" /* boggsRaw */], lobes)
      .scale(160.857);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/homolosine.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__homolosine__ = __webpack_require__("./node_modules/d3-geo-projection/src/homolosine.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");



var lobes = [[ // northern hemisphere
  [[-180,   0], [-100,  90], [ -40,   0]],
  [[ -40,   0], [  30,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-160, -90], [-100,   0]],
  [[-100,   0], [ -60, -90], [ -20,   0]],
  [[ -20,   0], [  20, -90], [  80,   0]],
  [[  80,   0], [ 140, -90], [ 180,   0]]
]];

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__homolosine__["b" /* homolosineRaw */], lobes)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");




function pointEqual(a, b) {
  return Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(a[0] - b[0]) < __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */] && Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(a[1] - b[1]) < __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */];
}

function interpolateLine(coordinates, m) {
  var i = -1,
      n = coordinates.length,
      p0 = coordinates[0],
      p1,
      dx,
      dy,
      resampled = [];
  while (++i < n) {
    p1 = coordinates[i];
    dx = (p1[0] - p0[0]) / m;
    dy = (p1[1] - p0[1]) / m;
    for (var j = 0; j < m; ++j) resampled.push([p0[0] + j * dx, p0[1] + j * dy]);
    p0 = p1;
  }
  resampled.push(p1);
  return resampled;
}

function interpolateSphere(lobes) {
  var coordinates = [],
      lobe,
      lambda0, phi0, phi1,
      lambda2, phi2,
      i, n = lobes[0].length;

  // Northern Hemisphere
  for (i = 0; i < n; ++i) {
    lobe = lobes[0][i];
    lambda0 = lobe[0][0], phi0 = lobe[0][1], phi1 = lobe[1][1];
    lambda2 = lobe[2][0], phi2 = lobe[2][1];
    coordinates.push(interpolateLine([
      [lambda0 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi0 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]],
      [lambda0 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi1 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]],
      [lambda2 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi1 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]],
      [lambda2 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi2 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]]
    ], 30));
  }

  // Southern Hemisphere
  for (i = lobes[1].length - 1; i >= 0; --i) {
    lobe = lobes[1][i];
    lambda0 = lobe[0][0], phi0 = lobe[0][1], phi1 = lobe[1][1];
    lambda2 = lobe[2][0], phi2 = lobe[2][1];
    coordinates.push(interpolateLine([
      [lambda2 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi2 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]],
      [lambda2 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi1 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]],
      [lambda0 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi1 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]],
      [lambda0 + __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */], phi0 - __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]]
    ], 30));
  }

  return {
    type: "Polygon",
    coordinates: [Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["d" /* merge */])(coordinates)]
  };
}

/* harmony default export */ __webpack_exports__["a"] = (function(project, lobes) {
  var sphere = interpolateSphere(lobes);

  lobes = lobes.map(function(lobe) {
    return lobe.map(function(l) {
      return [
        [l[0][0] * __WEBPACK_IMPORTED_MODULE_2__math__["v" /* radians */], l[0][1] * __WEBPACK_IMPORTED_MODULE_2__math__["v" /* radians */]],
        [l[1][0] * __WEBPACK_IMPORTED_MODULE_2__math__["v" /* radians */], l[1][1] * __WEBPACK_IMPORTED_MODULE_2__math__["v" /* radians */]],
        [l[2][0] * __WEBPACK_IMPORTED_MODULE_2__math__["v" /* radians */], l[2][1] * __WEBPACK_IMPORTED_MODULE_2__math__["v" /* radians */]]
      ];
    });
  });

  var bounds = lobes.map(function(lobe) {
    return lobe.map(function(l) {
      var x0 = project(l[0][0], l[0][1])[0],
          x1 = project(l[2][0], l[2][1])[0],
          y0 = project(l[1][0], l[0][1])[1],
          y1 = project(l[1][0], l[1][1])[1],
          t;
      if (y0 > y1) t = y0, y0 = y1, y1 = t;
      return [[x0, y0], [x1, y1]];
    });
  });

  function forward(lambda, phi) {
    var sign = phi < 0 ? -1 : +1, lobe = lobes[+(phi < 0)];
    for (var i = 0, n = lobe.length - 1; i < n && lambda > lobe[i][2][0]; ++i);
    var p = project(lambda - lobe[i][1][0], phi);
    p[0] += project(lobe[i][1][0], sign * phi > sign * lobe[i][0][1] ? lobe[i][0][1] : phi)[0];
    return p;
  }

  // Assumes mutually exclusive bounding boxes for lobes.
  if (project.invert) forward.invert = function(x, y) {
    var bound = bounds[+(y < 0)], lobe = lobes[+(y < 0)];
    for (var i = 0, n = bound.length; i < n; ++i) {
      var b = bound[i];
      if (b[0][0] <= x && x < b[1][0] && b[0][1] <= y && y < b[1][1]) {
        var p = project.invert(x - project(lobe[i][1][0], 0)[0], y);
        p[0] += lobe[i][1][0];
        return pointEqual(forward(p[0], p[1]), [x, y]) ? p : null;
      }
    }
  };

  var p = Object(__WEBPACK_IMPORTED_MODULE_1_d3_geo__["geoProjection"])(forward),
      stream_ = p.stream;

  p.stream = function(stream) {
    var rotate = p.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (p.rotate([0, 0]), stream_(stream));
    p.rotate(rotate);
    rotateStream.sphere = function() { Object(__WEBPACK_IMPORTED_MODULE_1_d3_geo__["geoStream"])(sphere, sphereStream); };
    return rotateStream;
  };

  return p;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/mollweide.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");



var lobes = [[ // northern hemisphere
  [[-180,   0], [-100,  90], [ -40,   0]],
  [[ -40,   0], [  30,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-160, -90], [-100,   0]],
  [[-100,   0], [ -60, -90], [ -20,   0]],
  [[ -20,   0], [  20, -90], [  80,   0]],
  [[  80,   0], [ 140, -90], [ 180,   0]]
]];

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__mollweide__["d" /* mollweideRaw */], lobes)
      .scale(169.529);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/mollweideHemispheres.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");



var lobes = [[ // northern hemisphere
  [[-180,   0], [ -90,  90], [   0,   0]],
  [[   0,   0], [  90,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [ -90, -90], [   0,   0]],
  [[   0,   0], [  90, -90], [ 180,   0]]
]];

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__mollweide__["d" /* mollweideRaw */], lobes)
      .scale(169.529)
      .rotate([20, 0]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/sinuMollweide.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sinuMollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinuMollweide.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");



var lobes = [[ // northern hemisphere
  [[-180,  35], [ -30,  90], [   0,  35]],
  [[   0,  35], [  30,  90], [ 180,  35]]
], [ // southern hemisphere
  [[-180, -10], [-102, -90], [ -65, -10]],
  [[ -65, -10], [   5, -90], [  77, -10]],
  [[  77, -10], [ 103, -90], [ 180, -10]]
]];

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__sinuMollweide__["c" /* sinuMollweideRaw */], lobes)
      .rotate([-20, -55])
      .scale(164.263)
      .center([0, -5.4036]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/interrupted/sinusoidal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinusoidal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/interrupted/index.js");



var lobes = [[ // northern hemisphere
  [[-180,   0], [-110,  90], [ -40,   0]],
  [[ -40,   0], [   0,  90], [  40,   0]],
  [[  40,   0], [ 110,  90], [ 180,   0]]
], [ // southern hemisphere
  [[-180,   0], [-110, -90], [ -40,   0]],
  [[ -40,   0], [   0, -90], [  40,   0]],
  [[  40,   0], [ 110, -90], [ 180,   0]]
]];

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__sinusoidal__["b" /* sinusoidalRaw */], lobes)
      .scale(152.63)
      .rotate([-20, 0]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/kavrayskiy7.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = kavrayskiy7Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function kavrayskiy7Raw(lambda, phi) {
  return [3 / __WEBPACK_IMPORTED_MODULE_1__math__["H" /* tau */] * lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 3 - phi * phi), phi];
}

kavrayskiy7Raw.invert = function(x, y) {
  return [__WEBPACK_IMPORTED_MODULE_1__math__["H" /* tau */] / 3 * x / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 3 - y * y), y];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(kavrayskiy7Raw)
      .scale(158.837);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/lagrange.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = lagrangeRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function lagrangeRaw(n) {

  function forward(lambda, phi) {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [0, phi < 0 ? -2 : 2];
    var sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
        v = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* pow */])((1 + sinPhi) / (1 - sinPhi), n / 2),
        c = 0.5 * (v + 1 / v) + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda *= n);
    return [
      2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) / c,
      (v - 1 / v) / c
    ];
  }

  forward.invert = function(x, y) {
    var y0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y);
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y0 - 2) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return x ? null : [0, Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]];
    if (y0 > 2) return null;

    x /= 2, y /= 2;
    var x2 = x * x,
        y2 = y * y,
        t = 2 * y / (1 + x2 + y2); // tanh(nPhi)
    t = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* pow */])((1 + t) / (1 - t), 1 / n);
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(2 * x, 1 - x2 - y2) / n,
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((t - 1) / (t + 1))
    ];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var n = 0.5,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(lagrangeRaw),
      p = m(n);

  p.spacing = function(_) {
    return arguments.length ? m(n = +_) : n;
  };

  return p
      .scale(124.75);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/larrivee.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = larriveeRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



var pi_sqrt2 = __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */];

function larriveeRaw(lambda, phi) {
  return [
    lambda * (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi))) / 2,
    phi / (Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi / 2) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda / 6))
  ];
}

larriveeRaw.invert = function(x, y) {
  var x0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x),
      y0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y),
      lambda = __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */],
      phi = __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */];
  if (y0 < pi_sqrt2) phi *= y0 / pi_sqrt2;
  else lambda += 6 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(pi_sqrt2 / y0);
  for (var i = 0; i < 25; i++) {
    var sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
        sqrtcosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi)),
        sinPhi_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi / 2),
        cosPhi_2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi / 2),
        sinLambda_6 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda / 6),
        cosLambda_6 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda / 6),
        f0 = 0.5 * lambda * (1 + sqrtcosPhi) - x0,
        f1 = phi / (cosPhi_2 * cosLambda_6) - y0,
        df0dPhi = sqrtcosPhi ? -0.25 * lambda * sinPhi / sqrtcosPhi : 0,
        df0dLambda = 0.5 * (1 + sqrtcosPhi),
        df1dPhi = (1 +0.5 * phi * sinPhi_2 / cosPhi_2) / (cosPhi_2 * cosLambda_6),
        df1dLambda = (phi / cosPhi_2) * (sinLambda_6 / 6) / (cosLambda_6 * cosLambda_6),
        denom = df0dPhi * df1dLambda - df1dPhi * df0dLambda,
        dPhi = (f0 * df1dLambda - f1 * df0dLambda) / denom,
        dLambda = (f1 * df0dPhi - f0 * df1dPhi) / denom;
    phi -= dPhi;
    lambda -= dLambda;
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dPhi) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(dLambda) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) break;
  }
  return [x < 0 ? -lambda : lambda, y < 0 ? -phi : phi];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(larriveeRaw)
      .scale(97.2672);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/laskowski.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = laskowskiRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function laskowskiRaw(lambda, phi) {
  var lambda2 = lambda * lambda, phi2 = phi * phi;
  return [
    lambda * (0.975534 + phi2 * (-0.119161 + lambda2 * -0.0143059 + phi2 * -0.0547009)),
    phi * (1.00384 + lambda2 * (0.0802894 + phi2 * -0.02855 + lambda2 * 0.000199025) + phi2 * (0.0998909 + phi2 * -0.0491032))
  ];
}

laskowskiRaw.invert = function(x, y) {
  var lambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */],
      phi = y / 2,
      i = 50;
  do {
    var lambda2 = lambda * lambda,
        phi2 = phi * phi,
        lambdaPhi = lambda * phi,
        fx = lambda * (0.975534 + phi2 * (-0.119161 + lambda2 * -0.0143059 + phi2 * -0.0547009)) - x,
        fy = phi * (1.00384 + lambda2 * (0.0802894 + phi2 * -0.02855 + lambda2 * 0.000199025) + phi2 * (0.0998909 + phi2 * -0.0491032)) - y,
        deltaxDeltaLambda = 0.975534 - phi2 * (0.119161 + 3 * lambda2 * 0.0143059 + phi2 * 0.0547009),
        deltaxDeltaPhi = -lambdaPhi * (2 * 0.119161 + 4 * 0.0547009 * phi2 + 2 * 0.0143059 * lambda2),
        deltayDeltaLambda = lambdaPhi * (2 * 0.0802894 + 4 * 0.000199025 * lambda2 + 2 * -0.02855 * phi2),
        deltayDeltaPhi = 1.00384 + lambda2 * (0.0802894 + 0.000199025 * lambda2) + phi2 * (3 * (0.0998909 - 0.02855 * lambda2) - 5 * 0.0491032 * phi2),
        denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda,
        deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator,
        deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    lambda -= deltaLambda, phi -= deltaPhi;
  } while ((Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(deltaLambda) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(deltaPhi) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) && --i > 0);
  return i && [lambda, phi];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(laskowskiRaw)
      .scale(139.98);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/littrow.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = littrowRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function littrowRaw(lambda, phi) {
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda)
  ];
}

littrowRaw.invert = function(x, y) {
  var x2 = x * x,
      y2 = y * y,
      y2_1 = y2 + 1,
      cosPhi = x
          ? __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])((y2_1 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(x2 * x2 + 2 * x2 * (y2 - 1) + y2_1 * y2_1)) / x2 + 1)
          : 1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(y2_1);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x * cosPhi),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(cosPhi)
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(littrowRaw)
      .scale(144.049)
      .clipAngle(90 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/loximuthal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = loximuthalRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__parallel1__ = __webpack_require__("./node_modules/d3-geo-projection/src/parallel1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function loximuthalRaw(phi0) {
  var cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi0),
      tanPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] + phi0 / 2);

  function forward(lambda, phi) {
    var y = phi - phi0,
        x = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] ? lambda * cosPhi0
            : Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x = __WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] + phi / 2) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]
            ? 0 : lambda * y / Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(x) / tanPhi0);
    return [x, y];
  }

  forward.invert = function(x, y) {
    var lambda,
        phi = y + phi0;
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] ? x / cosPhi0
          : (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda = __WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] + phi / 2) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) ? 0
          : x * Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(lambda) / tanPhi0) / y,
      phi
    ];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__parallel1__["a" /* default */])(loximuthalRaw)
      .parallel(40)
      .scale(158.837);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/math.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return abs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return atan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return atan2; });
/* unused harmony export ceil */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return cos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return exp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return floor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return pow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return round; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return sign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return sin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return tan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return epsilon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return epsilon2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return pi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return halfPi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return quarterPi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return sqrt1_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return sqrt2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return sqrtPi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return tau; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return degrees; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return radians; });
/* harmony export (immutable) */ __webpack_exports__["z"] = sinci;
/* harmony export (immutable) */ __webpack_exports__["e"] = asin;
/* harmony export (immutable) */ __webpack_exports__["b"] = acos;
/* harmony export (immutable) */ __webpack_exports__["B"] = sqrt;
/* harmony export (immutable) */ __webpack_exports__["G"] = tanh;
/* harmony export (immutable) */ __webpack_exports__["A"] = sinh;
/* harmony export (immutable) */ __webpack_exports__["i"] = cosh;
/* harmony export (immutable) */ __webpack_exports__["d"] = arsinh;
/* harmony export (immutable) */ __webpack_exports__["c"] = arcosh;
var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var ceil = Math.ceil;
var cos = Math.cos;
var exp = Math.exp;
var floor = Math.floor;
var log = Math.log;
var max = Math.max;
var min = Math.min;
var pow = Math.pow;
var round = Math.round;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sin = Math.sin;
var tan = Math.tan;

var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var sqrt1_2 = Math.SQRT1_2;
var sqrt2 = sqrt(2);
var sqrtPi = sqrt(pi);
var tau = pi * 2;
var degrees = 180 / pi;
var radians = pi / 180;

function sinci(x) {
  return x ? x / Math.sin(x) : 1;
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function sqrt(x) {
  return x > 0 ? Math.sqrt(x) : 0;
}

function tanh(x) {
  x = exp(2 * x);
  return (x - 1) / (x + 1);
}

function sinh(x) {
  return (exp(x) - exp(-x)) / 2;
}

function cosh(x) {
  return (exp(x) + exp(-x)) / 2;
}

function arsinh(x) {
  return log(x + sqrt(x * x + 1));
}

function arcosh(x) {
  return log(x + sqrt(x * x - 1));
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/miller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = millerRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function millerRaw(lambda, phi) {
  return [lambda, 1.25 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["p" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] + 0.4 * phi))];
}

millerRaw.invert = function(x, y) {
  return [x, 2.5 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["m" /* exp */])(0.8 * y)) - 0.625 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(millerRaw)
      .scale(108.318);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/modifiedStereographic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["g"] = modifiedStereographicRaw;
/* harmony export (immutable) */ __webpack_exports__["b"] = modifiedStereographicAlaska;
/* harmony export (immutable) */ __webpack_exports__["c"] = modifiedStereographicGs48;
/* harmony export (immutable) */ __webpack_exports__["d"] = modifiedStereographicGs50;
/* harmony export (immutable) */ __webpack_exports__["f"] = modifiedStereographicMiller;
/* harmony export (immutable) */ __webpack_exports__["e"] = modifiedStereographicLee;
/* harmony export (immutable) */ __webpack_exports__["a"] = modifiedStereographic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function modifiedStereographicRaw(C) {
  var m = C.length - 1;

  function forward(lambda, phi) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        k = 2 / (1 + cosPhi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda)),
        zr = k * cosPhi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
        zi = k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
        i = m,
        w = C[i],
        ar = w[0],
        ai = w[1],
        t;
    while (--i >= 0) {
      w = C[i];
      ar = w[0] + zr * (t = ar) - zi * ai;
      ai = w[1] + zr * ai + zi * t;
    }
    ar = zr * (t = ar) - zi * ai;
    ai = zr * ai + zi * t;
    return [ar, ai];
  }

  forward.invert = function(x, y) {
    var i = 20,
        zr = x,
        zi = y;
    do {
      var j = m,
          w = C[j],
          ar = w[0],
          ai = w[1],
          br = 0,
          bi = 0,
          t;

      while (--j >= 0) {
        w = C[j];
        br = ar + zr * (t = br) - zi * bi;
        bi = ai + zr * bi + zi * t;
        ar = w[0] + zr * (t = ar) - zi * ai;
        ai = w[1] + zr * ai + zi * t;
      }
      br = ar + zr * (t = br) - zi * bi;
      bi = ai + zr * bi + zi * t;
      ar = zr * (t = ar) - zi * ai - x;
      ai = zr * ai + zi * t - y;

      var denominator = br * br + bi * bi, deltar, deltai;
      zr -= deltar = (ar * br + ai * bi) / denominator;
      zi -= deltai = (ai * br - ar * bi) / denominator;
    } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(deltar) + Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(deltai) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] * __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);

    if (i) {
      var rho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(zr * zr + zi * zi),
          c = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(rho * 0.5),
          sinc = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(c);
      return [Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(zr * sinc, rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(c)), rho ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(zi * sinc / rho) : 0];
    }
  };

  return forward;
}

var alaska = [[0.9972523, 0], [0.0052513, -0.0041175], [0.0074606, 0.0048125], [-0.0153783, -0.1968253], [0.0636871, -0.1408027], [0.3660976, -0.2937382]],
    gs48 = [[0.98879, 0], [0, 0], [-0.050909, 0], [0, 0], [0.075528, 0]],
    gs50 = [[0.9842990, 0], [0.0211642, 0.0037608], [-0.1036018, -0.0575102], [-0.0329095, -0.0320119], [0.0499471, 0.1223335], [0.0260460, 0.0899805], [0.0007388, -0.1435792], [0.0075848, -0.1334108], [-0.0216473, 0.0776645], [-0.0225161, 0.0853673]],
    miller = [[0.9245, 0], [0, 0], [0.01943, 0]],
    lee = [[0.721316, 0], [0, 0], [-0.00881625, -0.00617325]];

function modifiedStereographicAlaska() {
  return modifiedStereographic(alaska, [152, -64])
      .scale(1500)
      .center([-160.908, 62.4864])
      .clipAngle(25);
}

function modifiedStereographicGs48() {
  return modifiedStereographic(gs48, [95, -38])
      .scale(1000)
      .clipAngle(55)
      .center([-96.5563, 38.8675]);
}

function modifiedStereographicGs50() {
  return modifiedStereographic(gs50, [120, -45])
      .scale(359.513)
      .clipAngle(55)
      .center([-117.474, 53.0628]);
}

function modifiedStereographicMiller() {
  return modifiedStereographic(miller, [-20, -18])
      .scale(209.091)
      .center([20, 16.7214])
      .clipAngle(82);
}

function modifiedStereographicLee() {
  return modifiedStereographic(lee, [165, 10])
      .scale(250)
      .clipAngle(130)
      .center([-165, -10]);
}

function modifiedStereographic(coefficients, rotate) {
  var p = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(modifiedStereographicRaw(coefficients)).rotate(rotate).clipAngle(90),
      r = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoRotation"])(rotate),
      center = p.center;

  delete p.rotate;

  p.center = function(_) {
    return arguments.length ? center(r(_)) : r.invert(center());
  };

  return p;
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/mollweide.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = mollweideBromleyTheta;
/* harmony export (immutable) */ __webpack_exports__["b"] = mollweideBromleyRaw;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return mollweideRaw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function mollweideBromleyTheta(cp, phi) {
  var cpsinPhi = cp * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi), i = 30, delta;
  do phi -= delta = (phi + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi) - cpsinPhi) / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi));
  while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  return phi / 2;
}

function mollweideBromleyRaw(cx, cy, cp) {

  function forward(lambda, phi) {
    return [cx * lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi = mollweideBromleyTheta(cp, phi)), cy * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)];
  }

  forward.invert = function(x, y) {
    return y = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y / cy), [x / (cx * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y)), Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((2 * y + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(2 * y)) / cp)];
  };

  return forward;
}

var mollweideRaw = mollweideBromleyRaw(__WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */] / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */], __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */], __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(mollweideRaw)
      .scale(169.529);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/mtFlatPolarParabolic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mtFlatPolarParabolicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



var sqrt6 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(6),
    sqrt7 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(7);

function mtFlatPolarParabolicRaw(lambda, phi) {
  var theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(7 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi) / (3 * sqrt6));
  return [
    sqrt6 * lambda * (2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(2 * theta / 3) - 1) / sqrt7,
    9 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta / 3) / sqrt7
  ];
}

mtFlatPolarParabolicRaw.invert = function(x, y) {
  var theta = 3 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y * sqrt7 / 9);
  return [
    x * sqrt7 / (sqrt6 * (2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(2 * theta / 3) - 1)),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta) * 3 * sqrt6 / 7)
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(mtFlatPolarParabolicRaw)
      .scale(164.859);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/mtFlatPolarQuartic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mtFlatPolarQuarticRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function mtFlatPolarQuarticRaw(lambda, phi) {
  var k = (1 + __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */]) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
      theta = phi;
  for (var i = 0, delta; i < 25; i++) {
    theta -= delta = (Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta / 2) + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta) - k) / (0.5 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta / 2) + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta));
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) break;
  }
  return [
    lambda * (1 + 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta / 2)) / (3 * __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */]),
    2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(3) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta / 2) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 + __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */])
  ];
}

mtFlatPolarQuarticRaw.invert = function(x, y) {
  var sinTheta_2 = y * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 + __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */]) / (2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(3)),
      theta = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sinTheta_2);
  return [
    3 * __WEBPACK_IMPORTED_MODULE_1__math__["D" /* sqrt2 */] * x / (1 + 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta / 2)),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((sinTheta_2 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta)) / (1 + __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */]))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(mtFlatPolarQuarticRaw)
      .scale(188.209);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/mtFlatPolarSinusoidal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mtFlatPolarSinusoidalRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function mtFlatPolarSinusoidalRaw(lambda, phi) {
  var A = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(6 / (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])),
      k = (1 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
      theta = phi / 2;
  for (var i = 0, delta; i < 25; i++) {
    theta -= delta = (theta / 2 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta) - k) / (0.5 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta));
    if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) break;
  }
  return [
    A * (0.5 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta)) * lambda / 1.5,
    A * theta
  ];
}

mtFlatPolarSinusoidalRaw.invert = function(x, y) {
  var A = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(6 / (4 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])),
      theta = y / A;
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(theta) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) theta = theta < 0 ? -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] : __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */];
  return [
    1.5 * x / (A * (0.5 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta))),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])((theta / 2 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(theta)) / (1 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(mtFlatPolarSinusoidalRaw)
      .scale(166.518);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/naturalEarth.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = naturalEarthRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function naturalEarthRaw(lambda, phi) {
  var phi2 = phi * phi, phi4 = phi2 * phi2;
  return [
    lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
    phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
  ];
}

naturalEarthRaw.invert = function(x, y) {
  var phi = y, i = 25, delta;
  do {
    var phi2 = phi * phi, phi4 = phi2 * phi2;
    phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) /
        (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
  } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  return [
    x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
    phi
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(naturalEarthRaw)
      .scale(175.295);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/nellHammer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = nellHammerRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function nellHammerRaw(lambda, phi) {
  return [
    lambda * (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi)) / 2,
    2 * (phi - Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi / 2))
  ];
}

nellHammerRaw.invert = function(x, y) {
  var p = y / 2;
  for (var i = 0, delta = Infinity; i < 10 && Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]; ++i) {
    var c = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y / 2);
    y -= delta = (y - Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(y / 2) - p) / (1 - 0.5 / (c * c));
  }
  return [
    2 * x / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y)),
    y
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(nellHammerRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/noop.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function() {});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/parallel1.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



/* harmony default export */ __webpack_exports__["a"] = (function(projectAt) {
  var phi0 = 0,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(projectAt),
      p = m(phi0);

  p.parallel = function(_) {
    return arguments.length ? m(phi0 = _ * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]) : phi0 * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
  };

  return p;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/patterson.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = pattersonRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



// Based on Java implementation by Bojan Savric.
// https://github.com/OSUCartography/JMapProjLib/blob/master/src/com/jhlabs/map/proj/PattersonProjection.java

var pattersonK1 = 1.0148,
    pattersonK2 = 0.23185,
    pattersonK3 = -0.14499,
    pattersonK4 = 0.02406,
    pattersonC1 = pattersonK1,
    pattersonC2 = 5 * pattersonK2,
    pattersonC3 = 7 * pattersonK3,
    pattersonC4 = 9 * pattersonK4,
    pattersonYmax = 1.790857183;

function pattersonRaw(lambda, phi) {
  var phi2 = phi * phi;
  return [
    lambda,
    phi * (pattersonK1 + phi2 * phi2 * (pattersonK2 + phi2 * (pattersonK3 + pattersonK4 * phi2)))
  ];
}

pattersonRaw.invert = function(x, y) {
  if (y > pattersonYmax) y = pattersonYmax;
  else if (y < -pattersonYmax) y = -pattersonYmax;
  var yc = y, delta;

  do { // Newton-Raphson
    var y2 = yc * yc;
    yc -= delta = ((yc * (pattersonK1 + y2 * y2 * (pattersonK2 + y2 * (pattersonK3 + pattersonK4 * y2)))) - y) / (pattersonC1 + y2 * y2 * (pattersonC2 + y2 * (pattersonC3 + pattersonC4 * y2)));
  } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]);

  return [x, yc];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(pattersonRaw)
      .scale(139.319);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyconic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = polyconicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function polyconicRaw(lambda, phi) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [lambda, 0];
  var tanPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi),
      k = lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(k) / tanPhi,
    phi + (1 - Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(k)) / tanPhi
  ];
}

polyconicRaw.invert = function(x, y) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [x, 0];
  var k = x * x + y * y,
      phi = y * 0.5,
      i = 10, delta;
  do {
    var tanPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi),
        secPhi = 1 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        j = k - 2 * y * phi + phi * phi;
    phi -= delta = (tanPhi * j + 2 * (phi - y)) / (2 + j * secPhi * secPhi + 2 * (phi - y) * tanPhi);
  } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  tanPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi);
  return [
    (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) < Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi + 1 / tanPhi) ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(x * tanPhi) : Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x * tanPhi)) + __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */])) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
    phi
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(polyconicRaw)
      .scale(103.74);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyhedral/butterfly.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__octahedron__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/octahedron.js");





/* harmony default export */ __webpack_exports__["a"] = (function(faceProjection) {

  faceProjection = faceProjection || function(face) {
    var c = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoCentroid"])({type: "MultiPoint", coordinates: face});
    return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoGnomonic"])().scale(1).translate([0, 0]).rotate([-c[0], -c[1]]);
  };

  var faces = __WEBPACK_IMPORTED_MODULE_3__octahedron__["a" /* default */].map(function(face) {
    return {face: face, project: faceProjection(face)};
  });

  [-1, 0, 0, 1, 0, 1, 4, 5].forEach(function(d, i) {
    var node = faces[d];
    node && (node.children || (node.children = [])).push(faces[i]);
  });

  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(faces[0], function(lambda, phi) {
        return faces[lambda < -__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 2 ? phi < 0 ? 6 : 4
            : lambda < 0 ? phi < 0 ? 2 : 0
            : lambda < __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 2 ? phi < 0 ? 3 : 1
            : phi < 0 ? 7 : 5];
      })
      .scale(101.858)
      .center([0, 45]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyhedral/collignon.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__collignon__ = __webpack_require__("./node_modules/d3-geo-projection/src/collignon.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__octahedron__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/octahedron.js");






var kx = 2 / Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(3);

function collignonK(a, b) {
  var p = Object(__WEBPACK_IMPORTED_MODULE_1__collignon__["a" /* collignonRaw */])(a, b);
  return [p[0] * kx, p[1]];
}

collignonK.invert = function(x,y) {
  return __WEBPACK_IMPORTED_MODULE_1__collignon__["a" /* collignonRaw */].invert(x / kx, y);
};

/* harmony default export */ __webpack_exports__["a"] = (function(faceProjection) {

  faceProjection = faceProjection || function(face) {
    var c = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoCentroid"])({type: "MultiPoint", coordinates: face});
    return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(collignonK).translate([0, 0]).scale(1).rotate(c[1] > 0 ? [-c[0], 0] : [180 - c[0], 180]);
  };

  var faces = __WEBPACK_IMPORTED_MODULE_4__octahedron__["a" /* default */].map(function(face) {
    return {face: face, project: faceProjection(face)};
  });

  [-1, 0, 0, 1, 0, 1, 4, 5].forEach(function(d, i) {
    var node = faces[d];
    node && (node.children || (node.children = [])).push(faces[i]);
  });

  return Object(__WEBPACK_IMPORTED_MODULE_3__index__["a" /* default */])(faces[0], function(lambda, phi) {
        return faces[lambda < -__WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */] / 2 ? phi < 0 ? 6 : 4
            : lambda < 0 ? phi < 0 ? 2 : 0
            : lambda < __WEBPACK_IMPORTED_MODULE_2__math__["s" /* pi */] / 2 ? phi < 0 ? 3 : 1
            : phi < 0 ? 7 : 5];
      })
      .scale(121.906)
      .center([0, 48.5904]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyhedral/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__matrix__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/matrix.js");




// Creates a polyhedral projection.
//  * root: a spanning tree of polygon faces.  Nodes are automatically
//    augmented with a transform matrix.
//  * face: a function that returns the appropriate node for a given {lambda, phi}
//    point (radians).
//  * r: rotation angle for final polyhedral net.  Defaults to -pi / 6 (for
//    butterflies).
/* harmony default export */ __webpack_exports__["a"] = (function(root, face, r) {

  r = r == null ? -__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 6 : r; // TODO automate

  recurse(root, {transform: [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(r), Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(r), 0,
    -Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(r), Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(r), 0
  ]});

  function recurse(node, parent) {
    node.edges = faceEdges(node.face);
    // Find shared edge.
    if (parent.face) {
      var shared = node.shared = sharedEdge(node.face, parent.face),
          m = Object(__WEBPACK_IMPORTED_MODULE_2__matrix__["a" /* default */])(shared.map(parent.project), shared.map(node.project));
      node.transform = parent.transform ? Object(__WEBPACK_IMPORTED_MODULE_2__matrix__["c" /* multiply */])(parent.transform, m) : m;
      // Replace shared edge in parent edges array.
      var edges = parent.edges;
      for (var i = 0, n = edges.length; i < n; ++i) {
        if (pointEqual(shared[0], edges[i][1]) && pointEqual(shared[1], edges[i][0])) edges[i] = node;
        if (pointEqual(shared[0], edges[i][0]) && pointEqual(shared[1], edges[i][1])) edges[i] = node;
      }
      edges = node.edges;
      for (i = 0, n = edges.length; i < n; ++i) {
        if (pointEqual(shared[0], edges[i][0]) && pointEqual(shared[1], edges[i][1])) edges[i] = parent;
        if (pointEqual(shared[0], edges[i][1]) && pointEqual(shared[1], edges[i][0])) edges[i] = parent;
      }
    } else {
      node.transform = parent.transform;
    }
    if (node.children) {
      node.children.forEach(function(child) {
        recurse(child, node);
      });
    }
    return node;
  }

  function forward(lambda, phi) {
    var node = face(lambda, phi),
        point = node.project([lambda * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */], phi * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]]),
        t;
    if (t = node.transform) {
      return [
        t[0] * point[0] + t[1] * point[1] + t[2],
        -(t[3] * point[0] + t[4] * point[1] + t[5])
      ];
    }
    point[1] = -point[1];
    return point;
  }

  // Naive inverse!  A faster solution would use bounding boxes, or even a
  // polygonal quadtree.
  if (hasInverse(root)) forward.invert = function(x, y) {
    var coordinates = faceInvert(root, [x, -y]);
    return coordinates && (coordinates[0] *= __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */], coordinates[1] *= __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */], coordinates);
  };

  function faceInvert(node, coordinates) {
    var invert = node.project.invert,
        t = node.transform,
        point = coordinates;
    if (t) {
      t = Object(__WEBPACK_IMPORTED_MODULE_2__matrix__["b" /* inverse */])(t);
      point = [
        t[0] * point[0] + t[1] * point[1] + t[2],
        (t[3] * point[0] + t[4] * point[1] + t[5])
      ];
    }
    if (invert && node === faceDegrees(p = invert(point))) return p;
    var p,
        children = node.children;
    for (var i = 0, n = children && children.length; i < n; ++i) {
      if (p = faceInvert(children[i], coordinates)) return p;
    }
  }

  function faceDegrees(coordinates) {
    return face(coordinates[0] * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */], coordinates[1] * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]);
  }

  var proj = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(forward),
      stream_ = proj.stream;

  proj.stream = function(stream) {
    var rotate = proj.rotate(),
        rotateStream = stream_(stream),
        sphereStream = (proj.rotate([0, 0]), stream_(stream));
    proj.rotate(rotate);
    rotateStream.sphere = function() {
      sphereStream.polygonStart();
      sphereStream.lineStart();
      outline(sphereStream, root);
      sphereStream.lineEnd();
      sphereStream.polygonEnd();
    };
    return rotateStream;
  };

  return proj;
});

function outline(stream, node, parent) {
  var point,
      edges = node.edges,
      n = edges.length,
      edge,
      multiPoint = {type: "MultiPoint", coordinates: node.face},
      notPoles = node.face.filter(function(d) { return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(d[1]) !== 90; }),
      b = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoBounds"])({type: "MultiPoint", coordinates: notPoles}),
      inside = false,
      j = -1,
      dx = b[1][0] - b[0][0];
  // TODO
  var c = dx === 180 || dx === 360
      ? [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2]
      : Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoCentroid"])(multiPoint);
  // First find the shared edge…
  if (parent) while (++j < n) {
    if (edges[j] === parent) break;
  }
  ++j;
  for (var i = 0; i < n; ++i) {
    edge = edges[(i + j) % n];
    if (Array.isArray(edge)) {
      if (!inside) {
        stream.point((point = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoInterpolate"])(edge[0], c)(__WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]))[0], point[1]);
        inside = true;
      }
      stream.point((point = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoInterpolate"])(edge[1], c)(__WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]))[0], point[1]);
    } else {
      inside = false;
      if (edge !== parent) outline(stream, edge, node);
    }
  }
}

// Tests equality of two spherical points.
function pointEqual(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

// Finds a shared edge given two clockwise polygons.
function sharedEdge(a, b) {
  var x, y, n = a.length, found = null;
  for (var i = 0; i < n; ++i) {
    x = a[i];
    for (var j = b.length; --j >= 0;) {
      y = b[j];
      if (x[0] === y[0] && x[1] === y[1]) {
        if (found) return [found, x];
        found = x;
      }
    }
  }
}

// Converts an array of n face vertices to an array of n + 1 edges.
function faceEdges(face) {
  var n = face.length,
      edges = [];
  for (var a = face[n - 1], i = 0; i < n; ++i) edges.push([a, a = face[i]]);
  return edges;
}

function hasInverse(node) {
  return node.project.invert || node.children && node.children.some(hasInverse);
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyhedral/matrix.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["c"] = multiply;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");


// Note: 6-element arrays are used to denote the 3x3 affine transform matrix:
// [a, b, c,
//  d, e, f,
//  0, 0, 1] - this redundant row is left out.

// Transform matrix for [a0, a1] -> [b0, b1].
/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var u = subtract(a[1], a[0]),
      v = subtract(b[1], b[0]),
      phi = angle(u, v),
      s = length(u) / length(v);

  return multiply([
    1, 0, a[0][0],
    0, 1, a[0][1]
  ], multiply([
    s, 0, 0,
    0, s, 0
  ], multiply([
    Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi), Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi), 0,
    -Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi), Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi), 0
  ], [
    1, 0, -b[0][0],
    0, 1, -b[0][1]
  ])));
});

// Inverts a transform matrix.
function inverse(m) {
  var k = 1 / (m[0] * m[4] - m[1] * m[3]);
  return [
    k * m[4], -k * m[1], k * (m[1] * m[5] - m[2] * m[4]),
    -k * m[3], k * m[0], k * (m[2] * m[3] - m[0] * m[5])
  ];
}

// Multiplies two 3x2 matrices.
function multiply(a, b) {
  return [
    a[0] * b[0] + a[1] * b[3],
    a[0] * b[1] + a[1] * b[4],
    a[0] * b[2] + a[1] * b[5] + a[2],
    a[3] * b[0] + a[4] * b[3],
    a[3] * b[1] + a[4] * b[4],
    a[3] * b[2] + a[4] * b[5] + a[5]
  ];
}

// Subtracts 2D vectors.
function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

// Magnitude of a 2D vector.
function length(v) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__math__["B" /* sqrt */])(v[0] * v[0] + v[1] * v[1]);
}

// Angle between two 2D vectors.
function angle(a, b) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* atan2 */])(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]);
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyhedral/octahedron.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// TODO generate on-the-fly to avoid external modification.
var octahedron = [
  [0, 90],
  [-90, 0], [0, 0], [90, 0], [180, 0],
  [0, -90]
];

/* harmony default export */ __webpack_exports__["a"] = ([
  [0, 2, 1],
  [0, 3, 2],
  [5, 1, 2],
  [5, 2, 3],
  [0, 1, 4],
  [0, 4, 3],
  [5, 4, 1],
  [5, 3, 4]
].map(function(face) {
  return face.map(function(i) {
    return octahedron[i];
  });
}));


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/polyhedral/waterman.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__octahedron__ = __webpack_require__("./node_modules/d3-geo-projection/src/polyhedral/octahedron.js");





/* harmony default export */ __webpack_exports__["a"] = (function(faceProjection) {

  faceProjection = faceProjection || function(face) {
    var c = face.length === 6 ? Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoCentroid"])({type: "MultiPoint", coordinates: face}) : face[0];
    return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoGnomonic"])().scale(1).translate([0, 0]).rotate([-c[0], -c[1]]);
  };

  var w5 = __WEBPACK_IMPORTED_MODULE_3__octahedron__["a" /* default */].map(function(face) {
    var xyz = face.map(cartesian),
        n = xyz.length,
        a = xyz[n - 1],
        b,
        hexagon = [];
    for (var i = 0; i < n; ++i) {
      b = xyz[i];
      hexagon.push(spherical([
        a[0] * 0.9486832980505138 + b[0] * 0.31622776601683794,
        a[1] * 0.9486832980505138 + b[1] * 0.31622776601683794,
        a[2] * 0.9486832980505138 + b[2] * 0.31622776601683794
      ]), spherical([
        b[0] * 0.9486832980505138 + a[0] * 0.31622776601683794,
        b[1] * 0.9486832980505138 + a[1] * 0.31622776601683794,
        b[2] * 0.9486832980505138 + a[2] * 0.31622776601683794
      ]));
      a = b;
    }
    return hexagon;
  });

  var cornerNormals = [];

  var parents = [-1, 0, 0, 1, 0, 1, 4, 5];

  w5.forEach(function(hexagon, j) {
    var face = __WEBPACK_IMPORTED_MODULE_3__octahedron__["a" /* default */][j],
        n = face.length,
        normals = cornerNormals[j] = [];
    for (var i = 0; i < n; ++i) {
      w5.push([
        face[i],
        hexagon[(i * 2 + 2) % (2 * n)],
        hexagon[(i * 2 + 1) % (2 * n)]
      ]);
      parents.push(j);
      normals.push(cross(
        cartesian(hexagon[(i * 2 + 2) % (2 * n)]),
        cartesian(hexagon[(i * 2 + 1) % (2 * n)])
      ));
    }
  });

  var faces = w5.map(function(face) {
    return {
      project: faceProjection(face),
      face: face
    };
  });

  parents.forEach(function(d, i) {
    var parent = faces[d];
    parent && (parent.children || (parent.children = [])).push(faces[i]);
  });

  function face(lambda, phi) {
    var cosphi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        p = [cosphi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda), cosphi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda), Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)];

    var hexagon = lambda < -__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 2 ? phi < 0 ? 6 : 4
        : lambda < 0 ? phi < 0 ? 2 : 0
        : lambda < __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 2 ? phi < 0 ? 3 : 1
        : phi < 0 ? 7 : 5;

    var n = cornerNormals[hexagon];

    return faces[dot(n[0], p) < 0 ? 8 + 3 * hexagon
        : dot(n[1], p) < 0 ? 8 + 3 * hexagon + 1
        : dot(n[2], p) < 0 ? 8 + 3 * hexagon + 2
        : hexagon];
  }

  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(faces[0], face)
      .scale(110.625)
      .center([0,45]);
});

function dot(a, b) {
  for (var i = 0, n = a.length, s = 0; i < n; ++i) s += a[i] * b[i];
  return s;
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

// Converts 3D Cartesian to spherical coordinates (degrees).
function spherical(cartesian) {
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(cartesian[1], cartesian[0]) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */],
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["q" /* max */])(-1, Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(1, cartesian[2]))) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]
  ];
}

// Converts spherical coordinates (degrees) to 3D Cartesian.
function cartesian(coordinates) {
  var lambda = coordinates[0] * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */],
      phi = coordinates[1] * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */],
      cosphi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi);
  return [
    cosphi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda),
    cosphi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)
  ];
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/project/clockwise.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(ring) {
  if ((n = ring.length) < 4) return false;
  var i = 0,
      n,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  return area <= 0;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/project/contains.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(ring, point) {
  var x = point[0],
      y = point[1],
      contains = false;
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1],
        pj = ring[j], xj = pj[0], yj = pj[1];
    if (((yi > y) ^ (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) contains = !contains;
  }
  return contains;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/project/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__noop__ = __webpack_require__("./node_modules/d3-geo-projection/src/noop.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clockwise__ = __webpack_require__("./node_modules/d3-geo-projection/src/project/clockwise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contains__ = __webpack_require__("./node_modules/d3-geo-projection/src/project/contains.js");





/* harmony default export */ __webpack_exports__["a"] = (function(object, projection) {
  var stream = projection.stream, project;
  if (!stream) throw new Error("invalid projection");
  switch (object && object.type) {
    case "Feature": project = projectFeature; break;
    case "FeatureCollection": project = projectFeatureCollection; break;
    default: project = projectGeometry; break;
  }
  return project(object, stream);
});

function projectFeatureCollection(o, stream) {
  return {
    type: "FeatureCollection",
    features: o.features.map(function(f) {
      return projectFeature(f, stream);
    })
  };
}

function projectFeature(o, stream) {
  return {
    type: "Feature",
    id: o.id,
    properties: o.properties,
    geometry: projectGeometry(o.geometry, stream)
  };
}

function projectGeometryCollection(o, stream) {
  return {
    type: "GeometryCollection",
    geometries: o.geometries.map(function(o) {
      return projectGeometry(o, stream);
    })
  };
}

function projectGeometry(o, stream) {
  if (!o) return null;
  if (o.type === "GeometryCollection") return projectGeometryCollection(o, stream);
  var sink;
  switch (o.type) {
    case "Point": sink = sinkPoint; break;
    case "MultiPoint": sink = sinkPoint; break;
    case "LineString": sink = sinkLine; break;
    case "MultiLineString": sink = sinkLine; break;
    case "Polygon": sink = sinkPolygon; break;
    case "MultiPolygon": sink = sinkPolygon; break;
    case "Sphere": sink = sinkPolygon; break;
    default: return null;
  }
  Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoStream"])(o, stream(sink));
  return sink.result();
}

var points = [],
    lines = [];

var sinkPoint = {
  point: function(x, y) {
    points.push([x, y]);
  },
  result: function() {
    var result = !points.length ? null
        : points.length < 2 ? {type: "Point", coordinates: points[0]}
        : {type: "MultiPoint", coordinates: points};
    points = [];
    return result;
  }
};

var sinkLine = {
  lineStart: __WEBPACK_IMPORTED_MODULE_1__noop__["a" /* default */],
  point: function(x, y) {
    points.push([x, y]);
  },
  lineEnd: function() {
    if (points.length) lines.push(points), points = [];
  },
  result: function() {
    var result = !lines.length ? null
        : lines.length < 2 ? {type: "LineString", coordinates: lines[0]}
        : {type: "MultiLineString", coordinates: lines};
    lines = [];
    return result;
  }
};

var sinkPolygon = {
  polygonStart: __WEBPACK_IMPORTED_MODULE_1__noop__["a" /* default */],
  lineStart: __WEBPACK_IMPORTED_MODULE_1__noop__["a" /* default */],
  point: function(x, y) {
    points.push([x, y]);
  },
  lineEnd: function() {
    var n = points.length;
    if (n) {
      do points.push(points[0].slice()); while (++n < 4);
      lines.push(points), points = [];
    }
  },
  polygonEnd: __WEBPACK_IMPORTED_MODULE_1__noop__["a" /* default */],
  result: function() {
    if (!lines.length) return null;
    var polygons = [],
        holes = [];

    // https://github.com/d3/d3/issues/1558
    lines.forEach(function(ring) {
      if (Object(__WEBPACK_IMPORTED_MODULE_2__clockwise__["a" /* default */])(ring)) polygons.push([ring]);
      else holes.push(ring);
    });

    holes.forEach(function(hole) {
      var point = hole[0];
      polygons.some(function(polygon) {
        if (Object(__WEBPACK_IMPORTED_MODULE_3__contains__["a" /* default */])(polygon[0], point)) {
          polygon.push(hole);
          return true;
        }
      }) || polygons.push([hole]);
    });

    lines = [];

    return !polygons.length ? null
        : polygons.length > 1 ? {type: "MultiPolygon", coordinates: polygons}
        : {type: "Polygon", coordinates: polygons[0]};
  }
};


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/quantize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(o, digits) {
  if (!(0 <= (digits = +digits) && digits <= 20)) throw new Error("invalid digits");

  function quantizePoint(coordinates) {
    coordinates[0] = +coordinates[0].toFixed(digits);
    coordinates[1] = +coordinates[1].toFixed(digits);
  }

  function quantizePoints(coordinates) {
    coordinates.forEach(quantizePoint);
  }

  function quantizePolygon(coordinates) {
    coordinates.forEach(quantizePoints);
  }

  function quantizeGeometry(o) {
    if (o) switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(quantizeGeometry); break;
      case "Point": quantizePoint(o.coordinates); break;
      case "MultiPoint": case "LineString": quantizePoints(o.coordinates); break;
      case "MultiLineString": case "Polygon": quantizePolygon(o.coordinates); break;
      case "MultiPolygon": o.coordinates.forEach(quantizePolygon); break;
      default: return;
    }
  }

  function quantizeFeature(o) {
    quantizeGeometry(o.geometry);
  }

  if (o) switch (o.type) {
    case "Feature": quantizeFeature(o); break;
    case "FeatureCollection": o.features.forEach(quantizeFeature); break;
    default: quantizeGeometry(o); break;
  }

  return o;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/quincuncial/gringorten.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gringorten__ = __webpack_require__("./node_modules/d3-geo-projection/src/gringorten.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/quincuncial/index.js");



/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__gringorten__["b" /* gringortenRaw */])
      .scale(176.423);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/quincuncial/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



/* harmony default export */ __webpack_exports__["a"] = (function(project) {
  var dx = project(__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */], 0)[0] - project(-__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */], 0)[0];

  function projectQuincuncial(lambda, phi) {
    var t = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) < __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
        p = project(t ? lambda : lambda > 0 ? lambda - __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] : lambda + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */], phi),
        x = (p[0] - p[1]) * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */],
        y = (p[0] + p[1]) * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */];
    if (t) return [x, y];
    var d = dx * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */],
        s = x > 0 ^ y > 0 ? -1 : 1;
    return [s * x - Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * d, s * y - Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * d];
  }

  if (project.invert) projectQuincuncial.invert = function(x0, y0) {
    var x = (x0 + y0) * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */],
        y = (y0 - x0) * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */],
        t = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x) < 0.5 * dx && Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) < 0.5 * dx;

    if (!t) {
      var d = dx * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */],
          s = x > 0 ^ y > 0 ? -1 : 1,
          x1 = -s * (x0 + (y > 0 ? 1 : -1) * d),
          y1 = -s * (y0 + (x > 0 ? 1 : -1) * d);
      x = (-x1 - y1) * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */];
      y = (x1 - y1) * __WEBPACK_IMPORTED_MODULE_1__math__["C" /* sqrt1_2 */];
    }

    var p = project.invert(x, y);
    if (!t) p[0] += x > 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] : -__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */];
    return p;
  };

  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(projectQuincuncial)
      .rotate([-90, -90, 45])
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/quincuncial/peirce.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__guyou__ = __webpack_require__("./node_modules/d3-geo-projection/src/guyou.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo-projection/src/quincuncial/index.js");



/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_0__guyou__["b" /* guyouRaw */])
      .scale(111.48);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/rectangularPolyconic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = rectangularPolyconicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parallel1__ = __webpack_require__("./node_modules/d3-geo-projection/src/parallel1.js");



function rectangularPolyconicRaw(phi0) {
  var sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi0);

  function forward(lambda, phi) {
    var A = sinPhi0 ? Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(lambda * sinPhi0 / 2) / sinPhi0 : lambda / 2;
    if (!phi) return [2 * A, -phi0];
    var E = 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(A * Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi)),
        cotPhi = 1 / Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi);
    return [
      Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(E) * cotPhi,
      phi + (1 - Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(E)) * cotPhi - phi0
    ];
  }

  // TODO return null for points outside outline.
  forward.invert = function(x, y) {
    if (Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(y += phi0) < __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */]) return [sinPhi0 ? 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(sinPhi0 * x / 2) / sinPhi0 : x, 0];
    var k = x * x + y * y,
        phi = 0,
        i = 10, delta;
    do {
      var tanPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi),
          secPhi = 1 / Object(__WEBPACK_IMPORTED_MODULE_0__math__["h" /* cos */])(phi),
          j = k - 2 * y * phi + phi * phi;
      phi -= delta = (tanPhi * j + 2 * (phi - y)) / (2 + j * secPhi * secPhi + 2 * (phi - y) * tanPhi);
    } while (Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_0__math__["k" /* epsilon */] && --i > 0);
    var E = x * (tanPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(phi)),
        A = Object(__WEBPACK_IMPORTED_MODULE_0__math__["F" /* tan */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(y) < Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(phi + 1 / tanPhi) ? Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* asin */])(E) * 0.5 : Object(__WEBPACK_IMPORTED_MODULE_0__math__["b" /* acos */])(E) * 0.5 + __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */] / 4) / Object(__WEBPACK_IMPORTED_MODULE_0__math__["y" /* sin */])(phi);
    return [
      sinPhi0 ? 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["f" /* atan */])(sinPhi0 * A) / sinPhi0 : 2 * A,
      phi
    ];
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__parallel1__["a" /* default */])(rectangularPolyconicRaw)
      .scale(131.215);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/robinson.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = robinsonRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



var K = [
  [0.9986, -0.062],
  [1.0000, 0.0000],
  [0.9986, 0.0620],
  [0.9954, 0.1240],
  [0.9900, 0.1860],
  [0.9822, 0.2480],
  [0.9730, 0.3100],
  [0.9600, 0.3720],
  [0.9427, 0.4340],
  [0.9216, 0.4958],
  [0.8962, 0.5571],
  [0.8679, 0.6176],
  [0.8350, 0.6769],
  [0.7986, 0.7346],
  [0.7597, 0.7903],
  [0.7186, 0.8435],
  [0.6732, 0.8936],
  [0.6213, 0.9394],
  [0.5722, 0.9761],
  [0.5322, 1.0000]
];

K.forEach(function(d) {
  d[1] *= 1.0144;
});

function robinsonRaw(lambda, phi) {
  var i = Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(18, Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) * 36 / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]),
      i0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["n" /* floor */])(i),
      di = i - i0,
      ax = (k = K[i0])[0],
      ay = k[1],
      bx = (k = K[++i0])[0],
      by = k[1],
      cx = (k = K[Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(19, ++i0)])[0],
      cy = k[1],
      k;
  return [
    lambda * (bx + di * (cx - ax) / 2 + di * di * (cx - 2 * bx + ax) / 2),
    (phi > 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] : -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) * (by + di * (cy - ay) / 2 + di * di * (cy - 2 * by + ay) / 2)
  ];
}

robinsonRaw.invert = function(x, y) {
  var yy = y / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      phi = yy * 90,
      i = Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(18, Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi / 5)),
      i0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["q" /* max */])(0, Object(__WEBPACK_IMPORTED_MODULE_1__math__["n" /* floor */])(i));
  do {
    var ay = K[i0][1],
        by = K[i0 + 1][1],
        cy = K[Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(19, i0 + 2)][1],
        u = cy - ay,
        v = cy - 2 * by + ay,
        t = 2 * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(yy) - by) / u,
        c = v / u,
        di = t * (1 - c * t * (1 - 2 * c * t));
    if (di >= 0 || i0 === 1) {
      phi = (y >= 0 ? 5 : -5) * (di + i);
      var j = 50, delta;
      do {
        i = Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(18, Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) / 5);
        i0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["n" /* floor */])(i);
        di = i - i0;
        ay = K[i0][1];
        by = K[i0 + 1][1];
        cy = K[Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(19, i0 + 2)][1];
        phi -= (delta = (y >= 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] : -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) * (by + di * (cy - ay) / 2 + di * di * (cy - 2 * by + ay) / 2) - y) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
      } while (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta) > __WEBPACK_IMPORTED_MODULE_1__math__["l" /* epsilon2 */] && --j > 0);
      break;
    }
  } while (--i0 >= 0);
  var ax = K[i0][0],
      bx = K[i0 + 1][0],
      cx = K[Object(__WEBPACK_IMPORTED_MODULE_1__math__["r" /* min */])(19, i0 + 2)][0];
  return [
    x / (bx + di * (cx - ax) / 2 + di * di * (cx - 2 * bx + ax) / 2),
    phi * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(robinsonRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/satellite.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = satelliteRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function satelliteVerticalRaw(P) {
  function forward(lambda, phi) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
        k = (P - 1) / (P - cosPhi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda));
    return [
      k * cosPhi * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
      k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi)
    ];
  }

  forward.invert = function(x, y) {
    var rho2 = x * x + y * y,
        rho = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(rho2),
        sinc = (P - Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - rho2 * (P + 1) / (P - 1))) / ((P - 1) / rho + rho / (P - 1));
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(x * sinc, rho * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - sinc * sinc)),
      rho ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y * sinc / rho) : 0
    ];
  };

  return forward;
}

function satelliteRaw(P, omega) {
  var vertical = satelliteVerticalRaw(P);
  if (!omega) return vertical;
  var cosOmega = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(omega),
      sinOmega = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(omega);

  function forward(lambda, phi) {
    var coordinates = vertical(lambda, phi),
        y = coordinates[1],
        A = y * sinOmega / (P - 1) + cosOmega;
    return [
      coordinates[0] * cosOmega / A,
      y / A
    ];
  }

  forward.invert = function(x, y) {
    var k = (P - 1) / (P - 1 - y * sinOmega);
    return vertical.invert(k * x, k * y * cosOmega);
  };

  return forward;
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var distance = 2,
      omega = 0,
      m = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjectionMutator"])(satelliteRaw),
      p = m(distance, omega);

  // As a multiple of radius.
  p.distance = function(_) {
    if (!arguments.length) return distance;
    return m(distance = +_, omega);
  };

  p.tilt = function(_) {
    if (!arguments.length) return omega * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */];
    return m(distance, omega = _ * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]);
  };

  return p
      .scale(432.147)
      .clipAngle(Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(1 / distance) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */] - 1e-6);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/sinuMollweide.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return sinuMollweidePhi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return sinuMollweideY; });
/* harmony export (immutable) */ __webpack_exports__["c"] = sinuMollweideRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sinusoidal__ = __webpack_require__("./node_modules/d3-geo-projection/src/sinusoidal.js");




var sinuMollweidePhi = 0.7109889596207567;

var sinuMollweideY = 0.0528035274542;

function sinuMollweideRaw(lambda, phi) {
  return phi > -sinuMollweidePhi
      ? (lambda = Object(__WEBPACK_IMPORTED_MODULE_1__mollweide__["d" /* mollweideRaw */])(lambda, phi), lambda[1] += sinuMollweideY, lambda)
      : Object(__WEBPACK_IMPORTED_MODULE_2__sinusoidal__["b" /* sinusoidalRaw */])(lambda, phi);
}

sinuMollweideRaw.invert = function(x, y) {
  return y > -sinuMollweidePhi
      ? __WEBPACK_IMPORTED_MODULE_1__mollweide__["d" /* mollweideRaw */].invert(x, y - sinuMollweideY)
      : __WEBPACK_IMPORTED_MODULE_2__sinusoidal__["b" /* sinusoidalRaw */].invert(x, y);
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(sinuMollweideRaw)
      .rotate([-20, -55])
      .scale(164.263)
      .center([0, -5.4036]);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/sinusoidal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = sinusoidalRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function sinusoidalRaw(lambda, phi) {
  return [lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi), phi];
}

sinusoidalRaw.invert = function(x, y) {
  return [x / Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(y), y];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(sinusoidalRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/square.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");


/* harmony default export */ __webpack_exports__["a"] = (function(project) {
  var dx = project(__WEBPACK_IMPORTED_MODULE_0__math__["o" /* halfPi */], 0)[0] - project(-__WEBPACK_IMPORTED_MODULE_0__math__["o" /* halfPi */], 0)[0];

  function projectSquare(lambda, phi) {
    var s = lambda > 0 ? -0.5 : 0.5,
        point = project(lambda + s * __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */], phi);
    point[0] -= s * dx;
    return point;
  }

  if (project.invert) projectSquare.invert = function(x, y) {
    var s = x > 0 ? -0.5 : 0.5,
        location = project.invert(x + s * dx, y),
        lambda = location[0] - s * __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */];
    if (lambda < -__WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */]) lambda += 2 * __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */];
    else if (lambda > __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */]) lambda -= 2 * __WEBPACK_IMPORTED_MODULE_0__math__["s" /* pi */];
    location[0] = lambda;
    return location;
  };

  return projectSquare;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/stitch.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var epsilon = 1e-4,
    epsilonInverse = 1e4,
    x0 = -180, x0e = x0 + epsilon,
    x1 = 180, x1e = x1 - epsilon,
    y0 = -90, y0e = y0 + epsilon,
    y1 = 90, y1e = y1 - epsilon;

function quantize(x) {
  return Math.floor(x * epsilonInverse) / epsilonInverse;
}

function normalizePoint(y) {
  return y === y0 || y === y1
      ? [0, y] // pole
      : [x0, quantize(y)]; // antimeridian
}

function clampPoint(p) {
  if (p[0] <= x0e) p[0] = x0;
  else if (p[0] >= x1e) p[0] = x1;
  if (p[1] <= y0e) p[1] = y0;
  else if (p[1] >= y1e) p[1] = y1;
}

function clampPoints(points) {
  points.forEach(clampPoint);
}

// For each ring, detect where it crosses the antimeridian or pole.
function extractFragments(polygon, fragments) {
  for (var j = 0, m = polygon.length; j < m; ++j) {
    var ring = polygon[j];
    ring.polygon = polygon;

    // By default, assume that this ring doesn’t need any stitching.
    fragments.push(ring);

    for (var i = 0, n = ring.length; i < n; ++i) {
      var point = ring[i],
          x = point[0],
          y = point[1];

      // If this is an antimeridian or polar point…
      if (x <= x0e || x >= x1e || y <= y0e || y >= y1e) {
        clampPoint(point);

        // Advance through any antimeridian or polar points…
        for (var k = i + 1; k < n; ++k) {
          var pointk = ring[k],
              xk = pointk[0],
              yk = pointk[1];
          if (xk > x0e && xk < x1e && yk > y0e && yk < y1e) break;
        }

        // If this was just a single antimeridian or polar point,
        // we don’t need to cut this ring into a fragment;
        // we can just leave it as-is.
        if (k === i + 1) continue;

        // Otherwise, if this is not the first point in the ring,
        // cut the current fragment so that it ends at the current point.
        // The current point is also normalized for later joining.
        if (i) {
          var fragmentBefore = ring.slice(0, i + 1);
          fragmentBefore.polygon = polygon;
          fragmentBefore[fragmentBefore.length - 1] = normalizePoint(y);
          fragments[fragments.length - 1] = fragmentBefore;
        }

        // If the ring started with an antimeridian fragment,
        // we can ignore that fragment entirely.
        else fragments.pop();

        // If the remainder of the ring is an antimeridian fragment,
        // move on to the next ring.
        if (k >= n) break;

        // Otherwise, add the remaining ring fragment and continue.
        fragments.push(ring = ring.slice(k - 1));
        ring[0] = normalizePoint(ring[0][1]);
        ring.polygon = polygon;
        i = -1;
        n = ring.length;
      }
    }
  }
  polygon.length = 0;
}

// Now stitch the fragments back together into rings.
// TODO remove empty polygons.
function stitchFragments(fragments) {
  var i, n = fragments.length;

  // To connect the fragments start-to-end, create a simple index by end.
  var fragmentByStart = {},
      fragmentByEnd = {},
      fragment,
      start,
      startFragment,
      end,
      endFragment;

  // For each fragment…
  for (i = 0; i < n; ++i) {
    fragment = fragments[i];
    start = fragment[0];
    end = fragment[fragment.length - 1];

    // If this fragment is closed, add it as a standalone ring.
    if (start[0] === end[0] && start[1] === end[1]) {
      fragment.polygon.push(fragment);
      fragments[i] = null;
      continue;
    }

    fragment.index = i;
    fragmentByStart[start] = fragmentByEnd[end] = fragment;
  }

  // For each open fragment…
  for (i = 0; i < n; ++i) {
    fragment = fragments[i];
    if (fragment) {
      start = fragment[0];
      end = fragment[fragment.length - 1];
      startFragment = fragmentByEnd[start];
      endFragment = fragmentByStart[end];

      delete fragmentByStart[start];
      delete fragmentByEnd[end];

      // If this fragment is closed, add it as a standalone ring.
      if (start[0] === end[0] && start[1] === end[1]) {
        fragment.polygon.push(fragment);
        continue;
      }

      if (startFragment) {
        delete fragmentByEnd[start];
        delete fragmentByStart[startFragment[0]];
        startFragment.pop(); // drop the shared coordinate
        fragments[startFragment.index] = null;
        fragment = startFragment.concat(fragment);
        fragment.polygon = startFragment.polygon;

        if (startFragment === endFragment) {
          // Connect both ends to this single fragment to create a ring.
          fragment.polygon.push(fragment);
        } else {
          fragment.index = n++;
          fragments.push(fragmentByStart[fragment[0]] = fragmentByEnd[fragment[fragment.length - 1]] = fragment);
        }
      } else if (endFragment) {
        delete fragmentByStart[end];
        delete fragmentByEnd[endFragment[endFragment.length - 1]];
        fragment.pop(); // drop the shared coordinate
        fragment = fragment.concat(endFragment);
        fragment.polygon = endFragment.polygon;
        fragment.index = n++;
        fragments[endFragment.index] = null;
        fragments.push(fragmentByStart[fragment[0]] = fragmentByEnd[fragment[fragment.length - 1]] = fragment);
      } else {
        fragment.push(fragment[0]); // close ring
        fragment.polygon.push(fragment);
      }
    }
  }
}

function stitchFeature(o) {
  stitchGeometry(o.geometry);
}

function stitchGeometry(o) {
  if (!o) return;
  var fragments, i, n;

  switch (o.type) {
    case "GeometryCollection": {
      o.geometries.forEach(stitchGeometry);
      return;
    }
    case "Point": {
      clampPoint(o.coordinates);
      break;
    }
    case "MultiPoint":
    case "LineString": {
      clampPoints(o.coordinates);
      break;
    }
    case "MultiLineString": {
      o.coordinates.forEach(clampPoints);
      break;
    }
    case "Polygon": {
      extractFragments(o.coordinates, fragments = []);
      break;
    }
    case "MultiPolygon": {
      fragments = [], i = -1, n = o.coordinates.length;
      while (++i < n) extractFragments(o.coordinates[i], fragments);
      break;
    }
    default: return;
  }

  stitchFragments(fragments);
}

/* harmony default export */ __webpack_exports__["a"] = (function(o) {
  if (o) switch (o.type) {
    case "Feature": stitchFeature(o); break;
    case "FeatureCollection": o.features.forEach(stitchFeature); break;
    default: stitchGeometry(o); break;
  }
  return o;
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/times.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = timesRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function timesRaw(lambda, phi) {
  var t = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(phi / 2),
      s = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] * t);
  return [
    lambda * (0.74482 - 0.34588 * s * s),
    1.70711 * t
  ];
}

timesRaw.invert = function(x, y) {
  var t = y / 1.70711,
      s = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* quarterPi */] * t);
  return [
    x / (0.74482 - 0.34588 * s * s),
    2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(t)
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(timesRaw)
      .scale(146.153);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/twoPoint.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



// Compute the origin as the midpoint of the two reference points.
// Rotate one of the reference points by the origin.
// Apply the spherical law of sines to compute gamma rotation.
/* harmony default export */ __webpack_exports__["a"] = (function(raw, p0, p1) {
  var i = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoInterpolate"])(p0, p1),
      o = i(0.5),
      a = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoRotation"])([-o[0], -o[1]])(p0),
      b = i.distance / 2,
      y = -Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(a[1] * __WEBPACK_IMPORTED_MODULE_1__math__["v" /* radians */]) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(b)),
      R = [-o[0], -o[1], -(a[0] > 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] - y : y) * __WEBPACK_IMPORTED_MODULE_1__math__["j" /* degrees */]],
      p = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(raw(b)).rotate(R),
      r = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoRotation"])(R),
      center = p.center;

  delete p.rotate;

  p.center = function(_) {
    return arguments.length ? center(r(_)) : r.invert(center());
  };

  return p
      .clipAngle(90);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/twoPointAzimuthal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = twoPointAzimuthalRaw;
/* harmony export (immutable) */ __webpack_exports__["c"] = twoPointAzimuthalUsa;
/* harmony export (immutable) */ __webpack_exports__["a"] = twoPointAzimuthal;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__twoPoint__ = __webpack_require__("./node_modules/d3-geo-projection/src/twoPoint.js");




function twoPointAzimuthalRaw(d) {
  var cosd = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(d);

  function forward(lambda, phi) {
    var coordinates = Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoGnomonicRaw"])(lambda, phi);
    coordinates[0] *= cosd;
    return coordinates;
  }

  forward.invert = function(x, y) {
    return __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoGnomonicRaw"].invert(x / cosd, y);
  };

  return forward;
}

function twoPointAzimuthalUsa() {
  return twoPointAzimuthal([-158, 21.5], [-77, 39])
      .clipAngle(60)
      .scale(400);
}

function twoPointAzimuthal(p0, p1) {
  return Object(__WEBPACK_IMPORTED_MODULE_2__twoPoint__["a" /* default */])(twoPointAzimuthalRaw, p0, p1);
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/twoPointEquidistant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = twoPointEquidistantRaw;
/* harmony export (immutable) */ __webpack_exports__["c"] = twoPointEquidistantUsa;
/* harmony export (immutable) */ __webpack_exports__["a"] = twoPointEquidistant;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__twoPoint__ = __webpack_require__("./node_modules/d3-geo-projection/src/twoPoint.js");




// TODO clip to ellipse
function twoPointEquidistantRaw(z0) {
  if (!(z0 *= 2)) return __WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoAzimuthalEquidistantRaw"];
  var lambdaa = -z0 / 2,
      lambdab = -lambdaa,
      z02 = z0 * z0,
      tanLambda0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(lambdab),
      S = 0.5 / Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambdab);

  function forward(lambda, phi) {
    var za = Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda - lambdaa)),
        zb = Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda - lambdab)),
        ys = phi < 0 ? -1 : 1;
    za *= za, zb *= zb;
    return [
      (za - zb) / (2 * z0),
      ys * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(4 * z02 * zb - (z02 - za + zb) * (z02 - za + zb)) / (2 * z0)
    ];
  }

  forward.invert = function(x, y) {
    var y2 = y * y,
        cosza = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(y2 + (t = x + lambdaa) * t)),
        coszb = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(y2 + (t = x + lambdab) * t)),
        t,
        d;
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(d = cosza - coszb, t = (cosza + coszb) * tanLambda0),
      (y < 0 ? -1 : 1) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(t * t + d * d) * S)
    ];
  };

  return forward;
}

function twoPointEquidistantUsa() {
  return twoPointEquidistant([-158, 21.5], [-77, 39])
      .clipAngle(130)
      .scale(122.571);
}

function twoPointEquidistant(p0, p1) {
  return Object(__WEBPACK_IMPORTED_MODULE_2__twoPoint__["a" /* default */])(twoPointEquidistantRaw, p0, p1);
}


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/vanDerGrinten.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = vanDerGrintenRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function vanDerGrintenRaw(lambda, phi) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [lambda, 0];
  var sinTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]),
      theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sinTheta);
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [0, Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(theta / 2)];
  var cosTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta),
      A = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / lambda - lambda / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / 2,
      A2 = A * A,
      G = cosTheta / (sinTheta + cosTheta - 1),
      P = G * (2 / sinTheta - 1),
      P2 = P * P,
      P2_A2 = P2 + A2,
      G_P2 = G - P2,
      Q = A2 + G;
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(lambda) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (A * G_P2 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(A2 * G_P2 * G_P2 - P2_A2 * (G * G - P2))) / P2_A2,
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (P * Q - A * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])((A2 + 1) * P2_A2 - Q * Q)) / P2_A2
  ];
}

vanDerGrintenRaw.invert = function(x, y) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [x, 0];
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [0, __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(y / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]))];
  var x2 = (x /= __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) * x,
      y2 = (y /= __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) * y,
      x2_y2 = x2 + y2,
      z = x2_y2 * x2_y2,
      c1 = -Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y) * (1 + x2_y2),
      c2 = c1 - 2 * y2 + x2,
      c3 = -2 * c1 + 1 + 2 * y2 + z,
      d = y2 / c3 + (2 * c2 * c2 * c2 / (c3 * c3 * c3) - 9 * c1 * c2 / (c3 * c3)) / 27,
      a1 = (c1 - c2 * c2 / (3 * c3)) / c3,
      m1 = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(-a1 / 3),
      theta1 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["b" /* acos */])(3 * d / (a1 * m1)) / 3;
  return [
    __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (x2_y2 - 1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 + 2 * (x2 - y2) + z)) / (2 * x),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (-m1 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta1 + __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 3) - c2 / (3 * c3))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(vanDerGrintenRaw)
      .scale(79.4183);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/vanDerGrinten2.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = vanDerGrinten2Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function vanDerGrinten2Raw(lambda, phi) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [lambda, 0];
  var sinTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]),
      theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sinTheta);
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [0, Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(theta / 2)];
  var cosTheta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta),
      A = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / lambda - lambda / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / 2,
      A2 = A * A,
      x1 = cosTheta * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 + A2) - A * cosTheta) / (1 + A2 * sinTheta * sinTheta);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(lambda) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * x1,
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - x1 * (2 * A + x1))
  ];
}

vanDerGrinten2Raw.invert = function(x, y) {
  if (!x) return [0, __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(y / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]))];
  var x1 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]),
      A = (1 - x1 * x1 - (y /= __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) * y) / (2 * x1),
      A2 = A * A,
      B = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(A2 + 1);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (B - A),
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(y) * __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])((1 - 2 * A * x1) * (A + B) - x1), Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(B + A + x1)))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(vanDerGrinten2Raw)
      .scale(79.4183);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/vanDerGrinten3.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = vanDerGrinten3Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function vanDerGrinten3Raw(lambda, phi) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [lambda, 0];
  var sinTheta = phi / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      theta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(sinTheta);
  if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */]) return [0, __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(theta / 2)];
  var A = (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / lambda - lambda / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */]) / 2,
      y1 = sinTheta / (1 + Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(theta));
  return [
    __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(lambda) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(A * A + 1 - y1 * y1) - A),
    __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * y1
  ];
}

vanDerGrinten3Raw.invert = function(x, y) {
  if (!y) return [x, 0];
  var y1 = y / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */],
      A = (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (1 - y1 * y1) - x * x) / (2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * x);
  return [
    x ? __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(A * A + 1) - A) : 0,
    __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* atan */])(y1))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(vanDerGrinten3Raw)
        .scale(79.4183);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/vanDerGrinten4.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = vanDerGrinten4Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function vanDerGrinten4Raw(lambda, phi) {
  if (!phi) return [lambda, 0];
  var phi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(phi);
  if (!lambda || phi0 === __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) return [0, phi];
  var B = phi0 / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      B2 = B * B,
      C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)),
      C2 = C * C,
      BC = B * C,
      B_C2 = B2 + C2 + 2 * BC,
      B_3C = B + 3 * C,
      lambda0 = lambda / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      lambda1 = lambda0 + 1 / lambda0,
      D = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda) - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */]) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(lambda1 * lambda1 - 4),
      D2 = D * D,
      F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * (B_3C * B_3C + 4 * C2) + 12 * BC * C2 + 4 * C2 * C2),
      x1 = (D * (B_C2 + C2 - 1) + 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(F)) / (4 * B_C2 + D2);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(lambda) * __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * x1,
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(phi) * __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 + D * Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x1) - x1 * x1)
  ];
}

vanDerGrinten4Raw.invert = function(x, y) {
  var delta;
  if (!x || !y) return [x, y];
  y /= __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */];
  var x1 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * x / __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */],
      D = (x1 * x1 - 1 + 4 * y * y) / Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x1),
      D2 = D * D,
      B = 2 * y,
      i = 50;
  do {
    var B2 = B * B,
        C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)),
        C_ = (3 * B - B2 * B - 10) / (2 * B2 * B),
        C2 = C * C,
        BC = B * C,
        B_C = B + C,
        B_C2 = B_C * B_C,
        B_3C = B + 3 * C,
        F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * (B_3C * B_3C + 4 * C2) + C2 * (12 * BC + 4 * C2)),
        F_ = -2 * B_C * (4 * BC * C2 + (1 - 4 * B2 + 3 * B2 * B2) * (1 + C_) + C2 * (-6 + 14 * B2 - D2 + (-8 + 8 * B2 - 2 * D2) * C_) + BC * (-8 + 12 * B2 + (-10 + 10 * B2 - D2) * C_)),
        sqrtF = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(F),
        f = D * (B_C2 + C2 - 1) + 2 * sqrtF - x1 * (4 * B_C2 + D2),
        f_ = D * (2 * C * C_ + 2 * B_C * (1 + C_)) + F_ / sqrtF - 8 * B_C * (D * (-1 + C2 + B_C2) + 2 * sqrtF) * (1 + C_) / (D2 + 4 * B_C2);
    B -= delta = f / f_;
  } while (delta > __WEBPACK_IMPORTED_MODULE_1__math__["k" /* epsilon */] && --i > 0);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["x" /* sign */])(x) * (Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(D * D + 4) + D) * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] / 4,
    __WEBPACK_IMPORTED_MODULE_1__math__["o" /* halfPi */] * B
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(vanDerGrinten4Raw)
      .scale(127.16);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/wagner4.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return wagner4Raw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mollweide__ = __webpack_require__("./node_modules/d3-geo-projection/src/mollweide.js");




var A = 4 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] + 3 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(3),
    B = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(3) / A);

var wagner4Raw = Object(__WEBPACK_IMPORTED_MODULE_2__mollweide__["b" /* mollweideBromleyRaw */])(B * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(3) / __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */], B, A / 6);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(wagner4Raw)
      .scale(176.84);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/wagner6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = wagner6Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function wagner6Raw(lambda, phi) {
  return [lambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - 3 * phi * phi / (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])), phi];
}

wagner6Raw.invert = function(x, y) {
  return [x / Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - 3 * y * y / (__WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */] * __WEBPACK_IMPORTED_MODULE_1__math__["s" /* pi */])), y];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(wagner6Raw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/wagner7.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = wagner7Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function wagner7Raw(lambda, phi) {
  var s = 0.90631 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi),
      c0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - s * s),
      c1 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(2 / (1 + c0 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda /= 3)));
  return [
    2.66723 * c0 * c1 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda),
    1.24104 * s * c1
  ];
}

wagner7Raw.invert = function(x, y) {
  var t1 = x / 2.66723,
      t2 = y / 1.24104,
      p = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(t1 * t1 + t2 * t2),
      c = 2 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(p / 2);
  return [
    3 * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(x * Object(__WEBPACK_IMPORTED_MODULE_1__math__["F" /* tan */])(c), 2.66723 * p),
    p && Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(y * Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(c) / (1.24104 * 0.90631 * p))
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(wagner7Raw)
      .scale(172.632);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/wiechel.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = wiechelRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");



function wiechelRaw(lambda, phi) {
  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(phi),
      sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda) * cosPhi,
      sin1_Phi = 1 - sinPhi,
      cosLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["h" /* cos */])(lambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda) * cosPhi, -Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(phi))),
      sinLambda = Object(__WEBPACK_IMPORTED_MODULE_1__math__["y" /* sin */])(lambda);
  cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(1 - sinPhi * sinPhi);
  return [
    sinLambda * cosPhi - cosLambda * sin1_Phi,
    -cosLambda * cosPhi - sinLambda * sin1_Phi
  ];
}

wiechelRaw.invert = function(x, y) {
  var w = (x * x + y * y) / -2,
      k = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(-w * (2 + w)),
      b = y * w + x * k,
      a = x * w - y * k,
      D = Object(__WEBPACK_IMPORTED_MODULE_1__math__["B" /* sqrt */])(a * a + b * b);
  return [
    Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* atan2 */])(k * b, D * (1 + w)),
    D ? -Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* asin */])(k * a / D) : 0
  ];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(wiechelRaw)
      .rotate([0, -90, 45])
      .scale(124.75)
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo-projection/src/winkel3.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = winkel3Raw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_geo__ = __webpack_require__("./node_modules/d3-geo/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__aitoff__ = __webpack_require__("./node_modules/d3-geo-projection/src/aitoff.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo-projection/src/math.js");




function winkel3Raw(lambda, phi) {
  var coordinates = Object(__WEBPACK_IMPORTED_MODULE_1__aitoff__["a" /* aitoffRaw */])(lambda, phi);
  return [
    (coordinates[0] + lambda / __WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */]) / 2,
    (coordinates[1] + phi) / 2
  ];
}

winkel3Raw.invert = function(x, y) {
  var lambda = x, phi = y, i = 25;
  do {
    var cosphi = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(phi),
        sinphi = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(phi),
        sin_2phi = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(2 * phi),
        sin2phi = sinphi * sinphi,
        cos2phi = cosphi * cosphi,
        sinlambda = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(lambda),
        coslambda_2 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["h" /* cos */])(lambda / 2),
        sinlambda_2 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["y" /* sin */])(lambda / 2),
        sin2lambda_2 = sinlambda_2 * sinlambda_2,
        C = 1 - cos2phi * coslambda_2 * coslambda_2,
        E = C ? Object(__WEBPACK_IMPORTED_MODULE_2__math__["b" /* acos */])(cosphi * coslambda_2) * Object(__WEBPACK_IMPORTED_MODULE_2__math__["B" /* sqrt */])(F = 1 / C) : F = 0,
        F,
        fx = 0.5 * (2 * E * cosphi * sinlambda_2 + lambda / __WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */]) - x,
        fy = 0.5 * (E * sinphi + phi) - y,
        dxdlambda = 0.5 * F * (cos2phi * sin2lambda_2 + E * cosphi * coslambda_2 * sin2phi) + 0.5 / __WEBPACK_IMPORTED_MODULE_2__math__["o" /* halfPi */],
        dxdphi = F * (sinlambda * sin_2phi / 4 - E * sinphi * sinlambda_2),
        dydlambda = 0.125 * F * (sin_2phi * sinlambda_2 - E * sinphi * cos2phi * sinlambda),
        dydphi = 0.5 * F * (sin2phi * coslambda_2 + E * sin2lambda_2 * cosphi) + 0.5,
        denominator = dxdphi * dydlambda - dydphi * dxdlambda,
        dlambda = (fy * dxdphi - fx * dydphi) / denominator,
        dphi = (fx * dydlambda - fy * dxdlambda) / denominator;
    lambda -= dlambda, phi -= dphi;
  } while ((Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(dlambda) > __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(dphi) > __WEBPACK_IMPORTED_MODULE_2__math__["k" /* epsilon */]) && --i > 0);
  return [lambda, phi];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_d3_geo__["geoProjection"])(winkel3Raw)
      .scale(158.837);
});


/***/ }),

/***/ "./node_modules/d3-geo/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_area__ = __webpack_require__("./node_modules/d3-geo/src/area.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoArea", function() { return __WEBPACK_IMPORTED_MODULE_0__src_area__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_bounds__ = __webpack_require__("./node_modules/d3-geo/src/bounds.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoBounds", function() { return __WEBPACK_IMPORTED_MODULE_1__src_bounds__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_centroid__ = __webpack_require__("./node_modules/d3-geo/src/centroid.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCentroid", function() { return __WEBPACK_IMPORTED_MODULE_2__src_centroid__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_circle__ = __webpack_require__("./node_modules/d3-geo/src/circle.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoCircle", function() { return __WEBPACK_IMPORTED_MODULE_3__src_circle__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_clip_extent__ = __webpack_require__("./node_modules/d3-geo/src/clip/extent.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoClipExtent", function() { return __WEBPACK_IMPORTED_MODULE_4__src_clip_extent__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_contains__ = __webpack_require__("./node_modules/d3-geo/src/contains.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoContains", function() { return __WEBPACK_IMPORTED_MODULE_5__src_contains__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_distance__ = __webpack_require__("./node_modules/d3-geo/src/distance.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoDistance", function() { return __WEBPACK_IMPORTED_MODULE_6__src_distance__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_graticule__ = __webpack_require__("./node_modules/d3-geo/src/graticule.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGraticule", function() { return __WEBPACK_IMPORTED_MODULE_7__src_graticule__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGraticule10", function() { return __WEBPACK_IMPORTED_MODULE_7__src_graticule__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__src_interpolate__ = __webpack_require__("./node_modules/d3-geo/src/interpolate.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoInterpolate", function() { return __WEBPACK_IMPORTED_MODULE_8__src_interpolate__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__src_length__ = __webpack_require__("./node_modules/d3-geo/src/length.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoLength", function() { return __WEBPACK_IMPORTED_MODULE_9__src_length__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__src_path_index__ = __webpack_require__("./node_modules/d3-geo/src/path/index.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoPath", function() { return __WEBPACK_IMPORTED_MODULE_10__src_path_index__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__src_projection_albers__ = __webpack_require__("./node_modules/d3-geo/src/projection/albers.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAlbers", function() { return __WEBPACK_IMPORTED_MODULE_11__src_projection_albers__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__src_projection_albersUsa__ = __webpack_require__("./node_modules/d3-geo/src/projection/albersUsa.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAlbersUsa", function() { return __WEBPACK_IMPORTED_MODULE_12__src_projection_albersUsa__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__src_projection_azimuthalEqualArea__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthalEqualArea.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAzimuthalEqualArea", function() { return __WEBPACK_IMPORTED_MODULE_13__src_projection_azimuthalEqualArea__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAzimuthalEqualAreaRaw", function() { return __WEBPACK_IMPORTED_MODULE_13__src_projection_azimuthalEqualArea__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__src_projection_azimuthalEquidistant__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthalEquidistant.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAzimuthalEquidistant", function() { return __WEBPACK_IMPORTED_MODULE_14__src_projection_azimuthalEquidistant__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoAzimuthalEquidistantRaw", function() { return __WEBPACK_IMPORTED_MODULE_14__src_projection_azimuthalEquidistant__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__src_projection_conicConformal__ = __webpack_require__("./node_modules/d3-geo/src/projection/conicConformal.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoConicConformal", function() { return __WEBPACK_IMPORTED_MODULE_15__src_projection_conicConformal__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoConicConformalRaw", function() { return __WEBPACK_IMPORTED_MODULE_15__src_projection_conicConformal__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__src_projection_conicEqualArea__ = __webpack_require__("./node_modules/d3-geo/src/projection/conicEqualArea.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoConicEqualArea", function() { return __WEBPACK_IMPORTED_MODULE_16__src_projection_conicEqualArea__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoConicEqualAreaRaw", function() { return __WEBPACK_IMPORTED_MODULE_16__src_projection_conicEqualArea__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__src_projection_conicEquidistant__ = __webpack_require__("./node_modules/d3-geo/src/projection/conicEquidistant.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoConicEquidistant", function() { return __WEBPACK_IMPORTED_MODULE_17__src_projection_conicEquidistant__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoConicEquidistantRaw", function() { return __WEBPACK_IMPORTED_MODULE_17__src_projection_conicEquidistant__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__src_projection_equirectangular__ = __webpack_require__("./node_modules/d3-geo/src/projection/equirectangular.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEquirectangular", function() { return __WEBPACK_IMPORTED_MODULE_18__src_projection_equirectangular__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoEquirectangularRaw", function() { return __WEBPACK_IMPORTED_MODULE_18__src_projection_equirectangular__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__src_projection_gnomonic__ = __webpack_require__("./node_modules/d3-geo/src/projection/gnomonic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGnomonic", function() { return __WEBPACK_IMPORTED_MODULE_19__src_projection_gnomonic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoGnomonicRaw", function() { return __WEBPACK_IMPORTED_MODULE_19__src_projection_gnomonic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__src_projection_identity__ = __webpack_require__("./node_modules/d3-geo/src/projection/identity.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoIdentity", function() { return __WEBPACK_IMPORTED_MODULE_20__src_projection_identity__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__src_projection_index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoProjection", function() { return __WEBPACK_IMPORTED_MODULE_21__src_projection_index__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoProjectionMutator", function() { return __WEBPACK_IMPORTED_MODULE_21__src_projection_index__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__src_projection_mercator__ = __webpack_require__("./node_modules/d3-geo/src/projection/mercator.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMercator", function() { return __WEBPACK_IMPORTED_MODULE_22__src_projection_mercator__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoMercatorRaw", function() { return __WEBPACK_IMPORTED_MODULE_22__src_projection_mercator__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__src_projection_orthographic__ = __webpack_require__("./node_modules/d3-geo/src/projection/orthographic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoOrthographic", function() { return __WEBPACK_IMPORTED_MODULE_23__src_projection_orthographic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoOrthographicRaw", function() { return __WEBPACK_IMPORTED_MODULE_23__src_projection_orthographic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__src_projection_stereographic__ = __webpack_require__("./node_modules/d3-geo/src/projection/stereographic.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoStereographic", function() { return __WEBPACK_IMPORTED_MODULE_24__src_projection_stereographic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoStereographicRaw", function() { return __WEBPACK_IMPORTED_MODULE_24__src_projection_stereographic__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__src_projection_transverseMercator__ = __webpack_require__("./node_modules/d3-geo/src/projection/transverseMercator.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTransverseMercator", function() { return __WEBPACK_IMPORTED_MODULE_25__src_projection_transverseMercator__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTransverseMercatorRaw", function() { return __WEBPACK_IMPORTED_MODULE_25__src_projection_transverseMercator__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__src_rotation__ = __webpack_require__("./node_modules/d3-geo/src/rotation.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoRotation", function() { return __WEBPACK_IMPORTED_MODULE_26__src_rotation__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__src_stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoStream", function() { return __WEBPACK_IMPORTED_MODULE_27__src_stream__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__src_transform__ = __webpack_require__("./node_modules/d3-geo/src/transform.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "geoTransform", function() { return __WEBPACK_IMPORTED_MODULE_28__src_transform__["a"]; });




 // DEPRECATED! Use d3.geoIdentity().clipExtent(…).


























/***/ }),

/***/ "./node_modules/d3-geo/src/adder.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return new Adder;
});

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function(y) {
    add(temp, y, this.t);
    add(this, temp.s, this.s);
    if (this.s) this.t += temp.t;
    else this.s = temp.t;
  },
  valueOf: function() {
    return this.s;
  }
};

var temp = new Adder;

function add(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = (a - av) + (b - bv);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/area.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return areaRingSum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return areaStream; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__adder__ = __webpack_require__("./node_modules/d3-geo/src/adder.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");





var areaRingSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])();

var areaSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])(),
    lambda00,
    phi00,
    lambda0,
    cosPhi0,
    sinPhi0;

var areaStream = {
  point: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  lineStart: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  lineEnd: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  polygonStart: function() {
    areaRingSum.reset();
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    var areaRing = +areaRingSum;
    areaSum.add(areaRing < 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */] + areaRing : areaRing);
    this.lineStart = this.lineEnd = this.point = __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */];
  },
  sphere: function() {
    areaSum.add(__WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */]);
  }
};

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaRingEnd() {
  areaPoint(lambda00, phi00);
}

function areaPointFirst(lambda, phi) {
  areaStream.point = areaPoint;
  lambda00 = lambda, phi00 = phi;
  lambda *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */];
  lambda0 = lambda, cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi = phi / 2 + __WEBPACK_IMPORTED_MODULE_1__math__["q" /* quarterPi */]), sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi);
}

function areaPoint(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */];
  phi = phi / 2 + __WEBPACK_IMPORTED_MODULE_1__math__["q" /* quarterPi */]; // half the angular distance from south pole

  // Spherical excess E for a spherical triangle with vertices: south pole,
  // previous point, current point.  Uses a formula derived from Cagnoli’s
  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
  var dLambda = lambda - lambda0,
      sdLambda = dLambda >= 0 ? 1 : -1,
      adLambda = sdLambda * dLambda,
      cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi),
      sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi),
      k = sinPhi0 * sinPhi,
      u = cosPhi0 * cosPhi + k * Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(adLambda),
      v = k * sdLambda * Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(adLambda);
  areaRingSum.add(Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* atan2 */])(v, u));

  // Advance the previous points.
  lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
}

/* harmony default export */ __webpack_exports__["c"] = (function(object) {
  areaSum.reset();
  Object(__WEBPACK_IMPORTED_MODULE_3__stream__["a" /* default */])(object, areaStream);
  return areaSum * 2;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/bounds.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__adder__ = __webpack_require__("./node_modules/d3-geo/src/adder.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__area__ = __webpack_require__("./node_modules/d3-geo/src/area.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cartesian__ = __webpack_require__("./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");






var lambda0, phi0, lambda1, phi1, // bounds
    lambda2, // previous lambda-coordinate
    lambda00, phi00, // first point
    p0, // previous 3D point
    deltaSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])(),
    ranges,
    range;

var boundsStream = {
  point: boundsPoint,
  lineStart: boundsLineStart,
  lineEnd: boundsLineEnd,
  polygonStart: function() {
    boundsStream.point = boundsRingPoint;
    boundsStream.lineStart = boundsRingStart;
    boundsStream.lineEnd = boundsRingEnd;
    deltaSum.reset();
    __WEBPACK_IMPORTED_MODULE_1__area__["b" /* areaStream */].polygonStart();
  },
  polygonEnd: function() {
    __WEBPACK_IMPORTED_MODULE_1__area__["b" /* areaStream */].polygonEnd();
    boundsStream.point = boundsPoint;
    boundsStream.lineStart = boundsLineStart;
    boundsStream.lineEnd = boundsLineEnd;
    if (__WEBPACK_IMPORTED_MODULE_1__area__["a" /* areaRingSum */] < 0) lambda0 = -(lambda1 = 180), phi0 = -(phi1 = 90);
    else if (deltaSum > __WEBPACK_IMPORTED_MODULE_3__math__["i" /* epsilon */]) phi1 = 90;
    else if (deltaSum < -__WEBPACK_IMPORTED_MODULE_3__math__["i" /* epsilon */]) phi0 = -90;
    range[0] = lambda0, range[1] = lambda1;
  }
};

function boundsPoint(lambda, phi) {
  ranges.push(range = [lambda0 = lambda, lambda1 = lambda]);
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
}

function linePoint(lambda, phi) {
  var p = Object(__WEBPACK_IMPORTED_MODULE_2__cartesian__["a" /* cartesian */])([lambda * __WEBPACK_IMPORTED_MODULE_3__math__["r" /* radians */], phi * __WEBPACK_IMPORTED_MODULE_3__math__["r" /* radians */]]);
  if (p0) {
    var normal = Object(__WEBPACK_IMPORTED_MODULE_2__cartesian__["c" /* cartesianCross */])(p0, p),
        equatorial = [normal[1], -normal[0], 0],
        inflection = Object(__WEBPACK_IMPORTED_MODULE_2__cartesian__["c" /* cartesianCross */])(equatorial, normal);
    Object(__WEBPACK_IMPORTED_MODULE_2__cartesian__["e" /* cartesianNormalizeInPlace */])(inflection);
    inflection = Object(__WEBPACK_IMPORTED_MODULE_2__cartesian__["g" /* spherical */])(inflection);
    var delta = lambda - lambda2,
        sign = delta > 0 ? 1 : -1,
        lambdai = inflection[0] * __WEBPACK_IMPORTED_MODULE_3__math__["h" /* degrees */] * sign,
        phii,
        antimeridian = Object(__WEBPACK_IMPORTED_MODULE_3__math__["a" /* abs */])(delta) > 180;
    if (antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
      phii = inflection[1] * __WEBPACK_IMPORTED_MODULE_3__math__["h" /* degrees */];
      if (phii > phi1) phi1 = phii;
    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
      phii = -inflection[1] * __WEBPACK_IMPORTED_MODULE_3__math__["h" /* degrees */];
      if (phii < phi0) phi0 = phii;
    } else {
      if (phi < phi0) phi0 = phi;
      if (phi > phi1) phi1 = phi;
    }
    if (antimeridian) {
      if (lambda < lambda2) {
        if (angle(lambda0, lambda) > angle(lambda0, lambda1)) lambda1 = lambda;
      } else {
        if (angle(lambda, lambda1) > angle(lambda0, lambda1)) lambda0 = lambda;
      }
    } else {
      if (lambda1 >= lambda0) {
        if (lambda < lambda0) lambda0 = lambda;
        if (lambda > lambda1) lambda1 = lambda;
      } else {
        if (lambda > lambda2) {
          if (angle(lambda0, lambda) > angle(lambda0, lambda1)) lambda1 = lambda;
        } else {
          if (angle(lambda, lambda1) > angle(lambda0, lambda1)) lambda0 = lambda;
        }
      }
    }
  } else {
    ranges.push(range = [lambda0 = lambda, lambda1 = lambda]);
  }
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
  p0 = p, lambda2 = lambda;
}

function boundsLineStart() {
  boundsStream.point = linePoint;
}

function boundsLineEnd() {
  range[0] = lambda0, range[1] = lambda1;
  boundsStream.point = boundsPoint;
  p0 = null;
}

function boundsRingPoint(lambda, phi) {
  if (p0) {
    var delta = lambda - lambda2;
    deltaSum.add(Object(__WEBPACK_IMPORTED_MODULE_3__math__["a" /* abs */])(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
  } else {
    lambda00 = lambda, phi00 = phi;
  }
  __WEBPACK_IMPORTED_MODULE_1__area__["b" /* areaStream */].point(lambda, phi);
  linePoint(lambda, phi);
}

function boundsRingStart() {
  __WEBPACK_IMPORTED_MODULE_1__area__["b" /* areaStream */].lineStart();
}

function boundsRingEnd() {
  boundsRingPoint(lambda00, phi00);
  __WEBPACK_IMPORTED_MODULE_1__area__["b" /* areaStream */].lineEnd();
  if (Object(__WEBPACK_IMPORTED_MODULE_3__math__["a" /* abs */])(deltaSum) > __WEBPACK_IMPORTED_MODULE_3__math__["i" /* epsilon */]) lambda0 = -(lambda1 = 180);
  range[0] = lambda0, range[1] = lambda1;
  p0 = null;
}

// Finds the left-right distance between two longitudes.
// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
// the distance between ±180° to be 360°.
function angle(lambda0, lambda1) {
  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
}

function rangeCompare(a, b) {
  return a[0] - b[0];
}

function rangeContains(range, x) {
  return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
}

/* harmony default export */ __webpack_exports__["a"] = (function(feature) {
  var i, n, a, b, merged, deltaMax, delta;

  phi1 = lambda1 = -(lambda0 = phi0 = Infinity);
  ranges = [];
  Object(__WEBPACK_IMPORTED_MODULE_4__stream__["a" /* default */])(feature, boundsStream);

  // First, sort ranges by their minimum longitudes.
  if (n = ranges.length) {
    ranges.sort(rangeCompare);

    // Then, merge any ranges that overlap.
    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
      b = ranges[i];
      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
      } else {
        merged.push(a = b);
      }
    }

    // Finally, find the largest gap between the merged ranges.
    // The final bounding box will be the inverse of this gap.
    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
      b = merged[i];
      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0 = b[0], lambda1 = a[1];
    }
  }

  ranges = range = null;

  return lambda0 === Infinity || phi0 === Infinity
      ? [[NaN, NaN], [NaN, NaN]]
      : [[lambda0, phi0], [lambda1, phi1]];
});


/***/ }),

/***/ "./node_modules/d3-geo/src/cartesian.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["g"] = spherical;
/* harmony export (immutable) */ __webpack_exports__["a"] = cartesian;
/* harmony export (immutable) */ __webpack_exports__["d"] = cartesianDot;
/* harmony export (immutable) */ __webpack_exports__["c"] = cartesianCross;
/* harmony export (immutable) */ __webpack_exports__["b"] = cartesianAddInPlace;
/* harmony export (immutable) */ __webpack_exports__["f"] = cartesianScale;
/* harmony export (immutable) */ __webpack_exports__["e"] = cartesianNormalizeInPlace;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");


function spherical(cartesian) {
  return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(cartesian[1], cartesian[0]), Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0], phi = spherical[1], cosPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi);
  return [cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(lambda), cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(lambda), Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi)];
}

function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// TODO return a
function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}

// TODO return d
function cartesianNormalizeInPlace(d) {
  var l = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/centroid.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");




var W0, W1,
    X0, Y0, Z0,
    X1, Y1, Z1,
    X2, Y2, Z2,
    lambda00, phi00, // first point
    x0, y0, z0; // previous point

var centroidStream = {
  sphere: __WEBPACK_IMPORTED_MODULE_1__noop__["a" /* default */],
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function() {
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  }
};

// Arithmetic mean of Cartesian vectors.
function centroidPoint(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */];
  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi);
  centroidPointCartesian(cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(lambda), cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(lambda), Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi));
}

function centroidPointCartesian(x, y, z) {
  ++W0;
  X0 += (x - X0) / W0;
  Y0 += (y - Y0) / W0;
  Z0 += (z - Z0) / W0;
}

function centroidLineStart() {
  centroidStream.point = centroidLinePointFirst;
}

function centroidLinePointFirst(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */];
  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi);
  x0 = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(lambda);
  y0 = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(lambda);
  z0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi);
  centroidStream.point = centroidLinePoint;
  centroidPointCartesian(x0, y0, z0);
}

function centroidLinePoint(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */];
  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi),
      x = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(lambda),
      y = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(lambda),
      z = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi),
      w = Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
}

// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
// J. Applied Mechanics 42, 239 (1975).
function centroidRingStart() {
  centroidStream.point = centroidRingPointFirst;
}

function centroidRingEnd() {
  centroidRingPoint(lambda00, phi00);
  centroidStream.point = centroidPoint;
}

function centroidRingPointFirst(lambda, phi) {
  lambda00 = lambda, phi00 = phi;
  lambda *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */];
  centroidStream.point = centroidRingPoint;
  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi);
  x0 = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(lambda);
  y0 = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(lambda);
  z0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi);
  centroidPointCartesian(x0, y0, z0);
}

function centroidRingPoint(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */];
  var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi),
      x = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(lambda),
      y = cosPhi * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(lambda),
      z = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi),
      cx = y0 * z - z0 * y,
      cy = z0 * x - x0 * z,
      cz = x0 * y - y0 * x,
      m = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(cx * cx + cy * cy + cz * cz),
      w = Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(m), // line weight = angle
      v = m && -w / m; // area weight multiplier
  X2 += v * cx;
  Y2 += v * cy;
  Z2 += v * cz;
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

/* harmony default export */ __webpack_exports__["a"] = (function(object) {
  W0 = W1 =
  X0 = Y0 = Z0 =
  X1 = Y1 = Z1 =
  X2 = Y2 = Z2 = 0;
  Object(__WEBPACK_IMPORTED_MODULE_2__stream__["a" /* default */])(object, centroidStream);

  var x = X2,
      y = Y2,
      z = Z2,
      m = x * x + y * y + z * z;

  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
  if (m < __WEBPACK_IMPORTED_MODULE_0__math__["j" /* epsilon2 */]) {
    x = X1, y = Y1, z = Z1;
    // If the feature has zero length, fall back to arithmetic mean of point vectors.
    if (W1 < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]) x = X0, y = Y0, z = Z0;
    m = x * x + y * y + z * z;
    // If the feature still has an undefined ccentroid, then return.
    if (m < __WEBPACK_IMPORTED_MODULE_0__math__["j" /* epsilon2 */]) return [NaN, NaN];
  }

  return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(y, x) * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */], Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(z / Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(m)) * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */]];
});


/***/ }),

/***/ "./node_modules/d3-geo/src/circle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = circleStream;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian__ = __webpack_require__("./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constant__ = __webpack_require__("./node_modules/d3-geo/src/constant.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rotation__ = __webpack_require__("./node_modules/d3-geo/src/rotation.js");





// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(stream, radius, delta, direction, t0, t1) {
  if (!delta) return;
  var cosRadius = Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(radius),
      sinRadius = Object(__WEBPACK_IMPORTED_MODULE_2__math__["t" /* sin */])(radius),
      step = direction * delta;
  if (t0 == null) {
    t0 = radius + direction * __WEBPACK_IMPORTED_MODULE_2__math__["w" /* tau */];
    t1 = radius - step / 2;
  } else {
    t0 = circleRadius(cosRadius, t0);
    t1 = circleRadius(cosRadius, t1);
    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * __WEBPACK_IMPORTED_MODULE_2__math__["w" /* tau */];
  }
  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
    point = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["g" /* spherical */])([cosRadius, -sinRadius * Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(t), -sinRadius * Object(__WEBPACK_IMPORTED_MODULE_2__math__["t" /* sin */])(t)]);
    stream.point(point[0], point[1]);
  }
}

// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  point = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["a" /* cartesian */])(point), point[0] -= cosRadius;
  Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["e" /* cartesianNormalizeInPlace */])(point);
  var radius = Object(__WEBPACK_IMPORTED_MODULE_2__math__["b" /* acos */])(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + __WEBPACK_IMPORTED_MODULE_2__math__["w" /* tau */] - __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */]) % __WEBPACK_IMPORTED_MODULE_2__math__["w" /* tau */];
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  var center = Object(__WEBPACK_IMPORTED_MODULE_1__constant__["a" /* default */])([0, 0]),
      radius = Object(__WEBPACK_IMPORTED_MODULE_1__constant__["a" /* default */])(90),
      precision = Object(__WEBPACK_IMPORTED_MODULE_1__constant__["a" /* default */])(6),
      ring,
      rotate,
      stream = {point: point};

  function point(x, y) {
    ring.push(x = rotate(x, y));
    x[0] *= __WEBPACK_IMPORTED_MODULE_2__math__["h" /* degrees */], x[1] *= __WEBPACK_IMPORTED_MODULE_2__math__["h" /* degrees */];
  }

  function circle() {
    var c = center.apply(this, arguments),
        r = radius.apply(this, arguments) * __WEBPACK_IMPORTED_MODULE_2__math__["r" /* radians */],
        p = precision.apply(this, arguments) * __WEBPACK_IMPORTED_MODULE_2__math__["r" /* radians */];
    ring = [];
    rotate = Object(__WEBPACK_IMPORTED_MODULE_3__rotation__["b" /* rotateRadians */])(-c[0] * __WEBPACK_IMPORTED_MODULE_2__math__["r" /* radians */], -c[1] * __WEBPACK_IMPORTED_MODULE_2__math__["r" /* radians */], 0).invert;
    circleStream(stream, r, p, 1);
    c = {type: "Polygon", coordinates: [ring]};
    ring = rotate = null;
    return c;
  }

  circle.center = function(_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : Object(__WEBPACK_IMPORTED_MODULE_1__constant__["a" /* default */])([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : Object(__WEBPACK_IMPORTED_MODULE_1__constant__["a" /* default */])(+_), circle) : radius;
  };

  circle.precision = function(_) {
    return arguments.length ? (precision = typeof _ === "function" ? _ : Object(__WEBPACK_IMPORTED_MODULE_1__constant__["a" /* default */])(+_), circle) : precision;
  };

  return circle;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/antimeridian.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__("./node_modules/d3-geo/src/clip/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");



/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__index__["a" /* default */])(
  function() { return true; },
  clipAntimeridianLine,
  clipAntimeridianInterpolate,
  [-__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], -__WEBPACK_IMPORTED_MODULE_1__math__["l" /* halfPi */]]
));

// Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.
function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      clean; // no intersections

  return {
    lineStart: function() {
      stream.lineStart();
      clean = 1;
    },
    point: function(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */] : -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */],
          delta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda1 - lambda0);
      if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(delta - __WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */]) < __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]) { // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? __WEBPACK_IMPORTED_MODULE_1__math__["l" /* halfPi */] : -__WEBPACK_IMPORTED_MODULE_1__math__["l" /* halfPi */]);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= __WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */]) { // line crosses antimeridian
        if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda0 - sign0) < __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]) lambda0 -= sign0 * __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]; // handle degeneracies
        if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda1 - sign1) < __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]) lambda1 -= sign1 * __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */];
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function() {
      return 2 - clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(lambda0 - lambda1);
  return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(sinLambda0Lambda1) > __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]
      ? Object(__WEBPACK_IMPORTED_MODULE_1__math__["d" /* atan */])((Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi0) * (cosPhi1 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi1)) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(lambda1)
          - Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi1) * (cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi0)) * Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(lambda0))
          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
      : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * __WEBPACK_IMPORTED_MODULE_1__math__["l" /* halfPi */];
    stream.point(-__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], phi);
    stream.point(0, phi);
    stream.point(__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], phi);
    stream.point(__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], 0);
    stream.point(__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], -phi);
    stream.point(0, -phi);
    stream.point(-__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], -phi);
    stream.point(-__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], 0);
    stream.point(-__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */], phi);
  } else if (Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(from[0] - to[0]) > __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]) {
    var lambda = from[0] < to[0] ? __WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */] : -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */];
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/buffer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");


/* harmony default export */ __webpack_exports__["a"] = (function() {
  var lines = [],
      line;
  return {
    point: function(x, y) {
      line.push([x, y]);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: __WEBPACK_IMPORTED_MODULE_0__noop__["a" /* default */],
    rejoin: function() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
});


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/circle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian__ = __webpack_require__("./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__circle__ = __webpack_require__("./node_modules/d3-geo/src/circle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pointEqual__ = __webpack_require__("./node_modules/d3-geo/src/pointEqual.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index__ = __webpack_require__("./node_modules/d3-geo/src/clip/index.js");






/* harmony default export */ __webpack_exports__["a"] = (function(radius, delta) {
  var cr = Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(radius),
      smallRadius = cr > 0,
      notHemisphere = Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(cr) > __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */]; // TODO optimise for this common case

  function interpolate(from, to, direction, stream) {
    Object(__WEBPACK_IMPORTED_MODULE_1__circle__["a" /* circleStream */])(stream, radius, delta, direction, from, to);
  }

  function visible(lambda, phi) {
    return Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(lambda) * Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(phi) > cr;
  }

  // Takes a line and cuts into visible segments. Return values used for polygon
  // clipping: 0 - there were intersections or the line was empty; 1 - no
  // intersections 2 - there were intersections, and the first and last segments
  // should be rejoined.
  function clipLine(stream) {
    var point0, // previous point
        c0, // code for previous point
        v0, // visibility of previous point
        v00, // visibility of first point
        clean; // no intersections
    return {
      lineStart: function() {
        v00 = v0 = false;
        clean = 1;
      },
      point: function(lambda, phi) {
        var point1 = [lambda, phi],
            point2,
            v = visible(lambda, phi),
            c = smallRadius
              ? v ? 0 : code(lambda, phi)
              : v ? code(lambda + (lambda < 0 ? __WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */] : -__WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */]), phi) : 0;
        if (!point0 && (v00 = v0 = v)) stream.lineStart();
        // Handle degeneracies.
        // TODO ignore if not clipping polygons.
        if (v !== v0) {
          point2 = intersect(point0, point1);
          if (Object(__WEBPACK_IMPORTED_MODULE_3__pointEqual__["a" /* default */])(point0, point2) || Object(__WEBPACK_IMPORTED_MODULE_3__pointEqual__["a" /* default */])(point1, point2)) {
            point1[0] += __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */];
            point1[1] += __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */];
            v = visible(point1[0], point1[1]);
          }
        }
        if (v !== v0) {
          clean = 0;
          if (v) {
            // outside going in
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            // inside going out
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1]);
            stream.lineEnd();
          }
          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t;
          // If the codes for two points are different, or are both zero,
          // and there this segment intersects with the small circle.
          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;
            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
            }
          }
        }
        if (v && (!point0 || !Object(__WEBPACK_IMPORTED_MODULE_3__pointEqual__["a" /* default */])(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }
        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function() {
        if (v0) stream.lineEnd();
        point0 = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return clean | ((v00 && v0) << 1);
      }
    };
  }

  // Intersects the great circle between a and b with the clip circle.
  function intersect(a, b, two) {
    var pa = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["a" /* cartesian */])(a),
        pb = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["a" /* cartesian */])(b);

    // We have two planes, n1.p = d1 and n2.p = d2.
    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
    var n1 = [1, 0, 0], // normal
        n2 = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["c" /* cartesianCross */])(pa, pb),
        n2n2 = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["d" /* cartesianDot */])(n2, n2),
        n1n2 = n2[0], // cartesianDot(n1, n2),
        determinant = n2n2 - n1n2 * n1n2;

    // Two polar points.
    if (!determinant) return !two && a;

    var c1 =  cr * n2n2 / determinant,
        c2 = -cr * n1n2 / determinant,
        n1xn2 = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["c" /* cartesianCross */])(n1, n2),
        A = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["f" /* cartesianScale */])(n1, c1),
        B = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["f" /* cartesianScale */])(n2, c2);
    Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["b" /* cartesianAddInPlace */])(A, B);

    // Solve |p(t)|^2 = 1.
    var u = n1xn2,
        w = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["d" /* cartesianDot */])(A, u),
        uu = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["d" /* cartesianDot */])(u, u),
        t2 = w * w - uu * (Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["d" /* cartesianDot */])(A, A) - 1);

    if (t2 < 0) return;

    var t = Object(__WEBPACK_IMPORTED_MODULE_2__math__["u" /* sqrt */])(t2),
        q = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["f" /* cartesianScale */])(u, (-w - t) / uu);
    Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["b" /* cartesianAddInPlace */])(q, A);
    q = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["g" /* spherical */])(q);

    if (!two) return q;

    // Two intersection points.
    var lambda0 = a[0],
        lambda1 = b[0],
        phi0 = a[1],
        phi1 = b[1],
        z;

    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

    var delta = lambda1 - lambda0,
        polar = Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(delta - __WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */]) < __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */],
        meridian = polar || delta < __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */];

    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

    // Check that the first point is between a and b.
    if (meridian
        ? polar
          ? phi0 + phi1 > 0 ^ q[1] < (Object(__WEBPACK_IMPORTED_MODULE_2__math__["a" /* abs */])(q[0] - lambda0) < __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */] ? phi0 : phi1)
          : phi0 <= q[1] && q[1] <= phi1
        : delta > __WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */] ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["f" /* cartesianScale */])(u, (-w + t) / uu);
      Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["b" /* cartesianAddInPlace */])(q1, A);
      return [q, Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["g" /* spherical */])(q1)];
    }
  }

  // Generates a 4-bit vector representing the location of a point relative to
  // the small circle's bounding box.
  function code(lambda, phi) {
    var r = smallRadius ? radius : __WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */] - radius,
        code = 0;
    if (lambda < -r) code |= 1; // left
    else if (lambda > r) code |= 2; // right
    if (phi < -r) code |= 4; // below
    else if (phi > r) code |= 8; // above
    return code;
  }

  return Object(__WEBPACK_IMPORTED_MODULE_4__index__["a" /* default */])(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-__WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */], radius - __WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */]]);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/extent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = clipExtent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__buffer__ = __webpack_require__("./node_modules/d3-geo/src/clip/buffer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__line__ = __webpack_require__("./node_modules/d3-geo/src/clip/line.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__polygon__ = __webpack_require__("./node_modules/d3-geo/src/clip/polygon.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");






var clipMax = 1e9, clipMin = -clipMax;

// TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

function clipExtent(x0, y0, x1, y1) {

  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function interpolate(from, to, direction, stream) {
    var a = 0, a1 = 0;
    if (from == null
        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
        || comparePoint(from, to) < 0 ^ direction > 0) {
      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
      while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function corner(p, direction) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(p[0] - x0) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */] ? direction > 0 ? 0 : 3
        : Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(p[0] - x1) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */] ? direction > 0 ? 2 : 1
        : Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(p[1] - y0) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */] ? direction > 0 ? 1 : 0
        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
  }

  function compareIntersection(a, b) {
    return comparePoint(a.x, b.x);
  }

  function comparePoint(a, b) {
    var ca = corner(a, 1),
        cb = corner(b, 1);
    return ca !== cb ? ca - cb
        : ca === 0 ? b[1] - a[1]
        : ca === 1 ? a[0] - b[0]
        : ca === 2 ? a[1] - b[1]
        : b[0] - a[0];
  }

  return function(stream) {
    var activeStream = stream,
        bufferStream = Object(__WEBPACK_IMPORTED_MODULE_1__buffer__["a" /* default */])(),
        segments,
        polygon,
        ring,
        x__, y__, v__, // first point
        x_, y_, v_, // previous point
        first,
        clean;

    var clipStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: polygonStart,
      polygonEnd: polygonEnd
    };

    function point(x, y) {
      if (visible(x, y)) activeStream.point(x, y);
    }

    function polygonInside() {
      var winding = 0;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
        }
      }

      return winding;
    }

    // Buffer geometry within a polygon and then clip it en masse.
    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }

    function polygonEnd() {
      var startInside = polygonInside(),
          cleanInside = clean && startInside,
          visible = (segments = Object(__WEBPACK_IMPORTED_MODULE_4_d3_array__["d" /* merge */])(segments)).length;
      if (cleanInside || visible) {
        stream.polygonStart();
        if (cleanInside) {
          stream.lineStart();
          interpolate(null, null, 1, stream);
          stream.lineEnd();
        }
        if (visible) {
          Object(__WEBPACK_IMPORTED_MODULE_3__polygon__["a" /* default */])(segments, compareIntersection, startInside, interpolate, stream);
        }
        stream.polygonEnd();
      }
      activeStream = stream, segments = polygon = ring = null;
    }

    function lineStart() {
      clipStream.point = linePoint;
      if (polygon) polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    }

    // TODO rather than special-case polygons, simply handle them separately.
    // Ideally, coincident intersection points should be jittered to avoid
    // clipping issues.
    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_) bufferStream.rejoin();
        segments.push(bufferStream.result());
      }
      clipStream.point = point;
      if (v_) activeStream.lineEnd();
    }

    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon) ring.push([x, y]);
      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;
        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_) activeStream.point(x, y);
        else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
          if (Object(__WEBPACK_IMPORTED_MODULE_2__line__["a" /* default */])(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }
            activeStream.point(b[0], b[1]);
            if (!v) activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }
      x_ = x, y_ = y, v_ = v;
    }

    return clipStream;
  };
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      cache,
      cacheStream,
      clip;

  return clip = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = clipExtent(x0, y0, x1, y1)(cacheStream = stream);
    },
    extent: function(_) {
      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
    }
  };
});


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__buffer__ = __webpack_require__("./node_modules/d3-geo/src/clip/buffer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__polygon__ = __webpack_require__("./node_modules/d3-geo/src/clip/polygon.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__polygonContains__ = __webpack_require__("./node_modules/d3-geo/src/polygonContains.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");






/* harmony default export */ __webpack_exports__["a"] = (function(pointVisible, clipLine, interpolate, start) {
  return function(rotate, sink) {
    var line = clipLine(sink),
        rotatedStart = rotate.invert(start[0], start[1]),
        ringBuffer = Object(__WEBPACK_IMPORTED_MODULE_0__buffer__["a" /* default */])(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;

    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = Object(__WEBPACK_IMPORTED_MODULE_4_d3_array__["d" /* merge */])(segments);
        var startInside = Object(__WEBPACK_IMPORTED_MODULE_3__polygonContains__["a" /* default */])(polygon, rotatedStart);
        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          Object(__WEBPACK_IMPORTED_MODULE_1__polygon__["a" /* default */])(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function() {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      var point = rotate(lambda, phi);
      if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      var point = rotate(lambda, phi);
      line.point(point[0], point[1]);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      var point = rotate(lambda, phi);
      ringSink.point(point[0], point[1]);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();

      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i, n = ringSegments.length, m,
          segment,
          point;

      ring.pop();
      polygon.push(ring);
      ring = null;

      if (!n) return;

      // No intersections.
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
          sink.lineEnd();
        }
        return;
      }

      // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?
      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
});

function validSegment(segment) {
  return segment.length > 1;
}

// Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.
function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - __WEBPACK_IMPORTED_MODULE_2__math__["l" /* halfPi */] - __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */] : __WEBPACK_IMPORTED_MODULE_2__math__["l" /* halfPi */] - a[1])
       - ((b = b.x)[0] < 0 ? b[1] - __WEBPACK_IMPORTED_MODULE_2__math__["l" /* halfPi */] - __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */] : __WEBPACK_IMPORTED_MODULE_2__math__["l" /* halfPi */] - b[1]);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/line.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, b, x0, y0, x1, y1) {
  var ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
  return true;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/clip/polygon.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pointEqual__ = __webpack_require__("./node_modules/d3-geo/src/pointEqual.js");


function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}

// A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.
/* harmony default export */ __webpack_exports__["a"] = (function(segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function(segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n, p0 = segment[0], p1 = segment[n], x;

    // If the first and last points of a segment are coincident, then treat as a
    // closed ring. TODO if all rings are closed, then the winding order of the
    // exterior ring should be checked.
    if (Object(__WEBPACK_IMPORTED_MODULE_0__pointEqual__["a" /* default */])(p0, p1)) {
      stream.lineStart();
      for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
      stream.lineEnd();
      return;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });

  if (!subject.length) return;

  clip.sort(compareIntersection);
  link(subject);
  link(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) if ((current = current.n) === start) return;
    points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
});

function link(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/compose.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {

  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }

  if (a.invert && b.invert) compose.invert = function(x, y) {
    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
  };

  return compose;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/constant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return function() {
    return x;
  };
});


/***/ }),

/***/ "./node_modules/d3-geo/src/contains.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polygonContains__ = __webpack_require__("./node_modules/d3-geo/src/polygonContains.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__distance__ = __webpack_require__("./node_modules/d3-geo/src/distance.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");




var containsObjectType = {
  Feature: function(object, point) {
    return containsGeometry(object.geometry, point);
  },
  FeatureCollection: function(object, point) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;
    return false;
  }
};

var containsGeometryType = {
  Sphere: function() {
    return true;
  },
  Point: function(object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPoint(coordinates[i], point)) return true;
    return false;
  },
  LineString: function(object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsLine(coordinates[i], point)) return true;
    return false;
  },
  Polygon: function(object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPolygon(coordinates[i], point)) return true;
    return false;
  },
  GeometryCollection: function(object, point) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) if (containsGeometry(geometries[i], point)) return true;
    return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type)
      ? containsGeometryType[geometry.type](geometry, point)
      : false;
}

function containsPoint(coordinates, point) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__distance__["a" /* default */])(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ab = Object(__WEBPACK_IMPORTED_MODULE_1__distance__["a" /* default */])(coordinates[0], coordinates[1]),
      ao = Object(__WEBPACK_IMPORTED_MODULE_1__distance__["a" /* default */])(coordinates[0], point),
      ob = Object(__WEBPACK_IMPORTED_MODULE_1__distance__["a" /* default */])(point, coordinates[1]);
  return ao + ob <= ab + __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */];
}

function containsPolygon(coordinates, point) {
  return !!Object(__WEBPACK_IMPORTED_MODULE_0__polygonContains__["a" /* default */])(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * __WEBPACK_IMPORTED_MODULE_2__math__["r" /* radians */], point[1] * __WEBPACK_IMPORTED_MODULE_2__math__["r" /* radians */]];
}

/* harmony default export */ __webpack_exports__["a"] = (function(object, point) {
  return (object && containsObjectType.hasOwnProperty(object.type)
      ? containsObjectType[object.type]
      : containsGeometry)(object, point);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/distance.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__length__ = __webpack_require__("./node_modules/d3-geo/src/length.js");


var coordinates = [null, null],
    object = {type: "LineString", coordinates: coordinates};

/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return Object(__WEBPACK_IMPORTED_MODULE_0__length__["a" /* default */])(object);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/graticule.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = graticule;
/* harmony export (immutable) */ __webpack_exports__["b"] = graticule10;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");



function graticuleX(y0, y1, dy) {
  var y = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(y0, y1 - __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */], dy).concat(y1);
  return function(x) { return y.map(function(y) { return [x, y]; }); };
}

function graticuleY(x0, x1, dx) {
  var x = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(x0, x1 - __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */], dx).concat(x1);
  return function(y) { return x.map(function(x) { return [x, y]; }); };
}

function graticule() {
  var x1, x0, X1, X0,
      y1, y0, Y1, Y0,
      dx = 10, dy = dx, DX = 90, DY = 360,
      x, y, X, Y,
      precision = 2.5;

  function graticule() {
    return {type: "MultiLineString", coordinates: lines()};
  }

  function lines() {
    return Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* ceil */])(X0 / DX) * DX, X1, DX).map(X)
        .concat(Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* ceil */])(Y0 / DY) * DY, Y1, DY).map(Y))
        .concat(Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* ceil */])(x0 / dx) * dx, x1, dx).filter(function(x) { return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(x % DX) > __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]; }).map(x))
        .concat(Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["f" /* ceil */])(y0 / dy) * dy, y1, dy).filter(function(y) { return Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(y % DY) > __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]; }).map(y));
  }

  graticule.lines = function() {
    return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
  };

  graticule.outline = function() {
    return {
      type: "Polygon",
      coordinates: [
        X(X0).concat(
        Y(Y1).slice(1),
        X(X1).reverse().slice(1),
        Y(Y0).reverse().slice(1))
      ]
    };
  };

  graticule.extent = function(_) {
    if (!arguments.length) return graticule.extentMinor();
    return graticule.extentMajor(_).extentMinor(_);
  };

  graticule.extentMajor = function(_) {
    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
    X0 = +_[0][0], X1 = +_[1][0];
    Y0 = +_[0][1], Y1 = +_[1][1];
    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
    return graticule.precision(precision);
  };

  graticule.extentMinor = function(_) {
    if (!arguments.length) return [[x0, y0], [x1, y1]];
    x0 = +_[0][0], x1 = +_[1][0];
    y0 = +_[0][1], y1 = +_[1][1];
    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
    return graticule.precision(precision);
  };

  graticule.step = function(_) {
    if (!arguments.length) return graticule.stepMinor();
    return graticule.stepMajor(_).stepMinor(_);
  };

  graticule.stepMajor = function(_) {
    if (!arguments.length) return [DX, DY];
    DX = +_[0], DY = +_[1];
    return graticule;
  };

  graticule.stepMinor = function(_) {
    if (!arguments.length) return [dx, dy];
    dx = +_[0], dy = +_[1];
    return graticule;
  };

  graticule.precision = function(_) {
    if (!arguments.length) return precision;
    precision = +_;
    x = graticuleX(y0, y1, 90);
    y = graticuleY(x0, x1, precision);
    X = graticuleX(Y0, Y1, 90);
    Y = graticuleY(X0, X1, precision);
    return graticule;
  };

  return graticule
      .extentMajor([[-180, -90 + __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]], [180, 90 - __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]]])
      .extentMinor([[-180, -80 - __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]], [180, 80 + __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */]]]);
}

function graticule10() {
  return graticule()();
}


/***/ }),

/***/ "./node_modules/d3-geo/src/identity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return x;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/interpolate.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");


/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var x0 = a[0] * __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */],
      y0 = a[1] * __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */],
      x1 = b[0] * __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */],
      y1 = b[1] * __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */],
      cy0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y0),
      sy0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y0),
      cy1 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y1),
      sy1 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y1),
      kx0 = cy0 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(x0),
      ky0 = cy0 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x0),
      kx1 = cy1 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(x1),
      ky1 = cy1 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x1),
      d = 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["m" /* haversin */])(y1 - y0) + cy0 * cy1 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["m" /* haversin */])(x1 - x0))),
      k = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(d);

  var interpolate = d ? function(t) {
    var B = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(t *= d) / k,
        A = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(y, x) * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */],
      Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(z, Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(x * x + y * y)) * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */]
    ];
  } : function() {
    return [x0 * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */], y0 * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */]];
  };

  interpolate.distance = d;

  return interpolate;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/length.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__adder__ = __webpack_require__("./node_modules/d3-geo/src/adder.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");





var lengthSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])(),
    lambda0,
    sinPhi0,
    cosPhi0;

var lengthStream = {
  sphere: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  point: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  lineStart: lengthLineStart,
  lineEnd: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  polygonStart: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  polygonEnd: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */]
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */];
}

function lengthPointFirst(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */];
  lambda0 = lambda, sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi), cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], phi *= __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */];
  var sinPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi),
      cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi),
      delta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda - lambda0),
      cosDelta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(delta),
      sinDelta = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta,
      z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta;
  lengthSum.add(Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* atan2 */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* sqrt */])(x * x + y * y), z));
  lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
}

/* harmony default export */ __webpack_exports__["a"] = (function(object) {
  lengthSum.reset();
  Object(__WEBPACK_IMPORTED_MODULE_3__stream__["a" /* default */])(object, lengthStream);
  return +lengthSum;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/math.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return epsilon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return epsilon2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return pi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return halfPi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return quarterPi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return tau; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return degrees; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return radians; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return abs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return atan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return atan2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return cos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return ceil; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return exp; });
/* unused harmony export floor */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return pow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return sin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return sign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return sqrt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return tan; });
/* harmony export (immutable) */ __webpack_exports__["b"] = acos;
/* harmony export (immutable) */ __webpack_exports__["c"] = asin;
/* harmony export (immutable) */ __webpack_exports__["m"] = haversin;
var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var tau = pi * 2;

var degrees = 180 / pi;
var radians = pi / 180;

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var ceil = Math.ceil;
var exp = Math.exp;
var floor = Math.floor;
var log = Math.log;
var pow = Math.pow;
var sin = Math.sin;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sqrt = Math.sqrt;
var tan = Math.tan;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/noop.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = noop;
function noop() {}


/***/ }),

/***/ "./node_modules/d3-geo/src/path/area.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__adder__ = __webpack_require__("./node_modules/d3-geo/src/adder.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");




var areaSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])(),
    areaRingSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])(),
    x00,
    y00,
    x0,
    y0;

var areaStream = {
  point: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  lineStart: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  lineEnd: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  polygonStart: function() {
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    areaStream.lineStart = areaStream.lineEnd = areaStream.point = __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */];
    areaSum.add(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(areaRingSum));
    areaRingSum.reset();
  },
  result: function() {
    var area = areaSum / 2;
    areaSum.reset();
    return area;
  }
};

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaPointFirst(x, y) {
  areaStream.point = areaPoint;
  x00 = x0 = x, y00 = y0 = y;
}

function areaPoint(x, y) {
  areaRingSum.add(y0 * x - x0 * y);
  x0 = x, y0 = y;
}

function areaRingEnd() {
  areaPoint(x00, y00);
}

/* harmony default export */ __webpack_exports__["a"] = (areaStream);


/***/ }),

/***/ "./node_modules/d3-geo/src/path/bounds.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");


var x0 = Infinity,
    y0 = x0,
    x1 = -x0,
    y1 = x1;

var boundsStream = {
  point: boundsPoint,
  lineStart: __WEBPACK_IMPORTED_MODULE_0__noop__["a" /* default */],
  lineEnd: __WEBPACK_IMPORTED_MODULE_0__noop__["a" /* default */],
  polygonStart: __WEBPACK_IMPORTED_MODULE_0__noop__["a" /* default */],
  polygonEnd: __WEBPACK_IMPORTED_MODULE_0__noop__["a" /* default */],
  result: function() {
    var bounds = [[x0, y0], [x1, y1]];
    x1 = y1 = -(y0 = x0 = Infinity);
    return bounds;
  }
};

function boundsPoint(x, y) {
  if (x < x0) x0 = x;
  if (x > x1) x1 = x;
  if (y < y0) y0 = y;
  if (y > y1) y1 = y;
}

/* harmony default export */ __webpack_exports__["a"] = (boundsStream);


/***/ }),

/***/ "./node_modules/d3-geo/src/path/centroid.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");


// TODO Enforce positive area for exterior, negative area for interior?

var X0 = 0,
    Y0 = 0,
    Z0 = 0,
    X1 = 0,
    Y1 = 0,
    Z1 = 0,
    X2 = 0,
    Y2 = 0,
    Z2 = 0,
    x00,
    y00,
    x0,
    y0;

var centroidStream = {
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function() {
    centroidStream.point = centroidPoint;
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  },
  result: function() {
    var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
        : Z1 ? [X1 / Z1, Y1 / Z1]
        : Z0 ? [X0 / Z0, Y0 / Z0]
        : [NaN, NaN];
    X0 = Y0 = Z0 =
    X1 = Y1 = Z1 =
    X2 = Y2 = Z2 = 0;
    return centroid;
  }
};

function centroidPoint(x, y) {
  X0 += x;
  Y0 += y;
  ++Z0;
}

function centroidLineStart() {
  centroidStream.point = centroidPointFirstLine;
}

function centroidPointFirstLine(x, y) {
  centroidStream.point = centroidPointLine;
  centroidPoint(x0 = x, y0 = y);
}

function centroidPointLine(x, y) {
  var dx = x - x0, dy = y - y0, z = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(dx * dx + dy * dy);
  X1 += z * (x0 + x) / 2;
  Y1 += z * (y0 + y) / 2;
  Z1 += z;
  centroidPoint(x0 = x, y0 = y);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
}

function centroidRingStart() {
  centroidStream.point = centroidPointFirstRing;
}

function centroidRingEnd() {
  centroidPointRing(x00, y00);
}

function centroidPointFirstRing(x, y) {
  centroidStream.point = centroidPointRing;
  centroidPoint(x00 = x0 = x, y00 = y0 = y);
}

function centroidPointRing(x, y) {
  var dx = x - x0,
      dy = y - y0,
      z = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(dx * dx + dy * dy);

  X1 += z * (x0 + x) / 2;
  Y1 += z * (y0 + y) / 2;
  Z1 += z;

  z = y0 * x - x0 * y;
  X2 += z * (x0 + x);
  Y2 += z * (y0 + y);
  Z2 += z * 3;
  centroidPoint(x0 = x, y0 = y);
}

/* harmony default export */ __webpack_exports__["a"] = (centroidStream);


/***/ }),

/***/ "./node_modules/d3-geo/src/path/context.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = PathContext;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");



function PathContext(context) {
  this._context = context;
}

PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function(_) {
    return this._radius = _, this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._context.closePath();
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._context.moveTo(x, y);
        this._point = 1;
        break;
      }
      case 1: {
        this._context.lineTo(x, y);
        break;
      }
      default: {
        this._context.moveTo(x + this._radius, y);
        this._context.arc(x, y, this._radius, 0, __WEBPACK_IMPORTED_MODULE_0__math__["w" /* tau */]);
        break;
      }
    }
  },
  result: __WEBPACK_IMPORTED_MODULE_1__noop__["a" /* default */]
};


/***/ }),

/***/ "./node_modules/d3-geo/src/path/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__identity__ = __webpack_require__("./node_modules/d3-geo/src/identity.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__area__ = __webpack_require__("./node_modules/d3-geo/src/path/area.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bounds__ = __webpack_require__("./node_modules/d3-geo/src/path/bounds.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__centroid__ = __webpack_require__("./node_modules/d3-geo/src/path/centroid.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__context__ = __webpack_require__("./node_modules/d3-geo/src/path/context.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__measure__ = __webpack_require__("./node_modules/d3-geo/src/path/measure.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__string__ = __webpack_require__("./node_modules/d3-geo/src/path/string.js");









/* harmony default export */ __webpack_exports__["a"] = (function(projection, context) {
  var pointRadius = 4.5,
      projectionStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      Object(__WEBPACK_IMPORTED_MODULE_1__stream__["a" /* default */])(object, projectionStream(contextStream));
    }
    return contextStream.result();
  }

  path.area = function(object) {
    Object(__WEBPACK_IMPORTED_MODULE_1__stream__["a" /* default */])(object, projectionStream(__WEBPACK_IMPORTED_MODULE_2__area__["a" /* default */]));
    return __WEBPACK_IMPORTED_MODULE_2__area__["a" /* default */].result();
  };

  path.measure = function(object) {
    Object(__WEBPACK_IMPORTED_MODULE_1__stream__["a" /* default */])(object, projectionStream(__WEBPACK_IMPORTED_MODULE_6__measure__["a" /* default */]));
    return __WEBPACK_IMPORTED_MODULE_6__measure__["a" /* default */].result();
  };

  path.bounds = function(object) {
    Object(__WEBPACK_IMPORTED_MODULE_1__stream__["a" /* default */])(object, projectionStream(__WEBPACK_IMPORTED_MODULE_3__bounds__["a" /* default */]));
    return __WEBPACK_IMPORTED_MODULE_3__bounds__["a" /* default */].result();
  };

  path.centroid = function(object) {
    Object(__WEBPACK_IMPORTED_MODULE_1__stream__["a" /* default */])(object, projectionStream(__WEBPACK_IMPORTED_MODULE_4__centroid__["a" /* default */]));
    return __WEBPACK_IMPORTED_MODULE_4__centroid__["a" /* default */].result();
  };

  path.projection = function(_) {
    return arguments.length ? (projectionStream = _ == null ? (projection = null, __WEBPACK_IMPORTED_MODULE_0__identity__["a" /* default */]) : (projection = _).stream, path) : projection;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = _ == null ? (context = null, new __WEBPACK_IMPORTED_MODULE_7__string__["a" /* default */]) : new __WEBPACK_IMPORTED_MODULE_5__context__["a" /* default */](context = _);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(projection).context(context);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/path/measure.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__adder__ = __webpack_require__("./node_modules/d3-geo/src/adder.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__noop__ = __webpack_require__("./node_modules/d3-geo/src/noop.js");




var lengthSum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])(),
    lengthRing,
    x00,
    y00,
    x0,
    y0;

var lengthStream = {
  point: __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */],
  lineStart: function() {
    lengthStream.point = lengthPointFirst;
  },
  lineEnd: function() {
    if (lengthRing) lengthPoint(x00, y00);
    lengthStream.point = __WEBPACK_IMPORTED_MODULE_2__noop__["a" /* default */];
  },
  polygonStart: function() {
    lengthRing = true;
  },
  polygonEnd: function() {
    lengthRing = null;
  },
  result: function() {
    var length = +lengthSum;
    lengthSum.reset();
    return length;
  }
};

function lengthPointFirst(x, y) {
  lengthStream.point = lengthPoint;
  x00 = x0 = x, y00 = y0 = y;
}

function lengthPoint(x, y) {
  x0 -= x, y0 -= y;
  lengthSum.add(Object(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* sqrt */])(x0 * x0 + y0 * y0));
  x0 = x, y0 = y;
}

/* harmony default export */ __webpack_exports__["a"] = (lengthStream);


/***/ }),

/***/ "./node_modules/d3-geo/src/path/string.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = PathString;
function PathString() {
  this._string = [];
}

PathString.prototype = {
  _circle: circle(4.5),
  pointRadius: function(_) {
    return this._circle = circle(_), this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._string.push("Z");
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._string.push("M", x, ",", y);
        this._point = 1;
        break;
      }
      case 1: {
        this._string.push("L", x, ",", y);
        break;
      }
      default: {
        this._string.push("M", x, ",", y, this._circle);
        break;
      }
    }
  },
  result: function() {
    if (this._string.length) {
      var result = this._string.join("");
      this._string = [];
      return result;
    }
  }
};

function circle(radius) {
  return "m0," + radius
      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
      + "z";
}


/***/ }),

/***/ "./node_modules/d3-geo/src/pointEqual.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");


/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(a[0] - b[0]) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */] && Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(a[1] - b[1]) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */];
});


/***/ }),

/***/ "./node_modules/d3-geo/src/polygonContains.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__adder__ = __webpack_require__("./node_modules/d3-geo/src/adder.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cartesian__ = __webpack_require__("./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");




var sum = Object(__WEBPACK_IMPORTED_MODULE_0__adder__["a" /* default */])();

/* harmony default export */ __webpack_exports__["a"] = (function(polygon, point) {
  var lambda = point[0],
      phi = point[1],
      normal = [Object(__WEBPACK_IMPORTED_MODULE_2__math__["t" /* sin */])(lambda), -Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(lambda), 0],
      angle = 0,
      winding = 0;

  sum.reset();

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = point0[0],
        phi0 = point0[1] / 2 + __WEBPACK_IMPORTED_MODULE_2__math__["q" /* quarterPi */],
        sinPhi0 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["t" /* sin */])(phi0),
        cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = point1[0],
          phi1 = point1[1] / 2 + __WEBPACK_IMPORTED_MODULE_2__math__["q" /* quarterPi */],
          sinPhi1 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["t" /* sin */])(phi1),
          cosPhi1 = Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(phi1),
          delta = lambda1 - lambda0,
          sign = delta >= 0 ? 1 : -1,
          absDelta = sign * delta,
          antimeridian = absDelta > __WEBPACK_IMPORTED_MODULE_2__math__["o" /* pi */],
          k = sinPhi0 * sinPhi1;

      sum.add(Object(__WEBPACK_IMPORTED_MODULE_2__math__["e" /* atan2 */])(k * sign * Object(__WEBPACK_IMPORTED_MODULE_2__math__["t" /* sin */])(absDelta), cosPhi0 * cosPhi1 + k * Object(__WEBPACK_IMPORTED_MODULE_2__math__["g" /* cos */])(absDelta)));
      angle += antimeridian ? delta + sign * __WEBPACK_IMPORTED_MODULE_2__math__["w" /* tau */] : delta;

      // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = Object(__WEBPACK_IMPORTED_MODULE_1__cartesian__["c" /* cartesianCross */])(Object(__WEBPACK_IMPORTED_MODULE_1__cartesian__["a" /* cartesian */])(point0), Object(__WEBPACK_IMPORTED_MODULE_1__cartesian__["a" /* cartesian */])(point1));
        Object(__WEBPACK_IMPORTED_MODULE_1__cartesian__["e" /* cartesianNormalizeInPlace */])(arc);
        var intersection = Object(__WEBPACK_IMPORTED_MODULE_1__cartesian__["c" /* cartesianCross */])(normal, arc);
        Object(__WEBPACK_IMPORTED_MODULE_1__cartesian__["e" /* cartesianNormalizeInPlace */])(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * Object(__WEBPACK_IMPORTED_MODULE_2__math__["c" /* asin */])(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (angle < -__WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */] || angle < __WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */] && sum < -__WEBPACK_IMPORTED_MODULE_2__math__["i" /* epsilon */]) ^ (winding & 1);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/albers.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__conicEqualArea__ = __webpack_require__("./node_modules/d3-geo/src/projection/conicEqualArea.js");


/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__conicEqualArea__["b" /* default */])()
      .parallels([29.5, 45.5])
      .scale(1070)
      .translate([480, 250])
      .rotate([96, 0])
      .center([-0.6, 38.7]);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/albersUsa.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__albers__ = __webpack_require__("./node_modules/d3-geo/src/projection/albers.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conicEqualArea__ = __webpack_require__("./node_modules/d3-geo/src/projection/conicEqualArea.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fit__ = __webpack_require__("./node_modules/d3-geo/src/projection/fit.js");





// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  var n = streams.length;
  return {
    point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
    sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
    lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
    lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
    polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
    polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
  };
}

// A composite projection for the United States, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
/* harmony default export */ __webpack_exports__["a"] = (function() {
  var cache,
      cacheStream,
      lower48 = Object(__WEBPACK_IMPORTED_MODULE_1__albers__["a" /* default */])(), lower48Point,
      alaska = Object(__WEBPACK_IMPORTED_MODULE_2__conicEqualArea__["b" /* default */])().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
      hawaii = Object(__WEBPACK_IMPORTED_MODULE_2__conicEqualArea__["b" /* default */])().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
      point, pointStream = {point: function(x, y) { point = [x, y]; }};

  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (lower48Point.point(x, y), point)
        || (alaskaPoint.point(x, y), point)
        || (hawaiiPoint.point(x, y), point);
  }

  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
        : lower48).invert(coordinates);
  };

  albersUsa.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
  };

  albersUsa.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };

  albersUsa.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
        .stream(pointStream);

    alaskaPoint = alaska
        .translate([x - 0.307 * k, y + 0.201 * k])
        .clipExtent([[x - 0.425 * k + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */], y + 0.120 * k + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]], [x - 0.214 * k - __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */], y + 0.234 * k - __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]]])
        .stream(pointStream);

    hawaiiPoint = hawaii
        .translate([x - 0.205 * k, y + 0.212 * k])
        .clipExtent([[x - 0.214 * k + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */], y + 0.166 * k + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]], [x - 0.115 * k - __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */], y + 0.234 * k - __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]]])
        .stream(pointStream);

    return reset();
  };

  albersUsa.fitExtent = function(extent, object) {
    return Object(__WEBPACK_IMPORTED_MODULE_3__fit__["a" /* fitExtent */])(albersUsa, extent, object);
  };

  albersUsa.fitSize = function(size, object) {
    return Object(__WEBPACK_IMPORTED_MODULE_3__fit__["b" /* fitSize */])(albersUsa, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsa;
  }

  return albersUsa.scale(1070);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/azimuthal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = azimuthalRaw;
/* harmony export (immutable) */ __webpack_exports__["a"] = azimuthalInvert;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");


function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(x),
        cy = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y),
        k = scale(cx * cy);
    return [
      k * cy * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x),
      k * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y)
    ];
  }
}

function azimuthalInvert(angle) {
  return function(x, y) {
    var z = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(x * x + y * y),
        c = angle(z),
        sc = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(c),
        cc = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(c);
    return [
      Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(x * sc, z * cc),
      Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(z && y * sc / z)
    ];
  }
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/azimuthalEqualArea.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return azimuthalEqualAreaRaw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__azimuthal__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");




var azimuthalEqualAreaRaw = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["b" /* azimuthalRaw */])(function(cxcy) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["a" /* azimuthalInvert */])(function(z) {
  return 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(z / 2);
});

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(azimuthalEqualAreaRaw)
      .scale(124.75)
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/azimuthalEquidistant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return azimuthalEquidistantRaw; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__azimuthal__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");




var azimuthalEquidistantRaw = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["b" /* azimuthalRaw */])(function(c) {
  return (c = Object(__WEBPACK_IMPORTED_MODULE_0__math__["b" /* acos */])(c)) && c / Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(c);
});

azimuthalEquidistantRaw.invert = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["a" /* azimuthalInvert */])(function(z) {
  return z;
});

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(azimuthalEquidistantRaw)
      .scale(79.4188)
      .clipAngle(180 - 1e-3);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/conic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = conicProjection;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");



function conicProjection(projectAt) {
  var phi0 = 0,
      phi1 = __WEBPACK_IMPORTED_MODULE_0__math__["o" /* pi */] / 3,
      m = Object(__WEBPACK_IMPORTED_MODULE_1__index__["b" /* projectionMutator */])(projectAt),
      p = m(phi0, phi1);

  p.parallels = function(_) {
    return arguments.length ? m(phi0 = _[0] * __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */], phi1 = _[1] * __WEBPACK_IMPORTED_MODULE_0__math__["r" /* radians */]) : [phi0 * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */], phi1 * __WEBPACK_IMPORTED_MODULE_0__math__["h" /* degrees */]];
  };

  return p;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/conicConformal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = conicConformalRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__conic__ = __webpack_require__("./node_modules/d3-geo/src/projection/conic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mercator__ = __webpack_require__("./node_modules/d3-geo/src/projection/mercator.js");




function tany(y) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__math__["v" /* tan */])((__WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] + y) / 2);
}

function conicConformalRaw(y0, y1) {
  var cy0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y0),
      n = y0 === y1 ? Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y0) : Object(__WEBPACK_IMPORTED_MODULE_0__math__["n" /* log */])(cy0 / Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y1)) / Object(__WEBPACK_IMPORTED_MODULE_0__math__["n" /* log */])(tany(y1) / tany(y0)),
      f = cy0 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["p" /* pow */])(tany(y0), n) / n;

  if (!n) return __WEBPACK_IMPORTED_MODULE_2__mercator__["c" /* mercatorRaw */];

  function project(x, y) {
    if (f > 0) { if (y < -__WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]) y = -__WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]; }
    else { if (y > __WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] - __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]) y = __WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] - __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]; }
    var r = f / Object(__WEBPACK_IMPORTED_MODULE_0__math__["p" /* pow */])(tany(y), n);
    return [r * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(n * x), f - r * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(n * x)];
  }

  project.invert = function(x, y) {
    var fy = f - y, r = Object(__WEBPACK_IMPORTED_MODULE_0__math__["s" /* sign */])(n) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(x * x + fy * fy);
    return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(x, Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(fy)) / n * Object(__WEBPACK_IMPORTED_MODULE_0__math__["s" /* sign */])(fy), 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["d" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["p" /* pow */])(f / r, 1 / n)) - __WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */]];
  };

  return project;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__conic__["a" /* conicProjection */])(conicConformalRaw)
      .scale(109.5)
      .parallels([30, 30]);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/conicEqualArea.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = conicEqualAreaRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__conic__ = __webpack_require__("./node_modules/d3-geo/src/projection/conic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cylindricalEqualArea__ = __webpack_require__("./node_modules/d3-geo/src/projection/cylindricalEqualArea.js");




function conicEqualAreaRaw(y0, y1) {
  var sy0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y0), n = (sy0 + Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y1)) / 2;

  // Are the parallels symmetrical around the Equator?
  if (Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(n) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]) return Object(__WEBPACK_IMPORTED_MODULE_2__cylindricalEqualArea__["a" /* cylindricalEqualAreaRaw */])(y0);

  var c = 1 + sy0 * (2 * n - sy0), r0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(c) / n;

  function project(x, y) {
    var r = Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(c - 2 * n * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y)) / n;
    return [r * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x *= n), r0 - r * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(x)];
  }

  project.invert = function(x, y) {
    var r0y = r0 - y;
    return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(x, Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(r0y)) / n * Object(__WEBPACK_IMPORTED_MODULE_0__math__["s" /* sign */])(r0y), Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };

  return project;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__conic__["a" /* conicProjection */])(conicEqualAreaRaw)
      .scale(155.424)
      .center([0, 33.6442]);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/conicEquidistant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = conicEquidistantRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__conic__ = __webpack_require__("./node_modules/d3-geo/src/projection/conic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__equirectangular__ = __webpack_require__("./node_modules/d3-geo/src/projection/equirectangular.js");




function conicEquidistantRaw(y0, y1) {
  var cy0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y0),
      n = y0 === y1 ? Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y0) : (cy0 - Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y1)) / (y1 - y0),
      g = cy0 / n + y0;

  if (Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(n) < __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]) return __WEBPACK_IMPORTED_MODULE_2__equirectangular__["b" /* equirectangularRaw */];

  function project(x, y) {
    var gy = g - y, nx = n * x;
    return [gy * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(nx), g - gy * Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(nx)];
  }

  project.invert = function(x, y) {
    var gy = g - y;
    return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["e" /* atan2 */])(x, Object(__WEBPACK_IMPORTED_MODULE_0__math__["a" /* abs */])(gy)) / n * Object(__WEBPACK_IMPORTED_MODULE_0__math__["s" /* sign */])(gy), g - Object(__WEBPACK_IMPORTED_MODULE_0__math__["s" /* sign */])(n) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["u" /* sqrt */])(x * x + gy * gy)];
  };

  return project;
}

/* harmony default export */ __webpack_exports__["b"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__conic__["a" /* conicProjection */])(conicEquidistantRaw)
      .scale(131.154)
      .center([0, 13.9389]);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/cylindricalEqualArea.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cylindricalEqualAreaRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");


function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(phi) / cosPhi0];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, Object(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */])(y * cosPhi0)];
  };

  return forward;
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/equirectangular.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = equirectangularRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");


function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

equirectangularRaw.invert = equirectangularRaw;

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__index__["a" /* default */])(equirectangularRaw)
      .scale(152.63);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/fit.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fitExtent;
/* harmony export (immutable) */ __webpack_exports__["b"] = fitSize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stream__ = __webpack_require__("./node_modules/d3-geo/src/stream.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__path_bounds__ = __webpack_require__("./node_modules/d3-geo/src/path/bounds.js");



function fitExtent(projection, extent, object) {
  var w = extent[1][0] - extent[0][0],
      h = extent[1][1] - extent[0][1],
      clip = projection.clipExtent && projection.clipExtent();

  projection
      .scale(150)
      .translate([0, 0]);

  if (clip != null) projection.clipExtent(null);

  Object(__WEBPACK_IMPORTED_MODULE_0__stream__["a" /* default */])(object, projection.stream(__WEBPACK_IMPORTED_MODULE_1__path_bounds__["a" /* default */]));

  var b = __WEBPACK_IMPORTED_MODULE_1__path_bounds__["a" /* default */].result(),
      k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
      x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
      y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;

  if (clip != null) projection.clipExtent(clip);

  return projection
      .scale(k * 150)
      .translate([x, y]);
}

function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/gnomonic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = gnomonicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__azimuthal__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");




function gnomonicRaw(x, y) {
  var cy = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y), k = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(x) * cy;
  return [cy * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x) / k, Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y) / k];
}

gnomonicRaw.invert = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["a" /* azimuthalInvert */])(__WEBPACK_IMPORTED_MODULE_0__math__["d" /* atan */]);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(gnomonicRaw)
      .scale(144.049)
      .clipAngle(60);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/identity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__clip_extent__ = __webpack_require__("./node_modules/d3-geo/src/clip/extent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__identity__ = __webpack_require__("./node_modules/d3-geo/src/identity.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transform__ = __webpack_require__("./node_modules/d3-geo/src/transform.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fit__ = __webpack_require__("./node_modules/d3-geo/src/projection/fit.js");





function scaleTranslate(kx, ky, tx, ty) {
  return kx === 1 && ky === 1 && tx === 0 && ty === 0 ? __WEBPACK_IMPORTED_MODULE_1__identity__["a" /* default */] : Object(__WEBPACK_IMPORTED_MODULE_2__transform__["b" /* transformer */])({
    point: function(x, y) {
      this.stream.point(x * kx + tx, y * ky + ty);
    }
  });
}

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, transform = __WEBPACK_IMPORTED_MODULE_1__identity__["a" /* default */], // scale, translate and reflect
      x0 = null, y0, x1, y1, clip = __WEBPACK_IMPORTED_MODULE_1__identity__["a" /* default */], // clip extent
      cache,
      cacheStream,
      projection;

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return projection = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = transform(clip(cacheStream = stream));
    },
    clipExtent: function(_) {
      return arguments.length ? (clip = _ == null ? (x0 = y0 = x1 = y1 = null, __WEBPACK_IMPORTED_MODULE_1__identity__["a" /* default */]) : Object(__WEBPACK_IMPORTED_MODULE_0__clip_extent__["a" /* clipExtent */])(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    },
    scale: function(_) {
      return arguments.length ? (transform = scaleTranslate((k = +_) * sx, k * sy, tx, ty), reset()) : k;
    },
    translate: function(_) {
      return arguments.length ? (transform = scaleTranslate(k * sx, k * sy, tx = +_[0], ty = +_[1]), reset()) : [tx, ty];
    },
    reflectX: function(_) {
      return arguments.length ? (transform = scaleTranslate(k * (sx = _ ? -1 : 1), k * sy, tx, ty), reset()) : sx < 0;
    },
    reflectY: function(_) {
      return arguments.length ? (transform = scaleTranslate(k * sx, k * (sy = _ ? -1 : 1), tx, ty), reset()) : sy < 0;
    },
    fitExtent: function(extent, object) {
      return Object(__WEBPACK_IMPORTED_MODULE_3__fit__["a" /* fitExtent */])(projection, extent, object);
    },
    fitSize: function(size, object) {
      return Object(__WEBPACK_IMPORTED_MODULE_3__fit__["b" /* fitSize */])(projection, size, object);
    }
  };
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = projection;
/* harmony export (immutable) */ __webpack_exports__["b"] = projectionMutator;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__clip_antimeridian__ = __webpack_require__("./node_modules/d3-geo/src/clip/antimeridian.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clip_circle__ = __webpack_require__("./node_modules/d3-geo/src/clip/circle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clip_extent__ = __webpack_require__("./node_modules/d3-geo/src/clip/extent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__compose__ = __webpack_require__("./node_modules/d3-geo/src/compose.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__identity__ = __webpack_require__("./node_modules/d3-geo/src/identity.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__rotation__ = __webpack_require__("./node_modules/d3-geo/src/rotation.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__transform__ = __webpack_require__("./node_modules/d3-geo/src/transform.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__fit__ = __webpack_require__("./node_modules/d3-geo/src/projection/fit.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__resample__ = __webpack_require__("./node_modules/d3-geo/src/projection/resample.js");











var transformRadians = Object(__WEBPACK_IMPORTED_MODULE_7__transform__["b" /* transformer */])({
  point: function(x, y) {
    this.stream.point(x * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], y * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */]);
  }
});

function projection(project) {
  return projectionMutator(function() { return project; })();
}

function projectionMutator(projectAt) {
  var project,
      k = 150, // scale
      x = 480, y = 250, // translate
      dx, dy, lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
      theta = null, preclip = __WEBPACK_IMPORTED_MODULE_0__clip_antimeridian__["a" /* default */], // clip angle
      x0 = null, y0, x1, y1, postclip = __WEBPACK_IMPORTED_MODULE_4__identity__["a" /* default */], // clip extent
      delta2 = 0.5, projectResample = Object(__WEBPACK_IMPORTED_MODULE_9__resample__["a" /* default */])(projectTransform, delta2), // precision
      cache,
      cacheStream;

  function projection(point) {
    point = projectRotate(point[0] * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], point[1] * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */]);
    return [point[0] * k + dx, dy - point[1] * k];
  }

  function invert(point) {
    point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
    return point && [point[0] * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */], point[1] * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */]];
  }

  function projectTransform(x, y) {
    return x = project(x, y), [x[0] * k + dx, dy - x[1] * k];
  }

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(preclip(rotate, projectResample(postclip(cacheStream = stream))));
  };

  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? Object(__WEBPACK_IMPORTED_MODULE_1__clip_circle__["a" /* default */])(theta = _ * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], 6 * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */]) : (theta = null, __WEBPACK_IMPORTED_MODULE_0__clip_antimeridian__["a" /* default */]), reset()) : theta * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */];
  };

  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, __WEBPACK_IMPORTED_MODULE_4__identity__["a" /* default */]) : Object(__WEBPACK_IMPORTED_MODULE_2__clip_extent__["a" /* clipExtent */])(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], phi = _[1] % 360 * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], recenter()) : [lambda * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */], phi * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */]];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], deltaPhi = _[1] % 360 * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */], deltaGamma = _.length > 2 ? _[2] % 360 * __WEBPACK_IMPORTED_MODULE_5__math__["r" /* radians */] : 0, recenter()) : [deltaLambda * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */], deltaPhi * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */], deltaGamma * __WEBPACK_IMPORTED_MODULE_5__math__["h" /* degrees */]];
  };

  projection.precision = function(_) {
    return arguments.length ? (projectResample = Object(__WEBPACK_IMPORTED_MODULE_9__resample__["a" /* default */])(projectTransform, delta2 = _ * _), reset()) : Object(__WEBPACK_IMPORTED_MODULE_5__math__["u" /* sqrt */])(delta2);
  };

  projection.fitExtent = function(extent, object) {
    return Object(__WEBPACK_IMPORTED_MODULE_8__fit__["a" /* fitExtent */])(projection, extent, object);
  };

  projection.fitSize = function(size, object) {
    return Object(__WEBPACK_IMPORTED_MODULE_8__fit__["b" /* fitSize */])(projection, size, object);
  };

  function recenter() {
    projectRotate = Object(__WEBPACK_IMPORTED_MODULE_3__compose__["a" /* default */])(rotate = Object(__WEBPACK_IMPORTED_MODULE_6__rotation__["b" /* rotateRadians */])(deltaLambda, deltaPhi, deltaGamma), project);
    var center = project(lambda, phi);
    dx = x - center[0] * k;
    dy = y + center[1] * k;
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/mercator.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = mercatorRaw;
/* harmony export (immutable) */ __webpack_exports__["b"] = mercatorProjection;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rotation__ = __webpack_require__("./node_modules/d3-geo/src/rotation.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");




function mercatorRaw(lambda, phi) {
  return [lambda, Object(__WEBPACK_IMPORTED_MODULE_0__math__["n" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["v" /* tan */])((__WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] + phi) / 2))];
}

mercatorRaw.invert = function(x, y) {
  return [x, 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["d" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["k" /* exp */])(y)) - __WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */]];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return mercatorProjection(mercatorRaw)
      .scale(961 / __WEBPACK_IMPORTED_MODULE_0__math__["w" /* tau */]);
});

function mercatorProjection(project) {
  var m = Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(project),
      center = m.center,
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      x0 = null, y0, x1, y1; // clip extent

  m.scale = function(_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };

  m.center = function(_) {
    return arguments.length ? (center(_), reclip()) : center();
  };

  m.clipExtent = function(_) {
    return arguments.length ? ((_ == null ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1])), reclip()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  function reclip() {
    var k = __WEBPACK_IMPORTED_MODULE_0__math__["o" /* pi */] * scale(),
        t = m(Object(__WEBPACK_IMPORTED_MODULE_1__rotation__["a" /* default */])(m.rotate()).invert([0, 0]));
    return clipExtent(x0 == null
        ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw
        ? [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]]
        : [[x0, Math.max(t[1] - k, y0)], [x1, Math.min(t[1] + k, y1)]]);
  }

  return reclip();
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/orthographic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = orthographicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__azimuthal__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");




function orthographicRaw(x, y) {
  return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y) * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x), Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y)];
}

orthographicRaw.invert = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["a" /* azimuthalInvert */])(__WEBPACK_IMPORTED_MODULE_0__math__["c" /* asin */]);

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(orthographicRaw)
      .scale(249.5)
      .clipAngle(90 + __WEBPACK_IMPORTED_MODULE_0__math__["i" /* epsilon */]);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/resample.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian__ = __webpack_require__("./node_modules/d3-geo/src/cartesian.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transform__ = __webpack_require__("./node_modules/d3-geo/src/transform.js");




var maxDepth = 16, // maximum depth of subdivision
    cosMinDistance = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(30 * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */]); // cos(minimum angular distance)

/* harmony default export */ __webpack_exports__["a"] = (function(project, delta2) {
  return +delta2 ? resample(project, delta2) : resampleNone(project);
});

function resampleNone(project) {
  return Object(__WEBPACK_IMPORTED_MODULE_2__transform__["b" /* transformer */])({
    point: function(x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
}

function resample(project, delta2) {

  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
    var dx = x1 - x0,
        dy = y1 - y0,
        d2 = dx * dx + dy * dy;
    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1,
          b = b0 + b1,
          c = c0 + c1,
          m = Object(__WEBPACK_IMPORTED_MODULE_1__math__["u" /* sqrt */])(a * a + b * b + c * c),
          phi2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["c" /* asin */])(c /= m),
          lambda2 = Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(c) - 1) < __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */] || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])(lambda0 - lambda1) < __WEBPACK_IMPORTED_MODULE_1__math__["i" /* epsilon */] ? (lambda0 + lambda1) / 2 : Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* atan2 */])(b, a),
          p = project(lambda2, phi2),
          x2 = p[0],
          y2 = p[1],
          dx2 = x2 - x0,
          dy2 = y2 - y0,
          dz = dy * dx2 - dx * dy2;
      if (dz * dz / d2 > delta2 // perpendicular projected distance
          || Object(__WEBPACK_IMPORTED_MODULE_1__math__["a" /* abs */])((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
        stream.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
      }
    }
  }
  return function(stream) {
    var lambda00, x00, y00, a00, b00, c00, // first point
        lambda0, x0, y0, a0, b0, c0; // previous point

    var resampleStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
    };

    function point(x, y) {
      x = project(x, y);
      stream.point(x[0], x[1]);
    }

    function lineStart() {
      x0 = NaN;
      resampleStream.point = linePoint;
      stream.lineStart();
    }

    function linePoint(lambda, phi) {
      var c = Object(__WEBPACK_IMPORTED_MODULE_0__cartesian__["a" /* cartesian */])([lambda, phi]), p = project(lambda, phi);
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
      stream.point(x0, y0);
    }

    function lineEnd() {
      resampleStream.point = point;
      stream.lineEnd();
    }

    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }

    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }

    function ringEnd() {
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }

    return resampleStream;
  };
}


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/stereographic.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = stereographicRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__azimuthal__ = __webpack_require__("./node_modules/d3-geo/src/projection/azimuthal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index__ = __webpack_require__("./node_modules/d3-geo/src/projection/index.js");




function stereographicRaw(x, y) {
  var cy = Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(y), k = 1 + Object(__WEBPACK_IMPORTED_MODULE_0__math__["g" /* cos */])(x) * cy;
  return [cy * Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(x) / k, Object(__WEBPACK_IMPORTED_MODULE_0__math__["t" /* sin */])(y) / k];
}

stereographicRaw.invert = Object(__WEBPACK_IMPORTED_MODULE_1__azimuthal__["a" /* azimuthalInvert */])(function(z) {
  return 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["d" /* atan */])(z);
});

/* harmony default export */ __webpack_exports__["a"] = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_2__index__["a" /* default */])(stereographicRaw)
      .scale(250)
      .clipAngle(142);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/projection/transverseMercator.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = transverseMercatorRaw;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mercator__ = __webpack_require__("./node_modules/d3-geo/src/projection/mercator.js");



function transverseMercatorRaw(lambda, phi) {
  return [Object(__WEBPACK_IMPORTED_MODULE_0__math__["n" /* log */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["v" /* tan */])((__WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */] + phi) / 2)), -lambda];
}

transverseMercatorRaw.invert = function(x, y) {
  return [-y, 2 * Object(__WEBPACK_IMPORTED_MODULE_0__math__["d" /* atan */])(Object(__WEBPACK_IMPORTED_MODULE_0__math__["k" /* exp */])(x)) - __WEBPACK_IMPORTED_MODULE_0__math__["l" /* halfPi */]];
};

/* harmony default export */ __webpack_exports__["a"] = (function() {
  var m = Object(__WEBPACK_IMPORTED_MODULE_1__mercator__["b" /* mercatorProjection */])(transverseMercatorRaw),
      center = m.center,
      rotate = m.rotate;

  m.center = function(_) {
    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
  };

  m.rotate = function(_) {
    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
  };

  return rotate([0, 0, 90])
      .scale(159.155);
});


/***/ }),

/***/ "./node_modules/d3-geo/src/rotation.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = rotateRadians;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__("./node_modules/d3-geo/src/compose.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math__ = __webpack_require__("./node_modules/d3-geo/src/math.js");



function rotationIdentity(lambda, phi) {
  return [lambda > __WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */] ? lambda - __WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */] : lambda < -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */] ? lambda + __WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */] : lambda, phi];
}

rotationIdentity.invert = rotationIdentity;

function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= __WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */]) ? (deltaPhi || deltaGamma ? Object(__WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */])(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
    : rotationLambda(deltaLambda))
    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
    : rotationIdentity);
}

function forwardRotationLambda(deltaLambda) {
  return function(lambda, phi) {
    return lambda += deltaLambda, [lambda > __WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */] ? lambda - __WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */] : lambda < -__WEBPACK_IMPORTED_MODULE_1__math__["o" /* pi */] ? lambda + __WEBPACK_IMPORTED_MODULE_1__math__["w" /* tau */] : lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(deltaPhi),
      sinDeltaPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(deltaPhi),
      cosDeltaGamma = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(deltaGamma),
      sinDeltaGamma = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi),
        x = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(lambda) * cosPhi,
        y = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(lambda) * cosPhi,
        z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* atan2 */])(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["c" /* asin */])(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }

  rotation.invert = function(lambda, phi) {
    var cosPhi = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(phi),
        x = Object(__WEBPACK_IMPORTED_MODULE_1__math__["g" /* cos */])(lambda) * cosPhi,
        y = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(lambda) * cosPhi,
        z = Object(__WEBPACK_IMPORTED_MODULE_1__math__["t" /* sin */])(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["e" /* atan2 */])(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      Object(__WEBPACK_IMPORTED_MODULE_1__math__["c" /* asin */])(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };

  return rotation;
}

/* harmony default export */ __webpack_exports__["a"] = (function(rotate) {
  rotate = rotateRadians(rotate[0] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], rotate[1] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], rotate.length > 2 ? rotate[2] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */] : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], coordinates[1] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */]);
    return coordinates[0] *= __WEBPACK_IMPORTED_MODULE_1__math__["h" /* degrees */], coordinates[1] *= __WEBPACK_IMPORTED_MODULE_1__math__["h" /* degrees */], coordinates;
  }

  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */], coordinates[1] * __WEBPACK_IMPORTED_MODULE_1__math__["r" /* radians */]);
    return coordinates[0] *= __WEBPACK_IMPORTED_MODULE_1__math__["h" /* degrees */], coordinates[1] *= __WEBPACK_IMPORTED_MODULE_1__math__["h" /* degrees */], coordinates;
  };

  return forward;
});


/***/ }),

/***/ "./node_modules/d3-geo/src/stream.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function(object, stream) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};

var streamGeometryType = {
  Sphere: function(object, stream) {
    stream.sphere();
  },
  Point: function(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object, stream) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n) streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
}

/* harmony default export */ __webpack_exports__["a"] = (function(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
});


/***/ }),

/***/ "./node_modules/d3-geo/src/transform.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = transformer;
/* harmony default export */ __webpack_exports__["a"] = (function(methods) {
  return {
    stream: transformer(methods)
  };
});

function transformer(methods) {
  return function(stream) {
    var s = new TransformStream;
    for (var key in methods) s[key] = methods[key];
    s.stream = stream;
    return s;
  };
}

function TransformStream() {}

TransformStream.prototype = {
  constructor: TransformStream,
  point: function(x, y) { this.stream.point(x, y); },
  sphere: function() { this.stream.sphere(); },
  lineStart: function() { this.stream.lineStart(); },
  lineEnd: function() { this.stream.lineEnd(); },
  polygonStart: function() { this.stream.polygonStart(); },
  polygonEnd: function() { this.stream.polygonEnd(); }
};


/***/ }),

/***/ "./node_modules/d3-interpolate/src/array.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__value__ = __webpack_require__("./node_modules/d3-interpolate/src/value.js");


/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = Object(__WEBPACK_IMPORTED_MODULE_0__value__["a" /* default */])(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/basis.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = basis;
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

/* harmony default export */ __webpack_exports__["b"] = (function(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/basisClosed.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__basis__ = __webpack_require__("./node_modules/d3-interpolate/src/basis.js");


/* harmony default export */ __webpack_exports__["a"] = (function(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return Object(__WEBPACK_IMPORTED_MODULE_0__basis__["a" /* basis */])((t - i / n) * n, v0, v1, v2, v3);
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/color.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = hue;
/* harmony export (immutable) */ __webpack_exports__["b"] = gamma;
/* harmony export (immutable) */ __webpack_exports__["a"] = nogamma;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constant__ = __webpack_require__("./node_modules/d3-interpolate/src/constant.js");


function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : Object(__WEBPACK_IMPORTED_MODULE_0__constant__["a" /* default */])(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : Object(__WEBPACK_IMPORTED_MODULE_0__constant__["a" /* default */])(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : Object(__WEBPACK_IMPORTED_MODULE_0__constant__["a" /* default */])(isNaN(a) ? b : a);
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/constant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return function() {
    return x;
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/cubehelix.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cubehelixLong; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__("./node_modules/d3-interpolate/src/color.js");



function cubehelix(hue) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(start)).h, (end = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(end)).h),
          s = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.s, end.s),
          l = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.l, end.l),
          opacity = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;

    return cubehelix;
  })(1);
}

/* unused harmony default export */ var _unused_webpack_default_export = (cubehelix(__WEBPACK_IMPORTED_MODULE_1__color__["c" /* hue */]));
var cubehelixLong = cubehelix(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */]);


/***/ }),

/***/ "./node_modules/d3-interpolate/src/date.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var d = new Date;
  return a = +a, b -= a, function(t) {
    return d.setTime(a + b * t), d;
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/discrete.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/hcl.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export hclLong */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__("./node_modules/d3-interpolate/src/color.js");



function hcl(hue) {
  return function(start, end) {
    var h = hue((start = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["c" /* hcl */])(start)).h, (end = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["c" /* hcl */])(end)).h),
        c = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.c, end.c),
        l = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.l, end.l),
        opacity = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
}

/* unused harmony default export */ var _unused_webpack_default_export = (hcl(__WEBPACK_IMPORTED_MODULE_1__color__["c" /* hue */]));
var hclLong = hcl(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */]);


/***/ }),

/***/ "./node_modules/d3-interpolate/src/hsl.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export hslLong */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__("./node_modules/d3-interpolate/src/color.js");



function hsl(hue) {
  return function(start, end) {
    var h = hue((start = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["d" /* hsl */])(start)).h, (end = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["d" /* hsl */])(end)).h),
        s = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.s, end.s),
        l = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.l, end.l),
        opacity = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
}

/* unused harmony default export */ var _unused_webpack_default_export = (hsl(__WEBPACK_IMPORTED_MODULE_1__color__["c" /* hue */]));
var hslLong = hsl(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */]);


/***/ }),

/***/ "./node_modules/d3-interpolate/src/hue.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__color__ = __webpack_require__("./node_modules/d3-interpolate/src/color.js");


/* unused harmony default export */ var _unused_webpack_default_export = (function(a, b) {
  var i = Object(__WEBPACK_IMPORTED_MODULE_0__color__["c" /* hue */])(+a, +b);
  return function(t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__value__ = __webpack_require__("./node_modules/d3-interpolate/src/value.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__value__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array__ = __webpack_require__("./node_modules/d3-interpolate/src/array.js");
/* unused harmony reexport interpolateArray */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__basis__ = __webpack_require__("./node_modules/d3-interpolate/src/basis.js");
/* unused harmony reexport interpolateBasis */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__basisClosed__ = __webpack_require__("./node_modules/d3-interpolate/src/basisClosed.js");
/* unused harmony reexport interpolateBasisClosed */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__date__ = __webpack_require__("./node_modules/d3-interpolate/src/date.js");
/* unused harmony reexport interpolateDate */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__discrete__ = __webpack_require__("./node_modules/d3-interpolate/src/discrete.js");
/* unused harmony reexport interpolateDiscrete */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__hue__ = __webpack_require__("./node_modules/d3-interpolate/src/hue.js");
/* unused harmony reexport interpolateHue */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__number__ = __webpack_require__("./node_modules/d3-interpolate/src/number.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_7__number__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__object__ = __webpack_require__("./node_modules/d3-interpolate/src/object.js");
/* unused harmony reexport interpolateObject */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__round__ = __webpack_require__("./node_modules/d3-interpolate/src/round.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_9__round__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__string__ = __webpack_require__("./node_modules/d3-interpolate/src/string.js");
/* unused harmony reexport interpolateString */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__transform_index__ = __webpack_require__("./node_modules/d3-interpolate/src/transform/index.js");
/* unused harmony reexport interpolateTransformCss */
/* unused harmony reexport interpolateTransformSvg */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__zoom__ = __webpack_require__("./node_modules/d3-interpolate/src/zoom.js");
/* unused harmony reexport interpolateZoom */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__rgb__ = __webpack_require__("./node_modules/d3-interpolate/src/rgb.js");
/* unused harmony reexport interpolateRgb */
/* unused harmony reexport interpolateRgbBasis */
/* unused harmony reexport interpolateRgbBasisClosed */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__hsl__ = __webpack_require__("./node_modules/d3-interpolate/src/hsl.js");
/* unused harmony reexport interpolateHsl */
/* unused harmony reexport interpolateHslLong */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__lab__ = __webpack_require__("./node_modules/d3-interpolate/src/lab.js");
/* unused harmony reexport interpolateLab */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__hcl__ = __webpack_require__("./node_modules/d3-interpolate/src/hcl.js");
/* unused harmony reexport interpolateHcl */
/* unused harmony reexport interpolateHclLong */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__cubehelix__ = __webpack_require__("./node_modules/d3-interpolate/src/cubehelix.js");
/* unused harmony reexport interpolateCubehelix */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_17__cubehelix__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__piecewise__ = __webpack_require__("./node_modules/d3-interpolate/src/piecewise.js");
/* unused harmony reexport piecewise */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__quantize__ = __webpack_require__("./node_modules/d3-interpolate/src/quantize.js");
/* unused harmony reexport quantize */






















/***/ }),

/***/ "./node_modules/d3-interpolate/src/lab.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__("./node_modules/d3-interpolate/src/color.js");



function lab(start, end) {
  var l = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])((start = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["e" /* lab */])(start)).l, (end = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["e" /* lab */])(end)).l),
      a = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.a, end.a),
      b = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.b, end.b),
      opacity = Object(__WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */])(start.opacity, end.opacity);
  return function(t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/number.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/object.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__value__ = __webpack_require__("./node_modules/d3-interpolate/src/value.js");


/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = Object(__WEBPACK_IMPORTED_MODULE_0__value__["a" /* default */])(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/piecewise.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function piecewise(interpolate, values) {
  var i = 0, n = values.length - 1, v = values[0], I = new Array(n < 0 ? 0 : n);
  while (i < n) I[i] = interpolate(v, v = values[++i]);
  return function(t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/quantize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
  return samples;
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/rgb.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export rgbBasis */
/* unused harmony export rgbBasisClosed */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__basis__ = __webpack_require__("./node_modules/d3-interpolate/src/basis.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__basisClosed__ = __webpack_require__("./node_modules/d3-interpolate/src/basisClosed.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__color__ = __webpack_require__("./node_modules/d3-interpolate/src/color.js");





/* harmony default export */ __webpack_exports__["a"] = ((function rgbGamma(y) {
  var color = Object(__WEBPACK_IMPORTED_MODULE_3__color__["b" /* gamma */])(y);

  function rgb(start, end) {
    var r = color((start = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["f" /* rgb */])(start)).r, (end = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["f" /* rgb */])(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = Object(__WEBPACK_IMPORTED_MODULE_3__color__["a" /* default */])(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;

  return rgb;
})(1));

function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i, color;
    for (i = 0; i < n; ++i) {
      color = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["f" /* rgb */])(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function(t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(__WEBPACK_IMPORTED_MODULE_1__basis__["b" /* default */]);
var rgbBasisClosed = rgbSpline(__WEBPACK_IMPORTED_MODULE_2__basisClosed__["a" /* default */]);


/***/ }),

/***/ "./node_modules/d3-interpolate/src/round.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/string.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__number__ = __webpack_require__("./node_modules/d3-interpolate/src/number.js");


var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/transform/decompose.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return identity; });
var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

/* harmony default export */ __webpack_exports__["a"] = (function(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/transform/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export interpolateTransformCss */
/* unused harmony export interpolateTransformSvg */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__number__ = __webpack_require__("./node_modules/d3-interpolate/src/number.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parse__ = __webpack_require__("./node_modules/d3-interpolate/src/transform/parse.js");



function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(xa, xb)}, {i: i - 2, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(xa, xb)}, {i: i - 2, x: Object(__WEBPACK_IMPORTED_MODULE_0__number__["a" /* default */])(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(__WEBPACK_IMPORTED_MODULE_1__parse__["a" /* parseCss */], "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(__WEBPACK_IMPORTED_MODULE_1__parse__["b" /* parseSvg */], ", ", ")", ")");


/***/ }),

/***/ "./node_modules/d3-interpolate/src/transform/parse.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parseCss;
/* harmony export (immutable) */ __webpack_exports__["b"] = parseSvg;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__decompose__ = __webpack_require__("./node_modules/d3-interpolate/src/transform/decompose.js");


var cssNode,
    cssRoot,
    cssView,
    svgNode;

function parseCss(value) {
  if (value === "none") return __WEBPACK_IMPORTED_MODULE_0__decompose__["b" /* identity */];
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return Object(__WEBPACK_IMPORTED_MODULE_0__decompose__["a" /* default */])(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return __WEBPACK_IMPORTED_MODULE_0__decompose__["b" /* identity */];
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return __WEBPACK_IMPORTED_MODULE_0__decompose__["b" /* identity */];
  value = value.matrix;
  return Object(__WEBPACK_IMPORTED_MODULE_0__decompose__["a" /* default */])(value.a, value.b, value.c, value.d, value.e, value.f);
}


/***/ }),

/***/ "./node_modules/d3-interpolate/src/value.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rgb__ = __webpack_require__("./node_modules/d3-interpolate/src/rgb.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__array__ = __webpack_require__("./node_modules/d3-interpolate/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__date__ = __webpack_require__("./node_modules/d3-interpolate/src/date.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__number__ = __webpack_require__("./node_modules/d3-interpolate/src/number.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__object__ = __webpack_require__("./node_modules/d3-interpolate/src/object.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__string__ = __webpack_require__("./node_modules/d3-interpolate/src/string.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__constant__ = __webpack_require__("./node_modules/d3-interpolate/src/constant.js");









/* harmony default export */ __webpack_exports__["a"] = (function(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? Object(__WEBPACK_IMPORTED_MODULE_7__constant__["a" /* default */])(b)
      : (t === "number" ? __WEBPACK_IMPORTED_MODULE_4__number__["a" /* default */]
      : t === "string" ? ((c = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["a" /* color */])(b)) ? (b = c, __WEBPACK_IMPORTED_MODULE_1__rgb__["a" /* default */]) : __WEBPACK_IMPORTED_MODULE_6__string__["a" /* default */])
      : b instanceof __WEBPACK_IMPORTED_MODULE_0_d3_color__["a" /* color */] ? __WEBPACK_IMPORTED_MODULE_1__rgb__["a" /* default */]
      : b instanceof Date ? __WEBPACK_IMPORTED_MODULE_3__date__["a" /* default */]
      : Array.isArray(b) ? __WEBPACK_IMPORTED_MODULE_2__array__["a" /* default */]
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? __WEBPACK_IMPORTED_MODULE_5__object__["a" /* default */]
      : __WEBPACK_IMPORTED_MODULE_4__number__["a" /* default */])(a, b);
});


/***/ }),

/***/ "./node_modules/d3-interpolate/src/zoom.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]
/* unused harmony default export */ var _unused_webpack_default_export = (function(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
      ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S;

  // Special case for u0 ≅ u1.
  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;
    i = function(t) {
      return [
        ux0 + t * dx,
        uy0 + t * dy,
        w0 * Math.exp(rho * t * S)
      ];
    }
  }

  // General case.
  else {
    var d1 = Math.sqrt(d2),
        b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
        b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
        r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
        r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (r1 - r0) / rho;
    i = function(t) {
      var s = t * S,
          coshr0 = cosh(r0),
          u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
      return [
        ux0 + u * dx,
        uy0 + u * dy,
        w0 * coshr0 / cosh(rho * s + r0)
      ];
    }
  }

  i.duration = S * 1000;

  return i;
});


/***/ }),

/***/ "./node_modules/d3-scale/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_band__ = __webpack_require__("./node_modules/d3-scale/src/band.js");
/* unused harmony reexport scaleBand */
/* unused harmony reexport scalePoint */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_identity__ = __webpack_require__("./node_modules/d3-scale/src/identity.js");
/* unused harmony reexport scaleIdentity */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_linear__ = __webpack_require__("./node_modules/d3-scale/src/linear.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__src_linear__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_log__ = __webpack_require__("./node_modules/d3-scale/src/log.js");
/* unused harmony reexport scaleLog */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_ordinal__ = __webpack_require__("./node_modules/d3-scale/src/ordinal.js");
/* unused harmony reexport scaleOrdinal */
/* unused harmony reexport scaleImplicit */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_pow__ = __webpack_require__("./node_modules/d3-scale/src/pow.js");
/* unused harmony reexport scalePow */
/* unused harmony reexport scaleSqrt */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_quantile__ = __webpack_require__("./node_modules/d3-scale/src/quantile.js");
/* unused harmony reexport scaleQuantile */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_quantize__ = __webpack_require__("./node_modules/d3-scale/src/quantize.js");
/* unused harmony reexport scaleQuantize */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__src_threshold__ = __webpack_require__("./node_modules/d3-scale/src/threshold.js");
/* unused harmony reexport scaleThreshold */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__src_time__ = __webpack_require__("./node_modules/d3-scale/src/time.js");
/* unused harmony reexport scaleTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__src_utcTime__ = __webpack_require__("./node_modules/d3-scale/src/utcTime.js");
/* unused harmony reexport scaleUtc */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__src_category10__ = __webpack_require__("./node_modules/d3-scale/src/category10.js");
/* unused harmony reexport schemeCategory10 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__src_category20b__ = __webpack_require__("./node_modules/d3-scale/src/category20b.js");
/* unused harmony reexport schemeCategory20b */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__src_category20c__ = __webpack_require__("./node_modules/d3-scale/src/category20c.js");
/* unused harmony reexport schemeCategory20c */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__src_category20__ = __webpack_require__("./node_modules/d3-scale/src/category20.js");
/* unused harmony reexport schemeCategory20 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__src_cubehelix__ = __webpack_require__("./node_modules/d3-scale/src/cubehelix.js");
/* unused harmony reexport interpolateCubehelixDefault */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__src_rainbow__ = __webpack_require__("./node_modules/d3-scale/src/rainbow.js");
/* unused harmony reexport interpolateRainbow */
/* unused harmony reexport interpolateWarm */
/* unused harmony reexport interpolateCool */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__src_viridis__ = __webpack_require__("./node_modules/d3-scale/src/viridis.js");
/* unused harmony reexport interpolateViridis */
/* unused harmony reexport interpolateMagma */
/* unused harmony reexport interpolateInferno */
/* unused harmony reexport interpolatePlasma */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__src_sequential__ = __webpack_require__("./node_modules/d3-scale/src/sequential.js");
/* unused harmony reexport scaleSequential */







































/***/ }),

/***/ "./node_modules/d3-scale/src/array.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return slice; });
var array = Array.prototype;

var map = array.map;
var slice = array.slice;


/***/ }),

/***/ "./node_modules/d3-scale/src/band.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* unused harmony export point */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ordinal__ = __webpack_require__("./node_modules/d3-scale/src/ordinal.js");



function band() {
  var scale = Object(__WEBPACK_IMPORTED_MODULE_1__ordinal__["a" /* default */])().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["f" /* range */])(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band()
        .domain(domain())
        .range(range)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return rescale();
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band().paddingInner(1));
}


/***/ }),

/***/ "./node_modules/d3-scale/src/category10.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__("./node_modules/d3-scale/src/colors.js");


/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"));


/***/ }),

/***/ "./node_modules/d3-scale/src/category20.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__("./node_modules/d3-scale/src/colors.js");


/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5"));


/***/ }),

/***/ "./node_modules/d3-scale/src/category20b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__("./node_modules/d3-scale/src/colors.js");


/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6"));


/***/ }),

/***/ "./node_modules/d3-scale/src/category20c.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__("./node_modules/d3-scale/src/colors.js");


/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9"));


/***/ }),

/***/ "./node_modules/d3-scale/src/colors.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
});


/***/ }),

/***/ "./node_modules/d3-scale/src/constant.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return function() {
    return x;
  };
});


/***/ }),

/***/ "./node_modules/d3-scale/src/continuous.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = deinterpolateLinear;
/* harmony export (immutable) */ __webpack_exports__["a"] = copy;
/* harmony export (immutable) */ __webpack_exports__["b"] = continuous;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__ = __webpack_require__("./node_modules/d3-interpolate/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constant__ = __webpack_require__("./node_modules/d3-scale/src/constant.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__number__ = __webpack_require__("./node_modules/d3-scale/src/number.js");






var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : Object(__WEBPACK_IMPORTED_MODULE_3__constant__["a" /* default */])(b);
}

function deinterpolateClamp(deinterpolate) {
  return function(a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function(a, b) {
    var r = reinterpolate(a = +a, b = +b);
    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
  };
}

function bimap(domain, range, deinterpolate, reinterpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
  else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range[i], range[i + 1]);
  }

  return function(x) {
    var i = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["b" /* bisect */])(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp());
}

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
      range = unit,
      interpolate = __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["a" /* interpolate */],
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
  }

  scale.invert = function(y) {
    return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = __WEBPACK_IMPORTED_MODULE_2__array__["a" /* map */].call(_, __WEBPACK_IMPORTED_MODULE_4__number__["a" /* default */]), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = __WEBPACK_IMPORTED_MODULE_2__array__["b" /* slice */].call(_), rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = __WEBPACK_IMPORTED_MODULE_2__array__["b" /* slice */].call(_), interpolate = __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["d" /* interpolateRound */], rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  return rescale();
}


/***/ }),

/***/ "./node_modules/d3-scale/src/cubehelix.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__ = __webpack_require__("./node_modules/d3-interpolate/src/index.js");



/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["b" /* interpolateCubehelixLong */])(Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(300, 0.5, 0.0), Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(-240, 0.5, 1.0)));


/***/ }),

/***/ "./node_modules/d3-scale/src/identity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__linear__ = __webpack_require__("./node_modules/d3-scale/src/linear.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__number__ = __webpack_require__("./node_modules/d3-scale/src/number.js");




function identity() {
  var domain = [0, 1];

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = __WEBPACK_IMPORTED_MODULE_0__array__["a" /* map */].call(_, __WEBPACK_IMPORTED_MODULE_2__number__["a" /* default */]), scale) : domain.slice();
  };

  scale.copy = function() {
    return identity().domain(domain);
  };

  return Object(__WEBPACK_IMPORTED_MODULE_1__linear__["b" /* linearish */])(scale);
}


/***/ }),

/***/ "./node_modules/d3-scale/src/linear.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = linearish;
/* harmony export (immutable) */ __webpack_exports__["a"] = linear;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__ = __webpack_require__("./node_modules/d3-interpolate/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__continuous__ = __webpack_require__("./node_modules/d3-scale/src/continuous.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tickFormat__ = __webpack_require__("./node_modules/d3-scale/src/tickFormat.js");





function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["i" /* ticks */])(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    return Object(__WEBPACK_IMPORTED_MODULE_3__tickFormat__["a" /* default */])(domain(), count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["g" /* tickIncrement */])(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["g" /* tickIncrement */])(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["g" /* tickIncrement */])(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = Object(__WEBPACK_IMPORTED_MODULE_2__continuous__["b" /* default */])(__WEBPACK_IMPORTED_MODULE_2__continuous__["c" /* deinterpolateLinear */], __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["c" /* interpolateNumber */]);

  scale.copy = function() {
    return Object(__WEBPACK_IMPORTED_MODULE_2__continuous__["a" /* copy */])(scale, linear());
  };

  return linearish(scale);
}


/***/ }),

/***/ "./node_modules/d3-scale/src/log.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_format__ = __webpack_require__("./node_modules/d3-format/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constant__ = __webpack_require__("./node_modules/d3-scale/src/constant.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nice__ = __webpack_require__("./node_modules/d3-scale/src/nice.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__continuous__ = __webpack_require__("./node_modules/d3-scale/src/continuous.js");






function deinterpolate(a, b) {
  return (b = Math.log(b / a))
      ? function(x) { return Math.log(x / a) / b; }
      : Object(__WEBPACK_IMPORTED_MODULE_2__constant__["a" /* default */])(b);
}

function reinterpolate(a, b) {
  return a < 0
      ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
      : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : function(x) { return Math.pow(base, x); };
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
}

function reflect(f) {
  return function(x) {
    return -f(-x);
  };
}

function log() {
  var scale = Object(__WEBPACK_IMPORTED_MODULE_4__continuous__["b" /* default */])(deinterpolate, reinterpolate).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function(count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["i" /* ticks */])(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["a" /* format */])(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function() {
    return domain(Object(__WEBPACK_IMPORTED_MODULE_3__nice__["a" /* default */])(domain(), {
      floor: function(x) { return pows(Math.floor(logs(x))); },
      ceil: function(x) { return pows(Math.ceil(logs(x))); }
    }));
  };

  scale.copy = function() {
    return Object(__WEBPACK_IMPORTED_MODULE_4__continuous__["a" /* copy */])(scale, log().base(base));
  };

  return scale;
}


/***/ }),

/***/ "./node_modules/d3-scale/src/nice.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
});


/***/ }),

/***/ "./node_modules/d3-scale/src/number.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return +x;
});


/***/ }),

/***/ "./node_modules/d3-scale/src/ordinal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export implicit */
/* harmony export (immutable) */ __webpack_exports__["a"] = ordinal;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_collection__ = __webpack_require__("./node_modules/d3-collection/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");



var implicit = {name: "implicit"};

function ordinal(range) {
  var index = Object(__WEBPACK_IMPORTED_MODULE_0_d3_collection__["a" /* map */])(),
      domain = [],
      unknown = implicit;

  range = range == null ? [] : __WEBPACK_IMPORTED_MODULE_1__array__["b" /* slice */].call(range);

  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = Object(__WEBPACK_IMPORTED_MODULE_0_d3_collection__["a" /* map */])();
    var i = -1, n = _.length, d, key;
    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? (range = __WEBPACK_IMPORTED_MODULE_1__array__["b" /* slice */].call(_), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return ordinal()
        .domain(domain)
        .range(range)
        .unknown(unknown);
  };

  return scale;
}


/***/ }),

/***/ "./node_modules/d3-scale/src/pow.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* unused harmony export sqrt */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constant__ = __webpack_require__("./node_modules/d3-scale/src/constant.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__linear__ = __webpack_require__("./node_modules/d3-scale/src/linear.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__continuous__ = __webpack_require__("./node_modules/d3-scale/src/continuous.js");




function raise(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

function pow() {
  var exponent = 1,
      scale = Object(__WEBPACK_IMPORTED_MODULE_2__continuous__["b" /* default */])(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (b = raise(b, exponent) - (a = raise(a, exponent)))
        ? function(x) { return (raise(x, exponent) - a) / b; }
        : Object(__WEBPACK_IMPORTED_MODULE_0__constant__["a" /* default */])(b);
  }

  function reinterpolate(a, b) {
    b = raise(b, exponent) - (a = raise(a, exponent));
    return function(t) { return raise(a + b * t, 1 / exponent); };
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function() {
    return Object(__WEBPACK_IMPORTED_MODULE_2__continuous__["a" /* copy */])(scale, pow().exponent(exponent));
  };

  return Object(__WEBPACK_IMPORTED_MODULE_1__linear__["b" /* linearish */])(scale);
}

function sqrt() {
  return pow().exponent(0.5);
}


/***/ }),

/***/ "./node_modules/d3-scale/src/quantile.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");



function quantile() {
  var domain = [],
      range = [],
      thresholds = [];

  function rescale() {
    var i = 0, n = Math.max(1, range.length);
    thresholds = new Array(n - 1);
    while (++i < n) thresholds[i - 1] = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["e" /* quantile */])(domain, i / n);
    return scale;
  }

  function scale(x) {
    if (!isNaN(x = +x)) return range[Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["b" /* bisect */])(thresholds, x)];
  }

  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : [
      i > 0 ? thresholds[i - 1] : domain[0],
      i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
    ];
  };

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [];
    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
    domain.sort(__WEBPACK_IMPORTED_MODULE_0_d3_array__["a" /* ascending */]);
    return rescale();
  };

  scale.range = function(_) {
    return arguments.length ? (range = __WEBPACK_IMPORTED_MODULE_1__array__["b" /* slice */].call(_), rescale()) : range.slice();
  };

  scale.quantiles = function() {
    return thresholds.slice();
  };

  scale.copy = function() {
    return quantile()
        .domain(domain)
        .range(range);
  };

  return scale;
}


/***/ }),

/***/ "./node_modules/d3-scale/src/quantize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__linear__ = __webpack_require__("./node_modules/d3-scale/src/linear.js");




function quantize() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range = [0, 1];

  function scale(x) {
    if (x <= x) return range[Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["b" /* bisect */])(domain, x, 0, n)];
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);
    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
    return scale;
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function(_) {
    return arguments.length ? (n = (range = __WEBPACK_IMPORTED_MODULE_1__array__["b" /* slice */].call(_)).length - 1, rescale()) : range.slice();
  };

  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN]
        : i < 1 ? [x0, domain[0]]
        : i >= n ? [domain[n - 1], x1]
        : [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return quantize()
        .domain([x0, x1])
        .range(range);
  };

  return Object(__WEBPACK_IMPORTED_MODULE_2__linear__["b" /* linearish */])(scale);
}


/***/ }),

/***/ "./node_modules/d3-scale/src/rainbow.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export warm */
/* unused harmony export cool */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_color__ = __webpack_require__("./node_modules/d3-color/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__ = __webpack_require__("./node_modules/d3-interpolate/src/index.js");



var warm = Object(__WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["b" /* interpolateCubehelixLong */])(Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(-100, 0.75, 0.35), Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(80, 1.50, 0.8));

var cool = Object(__WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["b" /* interpolateCubehelixLong */])(Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(260, 0.75, 0.35), Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])(80, 1.50, 0.8));

var rainbow = Object(__WEBPACK_IMPORTED_MODULE_0_d3_color__["b" /* cubehelix */])();

/* unused harmony default export */ var _unused_webpack_default_export = (function(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  rainbow.h = 360 * t - 100;
  rainbow.s = 1.5 - 1.5 * ts;
  rainbow.l = 0.8 - 0.9 * ts;
  return rainbow + "";
});


/***/ }),

/***/ "./node_modules/d3-scale/src/sequential.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__linear__ = __webpack_require__("./node_modules/d3-scale/src/linear.js");


function sequential(interpolator) {
  var x0 = 0,
      x1 = 1,
      clamp = false;

  function scale(x) {
    var t = (x - x0) / (x1 - x0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function() {
    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
  };

  return Object(__WEBPACK_IMPORTED_MODULE_0__linear__["b" /* linearish */])(scale);
}


/***/ }),

/***/ "./node_modules/d3-scale/src/threshold.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");



function threshold() {
  var domain = [0.5],
      range = [0, 1],
      n = 1;

  function scale(x) {
    if (x <= x) return range[Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["b" /* bisect */])(domain, x, 0, n)];
  }

  scale.domain = function(_) {
    return arguments.length ? (domain = __WEBPACK_IMPORTED_MODULE_1__array__["b" /* slice */].call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = __WEBPACK_IMPORTED_MODULE_1__array__["b" /* slice */].call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
  };

  scale.invertExtent = function(y) {
    var i = range.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return threshold()
        .domain(domain)
        .range(range);
  };

  return scale;
}


/***/ }),

/***/ "./node_modules/d3-scale/src/tickFormat.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_format__ = __webpack_require__("./node_modules/d3-format/src/index.js");



/* harmony default export */ __webpack_exports__["a"] = (function(domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["h" /* tickStep */])(start, stop, count == null ? 10 : count),
      precision;
  specifier = Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["c" /* formatSpecifier */])(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["e" /* precisionPrefix */])(step, value))) specifier.precision = precision;
      return Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["b" /* formatPrefix */])(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["f" /* precisionRound */])(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["d" /* precisionFixed */])(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return Object(__WEBPACK_IMPORTED_MODULE_1_d3_format__["a" /* format */])(specifier);
});


/***/ }),

/***/ "./node_modules/d3-scale/src/time.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = calendar;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_array__ = __webpack_require__("./node_modules/d3-array/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__ = __webpack_require__("./node_modules/d3-interpolate/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3_time__ = __webpack_require__("./node_modules/d3-time/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_d3_time_format__ = __webpack_require__("./node_modules/d3-time-format/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__array__ = __webpack_require__("./node_modules/d3-scale/src/array.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__continuous__ = __webpack_require__("./node_modules/d3-scale/src/continuous.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__nice__ = __webpack_require__("./node_modules/d3-scale/src/nice.js");








var durationSecond = 1000,
    durationMinute = durationSecond * 60,
    durationHour = durationMinute * 60,
    durationDay = durationHour * 24,
    durationWeek = durationDay * 7,
    durationMonth = durationDay * 30,
    durationYear = durationDay * 365;

function date(t) {
  return new Date(t);
}

function number(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
  var scale = Object(__WEBPACK_IMPORTED_MODULE_5__continuous__["b" /* default */])(__WEBPACK_IMPORTED_MODULE_5__continuous__["c" /* deinterpolateLinear */], __WEBPACK_IMPORTED_MODULE_1_d3_interpolate__["c" /* interpolateNumber */]),
      invert = scale.invert,
      domain = scale.domain;

  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");

  var tickIntervals = [
    [second,  1,      durationSecond],
    [second,  5,  5 * durationSecond],
    [second, 15, 15 * durationSecond],
    [second, 30, 30 * durationSecond],
    [minute,  1,      durationMinute],
    [minute,  5,  5 * durationMinute],
    [minute, 15, 15 * durationMinute],
    [minute, 30, 30 * durationMinute],
    [  hour,  1,      durationHour  ],
    [  hour,  3,  3 * durationHour  ],
    [  hour,  6,  6 * durationHour  ],
    [  hour, 12, 12 * durationHour  ],
    [   day,  1,      durationDay   ],
    [   day,  2,  2 * durationDay   ],
    [  week,  1,      durationWeek  ],
    [ month,  1,      durationMonth ],
    [ month,  3,  3 * durationMonth ],
    [  year,  1,      durationYear  ]
  ];

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond
        : minute(date) < date ? formatSecond
        : hour(date) < date ? formatMinute
        : day(date) < date ? formatHour
        : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year(date) < date ? formatMonth
        : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10;

    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.
    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["c" /* bisector */])(function(i) { return i[2]; }).right(tickIntervals, target);
      if (i === tickIntervals.length) {
        step = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["h" /* tickStep */])(start / durationYear, stop / durationYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = Object(__WEBPACK_IMPORTED_MODULE_0_d3_array__["h" /* tickStep */])(start, stop, interval);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(__WEBPACK_IMPORTED_MODULE_4__array__["a" /* map */].call(_, number)) : domain().map(date);
  };

  scale.ticks = function(interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
    return r ? t.reverse() : t;
  };

  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function(interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
        ? domain(Object(__WEBPACK_IMPORTED_MODULE_6__nice__["a" /* default */])(d, interval))
        : scale;
  };

  scale.copy = function() {
    return Object(__WEBPACK_IMPORTED_MODULE_5__continuous__["a" /* copy */])(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
  };

  return scale;
}

/* unused harmony default export */ var _unused_webpack_default_export = (function() {
  return calendar(__WEBPACK_IMPORTED_MODULE_2_d3_time__["k" /* timeYear */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["f" /* timeMonth */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["j" /* timeWeek */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["a" /* timeDay */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["b" /* timeHour */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["d" /* timeMinute */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["g" /* timeSecond */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["c" /* timeMillisecond */], __WEBPACK_IMPORTED_MODULE_3_d3_time_format__["a" /* timeFormat */]).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
});


/***/ }),

/***/ "./node_modules/d3-scale/src/utcTime.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__time__ = __webpack_require__("./node_modules/d3-scale/src/time.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_time_format__ = __webpack_require__("./node_modules/d3-time-format/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3_time__ = __webpack_require__("./node_modules/d3-time/src/index.js");




/* unused harmony default export */ var _unused_webpack_default_export = (function() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__time__["a" /* calendar */])(__WEBPACK_IMPORTED_MODULE_2_d3_time__["v" /* utcYear */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["q" /* utcMonth */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["u" /* utcWeek */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["l" /* utcDay */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["m" /* utcHour */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["o" /* utcMinute */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["r" /* utcSecond */], __WEBPACK_IMPORTED_MODULE_2_d3_time__["n" /* utcMillisecond */], __WEBPACK_IMPORTED_MODULE_1_d3_time_format__["b" /* utcFormat */]).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
});


/***/ }),

/***/ "./node_modules/d3-scale/src/viridis.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export magma */
/* unused harmony export inferno */
/* unused harmony export plasma */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__("./node_modules/d3-scale/src/colors.js");


function ramp(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

/* unused harmony default export */ var _unused_webpack_default_export = (ramp(Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725")));

var magma = ramp(Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(Object(__WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */])("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));


/***/ }),

/***/ "./node_modules/d3-time-format/src/defaultLocale.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return timeFormat; });
/* unused harmony export timeParse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return utcFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return utcParse; });
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locale__ = __webpack_require__("./node_modules/d3-time-format/src/locale.js");


var locale;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;

defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale = Object(__WEBPACK_IMPORTED_MODULE_0__locale__["a" /* default */])(definition);
  timeFormat = locale.format;
  timeParse = locale.parse;
  utcFormat = locale.utcFormat;
  utcParse = locale.utcParse;
  return locale;
}


/***/ }),

/***/ "./node_modules/d3-time-format/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__defaultLocale__ = __webpack_require__("./node_modules/d3-time-format/src/defaultLocale.js");
/* unused harmony reexport timeFormatDefaultLocale */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__defaultLocale__["a"]; });
/* unused harmony reexport timeParse */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__defaultLocale__["b"]; });
/* unused harmony reexport utcParse */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locale__ = __webpack_require__("./node_modules/d3-time-format/src/locale.js");
/* unused harmony reexport timeFormatLocale */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isoFormat__ = __webpack_require__("./node_modules/d3-time-format/src/isoFormat.js");
/* unused harmony reexport isoFormat */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isoParse__ = __webpack_require__("./node_modules/d3-time-format/src/isoParse.js");
/* unused harmony reexport isoParse */






/***/ }),

/***/ "./node_modules/d3-time-format/src/isoFormat.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isoSpecifier; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__defaultLocale__ = __webpack_require__("./node_modules/d3-time-format/src/defaultLocale.js");


var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : Object(__WEBPACK_IMPORTED_MODULE_0__defaultLocale__["b" /* utcFormat */])(isoSpecifier);

/* unused harmony default export */ var _unused_webpack_default_export = (formatIso);


/***/ }),

/***/ "./node_modules/d3-time-format/src/isoParse.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isoFormat__ = __webpack_require__("./node_modules/d3-time-format/src/isoFormat.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defaultLocale__ = __webpack_require__("./node_modules/d3-time-format/src/defaultLocale.js");



function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z")
    ? parseIsoNative
    : Object(__WEBPACK_IMPORTED_MODULE_1__defaultLocale__["c" /* utcParse */])(__WEBPACK_IMPORTED_MODULE_0__isoFormat__["a" /* isoSpecifier */]);

/* unused harmony default export */ var _unused_webpack_default_export = (parseIso);


/***/ }),

/***/ "./node_modules/d3-time-format/src/locale.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = formatLocale;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3_time__ = __webpack_require__("./node_modules/d3-time/src/index.js");


function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function(string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0),
          week, day;
      if (i != string.length) return null;

      // If a UNIX timestamp is specified, return it.
      if ("Q" in d) return new Date(d.Q);

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newYear(d.y)), day = week.getUTCDay();
          week = day > 4 || day === 0 ? __WEBPACK_IMPORTED_MODULE_0_d3_time__["p" /* utcMonday */].ceil(week) : Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["p" /* utcMonday */])(week);
          week = __WEBPACK_IMPORTED_MODULE_0_d3_time__["l" /* utcDay */].offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = newDate(newYear(d.y)), day = week.getDay();
          week = day > 4 || day === 0 ? __WEBPACK_IMPORTED_MODULE_0_d3_time__["e" /* timeMonday */].ceil(week) : Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["e" /* timeMonday */])(week);
          week = __WEBPACK_IMPORTED_MODULE_0_d3_time__["a" /* timeDay */].offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() { return specifier; };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", localDate);
      p.toString = function() { return specifier; };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() { return specifier; };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier, utcDate);
      p.toString = function() { return specifier; };
      return p;
    }
  };
}

var pads = {"-": "", "_": " ", "0": "0"},
    numberRe = /^\s*\d+/, // note: ignores next directive
    percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {}, i = -1, n = names.length;
  while (++i < n) map[names[i].toLowerCase()] = i;
  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + __WEBPACK_IMPORTED_MODULE_0_d3_time__["a" /* timeDay */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["k" /* timeYear */])(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day = d.getDay();
  return day === 0 ? 7 : day;
}

function formatWeekNumberSunday(d, p) {
  return pad(__WEBPACK_IMPORTED_MODULE_0_d3_time__["h" /* timeSunday */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["k" /* timeYear */])(d), d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day = d.getDay();
  d = (day >= 4 || day === 0) ? Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["i" /* timeThursday */])(d) : __WEBPACK_IMPORTED_MODULE_0_d3_time__["i" /* timeThursday */].ceil(d);
  return pad(__WEBPACK_IMPORTED_MODULE_0_d3_time__["i" /* timeThursday */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["k" /* timeYear */])(d), d) + (Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["k" /* timeYear */])(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(__WEBPACK_IMPORTED_MODULE_0_d3_time__["e" /* timeMonday */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["k" /* timeYear */])(d), d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad(z / 60 | 0, "0", 2)
      + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + __WEBPACK_IMPORTED_MODULE_0_d3_time__["l" /* utcDay */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["v" /* utcYear */])(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(__WEBPACK_IMPORTED_MODULE_0_d3_time__["s" /* utcSunday */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["v" /* utcYear */])(d), d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day = d.getUTCDay();
  d = (day >= 4 || day === 0) ? Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["t" /* utcThursday */])(d) : __WEBPACK_IMPORTED_MODULE_0_d3_time__["t" /* utcThursday */].ceil(d);
  return pad(__WEBPACK_IMPORTED_MODULE_0_d3_time__["t" /* utcThursday */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["v" /* utcYear */])(d), d) + (Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["v" /* utcYear */])(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(__WEBPACK_IMPORTED_MODULE_0_d3_time__["p" /* utcMonday */].count(Object(__WEBPACK_IMPORTED_MODULE_0_d3_time__["v" /* utcYear */])(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}


/***/ }),

/***/ "./node_modules/d3-time/src/day.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export days */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var day = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */]) / __WEBPACK_IMPORTED_MODULE_1__duration__["a" /* durationDay */];
}, function(date) {
  return date.getDate() - 1;
});

/* harmony default export */ __webpack_exports__["a"] = (day);
var days = day.range;


/***/ }),

/***/ "./node_modules/d3-time/src/duration.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return durationSecond; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return durationMinute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return durationHour; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return durationDay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return durationWeek; });
var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationDay = 864e5;
var durationWeek = 6048e5;


/***/ }),

/***/ "./node_modules/d3-time/src/hour.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export hours */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var hour = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * __WEBPACK_IMPORTED_MODULE_1__duration__["d" /* durationSecond */] - date.getMinutes() * __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */]);
}, function(date, step) {
  date.setTime(+date + step * __WEBPACK_IMPORTED_MODULE_1__duration__["b" /* durationHour */]);
}, function(start, end) {
  return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["b" /* durationHour */];
}, function(date) {
  return date.getHours();
});

/* harmony default export */ __webpack_exports__["a"] = (hour);
var hours = hour.range;


/***/ }),

/***/ "./node_modules/d3-time/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* unused harmony reexport timeInterval */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__millisecond__ = __webpack_require__("./node_modules/d3-time/src/millisecond.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__millisecond__["a"]; });
/* unused harmony reexport timeMilliseconds */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return __WEBPACK_IMPORTED_MODULE_1__millisecond__["a"]; });
/* unused harmony reexport utcMilliseconds */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__second__ = __webpack_require__("./node_modules/d3-time/src/second.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_2__second__["a"]; });
/* unused harmony reexport timeSeconds */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return __WEBPACK_IMPORTED_MODULE_2__second__["a"]; });
/* unused harmony reexport utcSeconds */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__minute__ = __webpack_require__("./node_modules/d3-time/src/minute.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__minute__["a"]; });
/* unused harmony reexport timeMinutes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hour__ = __webpack_require__("./node_modules/d3-time/src/hour.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_4__hour__["a"]; });
/* unused harmony reexport timeHours */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__day__ = __webpack_require__("./node_modules/d3-time/src/day.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_5__day__["a"]; });
/* unused harmony reexport timeDays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__week__ = __webpack_require__("./node_modules/d3-time/src/week.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return __WEBPACK_IMPORTED_MODULE_6__week__["b"]; });
/* unused harmony reexport timeWeeks */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_6__week__["b"]; });
/* unused harmony reexport timeSundays */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_6__week__["a"]; });
/* unused harmony reexport timeMondays */
/* unused harmony reexport timeTuesday */
/* unused harmony reexport timeTuesdays */
/* unused harmony reexport timeWednesday */
/* unused harmony reexport timeWednesdays */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_6__week__["c"]; });
/* unused harmony reexport timeThursdays */
/* unused harmony reexport timeFriday */
/* unused harmony reexport timeFridays */
/* unused harmony reexport timeSaturday */
/* unused harmony reexport timeSaturdays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__month__ = __webpack_require__("./node_modules/d3-time/src/month.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_7__month__["a"]; });
/* unused harmony reexport timeMonths */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__year__ = __webpack_require__("./node_modules/d3-time/src/year.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return __WEBPACK_IMPORTED_MODULE_8__year__["a"]; });
/* unused harmony reexport timeYears */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utcMinute__ = __webpack_require__("./node_modules/d3-time/src/utcMinute.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return __WEBPACK_IMPORTED_MODULE_9__utcMinute__["a"]; });
/* unused harmony reexport utcMinutes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utcHour__ = __webpack_require__("./node_modules/d3-time/src/utcHour.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return __WEBPACK_IMPORTED_MODULE_10__utcHour__["a"]; });
/* unused harmony reexport utcHours */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utcDay__ = __webpack_require__("./node_modules/d3-time/src/utcDay.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return __WEBPACK_IMPORTED_MODULE_11__utcDay__["a"]; });
/* unused harmony reexport utcDays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utcWeek__ = __webpack_require__("./node_modules/d3-time/src/utcWeek.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return __WEBPACK_IMPORTED_MODULE_12__utcWeek__["b"]; });
/* unused harmony reexport utcWeeks */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return __WEBPACK_IMPORTED_MODULE_12__utcWeek__["b"]; });
/* unused harmony reexport utcSundays */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return __WEBPACK_IMPORTED_MODULE_12__utcWeek__["a"]; });
/* unused harmony reexport utcMondays */
/* unused harmony reexport utcTuesday */
/* unused harmony reexport utcTuesdays */
/* unused harmony reexport utcWednesday */
/* unused harmony reexport utcWednesdays */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return __WEBPACK_IMPORTED_MODULE_12__utcWeek__["c"]; });
/* unused harmony reexport utcThursdays */
/* unused harmony reexport utcFriday */
/* unused harmony reexport utcFridays */
/* unused harmony reexport utcSaturday */
/* unused harmony reexport utcSaturdays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utcMonth__ = __webpack_require__("./node_modules/d3-time/src/utcMonth.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return __WEBPACK_IMPORTED_MODULE_13__utcMonth__["a"]; });
/* unused harmony reexport utcMonths */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__utcYear__ = __webpack_require__("./node_modules/d3-time/src/utcYear.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return __WEBPACK_IMPORTED_MODULE_14__utcYear__["a"]; });
/* unused harmony reexport utcYears */































/***/ }),

/***/ "./node_modules/d3-time/src/interval.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = newInterval;
var t0 = new Date,
    t1 = new Date;

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}


/***/ }),

/***/ "./node_modules/d3-time/src/millisecond.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export milliseconds */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");


var millisecond = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};

/* harmony default export */ __webpack_exports__["a"] = (millisecond);
var milliseconds = millisecond.range;


/***/ }),

/***/ "./node_modules/d3-time/src/minute.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export minutes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var minute = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * __WEBPACK_IMPORTED_MODULE_1__duration__["d" /* durationSecond */]);
}, function(date, step) {
  date.setTime(+date + step * __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */]);
}, function(start, end) {
  return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */];
}, function(date) {
  return date.getMinutes();
});

/* harmony default export */ __webpack_exports__["a"] = (minute);
var minutes = minute.range;


/***/ }),

/***/ "./node_modules/d3-time/src/month.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export months */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");


var month = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});

/* harmony default export */ __webpack_exports__["a"] = (month);
var months = month.range;


/***/ }),

/***/ "./node_modules/d3-time/src/second.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export seconds */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var second = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * __WEBPACK_IMPORTED_MODULE_1__duration__["d" /* durationSecond */]);
}, function(start, end) {
  return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["d" /* durationSecond */];
}, function(date) {
  return date.getUTCSeconds();
});

/* harmony default export */ __webpack_exports__["a"] = (second);
var seconds = second.range;


/***/ }),

/***/ "./node_modules/d3-time/src/utcDay.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export utcDays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var utcDay = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["a" /* durationDay */];
}, function(date) {
  return date.getUTCDate() - 1;
});

/* harmony default export */ __webpack_exports__["a"] = (utcDay);
var utcDays = utcDay.range;


/***/ }),

/***/ "./node_modules/d3-time/src/utcHour.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export utcHours */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var utcHour = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * __WEBPACK_IMPORTED_MODULE_1__duration__["b" /* durationHour */]);
}, function(start, end) {
  return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["b" /* durationHour */];
}, function(date) {
  return date.getUTCHours();
});

/* harmony default export */ __webpack_exports__["a"] = (utcHour);
var utcHours = utcHour.range;


/***/ }),

/***/ "./node_modules/d3-time/src/utcMinute.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export utcMinutes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



var utcMinute = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */]);
}, function(start, end) {
  return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */];
}, function(date) {
  return date.getUTCMinutes();
});

/* harmony default export */ __webpack_exports__["a"] = (utcMinute);
var utcMinutes = utcMinute.range;


/***/ }),

/***/ "./node_modules/d3-time/src/utcMonth.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export utcMonths */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");


var utcMonth = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});

/* harmony default export */ __webpack_exports__["a"] = (utcMonth);
var utcMonths = utcMonth.range;


/***/ }),

/***/ "./node_modules/d3-time/src/utcWeek.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return utcSunday; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return utcMonday; });
/* unused harmony export utcTuesday */
/* unused harmony export utcWednesday */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return utcThursday; });
/* unused harmony export utcFriday */
/* unused harmony export utcSaturday */
/* unused harmony export utcSundays */
/* unused harmony export utcMondays */
/* unused harmony export utcTuesdays */
/* unused harmony export utcWednesdays */
/* unused harmony export utcThursdays */
/* unused harmony export utcFridays */
/* unused harmony export utcSaturdays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



function utcWeekday(i) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / __WEBPACK_IMPORTED_MODULE_1__duration__["e" /* durationWeek */];
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;


/***/ }),

/***/ "./node_modules/d3-time/src/utcYear.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export utcYears */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");


var utcYear = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

/* harmony default export */ __webpack_exports__["a"] = (utcYear);
var utcYears = utcYear.range;


/***/ }),

/***/ "./node_modules/d3-time/src/week.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return sunday; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return monday; });
/* unused harmony export tuesday */
/* unused harmony export wednesday */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return thursday; });
/* unused harmony export friday */
/* unused harmony export saturday */
/* unused harmony export sundays */
/* unused harmony export mondays */
/* unused harmony export tuesdays */
/* unused harmony export wednesdays */
/* unused harmony export thursdays */
/* unused harmony export fridays */
/* unused harmony export saturdays */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__duration__ = __webpack_require__("./node_modules/d3-time/src/duration.js");



function weekday(i) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * __WEBPACK_IMPORTED_MODULE_1__duration__["c" /* durationMinute */]) / __WEBPACK_IMPORTED_MODULE_1__duration__["e" /* durationWeek */];
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var sundays = sunday.range;
var mondays = monday.range;
var tuesdays = tuesday.range;
var wednesdays = wednesday.range;
var thursdays = thursday.range;
var fridays = friday.range;
var saturdays = saturday.range;


/***/ }),

/***/ "./node_modules/d3-time/src/year.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export years */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interval__ = __webpack_require__("./node_modules/d3-time/src/interval.js");


var year = Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : Object(__WEBPACK_IMPORTED_MODULE_0__interval__["a" /* default */])(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

/* harmony default export */ __webpack_exports__["a"] = (year);
var years = year.range;


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Annotation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

var _utils = __webpack_require__("./node_modules/react-simple-maps/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Annotation = function (_Component) {
  _inherits(Annotation, _Component);

  function Annotation() {
    _classCallCheck(this, Annotation);

    return _possibleConstructorReturn(this, (Annotation.__proto__ || Object.getPrototypeOf(Annotation)).apply(this, arguments));
  }

  _createClass(Annotation, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          projection = _props.projection,
          subject = _props.subject,
          style = _props.style,
          hiddenStyle = _props.hiddenStyle,
          dx = _props.dx,
          dy = _props.dy,
          zoom = _props.zoom,
          stroke = _props.stroke,
          strokeWidth = _props.strokeWidth,
          children = _props.children,
          curve = _props.curve,
          markerEnd = _props.markerEnd,
          width = _props.width,
          height = _props.height;


      var connectorPath = (0, _utils.createConnectorPath)(null, [-dx / zoom, -dy / zoom], curve);
      var translation = projection(subject);

      var lineString = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [projection.invert([width / 2, height / 2]), subject]
        }
      };

      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && (0, _d3Geo.geoLength)(lineString) > radians;

      return _react2.default.createElement(
        "g",
        {
          className: "rsm-annotation",
          style: isHidden ? _extends({}, style, hiddenStyle) : style,
          transform: "translate(\n          " + (translation[0] + dx / zoom) + "\n          " + (translation[1] + dy / zoom) + "\n        )",
          textAnchor: (0, _utils.createTextAnchor)(dx)
        },
        children,
        _react2.default.createElement("path", {
          d: connectorPath,
          stroke: stroke,
          strokeWidth: strokeWidth,
          fill: "none",
          markerEnd: markerEnd
        })
      );
    }
  }]);

  return Annotation;
}(_react.Component);

Annotation.defaultProps = {
  curve: 0,
  markerEnd: "none",
  componentIdentifier: "Annotation",
  stroke: "#000000",
  strokeWidth: 1,
  zoom: 1
};

exports.default = Annotation;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Annotations.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _MapGroup = __webpack_require__("./node_modules/react-simple-maps/lib/MapGroup.js");

var _MapGroup2 = _interopRequireDefault(_MapGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Annotations = function Annotations(_ref) {
  var groupName = _ref.groupName,
      itemName = _ref.itemName,
      componentIdentifier = _ref.componentIdentifier,
      restProps = _objectWithoutProperties(_ref, ["groupName", "itemName", "componentIdentifier"]);

  return _react2.default.createElement(_MapGroup2.default, _extends({
    groupName: groupName,
    itemName: itemName
  }, restProps));
};

Annotations.defaultProps = {
  componentIdentifier: "Annotations",
  groupName: "annotations",
  itemName: "annotation"
};

exports.default = Annotations;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/ComposableMap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _projections = __webpack_require__("./node_modules/react-simple-maps/lib/projections.js");

var _projections2 = _interopRequireDefault(_projections);

var _projectionConfig = __webpack_require__("./node_modules/react-simple-maps/lib/projectionConfig.js");

var _projectionConfig2 = _interopRequireDefault(_projectionConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComposableMap = function (_Component) {
  _inherits(ComposableMap, _Component);

  function ComposableMap() {
    _classCallCheck(this, ComposableMap);

    var _this = _possibleConstructorReturn(this, (ComposableMap.__proto__ || Object.getPrototypeOf(ComposableMap)).call(this));

    _this.projection = _this.projection.bind(_this);
    return _this;
  }

  _createClass(ComposableMap, [{
    key: "projection",
    value: function projection() {
      var _props = this.props,
          projection = _props.projection,
          projectionConfig = _props.projectionConfig,
          width = _props.width,
          height = _props.height;


      return typeof projection !== "function" ? (0, _projections2.default)(width, height, projectionConfig, projection) : projection(width, height, projectionConfig);
    }
  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          style = _props2.style,
          className = _props2.className,
          showCenter = _props2.showCenter,
          children = _props2.children,
          aspectRatio = _props2.aspectRatio,
          viewBox = _props2.viewBox,
          defs = _props2.defs;


      return _react2.default.createElement(
        "svg",
        { width: width,
          height: height,
          viewBox: viewBox ? viewBox : "0 0 " + width + " " + height,
          className: "rsm-svg " + (className || ''),
          style: style,
          preserveAspectRatio: aspectRatio },
        defs && _react2.default.createElement(
          "defs",
          null,
          defs
        ),
        _react2.default.cloneElement(this.props.children, {
          projection: this.projection(),
          width: width,
          height: height
        }),
        showCenter && _react2.default.createElement(
          "g",
          null,
          _react2.default.createElement("rect", { x: width / 2 - 0.5, y: 0, width: 1, height: height, fill: "#e91e63" }),
          _react2.default.createElement("rect", { x: 0, y: height / 2 - 0.5, width: width, height: 1, fill: "#e91e63" })
        )
      );
    }
  }]);

  return ComposableMap;
}(_react.Component);

ComposableMap.defaultProps = {
  width: 800,
  height: 450,
  projection: "times",
  projectionConfig: _projectionConfig2.default,
  aspectRatio: "xMidYMid",
  viewBox: null
};

exports.default = ComposableMap;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Geographies.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _topojsonClient = __webpack_require__("./node_modules/topojson-client/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geographies = function (_Component) {
  _inherits(Geographies, _Component);

  function Geographies(props) {
    _classCallCheck(this, Geographies);

    var _this = _possibleConstructorReturn(this, (Geographies.__proto__ || Object.getPrototypeOf(Geographies)).call(this, props));

    _this.state = {
      geographyPaths: _this.shouldFetchGeographies(props.geography) ? [] : _this.parseGeographies(props.geography)
    };
    return _this;
  }

  _createClass(Geographies, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.geography !== this.props.geography) {
        if (this.shouldFetchGeographies(nextProps.geography)) {
          this.fetchGeographies(nextProps.geography);
        } else {
          this.setState({
            geographyPaths: this.parseGeographies(nextProps.geography)
          });
        }
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var geoPathsChanged = nextState.geographyPaths.length !== this.state.geographyPaths.length;
      return geoPathsChanged || nextProps.disableOptimization;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.geographyUrl || this.props.geographyPaths) {
        console.warn("You are using the deprecated geographyUrl or geographyPaths props. Use the new geography prop instead. Check out the new docs here: https://github.com/zcreativelabs/react-simple-maps#Geographies-component");
      }
      if (this.shouldFetchGeographies(this.props.geography)) {
        this.fetchGeographies(this.props.geography);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancelPendingRequest();
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          projection = _props.projection,
          style = _props.style,
          children = _props.children;

      return _react2.default.createElement(
        "g",
        { className: "rsm-geographies", style: style },
        children(this.state.geographyPaths || [], projection)
      );
    }
  }, {
    key: "shouldFetchGeographies",
    value: function shouldFetchGeographies(geography) {
      return typeof geography === 'string';
    }
  }, {
    key: "parseGeographies",
    value: function parseGeographies(geography) {
      if (Array.isArray(geography)) {
        return geography;
      }

      if (Object.prototype.toString.call(geography) === '[object Object]') {
        return (0, _topojsonClient.feature)(geography, geography.objects[Object.keys(geography.objects)[0]]).features;
      }

      return [];
    }
  }, {
    key: "fetchGeographies",
    value: function fetchGeographies(geography) {
      var _this2 = this;

      var request = new XMLHttpRequest();
      request.open("GET", geography, true);
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var geographyPaths = JSON.parse(request.responseText);
          _this2.setState({
            geographyPaths: _this2.parseGeographies(geographyPaths)
          }, function () {
            if (_this2.props.onGeographyPathsLoaded) {
              _this2.props.onGeographyPathsLoaded(String(request.status));
            }
          });
        } else {
          if (_this2.props.onGeographyPathsLoaded) {
            _this2.props.onGeographyPathsLoaded(String(request.status));
          }
        }
      };
      request.onerror = function () {
        console.log("There was a connection error...");
      };
      request.send();

      this.cancelPendingRequest();
      this._xhr = request;
    }
  }, {
    key: "cancelPendingRequest",
    value: function cancelPendingRequest() {
      if (this._xhr) {
        this._xhr.abort();
        this._xhr = null;
      }
    }
  }]);

  return Geographies;
}(_react.Component);

Geographies.defaultProps = {
  componentIdentifier: "Geographies",
  disableOptimization: false,
  geography: ""
};

exports.default = Geographies;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Geography.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

var _utils = __webpack_require__("./node_modules/react-simple-maps/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pathCache = {};

var renderPath = function renderPath(cacheId, geography, projection, round, precision) {
  if (pathCache[cacheId]) return pathCache[cacheId];

  var pathString = cacheId ? pathCache[cacheId] ? pathCache[cacheId] : round ? (0, _utils.roundPath)((0, _d3Geo.geoPath)().projection(projection)(geography), precision) : (0, _d3Geo.geoPath)().projection(projection)(geography) : round ? (0, _utils.roundPath)((0, _d3Geo.geoPath)().projection(projection)(geography), precision) : (0, _d3Geo.geoPath)().projection(projection)(geography);

  if (cacheId) pathCache[cacheId] = pathString;

  return pathString;
};

var Geography = function (_Component) {
  _inherits(Geography, _Component);

  function Geography() {
    _classCallCheck(this, Geography);

    var _this = _possibleConstructorReturn(this, (Geography.__proto__ || Object.getPrototypeOf(Geography)).call(this));

    _this.state = {
      hover: false,
      pressed: false
    };

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseClick = _this.handleMouseClick.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    return _this;
  }

  _createClass(Geography, [{
    key: "handleMouseClick",
    value: function handleMouseClick(evt) {
      evt.persist();
      var _props = this.props,
          onClick = _props.onClick,
          geography = _props.geography;

      return onClick && onClick(geography, evt);
    }
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      evt.persist();
      var _props2 = this.props,
          onMouseEnter = _props2.onMouseEnter,
          geography = _props2.geography;

      this.setState({
        hover: true
      }, function () {
        return onMouseEnter && onMouseEnter(geography, evt);
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(evt) {
      evt.persist();
      if (this.state.pressed) return;
      var _props3 = this.props,
          onMouseMove = _props3.onMouseMove,
          geography = _props3.geography;

      if (!this.state.hover) {
        this.setState({
          hover: true
        }, function () {
          return onMouseMove && onMouseMove(geography, evt);
        });
      } else if (onMouseMove) onMouseMove(geography, evt);else return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(evt) {
      evt.persist();
      var _props4 = this.props,
          onMouseLeave = _props4.onMouseLeave,
          geography = _props4.geography;

      this.setState({
        hover: false,
        pressed: false
      }, function () {
        return onMouseLeave && onMouseLeave(geography, evt);
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(evt) {
      evt.persist();
      var _props5 = this.props,
          onMouseDown = _props5.onMouseDown,
          geography = _props5.geography;

      this.setState({
        pressed: true
      }, function () {
        return onMouseDown && onMouseDown(geography, evt);
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      evt.persist();
      var _props6 = this.props,
          onMouseUp = _props6.onMouseUp,
          geography = _props6.geography;

      this.setState({
        pressed: false
      }, function () {
        return onMouseUp && onMouseUp(geography, evt);
      });
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _props7 = this.props,
          onFocus = _props7.onFocus,
          geography = _props7.geography;

      this.setState({
        hover: true
      }, function () {
        return onFocus && onFocus(geography, evt);
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(evt) {
      evt.persist();
      var _props8 = this.props,
          onBlur = _props8.onBlur,
          geography = _props8.geography;

      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(geography, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props9 = this.props,
          geography = _props9.geography,
          projection = _props9.projection,
          round = _props9.round,
          cacheId = _props9.cacheId,
          precision = _props9.precision,
          tabable = _props9.tabable,
          style = _props9.style;
      var _state = this.state,
          hover = _state.hover,
          pressed = _state.pressed;


      var pathString = renderPath(cacheId, geography, projection, round, precision);

      var excludeProps = ["geography", "projection", "round", "cacheId", "precision", "tabable", "style", "onClick", "onMouseEnter", "onMouseMove", "onMouseLeave", "onMouseDown", "onMouseUp", "onFocus", "onBlur"];

      var restProps = Object.keys(this.props).filter(function (key) {
        return excludeProps.indexOf(key) === -1;
      }).reduce(function (obj, key) {
        obj[key] = _this2.props[key];
        return obj;
      }, {});

      return _react2.default.createElement("path", _extends({
        d: pathString,
        className: "rsm-geography" + (pressed ? " rsm-geography--pressed" : "") + (hover ? " rsm-geography--hover" : ""),
        style: style[pressed || hover ? pressed ? "pressed" : "hover" : "default"],
        onClick: this.handleMouseClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseMove: this.handleMouseMove,
        onMouseLeave: this.handleMouseLeave,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        tabIndex: tabable ? 0 : -1
      }, restProps));
    }
  }]);

  return Geography;
}(_react.Component);

Geography.defaultProps = {
  precision: 0.1,
  cacheId: null,
  round: false,
  tabable: true,
  style: {
    default: {},
    hover: {},
    pressed: {}
  }
};

exports.default = Geography;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Graticule.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

var _utils = __webpack_require__("./node_modules/react-simple-maps/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var computeGraticule = function computeGraticule(projection, step) {
  return (0, _d3Geo.geoPath)().projection(projection)((0, _d3Geo.geoGraticule)().step(step)());
};

var computeOutline = function computeOutline(projection) {
  return (0, _d3Geo.geoPath)().projection(projection)((0, _d3Geo.geoGraticule)().outline());
};

var Graticule = function (_Component) {
  _inherits(Graticule, _Component);

  function Graticule() {
    _classCallCheck(this, Graticule);

    var _this = _possibleConstructorReturn(this, (Graticule.__proto__ || Object.getPrototypeOf(Graticule)).call(this));

    _this.state = {
      renderGraticule: false,
      graticulePath: "",
      outlinePath: ""
    };
    _this.renderGraticule = _this.renderGraticule.bind(_this);
    return _this;
  }

  _createClass(Graticule, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.renderGraticule();
    }
  }, {
    key: "renderGraticule",
    value: function renderGraticule() {
      var _props = this.props,
          step = _props.step,
          projection = _props.projection,
          round = _props.round,
          precision = _props.precision;


      this.setState({
        renderGraticule: true,
        graticulePath: round ? (0, _utils.roundPath)(computeGraticule(projection, step), precision) : computeGraticule(projection, step),
        outlinePath: round ? (0, _utils.roundPath)(computeOutline(projection), precision) : computeOutline(projection)
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _props2 = this.props,
          step = _props2.step,
          projection = _props2.projection,
          round = _props2.round,
          precision = _props2.precision,
          globe = _props2.globe;


      if (nextProps.round !== round || nextProps.precision !== precision || globe) {
        this.setState({
          graticulePath: nextProps.round ? (0, _utils.roundPath)(computeGraticule(projection, step), precision) : computeGraticule(projection, step),
          outlinePath: nextProps.round ? (0, _utils.roundPath)(computeOutline(projection), precision) : computeOutline(projection)
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.disableOptimization;
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          zoom = _props3.zoom,
          style = _props3.style,
          outline = _props3.outline,
          fill = _props3.fill,
          stroke = _props3.stroke;


      return this.state.renderGraticule && _react2.default.createElement(
        "g",
        { className: "rsm-graticule" },
        _react2.default.createElement("path", {
          fill: fill,
          stroke: stroke,
          d: this.state.graticulePath,
          style: style
        }),
        outline && _react2.default.createElement("path", {
          fill: fill,
          stroke: stroke,
          d: this.state.outlinePath,
          style: style
        })
      );
    }
  }]);

  return Graticule;
}(_react.Component);

Graticule.defaultProps = {
  componentIdentifier: "Graticule",
  disableOptimization: true,
  globe: false,
  round: true,
  precision: 0.1,
  step: [10, 10],
  outline: true,
  stroke: "#DDDDDD",
  fill: "transparent",
  style: {
    pointerEvents: "none"
  }
};

exports.default = Graticule;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Line.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Line = function (_Component) {
  _inherits(Line, _Component);

  function Line(props) {
    _classCallCheck(this, Line);

    var _this = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, props));

    _this.state = {
      hover: false,
      pressed: false
    };

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseClick = _this.handleMouseClick.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    return _this;
  }

  _createClass(Line, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      evt.persist();
      var _props = this.props,
          onMouseEnter = _props.onMouseEnter,
          line = _props.line;

      this.setState({
        hover: true
      }, function () {
        return onMouseEnter && onMouseEnter(line, evt);
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(evt) {
      evt.persist();
      if (this.state.pressed) return;
      var _props2 = this.props,
          onMouseMove = _props2.onMouseMove,
          line = _props2.line;

      if (!this.state.hover) {
        this.setState({
          hover: true
        }, function () {
          return onMouseMove && onMouseMove(line, evt);
        });
      } else if (onMouseMove) onMouseMove(line, evt);else return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(evt) {
      evt.persist();
      var _props3 = this.props,
          onMouseLeave = _props3.onMouseLeave,
          line = _props3.line;

      this.setState({
        hover: false
      }, function () {
        return onMouseLeave && onMouseLeave(line, evt);
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(evt) {
      evt.persist();
      var _props4 = this.props,
          onMouseDown = _props4.onMouseDown,
          line = _props4.line;

      this.setState({
        pressed: true
      }, function () {
        return onMouseDown && onMouseDown(line, evt);
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      evt.persist();
      var _props5 = this.props,
          onMouseUp = _props5.onMouseUp,
          line = _props5.line;

      this.setState({
        pressed: false
      }, function () {
        return onMouseUp && onMouseUp(line, evt);
      });
    }
  }, {
    key: "handleMouseClick",
    value: function handleMouseClick(evt) {
      if (!this.props.onClick) return;
      evt.persist();
      var _props6 = this.props,
          onClick = _props6.onClick,
          line = _props6.line,
          projection = _props6.projection;

      return onClick && onClick(line, [projection(line.coordinates.start), projection(line.coordinates.end)], evt);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _props7 = this.props,
          onFocus = _props7.onFocus,
          line = _props7.line;

      this.setState({
        hover: true
      }, function () {
        return onFocus && onFocus(line, evt);
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(evt) {
      evt.persist();
      var _props8 = this.props,
          onBlur = _props8.onBlur,
          line = _props8.line;

      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(line, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props9 = this.props,
          className = _props9.className,
          projection = _props9.projection,
          line = _props9.line,
          style = _props9.style,
          tabable = _props9.tabable,
          zoom = _props9.zoom,
          preserveMarkerAspect = _props9.preserveMarkerAspect,
          width = _props9.width,
          height = _props9.height,
          buildPath = _props9.buildPath,
          strokeWidth = _props9.strokeWidth;
      var _state = this.state,
          pressed = _state.pressed,
          hover = _state.hover;


      var scale = preserveMarkerAspect ? " scale(" + 1 / zoom + ")" : "";

      var buildLineString = function buildLineString(coordinates) {
        return {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [projection.invert([width / 2, height / 2]), coordinates]
          }
        };
      };
      var startLineString = buildLineString(line.coordinates.start);
      var endLineString = buildLineString(line.coordinates.end);

      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && ((0, _d3Geo.geoLength)(startLineString) > radians || (0, _d3Geo.geoLength)(endLineString) > radians);

      var start = projection(line.coordinates.start);
      var end = projection(line.coordinates.end);

      var path = buildPath ? buildPath(start, end, line) : "M " + start.join(" ") + " L " + end.join(" ");

      return _react2.default.createElement("path", {
        className: "rsm-line" + (pressed ? " rsm-line--pressed" : "") + (hover ? " rsm-line--hover" : "") + " " + className,
        transform: "" + scale,
        style: style[isHidden ? "hidden" : pressed || hover ? pressed ? "pressed" : "hover" : "default"],
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onClick: this.handleMouseClick,
        onMouseMove: this.handleMouseMove,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        tabIndex: tabable ? 0 : -1,
        d: path,
        strokeWidth: strokeWidth
      });
    }
  }]);

  return Line;
}(_react.Component);

Line.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {}
  },
  line: {
    coordinates: {
      start: [0, 0],
      end: [-99.1, 19.4]
    }
  },
  tabable: true,
  preserveMarkerAspect: true,
  strokeWidth: 1,
  className: ""
};

exports.default = Line;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Lines.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _MapGroup = __webpack_require__("./node_modules/react-simple-maps/lib/MapGroup.js");

var _MapGroup2 = _interopRequireDefault(_MapGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Lines = function Lines(_ref) {
  var groupName = _ref.groupName,
      itemName = _ref.itemName,
      componentIdentifier = _ref.componentIdentifier,
      restProps = _objectWithoutProperties(_ref, ["groupName", "itemName", "componentIdentifier"]);

  return _react2.default.createElement(_MapGroup2.default, _extends({
    groupName: groupName,
    itemName: itemName
  }, restProps));
};

Lines.defaultProps = {
  componentIdentifier: "Lines",
  groupName: "lines",
  itemName: "line"
};

exports.default = Lines;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/MapGroup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapGroup = function (_Component) {
  _inherits(MapGroup, _Component);

  function MapGroup() {
    _classCallCheck(this, MapGroup);

    return _possibleConstructorReturn(this, (MapGroup.__proto__ || Object.getPrototypeOf(MapGroup)).apply(this, arguments));
  }

  _createClass(MapGroup, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          children = _props.children,
          projection = _props.projection,
          style = _props.style,
          zoom = _props.zoom,
          width = _props.width,
          height = _props.height,
          groupName = _props.groupName,
          itemName = _props.itemName;

      return _react2.default.createElement(
        "g",
        { className: "rsm-" + groupName, style: style },
        !children ? null : children.length === undefined ? _react2.default.cloneElement(children, {
          projection: projection,
          zoom: zoom,
          width: width,
          height: height
        }) : children.map(function (child, i) {
          return !child ? null : _react2.default.cloneElement(child, {
            key: child.key || itemName + "-" + i,
            projection: projection,
            zoom: zoom,
            width: width,
            height: height
          });
        })
      );
    }
  }]);

  return MapGroup;
}(_react.Component);

MapGroup.defaultProps = {
  componentIdentifier: "Group",
  groupName: "group",
  itemName: "group-item"
};

exports.default = MapGroup;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Marker.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Marker = function (_Component) {
  _inherits(Marker, _Component);

  function Marker() {
    _classCallCheck(this, Marker);

    var _this = _possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).call(this));

    _this.state = {
      hover: false,
      pressed: false
    };

    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseClick = _this.handleMouseClick.bind(_this);
    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    return _this;
  }

  _createClass(Marker, [{
    key: "handleMouseEnter",
    value: function handleMouseEnter(evt) {
      evt.persist();
      var _props = this.props,
          onMouseEnter = _props.onMouseEnter,
          marker = _props.marker;

      this.setState({
        hover: true
      }, function () {
        return onMouseEnter && onMouseEnter(marker, evt);
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(evt) {
      evt.persist();
      if (this.state.pressed) return;
      var _props2 = this.props,
          onMouseMove = _props2.onMouseMove,
          marker = _props2.marker;

      if (!this.state.hover) {
        this.setState({
          hover: true
        }, function () {
          return onMouseMove && onMouseMove(marker, evt);
        });
      } else if (onMouseMove) onMouseMove(marker, evt);else return;
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(evt) {
      evt.persist();
      var _props3 = this.props,
          onMouseLeave = _props3.onMouseLeave,
          marker = _props3.marker;

      this.setState({
        hover: false
      }, function () {
        return onMouseLeave && onMouseLeave(marker, evt);
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(evt) {
      evt.persist();
      var _props4 = this.props,
          onMouseDown = _props4.onMouseDown,
          marker = _props4.marker;

      this.setState({
        pressed: true
      }, function () {
        return onMouseDown && onMouseDown(marker, evt);
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(evt) {
      evt.persist();
      var _props5 = this.props,
          onMouseUp = _props5.onMouseUp,
          marker = _props5.marker;

      this.setState({
        pressed: false
      }, function () {
        return onMouseUp && onMouseUp(marker, evt);
      });
    }
  }, {
    key: "handleMouseClick",
    value: function handleMouseClick(evt) {
      if (!this.props.onClick) return;
      evt.persist();
      var _props6 = this.props,
          onClick = _props6.onClick,
          marker = _props6.marker,
          projection = _props6.projection;

      return onClick && onClick(marker, projection(marker.coordinates), evt);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(evt) {
      evt.persist();
      var _props7 = this.props,
          onFocus = _props7.onFocus,
          marker = _props7.marker;

      this.setState({
        hover: true
      }, function () {
        return onFocus && onFocus(marker, evt);
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(evt) {
      evt.persist();
      var _props8 = this.props,
          onBlur = _props8.onBlur,
          marker = _props8.marker;

      this.setState({
        hover: false
      }, function () {
        return onBlur && onBlur(marker, evt);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props9 = this.props,
          projection = _props9.projection,
          marker = _props9.marker,
          style = _props9.style,
          tabable = _props9.tabable,
          zoom = _props9.zoom,
          children = _props9.children,
          preserveMarkerAspect = _props9.preserveMarkerAspect,
          width = _props9.width,
          height = _props9.height;
      var _state = this.state,
          pressed = _state.pressed,
          hover = _state.hover;


      var scale = preserveMarkerAspect ? " scale(" + 1 / zoom + ")" : "";
      var translation = projection(marker.coordinates);

      var lineString = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [projection.invert([width / 2, height / 2]), marker.coordinates]
        }
      };

      var radians = Math.PI / 2,
          degrees = 90;
      var isGlobe = projection.clipAngle && projection.clipAngle() === degrees;
      var isHidden = isGlobe && (0, _d3Geo.geoLength)(lineString) > radians;

      return _react2.default.createElement(
        "g",
        { className: "rsm-marker" + (pressed ? " rsm-marker--pressed" : "") + (hover ? " rsm-marker--hover" : ""),
          transform: "translate(\n           " + translation[0] + "\n           " + translation[1] + "\n         ) " + scale,
          style: style[isHidden ? "hidden" : pressed || hover ? pressed ? "pressed" : "hover" : "default"],
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
          onMouseDown: this.handleMouseDown,
          onMouseUp: this.handleMouseUp,
          onClick: this.handleMouseClick,
          onMouseMove: this.handleMouseMove,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          tabIndex: tabable ? 0 : -1
        },
        children
      );
    }
  }]);

  return Marker;
}(_react.Component);

Marker.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {}
  },
  marker: {
    coordinates: [0, 0]
  },
  tabable: true,
  preserveMarkerAspect: true
};

exports.default = Marker;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/Markers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _MapGroup = __webpack_require__("./node_modules/react-simple-maps/lib/MapGroup.js");

var _MapGroup2 = _interopRequireDefault(_MapGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Markers = function Markers(_ref) {
  var groupName = _ref.groupName,
      itemName = _ref.itemName,
      componentIdentifier = _ref.componentIdentifier,
      restProps = _objectWithoutProperties(_ref, ["groupName", "itemName", "componentIdentifier"]);

  return _react2.default.createElement(_MapGroup2.default, _extends({
    groupName: groupName,
    itemName: itemName
  }, restProps));
};

Markers.defaultProps = {
  componentIdentifier: "Markers",
  groupName: "markers",
  itemName: "marker"
};

exports.default = Markers;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/ZoomableGlobe.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

var _utils = __webpack_require__("./node_modules/react-simple-maps/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ZoomableGlobe = function (_Component) {
  _inherits(ZoomableGlobe, _Component);

  function ZoomableGlobe(props) {
    _classCallCheck(this, ZoomableGlobe);

    var _this = _possibleConstructorReturn(this, (ZoomableGlobe.__proto__ || Object.getPrototypeOf(ZoomableGlobe)).call(this, props));

    var initialRotation = props.projection.rotate();

    _this.state = {
      mouseX: 0,
      mouseY: 0,
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      rotation: [initialRotation[0] - props.center[0], initialRotation[1] - props.center[1], initialRotation[2]]
    };

    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleTouchStart = _this.handleTouchStart.bind(_this);
    _this.handleTouchMove = _this.handleTouchMove.bind(_this);
    return _this;
  }

  _createClass(ZoomableGlobe, [{
    key: "handleMouseMove",
    value: function handleMouseMove(_ref) {
      var pageX = _ref.pageX,
          pageY = _ref.pageY,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      if (this.props.disablePanning) return;
      if (!this.state.isPressed) return;

      var differenceX = clientX - this.state.mouseXStart;
      var differenceY = clientY - this.state.mouseYStart;

      this.setState({
        mouseX: clientX,
        mouseY: clientY,
        mouseXStart: clientX,
        mouseYStart: clientY,
        rotation: [this.state.rotation[0] + differenceX * this.props.sensitivity, this.state.rotation[1] - differenceY * this.props.sensitivity, this.state.rotation[2]]
      });
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(_ref2) {
      var touches = _ref2.touches;

      this.handleMouseMove(touches[0]);
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      if (this.props.disablePanning) return;
      if (!this.state.isPressed) return;
      this.setState({
        isPressed: false
      });
      if (!this.props.onMoveEnd) return;
      var newCenter = this.props.projection.invert([this.props.width / 2, this.props.height / 2]);
      this.props.onMoveEnd(newCenter);
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(_ref3) {
      var pageX = _ref3.pageX,
          pageY = _ref3.pageY,
          clientX = _ref3.clientX,
          clientY = _ref3.clientY;

      if (this.props.disablePanning) return;
      this.setState({
        isPressed: true,
        mouseXStart: clientX,
        mouseYStart: clientY
      });
      if (!this.props.onMoveStart) return;
      var currentCenter = this.props.projection.invert([this.props.width / 2, this.props.height / 2]);
      this.props.onMoveStart(currentCenter);
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(_ref4) {
      var touches = _ref4.touches;

      if (touches.length > 1) {
        this.handleMouseDown(touches[0]);
      } else {
        this.handleMouseUp();
      }
    }
  }, {
    key: "preventTouchScroll",
    value: function preventTouchScroll(evt) {
      if (evt.touches.length > 1) {
        evt.preventDefault();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _state = this.state,
          mouseX = _state.mouseX,
          mouseY = _state.mouseY;
      var _props = this.props,
          projection = _props.projection,
          center = _props.center,
          zoom = _props.zoom;


      var zoomFactor = nextProps.zoom / zoom;
      var centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center);

      this.setState({
        zoom: nextProps.zoom,
        rotation: centerChanged ? [-nextProps.center[0], -nextProps.center[1], this.state.rotation[2]] : this.state.rotation
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          projection = _props2.projection,
          zoom = _props2.zoom;


      window.addEventListener("resize", this.handleResize);
      window.addEventListener("mouseup", this.handleMouseUp);
      this.zoomableGlobeNode.addEventListener("touchmove", this.preventTouchScroll);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("mouseup", this.handleMouseUp);
      this.zoomableGlobeNode.removeEventListener("touchmove", this.preventTouchScroll);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          width = _props3.width,
          height = _props3.height,
          zoom = _props3.zoom,
          style = _props3.style,
          projection = _props3.projection,
          children = _props3.children;
      var _state2 = this.state,
          mouseX = _state2.mouseX,
          mouseY = _state2.mouseY;


      return _react2.default.createElement(
        "g",
        { className: "rsm-zoomable-globe",
          ref: function ref(zoomableGlobeNode) {
            return _this2.zoomableGlobeNode = zoomableGlobeNode;
          },
          transform: "\n           translate(" + width / 2 + " " + height / 2 + ")\n           scale(" + zoom + ")\n           translate(" + -width / 2 + " " + -height / 2 + ")\n         ",
          onMouseMove: this.handleMouseMove,
          onMouseUp: this.handleMouseUp,
          onMouseDown: this.handleMouseDown,
          onTouchStart: this.handleTouchStart,
          onTouchMove: this.handleTouchMove,
          onTouchEnd: this.handleMouseUp,
          style: style
        },
        (0, _utils.createNewChildren)(children, {
          width: width,
          height: height,
          center: this.center,
          backdrop: this.backdrop,
          zoom: this.props.zoom,
          disablePanning: this.props.disablePanning,
          children: children,
          projection: projection.rotate(this.state.rotation)
        })
      );
    }
  }]);

  return ZoomableGlobe;
}(_react.Component);

ZoomableGlobe.defaultProps = {
  center: [0, 0],
  zoom: 1,
  disablePanning: false,
  sensitivity: 0.25
};

exports.default = ZoomableGlobe;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/ZoomableGroup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

var _utils = __webpack_require__("./node_modules/react-simple-maps/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ZoomableGroup = function (_Component) {
  _inherits(ZoomableGroup, _Component);

  function ZoomableGroup(props) {
    _classCallCheck(this, ZoomableGroup);

    var _this = _possibleConstructorReturn(this, (ZoomableGroup.__proto__ || Object.getPrototypeOf(ZoomableGroup)).call(this, props));

    var backdrop = (0, _utils.computeBackdrop)(props.projection, props.backdrop);

    _this.state = {
      mouseX: (0, _utils.calculateMousePosition)("x", props.projection, props, props.zoom, 1),
      mouseY: (0, _utils.calculateMousePosition)("y", props.projection, props, props.zoom, 1),
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      resizeFactorX: 1,
      resizeFactorY: 1,
      backdrop: {
        width: Math.round(backdrop.width),
        height: Math.round(backdrop.height),
        x: Math.round(backdrop.x),
        y: Math.round(backdrop.y)
      }
    };

    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
    _this.handleTouchStart = _this.handleTouchStart.bind(_this);
    _this.handleTouchMove = _this.handleTouchMove.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);

    return _this;
  }

  _createClass(ZoomableGroup, [{
    key: "handleMouseMove",
    value: function handleMouseMove(_ref) {
      var pageX = _ref.pageX,
          pageY = _ref.pageY;

      if (this.props.disablePanning) return;
      if (!this.state.isPressed) return;
      this.setState({
        mouseX: pageX - this.state.mouseXStart,
        mouseY: pageY - this.state.mouseYStart
      });
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(_ref2) {
      var touches = _ref2.touches;

      this.handleMouseMove(touches[0]);
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      if (this.props.disablePanning) return;
      if (!this.state.isPressed) return;
      this.setState({
        isPressed: false
      });
      if (!this.props.onMoveEnd) return;
      var _state = this.state,
          mouseX = _state.mouseX,
          mouseY = _state.mouseY,
          resizeFactorX = _state.resizeFactorX,
          resizeFactorY = _state.resizeFactorY;
      var _props = this.props,
          zoom = _props.zoom,
          width = _props.width,
          height = _props.height,
          projection = _props.projection,
          onMoveEnd = _props.onMoveEnd;

      var x = width / 2 - mouseX * resizeFactorX / zoom;
      var y = height / 2 - mouseY * resizeFactorY / zoom;
      var newCenter = projection.invert([x, y]);
      onMoveEnd(newCenter);
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(_ref3) {
      var pageX = _ref3.pageX,
          pageY = _ref3.pageY;

      if (this.props.disablePanning) return;
      var _state2 = this.state,
          mouseX = _state2.mouseX,
          mouseY = _state2.mouseY,
          resizeFactorX = _state2.resizeFactorX,
          resizeFactorY = _state2.resizeFactorY;
      var _props2 = this.props,
          zoom = _props2.zoom,
          width = _props2.width,
          height = _props2.height,
          projection = _props2.projection,
          onMoveStart = _props2.onMoveStart;

      this.setState({
        isPressed: true,
        mouseXStart: pageX - mouseX,
        mouseYStart: pageY - mouseY
      });
      if (!onMoveStart) return;
      var x = width / 2 - mouseX * resizeFactorX / zoom;
      var y = height / 2 - mouseY * resizeFactorY / zoom;
      var currentCenter = projection.invert([x, y]);
      onMoveStart(currentCenter);
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(_ref4) {
      var touches = _ref4.touches;

      if (touches.length > 1) {
        this.handleMouseDown(touches[0]);
      } else {
        this.handleMouseUp();
      }
    }
  }, {
    key: "preventTouchScroll",
    value: function preventTouchScroll(evt) {
      if (evt.touches.length > 1) {
        evt.preventDefault();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _state3 = this.state,
          mouseX = _state3.mouseX,
          mouseY = _state3.mouseY,
          resizeFactorX = _state3.resizeFactorX,
          resizeFactorY = _state3.resizeFactorY;
      var _props3 = this.props,
          projection = _props3.projection,
          center = _props3.center,
          zoom = _props3.zoom;


      var zoomFactor = nextProps.zoom / zoom;
      var centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center);

      this.setState({
        zoom: nextProps.zoom,
        mouseX: centerChanged ? (0, _utils.calculateMousePosition)("x", nextProps.projection, nextProps, nextProps.zoom, resizeFactorX) : mouseX * zoomFactor,
        mouseY: centerChanged ? (0, _utils.calculateMousePosition)("y", nextProps.projection, nextProps, nextProps.zoom, resizeFactorY) : mouseY * zoomFactor
      });
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      var _props4 = this.props,
          width = _props4.width,
          height = _props4.height,
          projection = _props4.projection,
          zoom = _props4.zoom;


      var resizeFactorX = (0, _utils.calculateResizeFactor)(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width);
      var resizeFactorY = (0, _utils.calculateResizeFactor)(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height);

      var xPercentageChange = 1 / resizeFactorX * this.state.resizeFactorX;
      var yPercentageChange = 1 / resizeFactorY * this.state.resizeFactorY;

      this.setState({
        resizeFactorX: resizeFactorX,
        resizeFactorY: resizeFactorY,
        mouseX: this.state.mouseX * xPercentageChange,
        mouseY: this.state.mouseY * yPercentageChange
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props5 = this.props,
          width = _props5.width,
          height = _props5.height,
          projection = _props5.projection,
          zoom = _props5.zoom;


      var resizeFactorX = (0, _utils.calculateResizeFactor)(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width);
      var resizeFactorY = (0, _utils.calculateResizeFactor)(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height);

      this.setState({
        resizeFactorX: resizeFactorX,
        resizeFactorY: resizeFactorY,
        mouseX: (0, _utils.calculateMousePosition)("x", projection, this.props, zoom, resizeFactorX),
        mouseY: (0, _utils.calculateMousePosition)("y", projection, this.props, zoom, resizeFactorY)
      });

      window.addEventListener("resize", this.handleResize);
      window.addEventListener("mouseup", this.handleMouseUp);
      this.zoomableGroupNode.addEventListener("touchmove", this.preventTouchScroll);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("mouseup", this.handleMouseUp);
      this.zoomableGroupNode.removeEventListener("touchmove", this.preventTouchScroll);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props6 = this.props,
          width = _props6.width,
          height = _props6.height,
          zoom = _props6.zoom,
          style = _props6.style,
          projection = _props6.projection,
          children = _props6.children;
      var _state4 = this.state,
          mouseX = _state4.mouseX,
          mouseY = _state4.mouseY,
          resizeFactorX = _state4.resizeFactorX,
          resizeFactorY = _state4.resizeFactorY;


      return _react2.default.createElement(
        "g",
        { className: "rsm-zoomable-group",
          ref: function ref(zoomableGroupNode) {
            return _this2.zoomableGroupNode = zoomableGroupNode;
          },
          transform: "\n           translate(\n             " + Math.round((width / 2 + resizeFactorX * mouseX) * 100) / 100 + "\n             " + Math.round((height / 2 + resizeFactorY * mouseY) * 100) / 100 + "\n           )\n           scale(" + zoom + ")\n           translate(" + -width / 2 + " " + -height / 2 + ")\n         ",
          onMouseMove: this.handleMouseMove,
          onMouseUp: this.handleMouseUp,
          onMouseDown: this.handleMouseDown,
          onTouchStart: this.handleTouchStart,
          onTouchMove: this.handleTouchMove,
          onTouchEnd: this.handleMouseUp,
          style: style
        },
        _react2.default.createElement("rect", {
          x: this.state.backdrop.x,
          y: this.state.backdrop.y,
          width: this.state.backdrop.width,
          height: this.state.backdrop.height,
          fill: "transparent",
          style: { strokeWidth: 0 }
        }),
        (0, _utils.createNewChildren)(children, this.props)
      );
    }
  }]);

  return ZoomableGroup;
}(_react.Component);

ZoomableGroup.defaultProps = {
  center: [0, 0],
  backdrop: {
    x: [-179.9, 179.9],
    y: [89.9, -89.9]
  },
  zoom: 1,
  disablePanning: false
};

exports.default = ZoomableGroup;

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComposableMap = __webpack_require__("./node_modules/react-simple-maps/lib/ComposableMap.js");

Object.defineProperty(exports, "ComposableMap", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ComposableMap).default;
  }
});

var _ZoomableGroup = __webpack_require__("./node_modules/react-simple-maps/lib/ZoomableGroup.js");

Object.defineProperty(exports, "ZoomableGroup", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ZoomableGroup).default;
  }
});

var _ZoomableGlobe = __webpack_require__("./node_modules/react-simple-maps/lib/ZoomableGlobe.js");

Object.defineProperty(exports, "ZoomableGlobe", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ZoomableGlobe).default;
  }
});

var _Geographies = __webpack_require__("./node_modules/react-simple-maps/lib/Geographies.js");

Object.defineProperty(exports, "Geographies", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Geographies).default;
  }
});

var _Geography = __webpack_require__("./node_modules/react-simple-maps/lib/Geography.js");

Object.defineProperty(exports, "Geography", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Geography).default;
  }
});

var _Marker = __webpack_require__("./node_modules/react-simple-maps/lib/Marker.js");

Object.defineProperty(exports, "Marker", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Marker).default;
  }
});

var _Markers = __webpack_require__("./node_modules/react-simple-maps/lib/Markers.js");

Object.defineProperty(exports, "Markers", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Markers).default;
  }
});

var _Line = __webpack_require__("./node_modules/react-simple-maps/lib/Line.js");

Object.defineProperty(exports, "Line", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Line).default;
  }
});

var _Lines = __webpack_require__("./node_modules/react-simple-maps/lib/Lines.js");

Object.defineProperty(exports, "Lines", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Lines).default;
  }
});

var _MapGroup = __webpack_require__("./node_modules/react-simple-maps/lib/MapGroup.js");

Object.defineProperty(exports, "MapGroup", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MapGroup).default;
  }
});

var _Annotation = __webpack_require__("./node_modules/react-simple-maps/lib/Annotation.js");

Object.defineProperty(exports, "Annotation", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Annotation).default;
  }
});

var _Annotations = __webpack_require__("./node_modules/react-simple-maps/lib/Annotations.js");

Object.defineProperty(exports, "Annotations", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Annotations).default;
  }
});

var _Graticule = __webpack_require__("./node_modules/react-simple-maps/lib/Graticule.js");

Object.defineProperty(exports, "Graticule", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Graticule).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/projectionConfig.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  scale: 160,
  xOffset: 0,
  yOffset: 0,
  rotation: [0, 0, 0],
  precision: 0.1
};

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/projections.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (width, height, config, projectionName) {

  var scale = config.scale || _projectionConfig2.default.scale;
  var xOffset = config.xOffset || _projectionConfig2.default.xOffset;
  var yOffset = config.yOffset || _projectionConfig2.default.yOffset;
  var rotation = config.rotation || _projectionConfig2.default.rotation;
  var precision = config.precision || _projectionConfig2.default.precision;

  var baseProjection = projectionReference[projectionName]().scale(scale).translate([xOffset + width / 2, yOffset + height / 2]).precision(precision);

  return projectionName === "albersUsa" ? baseProjection : projectionName === "orthographic" ? baseProjection.rotate(rotation).clipAngle(90) : baseProjection.rotate(rotation);
};

var _d3GeoProjection = __webpack_require__("./node_modules/d3-geo-projection/index.js");

var _d3Geo = __webpack_require__("./node_modules/d3-geo/index.js");

var _projectionConfig = __webpack_require__("./node_modules/react-simple-maps/lib/projectionConfig.js");

var _projectionConfig2 = _interopRequireDefault(_projectionConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectionReference = {
  mercator: _d3Geo.geoMercator,
  miller: _d3GeoProjection.geoMiller,
  times: _d3GeoProjection.geoTimes,
  robinson: _d3GeoProjection.geoRobinson,
  winkel3: _d3GeoProjection.geoWinkel3,
  eckert4: _d3GeoProjection.geoEckert4,
  albersUsa: _d3Geo.geoAlbersUsa,
  orthographic: _d3Geo.geoOrthographic
};

/***/ }),

/***/ "./node_modules/react-simple-maps/lib/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateResizeFactor = calculateResizeFactor;
exports.calculateMousePosition = calculateMousePosition;
exports.isChildOfType = isChildOfType;
exports.createNewChildren = createNewChildren;
exports.roundPath = roundPath;
exports.createConnectorPath = createConnectorPath;
exports.createTextAnchor = createTextAnchor;
exports.computeBackdrop = computeBackdrop;

var _react = __webpack_require__("./node_modules/react/cjs/react.development.js");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function calculateResizeFactor(actualDimension, baseDimension) {
  if (actualDimension === 0) return 1;
  return 1 / 100 * (100 / actualDimension * baseDimension);
}

function calculateMousePosition(direction, projection, props, zoom, resizeFactor) {
  var center = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : props.center;
  var width = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : props.width;
  var height = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : props.height;

  var reference = { x: 0, y: 1 };
  var canRotate = !!projection.rotate;
  var reverseRotation = !!canRotate ? projection.rotate().map(function (item) {
    return -item;
  }) : false;
  var point = !!reverseRotation ? projection.rotate(reverseRotation)([-center[0], -center[1]]) : projection([center[0], center[1]]);
  var returner = point ? (point[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1 / resizeFactor) : 0;
  if (canRotate) projection.rotate([-reverseRotation[0], -reverseRotation[1], -reverseRotation[2]]);
  return !!reverseRotation ? returner : -returner;
}

function isChildOfType(child, expectedTypes) {
  return expectedTypes.indexOf(child.props.componentIdentifier) !== -1;
}

function createNewChildren(children, props) {
  if (!children) return;
  if (!children.length) {
    return isChildOfType(children, ["Geographies"]) ? _react2.default.cloneElement(children, {
      projection: props.projection
    }) : isChildOfType(children, ["Group", "Markers", "Lines", "Annotations", "Annotation", "Graticule"]) ? _react2.default.cloneElement(children, {
      projection: props.projection,
      zoom: props.zoom,
      width: props.width,
      height: props.height,
      groupName: props.groupName,
      itemName: props.itemName
    }) : children;
  } else {
    return children.map(function (child, i) {
      if (!child) return;
      return isChildOfType(child, ["Geographies"]) ? _react2.default.cloneElement(child, {
        key: "zoomable-child-" + i,
        projection: props.projection
      }) : isChildOfType(child, ["Group", "Markers", "Lines", "Annotations", "Annotation", "Graticule"]) ? _react2.default.cloneElement(child, {
        key: "zoomable-child-" + i,
        projection: props.projection,
        zoom: props.zoom,
        width: props.width,
        height: props.height,
        groupName: props.groupName,
        itemName: props.itemName
      }) : child;
    });
  }
}

function roundPath(path, precision) {
  if (!path) return;
  var query = /[\d\.-][\d\.e-]*/g;
  return path.replace(query, function (n) {
    return Math.round(n * (1 / precision)) / (1 / precision);
  });
}

function createConnectorPath(connectorType, endPoint, curve) {
  var e0 = endPoint[0];
  var e1 = endPoint[1];
  return "M0,0 Q " + (curve + 1) / 2 * e0 + "," + (e1 - (curve + 1) / 2 * e1) + " " + e0 + "," + e1;
}

function createTextAnchor(dx) {
  if (dx > 0) return "start";else if (dx < 0) return "end";else return "middle";
}

function computeBackdrop(projection, backdrop) {
  var canRotate = projection.rotate;
  var originalRotation = canRotate ? projection.rotate() : null;

  var tl = canRotate ? projection.rotate([0, 0, 0])([backdrop.x[0], backdrop.y[0]]) : projection([backdrop.x[0], backdrop.y[0]]);

  var br = canRotate ? projection.rotate([0, 0, 0])([backdrop.x[1], backdrop.y[1]]) : projection([backdrop.x[1], backdrop.y[1]]);

  var x = tl ? tl[0] : 0;
  var x0 = br ? br[0] : 0;

  var y = tl ? tl[1] : 0;
  var y0 = br ? br[1] : 0;

  var width = x0 - x;
  var height = y0 - y;

  if (originalRotation) projection.rotate(originalRotation);

  return { x: x, y: y, width: width, height: height };
}

/***/ }),

/***/ "./node_modules/topojson-client/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_bbox__ = __webpack_require__("./node_modules/topojson-client/src/bbox.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bbox", function() { return __WEBPACK_IMPORTED_MODULE_0__src_bbox__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_feature__ = __webpack_require__("./node_modules/topojson-client/src/feature.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "feature", function() { return __WEBPACK_IMPORTED_MODULE_1__src_feature__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_mesh__ = __webpack_require__("./node_modules/topojson-client/src/mesh.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mesh", function() { return __WEBPACK_IMPORTED_MODULE_2__src_mesh__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "meshArcs", function() { return __WEBPACK_IMPORTED_MODULE_2__src_mesh__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_merge__ = __webpack_require__("./node_modules/topojson-client/src/merge.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return __WEBPACK_IMPORTED_MODULE_3__src_merge__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mergeArcs", function() { return __WEBPACK_IMPORTED_MODULE_3__src_merge__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_neighbors__ = __webpack_require__("./node_modules/topojson-client/src/neighbors.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "neighbors", function() { return __WEBPACK_IMPORTED_MODULE_4__src_neighbors__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_quantize__ = __webpack_require__("./node_modules/topojson-client/src/quantize.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "quantize", function() { return __WEBPACK_IMPORTED_MODULE_5__src_quantize__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_transform__ = __webpack_require__("./node_modules/topojson-client/src/transform.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "transform", function() { return __WEBPACK_IMPORTED_MODULE_6__src_transform__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_untransform__ = __webpack_require__("./node_modules/topojson-client/src/untransform.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "untransform", function() { return __WEBPACK_IMPORTED_MODULE_7__src_untransform__["a"]; });










/***/ }),

/***/ "./node_modules/topojson-client/src/bbox.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transform__ = __webpack_require__("./node_modules/topojson-client/src/transform.js");


/* harmony default export */ __webpack_exports__["a"] = (function(topology) {
  var bbox = topology.bbox;

  function bboxPoint(p0) {
    p1[0] = p0[0], p1[1] = p0[1], t(p1);
    if (p1[0] < x0) x0 = p1[0];
    if (p1[0] > x1) x1 = p1[0];
    if (p1[1] < y0) y0 = p1[1];
    if (p1[1] > y1) y1 = p1[1];
  }

  function bboxGeometry(o) {
    switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(bboxGeometry); break;
      case "Point": bboxPoint(o.coordinates); break;
      case "MultiPoint": o.coordinates.forEach(bboxPoint); break;
    }
  }

  if (!bbox) {
    var t = Object(__WEBPACK_IMPORTED_MODULE_0__transform__["a" /* default */])(topology), p0, p1 = new Array(2), name,
        x0 = Infinity, y0 = x0, x1 = -x0, y1 = -x0;

    topology.arcs.forEach(function(arc) {
      var i = -1, n = arc.length;
      while (++i < n) {
        p0 = arc[i], p1[0] = p0[0], p1[1] = p0[1], t(p1, i);
        if (p1[0] < x0) x0 = p1[0];
        if (p1[0] > x1) x1 = p1[0];
        if (p1[1] < y0) y0 = p1[1];
        if (p1[1] > y1) y1 = p1[1];
      }
    });

    for (name in topology.objects) {
      bboxGeometry(topology.objects[name]);
    }

    bbox = topology.bbox = [x0, y0, x1, y1];
  }

  return bbox;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/bisect.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(a, x) {
  var lo = 0, hi = a.length;
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/feature.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export feature */
/* harmony export (immutable) */ __webpack_exports__["b"] = object;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reverse__ = __webpack_require__("./node_modules/topojson-client/src/reverse.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__("./node_modules/topojson-client/src/transform.js");



/* harmony default export */ __webpack_exports__["a"] = (function(topology, o) {
  return o.type === "GeometryCollection"
      ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature(topology, o); })}
      : feature(topology, o);
});

function feature(topology, o) {
  var id = o.id,
      bbox = o.bbox,
      properties = o.properties == null ? {} : o.properties,
      geometry = object(topology, o);
  return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
      : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
      : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
}

function object(topology, o) {
  var transformPoint = Object(__WEBPACK_IMPORTED_MODULE_1__transform__["a" /* default */])(topology),
      arcs = topology.arcs;

  function arc(i, points) {
    if (points.length) points.pop();
    for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
      points.push(transformPoint(a[k].slice(), k));
    }
    if (i < 0) Object(__WEBPACK_IMPORTED_MODULE_0__reverse__["a" /* default */])(points, n);
  }

  function point(p) {
    return transformPoint(p.slice());
  }

  function line(arcs) {
    var points = [];
    for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
    if (points.length < 2) points.push(points[0].slice());
    return points;
  }

  function ring(arcs) {
    var points = line(arcs);
    while (points.length < 4) points.push(points[0].slice());
    return points;
  }

  function polygon(arcs) {
    return arcs.map(ring);
  }

  function geometry(o) {
    var type = o.type, coordinates;
    switch (type) {
      case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
      case "Point": coordinates = point(o.coordinates); break;
      case "MultiPoint": coordinates = o.coordinates.map(point); break;
      case "LineString": coordinates = line(o.arcs); break;
      case "MultiLineString": coordinates = o.arcs.map(line); break;
      case "Polygon": coordinates = polygon(o.arcs); break;
      case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
      default: return null;
    }
    return {type: type, coordinates: coordinates};
  }

  return geometry(o);
}


/***/ }),

/***/ "./node_modules/topojson-client/src/identity.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(x) {
  return x;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/merge.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeArcs;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feature__ = __webpack_require__("./node_modules/topojson-client/src/feature.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stitch__ = __webpack_require__("./node_modules/topojson-client/src/stitch.js");



function planarRingArea(ring) {
  var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
  while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
  return Math.abs(area); // Note: doubled area!
}

/* harmony default export */ __webpack_exports__["a"] = (function(topology) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__feature__["b" /* object */])(topology, mergeArcs.apply(this, arguments));
});

function mergeArcs(topology, objects) {
  var polygonsByArc = {},
      polygons = [],
      groups = [];

  objects.forEach(geometry);

  function geometry(o) {
    switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(geometry); break;
      case "Polygon": extract(o.arcs); break;
      case "MultiPolygon": o.arcs.forEach(extract); break;
    }
  }

  function extract(polygon) {
    polygon.forEach(function(ring) {
      ring.forEach(function(arc) {
        (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
      });
    });
    polygons.push(polygon);
  }

  function area(ring) {
    return planarRingArea(Object(__WEBPACK_IMPORTED_MODULE_0__feature__["b" /* object */])(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
  }

  polygons.forEach(function(polygon) {
    if (!polygon._) {
      var group = [],
          neighbors = [polygon];
      polygon._ = 1;
      groups.push(group);
      while (polygon = neighbors.pop()) {
        group.push(polygon);
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
              if (!polygon._) {
                polygon._ = 1;
                neighbors.push(polygon);
              }
            });
          });
        });
      }
    }
  });

  polygons.forEach(function(polygon) {
    delete polygon._;
  });

  return {
    type: "MultiPolygon",
    arcs: groups.map(function(polygons) {
      var arcs = [], n;

      // Extract the exterior (unique) arcs.
      polygons.forEach(function(polygon) {
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
              arcs.push(arc);
            }
          });
        });
      });

      // Stitch the arcs into one or more rings.
      arcs = Object(__WEBPACK_IMPORTED_MODULE_1__stitch__["a" /* default */])(topology, arcs);

      // If more than one ring is returned,
      // at most one of these rings can be the exterior;
      // choose the one with the greatest absolute area.
      if ((n = arcs.length) > 1) {
        for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
          if ((ki = area(arcs[i])) > k) {
            t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
          }
        }
      }

      return arcs;
    })
  };
}


/***/ }),

/***/ "./node_modules/topojson-client/src/mesh.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = meshArcs;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feature__ = __webpack_require__("./node_modules/topojson-client/src/feature.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stitch__ = __webpack_require__("./node_modules/topojson-client/src/stitch.js");



/* harmony default export */ __webpack_exports__["a"] = (function(topology) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__feature__["b" /* object */])(topology, meshArcs.apply(this, arguments));
});

function meshArcs(topology, object, filter) {
  var arcs, i, n;
  if (arguments.length > 1) arcs = extractArcs(topology, object, filter);
  else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i;
  return {type: "MultiLineString", arcs: Object(__WEBPACK_IMPORTED_MODULE_1__stitch__["a" /* default */])(topology, arcs)};
}

function extractArcs(topology, object, filter) {
  var arcs = [],
      geomsByArc = [],
      geom;

  function extract0(i) {
    var j = i < 0 ? ~i : i;
    (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
  }

  function extract1(arcs) {
    arcs.forEach(extract0);
  }

  function extract2(arcs) {
    arcs.forEach(extract1);
  }

  function extract3(arcs) {
    arcs.forEach(extract2);
  }

  function geometry(o) {
    switch (geom = o, o.type) {
      case "GeometryCollection": o.geometries.forEach(geometry); break;
      case "LineString": extract1(o.arcs); break;
      case "MultiLineString": case "Polygon": extract2(o.arcs); break;
      case "MultiPolygon": extract3(o.arcs); break;
    }
  }

  geometry(object);

  geomsByArc.forEach(filter == null
      ? function(geoms) { arcs.push(geoms[0].i); }
      : function(geoms) { if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i); });

  return arcs;
}


/***/ }),

/***/ "./node_modules/topojson-client/src/neighbors.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bisect__ = __webpack_require__("./node_modules/topojson-client/src/bisect.js");


/* harmony default export */ __webpack_exports__["a"] = (function(objects) {
  var indexesByArc = {}, // arc index -> array of object indexes
      neighbors = objects.map(function() { return []; });

  function line(arcs, i) {
    arcs.forEach(function(a) {
      if (a < 0) a = ~a;
      var o = indexesByArc[a];
      if (o) o.push(i);
      else indexesByArc[a] = [i];
    });
  }

  function polygon(arcs, i) {
    arcs.forEach(function(arc) { line(arc, i); });
  }

  function geometry(o, i) {
    if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
    else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
  }

  var geometryType = {
    LineString: line,
    MultiLineString: polygon,
    Polygon: polygon,
    MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
  };

  objects.forEach(geometry);

  for (var i in indexesByArc) {
    for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
      for (var k = j + 1; k < m; ++k) {
        var ij = indexes[j], ik = indexes[k], n;
        if ((n = neighbors[ij])[i = Object(__WEBPACK_IMPORTED_MODULE_0__bisect__["a" /* default */])(n, ik)] !== ik) n.splice(i, 0, ik);
        if ((n = neighbors[ik])[i = Object(__WEBPACK_IMPORTED_MODULE_0__bisect__["a" /* default */])(n, ij)] !== ij) n.splice(i, 0, ij);
      }
    }
  }

  return neighbors;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/quantize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bbox__ = __webpack_require__("./node_modules/topojson-client/src/bbox.js");


/* harmony default export */ __webpack_exports__["a"] = (function(topology, n) {
  if (!((n = Math.floor(n)) >= 2)) throw new Error("n must be ≥2");
  if (topology.transform) throw new Error("already quantized");
  var bb = Object(__WEBPACK_IMPORTED_MODULE_0__bbox__["a" /* default */])(topology), name,
      dx = bb[0], kx = (bb[2] - dx) / (n - 1) || 1,
      dy = bb[1], ky = (bb[3] - dy) / (n - 1) || 1;

  function quantizePoint(p) {
    p[0] = Math.round((p[0] - dx) / kx);
    p[1] = Math.round((p[1] - dy) / ky);
  }

  function quantizeGeometry(o) {
    switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(quantizeGeometry); break;
      case "Point": quantizePoint(o.coordinates); break;
      case "MultiPoint": o.coordinates.forEach(quantizePoint); break;
    }
  }

  topology.arcs.forEach(function(arc) {
    var i = 1,
        j = 1,
        n = arc.length,
        pi = arc[0],
        x0 = pi[0] = Math.round((pi[0] - dx) / kx),
        y0 = pi[1] = Math.round((pi[1] - dy) / ky),
        pj,
        x1,
        y1;

    for (; i < n; ++i) {
      pi = arc[i];
      x1 = Math.round((pi[0] - dx) / kx);
      y1 = Math.round((pi[1] - dy) / ky);
      if (x1 !== x0 || y1 !== y0) {
        pj = arc[j++];
        pj[0] = x1 - x0, x0 = x1;
        pj[1] = y1 - y0, y0 = y1;
      }
    }

    if (j < 2) {
      pj = arc[j++];
      pj[0] = 0;
      pj[1] = 0;
    }

    arc.length = j;
  });

  for (name in topology.objects) {
    quantizeGeometry(topology.objects[name]);
  }

  topology.transform = {
    scale: [kx, ky],
    translate: [dx, dy]
  };

  return topology;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/reverse.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(array, n) {
  var t, j = array.length, i = j - n;
  while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/stitch.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(topology, arcs) {
  var stitchedArcs = {},
      fragmentByStart = {},
      fragmentByEnd = {},
      fragments = [],
      emptyIndex = -1;

  // Stitch empty arcs first, since they may be subsumed by other arcs.
  arcs.forEach(function(i, j) {
    var arc = topology.arcs[i < 0 ? ~i : i], t;
    if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
      t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
    }
  });

  arcs.forEach(function(i) {
    var e = ends(i),
        start = e[0],
        end = e[1],
        f, g;

    if (f = fragmentByEnd[start]) {
      delete fragmentByEnd[f.end];
      f.push(i);
      f.end = end;
      if (g = fragmentByStart[end]) {
        delete fragmentByStart[g.start];
        var fg = g === f ? f : f.concat(g);
        fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else if (f = fragmentByStart[end]) {
      delete fragmentByStart[f.start];
      f.unshift(i);
      f.start = start;
      if (g = fragmentByEnd[start]) {
        delete fragmentByEnd[g.end];
        var gf = g === f ? f : g.concat(f);
        fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else {
      f = [i];
      fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
    }
  });

  function ends(i) {
    var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
    if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
    else p1 = arc[arc.length - 1];
    return i < 0 ? [p1, p0] : [p0, p1];
  }

  function flush(fragmentByEnd, fragmentByStart) {
    for (var k in fragmentByEnd) {
      var f = fragmentByEnd[k];
      delete fragmentByStart[f.start];
      delete f.start;
      delete f.end;
      f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
      fragments.push(f);
    }
  }

  flush(fragmentByEnd, fragmentByStart);
  flush(fragmentByStart, fragmentByEnd);
  arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

  return fragments;
});


/***/ }),

/***/ "./node_modules/topojson-client/src/transform.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__identity__ = __webpack_require__("./node_modules/topojson-client/src/identity.js");


/* harmony default export */ __webpack_exports__["a"] = (function(topology) {
  if ((transform = topology.transform) == null) return __WEBPACK_IMPORTED_MODULE_0__identity__["a" /* default */];
  var transform,
      x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(point, i) {
    if (!i) x0 = y0 = 0;
    point[0] = (x0 += point[0]) * kx + dx;
    point[1] = (y0 += point[1]) * ky + dy;
    return point;
  };
});


/***/ }),

/***/ "./node_modules/topojson-client/src/untransform.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__identity__ = __webpack_require__("./node_modules/topojson-client/src/identity.js");


/* harmony default export */ __webpack_exports__["a"] = (function(topology) {
  if ((transform = topology.transform) == null) return __WEBPACK_IMPORTED_MODULE_0__identity__["a" /* default */];
  var transform,
      x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(point, i) {
    if (!i) x0 = y0 = 0;
    var x1 = Math.round((point[0] - dx) / kx),
        y1 = Math.round((point[1] - dy) / ky);
    point[0] = x1 - x0, x0 = x1;
    point[1] = y1 - y0, y0 = y1;
    return point;
  };
});


/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./pages/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("./node_modules/react/cjs/react.development.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__ = __webpack_require__("./node_modules/react-simple-maps/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_simple_maps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_simple_maps__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3_scale__ = __webpack_require__("./node_modules/d3-scale/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios__ = __webpack_require__("./node_modules/axios/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_axios__);
var _jsxFileName = "/home/pavan/works/intelicar/bubbles-map/pages/index.js";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

(function () {
  var enterModule = __webpack_require__("./node_modules/react-hot-loader/index.js").enterModule;

  enterModule && enterModule(module);
})();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto"
};

var cityScale = Object(__WEBPACK_IMPORTED_MODULE_2_d3_scale__["a" /* scaleLinear */])().domain([0, 37843000]).range([1, 25]);

var BasicMap = function (_Component) {
  _inherits(BasicMap, _Component);

  function BasicMap() {
    _classCallCheck(this, BasicMap);

    var _this = _possibleConstructorReturn(this, (BasicMap.__proto__ || Object.getPrototypeOf(BasicMap)).call(this));

    _this.state = {
      cities: []
    };
    _this.fetchCities = _this.fetchCities.bind(_this);
    return _this;
  }

  _createClass(BasicMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchCities();
    }
  }, {
    key: "fetchCities",
    value: function fetchCities() {
      var _this2 = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get("/static/world-most-populous-cities.json").then(function (res) {
        _this2.setState({
          cities: res.data
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        { style: wrapperStyles, __source: {
            fileName: _jsxFileName,
            lineNumber: 46
          }
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["ComposableMap"],
          {
            projectionConfig: { scale: 205 },
            width: 980,
            height: 551,
            style: {
              width: "30%",
              height: "auto"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            }
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["ZoomableGroup"],
            { center: [0, 20], disablePanning: true, __source: {
                fileName: _jsxFileName,
                lineNumber: 56
              }
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Geographies"],
              { geography: "/static/world-50m.json", __source: {
                  fileName: _jsxFileName,
                  lineNumber: 57
                }
              },
              function (geographies, projection) {
                return geographies.map(function (geography, i) {
                  return geography.id !== "ATA" && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Geography"], {
                    key: i,
                    geography: geography,
                    projection: projection,
                    style: {
                      default: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      hover: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      },
                      pressed: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none"
                      }
                    },
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 61
                    }
                  });
                });
              }
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Markers"],
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 88
                }
              },
              this.state.cities.map(function (city, i) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  __WEBPACK_IMPORTED_MODULE_1_react_simple_maps__["Marker"],
                  { key: i, marker: city, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 91
                    }
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("circle", {
                    cx: 0,
                    cy: 0,
                    r: cityScale(city.population),
                    fill: "rgba(255,87,34,0.8)",
                    stroke: "#607D8B",
                    strokeWidth: "2",
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 92
                    }
                  })
                );
              })
            )
          )
        )
      );
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    value: function __reactstandin__regenerateByEval(key, code) {
      this[key] = eval(code);
    }
  }]);

  return BasicMap;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

var _default = BasicMap;


/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/index.js").default;

  var leaveModule = __webpack_require__("./node_modules/react-hot-loader/index.js").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(wrapperStyles, "wrapperStyles", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  reactHotLoader.register(cityScale, "cityScale", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  reactHotLoader.register(BasicMap, "BasicMap", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  reactHotLoader.register(_default, "default", "/home/pavan/works/intelicar/bubbles-map/pages/index.js");
  leaveModule(module);
})();

;
    (function (Component, route) {
      if(!Component) return
      if (false) return
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/")
  
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./pages/index.js");


/***/ })

},[2])
          return { page: comp.default }
        })
      ;
//# sourceMappingURL=index.js.map