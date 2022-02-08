'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var browser = {};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

var tslib_es6 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	__extends: __extends,
	get __assign () { return __assign; },
	__rest: __rest,
	__decorate: __decorate,
	__param: __param,
	__metadata: __metadata,
	__awaiter: __awaiter,
	__generator: __generator,
	__createBinding: __createBinding,
	__exportStar: __exportStar,
	__values: __values,
	__read: __read,
	__spread: __spread,
	__spreadArrays: __spreadArrays,
	__spreadArray: __spreadArray,
	__await: __await,
	__asyncGenerator: __asyncGenerator,
	__asyncDelegator: __asyncDelegator,
	__asyncValues: __asyncValues,
	__makeTemplateObject: __makeTemplateObject,
	__importStar: __importStar,
	__importDefault: __importDefault,
	__classPrivateFieldGet: __classPrivateFieldGet,
	__classPrivateFieldSet: __classPrivateFieldSet
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(tslib_es6);

var consts = {};

Object.defineProperty(consts, "__esModule", { value: true });
consts.ResponseHeaderLength = consts.CommandSecondByte = consts.CommandStartByte = consts.USBVendorId = void 0;
/** VendorID for Silicon Labs */
consts.USBVendorId = 4292;
consts.CommandStartByte = 0xa5;
consts.CommandSecondByte = 0x5a;
consts.ResponseHeaderLength = 7;

var driverBase = {};

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active ) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };
    
// Alias for removeListener added in NodeJS 10.0
// https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
EventEmitter.prototype.off = function(type, listener){
    return this.removeListener(type, listener);
};

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

var _polyfillNode_events = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': EventEmitter,
	EventEmitter: EventEmitter
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_events);

var types = {};

(function (exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPLidarHealthStatus = void 0;
(function (RPLidarHealthStatus) {
    RPLidarHealthStatus[RPLidarHealthStatus["Good"] = 0] = "Good";
    RPLidarHealthStatus[RPLidarHealthStatus["Warning"] = 1] = "Warning";
    RPLidarHealthStatus[RPLidarHealthStatus["Error"] = 2] = "Error";
})(exports.RPLidarHealthStatus || (exports.RPLidarHealthStatus = {}));

}(types));

var util = {};

Object.defineProperty(util, "__esModule", { value: true });
util.round = util.delay = util.raise = void 0;
function raise(message) {
    throw new Error(message);
}
util.raise = raise;
function delay(ms = 0) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
util.delay = delay;
function round(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
}
util.round = round;

var _RPLidarDriverBase_reading, _RPLidarDriverBase_writing, _RPLidarDriverBase_rpmStat, _RPLidarDriverBase_currentCommand, _RPLidarDriverBase_scanning;
Object.defineProperty(driverBase, "__esModule", { value: true });
driverBase.RPLidarDriverBase = void 0;
const tslib_1$1 = require$$0;
const events_1 = require$$1;
const consts_1$1 = consts;
const types_1 = types;
const util_1$1 = util;
var Command;
(function (Command) {
    Command[Command["Stop"] = 0] = "Stop";
    Command[Command["Reset"] = 1] = "Reset";
    Command[Command["Info"] = 2] = "Info";
    Command[Command["Health"] = 3] = "Health";
    Command[Command["SampleRate"] = 4] = "SampleRate";
    Command[Command["Config"] = 5] = "Config";
    Command[Command["Scan"] = 6] = "Scan";
})(Command || (Command = {}));
/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h
 */
const ScanModeConfigCommand = {
    COUNT: { code: 0x70, payloadSize: 0 },
    US_PER_SAMPLE: { code: 0x71, payloadSize: 4 },
    MAX_DISTANCE: { code: 0x74, payloadSize: 2 },
    TYPICAL: { code: 0x7c, payloadSize: 1 },
    NAME: { code: 0x7f, payloadSize: 2 },
};
/**
 * @private
 *
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_driver.h SDK (driver)
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h SDK (cmd)
 * @see https://github.com/SkoltechRobotics/rplidar/blob/master/rplidar.py Python example
 */
class RPLidarDriverBase extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.debug = false;
        _RPLidarDriverBase_reading.set(this, void 0);
        _RPLidarDriverBase_writing.set(this, void 0);
        _RPLidarDriverBase_rpmStat.set(this, void 0);
        _RPLidarDriverBase_currentCommand.set(this, void 0);
        _RPLidarDriverBase_scanning.set(this, false);
    }
    get scanningRPM() {
        return (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f")?.rotations
            ? Math.round((0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f").sum / (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f").rotations)
            : 0;
    }
    get scanningHz() {
        return (0, util_1$1.round)(this.scanningRPM / 60);
    }
    get scanning() {
        return (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_scanning, "f");
    }
    get idle() {
        return !(0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_reading, "f") && !(0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_writing, "f") && !this.scanning && this.currentCommand == null;
    }
    get currentCommand() {
        return (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_currentCommand, "f");
    }
    emit(event, ...data) {
        return super.emit(event, ...data);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    async reset() {
        this.resetScanning();
        await this.doReset();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const resetAfterBytes = await this.portReadAll();
            if (resetAfterBytes === 64)
                return;
            else
                await this.doReset();
        }
    }
    async getHealth() {
        return this.writeCommand(Command.Health, [consts_1$1.CommandStartByte, 0x52], async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            const view = new DataView(raw.buffer);
            const status = view.getUint8(0);
            return {
                status,
                statusText: types_1.RPLidarHealthStatus[status],
                error: view.getUint16(1, true),
            };
        }, commandDescriptorChecker(3, 6, true));
    }
    async getInfo() {
        return this.writeCommand(Command.Info, [consts_1$1.CommandStartByte, 0x50], async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            return {
                model: raw[7],
                firmware: [raw[8], raw[9]],
                hardware: raw[10],
                serial: raw
                    .slice(11, 27)
                    .reduce((acc, item) => `${acc}${item.toString(16).toUpperCase().padStart(2, '0')}`, ''),
            };
        }, commandDescriptorChecker(20, 4, true));
    }
    async getSamplesRate() {
        return this.writeCommand(Command.SampleRate, [consts_1$1.CommandStartByte, 0x59], async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            const view = new DataView(raw.buffer);
            return {
                standard: view.getUint16(0, true),
                express: view.getUint16(2, true),
            };
        }, commandDescriptorChecker(4, 21, true));
    }
    async scanStart(forceMode = false) {
        if (this.scanning)
            return;
        await this.writeCommand(Command.Scan, [consts_1$1.CommandStartByte, forceMode ? 0x21 : 0x20], async (descriptor) => {
            this.emit('scan:start');
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_scanning, true, "f");
            const raw = await this.portRead(descriptor.size);
            if (raw.length !== 5) {
                console.error(raw);
                (0, util_1$1.raise)(`Incorrect start scan data`);
            }
            void (async () => {
                let cache = new Uint8Array();
                do {
                    const data = await this.portRead(descriptor.size);
                    if (!this.scanning) {
                        await this.portDrain();
                        return;
                    }
                    const { sample, buffer } = this.collectScanResponse(data, cache);
                    if (!sample && !buffer) {
                        cache = new Uint8Array();
                        return;
                    }
                    if (sample)
                        this.onScanSample(sample);
                    cache = buffer || new Uint8Array();
                } while (this.scanning ||
                    !this.currentCommand ||
                    this.currentCommand === Command.Scan);
            })();
        }, commandDescriptorChecker(5, 129, false));
    }
    async scanStop() {
        await this.writeCommand(Command.Stop, [consts_1$1.CommandStartByte, 0x25], async () => {
            this.resetScanning();
        });
    }
    async listScanModes() {
        const result = [];
        const modesCount = await this.getScanConfig(ScanModeConfigCommand.COUNT);
        for (let mode = 0; mode < modesCount; mode++) {
            result.push(await this.explainScanMode(mode));
        }
        return result;
    }
    collectScanResponse(raw, buffer) {
        const data = new Uint8Array([...buffer, ...raw]);
        const dataLength = data.length;
        const extraBits = dataLength % 5;
        let sample;
        for (let offset = 0; offset < dataLength - extraBits; offset += 5) {
            sample = this.parseScanResponse(data.slice(offset, offset + 5));
            if (!sample)
                return {};
        }
        buffer = data.slice(dataLength - extraBits, dataLength);
        return { sample, buffer };
    }
    parseScanResponse(raw) {
        const view = new DataView(raw.buffer);
        const s = view.getUint8(0) & 0x01;
        const sInverse = (view.getUint8(0) >> 1) & 0x01;
        if (s === sInverse)
            return;
        const start = s === 1;
        let quality = view.getUint8(0) >> 2;
        const checkBit = view.getUint8(1) & 0x01;
        if (checkBit !== 1)
            return;
        const angle = Math.floor(((view.getUint8(1) >> 1) + (view.getUint8(2) << 7)) / 64);
        if (angle > 360)
            quality = 0;
        const distance = Math.floor(view.getUint16(3, true) / 4);
        return {
            start,
            quality,
            angle,
            distance,
        };
    }
    async doReset() {
        await this.writeCommand(Command.Reset, [consts_1$1.CommandStartByte, 0x40]);
    }
    async portReadAll() {
        try {
            await (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_writing, "f");
            return ((0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, this.doPortReadAll(), "f"));
        }
        finally {
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, undefined, "f");
        }
    }
    async portRead(len) {
        try {
            await (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_writing, "f");
            return ((0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, this.doPortRead(len), "f"));
        }
        finally {
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, undefined, "f");
        }
    }
    async portWrite(data) {
        try {
            await (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_reading, "f");
            return ((0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_writing, this.doPortWrite(data), "f"));
        }
        finally {
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_writing, undefined, "f");
        }
    }
    async writeCommand(cmd, payload, onSent, descriptorChecker) {
        this.debugLog(`[>] WRITE COMMAND ${Command[cmd]}`);
        (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_currentCommand, cmd, "f");
        try {
            await this.portWrite(payload);
            let descriptor;
            if (descriptorChecker) {
                descriptor = await this.readDescriptor();
                this.debugLog(`[!] DESCRIPTOR FOR ${Command[cmd]}`, descriptor);
                descriptorChecker(descriptor);
            }
            const result = onSent
                ? // @ts-expect-error Its OK
                    await onSent(descriptor)
                : undefined;
            this.debugLog(`[OK] COMMAND ${Command[cmd]} DOME`);
            return result;
        }
        finally {
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_currentCommand, undefined, "f");
        }
    }
    async explainScanMode(scanMode) {
        return {
            id: scanMode,
            name: await this.getScanConfig(ScanModeConfigCommand.NAME, scanMode),
            maxDistance: await this.getScanConfig(ScanModeConfigCommand.MAX_DISTANCE, scanMode),
            sampleTime: (await this.getScanConfig(ScanModeConfigCommand.US_PER_SAMPLE, scanMode)) /
                1000,
            isTypical: scanMode === (await this.getScanConfig(ScanModeConfigCommand.TYPICAL, scanMode)),
        };
    }
    async getScanConfig(config, scanMode) {
        const cmd = (() => {
            const cmd = new ArrayBuffer(3 + 4 + config.payloadSize + 1);
            const view = new DataView(cmd);
            view.setUint8(0, consts_1$1.CommandStartByte);
            view.setUint8(1, 0x84);
            view.setUint8(2, 4 + config.payloadSize);
            view.setUint32(3, config.code, true);
            if (scanMode != null)
                view.setUint16(consts_1$1.ResponseHeaderLength, scanMode, true);
            const checkSum = (() => {
                const part = new Uint8Array(cmd);
                return part.reduce((total = 0, num, idx, buf) => (idx < buf.length - 1 ? total ^ num : total), 0);
            })();
            view.setUint8(cmd.byteLength - 1, checkSum);
            return new Uint8Array(cmd);
        })();
        return this.writeCommand(Command.Config, cmd, async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            const view = new DataView(raw.buffer);
            const configType = view.getUint32(0, true);
            let result;
            switch (configType) {
                case ScanModeConfigCommand.COUNT.code:
                    result = view.getUint16(4, true);
                    break;
                case ScanModeConfigCommand.US_PER_SAMPLE.code:
                    result = view.getUint32(4, true);
                    break;
                case ScanModeConfigCommand.MAX_DISTANCE.code:
                    result = view.getUint32(4, true);
                    break;
                case ScanModeConfigCommand.TYPICAL.code:
                    result = view.getUint16(4, true);
                    break;
                case ScanModeConfigCommand.NAME.code:
                    result = new TextDecoder().decode(raw.buffer.slice(4, raw.buffer.byteLength - 1));
                    break;
            }
            return result;
        }, commandDescriptorChecker(undefined, 32, true));
    }
    async readDescriptor() {
        const raw = await this.portRead(consts_1$1.ResponseHeaderLength);
        const view = new DataView(raw.buffer);
        if (raw.length !== consts_1$1.ResponseHeaderLength)
            (0, util_1$1.raise)('Descriptor length mismatch');
        if (view.getUint8(0) !== consts_1$1.CommandStartByte || view.getUint8(1) !== consts_1$1.CommandSecondByte) {
            console.error(`Broken command (${this.currentCommand != null ? Command[this.currentCommand] : 'NONE'}) descriptor`, raw);
            (0, util_1$1.raise)('Incorrect descriptor starting bytes');
        }
        return {
            single: view.getUint8(raw.length - 2) === 0,
            size: view.getUint8(2),
            type: view.getUint8(raw.length - 1),
        };
    }
    onScanSample(sample) {
        if (sample.start) {
            const now = Date.now();
            const stat = (0, tslib_1$1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f") ||
                ((0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_rpmStat, {
                    sum: 0,
                    rotations: 0,
                    startScanFrame: 0,
                }, "f"));
            const elapsed = now - stat.startScanFrame;
            stat.startScanFrame = now;
            if (elapsed < 1000) {
                stat.rotations++;
                stat.sum += Math.round((1.0 / elapsed) * 60000);
            }
            this.emit('scan:start-frame', sample);
        }
        this.emit('scan:sample', sample);
    }
    onPortClose() {
        this.emit('close');
    }
    onPortDisconnect() {
        this.emit('disconnect');
    }
    onPortError(error) {
        this.emit('error', error);
    }
    async onPortPostOpen() {
        await this.reset();
        await this.motorStart();
        this.emit('open');
    }
    resetScanning() {
        if (this.scanning) {
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_scanning, false, "f");
            (0, tslib_1$1.__classPrivateFieldSet)(this, _RPLidarDriverBase_rpmStat, undefined, "f");
            this.emit('scan:stop');
        }
    }
    debugLog(...data) {
        if (this.debug)
            console.log(...data);
    }
}
driverBase.RPLidarDriverBase = RPLidarDriverBase;
_RPLidarDriverBase_reading = new WeakMap(), _RPLidarDriverBase_writing = new WeakMap(), _RPLidarDriverBase_rpmStat = new WeakMap(), _RPLidarDriverBase_currentCommand = new WeakMap(), _RPLidarDriverBase_scanning = new WeakMap();
RPLidarDriverBase.portBaudRate = 115200;
RPLidarDriverBase.portHighWaterMark = 256;
function commandDescriptorChecker(size, type, single) {
    return (descriptor) => {
        if (size != null && descriptor.size !== size)
            (0, util_1$1.raise)(`Invalid response len. Expected: ${size}, actual: ${descriptor.size}`);
        if (type != null && descriptor.type !== type)
            (0, util_1$1.raise)(`Invalid response data type. Expected: ${type}, actual: ${descriptor.type}`);
        if (single != null && descriptor.single !== single)
            (0, util_1$1.raise)(`Invalid response mode. Expected: ${single}, actual: ${descriptor.single}`);
    };
}

var _RPLidarBrowser_port, _RPLidarBrowser_portReader, _RPLidarBrowser_portWriter, _RPLidarBrowser_portReaderBuffer, _PortBuffer_buffer;
Object.defineProperty(browser, "__esModule", { value: true });
exports.RPLidarBrowser = browser.RPLidarBrowser = void 0;
const tslib_1 = require$$0;
const consts_1 = consts;
const driver_base_1 = driverBase;
const util_1 = util;
class RPLidarBrowser extends driver_base_1.RPLidarDriverBase {
    constructor() {
        super(...arguments);
        _RPLidarBrowser_port.set(this, void 0);
        _RPLidarBrowser_portReader.set(this, void 0);
        _RPLidarBrowser_portWriter.set(this, void 0);
        _RPLidarBrowser_portReaderBuffer.set(this, new PortBuffer());
    }
    get serialPortPath() {
        // :(
        return undefined;
    }
    get port() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f") || (0, util_1.raise)('RPLidar serial port not opened');
    }
    get portReadable() {
        return this.port.readable || (0, util_1.raise)('RPLidar not readable');
    }
    get portWriter() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portWriter, "f") || (0, util_1.raise)('Port not ready');
    }
    get portReader() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReader, "f") || (0, util_1.raise)('Port not ready');
    }
    get native() {
        return navigator.serial || (0, util_1.raise)('Browser not provided access to serial');
    }
    async motorStart() {
        await this.port.setSignals({ dataTerminalReady: false });
        await (0, util_1.delay)(10);
    }
    async motorStop() {
        await this.port.setSignals({ dataTerminalReady: true });
        await (0, util_1.delay)(10);
    }
    async open() {
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f"))
            return (0, util_1.raise)('RPLidar port already opened');
        const port = await this.resolvePort();
        port.addEventListener('disconnect', () => {
            this.resetScanning();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_port, undefined, "f");
            this.onPortDisconnect();
        });
        await port.open({
            baudRate: driver_base_1.RPLidarDriverBase.portBaudRate,
            bufferSize: driver_base_1.RPLidarDriverBase.portHighWaterMark,
        });
        await port.setSignals({ dataTerminalReady: false });
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_port, port, "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portReader, port.readable?.getReader(), "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portWriter, port.writable?.getWriter(), "f");
        await this.onPortPostOpen();
        (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
        return this;
    }
    async close() {
        if (!(0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f"))
            return;
        this.resetScanning();
        const port = (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f");
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReader, "f")) {
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReader, "f").releaseLock();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portReader, undefined, "f");
        }
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portWriter, "f")) {
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portWriter, "f").releaseLock();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portWriter, undefined, "f");
        }
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_port, undefined, "f");
        await (0, util_1.delay)();
        await port.close();
        this.onPortClose();
    }
    async resolvePort() {
        const list = await this.native.getPorts();
        return (list.find((port) => {
            const info = port.getInfo();
            return info.usbVendorId === consts_1.USBVendorId;
        }) ||
            this.native.requestPort({
                filters: [{ usbVendorId: consts_1.USBVendorId }],
            }));
    }
    async doPortReadAll() {
        this.debugLog('READ ALL BYTES');
        const reader = this.portReader;
        const v = await reader.read();
        const add = (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
        return (v.value?.length || 0) + add;
    }
    async portDrain() {
        this.debugLog('DRAIN PORT');
        if (this.portReadable && this.portReader) {
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
            await this.portReader.cancel();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portReader, this.portReadable.getReader(), "f");
        }
    }
    async doPortRead(len) {
        await this.portReadable;
        const cmd = this.currentCommand;
        const result = new Uint8Array(len);
        const reader = this.portReader;
        while ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").size < len) {
            if (this.currentCommand !== cmd)
                return new Uint8Array();
            const { value, done } = await reader.read();
            if (value)
                (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").put(value);
            if (done) {
                await (0, util_1.delay)();
                return result;
            }
        }
        await (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").readTo(result, len);
        return result;
    }
    async doPortWrite(data) {
        const writer = this.portWriter;
        (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
        await writer.write(new Uint8Array(data));
    }
}
exports.RPLidarBrowser = browser.RPLidarBrowser = RPLidarBrowser;
_RPLidarBrowser_port = new WeakMap(), _RPLidarBrowser_portReader = new WeakMap(), _RPLidarBrowser_portWriter = new WeakMap(), _RPLidarBrowser_portReaderBuffer = new WeakMap();
class PortBuffer {
    constructor() {
        _PortBuffer_buffer.set(this, new Uint8Array());
    }
    get size() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").length;
    }
    put(data) {
        (0, tslib_1.__classPrivateFieldSet)(this, _PortBuffer_buffer, new Uint8Array([...(0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f"), ...data]), "f");
    }
    async read(len) {
        if (len > this.size)
            (0, util_1.raise)(`Not enough bytes ${len}/${this.size}`);
        const result = (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").slice(0, len);
        (0, tslib_1.__classPrivateFieldSet)(this, _PortBuffer_buffer, (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").slice(len), "f");
        return result;
    }
    async readTo(target, len) {
        const v = await this.read(len);
        for (let i = 0; i < len; i++) {
            target[i] = v[i];
        }
    }
    flush() {
        const result = (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").length;
        (0, tslib_1.__classPrivateFieldSet)(this, _PortBuffer_buffer, new Uint8Array(), "f");
        return result;
    }
}
_PortBuffer_buffer = new WeakMap();

exports["default"] = browser;
