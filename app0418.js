(function () {
  'use strict';

  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function value(target, firstSource) {

        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object');
        }

        var to = Object(target);

        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];

          if (nextSource === undefined || nextSource === null) {
            continue;
          }

          var keysArray = Object.keys(Object(nextSource));

          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }

        return to;
      }
    });
  }

  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      this.parentNode.removeChild(this);
    };
  }

  if (!Array.from) {
    Array.from = function () {
      var toStr = Object.prototype.toString;

      var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };

      var toInteger = function toInteger(value) {
        var number = Number(value);

        if (isNaN(number)) {
          return 0;
        }

        if (number === 0 || !isFinite(number)) {
          return number;
        }

        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };

      var maxSafeInteger = Math.pow(2, 53) - 1;

      var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      }; // Сinойство length метода from равно 1.


      return function from(arrayLike
      /* , mapFn, thisArg */
      ) {
        // 1. Положим C равным значению this.
        var C = this; // 2. Положим items равным ToObject(arrayLike).

        var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        } // 4. Если mapfn равен undefined, положим mapping равным false.


        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;

        if (typeof mapFn !== 'undefined') {
          // 5. иначе
          // 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем
          // исключение TypeError.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          } // 5. b. Если thisArg присутствует, положим T равным thisArg;
          // иначе положим T равным undefined.


          if (arguments.length > 2) {
            T = arguments[2];
          }
        } // 10. Положим lenValue равным Get(items, "length").
        // 11. Положим len равным ToLength(lenValue).


        var len = toLength(items.length); // 13. Если IsConstructor(C) равен true, то
        // 13. a. Положим A равным результату вызова внутреннего метода
        // [[Construct]]
        // объекта C со списком аргументов, содержащим единственный элемент
        // len.
        // 14. a. Иначе, положим A равным ArrayCreate(len).

        var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Положим k равным 0.

        var k = 0; // 17. Пока k < len, будем повторять... (шаги с a по h)

        var kValue;

        while (k < len) {
          kValue = items[k];

          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }

          k += 1;
        } // 18. Положим putStatus равным Put(A, "length", len, true).


        A.length = len; // 20. Вернём A.

        return A;
      };
    }();
  } // https://tc39.github.io/ecma262/#sec-array.prototype.find


  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError
        // exception.

        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        } // 4. If thisArg was supplied, let T be thisArg; else let T be
        // undefined.


        var thisArg = arguments[1]; // 5. Let k be 0.

        var k = 0; // 6. Repeat, while k < len

        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue,
          // k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];

          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          } // e. Increase k by 1.


          k++;
        } // 7. Return undefined.


        return undefined;
      },
      configurable: true,
      writable: true
    });
  } // https://tc39.github.io/ecma262/#sec-array.prototype.includes


  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        } // 1. Let O be ? ToObject(this value).


        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If len is 0, return false.

        if (len === 0) {
          return false;
        } // 4. Let n be ? ToInteger(fromIndex).
        // (If fromIndex is undefined, this step produces the value 0.)


        var n = fromIndex | 0; // 5. If n ≥ 0, then
        // a. Let k be n.
        // 6. Else n < 0,
        // a. Let k be len + n.
        // b. If k < 0, let k be 0.

        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
        } // 7. Repeat, while k < len


        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return
          // true.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          } // c. Increase k by 1.


          k++;
        } // 8. Return false


        return false;
      }
    });
  }

  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {

      if (search instanceof RegExp) {
        throw TypeError('first argument must not be a RegExp');
      }

      if (start === undefined) {
        start = 0;
      }

      return this.indexOf(search, start) !== -1;
    };
  }

  if (!Object.entries) {
    Object.entries = function (obj) {
      var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i); // preallocate the Array

      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }

      return resArray;
    };
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // ближайший аналог внутренней функции
        // IsCallable в ECMAScript 5
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function fNOP() {},
          fBound = function fBound() {
        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  }

  (function () {

    var _slice = Array.prototype.slice;

    try {
      // Не может использоваться с элементами DOM в IE < 9
      _slice.call(document.documentElement);
    } catch (e) {
      // В IE < 9 кидается исключение
      // Функция будет работать для истинных массивов, массивоподобных объектов,
      // NamedNodeMap (атрибуты, сущности, примечания),
      // NodeList (например, getElementsByTagName), HTMLCollection (например, childNodes)
      // и не будет падать на других объектах DOM (как это происходит на элементах DOM в IE < 9)
      Array.prototype.slice = function (begin, end) {
        // IE < 9 будет недоволен аргументом end, равным undefined
        end = typeof end !== 'undefined' ? end : this.length; // Для родных объектов Array мы используем родную функцию slice

        if (Object.prototype.toString.call(this) === '[object Array]') {
          return _slice.call(this, begin, end);
        } // Массивоподобные объекты мы обрабатываем самостоятельно


        var i,
            cloned = [],
            size,
            len = this.length; // Обрабатываем отрицательное значение begin

        var start = begin || 0;
        start = start >= 0 ? start : len + start; // Обрабатываем отрицательное значение end

        var upTo = end ? end : len;

        if (end < 0) {
          upTo = len + end;
        } // Фактически ожидаемый размер среза


        size = upTo - start;

        if (size > 0) {
          cloned = new Array(size);

          if (this.charAt) {
            for (i = 0; i < size; i++) {
              cloned[i] = this.charAt(start + i);
            }
          } else {
            for (i = 0; i < size; i++) {
              cloned[i] = this[start + i];
            }
          }
        }

        return cloned;
      };
    }
  })();

  function subscribe() {
    this.add = function (type, listener) {
      if (this._listeners === undefined) this._listeners = {};
      var listeners = this._listeners;

      if (listeners[type] === undefined) {
        listeners[type] = [];
      }

      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    };

    this.follow = function (type, listener) {
      var _this = this;

      type.split(',').forEach(function (name) {
        _this.add(name, listener);
      });
    };

    this.has = function (type, listener) {
      if (this._listeners === undefined) return false;
      var listeners = this._listeners;
      return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
    };

    this.remove = function (type, listener) {
      if (this._listeners === undefined) return;
      var listeners = this._listeners;
      var listenerArray = listeners[type];

      if (listenerArray !== undefined) {
        var index = listenerArray.indexOf(listener);

        if (index !== -1) {
          listenerArray.splice(index, 1);
        }
      }
    };

    this.send = function (type) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (this._listeners === undefined) return;
      var listeners = this._listeners;
      var listenerArray = listeners[type];

      if (listenerArray !== undefined) {
        event.target = this;
        var array = listenerArray.slice(0);

        for (var i = 0, l = array.length; i < l; i++) {
          array[i].call(this, event);
        }
      }
    };

    this.destroy = function () {
      this._listeners = null;
    };
  }

  function start$4() {
    return new subscribe();
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function toObject(a) {
    if (Object.prototype.toString.call(a) === '[object Object]') return a;else {
      a = {};
      return a;
    }
  }

  function toArray(a) {
    if (Object.prototype.toString.call(a) === '[object Object]') {
      var b = [];

      for (var i in a) {
        b.push(a[i]);
      }

      return b;
    } else if (typeof a == 'string' || a == null || typeof a == 'number' || typeof a == 'undefined') return [];else return a;
  }

  function decodeJson(string, empty) {
    var json = empty || {};

    if (string) {
      try {
        json = JSON.parse(string);
      } catch (e) {}
    }

    return json;
  }

  function isObject(a) {
    return Object.prototype.toString.call(a) === '[object Object]';
  }

  function isArray(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  }

  function extend(a, b, replase) {
    for (var i in b) {
      if (_typeof(b[i]) == 'object') {
        if (a[i] == undefined) a[i] = Object.prototype.toString.call(b[i]) == '[object Array]' ? [] : {};
        this.extend(a[i], b[i], replase);
      } else if (a[i] == undefined || replase) a[i] = b[i];
    }
  }

  function empty$1(a, b) {
    for (var i in b) {
      if (!a[i]) a[i] = b[i];
    }
  }

  function getKeys(a, add) {
    var k = add || [];

    for (var i in a) {
      k.push(i);
    }

    return k;
  }

  function getValues(a, add) {
    var k = add || [];

    for (var i in a) {
      k.push(a[i]);
    }

    return k;
  }

  function remove$2(from, need) {
    var inx = from.indexOf(need);
    if (inx >= 0) from.splice(inx, 1);
  }

  function clone(a) {
    return JSON.parse(JSON.stringify(a));
  }

  function insert(where, index, item) {
    where.splice(index, 0, item);
  }

  function destroy$8(arr) {
    var call_function = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'destroy';
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var where = toArray(arr);

    for (var i = where.length - 1; i >= 0; i--) {
      if (where[i] && where[i][call_function]) where[i][call_function](value);
    }
  }

  function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  function removeNoIncludes(where, items) {
    for (var i = where.length - 1; i >= 0; i--) {
      if (items.indexOf(where[i]) === -1) remove$2(where, where[i]);
    }

    return where;
  }

  var Arrays = {
    toObject: toObject,
    toArray: toArray,
    decodeJson: decodeJson,
    isObject: isObject,
    isArray: isArray,
    extend: extend,
    getKeys: getKeys,
    getValues: getValues,
    insert: insert,
    clone: clone,
    remove: remove$2,
    destroy: destroy$8,
    empty: empty$1,
    groupBy: groupBy,
    removeNoIncludes: removeNoIncludes
  };

  var html$19 = "<div class=\"head\">\n    <div class=\"head__body\">\n        <div class=\"head__logo-icon\">\n            <img src=\"./img/logo-icon.svg\" />\n        </div>\n\n        <div class=\"head__split\"></div>\n\n        <div class=\"head__logo\">\n            <img src=\"./img/logo.svg\" />\n        </div>\n\n        <div class=\"head__title\">\n            \n        </div>\n        <div class=\"head__actions\">\n            <div class=\"head__action head__settings selector open--search\">\n                <svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                    viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n                        <path fill=\"currentColor\" d=\"M225.474,0C101.151,0,0,101.151,0,225.474c0,124.33,101.151,225.474,225.474,225.474\n                            c124.33,0,225.474-101.144,225.474-225.474C450.948,101.151,349.804,0,225.474,0z M225.474,409.323\n                            c-101.373,0-183.848-82.475-183.848-183.848S124.101,41.626,225.474,41.626s183.848,82.475,183.848,183.848\n                            S326.847,409.323,225.474,409.323z\"/>\n                        <path fill=\"currentColor\" d=\"M505.902,476.472L386.574,357.144c-8.131-8.131-21.299-8.131-29.43,0c-8.131,8.124-8.131,21.306,0,29.43l119.328,119.328\n                            c4.065,4.065,9.387,6.098,14.715,6.098c5.321,0,10.649-2.033,14.715-6.098C514.033,497.778,514.033,484.596,505.902,476.472z\"/>\n                </svg>\n            </div>\n\n            <div class=\"head__action selector open--settings\">\n                <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                viewBox=\"0 0 368 368\" style=\"enable-background:new 0 0 368 368;\" xml:space=\"preserve\">\n                <g>\n                    <g>\n                        <path fill=\"currentColor\" d=\"M344,144h-29.952c-2.512-8.2-5.8-16.12-9.792-23.664l21.16-21.16c4.528-4.528,7.024-10.56,7.024-16.984\n                            c0-6.416-2.496-12.448-7.024-16.976l-22.64-22.64c-9.048-9.048-24.888-9.072-33.952,0l-21.16,21.16\n                            c-7.536-3.992-15.464-7.272-23.664-9.792V24c0-13.232-10.768-24-24-24h-32c-13.232,0-24,10.768-24,24v29.952\n                            c-8.2,2.52-16.12,5.8-23.664,9.792l-21.168-21.16c-9.36-9.36-24.592-9.36-33.952,0l-22.648,22.64\n                            c-9.352,9.36-9.352,24.592,0,33.952l21.16,21.168c-3.992,7.536-7.272,15.464-9.792,23.664H24c-13.232,0-24,10.768-24,24v32\n                            C0,213.232,10.768,224,24,224h29.952c2.52,8.2,5.8,16.12,9.792,23.664l-21.16,21.168c-9.36,9.36-9.36,24.592,0,33.952\n                            l22.64,22.648c9.36,9.352,24.592,9.352,33.952,0l21.168-21.16c7.536,3.992,15.464,7.272,23.664,9.792V344\n                            c0,13.232,10.768,24,24,24h32c13.232,0,24-10.768,24-24v-29.952c8.2-2.52,16.128-5.8,23.664-9.792l21.16,21.168\n                            c9.072,9.064,24.912,9.048,33.952,0l22.64-22.64c4.528-4.528,7.024-10.56,7.024-16.976c0-6.424-2.496-12.448-7.024-16.976\n                            l-21.16-21.168c3.992-7.536,7.272-15.464,9.792-23.664H344c13.232,0,24-10.768,24-24v-32C368,154.768,357.232,144,344,144z\n                                M352,200c0,4.408-3.584,8-8,8h-36c-3.648,0-6.832,2.472-7.744,6c-2.832,10.92-7.144,21.344-12.832,30.976\n                            c-1.848,3.144-1.344,7.144,1.232,9.72l25.44,25.448c1.504,1.504,2.336,3.512,2.336,5.664c0,2.152-0.832,4.16-2.336,5.664\n                            l-22.64,22.64c-3.008,3.008-8.312,3.008-11.328,0l-25.44-25.44c-2.576-2.584-6.576-3.08-9.728-1.232\n                            c-9.616,5.68-20.04,10-30.968,12.824c-3.52,0.904-5.992,4.088-5.992,7.736v36c0,4.408-3.584,8-8,8h-32c-4.408,0-8-3.592-8-8v-36\n                            c0-3.648-2.472-6.832-6-7.744c-10.92-2.824-21.344-7.136-30.976-12.824c-1.264-0.752-2.664-1.112-4.064-1.112\n                            c-2.072,0-4.12,0.8-5.664,2.344l-25.44,25.44c-3.128,3.12-8.2,3.12-11.328,0l-22.64-22.64c-3.128-3.128-3.128-8.208,0-11.328\n                            l25.44-25.44c2.584-2.584,3.088-6.584,1.232-9.72c-5.68-9.632-10-20.048-12.824-30.976c-0.904-3.528-4.088-6-7.736-6H24\n                            c-4.408,0-8-3.592-8-8v-32c0-4.408,3.592-8,8-8h36c3.648,0,6.832-2.472,7.744-6c2.824-10.92,7.136-21.344,12.824-30.976\n                            c1.856-3.144,1.352-7.144-1.232-9.72l-25.44-25.44c-3.12-3.12-3.12-8.2,0-11.328l22.64-22.64c3.128-3.128,8.2-3.12,11.328,0\n                            l25.44,25.44c2.584,2.584,6.576,3.096,9.72,1.232c9.632-5.68,20.048-10,30.976-12.824c3.528-0.912,6-4.096,6-7.744V24\n                            c0-4.408,3.592-8,8-8h32c4.416,0,8,3.592,8,8v36c0,3.648,2.472,6.832,6,7.744c10.928,2.824,21.352,7.144,30.968,12.824\n                            c3.152,1.856,7.152,1.36,9.728-1.232l25.44-25.44c3.016-3.024,8.32-3.016,11.328,0l22.64,22.64\n                            c1.504,1.504,2.336,3.52,2.336,5.664s-0.832,4.16-2.336,5.664l-25.44,25.44c-2.576,2.584-3.088,6.584-1.232,9.72\n                            c5.688,9.632,10,20.048,12.832,30.976c0.904,3.528,4.088,6,7.736,6h36c4.416,0,8,3.592,8,8V200z\"/>\n                    </g>\n                </g>\n                <g>\n                    <g>\n                        <path fill=\"currentColor\" d=\"M184,112c-39.696,0-72,32.304-72,72s32.304,72,72,72c39.704,0,72-32.304,72-72S223.704,112,184,112z M184,240\n                            c-30.88,0-56-25.12-56-56s25.12-56,56-56c30.872,0,56,25.12,56,56S214.872,240,184,240z\"/>\n                    </g>\n                </g>\n                </svg>\n            </div>\n\n            <div class=\"head__action selector open--notice notice--icon\">\n                <svg enable-background=\"new 0 0 512 512\" height=\"512\" viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\"><g><path fill=\"currentColor\" d=\"m411 262.862v-47.862c0-69.822-46.411-129.001-110-148.33v-21.67c0-24.813-20.187-45-45-45s-45 20.187-45 45v21.67c-63.59 19.329-110 78.507-110 148.33v47.862c0 61.332-23.378 119.488-65.827 163.756-4.16 4.338-5.329 10.739-2.971 16.267s7.788 9.115 13.798 9.115h136.509c6.968 34.192 37.272 60 73.491 60 36.22 0 66.522-25.808 73.491-60h136.509c6.01 0 11.439-3.587 13.797-9.115s1.189-11.929-2.97-16.267c-42.449-44.268-65.827-102.425-65.827-163.756zm-170-217.862c0-8.271 6.729-15 15-15s15 6.729 15 15v15.728c-4.937-.476-9.94-.728-15-.728s-10.063.252-15 .728zm15 437c-19.555 0-36.228-12.541-42.42-30h84.84c-6.192 17.459-22.865 30-42.42 30zm-177.67-60c34.161-45.792 52.67-101.208 52.67-159.138v-47.862c0-68.925 56.075-125 125-125s125 56.075 125 125v47.862c0 57.93 18.509 113.346 52.671 159.138z\"/><path fill=\"currentColor\" d=\"m451 215c0 8.284 6.716 15 15 15s15-6.716 15-15c0-60.1-23.404-116.603-65.901-159.1-5.857-5.857-15.355-5.858-21.213 0s-5.858 15.355 0 21.213c36.831 36.831 57.114 85.8 57.114 137.887z\"/><path fill=\"currentColor\" d=\"m46 230c8.284 0 15-6.716 15-15 0-52.086 20.284-101.055 57.114-137.886 5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.213 0-42.497 42.497-65.901 98.999-65.901 159.099 0 8.284 6.716 15 15 15z\"/></g></svg>\n            </div>\n        </div>\n\n        <div class=\"head__split\"></div>\n\n        <div class=\"head__time\">\n            <div class=\"head__time-now time--clock\"></div>\n            <div>\n                <div class=\"head__time-date time--full\"></div>\n                <div class=\"head__time-week time--week\"></div>\n            </div>\n        </div>\n    </div>\n</div>";

  var html$18 = "<div class=\"wrap layer--height layer--width\">\n    <div class=\"wrap__left layer--height\"></div>\n    <div class=\"wrap__content layer--height layer--width\"></div>\n</div>";

  var html$17 = "<div class=\"menu\">\n\n    <div class=\"menu__case\">\n        <ul class=\"menu__list\">\n            <li class=\"menu__item selector\" data-action=\"main\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/home.svg\" /></div>\n                <div class=\"menu__text\">首页</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"movie\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/movie.svg\" /></div>\n                <div class=\"menu__text\">电影</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"tv\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/tv.svg\" /></div>\n                <div class=\"menu__text\">电视节目</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"catalog\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/catalog.svg\" /></div>\n                <div class=\"menu__text\">目录</div>\n            </li>\n            <li class=\"menu__item selector\" data-action=\"collections\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/catalog.svg\" /></div>\n                <div class=\"menu__text\">合集</div>\n            </li>\n            <li class=\"menu__item selector\" data-action=\"relise\">\n                <div class=\"menu__ico\">\n                    <svg height=\"30\" viewBox=\"0 0 38 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect x=\"1.5\" y=\"1.5\" width=\"35\" height=\"27\" rx=\"1.5\" stroke=\"white\" stroke-width=\"3\"/>\n                    <path d=\"M18.105 22H15.2936V16H9.8114V22H7V8H9.8114V13.6731H15.2936V8H18.105V22Z\" fill=\"white\"/>\n                    <path d=\"M20.5697 22V8H24.7681C25.9676 8 27.039 8.27885 27.9824 8.83654C28.9321 9.38782 29.6724 10.1763 30.2034 11.2019C30.7345 12.2212 31 13.3814 31 14.6827V15.3269C31 16.6282 30.7376 17.7853 30.2128 18.7981C29.6943 19.8109 28.9602 20.5962 28.0105 21.1538C27.0609 21.7115 25.9895 21.9936 24.7962 22H20.5697ZM23.3811 10.3365V19.6827H24.7399C25.8395 19.6827 26.6798 19.3141 27.2608 18.5769C27.8419 17.8397 28.1386 16.7853 28.1511 15.4135V14.6731C28.1511 13.25 27.8637 12.1731 27.289 11.4423C26.7142 10.7051 25.8739 10.3365 24.7681 10.3365H23.3811Z\" fill=\"white\"/>\n                    </svg>\n                </div>\n                <div class=\"menu__text\">发布</div>\n            </li>\n            <li class=\"menu__item selector\" data-action=\"anime\">\n                <div class=\"menu__ico\">\n                    <svg height=\"173\" viewBox=\"0 0 180 173\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M126 3C126 18.464 109.435 31 89 31C68.5655 31 52 18.464 52 3C52 2.4505 52.0209 1.90466 52.0622 1.36298C21.3146 15.6761 0 46.8489 0 83C0 132.706 40.2944 173 90 173C139.706 173 180 132.706 180 83C180 46.0344 157.714 14.2739 125.845 0.421326C125.948 1.27051 126 2.13062 126 3ZM88.5 169C125.779 169 156 141.466 156 107.5C156 84.6425 142.314 64.6974 122 54.0966C116.6 51.2787 110.733 55.1047 104.529 59.1496C99.3914 62.4998 94.0231 66 88.5 66C82.9769 66 77.6086 62.4998 72.4707 59.1496C66.2673 55.1047 60.3995 51.2787 55 54.0966C34.6864 64.6974 21 84.6425 21 107.5C21 141.466 51.2208 169 88.5 169Z\" fill=\"white\"/>\n                    <path d=\"M133 121.5C133 143.315 114.196 161 91 161C67.804 161 49 143.315 49 121.5C49 99.6848 67.804 116.5 91 116.5C114.196 116.5 133 99.6848 133 121.5Z\" fill=\"white\"/>\n                    <path d=\"M72 81C72 89.8366 66.1797 97 59 97C51.8203 97 46 89.8366 46 81C46 72.1634 51.8203 65 59 65C66.1797 65 72 72.1634 72 81Z\" fill=\"white\"/>\n                    <path d=\"M131 81C131 89.8366 125.18 97 118 97C110.82 97 105 89.8366 105 81C105 72.1634 110.82 65 118 65C125.18 65 131 72.1634 131 81Z\" fill=\"white\"/>\n                    </svg>\n                </div>\n                <div class=\"menu__text\">动漫</div>\n            </li>\n        </ul>\n    </div>\n\n    <div class=\"menu__split\"></div>\n\n    <div class=\"menu__case\">\n        <ul class=\"menu__list\">\n            <li class=\"menu__item selector\" data-action=\"favorite\" data-type=\"book\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/bookmark.svg\" /></div>\n                <div class=\"menu__text\">书签</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"favorite\" data-type=\"like\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/like.svg\" /></div>\n                <div class=\"menu__text\">喜欢</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"favorite\" data-type=\"wath\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/time.svg\" /></div>\n                <div class=\"menu__text\">稍后</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"favorite\" data-type=\"history\">\n                <div class=\"menu__ico\">\n                    <svg height=\"34\" viewBox=\"0 0 28 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect x=\"1.5\" y=\"1.5\" width=\"25\" height=\"31\" rx=\"2.5\" stroke=\"white\" stroke-width=\"3\"/>\n                    <rect x=\"6\" y=\"7\" width=\"9\" height=\"9\" rx=\"1\" fill=\"white\"/>\n                    <rect x=\"6\" y=\"19\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n                    <rect x=\"6\" y=\"25\" width=\"11\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n                    <rect x=\"17\" y=\"7\" width=\"5\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n                    </svg>\n                </div>\n                <div class=\"menu__text\">历史</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"mytorrents\">\n                <div class=\"menu__ico\">\n                    <svg height=\"34\" viewBox=\"0 0 28 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect x=\"1.5\" y=\"1.5\" width=\"25\" height=\"31\" rx=\"2.5\" stroke=\"white\" stroke-width=\"3\"/>\n                    <rect x=\"6\" y=\"7\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n                    <rect x=\"6\" y=\"13\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"white\"/>\n                    </svg>\n                </div>\n                <div class=\"menu__text\">种子</div>\n            </li>\n        </ul>\n    </div>\n\n    <div class=\"menu__split\"></div>\n\n    <div class=\"menu__case\">\n        <ul class=\"menu__list\">\n            <li class=\"menu__item selector\" data-action=\"settings\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/settings.svg\" /></div>\n                <div class=\"menu__text\">设置</div>\n            </li>\n\n            <li class=\"menu__item selector\" data-action=\"about\">\n                <div class=\"menu__ico\"><img src=\"./img/icons/menu/info.svg\" /></div>\n                <div class=\"menu__text\">关于</div>\n            </li>\n        </ul>\n    </div>\n</div>";

  var html$16 = "<div class=\"activitys layer--width\">\n    <div class=\"activitys__slides\"></div>\n</div>";

  var html$15 = "<div class=\"activity layer--width\">\n    <div class=\"activity__body\"></div>\n    <div class=\"activity__loader\"></div>\n</div>";

  var html$14 = "<div class=\"scroll\">\n    <div class=\"scroll__content\">\n        <div class=\"scroll__body\">\n            \n        </div>\n    </div>\n</div>";

  var html$13 = "<div class=\"settings\">\n    <div class=\"settings__layer\"></div>\n    <div class=\"settings__content layer--height\">\n        <div class=\"settings__head\">\n            <div class=\"settings__title\">设置</div>\n        </div>\n        <div class=\"settings__body\"></div>\n    </div>\n</div>";

  var html$12 = "<div>\n    <div class=\"settings-folder selector\" data-component=\"account\">\n        <div class=\"settings-folder__icon\">\n            <svg height=\"169\" viewBox=\"0 0 172 169\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"85.765\" cy=\"47.5683\" r=\"15.5683\" stroke=\"white\" stroke-width=\"12\"/>\n                <path d=\"M121.53 112C121.53 92.2474 105.518 76.2349 85.7651 76.2349C66.0126 76.2349 50 92.2474 50 112\" stroke=\"white\" stroke-width=\"12\"/>\n                <rect x=\"44\" y=\"125\" width=\"84\" height=\"16\" rx=\"8\" fill=\"white\"/>\n                <rect x=\"6\" y=\"6\" width=\"160\" height=\"157\" rx=\"21\" stroke=\"white\" stroke-width=\"12\"/>\n            </svg>\n        </div>\n        <div class=\"settings-folder__name\">帐户</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"interface\">\n        <div class=\"settings-folder__icon\">\n            <img src=\"./img/icons/settings/panel.svg\" />\n        </div>\n        <div class=\"settings-folder__name\">界面</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"player\">\n        <div class=\"settings-folder__icon\">\n            <img src=\"./img/icons/settings/player.svg\" />\n        </div>\n        <div class=\"settings-folder__name\">播放器</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"parser\">\n        <div class=\"settings-folder__icon\">\n            <img src=\"./img/icons/settings/parser.svg\" />\n        </div>\n        <div class=\"settings-folder__name\">种子搜索</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"server\">\n        <div class=\"settings-folder__icon\">\n            <img src=\"./img/icons/settings/server.svg\" />\n        </div>\n        <div class=\"settings-folder__name\">TorrServer</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"plugins\">\n        <div class=\"settings-folder__icon\">\n            <svg height=\"44\" viewBox=\"0 0 44 44\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <rect width=\"21\" height=\"21\" rx=\"2\" fill=\"white\"/>\n            <mask id=\"path-2-inside-1_154:24\" fill=\"white\">\n            <rect x=\"2\" y=\"27\" width=\"17\" height=\"17\" rx=\"2\"/>\n            </mask>\n            <rect x=\"2\" y=\"27\" width=\"17\" height=\"17\" rx=\"2\" stroke=\"white\" stroke-width=\"6\" mask=\"url(#path-2-inside-1_154:24)\"/>\n            <rect x=\"27\" y=\"2\" width=\"17\" height=\"17\" rx=\"2\" fill=\"white\"/>\n            <rect x=\"27\" y=\"34\" width=\"17\" height=\"3\" fill=\"white\"/>\n            <rect x=\"34\" y=\"44\" width=\"17\" height=\"3\" transform=\"rotate(-90 34 44)\" fill=\"white\"/>\n            </svg>\n        </div>\n        <div class=\"settings-folder__name\">插件</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"cloud\">\n        <div class=\"settings-folder__icon\">\n            <svg height=\"60\" viewBox=\"0 0 63 60\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M48.75 25.9904L63 13L48.75 0.00961304V9H5V17H48.75V25.9904Z\" fill=\"white\"/>\n            <path d=\"M14.25 59.9808L0 46.9904L14.25 34V42.9904H58V50.9904H14.25V59.9808Z\" fill=\"white\"/>\n            </svg>\n        </div>\n        <div class=\"settings-folder__name\">同步</div>\n    </div>\n    <div class=\"settings-folder selector\" data-component=\"more\">\n        <div class=\"settings-folder__icon\">\n            <img src=\"./img/icons/settings/more.svg\" />\n        </div>\n        <div class=\"settings-folder__name\">其他</div>\n    </div>\n    \n</div>";

  var html$11 = "<div>\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"interface_size\">\n        <div class=\"settings-param__name\">接口大小</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>背景</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"background\">\n        <div class=\"settings-param__name\">显示背景</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"background_type\">\n        <div class=\"settings-param__name\">背景类型</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>性能</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"animation\">\n        <div class=\"settings-param__name\">动画</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">卡片和内容的动画</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"mask\">\n        <div class=\"settings-param__name\">淡入淡出</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">从上到下淡出卡片</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"scroll_type\">\n        <div class=\"settings-param__name\">滚动类型</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"card_views_type\">\n        <div class=\"settings-param__name\">卡片视图类型</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">卡片将在信息流滚动时加载逐步或全部下载</div>\n    </div>\n</div>";

  var html$10 = "<div>\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"parser_use\">\n        <div class=\"settings-param__name\">启用种子搜索</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">您在此同意承担使用公共链接、查看种子和在线内容的所有责任</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"parser_torrent_type\">\n        <div class=\"settings-param__name\">Torrent解析器类型</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>Jackett</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"jackett_url\" placeholder=\"例如: 192.168.x\">\n        <div class=\"settings-param__name\">Link</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">指定Jackett脚本的链接</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"jackett_key\" placeholder=\"例如: sa0sk83d..\">\n        <div class=\"settings-param__name\">Api key</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">位于Jackett</div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>Torlook</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"torlook_site\" placeholder=\"...\">\n        <div class=\"settings-param__name\">网站</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">要抓取的站点</div>\n    </div>\n\n    <div class=\"settings-param selector is--torllok\" data-type=\"toggle\" data-name=\"torlook_parse_type\">\n        <div class=\"settings-param__name\">TorLook站点解析方法</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector is--torllok\" data-type=\"input\" data-name=\"parser_website_url\" placeholder=\"例如: scraperapi.com\">\n        <div class=\"settings-param__name\">链接到站点解析器</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">注册站点scraperapi.com，注册链接api.scraperapi.com? api_key=...&url={q}<br>在 {q} w41.torlook.info</div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>更多</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"parse_lang\">\n        <div class=\"settings-param__name\">搜索语言</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">用什么语言搜索种子？</div>\n    </div>\n</div>";

  var html$$ = "<div>\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"torrserver_use_link\">\n        <div class=\"settings-param__name\">使用链接</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>链接地址</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"torrserver_url\" placeholder=\"例如: 192.168.x\">\n        <div class=\"settings-param__name\">主链接</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">指定到 TorrServer 脚本的主链接</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"torrserver_url_two\" placeholder=\"例如: 192.168.X\">\n        <div class=\"settings-param__name\">次要链接</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">指定TorrServer脚本的次要链接</div>\n    </div>\n    \n    <div class=\"settings-param-title\"><span>高级</span></div>\n\n    <div class=\"settings-param selector is--android\" data-type=\"toggle\" data-name=\"internal_torrclient\">\n        <div class=\"settings-param__name\">内置客户端</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">使用内置的TorrServe JS客户端，否则启动系统自带</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"torrserver_savedb\">\n        <div class=\"settings-param__name\">保存到数据库</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">Torrent 将被添加到 TorrServer 基础</div>\n    </div>\n    \n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"torrserver_preload\">\n        <div class=\"settings-param__name\">使用预加载缓冲区</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">播放前等待 TorrServer 预加载缓冲区填满</div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>授权</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"torrserver_auth\">\n        <div class=\"settings-param__name\">密码登录</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"torrserver_login\" placeholder=\"未指定\">\n        <div class=\"settings-param__name\">登录</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"torrserver_password\" data-string=\"true\" placeholder=\"未指定\">\n        <div class=\"settings-param__name\">密码</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n</div>";

  var html$_ = "<div>\n    <div class=\"settings-param selector is--player\" data-type=\"toggle\" data-name=\"player\">\n        <div class=\"settings-param__name\">播放器类型</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">用哪种播放器播放</div>\n    </div>\n    \n    <div class=\"settings-param selector is--android\" data-type=\"button\" data-name=\"reset_player\" data-static=\"true\">\n        <div class=\"settings-param__name\">重置默认播放器</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">重置应用中选中的安卓播放器</div>\n    </div>\n    \n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"playlist_next\">\n        <div class=\"settings-param__name\">自动播放下一集</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">当前一集结束时自动切换到下一集</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"player_timecode\">\n        <div class=\"settings-param__name\">时间代码</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">从上次查看的位置恢复</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"player_scale_method\">\n        <div class=\"settings-param__name\">缩放方式</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">视频缩放的计算方式</div>\n    </div>\n    \n    <div class=\"is--has_subs\">\n        <div class=\"settings-param-title\"><span>字幕</span></div>\n        \n        <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"subtitles_size\">\n            <div class=\"settings-param__name\">size</div>\n            <div class=\"settings-param__value\"></div>\n            <div class=\"settings-param__descr\"></div>\n        </div>\n        \n        <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"subtitles_stroke\">\n            <div class=\"settings-param__name\">使用边框</div>\n            <div class=\"settings-param__value\"></div>\n            <div class=\"settings-param__descr\">字幕将被黑色勾勒以提高可读性</div>\n        </div>\n        \n        <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"subtitles_backdrop\">\n            <div class=\"settings-param__name\">使用水印</div>\n            <div class=\"settings-param__value\"></div>\n            <div class=\"settings-param__descr\">字幕将显示在半透明水印上以提高可读性</div>\n        </div>\n    </div>  \n</div>";

  var html$Z = "<div>\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"start_page\">\n        <div class=\"settings-param__name\">起始页</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">哪个启动时开始的页面</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"source\">\n        <div class=\"settings-param__name\">主要来源</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">从哪里获取有关电影的信息。</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"tmdb_lang\">\n        <div class=\"settings-param__name\">TMDB</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">以哪种语言显示来自 TMDB 的数据</div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"pages_save_total\">\n        <div class=\"settings-param__name\">要在内存中保留多少页</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">保留页面，保留页面</div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>屏幕保护程序</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"screensaver\">\n        <div class=\"settings-param__name\">空闲时显示启动屏幕</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"screensaver_type\">\n        <div class=\"settings-param__name\">屏幕保护程序类型</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    \n    <div class=\"settings-param-title\"><span>更多</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"select\" data-name=\"time_offset\">\n        <div class=\"settings-param__name\">移动时间</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"select\" data-name=\"navigation_type\">\n        <div class=\"settings-param__name\">导航操控方式</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"device_name\" placeholder=\"例如: My Lamp\">\n        <div class=\"settings-param__name\">设备名称</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n</div>";

  var html$Y = "<div>\n    <div class=\"settings-param selector\" data-name=\"plugins\" data-static=\"true\" data-notice=\"要使插件工作，您需要重新启动应用程序。\">\n        <div class=\"settings-param__name\">添加插件</div>\n        <div class=\"settings-param__descr\">要删除插件，请按住确定按钮</div>\n    </div>\n</div>";

  var html$X = "<div>\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"cloud_use\">\n        <div class=\"settings-param__name\">同步</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">同步可以同步您的书签、浏览历史、标签和时间码。 https://github.com/yumata/lampa/wiki</div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>授权</span></div>\n\n    <div class=\"settings-param selector\" data-type=\"input\" data-name=\"cloud_token\" placeholder=\"未指定\">\n        <div class=\"settings-param__name\">Token</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>'连接说明状态</span></div>\n\n    <div class=\"settings-param selector settings--cloud-status\" data-static=\"true\">\n        <div class=\"settings-param__name\"></div>\n        <div class=\"settings-param__descr\"></div>\n    </div>\n</div>";

  var html$W = "<div>\n    <div class=\"settings-param selector\" data-type=\"toggle\" data-name=\"account_use\">\n        <div class=\"settings-param__name\">同步</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">与 CUB 服务同步、书签同步、浏览历史记录、标签和时间码。网站: https://cub.watch</div>\n    </div>\n\n    <div class=\"settings-param-title settings--account-user hide\"><span>帐户</span></div>\n\n    <div class=\"settings-param selector settings--account-user settings--account-user-info hide\" data-static=\"true\">\n        <div class=\"settings-param__name\">登录身份</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector settings--account-user settings--account-user-profile hide\" data-static=\"true\">\n        <div class=\"settings-param__name\">个人资料</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector settings--account-user settings--account-user-out hide\" data-static=\"true\">\n        <div class=\"settings-param__name\">注销</div>\n    </div>\n\n    <div class=\"settings-param-title settings--account-signin\"><span>授权</span></div>\n\n    <div class=\"settings-param selector settings--account-signin\" data-type=\"input\" data-name=\"account_email\" placeholder=\"未指定\">\n        <div class=\"settings-param__name\">Email</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param selector settings--account-signin\" data-type=\"input\" data-string=\"true\" data-name=\"account_password\" placeholder=\"未指定\">\n        <div class=\"settings-param__name\">密码</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n\n    <div class=\"settings-param-title\"><span>状态</span></div>\n\n    <div class=\"settings-param selector settings--account-status\" data-static=\"true\">\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\"></div>\n    </div>\n</div>";

  var html$V = "<div class=\"items-line\">\n    <div class=\"items-line__head\">\n        <div class=\"items-line__title\">{title}</div>\n    </div>\n    <div class=\"items-line__body\"></div>\n</div>";

  var html$U = "<div class=\"card selector\">\n    <div class=\"card__view\">\n        <img src=\"./img/img_load.svg\" class=\"card__img\" />\n    </div>\n\n    <div class=\"card__icons\">\n        <div class=\"card__icons-inner\">\n            \n        </div>\n    </div>\n    \n    <div class=\"card__title\">{title}</div>\n    <div class=\"card__age\">{release_year}</div>\n\n    \n</div>";

  var html$T = "<div class=\"card-parser selector\">\n    <div class=\"card-parser__title\">{Title}</div>\n\n    <div class=\"card-parser__footer\">\n        <div class=\"card-parser__details\">\n            <div>分享: <span>{Seeders}</span></div>\n            <div>用户: <span>{Peers}</span></div>\n        </div>\n        <div class=\"card-parser__size\">{size}</div>\n    </div>\n</div>";

  var html$S = "<div class=\"full-start\">\n\n    <div class=\"full-start__body\">\n        <div class=\"full-start__right\">\n            <div class=\"full-start__poster\">\n                <img src=\"{img}\" class=\"full-start__img\" />\n            </div>\n        </div>\n\n        <div class=\"full-start__left\">\n            <div class=\"full-start__tags\">\n                <div class=\"full-start__tag\">\n                    <img src=\"./img/icons/pulse.svg\" /> <div>{genres}</div>\n                </div>\n                <div class=\"full-start__tag\">\n                    <img src=\"./img/icons/time.svg\" /> <div>{time}</div>\n                </div>\n                <div class=\"full-start__tag hide is--serial\">\n                    <img src=\"./img/icons/menu/catalog.svg\" /> <div>{seasons}</div>\n                </div>\n                <div class=\"full-start__tag hide is--serial\">\n                    <img src=\"./img/icons/menu/movie.svg\" /> <div>{episodes}</div>\n                </div>\n            </div>\n\n            <div class=\"full-start__title\">{title}</div>\n            <div class=\"full-start__title-original\">{original_title}</div>\n\n            <div class=\"full-start__descr\">{descr}</div>\n        </div>\n\n        \n    </div>\n\n    <div class=\"full-start__buttons\">\n        <div class=\"full-start__button view--torrent hide\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:svgjs=\"http://svgjs.com/svgjs\" version=\"1.1\" width=\"512\" height=\"512\" x=\"0\" y=\"0\" viewBox=\"0 0 30.051 30.051\" style=\"enable-background:new 0 0 512 512\" xml:space=\"preserve\" class=\"\">\n                <path d=\"M19.982,14.438l-6.24-4.536c-0.229-0.166-0.533-0.191-0.784-0.062c-0.253,0.128-0.411,0.388-0.411,0.669v9.069   c0,0.284,0.158,0.543,0.411,0.671c0.107,0.054,0.224,0.081,0.342,0.081c0.154,0,0.31-0.049,0.442-0.146l6.24-4.532   c0.197-0.145,0.312-0.369,0.312-0.607C20.295,14.803,20.177,14.58,19.982,14.438z\" fill=\"currentColor\"/>\n                <path d=\"M15.026,0.002C6.726,0.002,0,6.728,0,15.028c0,8.297,6.726,15.021,15.026,15.021c8.298,0,15.025-6.725,15.025-15.021   C30.052,6.728,23.324,0.002,15.026,0.002z M15.026,27.542c-6.912,0-12.516-5.601-12.516-12.514c0-6.91,5.604-12.518,12.516-12.518   c6.911,0,12.514,5.607,12.514,12.518C27.541,21.941,21.937,27.542,15.026,27.542z\" fill=\"currentColor\"/>\n            </svg>\n\n            <span>种子</span>\n        </div>\n\n        <div class=\"full-start__button selector view--trailer\">\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n                <path fill=\"currentColor\" d=\"M482.909,67.2H29.091C13.05,67.2,0,80.25,0,96.291v319.418C0,431.75,13.05,444.8,29.091,444.8h453.818\n                    c16.041,0,29.091-13.05,29.091-29.091V96.291C512,80.25,498.95,67.2,482.909,67.2z M477.091,409.891H34.909V102.109h442.182\n                    V409.891z\"/>\n                <rect fill=\"currentColor\" x=\"126.836\" y=\"84.655\" width=\"34.909\" height=\"342.109\"/>\n                <rect fill=\"currentColor\" x=\"350.255\" y=\"84.655\" width=\"34.909\" height=\"342.109\"/>\n                <rect fill=\"currentColor\" x=\"367.709\" y=\"184.145\" width=\"126.836\" height=\"34.909\"/>\n                <rect fill=\"currentColor\" x=\"17.455\" y=\"184.145\" width=\"126.836\" height=\"34.909\"/>\n                <rect fill=\"currentColor\" x=\"367.709\" y=\"292.364\" width=\"126.836\" height=\"34.909\"/>\n                <rect fill=\"currentColor\" x=\"17.455\" y=\"292.364\" width=\"126.836\" height=\"34.909\"/>\n            </svg>\n\n            <span>预告片</span>\n        </div>\n\n        \n\n        <div class=\"full-start__button selector open--menu\">\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n                <path fill=\"currentColor\" d=\"M436.742,180.742c-41.497,0-75.258,33.761-75.258,75.258s33.755,75.258,75.258,75.258\n                    C478.239,331.258,512,297.503,512,256C512,214.503,478.239,180.742,436.742,180.742z M436.742,294.246\n                    c-21.091,0-38.246-17.155-38.246-38.246s17.155-38.246,38.246-38.246s38.246,17.155,38.246,38.246\n                    S457.833,294.246,436.742,294.246z\"/>\n            \n                <path fill=\"currentColor\" d=\"M256,180.742c-41.497,0-75.258,33.761-75.258,75.258s33.761,75.258,75.258,75.258c41.503,0,75.258-33.755,75.258-75.258\n                    C331.258,214.503,297.503,180.742,256,180.742z M256,294.246c-21.091,0-38.246-17.155-38.246-38.246s17.155-38.246,38.246-38.246\n                    s38.246,17.155,38.246,38.246S277.091,294.246,256,294.246z\"/>\n            \n                <path fill=\"currentColor\" d=\"M75.258,180.742C33.761,180.742,0,214.503,0,256c0,41.503,33.761,75.258,75.258,75.258\n                    c41.497,0,75.258-33.755,75.258-75.258C150.516,214.503,116.755,180.742,75.258,180.742z M75.258,294.246\n                    c-21.091,0-38.246-17.155-38.246-38.246s17.155-38.246,38.246-38.246c21.091,0,38.246,17.155,38.246,38.246\n                    S96.342,294.246,75.258,294.246z\"/>\n            </svg>\n        </div>\n\n        <div class=\"full-start__icons\">\n            <div class=\"info__icon icon--book selector\" data-type=\"book\"></div>\n            <div class=\"info__icon icon--like selector\" data-type=\"like\"></div>\n            <div class=\"info__icon icon--wath selector\" data-type=\"wath\"></div>\n        </div>\n\n        <div class=\"info__rate\"><span>{r_themovie}</span></div>\n    </div>\n</div>";

  var html$R = "<div class=\"full-descr\">\n    <div class=\"full-descr__left\">\n        <div class=\"full-descr__text\">{text}</div>\n\n        <div class=\"full-descr__line full--genres\">\n            <div class=\"full-descr__line-name\">类型</div>\n            <div class=\"full-descr__line-body\">{genres}</div>\n        </div>\n\n        <div class=\"full-descr__line full--companies\">\n            <div class=\"full-descr__line-name\">出品公司</div>\n            <div class=\"full-descr__line-body\">{companies}</div>\n        </div>\n    </div>\n\n    <div class=\"full-descr__right\">\n        <div class=\"full-descr__info\">\n            <div class=\"full-descr__info-name\">发布日期</div>\n            <div class=\"full-descr__info-body\">{relise}</div>\n        </div>\n\n        <div class=\"full-descr__info\">\n            <div class=\"full-descr__info-name\">预算</div>\n            <div class=\"full-descr__info-body\">{budget}</div>\n        </div>\n\n        <div class=\"full-descr__info\">\n            <div class=\"full-descr__info-name\">国家</div>\n            <div class=\"full-descr__info-body\">{countries}</div>\n        </div>\n    </div>\n</div>";

  var html$Q = "<div class=\"full-person selector\">\n    <div style=\"background-image: url('{img}');\" class=\"full-person__photo\"></div>\n\n    <div class=\"full-person__body\">\n        <div class=\"full-person__name\">{name}</div>\n        <div class=\"full-person__role\">{role}</div>\n    </div>\n</div>";

  var html$P = "<div class=\"full-review selector\">\n    <div class=\"full-review__text\">{text}</div>\n\n    <div class=\"full-review__footer\">喜欢: {like_count}</div>\n</div>";

  var html$O = "<div class=\"player\">\n    \n</div>";

  var html$N = "<div class=\"player-panel\">\n\n    <div class=\"player-panel__body\">\n        <div class=\"player-panel__timeline selector\">\n            <div class=\"player-panel__peding\"></div>\n            <div class=\"player-panel__position\"><div></div></div>\n            <div class=\"player-panel__time hide\"></div>\n        </div>\n\n        <div class=\"player-panel__line\">\n            <div class=\"player-panel__timenow\"></div>\n            <div class=\"player-panel__timeend\"></div>\n        </div>\n\n        <div class=\"player-panel__line\">\n            <div class=\"player-panel__left\">\n                <div class=\"player-panel__prev button selector\"></div>\n                <div class=\"player-panel__next button selector\"></div>\n            </div>\n            <div class=\"player-panel__center\">\n                <div class=\"player-panel__tstart button selector\">\n                    <svg width=\"35\" height=\"24\" viewBox=\"0 0 35 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M14.75 10.2302C13.4167 11 13.4167 12.9245 14.75 13.6943L32 23.6536C33.3333 24.4234 35 23.4612 35 21.9216L35 2.00298C35 0.463381 33.3333 -0.498867 32 0.270933L14.75 10.2302Z\" fill=\"currentColor\"/>\n                    <path d=\"M1.75 10.2302C0.416665 11 0.416667 12.9245 1.75 13.6943L19 23.6536C20.3333 24.4234 22 23.4612 22 21.9216L22 2.00298C22 0.463381 20.3333 -0.498867 19 0.270933L1.75 10.2302Z\" fill=\"currentColor\"/>\n                    <rect width=\"6\" height=\"24\" rx=\"2\" transform=\"matrix(-1 0 0 1 6 0)\" fill=\"currentColor\"/>\n                    </svg>\n                </div>\n                <div class=\"player-panel__rprev button selector\">\n                    <svg width=\"35\" height=\"25\" viewBox=\"0 0 35 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M14 10.7679C12.6667 11.5377 12.6667 13.4622 14 14.232L31.25 24.1913C32.5833 24.9611 34.25 23.9989 34.25 22.4593L34.25 2.5407C34.25 1.0011 32.5833 0.0388526 31.25 0.808653L14 10.7679Z\" fill=\"currentColor\"/>\n                    <path d=\"M0.999998 10.7679C-0.333335 11.5377 -0.333333 13.4622 1 14.232L18.25 24.1913C19.5833 24.9611 21.25 23.9989 21.25 22.4593L21.25 2.5407C21.25 1.0011 19.5833 0.0388526 18.25 0.808653L0.999998 10.7679Z\" fill=\"currentColor\"/>\n                    </svg>\n                </div>\n                <div class=\"player-panel__playpause button selector\"></div>\n                <div class=\"player-panel__rnext button selector\">\n                    <svg width=\"35\" height=\"25\" viewBox=\"0 0 35 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M20.25 10.7679C21.5833 11.5377 21.5833 13.4622 20.25 14.232L3 24.1913C1.66666 24.9611 -6.72981e-08 23.9989 0 22.4593L8.70669e-07 2.5407C9.37967e-07 1.0011 1.66667 0.0388526 3 0.808653L20.25 10.7679Z\" fill=\"currentColor\"/>\n                    <path d=\"M33.25 10.7679C34.5833 11.5377 34.5833 13.4622 33.25 14.232L16 24.1913C14.6667 24.9611 13 23.9989 13 22.4593L13 2.5407C13 1.0011 14.6667 0.0388526 16 0.808653L33.25 10.7679Z\" fill=\"currentColor\"/>\n                    </svg>\n                </div>\n                <div class=\"player-panel__tend button selector\">\n                    <svg width=\"35\" height=\"24\" viewBox=\"0 0 35 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M20.25 10.2302C21.5833 11 21.5833 12.9245 20.25 13.6943L3 23.6536C1.66666 24.4234 -6.72981e-08 23.4612 0 21.9216L8.70669e-07 2.00298C9.37967e-07 0.463381 1.66667 -0.498867 3 0.270933L20.25 10.2302Z\" fill=\"currentColor\"/>\n                    <path d=\"M33.25 10.2302C34.5833 11 34.5833 12.9245 33.25 13.6943L16 23.6536C14.6667 24.4234 13 23.4612 13 21.9216L13 2.00298C13 0.463381 14.6667 -0.498867 16 0.270933L33.25 10.2302Z\" fill=\"currentColor\"/>\n                    <rect x=\"29\" width=\"6\" height=\"24\" rx=\"2\" fill=\"currentColor\"/>\n                    </svg>\n                </div>\n            </div>\n            <div class=\"player-panel__right\">\n                <div class=\"player-panel__playlist button selector\"></div>\n                <div class=\"player-panel__subs button selector hide\"></div>\n                <div class=\"player-panel__tracks button selector hide\">\n                    <svg width=\"24\" height=\"31\" viewBox=\"0 0 24 31\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect x=\"5\" width=\"14\" height=\"23\" rx=\"7\" fill=\"currentColor\"/>\n                    <path d=\"M3.39272 18.4429C3.08504 17.6737 2.21209 17.2996 1.44291 17.6073C0.673739 17.915 0.299615 18.7879 0.607285 19.5571L3.39272 18.4429ZM23.3927 19.5571C23.7004 18.7879 23.3263 17.915 22.5571 17.6073C21.7879 17.2996 20.915 17.6737 20.6073 18.4429L23.3927 19.5571ZM0.607285 19.5571C2.85606 25.179 7.44515 27.5 12 27.5V24.5C8.55485 24.5 5.14394 22.821 3.39272 18.4429L0.607285 19.5571ZM12 27.5C16.5549 27.5 21.1439 25.179 23.3927 19.5571L20.6073 18.4429C18.8561 22.821 15.4451 24.5 12 24.5V27.5Z\" fill=\"currentColor\"/>\n                    <rect x=\"10\" y=\"25\" width=\"4\" height=\"6\" rx=\"2\" fill=\"currentColor\"/>\n                    </svg>\n                </div>\n                <div class=\"player-panel__size button selector\"></div>\n            </div>\n        </div>\n    </div>\n</div>";

  var html$M = "<div class=\"player-video\">\n    <div class=\"player-video__display\"></div>\n    <div class=\"player-video__loader\"></div>\n    <div class=\"player-video__paused hide\">\n        <svg width=\"19\" height=\"25\" viewBox=\"0 0 19 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <rect width=\"6\" height=\"25\" rx=\"2\" fill=\"white\"/>\n            <rect x=\"13\" width=\"6\" height=\"25\" rx=\"2\" fill=\"white\"/>\n        </svg>\n    </div>\n    <div class=\"player-video__subtitles hide\">\n        <div class=\"player-video__subtitles-text\"></div>\n    </div>\n</div>";

  var html$L = "<div class=\"player-info\">\n    <div class=\"player-info__body\">\n        <div class=\"player-info__line\">\n            <div class=\"player-info__name\"></div>\n            <div class=\"player-info__time\"><span class=\"time--clock\"></span></div>\n        </div>\n\n        <div class=\"player-info__values\">\n            <div class=\"value--size\">\n                <span>加载中...</span>\n            </div>\n            <div class=\"value--stat\">\n                <span></span>\n            </div>\n            <div class=\"value--speed\">\n                <span></span>\n            </div>\n        </div>\n\n        <div class=\"player-info__error hide\"></div>\n    </div>\n</div>";

  var html$K = "<div class=\"selectbox\">\n    <div class=\"selectbox__layer\"></div>\n    <div class=\"selectbox__content layer--height\">\n        <div class=\"selectbox__head\">\n            <div class=\"selectbox__title\"></div>\n        </div>\n        <div class=\"selectbox__body\"></div>\n    </div>\n</div>";

  var html$J = "<div class=\"selectbox-item selector\">\n    <div class=\"selectbox-item__title\">{title}</div>\n    <div class=\"selectbox-item__subtitle\">{subtitle}</div>\n</div>";

  var html$I = "<div class=\"info layer--width\">\n    <div class=\"info__rate\"><span></span></div>\n    <div class=\"info__left\">\n        <div class=\"info__title\"></div>\n        <div class=\"info__title-original\"></div>\n    </div>\n    <div class=\"info__right\">\n        <div class=\"info__icon icon--book\"></div>\n        <div class=\"info__icon icon--like\"></div>\n        <div class=\"info__icon icon--wath\"></div>\n    </div>\n</div>";

  var html$H = "<div>\n    <div class=\"simple-button selector filter--search\">\n            <svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n            viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n        <g>\n            <path fill=\"currentColor\" d=\"M225.474,0C101.151,0,0,101.151,0,225.474c0,124.33,101.151,225.474,225.474,225.474\n                c124.33,0,225.474-101.144,225.474-225.474C450.948,101.151,349.804,0,225.474,0z M225.474,409.323\n                c-101.373,0-183.848-82.475-183.848-183.848S124.101,41.626,225.474,41.626s183.848,82.475,183.848,183.848\n                S326.847,409.323,225.474,409.323z\"/>\n        </g>\n        <g>\n            <path fill=\"currentColor\" d=\"M505.902,476.472L386.574,357.144c-8.131-8.131-21.299-8.131-29.43,0c-8.131,8.124-8.131,21.306,0,29.43l119.328,119.328\n                c4.065,4.065,9.387,6.098,14.715,6.098c5.321,0,10.649-2.033,14.715-6.098C514.033,497.778,514.033,484.596,505.902,476.472z\"/>\n        </g>\n\n        </svg>\n\n        <span>优化</span>\n    </div>\n    <div class=\"simple-button simple-button--filter selector filter--sort\">\n        <span>排序</span><div class=\"hide\"></div>\n    </div>\n\n    <div class=\"simple-button simple-button--filter selector filter--filter\">\n        <span>过滤器</span><div class=\"hide\"></div>\n    </div>\n</div>";

  var html$G = "<div class=\"card-more selector\">\n    <div class=\"card-more__title\">\n        更多    </div>\n</div>";

  var html$F = "<div class=\"search\">\n    <div class=\"search__left\">\n        <div class=\"search__title\">搜索</div>\n        <div class=\"search__input\">输入文本...</div>\n        <div class=\"search__keypad\"><div class=\"simple-keyboard\"></div></div>\n        <div class=\"search__history\"></div>\n    </div>\n    <div class=\"search__results\"></div>\n</div>";

  var html$E = "<div class=\"settings-input\">\n    <div class=\"settings-input__content\">\n        <div class=\"settings-input__input\"></div>\n\n        <div class=\"simple-keyboard\"></div>\n\n        <div class=\"settings-input__links\">收藏夹</div>\n    </div>\n</div>";

  var html$D = "<div class=\"modal\">\n    <div class=\"modal__content\">\n        <div class=\"modal__head\">\n            <div class=\"modal__title\">{title}</div>\n        </div>\n        <div class=\"modal__body\">\n            \n        </div>\n    </div>\n</div>";

  var html$C = "<div class=\"company\">\n    <div class=\"company__name\">{name}</div>\n    <div class=\"company__headquarters\">总部: {headquarters}</div>\n    <div class=\"company__homepage\">站点: {homepage}</div>\n    <div class=\"company__country\">国家: {origin_country}</div>\n</div>";

  var html$B = "<div class=\"modal-loading\">\n    \n</div>";

  var html$A = "<div class=\"modal-pending\">\n    <div class=\"modal-pending__loading\"></div>\n    <div class=\"modal-pending__text\">{text}</div>\n</div>";

  var html$z = "<div class=\"person-start\">\n\n    <div class=\"person-start__body\">\n        <div class=\"person-start__right\">\n            <div class=\"person-start__poster\">\n                <img src=\"{img}\" class=\"person-start__img\" />\n            </div>\n        </div>\n\n        <div class=\"person-start__left\">\n            <div class=\"person-start__tags\">\n                <div class=\"person-start__tag\">\n                    <img src=\"./img/icons/pulse.svg\" /> <div>{birthday}</div>\n                </div>\n            </div>\n            \n            <div class=\"person-start__name\">{name}</div>\n            <div class=\"person-start__place\">{place}</div>\n\n            <div class=\"person-start__descr\">{descr}</div>\n\n\n            \n        </div>\n    </div>\n\n    <div class=\"full-start__buttons hide\">\n        <div class=\"full-start__button selector\">\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n                <g>\n                    <g>\n                        <path fill=\"currentColor\" d=\"M436.742,180.742c-41.497,0-75.258,33.761-75.258,75.258s33.755,75.258,75.258,75.258\n                            C478.239,331.258,512,297.503,512,256C512,214.503,478.239,180.742,436.742,180.742z M436.742,294.246\n                            c-21.091,0-38.246-17.155-38.246-38.246s17.155-38.246,38.246-38.246s38.246,17.155,38.246,38.246\n                            S457.833,294.246,436.742,294.246z\"/>\n                    </g>\n                </g>\n                <g>\n                    <g>\n                        <path fill=\"currentColor\" d=\"M256,180.742c-41.497,0-75.258,33.761-75.258,75.258s33.761,75.258,75.258,75.258c41.503,0,75.258-33.755,75.258-75.258\n                            C331.258,214.503,297.503,180.742,256,180.742z M256,294.246c-21.091,0-38.246-17.155-38.246-38.246s17.155-38.246,38.246-38.246\n                            s38.246,17.155,38.246,38.246S277.091,294.246,256,294.246z\"/>\n                    </g>\n                </g>\n                <g>\n                    <g>\n                        <path fill=\"currentColor\" d=\"M75.258,180.742C33.761,180.742,0,214.503,0,256c0,41.503,33.761,75.258,75.258,75.258\n                            c41.497,0,75.258-33.755,75.258-75.258C150.516,214.503,116.755,180.742,75.258,180.742z M75.258,294.246\n                            c-21.091,0-38.246-17.155-38.246-38.246s17.155-38.246,38.246-38.246c21.091,0,38.246,17.155,38.246,38.246\n                            S96.342,294.246,75.258,294.246z\"/>\n                    </g>\n                </g>\n            </svg>\n        </div>\n\n        <div class=\"full-start__icons\">\n            <div class=\"info__icon icon--like\"></div>\n        </div>\n    </div>\n</div>";

  var html$y = "<div class=\"empty\">\n    <div class=\"empty__img selector\"></div>\n    <div class=\"empty__title\">{title}</div>\n    <div class=\"empty__descr\">{descr}</div>\n</div>";

  var html$x = "<div class=\"notice selector\">\n    <div class=\"notice__head\">\n        <div class=\"notice__title\">{title}</div>\n        <div class=\"notice__time\">{time}</div>\n    </div>\n    \n    <div class=\"notice__descr\">{descr}</div>\n</div>";

  var html$w = "<div class=\"notice notice--card selector\">\n    <div class=\"notice__left\">\n        <div class=\"notice__img\">\n            <img src=\"{img}\" />\n        </div>\n    </div>\n    <div class=\"notice__body\">\n        <div class=\"notice__head\">\n            <div class=\"notice__title\">{title}</div>\n            <div class=\"notice__time\">{time}</div>\n        </div>\n        \n        <div class=\"notice__descr\">{descr}</div>\n    </div>\n</div>";

  var html$v = "<div class=\"torrent-item selector\">\n    <div class=\"torrent-item__title\">{title}</div>\n    <div class=\"torrent-item__details\">\n        <div class=\"torrent-item__date\">{date}</div>\n        <div class=\"torrent-item__tracker\">{tracker}</div>\n\n        <div class=\"torrent-item__bitrate bitrate\">比率: <span>{bitrate} Mbps</span></div>\n        <div class=\"torrent-item__seeds\">分享: <span>{seeds}</span></div>\n        <div class=\"torrent-item__grabs\">用户: <span>{grabs}</span></div>\n        \n        <div class=\"torrent-item__size\">{size}</div>\n    </div>\n</div>";

  var html$u = "<div class=\"torrent-file selector\">\n    <div class=\"torrent-file__title\">{title}</div>\n    <div class=\"torrent-file__size\">{size}</div>\n</div>";

  var html$t = "<div class=\"files\">\n    <div class=\"files__left\">\n        <div class=\"full-start__poster selector\">\n            <img src=\"{img}\" class=\"full-start__img\" />\n        </div>\n\n        <div class=\"files__title\">{title}</div>\n        <div class=\"files__title-original\">{original_title}</div>\n    </div>\n    <div class=\"files__body\">\n        \n    </div>\n</div>";

  var html$s = "<div class=\"about\">\n    <div>该应用程序完全免费，并使用公共链接查看有关电影、新版本、热门电影等的信息。所有可用信息仅用于教育目的，应用程序不使用自己的服务器分发信息。</div>\n\n\n    <div class=\"about__contacts\">\n        <div>\n            <small>我们的频道</small><br>\n            @lampa_channel\n        </div>\n\n        <div>\n            <small>组</small><br>\n            @lampa_group\n        </div>\n\n        <div>\n            <small>版本</small><br>\n            1.3.7\n        </div>\n    </div>\n\n    <div class=\"about__contacts\">\n        <div>\n            <small>捐赠</small><br>\n            www.boosty.to/lampatv\n        </div>\n    </div>\n</div>";

  var html$r = "<div class=\"error\">\n    <div class=\"error__ico\"></div>\n    <div class=\"error__body\">\n        <div class=\"error__title\">{title}</div>\n        <div class=\"error__text\">{text}</div>\n    </div>\n</div>";

  var html$q = "<div class=\"error\">\n    <div class=\"error__ico\"></div>\n    <div class=\"error__body\">\n        <div class=\"error__title\">{title}</div>\n        <div class=\"error__text\">{text}</div>\n    </div>\n</div>\n\n<div class=\"torrent-error noconnect\">\n    <div>\n        <div>原因</div>\n        <ul>\n            <li>使用地址: <code>{ip}</code></li>\n            <li class=\"nocorect\">当前地址 <code>{ip}</code> 不正确！</li>\n            <li>当前答案: <code>{echo}</code></li>\n        </ul>\n    </div>\n\n    <div>\n        <div>正确？</div>\n        <ul>\n            <li>使用地址: <code>192.168.0.xxx:8090</code></li>\n            <li>使用矩阵版本</li>\n        </ul>\n    </div>\n\n    <div>\n        <div>如何检查？</div>\n        <ul>\n            <li>相同设备，打开浏览器并转到地址 <code>{ip}/echo</code></li>\n            <li>如果浏览器没有响应，请检查 TorrServe 是否正在运行，或者重新启动它。</li>\n            <li>如果浏览器响应，请确保响应包含字符串 <code>MatriX</code></li>\n        </ul>\n    </div>\n</div>";

  var html$p = "<div class=\"error\">\n    <div class=\"error__ico\"></div>\n    <div class=\"error__body\">\n        <div class=\"error__title\">{title}</div>\n        <div class=\"error__text\">{text}</div>\n    </div>\n</div>\n\n<div class=\"torrent-error noconnect\">\n    <div>\n        <div>原因</div>\n        <ul>\n            <li>Ping 返回无效格式</li>\n            <li>TorServer 响应: <code>{echo}</code></li>\n        </ul>\n    </div>\n\n    <div>\n        <div>怎么办？</div>\n        <ul>\n            <li>确保你有 Matrix 版本</li>\n        </ul>\n    </div>\n\n    <div>\n        <div>如何检查?</div>\n        <ul>\n            <li>打开浏览器并转到地址 <code>{ip}/echo</code></li>\n            <li>确保答案包含代码 <code>MatriX</code></li>\n        </ul>\n    </div>\n</div>";

  var html$o = "<div class=\"error\">\n    <div class=\"error__ico\"></div>\n    <div class=\"error__body\">\n        <div class=\"error__title\">{title}</div>\n        <div class=\"error__text\">{text}</div>\n    </div>\n</div>\n\n<div class=\"torrent-error noconnect\">\n    <div>\n        <div>原因</div>\n        <ul>\n            <li>TorServer 无法下载 torrent 文件</li>\n            <li>来自 TorServer 的响应: {echo}</li>\n            <li>链接: <code>{url}</code></li>\n        </ul>\n    </div>\n\n    <div class=\"is--jackett\">\n        <div>怎么办？</div>\n        <ul>\n            <li>检查您是否正确配置了 Jackett</li>\n            <li>私人来源可能无法提供文件的链接</li>\n            <li>确保 Jackett 也可以下载文件</li>\n        </ul>\n    </div>\n\n    <div class=\"is--torlook\">\n        <div>怎么办？</div>\n        <ul>\n            <li>写信给我们的电报组: @lampa_group</li>\n            <li>指定什么电影，什么发行版，如果可能，请附上该发行版的照片</li>\n        </ul>\n    </div>\n</div>";

  var html$n = "<div class=\"torrent-serial selector\">\n    <img src=\"{img}\" class=\"torrent-serial__img\" />\n    <div class=\"torrent-serial__content\">\n        <div class=\"torrent-serial__body\">\n            <div class=\"torrent-serial__title\">{fname}</div>\n            <div class=\"torrent-serial__line\">电视剧 - <b>{episode}</b> &nbsp;\u2022&nbsp; 季 - <b>{season}</b> &nbsp;\u2022&nbsp; 退出 - {air_date}</div>\n        </div>\n        <div class=\"torrent-serial__detail\">\n            <div class=\"torrent-serial__size\">{size}</div>\n            <div class=\"torrent-serial__exe\">.{exe}</div>\n        </div>\n    </div>\n    <div class=\"torrent-serial__episode\">{episode}</div>\n</div>";

  var html$m = "<div class=\"search-box search\">\n    <div class=\"search-box__input search__input\"></div>\n    <div class=\"search-box__keypad search__keypad\"><div class=\"simple-keyboard\"></div></div>\n</div>";

  var html$l = "<div class=\"console\">\n    \n</div>";

  var html$k = "\n<svg width=\"15\" height=\"14\" viewBox=\"0 0 15 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.54893 0.927035C6.84828 0.00572455 8.15169 0.00572705 8.45104 0.927038L9.40835 3.87334C9.54223 4.28537 9.92618 4.56433 10.3594 4.56433H13.4573C14.4261 4.56433 14.8288 5.80394 14.0451 6.37334L11.5388 8.19426C11.1884 8.4489 11.0417 8.90027 11.1756 9.31229L12.1329 12.2586C12.4322 13.1799 11.3778 13.946 10.594 13.3766L8.08777 11.5557C7.73728 11.3011 7.26268 11.3011 6.9122 11.5557L4.40592 13.3766C3.6222 13.946 2.56773 13.1799 2.86708 12.2586L3.82439 9.31229C3.95827 8.90027 3.81161 8.4489 3.46112 8.19426L0.954841 6.37334C0.171128 5.80394 0.573906 4.56433 1.54263 4.56433H4.64056C5.07378 4.56433 5.45774 4.28536 5.59161 3.87334L6.54893 0.927035Z\" fill=\"currentColor\"/>\n</svg>\n";

  var html$j = "<div class=\"time-line\" data-hash=\"{hash}\">\n    <div style=\"width: {percent}%\"></div>\n</div>";

  var html$i = "<div class=\"empty empty--list\">\n    <div class=\"empty__title\">空</div>\n    <div class=\"empty__descr\">未找到您的过滤器，请优化您的过滤器。</div>\n</div>";

  var html$h = "<div class=\"screensaver\">\n    <div class=\"screensaver__slides\">\n        <img class=\"screensaver__slides-one\" />\n        <img class=\"screensaver__slides-two\" />\n    </div>\n    <div class=\"screensaver__gradient\"></div>\n    <div class=\"screensaver__title\">\n        <div class=\"screensaver__title-name\"></div>\n        <div class=\"screensaver__title-tagline\"></div>\n    </div>\n    <div class=\"screensaver__datetime\">\n        <div class=\"screensaver__datetime-time\"><span class=\"time--clock\"></span></div>\n        <div class=\"screensaver__datetime-date\"><span class=\"time--full\"></span></div>\n    </div>\n</div>";

  var templates = {
    head: html$19,
    wrap: html$18,
    menu: html$17,
    activitys: html$16,
    activity: html$15,
    settings: html$13,
    settings_main: html$12,
    settings_interface: html$11,
    settings_parser: html$10,
    settings_server: html$$,
    settings_player: html$_,
    settings_more: html$Z,
    settings_plugins: html$Y,
    settings_cloud: html$X,
    settings_account: html$W,
    scroll: html$14,
    items_line: html$V,
    card: html$U,
    card_parser: html$T,
    full_start: html$S,
    full_descr: html$R,
    full_person: html$Q,
    full_review: html$P,
    player: html$O,
    player_panel: html$N,
    player_video: html$M,
    player_info: html$L,
    selectbox: html$K,
    selectbox_item: html$J,
    info: html$I,
    more: html$G,
    search: html$F,
    settings_input: html$E,
    modal: html$D,
    company: html$C,
    modal_loading: html$B,
    modal_pending: html$A,
    person_start: html$z,
    empty: html$y,
    notice: html$x,
    notice_card: html$w,
    torrent: html$v,
    torrent_file: html$u,
    files: html$t,
    about: html$s,
    error: html$r,
    torrent_noconnect: html$q,
    torrent_file_serial: html$n,
    torrent_nocheck: html$p,
    torrent_nohash: html$o,
    filter: html$H,
    search_box: html$m,
    console: html$l,
    icon_star: html$k,
    timeline: html$j,
    list_empty: html$i,
    screensaver: html$h
  };

  function get$9(name) {
    var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var like_static = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var tpl = templates[name];
    if (!tpl) throw '模板: ' + name + ' 未找到!';

    for (var n in vars) {
      tpl = tpl.replace(new RegExp('{' + n + '}', 'g'), vars[n]);
    }

    tpl = tpl.replace(/{\@([a-z_-]+)}/g, function (e, s) {
      return templates[s] || '';
    });
    return like_static ? tpl : $(tpl);
  }

  function add$8(name, html) {
    templates[name] = html;
  }

  function all() {
    return templates;
  }

  var Template = {
    get: get$9,
    add: add$8,
    all: all
  };

  var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function encode(input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = Base64._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }

      return output;
    },
    // public method for decoding
    decode: function decode(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }

        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }

      output = Base64._utf8_decode(output);
      return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode: function _utf8_encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode(c >> 6 | 192);
          utftext += String.fromCharCode(c & 63 | 128);
        } else {
          utftext += String.fromCharCode(c >> 12 | 224);
          utftext += String.fromCharCode(c >> 6 & 63 | 128);
          utftext += String.fromCharCode(c & 63 | 128);
        }
      }

      return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function _utf8_decode(utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode((c & 31) << 6 | c2 & 63);
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          i += 3;
        }
      }

      return string;
    }
  };

  var html$g = $('<div class="noty"><div class="noty__body"><div class="noty__text"></div></div></div>'),
      body$4 = html$g.find('.noty__text'),
      time$2;

  function show$4(text) {
    clearTimeout(time$2);
    time$2 = setTimeout(function () {
      html$g.removeClass('noty--visible');
    }, 3000);
    body$4.html(text);
    html$g.addClass('noty--visible');
  }

  function render$d() {
    return html$g;
  }

  var Noty = {
    show: show$4,
    render: render$d
  };

  var reqCallback = {};

  function exit$1() {
    if (checkVersion(1)) navigator.app.exitApp();else $('<a href="lampa://exit"></a>')[0].click();
  }

  function playHash(SERVER) {
    var magnet = "magnet:?xt=urn:btih:" + SERVER.hash;

    if (checkVersion(10)) {
      var intentExtra = "";

      if (SERVER.movie) {
        intentExtra = {
          title: "[LAMPA] " + SERVER.movie.title,
          poster: SERVER.movie.img,
          data: {
            lampa: true,
            movie: SERVER.movie
          }
        };
      }

      window.plugins.intentShim.startActivity(
      {
          action: window.plugins.intentShim.ACTION_VIEW,
          url: magnet,
          extras: intentExtra
      },
      function() {},
      function() {console.log('Failed to open magnet URL via Android Intent')}
      );
      //AndroidJS.openTorrentLink(magnet, JSON.stringify(intentExtra));
    } else {
      $('<a href="' + magnet + '"/>')[0].click();
    }
  }

  function openTorrent(SERVER) {
    if (checkVersion(10)) {
      var intentExtra = {
        title: "[LAMPA]" + SERVER.object.Title,
        poster: SERVER.object.poster,
        data: {
          lampa: true,
          movie: SERVER.movie
        }
      };
      window.plugins.intentShim.startActivity(
        {
            action: window.plugins.intentShim.ACTION_VIEW,
            url: SERVER.object.MagnetUri || SERVER.object.Link,
            extras: intentExtra
        },
        function() {},
        function() {console.log('Failed to open magnet URL via Android Intent')}
        );
        //AndroidJS.openTorrentLink(SERVER.object.MagnetUri || SERVER.object.Link, JSON.stringify(intentExtra));
    } else {
      $('<a href="' + (SERVER.object.MagnetUri || SERVER.object.Link) + '"/>')[0].click();
    }
  }

  function openPlayer(link, data) {
    if (checkVersion(10)) {
        window.plugins.intentShim.startActivity({
          action : window.plugins.intentShim.ACTION_VIEW,
          url : link,
          headers : {
          'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 
          'referrer' : 'https://www.aliyundrive.com/'
        },
          type : "video/*"
        }, function() {
        }, function() {
          console.log("Failed to open magnet URL via Android Intent");
        });
      } else {
        $('<a href="' + link + '"><a/>')[0].click();
      };
  }

  function openYoutube(link) {
    if (checkVersion(15)) window.plugins.intentShim.startActivity({
          action : window.plugins.intentShim.ACTION_VIEW,
          url : "https://www.youtube.com/watch?v=" +link
        }, function() {
        }, function() {
          console.log("Failed to open Youtube URL via Android Intent");
        });else $('<a href="' + link + '"><a/>')[0].click();
  }

  function resetDefaultPlayer() {
    //if (checkVersion(15)) AndroidJS.clearDefaultPlayer();
  }

  function httpReq(data, call) {
    var index = Math.floor(Math.random() * 5000);
    reqCallback[index] = call;
    if (checkVersion(16)) AndroidJS.httpReq(JSON.stringify(data), index);
  }

  function httpCall(index, callback) {
    var req = reqCallback[index];

    if (req[callback]) {
      var resp = AndroidJS.getResp(index);

      try {
        var json = JSON.parse(resp);
        req[callback](json);
      } catch (_unused) {
        req[callback](resp);
      } finally {
        delete reqCallback[index];
      }
    }
  }

  function voiceStart() {
    if (checkVersion(25)) AndroidJS.voiceStart();else Lampa.Noty.show("只适用于 Android TV");
  }

  function checkVersion(needVersion) {
    if (Storage.field('platform') == 'android') {
      var versionCode = 16;

      if (parseInt(versionCode, 10) >= needVersion) {
        return true;
      } else {
        Lampa.Noty.show("请更新应用程序。<br>需要Android版本: " + needVersion + "<br>当前版本: " + versionCode);
        return false;
      }
    } else return false;
  }

  var Android = {
    exit: exit$1,
    openTorrent: openTorrent,
    openPlayer: openPlayer,
    playHash: playHash,
    openYoutube: openYoutube,
    resetDefaultPlayer: resetDefaultPlayer,
    httpReq: httpReq,
    httpCall: httpCall,
    voiceStart: voiceStart
  };

  function create$r() {
    var listener = start$4();
    var _calls = [];

    var _last;

    var last_reguest;
    var need = {
      timeout: 1000 * 60
    };

    this.timeout = function (time) {
      need.timeout = time;
    };
    /**
     * Видимый запрос
     * @param {String} url адрес
     * @param {Function} complite успешно
     * @param {Function} error ошибка
     * @param {Object} post_data данные для пост запроса
     */


    this.get = function (url, _complite, _error, post_data) {
      clear();
      go({
        url: url,
        post_data: post_data,
        start: function start() {
          listener.send('start');
        },
        before_complite: function before_complite() {
          listener.send('before_complite');
        },
        complite: function complite(data) {
          if (_complite) _complite(data);
        },
        after_complite: function after_complite() {
          listener.send('after_complite');
        },
        before_error: function before_error() {
          listener.send('before_error');
        },
        error: function error(data) {
          if (_error) _error(data);
        },
        after_error: function after_error() {
          listener.send('after_error');
        },
        end: function end() {
          listener.send('end');
        }
      });
    };
    /**
     * Тихий запрос, отработает в любом случае
     * @param {String} url адрес
     * @param {Function} complite успешно
     * @param {Function} error ошибка
     * @param {Object} post_data данные для пост запроса
     * @param {Object} params дополнительные параметры
     */


    this.quiet = function (url, _complite2, _error2, post_data, params) {
      var add_params = {};

      if (params) {
        add_params = params;
      }

      var data = {
        url: url,
        post_data: post_data,
        complite: function complite(data) {
          if (_complite2) _complite2(data);
        },
        error: function error(data) {
          if (_error2) _error2(data);
        }
      };
      Arrays.extend(data, add_params, true);
      go(data);
    };
    /**
     * Бесшумный запрос, сработает прерывание при новом запросе
     * @param {String} url адрес
     * @param {Function} complite успешно
     * @param {Function} error ошибка
     * @param {Object} post_data данные для пост запроса
     * @param {Object} params дополнительные параметры
     */


    this.silent = function (url, complite, error, post_data, params) {
      var add_params = {};

      if (params) {
        add_params = params;
      }

      var reguest = {
        url: url,
        complite: complite,
        error: error
      };

      _calls.push(reguest);

      var data = {
        url: url,
        post_data: post_data,
        complite: function complite(data) {
          if (_calls.indexOf(reguest) !== -1 && reguest.complite) reguest.complite(data);
        },
        error: function error(data) {
          if (_calls.indexOf(reguest) !== -1 && reguest.error) reguest.error(data);
        },
        end: function end() {
          listener.send('end');
        }
      };
      Arrays.extend(data, add_params, true);
      go(data);
    };
    /**
     * Отработать только последний запрос в стеке
     * @param {String} url адрес
     * @param {Function} complite успешно
     * @param {Function} error ошибка
     * @param {Object} post_data данные для пост запроса
     */


    this.last = function (url, complite, error, post_data) {
      var reguest = {
        url: url,
        complite: complite,
        error: error
      };
      _last = reguest;
      go({
        url: url,
        post_data: post_data,
        complite: function complite(data) {
          if (_last && _last.complite) _last.complite(data);
        },
        error: function error(data) {
          if (_last && _last.error) _last.error(data);
        },
        end: function end() {
          dispatchEvent({
            type: 'load:end'
          });
        }
      });
    };

    this["native"] = function (url, complite, error, post_data, params) {
      var add_params = {};

      if (params) {
        add_params = params;
      }

      var reguest = {
        url: url,
        complite: complite,
        error: error
      };

      _calls.push(reguest);

      var data = {
        url: url,
        post_data: post_data,
        complite: function complite(data) {
          if (_calls.indexOf(reguest) !== -1 && reguest.complite) reguest.complite(data);
        },
        error: function error(data) {
          if (_calls.indexOf(reguest) !== -1 && reguest.error) reguest.error(data);
        },
        end: function end() {
          listener.send('end');
        }
      };
      Arrays.extend(data, add_params, true);

      _native(data);
    };
    /**
     * Очистить все запросы
     */


    this.clear = function () {
      _calls = [];
    };
    /**
     * Повторить запрос
     * @param {Object} custom 
     */


    this.again = function (custom) {
      if (custom || last_reguest) {
        go(custom || last_reguest);
      }
    };
    /**
     * Вернуть обьект последненго запроса
     * @returns Object
     */


    this.latest = function () {
      return last_reguest;
    };
    /**
     * Декодировать ошибку в запросе
     * @param {Object} jqXHR 
     * @param {String} exception 
     * @returns String
     */


    this.errorDecode = function (jqXHR, exception) {
      return errorDecode(jqXHR, exception);
    };

    function errorDecode(jqXHR, exception) {
      var msg = '';

      if (jqXHR.status === 0 && exception !== 'timeout') {
        msg = '没有网络连接。';
      } else if (jqXHR.status == 404) {
        msg = '未找到请求的页面。 [404]';
      } else if (jqXHR.status == 401) {
        msg = '登录失败';
      } else if (jqXHR.status == 500) {
        msg = '内部服务器错误。 [500]';
      } else if (exception === 'parsererror') {
        msg = '请求的 JSON 解析失败。';
      } else if (exception === 'timeout') {
        msg = '请求超时。';
      } else if (exception === 'abort') {
        msg = '请求中止。';
      } else if (exception === 'custom') {
        msg = jqXHR.responseText;
      } else {
        msg = '未知错误' + jqXHR.responseText;
      }

      return msg;
    }
    /**
     * Сделать запрос
     * @param {Object} params 
     */


    function go(params) {
      listener.send('go');
      last_reguest = params;
      if (params.start) params.start();

      var secuses = function secuses(data) {
        if (params.before_complite) params.before_complite(data);

        if (params.complite) {
          try {
            params.complite(data);
          } catch (e) {
            console.error('Reguest', 'complite error:', e.message + "\n\n" + e.stack);
            Noty.show('Error: ' + (e.error || e).message + '<br><br>' + (e.error && e.error.stack ? e.error.stack : e.stack || '').split("\n").join('<br>'));
          }
        }

        if (params.after_complite) params.after_complite(data);
        if (params.end) params.end();
      };

      var data = {
        dataType: params.dataType || 'json',
        url: params.url,
        timeout: need.timeout,
        crossDomain: true,
        success: function success(data) {
          //console.log('Reguest','result of '+params.url+' :',data)
          secuses(data);
        },
        error: function error(jqXHR, exception) {
          console.log('Reguest', 'error of ' + params.url + ' :', errorDecode(jqXHR, exception));
          if (params.before_error) params.before_error(jqXHR, exception);
          if (params.error) params.error(jqXHR, exception);
          if (params.after_error) params.after_error(jqXHR, exception);
          if (params.end) params.end();
        },
        beforeSend: function beforeSend(xhr) {
          var use = Storage.field('torrserver_auth');
          var srv = Storage.get(Storage.field('torrserver_use_link') == 'two' ? 'torrserver_url_two' : 'torrserver_url');
          if (use && params.url.indexOf(srv) > -1) xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(Storage.get('torrserver_login') + ':' + Storage.get('torrserver_password')));

          if (params.beforeSend) {
            xhr.setRequestHeader(params.beforeSend.name, params.beforeSend.value);
          }
        }
      };

      if (params.post_data) {
        data.type = 'POST';
        data.data = params.post_data;
      }

      if (params.type) data.type = params.type;

      if (params.headers) {
        data.headers = params.headers;
      }

      $.ajax(data);
      need.timeout = 1000 * 60;
    }

    function _native(params) {
      listener.send('go');
      last_reguest = params;
      if (params.start) params.start();
      var platform = Storage.get('platform', '');
      if (platform == 'webos') go(params);else if (platform == 'tizen') go(params);else go(params);
      need.timeout = 1000 * 60;
    }
  }

  function create$q() {
    var _this = this;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var html = Template.get('scroll');
    var body = html.find('.scroll__body');
    var content = html.find('.scroll__content');
    html.toggleClass('scroll--horizontal', params.horizontal ? true : false);
    html.toggleClass('scroll--mask', params.mask ? true : false);
    html.toggleClass('scroll--over', params.over ? true : false);
    html.toggleClass('scroll--nopadding', params.nopadding ? true : false);
    body.data('scroll', 0);
    var scroll_time = 0,
        scroll_step = params.step || 150;
    html.on('mousewheel', function (e) {
      var parent = $(e.target).parents('.scroll');

      if (Storage.get('navigation_type') == 'mouse' && Date.now() - scroll_time > 100 && html.is(parent[0])) {
        scroll_time = Date.now();

        if (e.originalEvent.wheelDelta / 120 > 0) {
          _this.wheel(-scroll_step);
        } else {
          _this.wheel(scroll_step);
        }
      }
    });

    this.wheel = function (size) {
      html.toggleClass('scroll--wheel', true);
      var direct = params.horizontal ? 'left' : 'top';
      var scrl = body.data('scroll'),
          scrl_offset = html.offset()[direct],
          scrl_padding = parseInt(content.css('padding-' + direct));

      if (params.scroll_by_item) {
        var pos = body.data('scroll-position');
        pos = pos || 0;
        var items = $('>*', body);
        pos += size > 0 ? 1 : -1;
        pos = Math.max(0, Math.min(items.length - 1, pos));
        body.data('scroll-position', pos);
        var item = items.eq(pos),
            ofst = item.offset()[direct];
        size = ofst - scrl_offset - scrl_padding;
      }

      var max = params.horizontal ? 10000 : body.height();
      max -= params.horizontal ? html.width() : html.height();
      max += scrl_padding * 2;
      scrl -= size;
      scrl = Math.min(0, Math.max(-max, scrl));
      this.reset();

      if (Storage.field('scroll_type') == 'css') {
        body.css('transform', 'translate3d(' + (params.horizontal ? scrl : 0) + 'px, ' + (params.horizontal ? 0 : scrl) + 'px, 0px)');
      } else {
        body.css('margin-left', (params.horizontal ? scrl : 0) + 'px');
        body.css('margin-top', (params.horizontal ? 0 : scrl) + 'px');
      }

      body.data('scroll', scrl);
    };

    this.update = function (elem, tocenter) {
      if (elem.data('ismouse')) return;
      html.toggleClass('scroll--wheel', false);
      var dir = params.horizontal ? 'left' : 'top',
          siz = params.horizontal ? 'width' : 'height';
      var ofs_elm = elem.offset()[dir],
          ofs_box = body.offset()[dir],
          center = ofs_box + (tocenter ? content[siz]() / 2 - elem[siz]() / 2 : 0),
          scrl = Math.min(0, center - ofs_elm);
      this.reset();

      if (Storage.field('scroll_type') == 'css') {
        body.css('transform', 'translate3d(' + (params.horizontal ? scrl : 0) + 'px, ' + (params.horizontal ? 0 : scrl) + 'px, 0px)');
      } else {
        body.css('margin-left', (params.horizontal ? scrl : 0) + 'px');
        body.css('margin-top', (params.horizontal ? 0 : scrl) + 'px');
      }

      body.data('scroll', scrl);
    };

    this.append = function (object) {
      body.append(object);
    };

    this.minus = function (minus) {
      html.addClass('layer--wheight');
      if (minus) html.data('mheight', minus);
    };

    this.body = function () {
      return body;
    };

    this.render = function (object) {
      if (object) body.append(object);
      return html;
    };

    this.clear = function () {
      body.empty();
    };

    this.reset = function () {
      body.css('transform', 'translate3d(0px, 0px, 0px)');
      body.css('margin', '0px');
    };

    this.destroy = function () {
      html.remove();
      body = null;
      content = null;
      html = null;
    };
  }

  function secondsToTime(sec, _short) {
    var sec_num = parseInt(sec, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (_short) return hours + ':' + minutes;
    return hours + ':' + minutes + ':' + seconds;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function substr(txt, len) {
    txt = txt || '';
    return txt.length > len ? txt.substr(0, len) + '...' : txt;
  }

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function bytesToSize(bytes, speed) {
    if (bytes == 0) {
      return '0 字节';
    }

    var unitMultiple = 1024;
    var unitNames = ['字节', 'KB', 'MB', 'GB', 'TB', 'PB'];

    if (speed) {
      unitNames = ['b', 'KB', 'MB', 'GB', 'TB', '铅'];
    }

    var unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
    return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(2)) + ' ' + unitNames[unitChanges];
  }

  function sizeToBytes(str) {
    var gsize = str.match(/([0-9\\.,]+)\s+(Mb|МБ|GB|ГБ|TB|ТБ)/i);

    if (gsize) {
      var size = parseFloat(gsize[1].replace(',', '.'));
      if (/gb|гб/.test(gsize[2].toLowerCase())) size *= 1024;
      if (/tb|тб/.test(gsize[2].toLowerCase())) size *= 1048576;
      return size * 1048576;
    }

    return 0;
  }

  function calcBitrate(byteSize, minutes) {
    if (!minutes) return 0;
    var sec = minutes * 60;
    var bitSize = byteSize * 8;
    return (bitSize / Math.pow(1024, 2) / sec).toFixed(2);
  }

  function time$1(html) {
    var create = function create() {
      var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      var days = ["星期天", "星期一", "星期一", "星期三", "星期四", "星期五", "星期六"];

      this.moth = function (m) {
        var n = months[m];
        var d = n.slice(-1);
        if (d == 'b') return n.slice(0, n.length - 1) + '我';else if (n == '五月') return n + '我';else return n + '';
      };

      this.tik = function () {
        var date = new Date(),
            time = date.getTime(),
            ofst = parseInt((localStorage.getItem('time_offset') == null ? 'n0' : localStorage.getItem('time_offset')).replace('n', ''));
        date = new Date(time + ofst * 1000 * 60 * 60);
        time = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getFullYear()];

        if (time[0] < 10) {
          time[0] = "0" + time[0];
        }

        if (time[1] < 10) {
          time[1] = "0" + time[1];
        }

        if (time[2] < 10) {
          time[2] = "0" + time[2];
        }

        var current_time = [time[0], time[1]].join(':'),
            current_week = date.getDay(),
            current_day = date.getDate();
        $('.time--clock', html).text(current_time);
        $('.time--week', html).text(days[current_week]);
        $('.time--day', html).text(current_day);
        $('.time--moth', html).text(months[date.getMonth()]);
        $('.time--full', html).text(current_day + ' ' + this.moth(date.getMonth()) + ' ' + time[3]);
      };

      setInterval(this.tik.bind(this), 1000);
      this.tik();
    };

    return new create();
  }

  function parseTime(str) {
    var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var days = ["星期天", "星期一", "星期一", "星期三", "星期四", "星期五", "星期六"];

    var mouth = function mouth(m) {
      var n = months[m];
      var d = n.slice(-1);
      if (d == 'ь') return n.slice(0, n.length - 1) + '我';else if (n == 'ma') return n + '我';else return n + '';
    };

    var date = new Date(str),
        time = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getFullYear()];

    if (time[0] < 10) {
      time[0] = "0" + time[0];
    }

    if (time[1] < 10) {
      time[1] = "0" + time[1];
    }

    if (time[2] < 10) {
      time[2] = "0" + time[2];
    }

    var current_time = [time[0], time[1]].join(':'),
        current_week = date.getDay(),
        current_day = date.getDate();
    return {
      time: current_time,
      week: days[current_week],
      day: current_day,
      mouth: months[date.getMonth()],
      full: current_day + ' ' + mouth(date.getMonth()) + ' ' + time[3]
    };
  }

  function strToTime(str) {
    var date = new Date(str);
    return date.getTime();
  }

  function checkHttp(url) {
    url = url.replace(/https:\/\//, '');
    url = url.replace(/http:\/\//, '');
    url = protocol() + url;
    return url;
  }

  function shortText(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;
    separator = separator || '...';
    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
  }

  function protocol() {
    return window.location.protocol == 'https:' ? 'https://' : 'http://';
  }

  function addUrlComponent(url, params) {
    return url + (/\?/.test(url) ? '&' : '?') + params;
  }

  function putScript(items, complite, error) {
    var p = 0;

    function next() {
      if (p >= items.length) return complite();
      var u = items[p];

      if (!u) {
        p++;
        return next();
      }

      console.log('Script', 'create:', u);
      var s = document.createElement('script');

      s.onload = function () {
        console.log('Script', 'include:', u);
        next();
      };

      s.onerror = function () {
        console.log('Script', 'error:', u);
        if (error) error(u);
        next();
      };

      s.setAttribute('src', u);
      document.body.appendChild(s);
      p++;
    }

    next();
  }

  function putStyle(items, complite, error) {
    var p = 0;

    function next() {
      if (p >= items.length) return complite();
      var u = items[p];
      $.get(u, function (css) {
        css = css.replace(/\.\.\//g, './');
        var style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
          // This is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        document.body.appendChild(style);
        next();
      }, function () {
        if (error) error(u);
        next();
      }, 'TEXT');
      p++;
    }

    next(items[0]);
  }

  function clearTitle(title) {
    return title.replace(/[^a-zа-я0-9\s]/gi, '');
  }

  function cardImgBackground(card_data) {
    if (Storage.field('background')) {
      return Storage.get('background_type', 'complex') == 'poster' && card_data.backdrop_path ? Api.img(card_data.backdrop_path, 'original') : card_data.poster_path ? Api.img(card_data.poster_path) : card_data.poster || card_data.img || '';
    }

    return '';
  }

  function stringToHslColor(str, s, l) {
    var hash = 0;

    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  function pathToNormalTitle(path) {
    var add_exe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var name = path.split('.');
    var exe = name.pop();
    name = name.join('.');
    return (name + '').replace(/_|\./g, ' ') + (add_exe ? ' <span class="exe">.' + exe + '</span>' : '');
  }

  function hash$2(input) {
    var str = (input || '') + '';
    var hash = 0;
    if (str.length == 0) return hash;

    for (var i = 0; i < str.length; i++) {
      var _char = str.charCodeAt(i);

      hash = (hash << 5) - hash + _char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash) + '';
  }

  function uid$1(len) {
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ID_LENGTH = len || 8;
    var id = '';

    for (var i = 0; i < ID_LENGTH; i++) {
      id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }

    return id;
  }

  var Utils = {
    secondsToTime: secondsToTime,
    capitalizeFirstLetter: capitalizeFirstLetter,
    substr: substr,
    numberWithSpaces: numberWithSpaces,
    time: time$1,
    bytesToSize: bytesToSize,
    calcBitrate: calcBitrate,
    parseTime: parseTime,
    checkHttp: checkHttp,
    shortText: shortText,
    protocol: protocol,
    addUrlComponent: addUrlComponent,
    sizeToBytes: sizeToBytes,
    putScript: putScript,
    putStyle: putStyle,
    clearTitle: clearTitle,
    cardImgBackground: cardImgBackground,
    strToTime: strToTime,
    stringToHslColor: stringToHslColor,
    pathToNormalTitle: pathToNormalTitle,
    hash: hash$2,
    uid: uid$1
  };

  function component$d(name) {
    var scrl = new create$q({
      mask: true,
      over: true
    });
    var comp = Template.get('settings_' + name);
    var last;

    if (Storage.get('native')) {
      comp.find('.is--torllok').remove();
    }

    if (!Platform.is('android')) {
      comp.find('.is--android').remove();
    }

    if (!Platform.any()) {
      comp.find('.is--player').remove();
    }

    if (!Platform.is('tizen')) {
      comp.find('.is--has_subs').remove();
    }

    scrl.render().find('.scroll__content').addClass('layer--wheight').data('mheight', $('.settings__head'));
    Params.bind(comp.find('.selector'));

    function updateScroll() {
      comp.find('.selector').unbind('hover:focus').on('hover:focus', function (e) {
        last = e.target;
        scrl.update($(e.target), true);
      });
    }

    Params.listener.follow('update_scroll', updateScroll);
    updateScroll();
    Controller.add('settings_component', {
      toggle: function toggle() {
        Controller.collectionSet(comp);
        Controller.collectionFocus(last, comp);
      },
      up: function up() {
        Navigator.move('up');
      },
      down: function down() {
        Navigator.move('down');
      },
      back: function back() {
        scrl.destroy();
        comp.remove();
        Params.listener.remove('update_scroll', updateScroll);
        Controller.toggle('settings');
      }
    });

    this.destroy = function () {
      scrl.destroy();
      comp.remove();
      comp = null;
      Params.listener.remove('update_scroll', updateScroll);
    };

    this.render = function () {
      return scrl.render(comp);
    };
  }

  function main$5() {
    var _this = this;

    var comp;
    var scrl = new create$q({
      mask: true,
      over: true
    });
    var last;

    this.create = function () {
      comp = Template.get('settings_main');
      comp.find('.selector').on('hover:focus', function (event) {
        last = event.target;
        scrl.update($(event.target), true);
      }).on('hover:enter', function (event) {
        _this.render().detach();

        _this.onCreate($(event.target).data('component'));
      });
    };

    this.active = function () {
      Controller.collectionSet(comp);
      Controller.collectionFocus(last, comp);
    };

    this.render = function () {
      return scrl.render(comp);
    };
  }

  var html$f = Template.get('settings');
  var body$3 = html$f.find('.settings__body');
  var listener$b = start$4();
  var last$4 = '';
  html$f.find('.settings__layer').on('click', function () {
    window.history.back();
  });

  function create$p(name) {
    var comp = new component$d(name);
    body$3.empty().append(comp.render());
    listener$b.send('open', {
      name: name,
      body: comp.render()
    });
    last$4 = name;
    Controller.toggle('settings_component');
  }

  function init$g() {
    var main = new main$5();
    main.onCreate = create$p;
    main.create();
    Controller.add('settings', {
      toggle: function toggle() {
        listener$b.send('open', {
          name: 'main',
          body: main.render()
        });
        body$3.empty().append(main.render());
        main.active();
        $('body').toggleClass('settings--open', true);
      },
      up: function up() {
        Navigator.move('up');
      },
      down: function down() {
        Navigator.move('down');
      },
      left: function left() {
        main.render().detach();
        Controller.toggle('content');
      },
      gone: function gone(to) {
        if (to !== 'settings_component') $('body').toggleClass('settings--open', false);
      },
      back: function back() {
        main.render().detach();
        Controller.toggle('head');
      }
    });
  }

  function update$8() {
    create$p(last$4);
  }

  function render$c() {
    return html$f;
  }

  var Settings = {
    listener: listener$b,
    init: init$g,
    render: render$c,
    update: update$8
  };

  var html$e = Template.get('selectbox');
  var scroll$3 = new create$q({
    mask: true,
    over: true
  });
  var active$4;
  html$e.find('.selectbox__body').append(scroll$3.render());
  html$e.find('.selectbox__layer').on('click', function () {
    window.history.back();
  });
  $('body').append(html$e);

  function bind$3() {
    scroll$3.clear();
    html$e.find('.selectbox__title').text(active$4.title);
    active$4.items.forEach(function (element) {
      if (element.hide) return;
      element.title = Utils.capitalizeFirstLetter(element.title || '');
      var item = Template.get(element.template || 'selectbox_item', element);
      if (!element.subtitle) item.find('.selectbox-item__subtitle').remove();

      if (element.checkbox) {
        item.addClass('selectbox-item--checkbox');
        item.append('<div class="selectbox-item__checkbox"></div>');
        if (element.checked) item.addClass('selectbox-item--checked');
      }

      if (!element.noenter) {
        var goclose = function goclose() {
          if (!active$4.nohide) hide$1();
          if (active$4.onSelect) active$4.onSelect(element);
        };

        item.on('hover:enter', function () {
          if (element.checkbox) {
            element.checked = !element.checked;
            item.toggleClass('selectbox-item--checked', element.checked);
            if (active$4.onCheck) active$4.onCheck(element);
          } else if (active$4.onBeforeClose) {
            if (active$4.onBeforeClose()) goclose();
          } else goclose();
        }).on('hover:focus', function (e) {
          scroll$3.update($(e.target), true);
          if (active$4.onFocus) active$4.onFocus(element, e.target);
        }).on('hover:long', function (e) {
          if (active$4.onLong) active$4.onLong(element, e.target);
        });
      }

      if (element.selected) item.addClass('selected');
      scroll$3.append(item);
    });
  }

  function show$3(object) {
    active$4 = object;
    bind$3();
    $('body').toggleClass('selectbox--open', true);
    html$e.find('.selectbox__body').addClass('layer--wheight').data('mheight', html$e.find('.selectbox__head'));
    toggle$8();
  }

  function toggle$8() {
    Controller.add('select', {
      toggle: function toggle() {
        var selected = scroll$3.render().find('.selected');
        Controller.collectionSet(html$e);
        Controller.collectionFocus(selected.length ? selected[0] : false, html$e);
      },
      up: function up() {
        Navigator.move('up');
      },
      down: function down() {
        Navigator.move('down');
      },
      back: close$2
    });
    Controller.toggle('select');
  }

  function hide$1() {
    $('body').toggleClass('selectbox--open', false);
  }

  function close$2() {
    hide$1();
    if (active$4.onBack) active$4.onBack();
  }

  function render$b() {
    return html$e;
  }

  var Select = {
    show: show$3,
    hide: hide$1,
    close: close$2,
    render: render$b
  };

  var body$2;
  var network$a = new create$r();
  var api = Utils.protocol() + 'cub.watch/api/';
  var notice_load = {
    time: 0,
    data: []
  };
  var bookmarks = [];
  /**
   * Запуск
   */

  function init$f() {
    Settings.listener.follow('open', function (e) {
      body$2 = null;

      if (e.name == 'account') {
        body$2 = e.body;
        renderPanel$1();
        check$1();
      }
    });
    Storage.listener.follow('change', function (e) {
      if (e.name == 'account_email' || e.name == 'account_password') {
        signin();
        if (e.name == 'account_password') Storage.set('account_password', '', true);
      }
    });
    Favorite.listener.follow('add,added', function (e) {
      save$3('add', e.where, e.card);
    });
    Favorite.listener.follow('remove', function (e) {
      save$3('remove', e.where, e.card);
    });
    update$7();
  }

  function save$3(method, type, card) {
    var account = Storage.get('account', '{}');

    if (account.token && Storage.field('account_use')) {
      var list = Storage.get('account_bookmarks', '[]');
      var find = list.find(function (elem) {
        return elem.card_id == card.id && elem.type == type;
      });
      network$a.clear();
      network$a.silent(api + 'bookmarks/' + method, update$7, false, {
        type: type,
        data: JSON.stringify(card),
        card_id: card.id,
        id: find ? find.id : 0
      }, {
        headers: {
          token: account.token,
          profile: account.profile.id
        }
      });

      if (method == 'remove') {
        if (find) Arrays.remove(list, find);
      } else {
        list.push({
          id: 0,
          card_id: card.id,
          type: type,
          data: JSON.stringify(card),
          profile: account.profile.id
        });
      }

      updateBookmarks(list);
    }
  }

  function update$7() {
    var account = Storage.get('account', '{}');

    if (account.token) {
      network$a.silent(api + 'bookmarks/all?full=1', function (result) {
        if (result.secuses) {
          updateBookmarks(result.bookmarks);
        }
      }, false, false, {
        headers: {
          token: account.token,
          profile: account.profile.id
        }
      });
    } else {
      updateBookmarks([]);
    }
  }

  function plugins(call) {
    var account = Storage.get('account', '{}');

    if (account.token) {
      network$a.silent(api + 'plugins/all', function (result) {
        if (result.secuses) {
          call(result.plugins);
        } else {
          call([]);
        }
      }, function () {
        call([]);
      }, false, {
        headers: {
          token: account.token,
          profile: account.profile.id
        }
      });
    } else {
      call([]);
    }
  }
  /**
   * Статус
   */


  function renderStatus$1(name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (body$2) {
      body$2.find('.settings--account-status .settings-param__value').text(name);
      body$2.find('.settings--account-status .settings-param__descr').text(value);
    }
  }

  function renderPanel$1() {
    if (body$2) {
      var account = Storage.get('account', '{}');
      var signed = account.token ? true : false;
      body$2.find('.settings--account-signin').toggleClass('hide', signed);
      body$2.find('.settings--account-user').toggleClass('hide', !signed);

      if (account.token) {
        body$2.find('.settings--account-user-info .settings-param__value').text(account.email);
        body$2.find('.settings--account-user-profile .settings-param__value').text(account.profile.name);
        body$2.find('.settings--account-user-out').on('hover:enter', function () {
          Storage.set('account', {});
          Settings.update();
          update$7();
        });
        profile();
      } else check$1();
    }
  }

  function profile() {
    var account = Storage.get('account', '{}');
    body$2.find('.settings--account-user-profile .settings-param__value').text(account.profile.name);
    body$2.find('.settings--account-user-profile').on('hover:enter', function () {
      network$a.clear();
      network$a.silent(api + 'profiles/all', function (result) {
        if (result.secuses) {
          Select.show({
            title: '配置文件',
            items: result.profiles.map(function (elem) {
              elem.title = elem.name;
              return elem;
            }),
            onSelect: function onSelect(a) {
              account.profile = a;
              Storage.set('account', account);
              body$2.find('.settings--account-user-profile .settings-param__value').text(a.name);
              Controller.toggle('settings_component');
              update$7();
            },
            onBack: function onBack() {
              Controller.toggle('settings_component');
            }
          });
        } else {
          Noty.show(result.text);
        }
      }, function () {
        Noty.show('获取个人资料列表失败');
      }, false, {
        headers: {
          token: account.token
        }
      });
    });
  }

  function check$1() {
    var account = Storage.get('account', '{}');

    if (account.token) {
      renderStatus$1('已登录', '您登录为' + account.email);
    } else {
      renderStatus$1('登录失败', '等待登录');
    }
  }

  function working() {
    return Storage.get('account', '{}').token && Storage.field('account_use');
  }

  function get$8(params) {
    return bookmarks.filter(function (elem) {
      return elem.type == params.type;
    }).map(function (elem) {
      return elem.data;
    });
  }

  function updateBookmarks(rows) {
    Storage.set('account_bookmarks', rows);
    bookmarks = rows.reverse().map(function (elem) {
      elem.data = JSON.parse(elem.data);
      return elem;
    });
  }
  /**
   * Проверка авторизации
   */


  function signin() {
    var email = Storage.get('account_email', '');
    var password = Storage.get('account_password', '');

    if (email && password) {
      network$a.clear();
      network$a.silent(api + 'users/signin', function (result) {
        if (result.secuses) {
          Storage.set('account', {
            email: email,
            token: result.user.token,
            id: result.user.id,
            profile: {
              name: '常规',
              id: 0
            }
          });
          Settings.update();
          update$7();
        } else {
          renderStatus$1('Error', result.text);
        }
      }, function () {
        renderStatus$1('Error', '无网络连接');
      }, {
        email: email,
        password: password
      });
    }
  }

  function notice(call) {
    var account = Storage.get('account', '{}');

    if (account.token) {
      if (notice_load.time + 1000 * 60 * 10 < Date.now()) {
        network$a.timeout(1000);
        network$a.silent(api + 'notice/all', function (result) {
          if (result.secuses) {
            notice_load.time = Date.now();
            notice_load.data = result.notice;
            call(result.notice);
          } else call([]);
        }, function () {
          call([]);
        }, false, {
          headers: {
            token: account.token
          }
        });
      } else call(notice_load.data);
    } else call([]);
  }

  var Account = {
    init: init$f,
    working: working,
    get: get$8,
    plugins: plugins,
    notice: notice
  };

  var data$1 = {};
  var listener$a = start$4();

  function save$2() {
    Storage.set('favorite', data$1);
  }
  /**
   * 添加
   * @param {String} where 
   * @param {Object} card 
   */


  function add$7(where, card, limit) {
    read$1();

    if (data$1[where].indexOf(card.id) < 0) {
      Arrays.insert(data$1[where], 0, card.id);
      listener$a.send('add', {
        where: where,
        card: card
      });
      if (!search$3(card.id)) data$1.card.push(card);

      if (limit) {
        var excess = data$1[where].slice(limit);

        for (var i = excess.length - 1; i >= 0; i--) {
          remove$1(where, {
            id: excess[i]
          });
        }
      }

      save$2();
    } else {
      listener$a.send('added', {
        where: where,
        card: card
      });
    }
  }
  /**
   * 删除
   * @param {String} where 
   * @param {Object} card 
   */


  function remove$1(where, card) {
    read$1();
    Arrays.remove(data$1[where], card.id);
    listener$a.send('remove', {
      where: where,
      card: card
    });

    for (var i = data$1.card.length - 1; i >= 0; i--) {
      var element = data$1.card[i];

      if (!check(element).any) {
        Arrays.remove(data$1.card, element);
        listener$a.send('remove', {
          where: where,
          card: element
        });
      }
    }

    save$2();
  }
  /**
   * Найти
   * @param {Int} id 
   * @returns Object
   */


  function search$3(id) {
    var found;

    for (var index = 0; index < data$1.card.length; index++) {
      var element = data$1.card[index];

      if (element.id == id) {
        found = element;
        break;
      }
    }

    return found;
  }
  /**
   * Переключить
   * @param {String} where 
   * @param {Object} card 
   */


  function toggle$7(where, card) {
    read$1();
    var find = cloud(card);
    if (find[where]) remove$1(where, card);else add$7(where, card);
    return find[where] ? false : true;
  }
  /**
   * Проверить
   * @param {Object} card 
   * @returns Object
   */


  function check(card) {
    var result = {
      like: data$1.like.indexOf(card.id) > -1,
      wath: data$1.wath.indexOf(card.id) > -1,
      book: data$1.book.indexOf(card.id) > -1,
      history: data$1.history.indexOf(card.id) > -1,
      any: true
    };
    if (!result.like && !result.wath && !result.book && !result.history) result.any = false;
    return result;
  }

  function cloud(card) {
    if (Account.working()) {
      var list = {
        like: Account.get({
          type: 'like'
        }),
        wath: Account.get({
          type: 'wath'
        }),
        book: Account.get({
          type: 'book'
        }),
        history: Account.get({
          type: 'history'
        })
      };
      var result = {
        like: list.like.find(function (elem) {
          return elem.id == card.id;
        }) ? true : false,
        wath: list.wath.find(function (elem) {
          return elem.id == card.id;
        }) ? true : false,
        book: list.book.find(function (elem) {
          return elem.id == card.id;
        }) ? true : false,
        history: list.history.find(function (elem) {
          return elem.id == card.id;
        }) ? true : false,
        any: true
      };
      if (!result.like && !result.wath && !result.book && !result.history) result.any = false;
      return result;
    } else return check(card);
  }
  /**
   * Получить списаок по типу
   * @param {String} params.type - тип 
   * @returns Object
   */


  function get$7(params) {
    if (Account.working()) {
      return Account.get(params);
    } else {
      read$1();
      var result = [];
      var ids = data$1[params.type];
      ids.forEach(function (id) {
        for (var i = 0; i < data$1.card.length; i++) {
          var card = data$1.card[i];
          if (card.id == id) result.push(card);
        }
      });
      return result;
    }
  }
  /**
   * Очистить
   * @param {String} where 
   * @param {Object} card 
   */


  function clear$6(where, card) {
    read$1();
    if (card) remove$1(where, card);else {
      for (var i = data$1[where].length - 1; i >= 0; i--) {
        var _card = search$3(data$1[where][i]);

        if (_card) remove$1(where, _card);
      }
    }
  }
  /**
   * Считать последние данные
   */


  function read$1() {
    data$1 = Storage.get('favorite', '{}');
    Arrays.extend(data$1, {
      like: [],
      wath: [],
      book: [],
      card: [],
      history: []
    });
  }
  /**
   * Запуск
   */


  function init$e() {
    read$1();
  }

  var Favorite = {
    listener: listener$a,
    check: cloud,
    add: add$7,
    remove: remove$1,
    toggle: toggle$7,
    get: get$7,
    init: init$e,
    clear: clear$6
  };

  function status$1(need) {
    this.data = {};
    this.work = 0;

    this.check = function () {
      if (this.work >= need) this.onComplite(this.data);
    };

    this.append = function (name, json) {
      this.work++;
      this.data[name] = json;
      this.check();
    };

    this.error = function () {
      this.work++;
      this.check();
    };
  }

  var baseurl$3 = Utils.protocol() + 'api.themoviedb.org/3/';
  var baseimg = Utils.protocol() + 'image.tmdb.org/t/p/w200/';
  var network$9 = new create$r();
  var key = '4ef0d7355d9ffb5151e987764708ce96';
  var menu_list$2 = [];

  function url$5(u) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    u = add$6(u, 'api_key=' + key);
    u = add$6(u, 'language=' + Storage.field('tmdb_lang'));
    if (params.genres) u = add$6(u, 'with_genres=' + params.genres);
    if (params.page) u = add$6(u, 'page=' + params.page);
    if (params.query) u = add$6(u, 'query=' + params.query);

    if (params.filter) {
      for (var i in params.filter) {
        u = add$6(u, i + '=' + params.filter[i]);
      }
    }

    return baseurl$3 + u;
  }

  function add$6(u, params) {
    return u + (/\?/.test(u) ? '&' : '?') + params;
  }

  function img$3(src, size) {
    var path = baseimg;
      if (src.indexOf("http") != -1) path = '';
    if (size) path = path.replace(/w200/g, size);
    return src ? path + src : '';
  }

  function find$1(find) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var finded;

    var filtred = function filtred(items) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (params.original_title == item.original_title || params.title == item.title || params.original_title == item.name) {
          finded = item;
          break;
        }
      }
    };

    if (find.movie && find.movie.results.length) filtred(find.movie.results);
    if (find.tv && find.tv.results.length && !finded) filtred(find.tv.results);
    return finded;
  }

  function main$4() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var status = new status$1(11);  

    status.onComplite = function () {
      var fulldata = [];
      if (status.data.wath) fulldata.push(status.data.wath);
      if (status.data.trend_day) fulldata.push(status.data.trend_day);
      if (status.data.trend_week) fulldata.push(status.data.trend_week);
      if (status.data.upcoming) fulldata.push(status.data.upcoming);
      if (status.data.popular) fulldata.push(status.data.popular);
      if (status.data["popular_tv_kr"] && status.data["popular_tv_kr"].results.length) fulldata.push(status.data["popular_tv_kr"]);
        if (status.data["popular_tv_cn"] && status.data["popular_tv_cn"].results.length) fulldata.push(status.data["popular_tv_cn"]);
        if (status.data["popular_tv_en"] && status.data["popular_tv_en"].results.length) fulldata.push(status.data["popular_tv_en"]);
        if (status.data.popular_tv) fulldata.push(status.data.popular_tv);
              if (status.data.top) fulldata.push(status.data.top);
      if (status.data.top_tv) fulldata.push(status.data.top_tv);
      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, json) {
      json.title = title;
      status.append(name, json);
    };

    var date = new Date();
      var nparams4 = Arrays.clone(params);
      nparams4.filter = {
        with_original_language: "zh",
        sort_by: 'release_date.desc',
        year: date.getFullYear(),
        first_air_date_year: date.getFullYear(),
        //'vote_average.gte': 7,
        filter :"drama",
        with_genres : 18
      };
      get$6('tv/popular', nparams4, function (json) {
        json.filter = nparams4.filter;
        append('热门国产剧', 'popular_tv_cn', json);
      }, status.error.bind(status));

      var nparams5 = Arrays.clone(params);
      nparams5.filter = {
        with_original_language: "ko",
        sort_by: 'release_date.desc',
        year: date.getFullYear(),
        first_air_date_year: date.getFullYear(),
        //'vote_average.gte': 7,
        filter :"drama",
        with_genres : "18|80|10759|9648|10751"
      };
      get$6('tv/popular', nparams5, function (json) {
        json.filter = nparams5.filter;
        append('热门韩剧', 'popular_tv_kr', json);
      }, status.error.bind(status));

      var nparams6 = Arrays.clone(params);
      nparams6.filter = {
        with_original_language: "en",
        sort_by: 'release_date.desc',
        year: date.getFullYear(),
        first_air_date_year: date.getFullYear(),
        //'vote_average.gte': 7,
        filter :"drama",
        with_genres : 18
      };
      get$6('tv/popular', nparams6, function (json) {
        json.filter = nparams6.filter;
        append('热门英美剧', 'popular_tv_en', json);
      }, status.error.bind(status));

      get$6('movie/now_playing', params, function (json) {
      append('现在观看', 'wath', json);
    }, status.error.bind(status));
    get$6('trending/moviews/day', params, function (json) {
      append('今日热门', 'trend_day', json);
    }, status.error.bind(status));
    get$6('trending/moviews/week', params, function (json) {
      append('本周热门', 'trend_week', json);
    }, status.error.bind(status));
    get$6('movie/upcoming', params, function (json) {
      append('在电影院观看', 'upcoming', json);
    }, status.error.bind(status));
    get$6('movie/popular', params, function (json) {
      append('热门电影', 'popular', json);
    }, status.error.bind(status));
    get$6('tv/popular', params, function (json) {
      append('热门电视节目', 'popular_tv', json);
    }, status.error.bind(status));
    get$6('movie/top_rated', params, function (json) {
      append('热门电影', 'top', json);
    }, status.error.bind(status));
    get$6('tv/top_rated', params, function (json) {
      append('热门电视节目', 'top_tv', json);
    }, status.error.bind(status));
  }

  function category$4() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var status = new status$1(12);  

    status.onComplite = function () {
      var fulldata = [];
      if (status.data["tv_air_kr"] && status.data["tv_air_kr"].results.length) fulldata.push(status.data["tv_air_kr"]);
        if (status.data["new_kr"] && status.data["new_kr"].results.length) fulldata.push(status.data["new_kr"]);
        if (status.data["tv_air_ch"] && status.data["tv_air_ch"].results.length) fulldata.push(status.data["tv_air_ch"]);
        if (status.data["new_cn"] && status.data["new_cn"].results.length) fulldata.push(status.data["new_cn"]);
        if (status.data["tv_air_en"] && status.data["tv_air_en"].results.length) fulldata.push(status.data["tv_air_en"]);
        if (status.data["new_en"] && status.data["new_en"].results.length) fulldata.push(status.data["new_en"]);
        if (status.data.wath && status.data.wath.results.length) fulldata.push(status.data.wath);
      if (status.data.popular && status.data.popular.results.length) fulldata.push(status.data.popular);
      if (status.data["new"] && status.data["new"].results.length) fulldata.push(status.data["new"]);
      if (status.data.tv_today && status.data.tv_today.results.length) fulldata.push(status.data.tv_today);
      if (status.data.tv_air && status.data.tv_air.results.length) fulldata.push(status.data.tv_air);
      if (status.data.top && status.data.top.results.length) fulldata.push(status.data.top);
      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, json) {
      json.title = title;
      status.append(name, json);
    };

    var date = new Date();
      var nparams4 = Arrays.clone(params);
      nparams4.filter = {
        with_original_language: "ko",
        sort_by: 'release_date.desc',
        year: date.getFullYear(),
        first_air_date_year: date.getFullYear(),
        'vote_average.gte': 7,
        filter :"drama"
      };
      get$6('discover/' + params.url, nparams4, function (json) {
        json.filter = nparams4.filter;
        append('今年韩剧', 'new_kr', json);
      }, status.error.bind(status));
      var nparams7 = Arrays.clone(params);
      nparams7.filter = {
        with_original_language: "zh",
        sort_by: 'release_date.desc',
        year: date.getFullYear(),
        first_air_date_year: date.getFullYear(),
        //'vote_average.gte': 7,
        filter :"drama",
        with_genres : "18|10759|10751|35|9648"
      };
      get$6('discover/' + params.url, nparams7, function (json) {
        json.filter = nparams7.filter;
        append('今年国产剧', 'new_cn', json);
      }, status.error.bind(status));
      var nparams8 = Arrays.clone(params);
      nparams8.filter = {
        with_original_language: "en",
        sort_by: 'release_date.desc',
        year: date.getFullYear(),
        first_air_date_year: date.getFullYear(),
        'vote_average.gte': 7,
        filter :"drama",
        with_genres : 18
      };
      get$6('discover/' + params.url, nparams8, function (json) {
        json.filter = nparams8.filter;
        append('今年英美剧', 'new_en', json);
      }, status.error.bind(status));
      var nparams5 = Arrays.clone(params);
      nparams5.filter = {
        with_original_language: "ko",
        filter :"drama",
        with_genres : 18
      };
      get$6(params.url + '/on_the_air', nparams5, function (json) {
        json.filter = nparams5.filter;
        append('本周韩剧', 'tv_air_kr', json);
      }, status.error.bind(status));

      var nparams1 = Arrays.clone(params);
      nparams1.filter = {
        with_original_language: "zh",
        filter :"drama",
        with_genres : 18
      };
      get$6(params.url + '/on_the_air', nparams1, function (json) {
        json.filter = nparams1.filter;
        append('本周国产剧', 'tv_air_ch', json);
      }, status.error.bind(status));
      var nparams2 = Arrays.clone(params);
      nparams2.filter = {
        with_original_language: "en",
        filter :"drama",
        with_genres : 18
      };
      get$6(params.url + '/on_the_air', nparams2, function (json) {
        json.filter = nparams2.filter;
        append('本周英美剧', 'tv_air_en', json);
      }, status.error.bind(status));

      get$6(params.url + '/now_playing', params, function (json) {
      append('正在观看', 'wath', json);
    }, status.error.bind(status));
    get$6(params.url + '/popular', params, function (json) {
      append('热门', 'popular', json);
    }, status.error.bind(status));
    var date = new Date();
    var nparams = Arrays.clone(params);
    nparams.filter = {
      sort_by: 'release_date.desc',
      year: date.getFullYear(),
      first_air_date_year: date.getFullYear(),
      'vote_average.gte': 7
    };
    get$6('discover/' + params.url, nparams, function (json) {
      json.filter = nparams.filter;
      append('新', 'new', json);
    }, status.error.bind(status));
    get$6(params.url + '/airing_today', params, function (json) {
      append('今日播出', 'tv_today', json);
    }, status.error.bind(status));
    get$6(params.url + '/on_the_air', params, function (json) {
      append('本周', 'tv_air', json);
    }, status.error.bind(status));
    get$6(params.url + '/top_rated', params, function (json) {
      append('热门', 'top', json);
    }, status.error.bind(status));
  }

  function full$4() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var status = new status$1(5);
    status.onComplite = oncomplite;
    get$6(params.method + '/' + params.id, params, function (json) {
      json.source = 'tmdb';
      status.append('movie', json);
    }, status.error.bind(status));
    get$6(params.method + '/' + params.id + '/credits', params, function (json) {
      status.append('persons', json);
    }, status.error.bind(status));
    get$6(params.method + '/' + params.id + '/recommendations', params, function (json) {
      status.append('recomend', json);
    }, status.error.bind(status));
    get$6(params.method + '/' + params.id + '/similar', params, function (json) {
      status.append('simular', json);
    }, status.error.bind(status));
    get$6(params.method + '/' + params.id + '/videos', params, function (json) {
      status.append('videos', json);
    }, status.error.bind(status));
  }

  function list$5() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var u = url$5(params.url, params);
    network$9.silent(u, oncomplite, onerror);
  }

  function get$6(method) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
    var onerror = arguments.length > 3 ? arguments[3] : undefined;
    var u = url$5(method, params);
    network$9.silent(u, function (json) {
      json.url = method;
      oncomplite(json);
    }, onerror);
  }

  function search$2() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var status = new status$1(2);
    status.onComplite = oncomplite;
    get$6('search/movie', params, function (json) {
      json.title = '电影';
      status.append('movie', json);
    }, status.error.bind(status));
    get$6('search/tv', params, function (json) {
      json.title = '电视剧';
      status.append('tv', json);
    }, status.error.bind(status));
  }

  function person$4() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;

    var sortCredits = function sortCredits(credits) {
      return credits.map(function (a) {
        a.year = parseInt(((a.release_date || a.first_air_date || '0000') + '').slice(0, 4));
        return a;
      }).sort(function (a, b) {
        return b.vote_average - a.vote_average && b.vote_count - a.vote_count;
      }); //сортируем по оценке и кол-ву голосов (чтобы отсечь мусор с 1-2 оценками)
    };

    var convert = function convert(credits, person) {
      credits.crew.forEach(function (a) {
        a.department = a.department == 'Production' ? '制作' : a.department == 'Directing' ? '导演' : a.department;
      });
      var cast = sortCredits(credits.cast),
          crew = sortCredits(credits.crew),
          tv = sortCredits(cast.filter(function (media) {
        return media.media_type === 'tv';
      })),
          movie = sortCredits(cast.filter(function (media) {
        return media.media_type === 'movie';
      })),
          knownFor; //Наиболее известные работы человека
      //1. Группируем все работы по департаментам (演员, 导演, Сценарист и т.д.)

      knownFor = Arrays.groupBy(crew, 'department');
      var actorGender = person.gender === 1 ? '女演员' : '演员';
      if (movie.length > 0) knownFor["".concat(actorGender, " - 电影")] = movie;
      if (tv.length > 0) knownFor["".concat(actorGender, " - 电视节目")] = tv; //2. Для каждого департамента суммируем кол-ва голосов (вроде бы сам TMDB таким образом определяет knownFor для людей)

      knownFor = Object.entries(knownFor).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            depIdx = _ref2[0],
            dep = _ref2[1];

        //убираем дубликаты (человек может быть указан в одном департаменте несколько раз на разных должностях (job))
        var set = {},
            credits = dep.filter(function (credit) {
          return set.hasOwnProperty(credit.original_title || credit.original_name) ? false : credit.original_title ? set[credit.original_title] = true : set[credit.original_name] = true;
        });
        return {
          name: depIdx,
          credits: credits,
          vote_count: dep.reduce(function (a, b) {
            return a + b.vote_count;
          }, 0)
        }; //3. Сортируем департаменты по кол-ву голосов
      }).sort(function (a, b) {
        return b.vote_count - a.vote_count;
      });
      return {
        raw: credits,
        cast: cast,
        crew: crew,
        tv: tv,
        movie: movie,
        knownFor: knownFor
      };
    };

    var status = new status$1(2);

    status.onComplite = function () {
      var fulldata = {};
      if (status.data.person) fulldata.person = status.data.person;
      if (status.data.credits) fulldata.credits = convert(status.data.credits, status.data.person);
      oncomplite(fulldata);
    };

    get$6('person/' + params.id, params, function (json) {
      status.append('person', json);
    }, status.error.bind(status));
    get$6('person/' + params.id + '/combined_credits', params, function (json) {
      status.append('credits', json);
    }, status.error.bind(status));
  }

  function menu$4() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    if (menu_list$2.length) oncomplite(menu_list$2);else {
      var u = url$5('genre/movie/list', params);
      network$9.silent(u, function (j) {
        j.genres.forEach(function (g) {
          menu_list$2.push({
            title: g.name,
            id: g.id
          });
        });
        oncomplite(menu_list$2);
      });
    }
  }

  function external_ids() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    get$6('tv/' + params.id + '/external_ids', oncomplite, onerror);
  }

  function company$1() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var u = url$5('company/' + params.id, params);
    network$9.silent(u, oncomplite, onerror);
  }

  function seasons$4(tv, from, oncomplite) {
    var status = new status$1(from.length);
    status.onComplite = oncomplite;
    from.forEach(function (season) {
      get$6('tv/' + tv.id + '/season/' + season, {}, function (json) {
        status.append('' + season, json);
      }, status.error.bind(status));
    });
  }

  function screensavers(oncomplite, onerror) {
    get$6('trending/all/week', {
      page: Math.round(Math.random() * 30)
    }, function (json) {
      oncomplite(json.results.filter(function (entry) {
        return entry.backdrop_path && !entry.adult;
      }));
    }, onerror);
  }

  function clear$5() {
    network$9.clear();
  }

  var TMDB = {
    main: main$4,
    menu: menu$4,
    img: img$3,
    full: full$4,
    list: list$5,
    category: category$4,
    search: search$2,
    clear: clear$5,
    company: company$1,
    person: person$4,
    seasons: seasons$4,
    find: find$1,
    screensavers: screensavers,
    external_ids: external_ids,
    get: get$6
  };

  var baseurl$2 = 'https://ctx.playfamily.ru/screenapi/v1/noauth/';
  var network$8 = new create$r();
  var menu_list$1 = [];

  function img$2(element) {
    var need = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'PORTRAIT';

    if (element.basicCovers && element.basicCovers.items.length) {
      for (var index = 0; index < element.basicCovers.items.length; index++) {
        var _img = element.basicCovers.items[index];
        if (_img.imageType == need) return _img.url + '?width=' + (need == 'COVER' ? 800 : 300) + '&scale=1&quality=80&mediaType=jpeg';
      }

      return element.basicCovers.items[0].url + '?width=500&scale=1&quality=80&mediaType=jpeg';
    }

    return '';
  }

  function tocard$1(element) {
    return {
      url: element.alias,
      id: element.id,
      title: element.name,
      original_title: element.originalName,
      release_date: '0000',
      vote_average: element.kinopoiskRating || element.okkoRating || 0,
      poster: img$2(element),
      cover: img$2(element, 'COVER'),
      promo: element.promoText,
      description: element.description
    };
  }

  function collections$2(params, oncomplite, onerror) {
    var frm = 20 * (params.page - 1);
    var uri = baseurl$2 + 'collection/web/1?elementAlias=' + (params.url || 'collections_web') + '&elementType=COLLECTION&limit=20&offset=' + frm + '&withInnerCollections=true&includeProductsForUpsale=false&filter=%7B%22sortType%22%3A%22RANK%22%2C%22sortOrder%22%3A%22ASC%22%2C%22useSvodFilter%22%3Afalse%2C%22genres%22%3A%5B%5D%2C%22yearsRange%22%3Anull%2C%22rating%22%3Anull%7D';
    network$8["native"](uri, function (json) {
      var items = [];

      if (json.element) {
        json.element.collectionItems.items.forEach(function (elem) {
          var element = elem.element;
          var item = {
            url: element.alias,
            id: element.id,
            title: element.name,
            poster: element.basicCovers && element.basicCovers.items.length ? element.basicCovers.items[0].url + '?width=300&scale=1&quality=80&mediaType=jpeg' : 'https://www.ivi.ru/images/stubs/collection_preview_stub.jpeg'
          };
          if (params.url) item = tocard$1(element);
          items.push(item);
        });
      }

      oncomplite(items);
    }, onerror);
  }

  function persons$1(element) {
    var data = [];

    if (element.actors) {
      element.actors.items.forEach(function (elem) {
        var item = elem.element;
        data.push({
          url: item.alias,
          name: item.name,
          character: item.originalName
        });
      });
    }

    return data.length ? {
      cast: data
    } : false;
  }

  function genres$2(element) {
    return element.genres.items.map(function (elem) {
      elem.element.url = elem.element.alias;
      return elem.element;
    });
  }

  function countries$1(element) {
    return element.countries.items.map(function (elem) {
      return elem.element;
    });
  }

  function date(element) {
    var d = new Date(element.worldReleaseDate || element || 0);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function seasonsCount$1(element) {
    var data = {
      seasons: 0,
      episodes: 0
    };

    if (element.children) {
      data.seasons = element.children.totalSize;
      element.children.items.forEach(function (elem) {
        data.episodes += elem.element.children ? elem.element.children.totalSize : 0;
      });
    }

    return data;
  }

  function seasonsDetails(element) {
    var data = {};

    if (element.children) {
      element.children.items.forEach(function (elem, sn) {
        var episodes = [];

        if (elem.element.children) {
          elem.element.children.items.forEach(function (episode, en) {
            episodes.push({
              name: episode.element.name,
              img: img$2(episode.element, 'COVER'),
              air_date: date(episode.element.releaseSaleDate || 0),
              episode_number: en + 1
            });
          });
        }

        data['' + (sn + 1)] = {
          name: elem.element.name,
          air_date: date(elem.element.worldReleaseDate || 0),
          episodes: episodes
        };
      });
      return data;
    }
  }

  function similar$1(element) {
    var data = [];
    element.similar.items.forEach(function (elem) {
      data.push(tocard$1(elem.element));
    });
    return data.length ? {
      results: data
    } : false;
  }

  function seasons$3(tv, from, oncomplite, onerror) {
    oncomplite(tv.seasons || {});
  }

  function menu$3(params, oncomplite) {
    if (!menu_list$1.length) {
      network$8.timeout(1000);
      network$8["native"](baseurl$2 + 'collection/web/1?elementAlias=action&elementType=GENRE&limit=20&offset=0&withInnerCollections=false&includeProductsForUpsale=false&filter=null', function (json) {
        if (json.uiScreenInfo && json.uiScreenInfo.webMain) {
          json.uiScreenInfo.webMain.forEach(function (element) {
            menu_list$1.push({
              title: element.name,
              id: element.alias
            });
          });
          oncomplite(menu_list$1);
        }
      });
    } else {
      oncomplite(menu_list$1);
    }
  }

  function videos$1(element) {
    var data = [];
    var qa = 0;
    element.trailers.items.forEach(function (item) {
      var media = item.media;

      if (media.width > qa && media.mimeType == 'mp4/ts') {
        qa = media.width;
        data.push({
          name: data.length + 1 + ' / ' + item.language,
          url: item.url,
          player: true
        });
      }
    });
    return data.length ? {
      results: data
    } : false;
  }

  function list$4(params, oncomplite, onerror) {
    var frm = 20 * (params.page - 1);
    network$8["native"](baseurl$2 + 'collection/web/1?elementAlias=' + (params.url || params.id) + '&elementType=' + (params.type || 'GENRE') + '&limit=20&offset=' + frm + '&withInnerCollections=false&includeProductsForUpsale=false&filter=null', function (json) {
      var items = [];

      if (json.element && json.element.collectionItems) {
        json.element.collectionItems.items.forEach(function (elem) {
          items.push(tocard$1(elem.element));
        });
        oncomplite({
          results: items,
          total_pages: Math.round(json.element.collectionItems.totalSize / 20)
        });
      } else {
        onerror();
      }
    }, onerror);
  }

  function person$3(params, oncomplite, onerror) {
    network$8["native"](baseurl$2 + 'collection/web/1?elementAlias=' + params.url + '&elementType=PERSON&limit=60&offset=0&withInnerCollections=false&includeProductsForUpsale=false&filter=null', function (json) {
      var data = {
        movie: {
          results: []
        }
      };

      if (json.element && json.element.collectionItems) {
        json.element.collectionItems.items.forEach(function (elem) {
          data.movie.results.push(tocard$1(elem.element));
        });
        data.person = {
          name: json.element.name,
          biography: '',
          img: '',
          place_of_birth: '',
          birthday: '----'
        };
        oncomplite(data);
      } else {
        onerror();
      }
    }, onerror);
  }

  function main$3(params, oncomplite, onerror) {
    network$8["native"](baseurl$2 + 'mainpage/web/1', function (json) {
      var element = json.element;
      var fulldata = [];

      if (element) {
        var blocks = json.element.collectionItems.items;

        if (blocks) {
          blocks.forEach(function (el) {
            if (el.element && el.element.alias === "web_featured") {
              var slides = {
                title: '新建',
                results: [],
                wide: true
              };
              el.element.collectionItems.items.forEach(function (elem) {
                slides.results.push(tocard$1(elem.element));
              });
              fulldata.push(slides);
            } else if (el.element && el.element.alias === "short_web_categories") {
              el.element.collectionItems.items.forEach(function (block) {
                var line = {
                  title: block.element.name,
                  url: block.element.alias,
                  results: [],
                  more: true
                };
                block.element.collectionItems.items.forEach(function (elem) {
                  line.results.push(tocard$1(elem.element));
                });
                fulldata.push(line);
              });
            }
          });
        }
      }

      if (fulldata.length) oncomplite(fulldata);else onerror();
    }, onerror);
  }

  function category$3(params, oncomplite, onerror) {
    var status = new status$1(7);

    status.onComplite = function () {
      var fulldata = [];
      if (status.data["new"] && status.data["new"].results.length) fulldata.push(status.data["new"]);
      if (status.data.top && status.data.top.results.length) fulldata.push(status.data.top);
      if (status.data.three && status.data.three.results.length) fulldata.push(status.data.three);
      if (status.data.four && status.data.four.results.length) fulldata.push(status.data.four);
      if (status.data.five && status.data.five.results.length) fulldata.push(status.data.five);
      if (status.data.six && status.data.six.results.length) fulldata.push(status.data.six);
      if (status.data.seven && status.data.seven.results.length) fulldata.push(status.data.seven);
      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, id, json) {
      json.title = title;
      json.url = id;
      status.append(name, json);
    };

    if (params.url == 'movie') {
      list$4({
        url: 'Novelty',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('新', 'new', 'Novelty', json);
      }, status.error.bind(status));
      list$4({
        url: 'topfilms',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('热门新', 'top', 'topfilms', json);
      }, status.error.bind(status));
      list$4({
        url: 'comedy-plus-horror-movies',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('喜剧恐怖', 'three', 'comedy-plus-horror-movies', json);
      }, status.error.bind(status));
      list$4({
        url: 'collection_maniacs',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('疯子电影', 'four', 'collection_maniacs', json);
      }, status.error.bind(status));
      list$4({
        url: 'witches',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('女巫电影', 'five', 'witches', json);
      }, status.error.bind(status));
      list$4({
        url: 'zombies',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('僵尸电影', 'six', 'zombies', json);
      }, status.error.bind(status));
      list$4({
        url: 'Russian-17490',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('俄语', 'seven', 'Russian-17490', json);
      }, status.error.bind(status));
    } else {
      list$4({
        url: 'Serials',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('新', 'new', 'Serials', json);
      }, status.error.bind(status));
      list$4({
        url: 'horror-serial-all-svod',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('非常可怕', 'top', 'horror-serial-all-svod', json);
      }, status.error.bind(status));
      list$4({
        url: 'series-about-serial-killers',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('关于疯子', 'three', 'series-about-serial-killers', json);
      }, status.error.bind(status));
      list$4({
        url: 'black-humor-serial-all-svod',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('带有黑色幽默', 'four', 'black-humor-serial-all-svod', json);
      }, status.error.bind(status));
      list$4({
        url: 'legkiye-serialy-all-svod',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('浅色', 'five', 'legkiye-serialy-all-svod', json);
      }, status.error.bind(status));
      list$4({
        url: 'comedy-serial-all-svod',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('喜剧', 'six', 'comedy-serial-all-svod', json);
      }, status.error.bind(status));
      list$4({
        url: 'russian_tvseries',
        type: 'COLLECTION',
        page: 1
      }, function (json) {
        append('俄语', 'seven', 'russian_tvseries', json);
      }, status.error.bind(status));
    }
  }

  function full$3(params, oncomplite, onerror) {
    var data = {};
    network$8["native"](baseurl$2 + 'moviecard/web/1?elementAlias=' + params.url + '&elementType=MOVIE', function (json) {
      var element = json.element;

      if (element) {
        data.persons = persons$1(element);
        data.simular = similar$1(element);
        data.videos = videos$1(element);
        data.movie = {
          id: element.id,
          url: element.alias,
          source: 'okko',
          title: element.name,
          original_title: element.originalName,
          name: element.type == 'SERIAL' ? element.name : '',
          original_name: element.type == 'SERIAL' ? element.originalName : '',
          overview: element.description,
          img: img$2(element),
          runtime: (element.duration || 0) / 1000 / 60,
          genres: genres$2(element),
          vote_average: element.imdbRating || element.kinopoiskRating || 0,
          production_companies: [],
          production_countries: countries$1(element),
          budget: element.budget && element.budget.value ? element.budget.value : 0,
          release_date: date(element),
          number_of_seasons: seasonsCount$1(element).seasons,
          number_of_episodes: seasonsCount$1(element).episodes,
          seasons: seasonsDetails(element),
          first_air_date: element.type == 'SERIAL' ? date(element) : ''
        };
      }

      oncomplite(data);
    }, onerror);
  }

  var OKKO = {
    main: main$3,
    full: full$3,
    collections: collections$2,
    seasons: seasons$3,
    list: list$4,
    person: person$3,
    menu: menu$3,
    category: category$3,
    clear: network$8.clear
  };

  var baseurl$1 = 'https://api.ivi.ru/mobileapi/';
  var network$7 = new create$r();
  var menu_list = [];

  function tocard(element) {
    return {
      url: element.hru,
      id: element.id,
      title: element.title,
      original_title: element.orig_title,
      release_date: element.release_date || element.ivi_pseudo_release_date || element.ivi_release_date || (element.year ? element.year + '' : element.years ? element.years[0] + '' : '0000'),
      vote_average: element.ivi_rating_10 || 0,
      poster: img$1(element),
      year: element.year,
      years: element.years
    };
  }

  function entities(url, oncomplite, onerror) {
    network$7["native"]('https://www.ivi.ru/' + url, function (str) {
      var parse = str.match(/window.__INITIAL_STATE__ = JSON.parse\('(.*?)'\);<\/script>/);
      var decod = (parse ? parse[1] : '').replace(/\\'|[\\]+"/g, '\'');
      var json = Arrays.decodeJson(decod, {});

      if (json.entities) {
        if (!menu_list.length) {
          for (var i in json.entities.genres) {
            var item = json.entities.genres[i];
            menu_list.push({
              title: item.title + ' (' + item.catalogue_count + ')',
              id: item.id
            });
          }
        }

        oncomplite(json.entities, json);
      } else onerror();
    }, onerror, false, {
      dataType: 'text'
    });
  }

  function find(json, id) {
    var found;

    for (var i in json.content) {
      if (i == id) found = json.content[i];
    }

    return found;
  }

  function img$1(element) {
    return element.poster_originals && element.poster_originals[0] ? element.poster_originals[0].path + '/300x456/' : '';
  }

  function genres$1(element, json) {
    var data = [];
    element.genres.forEach(function (id) {
      var genre = json.genres[id];

      if (genre) {
        data.push({
          id: genre.id,
          name: genre.title
        });
      }
    });
    return data;
  }

  function countries(element, json) {
    var data = [];

    if (element.country && json.countries[element.country]) {
      data.push({
        name: json.countries[element.country].title
      });
    }

    return data;
  }

  function persons(json) {
    var data = [];

    if (json.persons && json.persons.info) {
      for (var i in json.persons.info) {
        var _person = json.persons.info[i],
            images = Arrays.getValues(_person.images || {});

        if (_person.profession_types[0] == 6) {
          data.push({
            name: _person.name,
            character: '演员',
            id: _person.id,
            img: images.length ? images[0].path : ''
          });
        }
      }
    }

    return data.length ? {
      cast: data
    } : false;
  }

  function similar(element, json) {
    var data = [];

    if (json.content) {
      for (var i in json.content) {
        var item = json.content[i];
        if (element !== item) data.push(tocard(item));
      }

      data.sort(function (a, b) {
        var ay = a.year || (a.years ? a.years[0] : 0);
        var by = b.year || (b.years ? b.years[0] : 0);
        return by - ay;
      });
    }

    return data.length ? {
      results: data
    } : false;
  }

  function videos(element) {
    var data = [];

    if (element.additional_data) {
      element.additional_data.forEach(function (atach) {
        if (atach.data_type == 'trailer' && atach.files) {
          atach.files.forEach(function (file) {
            if (file.content_format == 'MP4-HD1080') {
              data.push({
                name: atach.title,
                url: file.url,
                player: true
              });
            }
          });
        }
      });
    }

    return data.length ? {
      results: data
    } : false;
  }

  function seasonsCount(element) {
    var data = {
      seasons: 0,
      episodes: 0
    };

    if (element.seasons) {
      data.seasons = element.seasons.length;

      for (var i in element.seasons_content_total) {
        data.episodes += element.seasons_content_total[i];
      }
    }

    return data;
  }

  function seasons$2(tv, from, oncomplite, onerror) {
    var status = new status$1(from.length);
    status.onComplite = oncomplite;
    from.forEach(function (season) {
      network$7["native"](baseurl$1 + 'videofromcompilation/v5/?id=' + tv.id + '&season=' + season + '&from=0&to=60&fake=1&mark_as_purchased=1&app_version=870&session=66674cdb8528557407669760_1650471651-0EALRgbYRksN8Hfc5UthGeg', function (json) {
        if (json.result) {
          var episodes = [];
          json.result.forEach(function (elem) {
            episodes.push({
              name: elem.title,
              img: elem.promo_images && elem.promo_images.length ? elem.promo_images[0].url + '/300x240/' : '',
              air_date: elem.release_date || elem.ivi_pseudo_release_date || elem.ivi_release_date || (elem.year ? elem.year + '' : elem.years ? elem.years[0] + '' : '0000'),
              episode_number: elem.episode
            });
          });
          status.append('' + season, {
            episodes: episodes
          });
        } else status.error();
      }, status.error.bind(status));
    });
  }

  function comments(json) {
    var data = [];

    if (json.comments) {
      for (var i in json.comments) {
        var com = json.comments[i];
        com.text = com.text.replace(/\\[n|r|t]/g, '');
        data.push(com);
      }
    }

    return data.length ? data : false;
  }

  function menu$2(params, oncomplite) {
    if (!menu_list.length) {
      network$7.timeout(1000);
      entities('', function () {
        oncomplite(menu_list);
      });
    } else oncomplite(menu_list);
  }

  function full$2(params, oncomplite, onerror) {
    entities('watch/' + (params.url || params.id), function (json, all) {
      var data = {};
      var element = find(json, params.id);

      if (element) {
        data.persons = persons(json);
        data.simular = similar(element, json);
        data.videos = videos(element);
        data.comments = comments(json);
        data.movie = {
          id: element.id,
          url: element.hru,
          source: 'ivi',
          title: element.title,
          original_title: element.orig_title,
          name: element.seasons ? element.title : '',
          original_name: element.seasons ? element.orig_title : '',
          overview: element.description.replace(/\\[n|r|t]/g, ''),
          img: img$1(element),
          runtime: element.duration_minutes,
          genres: genres$1(element, json),
          vote_average: parseFloat(element.imdb_rating || element.kp_rating || '0'),
          production_companies: [],
          production_countries: countries(element, json),
          budget: element.budget || 0,
          release_date: element.release_date || element.ivi_pseudo_release_date || element.ivi_release_date || '0000',
          number_of_seasons: seasonsCount(element).seasons,
          number_of_episodes: seasonsCount(element).episodes,
          first_air_date: element.seasons ? element.release_date || element.ivi_pseudo_release_date || element.ivi_release_date || '0000' : ''
        };
      }

      oncomplite(data);
    }, onerror);
  }

  function person$2(params, oncomplite, onerror) {
    entities('person/' + (params.url || params.id), function (json, all) {
      var data = {};

      if (all.pages && all.pages.personPage) {
        var element = all.pages.personPage.person.info,
            images = Arrays.getValues(element.images || {});
        data.person = {
          name: element.name,
          biography: element.bio,
          img: images.length ? images[0].path : '',
          place_of_birth: element.eng_title,
          birthday: '----'
        };
        data.movie = similar(element, json);
      }

      oncomplite(data);
    }, onerror);
  }

  function list$3(params, oncomplite, onerror) {
    var fr = 20 * (params.page - 1),
        to = fr + 19;
    var url = baseurl$1 + 'catalogue/v5/?genre=' + params.genres + '&from=' + fr + '&to=' + to + '&withpreorderable=true';
    if (!params.genres) url = baseurl$1 + 'collection/catalog/v5/?id=' + params.url + '&withpreorderable=true&fake=false&from=' + fr + '&to=' + to + '&sort=priority_in_collection&fields=id%2Civi_pseudo_release_date%2Corig_title%2Ctitle%2Cfake%2Cpreorderable%2Cavailable_in_countries%2Chru%2Cposter_originals%2Crating%2Ccontent_paid_types%2Ccompilation_hru%2Ckind%2Cadditional_data%2Crestrict%2Chd_available%2Chd_available_all%2C3d_available%2C3d_available_all%2Cuhd_available%2Cuhd_available_all%2Chdr10_available%2Chdr10_available_all%2Cdv_available%2Cdv_available_all%2Cfullhd_available%2Cfullhd_available_all%2Chdr10plus_available%2Chdr10plus_available_all%2Chas_5_1%2Cshields%2Cseasons_count%2Cseasons_content_total%2Cseasons%2Cepisodes%2Cseasons_description%2Civi_rating_10_count%2Cseasons_extra_info%2Ccount%2Cgenres%2Cyears%2Civi_rating_10%2Crating%2Ccountry%2Cduration_minutes%2Cyear&app_version=870';
    network$7["native"](url, function (json) {
      var items = [];

      if (json.result) {
        json.result.forEach(function (element) {
          items.push(tocard(element));
        });
      }

      oncomplite({
        results: items,
        total_pages: Math.round(json.count / 20)
      });
    }, onerror);
  }

  function category$2(params, oncomplite, onerror) {
    var status = new status$1(params.url == 'movie' ? 4 : 5);

    status.onComplite = function () {
      var fulldata = [];
      if (status.data["new"] && status.data["new"].results.length) fulldata.push(status.data["new"]);
      if (status.data.best && status.data.best.results.length) fulldata.push(status.data.best);
      if (status.data.rus && status.data.rus.results.length) fulldata.push(status.data.rus);
      if (status.data.popular && status.data.popular.results.length) fulldata.push(status.data.popular);
      if (status.data.ivi && status.data.ivi.results.length) fulldata.push(status.data.ivi);
      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, id, json) {
      json.title = title;
      json.url = id;
      status.append(name, json);
    };

    if (params.url == 'movie') {
      collections$1({
        id: '8258'
      }, function (json) {
        append('电影首映', 'new', '8258', {
          results: json
        });
      });
      collections$1({
        id: '942'
      }, function (json) {
        append('最佳电影', 'best', '942', {
          results: json
        });
      });
      collections$1({
        id: '11512'
      }, function (json) {
        append('Top now', 'popular', '11512', {
          results: json
        });
      });
      collections$1({
        id: '8448'
      }, function (json) {
        append('选择 ivi', 'ivi', '8448', {
          results: json
        });
      });
    } else {
      collections$1({
        id: '1984'
      }, function (json) {
        append('新', 'new', '1984', {
          results: json
        });
      });
      collections$1({
        id: '1712'
      }, function (json) {
        append('Foreign', 'best', '1712', {
          results: json
        });
      });
      collections$1({
        id: '935'
      }, function (json) {
        append('俄语', 'rus', '935', {
          results: json
        });
      });
      collections$1({
        id: '12839'
      }, function (json) {
        append('Hot now', 'popular', '12839', {
          results: json
        });
      });
      collections$1({
        id: '1057'
      }, function (json) {
        append('选择 ivi', 'ivi', '1057', {
          results: json
        });
      });
    }
  }

  function main$2(params, oncomplite, onerror) {
    var status = new status$1(13);

    status.onComplite = function () {
      var fulldata = [];

      for (var i = 1; i <= 13; i++) {
        var n = i + '';
        if (status.data[n] && status.data[n].results.length) fulldata.push(status.data[n]);
      }

      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, id, json) {
      json.title = title;
      json.url = id;
      status.append(name, json);
    };

    collections$1({
      id: '4655'
    }, function (json) {
      append('我们建议你看', '1', '4655', {
        results: json
      });
    });
    collections$1({
      id: '2460'
    }, function (json) {
      append('全家卡通', '2', '2460', {
        results: json
      });
    });
    collections$1({
      id: '917'
    }, function (json) {
      append('恐怖惊悚片', '3', '917', {
        results: json
      });
    });
    collections$1({
      id: '1327'
    }, function (json) {
      append('冒险喜剧', '4', '1327', {
        results: json
      });
    });
    collections$1({
      id: '1246'
    }, function (json) {
      append('侦探改编', '5', '1246', {
        results: json
      });
    });
    collections$1({
      id: '1335'
    }, function (json) {
      append('犯罪喜剧', '6', '1335', {
        results: json
      });
    });
    collections$1({
      id: '1411'
    }, function (json) {
      append('浪漫剧', '7', '1411', {
        results: json
      });
    });
    collections$1({
      id: '73'
    }, function (json) {
      append('犯罪剧', '8', '73', {
        results: json
      });
    });
    collections$1({
      id: '1413'
    }, function (json) {
      append('奇幻剧', '9', '1413', {
        results: json
      });
    });
    collections$1({
      id: '62'
    }, function (json) {
      append('战争剧', '10', '62', {
        results: json
      });
    });
    collections$1({
      id: '1418'
    }, function (json) {
      append('神秘电影', '11', '1418', {
        results: json
      });
    });
    collections$1({
      id: '4495'
    }, function (json) {
      append('外国电视剧', '12', '4495', {
        results: json
      });
    });
    collections$1({
      id: '217'
    }, function (json) {
      append('历史电视剧', '13', '217', {
        results: json
      });
    });
  }

  function collections$1(params, oncomplite, onerror) {
    var fr = 20 * (params.page - 1),
        to = fr + 19;
    var uri = baseurl$1 + 'collections/v5/?app_version=870&from=' + fr + '&tags_exclude=goodmovies&to=' + to;
    if (params.id) uri = baseurl$1 + 'collection/catalog/v5/?id=' + params.id + '&withpreorderable=true&fake=false&from=' + fr + '&to=' + to + '&sort=priority_in_collection&fields=id%2Civi_pseudo_release_date%2Corig_title%2Ctitle%2Cfake%2Cpreorderable%2Cavailable_in_countries%2Chru%2Cposter_originals%2Crating%2Ccontent_paid_types%2Ccompilation_hru%2Ckind%2Cadditional_data%2Crestrict%2Chd_available%2Chd_available_all%2C3d_available%2C3d_available_all%2Cuhd_available%2Cuhd_available_all%2Chdr10_available%2Chdr10_available_all%2Cdv_available%2Cdv_available_all%2Cfullhd_available%2Cfullhd_available_all%2Chdr10plus_available%2Chdr10plus_available_all%2Chas_5_1%2Cshields%2Cseasons_count%2Cseasons_content_total%2Cseasons%2Cepisodes%2Cseasons_description%2Civi_rating_10_count%2Cseasons_extra_info%2Ccount%2Cgenres%2Cyears%2Civi_rating_10%2Crating%2Ccountry%2Cduration_minutes%2Cyear&app_version=870';
    network$7["native"](uri, function (json) {
      var items = [];

      if (json.result) {
        json.result.forEach(function (element) {
          var item = {
            id: element.id,
            url: element.hru,
            title: element.title,
            poster: element.images && element.images.length ? element.images[0].path : 'https://www.ivi.ru/images/stubs/collection_preview_stub.jpeg'
          };
          if (params.id) item = tocard(element);
          items.push(item);
        });
      }

      oncomplite(items);
    }, onerror);
  }

  var IVI = {
    collections: collections$1,
    full: full$2,
    main: main$2,
    person: person$2,
    list: list$3,
    category: category$2,
    menu: menu$2,
    seasons: seasons$2,
    clear: network$7.clear
  };

  var baseurl = Utils.protocol() + 'tmdb.cub.watch/';
  var network$6 = new create$r();

  function url$4(u) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (params.genres) u = add$5(u, 'genre=' + params.genres);
    if (params.page) u = add$5(u, 'page=' + params.page);
    if (params.query) u = add$5(u, 'query=' + params.query);

    if (params.filter) {
      for (var i in params.filter) {
        u = add$5(u, i + '=' + params.filter[i]);
      }
    }

    return baseurl + u;
  }

  function add$5(u, params) {
    return u + (/\?/.test(u) ? '&' : '?') + params;
  }

  function get$5(method) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
    var onerror = arguments.length > 3 ? arguments[3] : undefined;
    var u = url$4(method, params);
    network$6.silent(u, function (json) {
      json.url = method;
      oncomplite(json);
    }, onerror);
  }

  function list$2() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var u = url$4(params.url, params);
    network$6.silent(u, oncomplite, onerror);
  }

  function main$1() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var status = new status$1(11);

    status.onComplite = function () {
      var fulldata = [];
      var data = status.data;

      for (var i = 1; i <= 11; i++) {
        var ipx = 's' + i;
        if (data[ipx] && data[ipx].results.length) fulldata.push(data[ipx]);
      }

      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, json) {
      json.title = title;
      status.append(name, json);
    };

    get$5('?sort=now_playing ', params, function (json) {
      append('正在观看', 's1', json);
    }, status.error.bind(status));
    get$5('?sort=latest', params, function (json) {
      append('最后添加', 's2', json);
    }, status.error.bind(status));
    get$5('movie/now', params, function (json) {
      append('电影', 's3', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=16', params, function (json) {
      append('动画', 's4', json);
    }, status.error.bind(status));
    get$5('tv/now', params, function (json) {
      append('电视节目', 's5', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=12', params, function (json) {
      append('冒险', 's6', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=35', params, function (json) {
      append('喜剧', 's7', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=10751', params, function (json) {
      append('家庭', 's8', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=27', params, function (json) {
      append('恐怖', 's9', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=878', params, function (json) {
      append('奇幻', 's10', json);
    }, status.error.bind(status));
    get$5('?sort=now&genre=53', params, function (json) {
      append('惊悚片', 's11', json);
    }, status.error.bind(status));
  }

  function category$1() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var total = 6;
    if (params.url !== 'tv') total--;
    var status = new status$1(total);

    status.onComplite = function () {
      var fulldata = [];
      var data = status.data;

      for (var i = 1; i <= total + 1; i++) {
        var ipx = 's' + i;
        if (data[ipx] && data[ipx].results.length) fulldata.push(data[ipx]);
      }

      if (fulldata.length) oncomplite(fulldata);else onerror();
    };

    var append = function append(title, name, json) {
      json.title = title;
      status.append(name, json);
    };

    get$5('?cat=' + params.url + '&sort=now_playing', params, function (json) {
      append('现在看', 's1', json);
    }, status.error.bind(status));

    if (params.url == 'tv') {
      get$5('?cat=' + params.url + '&sort=update', params, function (json) {
        append('新剧集', 's2', json);
      }, status.error.bind(status));
    }

    get$5('?cat=' + params.url + '&sort=top', params, function (json) {
      append('精选', 's3', json);
    }, status.error.bind(status));
    get$5('?cat=' + params.url + '&sort=latest', params, function (json) {
      append('最新添加', 's4', json);
    }, status.error.bind(status));
    get$5('?cat=' + params.url + '&sort=now', params, function (json) {
      append('今年新', 's5', json);
    }, status.error.bind(status));
    get$5('?cat=' + params.url + '&sort=latest&vote=7', params, function (json) {
      append('高度评价', 's6', json);
    }, status.error.bind(status));
  }

  function full$1(params, oncomplite, onerror) {
    var status = new status$1(5);
    status.onComplite = oncomplite;
    get$5('3/' + params.method + '/' + params.id + '?api_key=4ef0d7355d9ffb5151e987764708ce96&language=' + Storage.field('tmdb_lang'), params, function (json) {
      json.source = 'tmdb';
      status.append('movie', json);
    }, status.error.bind(status));
    TMDB.get(params.method + '/' + params.id + '/credits', params, function (json) {
      status.append('persons', json);
    }, status.error.bind(status));
    TMDB.get(params.method + '/' + params.id + '/recommendations', params, function (json) {
      status.append('recomend', json);
    }, status.error.bind(status));
    TMDB.get(params.method + '/' + params.id + '/similar', params, function (json) {
      status.append('simular', json);
    }, status.error.bind(status));
    TMDB.get(params.method + '/' + params.id + '/videos', params, function (json) {
      status.append('videos', json);
    }, status.error.bind(status));
  }

  function person$1(params, oncomplite, onerror) {
    TMDB.person(params, oncomplite, onerror);
  }

  function menu$1(params, oncomplite) {
    TMDB.menu(params, oncomplite);
  }

  function seasons$1(tv, from, oncomplite) {
    TMDB.seasons(tv, from, oncomplite);
  }

  function clear$4() {
    network$6.clear();
  }

  var CUB = {
    main: main$1,
    menu: menu$1,
    full: full$1,
    list: list$2,
    category: category$1,
    clear: clear$4,
    person: person$1,
    seasons: seasons$1
  };

    //yyds
    var baseurlyyds = 'https://cmn.yyds.fans/';
    var network$6 = new create$r();

    function yydsurl$4(u) {
      //console.log(u);
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      //console.log(params);
      if (params.genres) u = yydsadd$5(u, 'genre=' + params.genres);
      if (params.page) u = yydsadd$5(u, 'page=' + params.page);
      if (params.query) u = yydsadd$5(u, 'query=' + params.query);

      if (params.filter) {
        for (var i in params.filter) {
          u = yydsadd$5(u, i + '=' + params.filter[i]);
        }
      }

      return baseurlyyds + u;
    }

    function yydsadd$5(u, params) {
      return u + (/\?/.test(u) ? '&' : '?') + params;
    }

    function yydsget$5(method) {
      var my_method = method.split('|');
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      //console.log(params);
      var u = yydsurl$4(my_method[0], params);
      network$6.silent(u, function (json) {
        json.url = my_method[0];
        var parsed = JSON.parse(JSON.stringify(json).replace('data','results').replace(/cover/g,'poster').replace(/l_ratio_poster/g,'s_ratio_poster').replace(/score/g,'vote_average').replace(/release_time/g,'release_date').replace(/subtitle/g,'original_name'));  
        //console.log(parsed);
        oncomplite(parsed);
      }, onerror, my_method[1]);
      
    }

    function yydslist$2() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var fr = 30 * (params.page - 1);
      var u = yydsurl$4('api/posts');
      console.log(u);
      network$6.silent(u, function (json) {
        var parsed = JSON.parse(JSON.stringify(json).replace('data','results').replace(/cover/g,'poster').replace(/l_ratio_poster/g,'s_ratio_poster').replace(/score/g,'vote_average').replace(/release_time/g,'release_date')); 
        oncomplite(parsed);
      }, onerror, params.url.replace('api/posts?','')+'&skip='+fr);
      //network$6.silent(u, oncomplite, onerror,params.url.replace('api/posts?',''));
    }

    function yydsmain$2() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var status = new status$1(12);

      status.onComplite = function () {
        var fulldata = [];
        var data = status.data;

        for (var i = 1; i <= 12; i++) {
          var ipx = 's' + i;
          if (data[ipx] && data[ipx].results.length) fulldata.push(data[ipx]);
        }

        if (fulldata.length) oncomplite(fulldata);else onerror();
      };

      var append = function append(title, name, json) {
        json.title = title;
        status.append(name, json);
      };

      yydsget$5('api/posts?category_id=-1&limit=100&keyword=|category_id=-1&skip=0&limit=20&keyword=', params, function (json) {
        append('最新更新', 's1', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=0&skip=0&limit=100&keyword=|category_id=0&skip=0&limit=20&keyword=', params, function (json) {
        append('热门精选', 's2', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=3&skip=0&limit=100&keyword=|category_id=3&skip=0&limit=20&keyword=', params, function (json) {
        append('电影', 's3', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=12&skip=0&limit=100&keyword=|category_id=12&skip=0&limit=20&keyword=', params, function (json) {
        append('剧集', 's4', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=4&skip=0&limit=100&keyword=|category_id=4&skip=0&limit=20&keyword=', params, function (json) {
        append('动画', 's5', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=10&skip=0&limit=100&keyword=|category_id=10&skip=0&limit=20&keyword=', params, function (json) {
        append('综艺', 's6', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=1&skip=0&limit=100&keyword=|category_id=1&skip=0&limit=20&keyword=', params, function (json) {
        append('纪录片', 's7', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=13&skip=0&limit=100&keyword=|category_id=13&skip=0&limit=20&keyword=', params, function (json) {
        append('日韩剧', 's8', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=5&skip=0&limit=100&keyword=|category_id=5&skip=0&limit=20&keyword=', params, function (json) {
        append('英美剧', 's9', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?category_id=7&skip=0&limit=100&keyword=|category_id=7&skip=0&limit=10&keyword=', params, function (json) {
        append('恐怖', 's10', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?ategory_id=8&skip=0&limit=100&keyword=|category_id=8&skip=0&limit=10&keyword=', params, function (json) {
        append('威漫', 's11', json);
      }, status.error.bind(status));
      yydsget$5('api/posts?ategory_id=9&skip=0&limit=100&keyword=|category_id=9&skip=0&limit=10&keyword=', params, function (json) {
        append('DC', 's12', json);
      }, status.error.bind(status));
    }

    function yydscategory$1() {
      
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;

      var total = 6;
      if (params.url !== 'tv') total--;
      var status = new status$1(total);

      status.onComplite = function () {
        var fulldata = [];
        var data = status.data;

        for (var i = 1; i <= total + 1; i++) {
          var ipx = 's' + i;
          if (data[ipx] && data[ipx].results.length) fulldata.push(data[ipx]);
        }

        if (fulldata.length) oncomplite(fulldata);else onerror();
      };

      var append = function append(title, name, json) {
        json.title = title;
        status.append(name, json);
      };

      yydsget$5('?cat=' + params.url + '&sort=now_playing', params, function (json) {
        append('正在观看', 's1', json);
      }, status.error.bind(status));

      if (params.url == 'tv') {
        yydsget$5('api/posts?category_id=12&skip=0&limit=100&keyword=|category_id=12&skip=0&limit=20&keyword=', params, function (json) {
          append('新电视剧', 's2', json);
        }, status.error.bind(status));
      }

      //if (params.url == 'movie') {
        yydsget$5('api/posts?category_id=3&skip=0&limit=100&keyword=|category_id=3&skip=0&limit=20&keyword=', params, function (json) {
          append('新电影', 's3', json);
        }, status.error.bind(status));
      //}

      /* yydsget$5('?cat=' + params.url + '&sort=top', params, function (json) {
        append('流行', 's3', json);
      }, status.error.bind(status)); */
      yydsget$5('?cat=' + params.url + '&sort=latest', params, function (json) {
        append('最新添加', 's4', json);
      }, status.error.bind(status));
      yydsget$5('?cat=' + params.url + '&sort=now', params, function (json) {
        append('今年新的', 's5', json);
      }, status.error.bind(status));
      yydsget$5('?cat=' + params.url + '&sort=latest&vote=7', params, function (json) {
        append('最受好评', 's6', json);
      }, status.error.bind(status));
    }

    function yydsfull1$(params, oncomplite, onerror) {
        yydsget$5('api/post-info|id='+params.id+'', params, function (json) {
        if (json.status_code === 200) {
          //console.log(json.results);
          data.movie = {
            id: json.results.id,
            yydsid: json.results.id,
            url: '',
            source: 'yyds',
            title: json.results.title,
            original_title: json.results.also_called,
            name: json.results.season ? json.results.title : '',
            original_name: json.results.season ? json.results.title : '',
            overview: json.results.desc,
            img: json.results.poster.replace('l_ratio_poster','s_ratio_poster'),
            runtime: json.results.duration_minutes,
            genres: yydsgenres$1(json.results.tags),
            vote_average: json.results.vote_average ? parseFloat(json.results.vote_average) : 0,
            production_companies: [],
            production_countries: [{name : json.results.region}],
            budget: 0,
            release_date: json.results.created_at,
            number_of_seasons: json.results.season ? json.results.season : 1,
            number_of_episodes: json.results.episode ? json.results.episode : 1,
            first_air_date: json.results.created_at
          };
        }else{
          onerror();
          Noty.show('当前内容仅限YYDS会员访问');
        };
        //console.log(data.movie)
        oncomplite(data);
      }, onerror);
    }

    function yydsgenres$1(json) {
      var data = [];
      json.forEach(function (d) {
        var genre = d.id;
        if (genre) {
          data.push({
            id: d.id,
            name: d.title
          });
        }
      });
      return data;
    }

    function yydsperson$1(params, oncomplite, onerror) {
      TMDB.person(params, oncomplite, onerror);
    }

    function yydsmenu$1(params, oncomplite) {
      //TMDB.menu(params, oncomplite);
    }

    function yydsseasons$1(tv, from, oncomplite) {
      TMDB.seasons(tv, from, oncomplite);
    }

    function yydsclear$4() {
      network$6.clear();
    }

    var YYDS = {
      main: yydsmain$2,
      menu: yydsmenu$1,
      full: yydsfull1$,
      list: yydslist$2,
      category: yydscategory$1,
      clear: yydsclear$4,
      person: yydsperson$1,
      seasons: yydsseasons$1
    };
    //yyds

  var url$3;
  var network$5 = new create$r();

  function get$4() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;

    if (Storage.field('parser_torrent_type') == 'jackett') {
      if (Storage.field('jackett_url')) {
        url$3 = Utils.checkHttp(Storage.field('jackett_url'));
        jackett(params, oncomplite, onerror);
      } else {
        onerror('提供解析链接 Jackett');
      }
    } else {
      if (Storage.get('native')) {
        torlook(params, oncomplite, onerror);
      } else if (Storage.field('torlook_parse_type') == 'site' && Storage.field('parser_website_url')) {
        url$3 = Utils.checkHttp(Storage.field('parser_website_url'));
        torlook(params, oncomplite, onerror);
      } else if (Storage.field('torlook_parse_type') == 'native') {
        torlook(params, oncomplite, onerror);
      } else onerror('提供解析链接 TorLook');
    }
  }

  function viewed(hash) {
    var view = Storage.cache('torrents_view', 5000, []);
    return view.indexOf(hash) > -1;
  }

  function torlook() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    network$5.timeout(1000 * 60);
    var s = Utils.checkHttp(Storage.field('torlook_site')) + '/';
    var u = Storage.get('native') || Storage.field('torlook_parse_type') == 'native' ? s + encodeURIComponent(params.search) : url$3.replace('{q}', encodeURIComponent(s + encodeURIComponent(params.search)));
    network$5["native"](u + '?forced=1', function (str) {
      var math = str.replace(/\n|\r/g, '').match(new RegExp('<div class="webResult item">(.*?)<\/div>', 'g'));
      var data = {
        Results: []
      };
      $.each(math, function (i, a) {
        a = a.replace(/<img[^>]+>/g, '');
        var element = $(a + '</div>'),
            item = {};
        item.Title = $('>p>a', element).text();
        item.Tracker = $('.h2 > a', element).text();
        item.size = $('.size', element).text();
        item.Size = Utils.sizeToBytes(item.size);
        item.PublishDate = $('.date', element).text() + 'T22:00:00';
        item.Seeders = parseInt($('.seeders', element).text());
        item.Peers = parseInt($('.leechers', element).text());
        item.reguest = $('.magneto', element).attr('data-src');
        item.PublisTime = Utils.strToTime(item.PublishDate);
        item.hash = Utils.hash(item.Title);
        item.viewed = viewed(item.hash);
        element.remove();
        if (item.Title && item.reguest) data.Results.push(item);
      });
      oncomplite(data);
    }, function (a, c) {
      onerror(network$5.errorDecode(a, c));
    }, false, {
      dataType: 'text'
    });
  }

  function jackett() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    network$5.timeout(1000 * 15);
    var u = url$3 + '/api/v2.0/indexers/all/results?apikey=' + Storage.field('jackett_key') + '&Query=' + encodeURIComponent(params.search);
    var genres = params.movie.genres.map(function (a) {
      return a.name;
    });

    if (!params.clarification) {
      u = Utils.addUrlComponent(u, 'title=' + encodeURIComponent(params.movie.title));
      u = Utils.addUrlComponent(u, 'title_original=' + encodeURIComponent(params.movie.original_title));
    }

    u = Utils.addUrlComponent(u, 'year=' + encodeURIComponent(((params.movie.release_date || params.movie.first_air_date || '0000') + '').slice(0, 4)));
    u = Utils.addUrlComponent(u, 'is_serial=' + (params.movie.first_air_date || params.movie.last_air_date ? '2' : params.other ? '0' : '1'));
    u = Utils.addUrlComponent(u, 'genres=' + encodeURIComponent(genres.join(',')));
    u = Utils.addUrlComponent(u, 'Category[]=' + (params.movie.number_of_seasons > 0 ? 5000 : 2000));
    network$5["native"](u, function (json) {
      json.Results.forEach(function (element) {
        element.PublisTime = Utils.strToTime(element.PublishDate);
        element.hash = Utils.hash(element.Title);
        element.viewed = viewed(element.hash);
        element.size = Utils.bytesToSize(element.Size);
      });
      oncomplite(json);
    }, function (a, c) {
      onerror(network$5.errorDecode(a, c));
    });
  }

  function marnet(element, oncomplite, onerror) {
    network$5.timeout(1000 * 15);
    var s = Utils.checkHttp(Storage.field('torlook_site')) + '/';
    var u = Storage.get('native') || Storage.field('torlook_parse_type') == 'native' ? s + element.reguest : url$3.replace('{q}', encodeURIComponent(s + element.reguest));
    network$5["native"](u, function (html) {
      var math = html.match(/magnet:(.*?)'/);

      if (math && math[1]) {
        element.MagnetUri = 'magnet:' + math[1];
        oncomplite();
      } else {
        onerror('获取磁力链接失败');
      }
    }, function (a, c) {
      onerror(network$5.errorDecode(a, c));
    }, false, {
      dataType: 'text'
    });
  }

  function clear$3() {
    network$5.clear();
  }

  var Parser = {
    get: get$4,
    torlook: torlook,
    jackett: jackett,
    marnet: marnet,
    clear: clear$3
  };

  var sources = {
    ivi: IVI,
    okko: OKKO,
    tmdb: TMDB,
      yyds: YYDS,
    cub: CUB
  };
  var network$4 = new create$r();

  function source(params) {
    return params.source ? sources[params.source] : sources.tmdb;
  }

  function main() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    source(params).main(params, oncomplite, onerror);
  }

  function category() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    source(params).category(params, oncomplite, onerror);
  }

  function full() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    source(params).full(params, oncomplite, onerror);
  }

  function search$1() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var status = new status$1(Storage.field('parser_use') ? 3 : 2);
    status.onComplite = oncomplite;
    TMDB.search(params, function (json) {
      if (json.movie) status.append('movie', json.movie);
      if (json.tv) status.append('tv', json.tv);
    }, status.error.bind(status));

    if (Storage.field('parser_use')) {
      Parser.get({
        search: decodeURIComponent(params.query),
        other: true,
        movie: {
          genres: [],
          title: decodeURIComponent(params.query),
          original_title: decodeURIComponent(params.query),
          number_of_seasons: 0
        }
      }, function (json) {
        json.title = '种子';
        json.results = json.Results.slice(0, 20);
        json.Results = null;
        json.results.forEach(function (element) {
          element.Title = Utils.shortText(element.Title, 110);
        });
        status.append('parser', json);
      }, status.error.bind(status));
    }
  }

  function person() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    source(params).person(params, oncomplite, onerror);
  }

  function genres() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    TMDB.genres(params, oncomplite, onerror);
  }

  function company() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    TMDB.company(params, oncomplite, onerror);
  }

  function list$1() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    source(params).list(params, oncomplite, onerror);
  }

  function menu() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    source(params).menu(params, oncomplite);
  }

  function seasons(tv, from, oncomplite) {
    source(tv).seasons(tv, from, oncomplite);
  }

  function collections(params, oncomplite, onerror) {
    source(params).collections(params, oncomplite, onerror);
  }

  function favorite() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
    var onerror = arguments.length > 2 ? arguments[2] : undefined;
    var data = {};
    data.results = Favorite.get(params);
    data.total_pages = Math.ceil(data.results.length / 20);
    data.page = Math.min(params.page, data.total_pages);
    var offset = data.page - 1;
    data.results = data.results.slice(20 * offset, 20 * offset + 20);
    if (data.results.length) oncomplite(data);else onerror();
  }

  function relise(oncomplite, onerror) {
    network$4.silent(Utils.protocol() + 'tmdb.cub.watch?sort=releases&results=200', function (json) {
      json.results.forEach(function (item) {
        item.tmdbID = item.id;
      });
      oncomplite(json.results);
    }, onerror);
  }

  function clear$2() {
    TMDB.clear();
    OKKO.clear();
    IVI.clear();
    network$4.clear();
  }

  var Api = {
    main: main,
    img: TMDB.img,
    full: full,
    list: list$1,
    genres: genres,
    category: category,
    search: search$1,
    clear: clear$2,
    company: company,
    person: person,
    favorite: favorite,
    seasons: seasons,
    screensavers: TMDB.screensavers,
    relise: relise,
    menu: menu,
    collections: collections
  };

  function create$o(data) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Arrays.extend(data, {
      title: data.name,
      original_title: data.original_name,
      release_date: data.first_air_date
    });
    data.release_year = ((data.release_date || '0000') + '').slice(0, 4);
    var card = Template.get(params.isparser ? 'card_parser' : 'card', data);
    var img = card.find('img')[0] || {};

    if (data.first_air_date) {
      card.append('<div class="card__type"></div>');
      card.find('.card__type').text(data.first_air_date ? 'TV' : 'MOV');
      card.addClass(data.first_air_date ? 'card--tv' : 'card--movie');
    }

    if (params.card_small) {
      card.addClass('card--small');
      card.find('.card__title').remove();
      card.find('.card__age').remove();
    }

    if (params.card_category) {
      card.addClass('card--category');
      card.find('.card__age').remove();
    }

    if (params.card_collection) {
      card.addClass('card--collection');
      card.find('.card__age').remove();
    }

    if (params.card_wide) {
      card.addClass('card--wide');
      data.poster = data.cover;
      if (data.promo) card.append('<div class="card__promo"><div class="card__promo-text">' + data.promo + '</div></div>');
      card.find('.card__age').remove();
    }

    if (data.release_year == '0000') {
      card.find('.card__age').remove();
    }

    this.image = function () {
      img.onload = function () {
        card.addClass('card--loaded');
      };

      img.onerror = function (e) {
        img.src = './img/img_broken.svg';
      };
    };

    this.addicon = function (name) {
      card.find('.card__icons-inner').append('<div class="card__icon icon--' + name + '"></div>');
    };

    this.favorite = function () {
      var status = Favorite.check(data);
      card.find('.card__icon').remove();
      if (status.book) this.addicon('book');
      if (status.like) this.addicon('like');
      if (status.wath) this.addicon('wath');
    };

    this.onMenu = function (target, data) {
      var _this = this;

      var enabled = Controller.enabled().name;
      var status = Favorite.check(data);
      Select.show({
        title: '操作',
        items: [{
          title: status.book ? '不喜欢' : '书签',
          subtitle: '查看菜单（书签）',
          where: 'book'
        }, {
          title: status.like ? '不喜欢' : '喜欢',
          subtitle: '查看菜单（喜欢）',
          where: 'like'
        }, {
          title: status.wath ? '从预期中删除' : '稍后观看',
          subtitle: '查看菜单（稍后）',
          where: 'wath'
        }],
        onBack: function onBack() {
          Controller.toggle(enabled);
        },
        onSelect: function onSelect(a) {
          if (params.object) data.source = params.object.source;
          Favorite.toggle(a.where, data);

          _this.favorite();

          Controller.toggle(enabled);
        }
      });
    };

    this.create = function () {
      var _this2 = this;

      this.favorite();
      card.on('hover:focus', function (e) {
        _this2.onFocus(e.target, data);
      }).on('hover:enter', function (e) {
        _this2.onEnter(e.target, data);
      }).on('hover:long', function (e) {
        _this2.onMenu(e.target, data);
      });
      this.image();
    };

    this.visible = function () {
      if (this.visibled) return;
      if (data.poster_path) img.src = Api.img(data.poster_path);else if (data.poster) img.src = data.poster;else if (data.img) img.src = data.img;else img.src = './img/img_broken.svg';
      this.visibled = true;
    };

    this.destroy = function () {
      img.onerror = function () {};

      img.onload = function () {};

      img.src = '';
      card.remove();
      card = null;
      img = null;
    };

    this.render = function () {
      return card;
    };
  }

  function init$d() {
    $(window).on('resize', update$6);
    toggleClasses();
    Storage.listener.follow('change', function (event) {
      if (event.name == 'interface_size') update$6();
      if (event.name == 'animation' || event.name == 'mask') toggleClasses();
    });
  }

  function size$1() {
    var sl = Storage.field('interface_size');
    var sz = {
      normal: 1,
      small: 0.9,
      bigger: 1.1
    };
    var fs = sz[sl];
    $('body').css({
      fontSize: Math.max(window.innerWidth / 84.17 * fs, 10.6) + 'px'
    }).removeClass('size--small size--normal size--bigger').addClass('size--' + sl);
  }

  function update$6() {
    size$1();
    $('.layer--width').css('width', window.innerWidth);
    $('.layer--height').css('height', window.innerHeight);
    var head = $('.head')[0].getBoundingClientRect();
    $('.layer--wheight').each(function () {
      var elem = $(this),
          heig = window.innerHeight - head.height;

      if (elem.data('mheight')) {
        heig -= elem.data('mheight')[0].getBoundingClientRect().height;
      }

      elem.css('height', heig);
    });
  }

  function toggleClasses() {
    $('body').toggleClass('no--animation', !Storage.field('animation'));
    $('body').toggleClass('no--mask', !Storage.field('mask'));
  }

  var Layer = {
    update: update$6,
    init: init$d
  };

  /* eslint-disable no-bitwise -- used for calculations */

  /* eslint-disable unicorn/prefer-query-selector -- aiming at
    backward-compatibility */

  /**
  * StackBlur - a fast almost Gaussian Blur For Canvas
  *
  * In case you find this class useful - especially in commercial projects -
  * I am not totally unhappy for a small donation to my PayPal account
  * mario@quasimondo.de
  *
  * Or support me on flattr:
  * {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}.
  *
  * @module StackBlur
  * @author Mario Klingemann
  * Contact: mario@quasimondo.com
  * Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
  * Twitter: @quasimondo
  *
  * @copyright (c) 2010 Mario Klingemann
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  */
  var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
  var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
  /**
   * @param {string|HTMLImageElement} img
   * @param {string|HTMLCanvasElement} canvas
   * @param {Float} radius
   * @param {boolean} blurAlphaChannel
   * @param {boolean} useOffset
   * @param {boolean} skipStyles
   * @returns {undefined}
   */

  function processImage(img, canvas, radius, blurAlphaChannel, useOffset, skipStyles) {
    if (typeof img === 'string') {
      img = document.getElementById(img);
    }

    if (!img || !('naturalWidth' in img)) {
      return;
    }

    var dimensionType = useOffset ? 'offset' : 'natural';
    var w = img[dimensionType + 'Width'];
    var h = img[dimensionType + 'Height'];

    if (typeof canvas === 'string') {
      canvas = document.getElementById(canvas);
    }

    if (!canvas || !('getContext' in canvas)) {
      return;
    }

    if (!skipStyles) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    canvas.width = w;
    canvas.height = h;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, w, h);
    context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);

    if (isNaN(radius) || radius < 1) {
      return;
    }

    if (blurAlphaChannel) {
      processCanvasRGBA(canvas, 0, 0, w, h, radius);
    } else {
      processCanvasRGB(canvas, 0, 0, w, h, radius);
    }
  }
  /**
   * @param {string|HTMLCanvasElement} canvas
   * @param {Integer} topX
   * @param {Integer} topY
   * @param {Integer} width
   * @param {Integer} height
   * @throws {Error|TypeError}
   * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
   */


  function getImageDataFromCanvas(canvas, topX, topY, width, height) {
    if (typeof canvas === 'string') {
      canvas = document.getElementById(canvas);
    }

    if (!canvas || _typeof(canvas) !== 'object' || !('getContext' in canvas)) {
      throw new TypeError('Expecting canvas with `getContext` method ' + 'in processCanvasRGB(A) calls!');
    }

    var context = canvas.getContext('2d');

    try {
      return context.getImageData(topX, topY, width, height);
    } catch (e) {
      throw new Error('unable to access image data: ' + e);
    }
  }
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Integer} topX
   * @param {Integer} topY
   * @param {Integer} width
   * @param {Integer} height
   * @param {Float} radius
   * @returns {undefined}
   */


  function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
    if (isNaN(radius) || radius < 1) {
      return;
    }

    radius |= 0;
    var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
    imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
    canvas.getContext('2d').putImageData(imageData, topX, topY);
  }
  /**
   * @param {ImageData} imageData
   * @param {Integer} topX
   * @param {Integer} topY
   * @param {Integer} width
   * @param {Integer} height
   * @param {Float} radius
   * @returns {ImageData}
   */


  function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
    var pixels = imageData.data;
    var div = 2 * radius + 1; // const w4 = width << 2;

    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackEnd;

    for (var i = 1; i < div; i++) {
      stack = stack.next = new BlurStack();

      if (i === radiusPlus1) {
        stackEnd = stack;
      }
    }

    stack.next = stackStart;
    var stackIn = null,
        stackOut = null,
        yw = 0,
        yi = 0;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];

    for (var y = 0; y < height; y++) {
      stack = stackStart;
      var pr = pixels[yi],
          pg = pixels[yi + 1],
          pb = pixels[yi + 2],
          pa = pixels[yi + 3];

      for (var _i = 0; _i < radiusPlus1; _i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }

      var rInSum = 0,
          gInSum = 0,
          bInSum = 0,
          aInSum = 0,
          rOutSum = radiusPlus1 * pr,
          gOutSum = radiusPlus1 * pg,
          bOutSum = radiusPlus1 * pb,
          aOutSum = radiusPlus1 * pa,
          rSum = sumFactor * pr,
          gSum = sumFactor * pg,
          bSum = sumFactor * pb,
          aSum = sumFactor * pa;

      for (var _i2 = 1; _i2 < radiusPlus1; _i2++) {
        var p = yi + ((widthMinus1 < _i2 ? widthMinus1 : _i2) << 2);
        var r = pixels[p],
            g = pixels[p + 1],
            b = pixels[p + 2],
            a = pixels[p + 3];
        var rbs = radiusPlus1 - _i2;
        rSum += (stack.r = r) * rbs;
        gSum += (stack.g = g) * rbs;
        bSum += (stack.b = b) * rbs;
        aSum += (stack.a = a) * rbs;
        rInSum += r;
        gInSum += g;
        bInSum += b;
        aInSum += a;
        stack = stack.next;
      }

      stackIn = stackStart;
      stackOut = stackEnd;

      for (var x = 0; x < width; x++) {
        var paInitial = aSum * mulSum >> shgSum;
        pixels[yi + 3] = paInitial;

        if (paInitial !== 0) {
          var _a2 = 255 / paInitial;

          pixels[yi] = (rSum * mulSum >> shgSum) * _a2;
          pixels[yi + 1] = (gSum * mulSum >> shgSum) * _a2;
          pixels[yi + 2] = (bSum * mulSum >> shgSum) * _a2;
        } else {
          pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
        }

        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        aSum -= aOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        aOutSum -= stackIn.a;

        var _p = x + radius + 1;

        _p = yw + (_p < widthMinus1 ? _p : widthMinus1) << 2;
        rInSum += stackIn.r = pixels[_p];
        gInSum += stackIn.g = pixels[_p + 1];
        bInSum += stackIn.b = pixels[_p + 2];
        aInSum += stackIn.a = pixels[_p + 3];
        rSum += rInSum;
        gSum += gInSum;
        bSum += bInSum;
        aSum += aInSum;
        stackIn = stackIn.next;
        var _stackOut = stackOut,
            _r = _stackOut.r,
            _g = _stackOut.g,
            _b = _stackOut.b,
            _a = _stackOut.a;
        rOutSum += _r;
        gOutSum += _g;
        bOutSum += _b;
        aOutSum += _a;
        rInSum -= _r;
        gInSum -= _g;
        bInSum -= _b;
        aInSum -= _a;
        stackOut = stackOut.next;
        yi += 4;
      }

      yw += width;
    }

    for (var _x = 0; _x < width; _x++) {
      yi = _x << 2;

      var _pr = pixels[yi],
          _pg = pixels[yi + 1],
          _pb = pixels[yi + 2],
          _pa = pixels[yi + 3],
          _rOutSum = radiusPlus1 * _pr,
          _gOutSum = radiusPlus1 * _pg,
          _bOutSum = radiusPlus1 * _pb,
          _aOutSum = radiusPlus1 * _pa,
          _rSum = sumFactor * _pr,
          _gSum = sumFactor * _pg,
          _bSum = sumFactor * _pb,
          _aSum = sumFactor * _pa;

      stack = stackStart;

      for (var _i3 = 0; _i3 < radiusPlus1; _i3++) {
        stack.r = _pr;
        stack.g = _pg;
        stack.b = _pb;
        stack.a = _pa;
        stack = stack.next;
      }

      var yp = width;
      var _gInSum = 0,
          _bInSum = 0,
          _aInSum = 0,
          _rInSum = 0;

      for (var _i4 = 1; _i4 <= radius; _i4++) {
        yi = yp + _x << 2;

        var _rbs = radiusPlus1 - _i4;

        _rSum += (stack.r = _pr = pixels[yi]) * _rbs;
        _gSum += (stack.g = _pg = pixels[yi + 1]) * _rbs;
        _bSum += (stack.b = _pb = pixels[yi + 2]) * _rbs;
        _aSum += (stack.a = _pa = pixels[yi + 3]) * _rbs;
        _rInSum += _pr;
        _gInSum += _pg;
        _bInSum += _pb;
        _aInSum += _pa;
        stack = stack.next;

        if (_i4 < heightMinus1) {
          yp += width;
        }
      }

      yi = _x;
      stackIn = stackStart;
      stackOut = stackEnd;

      for (var _y = 0; _y < height; _y++) {
        var _p2 = yi << 2;

        pixels[_p2 + 3] = _pa = _aSum * mulSum >> shgSum;

        if (_pa > 0) {
          _pa = 255 / _pa;
          pixels[_p2] = (_rSum * mulSum >> shgSum) * _pa;
          pixels[_p2 + 1] = (_gSum * mulSum >> shgSum) * _pa;
          pixels[_p2 + 2] = (_bSum * mulSum >> shgSum) * _pa;
        } else {
          pixels[_p2] = pixels[_p2 + 1] = pixels[_p2 + 2] = 0;
        }

        _rSum -= _rOutSum;
        _gSum -= _gOutSum;
        _bSum -= _bOutSum;
        _aSum -= _aOutSum;
        _rOutSum -= stackIn.r;
        _gOutSum -= stackIn.g;
        _bOutSum -= stackIn.b;
        _aOutSum -= stackIn.a;
        _p2 = _x + ((_p2 = _y + radiusPlus1) < heightMinus1 ? _p2 : heightMinus1) * width << 2;
        _rSum += _rInSum += stackIn.r = pixels[_p2];
        _gSum += _gInSum += stackIn.g = pixels[_p2 + 1];
        _bSum += _bInSum += stackIn.b = pixels[_p2 + 2];
        _aSum += _aInSum += stackIn.a = pixels[_p2 + 3];
        stackIn = stackIn.next;
        _rOutSum += _pr = stackOut.r;
        _gOutSum += _pg = stackOut.g;
        _bOutSum += _pb = stackOut.b;
        _aOutSum += _pa = stackOut.a;
        _rInSum -= _pr;
        _gInSum -= _pg;
        _bInSum -= _pb;
        _aInSum -= _pa;
        stackOut = stackOut.next;
        yi += width;
      }
    }

    return imageData;
  }
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Integer} topX
   * @param {Integer} topY
   * @param {Integer} width
   * @param {Integer} height
   * @param {Float} radius
   * @returns {undefined}
   */


  function processCanvasRGB(canvas, topX, topY, width, height, radius) {
    if (isNaN(radius) || radius < 1) {
      return;
    }

    radius |= 0;
    var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
    imageData = processImageDataRGB(imageData, topX, topY, width, height, radius);
    canvas.getContext('2d').putImageData(imageData, topX, topY);
  }
  /**
   * @param {ImageData} imageData
   * @param {Integer} topX
   * @param {Integer} topY
   * @param {Integer} width
   * @param {Integer} height
   * @param {Float} radius
   * @returns {ImageData}
   */


  function processImageDataRGB(imageData, topX, topY, width, height, radius) {
    var pixels = imageData.data;
    var div = 2 * radius + 1; // const w4 = width << 2;

    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackEnd;

    for (var i = 1; i < div; i++) {
      stack = stack.next = new BlurStack();

      if (i === radiusPlus1) {
        stackEnd = stack;
      }
    }

    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];
    var p, rbs;
    var yw = 0,
        yi = 0;

    for (var y = 0; y < height; y++) {
      var pr = pixels[yi],
          pg = pixels[yi + 1],
          pb = pixels[yi + 2],
          rOutSum = radiusPlus1 * pr,
          gOutSum = radiusPlus1 * pg,
          bOutSum = radiusPlus1 * pb,
          rSum = sumFactor * pr,
          gSum = sumFactor * pg,
          bSum = sumFactor * pb;
      stack = stackStart;

      for (var _i5 = 0; _i5 < radiusPlus1; _i5++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack = stack.next;
      }

      var rInSum = 0,
          gInSum = 0,
          bInSum = 0;

      for (var _i6 = 1; _i6 < radiusPlus1; _i6++) {
        p = yi + ((widthMinus1 < _i6 ? widthMinus1 : _i6) << 2);
        rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - _i6);
        gSum += (stack.g = pg = pixels[p + 1]) * rbs;
        bSum += (stack.b = pb = pixels[p + 2]) * rbs;
        rInSum += pr;
        gInSum += pg;
        bInSum += pb;
        stack = stack.next;
      }

      stackIn = stackStart;
      stackOut = stackEnd;

      for (var x = 0; x < width; x++) {
        pixels[yi] = rSum * mulSum >> shgSum;
        pixels[yi + 1] = gSum * mulSum >> shgSum;
        pixels[yi + 2] = bSum * mulSum >> shgSum;
        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
        rInSum += stackIn.r = pixels[p];
        gInSum += stackIn.g = pixels[p + 1];
        bInSum += stackIn.b = pixels[p + 2];
        rSum += rInSum;
        gSum += gInSum;
        bSum += bInSum;
        stackIn = stackIn.next;
        rOutSum += pr = stackOut.r;
        gOutSum += pg = stackOut.g;
        bOutSum += pb = stackOut.b;
        rInSum -= pr;
        gInSum -= pg;
        bInSum -= pb;
        stackOut = stackOut.next;
        yi += 4;
      }

      yw += width;
    }

    for (var _x2 = 0; _x2 < width; _x2++) {
      yi = _x2 << 2;

      var _pr2 = pixels[yi],
          _pg2 = pixels[yi + 1],
          _pb2 = pixels[yi + 2],
          _rOutSum2 = radiusPlus1 * _pr2,
          _gOutSum2 = radiusPlus1 * _pg2,
          _bOutSum2 = radiusPlus1 * _pb2,
          _rSum2 = sumFactor * _pr2,
          _gSum2 = sumFactor * _pg2,
          _bSum2 = sumFactor * _pb2;

      stack = stackStart;

      for (var _i7 = 0; _i7 < radiusPlus1; _i7++) {
        stack.r = _pr2;
        stack.g = _pg2;
        stack.b = _pb2;
        stack = stack.next;
      }

      var _rInSum2 = 0,
          _gInSum2 = 0,
          _bInSum2 = 0;

      for (var _i8 = 1, yp = width; _i8 <= radius; _i8++) {
        yi = yp + _x2 << 2;
        _rSum2 += (stack.r = _pr2 = pixels[yi]) * (rbs = radiusPlus1 - _i8);
        _gSum2 += (stack.g = _pg2 = pixels[yi + 1]) * rbs;
        _bSum2 += (stack.b = _pb2 = pixels[yi + 2]) * rbs;
        _rInSum2 += _pr2;
        _gInSum2 += _pg2;
        _bInSum2 += _pb2;
        stack = stack.next;

        if (_i8 < heightMinus1) {
          yp += width;
        }
      }

      yi = _x2;
      stackIn = stackStart;
      stackOut = stackEnd;

      for (var _y2 = 0; _y2 < height; _y2++) {
        p = yi << 2;
        pixels[p] = _rSum2 * mulSum >> shgSum;
        pixels[p + 1] = _gSum2 * mulSum >> shgSum;
        pixels[p + 2] = _bSum2 * mulSum >> shgSum;
        _rSum2 -= _rOutSum2;
        _gSum2 -= _gOutSum2;
        _bSum2 -= _bOutSum2;
        _rOutSum2 -= stackIn.r;
        _gOutSum2 -= stackIn.g;
        _bOutSum2 -= stackIn.b;
        p = _x2 + ((p = _y2 + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
        _rSum2 += _rInSum2 += stackIn.r = pixels[p];
        _gSum2 += _gInSum2 += stackIn.g = pixels[p + 1];
        _bSum2 += _bInSum2 += stackIn.b = pixels[p + 2];
        stackIn = stackIn.next;
        _rOutSum2 += _pr2 = stackOut.r;
        _gOutSum2 += _pg2 = stackOut.g;
        _bOutSum2 += _pb2 = stackOut.b;
        _rInSum2 -= _pr2;
        _gInSum2 -= _pg2;
        _bInSum2 -= _pb2;
        stackOut = stackOut.next;
        yi += width;
      }
    }

    return imageData;
  }
  /**
   *
   */


  var BlurStack =
  /**
   * Set properties.
   */
  function BlurStack() {
    _classCallCheck(this, BlurStack);

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  };
  var Blur = {
    /**
      * @function module:StackBlur.image
      * @see module:StackBlur~processImage
      */
    image: processImage,

    /**
      * @function module:StackBlur.canvasRGBA
      * @see module:StackBlur~processCanvasRGBA
      */
    canvasRGBA: processCanvasRGBA,

    /**
      * @function module:StackBlur.canvasRGB
      * @see module:StackBlur~processCanvasRGB
      */
    canvasRGB: processCanvasRGB,

    /**
      * @function module:StackBlur.imageDataRGBA
      * @see module:StackBlur~processImageDataRGBA
      */
    imageDataRGBA: processImageDataRGBA,

    /**
      * @function module:StackBlur.imageDataRGB
      * @see module:StackBlur~processImageDataRGB
      */
    imageDataRGB: processImageDataRGB
  };

  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
  canvas.width = 30;
  canvas.height = 17;

  function extract(img_data) {
    var data = img_data.data,
        colors = [];

    for (var i = 0, n = data.length; i < n; i += 4) {
      colors.push([data[i], data[i + 1], data[i + 2]]);
    }

    return colors;
  }

  function palette(palette) {
    var colors = {
      bright: [0, 0, 0],
      average: [127, 127, 127],
      dark: [255, 255, 255]
    };
    var ar = 0,
        ag = 0,
        ab = 0,
        at = palette.length;
    var bg = 0,
        dk = 765;

    for (var i = 0; i < palette.length; i++) {
      var p = palette[i],
          a = p[0] + p[1] + p[2];
      ar += p[0];
      ag += p[1];
      ab += p[2];

      if (a > bg) {
        bg = a;
        colors.bright = p;
      }

      if (a < dk) {
        dk = a;
        colors.dark = p;
      }
    }

    colors.average = [Math.round(ar / at), Math.round(ag / at), Math.round(ab / at)];
    return colors;
  }

  function rgba(c) {
    var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return 'rgba(' + c.join(',') + ',' + o + ')';
  }

  function tone(c) {
    var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
    var l = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 80;
    var hls = rgbToHsl(c[0], c[1], c[2]);
    var rgb = hslToRgb(hls[0], Math.min(s, hls[1]), l);
    return rgba(rgb, o);
  }
  /**
   * Converts an RGB color value to HSL.
   *
   * @param   {number}  r       The red color value
   * @param   {number}  g       The green color value
   * @param   {number}  b       The blue color value
   * @return  {Array}           The HSL representation
   */


  function rgbToHsl(r, g, b) {
    var rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs), diff = v - Math.min(rabs, gabs, babs);

    diffc = function diffc(c) {
      return (v - c) / 6 / diff + 1 / 2;
    };

    percentRoundFn = function percentRoundFn(num) {
      return Math.round(num * 100) / 100;
    };

    if (diff == 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
        h = bb - gg;
      } else if (gabs === v) {
        h = 1 / 3 + rr - bb;
      } else if (babs === v) {
        h = 2 / 3 + gg - rr;
      }

      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }

    return [Math.round(h * 360), percentRoundFn(s * 100), percentRoundFn(v * 100)];
  }
  /**
   * Converts an HSL color value to RGB.
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */


  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    var C = (1 - Math.abs(2 * l - 1)) * s;
    var hue = h / 60;
    var X = C * (1 - Math.abs(hue % 2 - 1));
    var r = 0,
        g = 0,
        b = 0;

    if (hue >= 0 && hue < 1) {
      r = C;
      g = X;
    } else if (hue >= 1 && hue < 2) {
      r = X;
      g = C;
    } else if (hue >= 2 && hue < 3) {
      g = C;
      b = X;
    } else if (hue >= 3 && hue < 4) {
      g = X;
      b = C;
    } else if (hue >= 4 && hue < 5) {
      r = X;
      b = C;
    } else {
      r = C;
      b = X;
    }

    var m = l - C / 2;
    r += m;
    g += m;
    b += m;
    r *= 255.0;
    g *= 255.0;
    b *= 255.0;
    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  function reset(width, height) {
    canvas.width = width;
    canvas.height = height;
  }

  function get$3(img) {
    reset(30, 17);
    var ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    var nw = img.width * ratio,
        nh = img.height * ratio;
    ctx.drawImage(img, -(nw - canvas.width) / 2, -(nh - canvas.height) / 2, nw, nh);
    return extract(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  function blur$1(img) {
    reset(200, 130);
    var ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    var nw = img.width * ratio,
        nh = img.height * ratio;
    ctx.drawImage(img, -(nw - canvas.width) / 2, -(nh - canvas.height) / 2, nw, nh);
    Blur.canvasRGB(canvas, 0, 0, canvas.width, canvas.height, 80);
    var nimg = new Image();
    nimg.src = canvas.toDataURL();
    return nimg;
  }

  var Color = {
    get: get$3,
    extract: extract,
    palette: palette,
    rgba: rgba,
    blur: blur$1,
    tone: tone,
    rgbToHsl: rgbToHsl
  };

  var html$d = $("\n    <div class=\"background\">\n        <canvas class=\"background__one\"></canvas>\n        <canvas class=\"background__two\"></canvas>\n    </div>\n");
  var background = {
    one: {
      canvas: $('.background__one', html$d),
      ctx: $('.background__one', html$d)[0].getContext('2d')
    },
    two: {
      canvas: $('.background__two', html$d),
      ctx: $('.background__two', html$d)[0].getContext('2d')
    }
  };
  var view$1 = 'one';
  var src = '';
  var loaded$1 = {};
  var bokeh = {
    c: [],
    h: [],
    d: true
  };
  var timer$6;

  function bg() {
    html$d.find('canvas').removeClass('visible');
    view$1 = view$1 == 'one' ? 'two' : 'one';
    return background[view$1];
  }

  function draw(data, item, noimage) {
    if (!Storage.get('background', 'true') || noimage) {
      background.one.canvas.removeClass('visible');
      background.two.canvas.removeClass('visible');
      return;
    }

    item.canvas[0].width = window.innerWidth;
    item.canvas[0].height = window.innerHeight;
    var palette = data.palette;
    var type = Storage.field('background_type');
    blur(data, item, function () {
      if (type == 'complex' && bokeh.d) {
        var bright = Color.rgbToHsl(palette.average[0], palette.average[1], palette.average[2]);
        item.ctx.globalAlpha = bright[2] > 30 ? bright[2] / 100 * 0.6 : 0.4;
        item.ctx.globalCompositeOperation = bright[2] > 30 ? 'color-dodge' : 'screen';

        for (var i = 0; i < 10; i++) {
          var bp = Math.round(Math.random() * (bokeh.c.length - 1));
          var im = bright[2] > 30 ? bokeh.h[bp] : bokeh.c[bp];
          var xp = window.innerWidth * Math.random(),
              yp = window.innerHeight / 2 * Math.random() + window.innerHeight / 2,
              sz = Math.max(window.innerHeight / 8, window.innerHeight / 5 * Math.random()) * 0.01,
              nw = im.width * sz,
              nh = im.height * sz;

          try {
            item.ctx.drawImage(im, xp - nw / 2, yp - nw / 2, nw, nh);
          } catch (e) {}
        }
      }

      item.ctx.globalAlpha = type == 'poster' ? 0.7 : 0.6;
      item.ctx.globalCompositeOperation = 'multiply';
      var angle = 90 * Math.PI / 180,
          x2 = item.canvas[0].width * Math.cos(angle),
          y2 = item.canvas[0].height * Math.sin(angle);
      var gradient = item.ctx.createLinearGradient(0, 0, x2, y2);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      item.ctx.fillStyle = gradient;
      item.ctx.fillRect(0, 0, item.canvas[0].width, item.canvas[0].height);
      item.canvas.addClass('visible');
    });
  }

  function blur(data, item, complite) {
    var img = data.img.width > 1000 ? data.img : Color.blur(data.img);
    setTimeout(function () {
      var ratio = Math.max(item.canvas[0].width / img.width, item.canvas[0].height / img.height);
      var nw = img.width * ratio,
          nh = img.height * ratio;
      item.ctx.globalAlpha = data.img.width > 1000 ? bokeh.d ? 0.7 : 0.2 : 1;
      item.ctx.drawImage(img, -(nw - item.canvas[0].width) / 2, -(nh - item.canvas[0].height) / 2, nw, nh);
      complite();
    }, 100);
  }

  function resize() {
    if (loaded$1[src]) draw(loaded$1[src], background[view$1]);
  }

  function limit$1() {
    var a = Arrays.getKeys(loaded$1);

    if (a.length > 30) {
      var u = a.slice(0, 1);
      delete loaded$1[u];
    }
  }

  function load$2() {
    if (loaded$1[src]) {
      draw(loaded$1[src], bg());
    } else if (src) {
      limit$1();
      var colors;
      var img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = function () {
        try {
          colors = Color.get(img);
        } catch (e) {
          colors = [[200, 200, 200], [100, 100, 100], [10, 10, 10]];
        }

        loaded$1[src] = {
          img: img,
          palette: Color.palette(colors)
        };
        draw(loaded$1[src], bg());
      };

      img.onerror = function () {
        draw(false, false, true);
      };

      img.src = src;
    }
  }

  function change() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    //url = url.replace('https://','http://')
    if (url == src) return;
    bokeh.d = true;
    if (url) src = url;
    clearTimeout(timer$6);
    timer$6 = setTimeout(function () {
      if (url) load$2();else draw(false, false, true);
    }, 1000);
  }

  function immediately() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    if (url) src = url;
    clearTimeout(timer$6);
    bokeh.d = false;
    if (url) load$2();else draw(false, false, true);
  }

  function render$a() {
    return html$d;
  }

  function init$c() {
    Storage.listener.follow('change', function (event) {
      if (event.name == 'background' || event.name == 'background_type') resize();
    });
    var u = Platform.any() ? 'https://yumata.github.io/lampa/' : './';

    for (var i = 1; i <= 6; i++) {
      var im = new Image();
      im.src = u + 'img/bokeh-h/' + i + '.png';
      bokeh.h.push(im);
    }

    for (var _i = 1; _i <= 6; _i++) {
      var _im = new Image();

      _im.src = u + 'img/bokeh/' + _i + '.png';
      bokeh.c.push(_im);
    }

    $(window).on('resize', resize);
  }

  var Background = {
    render: render$a,
    change: change,
    update: resize,
    init: init$c,
    immediately: immediately
  };

  function create$n() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var card = Template.get('more');

    if (params.card_small) {
      card.addClass('card-more--small');
    }

    this.create = function () {
      var _this = this;

      card.on('hover:focus', function (e) {
        _this.onFocus(e.target);
      }).on('hover:enter', function (e) {
        _this.onEnter(e.target);
      });
    };

    this.render = function () {
      return card;
    };

    this.destroy = function () {
      card.remove();
      card = null;
    };
  }

  function create$m(data) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var content = Template.get('items_line', {
      title: data.title
    });
    var body = content.find('.items-line__body');
    var scroll = new create$q({
      horizontal: true,
      step: 300
    });
    var viewall = Storage.field('card_views_type') == 'view' || Storage.get('navigation_type') == 'mouse';
    var items = [];
    var active = 0;
    var more;
    var last;

    this.create = function () {
      scroll.render().find('.scroll__body').addClass('items-cards');
      content.find('.items-line__title').text(data.title);
      this.bind();
      body.append(scroll.render());
    };

    this.bind = function () {
      data.results.slice(0, viewall ? data.results.length : 8).forEach(this.append.bind(this));
      if ((data.results.length >= 20 || data.more) && !params.nomore) this.more();
      this.visible();
      Layer.update();
    };

    this.append = function (element) {
      var _this = this;

      if (element.ready) return;
      element.ready = true;
      var card = new create$o(element, params);
      card.create();

      card.onFocus = function (target, card_data) {
        last = target;
        active = items.indexOf(card);
        if (!viewall) data.results.slice(0, active + 5).forEach(_this.append.bind(_this));

        if (more) {
          more.render().detach();
          scroll.append(more.render());
        }

        scroll.update(items[active].render(), params.align_left ? false : true);

        _this.visible();

        if (!data.noimage) Background.change(Utils.cardImgBackground(card_data));
        if (_this.onFocus) _this.onFocus(card_data);
      };

      card.onEnter = function (target, card_data) {
        if (_this.onEnter) _this.onEnter(target, card_data);
        if (_this.onPrevent) return _this.onPrevent(target, card_data);
        element.source = params.object.source;
        Activity$1.push({
          url: element.url,
          component: 'full',
          id: element.id,
          method: card_data.name ? 'tv' : 'movie',
          card: element,
          source: params.object.source
        });
      };

      if (params.card_events) {
        for (var i in params.card_events) {
          card[i] = params.card_events[i];
        }
      }

      scroll.append(card.render());
      items.push(card);
    };

    this.more = function () {
      var _this2 = this;

      more = new create$n(params);
      more.create();

      more.onFocus = function (target) {
        last = target;
        scroll.update(more.render(), params.align_left ? false : true);
        if (_this2.onFocusMore) _this2.onFocusMore();
      };

      more.onEnter = function () {
        if (_this2.onEnter) _this2.onEnter();

        if (_this2.onMore) {
          _this2.onMore();
        } else {
          Activity$1.push({
            url: data.url,
            title: '类别',
            component: 'category_full',
            page: 2,
            genres: params.genres,
            filter: data.filter,
            source: params.object.source
          });
        }
      };

      scroll.append(more.render());
    };

    this.visible = function () {
      var vis = items;
      if (!viewall) vis = items.slice(active, active + 8);
      vis.forEach(function (item) {
        item.visible();
      });
    };

    this.toggle = function () {
      var _this3 = this;

      Controller.add('items_line', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(items.length ? last : false, scroll.render());

          _this3.visible();
        },
        right: function right() {
          Navigator.move('right');
          Controller.enable('items_line');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else if (_this3.onLeft) _this3.onLeft();else Controller.toggle('menu');
        },
        down: this.onDown,
        up: this.onUp,
        gone: function gone() {},
        back: this.onBack
      });
      Controller.toggle('items_line');
    };

    this.render = function () {
      return content;
    };

    this.destroy = function () {
      Arrays.destroy(items);
      scroll.destroy();
      content.remove();
      if (more) more.destroy();
      items = null;
      more = null;
    };
  }

  function create$l() {
    var html;

    this.create = function () {
      html = Template.get('info');
    };

    this.update = function (data) {
      var nofavorite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var create = ((data.release_date || data.first_air_date || '0000') + '').slice(0, 4);
      var vote = parseFloat((data.vote_average || 0) + '').toFixed(1);
      html.find('.info__title').text(data.title);
      html.find('.info__title-original').text((create == '0000' ? '' : create + ' - ') + data.original_title);
      html.find('.info__rate span').text(vote);
      html.find('.info__rate').toggleClass('hide', !(vote > 0));
      html.find('.info__icon').removeClass('active');

      if (!nofavorite) {
        var status = Favorite.check(data);
        $('.icon--book', html).toggleClass('active', status.book);
        $('.icon--like', html).toggleClass('active', status.like);
        $('.icon--wath', html).toggleClass('active', status.wath);
      }

      html.find('.info__right').toggleClass('hide', nofavorite);
    };

    this.render = function () {
      return html;
    };

    this.empty = function () {
      this.update({
        title: '更多',
        original_title: '显示更多结果',
        vote_average: 0
      }, true);
    };

    this.destroy = function () {
      html.remove();
      html = null;
    };
  }

  function create$k() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    Arrays.extend(params, {
      title: '此处为空',
      descr: '该列表目前为空'
    });
    var html = Template.get('empty', params);

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(html);
          Controller.collectionFocus(false, html);
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          Navigator.move('down');
        },
        right: function right() {
          Navigator.move('right');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.render = function (add) {
      if (add) html.append(add);
      return html;
    };
  }

  function component$c(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true
    });
    var items = [];
    var html = $('<div></div>');
    var active = 0;
    var info;
    var lezydata;

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.main(object, this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.build = function (data) {
      lezydata = data;
      info = new create$l();
      info.create();
      scroll.minus(info.render());
      html.append(info.render());
      html.append(scroll.render());
      data.slice(0, 2).forEach(this.append.bind(this));
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.append = function (element) {
      if (element.ready) return;
      element.ready = true;
      var item = new create$m(element, {
        url: element.url,
        card_small: true,
        genres: object.genres,
        object: object,
        card_wide: element.wide
      });
      item.create();
      item.onDown = this.down.bind(this);
      item.onUp = this.up;
      item.onFocus = info.update;
      item.onBack = this.back;
      scroll.append(item.render());
      items.push(item);
    };

    this.back = function () {
      Activity$1.backward();
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      lezydata.slice(0, active + 2).forEach(this.append.bind(this));
      items[active].toggle();
      scroll.update(items[active].render());
    };

    this.up = function () {
      active--;

      if (active < 0) {
        active = 0;
        Controller.toggle('head');
      } else {
        items[active].toggle();
      }

      scroll.update(items[active].render());
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          if (items.length) {
            items[active].toggle();
          }
        },
        back: this.back
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      if (info) info.destroy();
      html.remove();
      items = null;
      network = null;
      lezydata = null;
    };
  }

  var player;
  var html$c;
  var timer$5;

  function create$j(id) {
    html$c = $('<div class="youtube-player"><div id="youtube-player"></div><div id="youtube-player__progress" class="youtube-player__progress"></div></div>');
    $('body').append(html$c);
    player = new YT.Player('youtube-player', {
      height: window.innerHeight,
      width: window.innerWidth,
      playerVars: {
        'controls': 0,
        'showinfo': 0,
        'autohide': 1,
        'modestbranding': 1,
        'autoplay': 1
      },
      videoId: id,
      events: {
        onReady: function onReady(event) {
          event.target.playVideo();
          update$5();
        },
        onStateChange: function onStateChange(state) {
          if (state.data == 0) {
            Controller.toggle('content');
          }
        }
      }
    });
  }

  function update$5() {
    timer$5 = setTimeout(function () {
      var progress = player.getCurrentTime() / player.getDuration() * 100;
      $('#youtube-player__progress').css('width', progress + '%');
      update$5();
    }, 400);
  }

  function play$2(id) {
    create$j(id);
    Controller.add('youtube', {
      invisible: true,
      toggle: function toggle() {},
      right: function right() {
        player.seekTo(player.getCurrentTime() + 10, true);
      },
      left: function left() {
        player.seekTo(player.getCurrentTime() - 10, true);
      },
      enter: function enter() {},
      gone: function gone() {
        destroy$7();
      },
      back: function back() {
        Controller.toggle('content');
      }
    });
    Controller.toggle('youtube');
  }

  function destroy$7() {
    clearTimeout(timer$5);
    player.destroy();
    html$c.remove();
    html$c = null;
  }

  var YouTube = {
    play: play$2
  };

  function create$i(call_video) {
    var stream_url, loaded;
    var object = $('<object class="player-video_video" type="application/avplayer"</object>');
    var video = object[0];
    var listener = start$4();
    var change_scale_later;
    object.width(window.innerWidth);
    object.height(window.innerHeight); // для тестов

    /*
    let webapis = {
    	paused: true,
    	duration: 500 * 1000,
    	position: 0,
    	avplay: {
    		open: ()=>{
    
    		},
    		close: ()=>{
    			clearInterval(webapis.timer)
    		},
    		play: ()=>{
    			webapis.paused = false
    		},
    		pause: ()=>{
    			webapis.paused = true
    		},
    		setDisplayRect: ()=>{
    
    		},
    		setDisplayMethod: ()=>{
    
    		},
    		seekTo: (t)=>{
    			webapis.position = t
    		},
    		getCurrentTime: ()=>{
    			return webapis.position
    		},
    		getDuration: ()=>{
    			return webapis.duration
    		},
    		getState: ()=>{
    			return webapis.paused ? 'PAUSED' : 'PLAYNING'
    		},
    		getTotalTrackInfo: ()=>{
    			return [
    				{
    					type: 'AUDIO',
    					index: 0,
    					extra_info: '{"language":"russion"}'
    				},
    				{
    					type: 'AUDIO',
    					index: 1,
    					extra_info: '{"language":"english"}'
    				},
    				{
    					type: 'TEXT',
    					index: 0,
    					extra_info: '{"track_lang":"rus"}'
    				},
    				{
    					type: 'TEXT',
    					index: 1,
    					extra_info: '{"track_lang":"eng"}'
    				}
    			]
    		},
    		getCurrentStreamInfo: ()=>{
    			return []
    		},
    		setListener: ()=>{
    
    		},
    		prepareAsync: (call)=>{
    			setTimeout(call, 1000)
    
    			webapis.timer = setInterval(()=>{
    				if(!webapis.paused) webapis.position += 100
    
    				if(webapis.position >= webapis.duration){
    					clearInterval(webapis.timer)
    
    					webapis.position = webapis.duration
    
    					listener.send('ended')
    				}
    
    				if(!webapis.paused){
    					listener.send('timeupdate')
    
    					let s = webapis.duration / 4,
    						t = 'Welcome to subtitles'
    
    					if(webapis.position > s * 3) t = 'That\'s all I wanted to say'
    					else if(webapis.position > s * 2) t = 'This is a super taizen player'
    					else if(webapis.position > s) t = 'I want to say a few words'
    
    					listener.send('subtitle',{text:  t })
    				}
    			},30)
    		}
    	}
    }
    */

    /**
     * Установить урл
     */

    Object.defineProperty(video, "src", {
      set: function set(url) {
        if (url) {
          stream_url = url;
          webapis.avplay.open(url);
          webapis.avplay.setDisplayRect(0, 0, window.innerWidth, window.innerHeight);
          webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');

          try {
            webapis.avplay.setSilentSubtitle(false);
          } catch (e) {}
        }
      },
      get: function get() {}
    });
    /**
     * Позиция
     */

    Object.defineProperty(video, "currentTime", {
      set: function set(t) {
        try {
          webapis.avplay.seekTo(t * 1000);
        } catch (e) {}
      },
      get: function get() {
        var d = 0;

        try {
          d = webapis.avplay.getCurrentTime();
        } catch (e) {}

        return d ? d / 1000 : 0;
      }
    });
    /**
     * Длительность
     */

    Object.defineProperty(video, "duration", {
      set: function set() {},
      get: function get() {
        var d = 0;

        try {
          d = webapis.avplay.getDuration();
        } catch (e) {}

        return d ? d / 1000 : 0;
      }
    });
    /**
     * Пауза
     */

    Object.defineProperty(video, "paused", {
      set: function set() {},
      get: function get() {
        try {
          return webapis.avplay.getState() == 'PAUSED';
        } catch (e) {
          return false;
        }
      }
    });
    /**
     * 音轨
     */

    Object.defineProperty(video, "audioTracks", {
      set: function set() {},
      get: function get() {
        var totalTrackInfo = webapis.avplay.getTotalTrackInfo();
        var tracks = totalTrackInfo.filter(function (track) {
          return track.type === 'AUDIO';
        }).map(function (track) {
          var info = JSON.parse(track.extra_info);
          var item = {
            extra: JSON.parse(track.extra_info),
            index: parseInt(track.index),
            language: info.language
          };
          Object.defineProperty(item, "enabled", {
            set: function set(v) {
              if (v) {
                try {
                  webapis.avplay.setSelectTrack('AUDIO', item.index);
                } catch (e) {
                  console.log('Player', 'no change audio:', e.message);
                }
              }
            },
            get: function get() {}
          });
          return item;
        }).sort(function (a, b) {
          return a.index - b.index;
        });
        return tracks;
      }
    });
    /**
     * 字幕
     */

    Object.defineProperty(video, "textTracks", {
      set: function set() {},
      get: function get() {
        var totalTrackInfo = webapis.avplay.getTotalTrackInfo();
        var tracks = totalTrackInfo.filter(function (track) {
          return track.type === 'TEXT';
        }).map(function (track) {
          var info = JSON.parse(track.extra_info),
              item = {
            extra: JSON.parse(track.extra_info),
            index: parseInt(track.index),
            language: info.track_lang
          };
          Object.defineProperty(item, "mode", {
            set: function set(v) {
              if (v == 'showing') {
                try {
                  webapis.avplay.setSelectTrack('TEXT', item.index);
                } catch (e) {
                  console.log('Player', 'no change text:', e.message);
                }
              }
            },
            get: function get() {}
          });
          return item;
        }).sort(function (a, b) {
          return a.index - b.index;
        });
        return tracks;
      }
    });
    Object.defineProperty(video, "videoWidth", {
      set: function set() {},
      get: function get() {
        var info = videoInfo();
        return info.Width || 0;
      }
    });
    Object.defineProperty(video, "videoHeight", {
      set: function set() {},
      get: function get() {
        var info = videoInfo();
        return info.Height || 0;
      }
    });
    /**
     * Получить информацию о видео
     * @returns Object
     */

    var videoInfo = function videoInfo() {
      try {
        var info = webapis.avplay.getCurrentStreamInfo(),
            json = {};

        for (var i = 0; i < info.length; i++) {
          var detail = info[i];

          if (detail.type == 'VIDEO') {
            json = JSON.parse(detail.extra_info);
          }
        }

        return json;
      } catch (e) {
        return {};
      }
    };
    /**
     * Меняем размер видео
     * @param {String} scale - default,cover
     */


    var changeScale = function changeScale(scale) {
      try {
        if (scale == 'cover') {
          webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
        } else {
          webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
        }
      } catch (e) {
        change_scale_later = scale;
      }
    };
    /**
     * Всегда говорим да, мы можем играть
     */


    video.canPlayType = function () {
      return true;
    };
    /**
     * Вешаем кастомные события
     */


    video.addEventListener = listener.follow.bind(listener);
    /**
     * Вешаем события от плеера тайзен
     */

    webapis.avplay.setListener({
      onbufferingstart: function onbufferingstart() {
        console.log('Player', 'buffering start');
        listener.send('waiting');
      },
      onbufferingprogress: function onbufferingprogress(percent) {
        listener.send('progress', {
          percent: percent
        });
      },
      onbufferingcomplete: function onbufferingcomplete() {
        console.log('Player', 'buffering complete');
        listener.send('playing');
      },
      onstreamcompleted: function onstreamcompleted() {
        console.log('Player', 'stream completed');
        webapis.avplay.stop();
        listener.send('ended');
      },
      oncurrentplaytime: function oncurrentplaytime() {
        listener.send('timeupdate');

        if (change_scale_later) {
          change_scale_later = false;
          changeScale(change_scale_later);
        }
      },
      onerror: function onerror(eventType) {
        listener.send('error', {
          error: {
            code: 'tizen',
            message: eventType
          }
        });
      },
      onevent: function onevent(eventType, eventData) {
        console.log('Player', 'event type:', eventType, 'data:', eventData);
      },
      onsubtitlechange: function onsubtitlechange(duration, text, data3, data4) {
        listener.send('subtitle', {
          text: text
        });
      },
      ondrmevent: function ondrmevent(drmEvent, drmData) {}
    });
    /**
     * Загрузить
     */

    video.load = function () {
      if (stream_url) {
        webapis.avplay.prepareAsync(function () {
          loaded = true;
          webapis.avplay.play();

          try {
            webapis.avplay.setSilentSubtitle(false);
          } catch (e) {}

          listener.send('canplay');
          listener.send('playing');
          listener.send('loadedmetadata');
        }, function (e) {
          listener.send('error', {
            error: 'code [' + e.code + '] ' + e.message
          });
        });
      }
    };
    /**
     * Играть
     */


    video.play = function () {
      if (loaded) webapis.avplay.play();
    };
    /**
     * Пауза
     */


    video.pause = function () {
      if (loaded) webapis.avplay.pause();
    };
    /**
     * Установить масштаб
     */


    video.size = function (type) {
      changeScale(type);
    };
    /**
     * Уничтожить
     */


    video.destroy = function () {
      try {
        webapis.avplay.close();
      } catch (e) {}

      video.remove();
      listener.destroy();
    };

    call_video(video);
    return object;
  }

  function create$h(object) {
    this.state = object.state;

    this.start = function () {
      this.dispath(this.state);
    };

    this.dispath = function (action_name) {
      var action = object.transitions[action_name];

      if (action) {
        action.call(this);
      } else {
        console.log('invalid action');
      }
    };
  }

  var html$b = Template.get('player_panel');
  var listener$9 = start$4();
  var condition = {};
  var timer$4 = {};
  var tracks = [];
  var subs = [];
  var elems$1 = {
    peding: $('.player-panel__peding', html$b),
    position: $('.player-panel__position', html$b),
    time: $('.player-panel__time', html$b),
    timenow: $('.player-panel__timenow', html$b),
    timeend: $('.player-panel__timeend', html$b),
    title: $('.player-panel__filename', html$b),
    tracks: $('.player-panel__tracks', html$b),
    subs: $('.player-panel__subs', html$b),
    timeline: $('.player-panel__timeline', html$b)
  };
  /**
   * Отсеживаем состояние, 
   * когда надо показать панель, а когда нет
   */

  var state = new create$h({
    state: 'start',
    transitions: {
      start: function start() {
        clearTimeout(timer$4.hide);
        clearTimeout(timer$4.rewind);
        this.dispath('canplay');
      },
      canplay: function canplay() {
        if (condition.canplay) this.dispath('visible');else _visible(true);
      },
      visible: function visible() {
        if (condition.visible) _visible(true);else this.dispath('rewind');
      },
      rewind: function rewind() {
        var _this = this;

        clearTimeout(timer$4.rewind);

        if (condition.rewind) {
          _visible(true);

          timer$4.rewind = setTimeout(function () {
            condition.rewind = false;

            _this.dispath('mousemove');
          }, 1000);
        } else {
          this.dispath('mousemove');
        }
      },
      mousemove: function mousemove() {
        if (condition.mousemove) {
          _visible(true);
        }

        this.dispath('hide');
      },
      hide: function hide() {
        clearTimeout(timer$4.hide);
        timer$4.hide = setTimeout(function () {
          _visible(false);
        }, 3000);
      }
    }
  });
  html$b.find('.selector').on('hover:focus', function (e) {
  });
  html$b.find('.player-panel__playpause').on('hover:enter', function (e) {
    listener$9.send('playpause', {});
  });
  html$b.find('.player-panel__next').on('hover:enter', function (e) {
    listener$9.send('next', {});
  });
  html$b.find('.player-panel__prev').on('hover:enter', function (e) {
    listener$9.send('prev', {});
  });
  html$b.find('.player-panel__rprev').on('hover:enter', function (e) {
    listener$9.send('rprev', {});
  });
  html$b.find('.player-panel__rnext').on('hover:enter', function (e) {
    listener$9.send('rnext', {});
  });
  html$b.find('.player-panel__playlist').on('hover:enter', function (e) {
    listener$9.send('playlist', {});
  });
  html$b.find('.player-panel__tstart').on('hover:enter', function (e) {
    listener$9.send('to_start', {});
  });
  html$b.find('.player-panel__tend').on('hover:enter', function (e) {
    listener$9.send('to_end', {});
  });
  elems$1.timeline.attr('data-controller', 'player_rewind');
  elems$1.timeline.on('mousemove', function (e) {
    listener$9.send('mouse_rewind', {
      method: 'move',
      time: elems$1.time,
      percent: percent(e)
    });
  }).on('mouseout', function () {
    elems$1.time.addClass('hide');
  }).on('click', function (e) {
    listener$9.send('mouse_rewind', {
      method: 'click',
      time: elems$1.time,
      percent: percent(e)
    });
  });
  html$b.find('.player-panel__line:eq(1) .selector').attr('data-controller', 'player_panel');

  function addController() {
    Controller.add('player_rewind', {
      toggle: function toggle() {
        Controller.collectionSet(render$9());
        Controller.collectionFocus(false, render$9());
      },
      up: function up() {
        Controller.toggle('player');
      },
      down: function down() {
        toggleButtons();
      },
      right: function right() {
        listener$9.send('rnext', {});
      },
      left: function left() {
        listener$9.send('rprev', {});
      },
      gone: function gone() {
        html$b.find('.selector').removeClass('focus');
      },
      back: function back() {
        Controller.toggle('player');
        hide();
      }
    });
    Controller.add('player_panel', {
      toggle: function toggle() {
        Controller.collectionSet(render$9());
        Controller.collectionFocus($('.player-panel__playpause', html$b)[0], render$9());
      },
      up: function up() {
        toggleRewind();
      },
      right: function right() {
        Navigator.move('right');
      },
      left: function left() {
        Navigator.move('left');
      },
      down: function down() {
        Controller.toggle('player');
      },
      gone: function gone() {
        html$b.find('.selector').removeClass('focus');
      },
      back: function back() {
        Controller.toggle('player');
        hide();
      }
    });
  }
  /**
   * Выбор аудиодорожки
   */


  elems$1.tracks.on('hover:enter', function (e) {
    if (tracks.length) {
      tracks.forEach(function (element, p) {
        var name = [];
        name.push(p + 1);
        name.push(element.language || element.name || '未知');
        if (element.label) name.push(element.label);

        if (element.extra) {
          if (element.extra.channels) name.push('频道: ' + element.extra.channels);
          if (element.extra.fourCC) name.push('类型: ' + element.extra.fourCC);
        }

        element.title = name.join(' / ');
      });
      var enabled = Controller.enabled();
      Select.show({
        title: '音轨',
        items: tracks,
        onSelect: function onSelect(a) {
          tracks.forEach(function (element) {
            element.enabled = false;
            element.selected = false;
          });
          a.enabled = true;
          a.selected = true;
          Controller.toggle(enabled.name);
        },
        onBack: function onBack() {
          Controller.toggle(enabled.name);
        }
      });
    }
  });
  /**
   * Выбор субтитров
   */

  elems$1.subs.on('hover:enter', function (e) {
    if (subs.length) {
      if (subs[0].index !== -1) {
        Arrays.insert(subs, 0, {
          title: '已禁用',
          selected: true,
          index: -1
        });
      }

      subs.forEach(function (element, p) {
        if (element.index !== -1) element.title = p + ' / ' + (element.language || element.label || '未知');
      });
      var enabled = Controller.enabled();
      Select.show({
        title: '字幕',
        items: subs,
        onSelect: function onSelect(a) {
          subs.forEach(function (element) {
            element.mode = 'disabled';
            element.selected = false;
          });
          a.mode = 'showing';
          a.selected = true;
          listener$9.send('subsview', {
            status: a.index > -1
          });
          Controller.toggle(enabled.name);
        },
        onBack: function onBack() {
          Controller.toggle(enabled.name);
        }
      });
    }
  });
  /**
   * Выбор масштаба видео
   */

  html$b.find('.player-panel__size').on('hover:enter', function (e) {
    var select = Storage.get('player_size', 'default');
    var items = [{
      title: '默认',
      subtitle: '默认视频大小',
      value: 'default',
      selected: select == 'default'
    }, {
      title: '扩展',
      subtitle: '将视频扩展到全屏',
      value: 'cover',
      selected: select == 'cover'
    }];

    if (!(Platform.is('tizen') && Storage.field('player') == 'tizen')) {
      items = items.concat([{
        title: '填充',
        subtitle: '使视频适合全屏',
        value: 'fill',
        selected: select == 'fill'
      }, {
        title: '放大 115%',
        subtitle: '将视频放大 115%',
        value: 's115',
        selected: select == 's115'
      }, {
        title: '缩放 130%',
        subtitle: '缩放视频 130%',
        value: 's130',
        selected: select == 's130'
      }, {
        title: '垂直 115%',
        subtitle: '缩放视频 115%',
        value: 'v115',
        selected: select == 'v115'
      }, {
        title: '垂直 130%',
        subtitle: '缩放视频 130%',
        value: 'v130',
        selected: select == 'v130'
      }]);
    } else {
      if (select == 's130' || select == 'fill') {
        items[0].selected = true;
      }
    }

    Select.show({
      title: '视频大小',
      items: items,
      onSelect: function onSelect(a) {
        listener$9.send('size', {
          size: a.value
        });
        Controller.toggle('player_panel');
      },
      onBack: function onBack() {
        Controller.toggle('player_panel');
      }
    });
  });

  function percent(e) {
    var offset = elems$1.timeline.offset();
    var width = elems$1.timeline.width();
    return (e.clientX - offset.left) / width;
  }
  /**
   * Обновляем состояние панели
   * @param {String} need - что нужно обновить
   * @param {*} value - значение
   */


  function update$4(need, value) {
    if (need == 'position') {
      elems$1.position.css({
        width: value
      });
    }

    if (need == 'peding') {
      elems$1.peding.css({
        width: value
      });
    }

    if (need == 'timeend') {
      elems$1.timeend.text(value);
    }

    if (need == 'timenow') {
      elems$1.timenow.text(value);
    }

    if (need == 'play') {
      html$b.toggleClass('panel--paused', false);
    }

    if (need == 'pause') {
      html$b.toggleClass('panel--paused', true);
    }
  }
  /**
   * Показать или скрыть панель
   * @param {Boolean} status 
   */


  function _visible(status) {
    listener$9.send('visible', {
      status: status
    });
    html$b.toggleClass('panel--visible', status);
  }
  /**
   * Можем играть, далее отслеживаем статус
   */


  function canplay() {
    condition.canplay = true;
    state.start();
  }
  /**
   * Перемотка
   */


  function rewind$1() {
    condition.rewind = true;
    state.start();
  }

  function toggleRewind() {
    Controller.toggle('player_rewind');
  }

  function toggleButtons() {
    Controller.toggle('player_panel');
  }
  /**
   * Контроллер
   */


  function toggle$6() {
    condition.visible = true;
    state.start();
    toggleRewind();
  }
  /**
   * Показать панель
   */


  function show$2() {
    state.start();
    addController();
  }

  function mousemove() {
    condition.mousemove = true;
    state.start();
  }
  /**
   * Скрыть панель
   */


  function hide() {
    condition.visible = false;

    _visible(false);
  }
  /**
   * Установить субтитры
   * @param {Array} su 
   */


  function setSubs(su) {
    subs = su;
    elems$1.subs.toggleClass('hide', false);
  }
  /**
   * Установить дорожки
   * @param {Array} tr 
   */


  function setTracks(tr, if_no) {
    if (if_no) {
      if (!tracks.length) tracks = tr;
    } else tracks = tr;

    elems$1.tracks.toggleClass('hide', false);
  }
  /**
   * Уничтожить
   */


  function destroy$6() {
    condition = {};
    tracks = [];
    subs = [];
    elems$1.peding.css({
      width: 0
    });
    elems$1.position.css({
      width: 0
    });
    elems$1.time.text('00 00');
    elems$1.timenow.text('00 00');
    elems$1.timeend.text('00 00');
    elems$1.subs.toggleClass('hide', true);
    elems$1.tracks.toggleClass('hide', true);
    html$b.toggleClass('panel--paused', false);
  }

  function render$9() {
    return html$b;
  }

  var Panel = {
    listener: listener$9,
    render: render$9,
    toggle: toggle$6,
    show: show$2,
    destroy: destroy$6,
    hide: hide,
    canplay: canplay,
    update: update$4,
    rewind: rewind$1,
    setTracks: setTracks,
    setSubs: setSubs,
    mousemove: mousemove
  };

  function luna(params, call, fail) {
    if (call) params.onSuccess = call;

    params.onFailure = function (result) {
      console.log('WebOS', params.method + " [fail][" + result.errorCode + "] " + result.errorText);
      if (fail) fail();
    };

    webOS.service.request("luna://com.webos.media", params);
  }

  function create$g(_video) {
    var video = _video;
    var media_id;
    var subtitle_visible = false;
    var timer;
    var timer_repet;
    var count = 0;
    var count_message = 0;
    var data = {
      subs: [],
      tracks: []
    };
    this.subscribed = false;
    this.repeted = false;

    this.start = function () {
      timer = setInterval(this.search.bind(this), 300);
    };

    this.toggleSubtitles = function (status) {
      subtitle_visible = status;
      luna({
        method: 'setSubtitleEnable',
        parameters: {
          'mediaId': media_id,
          'enable': status
        }
      });
    };

    this.subtitles = function (info) {
      var _this = this;

      if (info.numSubtitleTracks) {
        var all = [];

        var add = function add(sub, index) {
          sub.index = index;
          sub.language = sub.language == '(null)' ? '' : sub.language;
          Object.defineProperty(sub, 'mode', {
            set: function set(v) {
              if (v == 'showing') {
                _this.toggleSubtitles(sub.index == -1 ? false : true);

                console.log('WebOS', 'change subtitles for id:', media_id);
                luna({
                  method: 'selectTrack',
                  parameters: {
                    'type': 'text',
                    'mediaId': media_id,
                    'index': sub.index
                  }
                });
              }
            },
            get: function get() {}
          });
          all.push(sub);
        };

        add({
          title: '禁用',
          selected: true
        }, -1);

        for (var i = 0; i < info.subtitleTrackInfo.length; i++) {
          add(info.subtitleTrackInfo[i], i);
        }

        data.subs = all;
        Panel.setSubs(data.subs);
      }
    };

    this.tracks = function (info) {
      if (info.numAudioTracks) {
        var all = [];

        var add = function add(track, index) {
          track.index = index;
          track.selected = index == -1;
          track.extra = {
            channels: track.channels,
            fourCC: track.codec
          };
          Object.defineProperty(track, 'enabled', {
            set: function set(v) {
              if (v) {
                console.log('WebOS', 'change audio for id:', media_id);
                luna({
                  method: 'selectTrack',
                  parameters: {
                    'type': 'audio',
                    'mediaId': media_id,
                    'index': track.index
                  }
                });
              }
            },
            get: function get() {}
          });
          all.push(track);
        };

        for (var i = 0; i < info.audioTrackInfo.length; i++) {
          add(info.audioTrackInfo[i], i);
        }

        data.tracks = all;
        Panel.setTracks(data.tracks, true);
      }
    };

    this.subscribe = function () {
      var _this2 = this;

      this.subscribed = true;
      luna({
        method: 'subscribe',
        parameters: {
          'mediaId': media_id,
          'subscribe': true
        }
      }, function (result) {
        if (result.sourceInfo && !_this2.sourceInfo) {
          _this2.sourceInfo = true;
          var info = result.sourceInfo.programInfo[0];

          _this2.subtitles(info);

          _this2.tracks(info);

          _this2.unsubscribe();

          _this2.call();
        }

        if (result.bufferRange) {
          count_message++;

          if (count_message == 30) {
            _this2.unsubscribe();

            _this2.call();
          }
        }
      }, function () {
        _this2.call();
      });
    };

    this.unsubscribe = function () {
      luna({
        method: 'unload',
        parameters: {
          'mediaId': media_id
        }
      });
    };

    this.search = function () {
      var _this3 = this;

      count++;

      if (count > 3) {
        clearInterval(timer);
        clearInterval(timer_repet);
      }

      var rootSubscribe = function rootSubscribe() {
        console.log('Webos', 'Run root', 'version:', webOS.sdk_version);

        _this3.toggleSubtitles(false);

        if (_this3.subscribed) clearInterval(timer_repet);
        if (!_this3.subscribed) _this3.subscribe();else {
          if (data.tracks.length) Panel.setTracks(data.tracks, true);
          if (data.subs.length) Panel.setSubs(data.subs);
        }
        clearInterval(timer);
      };

      console.log('Webos', 'try get id:', video.mediaId);

      if (video.mediaId) {
        media_id = video.mediaId;
        console.log('Webos', 'video id:', media_id);

        if (webOS.sdk_version) {
          if (webOS.sdk_version > 3 && webOS.sdk_version < 4) {
            rootSubscribe();
          } else rootSubscribe();
        } else rootSubscribe();
      }
      /*
      luna({
          method: 'getActivePipelines'
      },(result)=>{
                console.log('WebOS', 'getActivePipelines', result)
                result.forEach(element => {
              if(element.type == 'media' && element.id && element.is_foreground) media_id = element.id
          })
                console.log('WebOS', 'video id:', media_id)
          
          if(media_id) rootSubscribe()
          
      },()=>{
          if(video.mediaId) videoSubscribe()
      })
      */

    };

    this.call = function () {
      if (this.callback) this.callback();
      this.callback = false;
    };

    this.repet = function (new_video) {
      video = new_video;
      console.log('Webos', 'repeat to new video', new_video ? true : false);
      media_id = '';
      clearInterval(timer);
      count = 0;
      this.repeted = true;
      timer_repet = setInterval(this.search.bind(this), 300);
    };

    this.rewinded = function () {
      this.toggleSubtitles(subtitle_visible);
    };

    this.destroy = function () {
      clearInterval(timer);
      clearInterval(timer_repet);
      if (media_id) this.unsubscribe();
      data = null;
      this.subscribed = false;
      this.callback = false;
    };
  }

  function time(val) {
    var regex = /(\d+):(\d{2}):(\d{2})/;
    var parts = regex.exec(val);
    if (parts === null) return 0;

    for (var i = 1; i < 5; i++) {
      parts[i] = parseInt(parts[i], 10);
      if (isNaN(parts[i])) parts[i] = 0;
    } //hours + minutes + seconds + ms


    return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000;
  }

  function parseSRT(data, ms) {
    var useMs = ms ? true : false;
    data = data.replace(/\r/g, '');
    var regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g;
    data = data.split(regex);
    data.shift();
    var items = [];

    for (var i = 0; i < data.length; i += 4) {
      items.push({
        id: data[i].trim(),
        startTime: useMs ? time(data[i + 1].trim()) : data[i + 1].trim(),
        endTime: useMs ? time(data[i + 2].trim()) : data[i + 2].trim(),
        text: data[i + 3].trim()
      });
    }

    return items;
  }

  function parse$1(data, ms) {
    if (/WEBVTT/gi.test(data)) return parseVTT(data, ms);else return parseSRT(data, ms);
  }

  function parseVTT(data, ms) {
    var useMs = ms ? true : false;
    data = data.replace(/WEBVTT/gi, '').trim();
    data = data.replace(/\r/g, '');
    data = data.replace(/(\d+):(\d+)\.(\d+) --> (\d+):(\d+)\.(\d+)/g, '00:$1:$2.$3 --> 00:$4:$5.$6');
    var regex = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/g;
    data = data.split(regex);
    data.shift();
    var items = [];

    for (var i = 0; i < data.length; i += 3) {
      items.push({
        id: data[i].trim(),
        startTime: useMs ? time(data[i + 0].trim()) : data[i + 0].trim(),
        endTime: useMs ? time(data[i + 1].trim()) : data[i + 1].trim(),
        text: data[i + 2].trim()
      });
    }

    return items;
  }

  function create$f() {
    var parsed;
    var network = new create$r();
    this.listener = start$4();

    this.load = function (url) {
      network.silent(url, function (data) {
        if (data) {
          parsed = parse$1(data, true);
        }
      }, false, false, {
        dataType: 'text'
      });
    };

    this.update = function (time_sec) {
      var time_ms = time_sec * 1000;

      if (parsed) {
        var text = '';

        for (var i = 0; i < parsed.length; i++) {
          var sub = parsed[i];

          if (time_ms > sub.startTime && time_ms < sub.endTime) {
            text = sub.text.replace("\n", '<br>');
            break;
          }
        }

        this.listener.send('subtitle', {
          text: text.trim()
        });
      }
    };

    this.destroy = function () {
      network.clear();
      network = null;
      this.listener = null;
    };
  }

  var listener$8 = start$4();
  var html$a = Template.get('player_video');
  var display = html$a.find('.player-video__display');
  var paused = html$a.find('.player-video__paused');
  var subtitles$1 = html$a.find('.player-video__subtitles');
  var timer$3 = {};
  var rewind_position = 0;
  var rewind_force = 0;
  var customsubs;

  var _video;

  var wait;
  var neeed_sacle;
  var webos;
  var hls;
  html$a.on('click', function () {
    if (Storage.get('navigation_type') == 'mouse') playpause();
  });
  /**
   * Добовляем события к контейнеру
   */

  function bind$2() {
    // ждем загрузки
    _video.addEventListener("waiting", function () {
      loader(true);
    }); // начали играть


    _video.addEventListener("playing", function () {
      loader(false);
    }); // видео закончилось


    _video.addEventListener('ended', function () {
      listener$8.send('ended', {});
    }); // что-то пошло не так


    _video.addEventListener('error', function (e) {
      var error = _video.error || {};
      var msg = (error.message || '').toUpperCase();

      if (msg.indexOf('EMPTY SRC') == -1) {
        if (error.code == 3) {
          listener$8.send('error', {
            error: '解码视频失败'
          });
        } else if (error.code == 4) {
          listener$8.send('error', {
            error: '视频未找到或损坏'
          });
        } else if (typeof error.code !== 'undefined') {
          listener$8.send('error', {
            error: 'code [' + error.code + '] details [' + msg + ']'
          });
        }
      }
    }); // прогресс буферизации


    _video.addEventListener('progress', function (e) {
      if (e.percent) {
        listener$8.send('progress', {
          down: e.percent
        });
      } else {
        var duration = _video.duration;

        if (duration > 0) {
          for (var i = 0; i < _video.buffered.length; i++) {
            if (_video.buffered.start(_video.buffered.length - 1 - i) < _video.currentTime) {
              var down = Math.max(0, Math.min(100, _video.buffered.end(_video.buffered.length - 1 - i) / duration * 100)) + "%";
              listener$8.send('progress', {
                down: down
              });
              break;
            }
          }
        }
      }
    }); // можно ли уже проигрывать?


    _video.addEventListener('canplay', function () {
      listener$8.send('canplay', {});
    }); // сколько прошло


    _video.addEventListener('timeupdate', function () {
      listener$8.send('timeupdate', {
        duration: _video.duration,
        current: _video.currentTime
      });
      scale();
      if (customsubs) customsubs.update(_video.currentTime);
    }); // обновляем субтитры


    _video.addEventListener('subtitle', function (e) {
      //В srt существует тег {\anX}, где X - цифра от 1 до 9, Тег определяет нестандартное положение субтитра на экране.
      //Здесь удаляется тег из строки и обрабатывается положение 8 (субтитр вверху по центру).
      //{\an8} используется когда нужно, чтобы субтитр не перекрывал надписи в нижней части экрана или субтитры вшитые в видеоряд.
      subtitles$1.removeClass('on-top');
      var posTag = e.text.match(/^{\\an(\d)}/);

      if (posTag) {
        e.text = e.text.replace(/^{\\an(\d)}/, '');

        if (posTag[1] && parseInt(posTag[1]) === 8) {
          subtitles$1.addClass('on-top');
        }
      }

      e.text = e.text.trim();
      $('> div', subtitles$1).html(e.text ? e.text : '&nbsp;').css({
        display: e.text ? 'inline-block' : 'hide'
      });
    });

    _video.addEventListener('loadedmetadata', function (e) {
      listener$8.send('videosize', {
        width: _video.videoWidth,
        height: _video.videoHeight
      });
      scale();
      loaded();
    }); // для страховки


    _video.volume = 1;
    _video.muted = false;
  }
  /**
   * Масштаб видео
   */


  function scale() {
    if (!neeed_sacle) return;
    var vw = _video.videoWidth,
        vh = _video.videoHeight,
        rt = 1,
        sx = 1.01,
        sy = 1.01;
    if (vw == 0 || vh == 0 || typeof vw == 'undefined') return;

    var increase = function increase(sfx, sfy) {
      rt = Math.min(window.innerWidth / vw, window.innerHeight / vh);
      sx = sfx;
      sy = sfy;
    };

    if (neeed_sacle == 'default') {
      rt = Math.min(window.innerWidth / vw, window.innerHeight / vh);
    } else if (neeed_sacle == 'fill') {
      rt = Math.min(window.innerWidth / vw, window.innerHeight / vh);
      sx = window.innerWidth / (vw * rt);
      sy = window.innerHeight / (vh * rt);
    } else if (neeed_sacle == 's115') {
      increase(1.15, 1.15);
    } else if (neeed_sacle == 's130') {
      increase(1.34, 1.34);
    } else if (neeed_sacle == 'v115') {
      increase(1.01, 1.15);
    } else if (neeed_sacle == 'v130') {
      increase(1.01, 1.34);
    } else {
      rt = Math.min(window.innerWidth / vw, window.innerHeight / vh);
      vw = vw * rt;
      vh = vh * rt;
      rt = Math.max(window.innerWidth / vw, window.innerHeight / vh);
      sx = rt;
      sy = rt;
    }

    sx = sx.toFixed(2);
    sy = sy.toFixed(2);

    if (Platform.is('orsay') || Storage.field('player_scale_method') == 'calculate') {
      var nw = vw * rt,
          nh = vh * rt;
      var sz = {
        width: Math.round(nw * sx) + 'px',
        height: Math.round(nh * sy) + 'px',
        marginLeft: Math.round(window.innerWidth / 2 - nw * sx / 2) + 'px',
        marginTop: Math.round(window.innerHeight / 2 - nh * sy / 2) + 'px'
      };
    } else {
      var sz = {
        width: Math.round(window.innerWidth) + 'px',
        height: Math.round(window.innerHeight) + 'px',
        transform: 'scaleX(' + sx + ') scaleY(' + sy + ')'
      };
    }

    $(_video).css(sz);
    neeed_sacle = false;
  }
  /**
   * Смотрим есть ли дорожки и сабы
   */


  function loaded() {
    var tracks = _video.audioTracks;
    var subs = _video.customSubs || _video.textTracks;
    if (webos && webos.sourceInfo) tracks = [];

    if (tracks && tracks.length) {
      if (!Arrays.isArray(tracks)) {
        var new_tracks = [];

        for (var index = 0; index < tracks.length; index++) {
          new_tracks.push(tracks[index]);
        }

        tracks = new_tracks;
      }

      listener$8.send('tracks', {
        tracks: tracks
      });
    }

    if (subs && subs.length) {
      if (!Arrays.isArray(subs)) {
        var new_subs = [];

        for (var _index = 0; _index < subs.length; _index++) {
          new_subs.push(subs[_index]);
        }

        subs = new_subs;
      }

      listener$8.send('subs', {
        subs: subs
      });
    }
  }

  function customSubs(subs) {
    _video.customSubs = subs;
    customsubs = new create$f();
    customsubs.listener.follow('subtitle', function (e) {
      $('> div', subtitles$1).html(e.text ? e.text : '&nbsp;').css({
        display: e.text ? 'inline-block' : 'hide'
      });
    });
    subs.forEach(function (sub) {
      if (!sub.ready) {
        sub.ready = true;
        Object.defineProperty(sub, "mode", {
          set: function set(v) {
            if (v == 'showing') {
              customsubs.load(sub.url);
            }
          },
          get: function get() {}
        });
      }
    });
  }
  /**
   * Включить или выключить субтитры
   * @param {Boolean} status 
   */


  function subsview(status) {
    subtitles$1.toggleClass('hide', !status);
  }
  /**
   * Применяет к блоку субтитров пользовательские настройки
   */


  function applySubsSettings() {
    var hasStroke = Storage.field('subtitles_stroke'),
        hasBackdrop = Storage.field('subtitles_backdrop'),
        size = Storage.field('subtitles_size');
    subtitles$1.removeClass('has--stroke has--backdrop size--normal size--large size--small');
    subtitles$1.addClass('size--' + size);

    if (hasStroke) {
      subtitles$1.addClass('has--stroke');
    }

    if (hasBackdrop) {
      subtitles$1.addClass('has--backdrop');
    }
  }
  /**
   * Создать контейнер для видео
   */


  function create$e() {
    var videobox;

    if (Platform.is('tizen') && Storage.field('player') == 'tizen') {
      videobox = create$i(function (object) {
        _video = object;
      });
    } else {
      videobox = $('<video class="player-video__video" poster="./img/video_poster.png" crossorigin="anonymous"></video>');
      _video = videobox[0];
    }

    applySubsSettings();
    display.append(videobox);

    if (Platform.is('webos') && !webos) {
      webos = new create$g(_video);

      webos.callback = function () {
        var src = _video.src;
        var sub = _video.customSubs;
        console.log('WebOS', 'video loaded');
        $(_video).remove();
        url$2(src);
        _video.customSubs = sub;
        webos.repet(_video);
        listener$8.send('reset_continue', {});
      };

      webos.start();
    }

    bind$2();
  }
  /**
   * Показать згразку или нет
   * @param {Boolean} status 
   */


  function loader(status) {
    wait = status;
    html$a.toggleClass('video--load', status);
  }
  /**
   * Устанавливаем ссылку на видео
   * @param {String} src 
   */


  function url$2(src) {
    loader(true);

    if (hls) {
      hls.destroy();
      hls = false;
    }

    create$e();

    if (/.m3u8/.test(src) && typeof Hls !== 'undefined') {
      if (navigator.userAgent.toLowerCase().indexOf('maple') > -1) src += '|COMPONENT=HLS';
      if (_video.canPlayType('application/vnd.apple.mpegurl')) load$1(src);else if (Hls.isSupported()) {
        try {
          hls = new Hls();
          hls.attachMedia(_video);
          hls.loadSource(src);
          hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
              if (data.reason === "no EXTM3U delimiter") {
                load$1(src);
              }
            }
          });
          hls.on(Hls.Events.MANIFEST_LOADED, function () {
            play$1();
          });
        } catch (e) {
          console.log('Player', 'HLS play error:', e.message);
          load$1(src);
        }
      } else load$1(src);
    } else load$1(src);
  }

  function load$1(src) {
    _video.src = src;

    _video.load();

    play$1();
  }
  /**
   * Играем
   */


  function play$1() {
    var playPromise;

    try {
      playPromise = _video.play();
    } catch (e) {}

    if (playPromise !== undefined) {
      playPromise.then(function () {
        console.log('Player', 'start plaining');
      })["catch"](function (e) {
        console.log('Player', 'play promise error:', e.message);
      });
    }

    paused.addClass('hide');
    listener$8.send('play', {});
  }
  /**
   * Пауза
   */


  function pause() {
    var pausePromise;

    try {
      pausePromise = _video.pause();
    } catch (e) {}

    if (pausePromise !== undefined) {
      pausePromise.then(function () {
        console.log('Player', 'pause');
      })["catch"](function (e) {
        console.log('Player', 'pause promise error:', e.message);
      });
    }

    paused.removeClass('hide');
    listener$8.send('pause', {});
  }
  /**
   * Играем или пауза
   */


  function playpause() {
    if (wait || rewind_position) return;

    if (_video.paused) {
      play$1();
      listener$8.send('play', {});
    } else {
      pause();
      listener$8.send('pause', {});
    }
  }
  /**
   * Завершаем перемотку
   * @param {Boolean} immediately - завершить немедленно
   */


  function rewindEnd(immediately) {
    clearTimeout(timer$3.rewind_call);
    timer$3.rewind_call = setTimeout(function () {
      _video.currentTime = rewind_position;
      rewind_position = 0;
      rewind_force = 0;
      play$1();
      if (webos) webos.rewinded();
    }, immediately ? 0 : 500);
  }
  /**
   * Подготовка к перемотке
   * @param {Int} position_time - новое время
   * @param {Boolean} immediately - завершить немедленно
   */


  function rewindStart(position_time, immediately) {
    if (!_video.duration) return;
    rewind_position = Math.max(0, Math.min(position_time, _video.duration));
    pause();
    if (rewind_position == 0) _video.currentTime = 0;else if (rewind_position == _video.duration) _video.currentTime = _video.duration;
    timer$3.rewind = Date.now();
    listener$8.send('timeupdate', {
      duration: _video.duration,
      current: rewind_position
    });
    listener$8.send('rewind', {});
    rewindEnd(immediately);
  }
  /**
   * Начать перематывать
   * @param {Boolean} forward - направление, true - вперед
   * @param {Int} custom_step - свое значение в секундах
   */


  function rewind(forward, custom_step) {
    if (_video.duration) {
      var time = Date.now(),
          step = _video.duration / (30 * 60),
          mini = time - (timer$3.rewind || 0) > 50 ? 20 : 60;

      if (rewind_position == 0) {
        rewind_force = Math.min(mini, custom_step || 30 * step);
        rewind_position = _video.currentTime;
      }

      rewind_force *= 1.03;

      if (forward) {
        rewind_position += rewind_force;
      } else {
        rewind_position -= rewind_force;
      }

      rewindStart(rewind_position);
    }
  }
  /**
   * 视频大小, масштаб
   * @param {String} type 
   */


  function size(type) {
    neeed_sacle = type;
    scale();
    if (_video.size) _video.size(type);
  }
  /**
   * Перемотка на позицию 
   * @param {Float} type 
   */


  function to(seconds) {
    pause();
    if (seconds == -1) _video.currentTime = _video.duration;else _video.currentTime = seconds;
    play$1();
  }
  /**
   * Уничтожить
   */


  function destroy$5() {
    subsview(false);
    neeed_sacle = false;
    paused.addClass('hide');
    if (webos) webos.destroy();
    webos = null;

    if (hls) {
      hls.destroy();
      hls = false;
    }

    if (customsubs) {
      customsubs.destroy();
      customsubs = false;
    }

    if (_video) {
      if (_video.destroy) _video.destroy();else {
        _video.src = "";

        _video.load();
      }
    }

    display.empty();
    loader(false);
  }

  function render$8() {
    return html$a;
  }

  var Video = {
    listener: listener$8,
    url: url$2,
    render: render$8,
    destroy: destroy$5,
    playpause: playpause,
    rewind: rewind,
    play: play$1,
    pause: pause,
    size: size,
    subsview: subsview,
    customSubs: customSubs,
    to: to,
    video: function video() {
      return _video;
    }
  };

  var html$9 = Template.get('player_info');
  var listener$7 = start$4();
  var network$3 = new create$r();
  var elems = {
    name: $('.player-info__name', html$9),
    size: $('.value--size span', html$9),
    stat: $('.value--stat span', html$9),
    speed: $('.value--speed span', html$9),
    error: $('.player-info__error', html$9)
  };
  var error, stat_timer;
  Utils.time(html$9);
  /**
   * Установить значение
   * @param {String} need 
   * @param {*} value 
   */

  function set$2(need, value) {
    if (need == 'name') elems.name.html(value);else if (need == 'size') elems.size.text(value.width + 'x' + value.height);else if (need == 'error') {
      clearTimeout(error);
      elems.error.removeClass('hide').text(value);
      error = setTimeout(function () {
        elems.error.addClass('hide');
      }, 5000);
    } else if (need == 'stat') stat$1(value);
  }
  /**
   * Показываем статистику по торренту
   * @param {*} url 
   */


  function stat$1(url) {
    var wait = 0;
    elems.stat.text('- / - • - 种子');
    elems.speed.text('--');

    var update = function update() {
      // если панель скрыта, то зачем каждую секунду чекать? хватит и 5 сек
      // проверено, если ставить на паузу, разадача удаляется, но если чекать постоянно, то все норм
      if (!html$9.hasClass('info--visible')) {
        wait++;
        if (wait <= 5) return;else wait = 0;
      }

      network$3.timeout(2000);
      network$3.silent(url.replace('preload', 'stat').replace('play', 'stat'), function (data) {
        elems.stat.text((data.active_peers || 0) + ' / ' + (data.total_peers || 0) + ' • ' + (data.connected_seeders || 0) + ' seeds');
        elems.speed.text(data.download_speed ? Utils.bytesToSize(data.download_speed * 8, true) + '/s' : '0.0');
        listener$7.send('stat', {
          data: data
        });
      });
    };

    stat_timer = setInterval(update, 2000);
    update();
  }
  /**
   * Показать скрыть инфо
   * @param {Boolean} status 
   */


  function toggle$5(status) {
    html$9.toggleClass('info--visible', status);
  }
  /**
   * Уничтожить
   */


  function destroy$4() {
    elems.size.text('正在加载...');
    elems.stat.text('');
    elems.speed.text('');
    elems.error.addClass('hide');
    clearTimeout(error);
    clearInterval(stat_timer);
    network$3.clear();
  }

  function render$7() {
    return html$9;
  }

  var Info = {
    listener: listener$7,
    render: render$7,
    set: set$2,
    toggle: toggle$5,
    destroy: destroy$4
  };

  var listener$6 = start$4();
  var current = '';
  var playlist$1 = [];
  var position$1 = 0;
  /**
   * Показать плейлист
   */

  function show$1() {
    active$3();
    var enabled = Controller.enabled();
    Select.show({
      title: '播放列表',
      items: playlist$1,
      onSelect: function onSelect(a) {
        Controller.toggle(enabled.name);
        listener$6.send('select', {
          item: a
        });
      },
      onBack: function onBack() {
        Controller.toggle(enabled.name);
      }
    });
  }
  /**
   * Установить активным
   */


  function active$3() {
    playlist$1.forEach(function (element) {
      element.selected = element.url == current;
      if (element.selected) position$1 = playlist$1.indexOf(element);
    });
  }
  /**
   * Назад
   */


  function prev() {
    active$3();

    if (position$1 > 1) {
      listener$6.send('select', {
        item: playlist$1[position$1 - 1]
      });
    }
  }
  /**
   * Далее
   */


  function next() {
    active$3();

    if (position$1 < playlist$1.length - 1) {
      listener$6.send('select', {
        item: playlist$1[position$1 + 1]
      });
    }
  }
  /**
   * Установить плейлист
   * @param {Array} p 
   */


  function set$1(p) {
    playlist$1 = p;
  }
  /**
   * Установить текуший урл
   * @param {String} u 
   */


  function url$1(u) {
    current = u;
  }

  var Playlist = {
    listener: listener$6,
    show: show$1,
    url: url$1,
    set: set$1,
    prev: prev,
    next: next
  };

  var widgetAPI,
      tvKey,
      pluginAPI,
      orsay_loaded,
      orsay_call = Date.now();

  function init$b() {
    $('body').append($("<div style=\"position: absolute; left: -1000px; top: -1000px;\">\n    <object id=\"pluginObjectNNavi\" border=\"0\" classid=\"clsid:SAMSUNG-INFOLINK-NNAVI\" style=\"opacity: 0.0; background-color: #000; width: 1px; height: 1px;\"></object>\n    <object id=\"pluginObjectTVMW\" border=\"0\" classid=\"clsid:SAMSUNG-INFOLINK-TVMW\" style=\"opacity: 0.0; background-color: #000; width: 1px; height: 1px;\"></object>\n    <object id=\"pluginObjectSef\" border=\"0\" classid=\"clsid:SAMSUNG-INFOLINK-SEF\" style=\"opacity:0.0;background-color:#000;width:1px;height:1px;\"></object>\n</div>"));
    Utils.putScript(['$MANAGER_WIDGET/Common/API/Widget.js', '$MANAGER_WIDGET/Common/API/TVKeyValue.js', '$MANAGER_WIDGET/Common/API/Plugin.js'], function () {
      try {
        if (typeof Common !== 'undefined' && Common.API && Common.API.TVKeyValue && Common.API.Plugin && Common.API.Widget) {
          widgetAPI = new Common.API.Widget();
          tvKey = new Common.API.TVKeyValue();
          pluginAPI = new Common.API.Plugin();
          window.onShow = orsayOnshow;
          setTimeout(function () {
            orsayOnshow();
          }, 2000);
          widgetAPI.sendReadyEvent();
        } else {
          if (orsay_call + 5 * 1000 > Date.now()) setTimeout(orsayOnLoad, 50);
        }
      } catch (e) {}
    });
  }

  function orsayOnshow() {
    if (orsay_loaded) return;
    orsay_loaded = true;

    try {
      //Включает анимацию изменения громкости на ТВ и т.д.
      pluginAPI.SetBannerState(1); //Отключает перехват кнопок, этими кнопками управляет система ТВ

      pluginAPI.unregistKey(tvKey.KEY_INFO);
      pluginAPI.unregistKey(tvKey.KEY_TOOLS);
      pluginAPI.unregistKey(tvKey.KEY_MENU);
      pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
      pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
      pluginAPI.unregistKey(tvKey.KEY_MUTE);
    } catch (e) {}
  }

  function exit() {
    widgetAPI.sendReturnEvent();
  }

  var Orsay = {
    init: init$b,
    exit: exit
  };

  var enabled$2 = false;
  var listener$5 = start$4();
  var lastdown = 0;
  var timer$2;
  var longpress;

  function toggle$4(new_status) {
    enabled$2 = new_status;
    listener$5.send('toggle', {
      status: enabled$2
    });
  }

  function enable$2() {
    toggle$4(true);
  }

  function disable$1() {
    toggle$4(false);
  }

  function isEnter(keycode) {
    return keycode == 13 || keycode == 29443 || keycode == 117 || keycode == 65385;
  }

  function keyCode(e) {
    var keycode;

    if (window.event) {
      keycode = e.keyCode;
    } else if (e.which) {
      keycode = e.which;
    }

    return keycode;
  }

  function init$a() {
    window.addEventListener("keydown", function (e) {
      lastdown = keyCode(e);

      if (!timer$2) {
        timer$2 = setTimeout(function () {
          if (isEnter(lastdown)) {
            longpress = true;
            listener$5.send('longdown', {});
            Controller["long"]();
          }
        }, 800);
      }
    });
    window.addEventListener("keyup", function (e) {
      clearTimeout(timer$2);
      timer$2 = null;
      listener$5.send('keyup', {
        code: keyCode(e),
        enabled: enabled$2,
        event: e
      });

      if (!longpress) {
        if (isEnter(keyCode(e)) && !e.defaultPrevented) Controller.enter();
      } else longpress = false;
    });
    window.addEventListener("keydown", function (e) {
      var keycode = keyCode(e); //console.log('Keypdad', 'keydown: ', keycode, Date.now() - time)
      listener$5.send('keydown', {
        code: keycode,
        enabled: enabled$2,
        event: e
      });
      if (e.defaultPrevented) return;
      if (isEnter(keycode)) return;
      if (!enabled$2) return; //отключить все
      //4 - Samsung orsay

      if (keycode == 37 || keycode == 4) {
        Controller.move('left');
      } //29460 - Samsung orsay


      if (keycode == 38 || keycode == 29460) {
        Controller.move('up');
      } //5 - Samsung orsay


      if (keycode == 39 || keycode == 5) {
        Controller.move('right');
      } //5 - Samsung orsay
      //29461 - Samsung orsay


      if (keycode == 40 || keycode == 29461) {
        Controller.move('down');
      } //33 - LG; 427 - Samsung


      if (keycode == 33 || keycode == 427) {
        Controller.move('toup');
      } //34 - LG; 428 - Samsung


      if (keycode == 34 || keycode == 428) {
        Controller.move('todown');
      } //Абсолютный Enter
      //10252 - Samsung tizen


      if (keycode == 32 || keycode == 179 || keycode == 10252) {
        Controller.trigger('playpause');
      } //Samsung media
      //71 - Samsung orsay


      if (keycode == 415 || keycode == 71) {
        Controller.trigger('play');
      } //Samsung stop


      if (keycode == 413) {
        Controller.trigger('stop');
      } //69 - Samsung orsay


      if (keycode == 412 || keycode == 69 || keycode == 177) {
        Controller.trigger('rewindBack');
      } //72 - Samsung orsay


      if (keycode == 418 || keycode == 417 || keycode == 72 || keycode == 176) {
        Controller.trigger('rewindForward');
      } //74 - Samsung orsay


      if (keycode == 19 || keycode == 74) {
        Controller.trigger('pause');
      }

      if (keycode == 457) {
        Controller.trigger('info');
      } //E-Manual


      if (keycode == 10146) {
        e.preventDefault();
      }

      if (keycode == 10133) {
        Controller.toggle('settings');
      } //Кнопка назад
      //8 - браузер
      //27
      //461 - LG
      //10009 - Samsung
      //88 - Samsung orsay


      if (keycode == 8 || keycode == 27 || keycode == 461 || keycode == 10009 || keycode == 88) {
        e.preventDefault();
        Activity$1.back();
        return false;
      } //Exit orsay


      if (keycode == 45) {
        Orsay.exit();
      }

      e.preventDefault();
    });
  }

  var Keypad = {
    listener: listener$5,
    init: init$a,
    enable: enable$2,
    disable: disable$1
  };

  var listener$4 = start$4();
  var enabled$1 = false;
  var worked = false;
  var chrome = false;
  var img;
  var html$8 = Template.get('screensaver');
  var movies = [];
  var timer$1 = {};
  var position = 0;
  var slides$1 = 'one';
  var direct = ['lt', 'rt', 'br', 'lb', 'ct'];
  html$8.on('click', function () {
    if (isWorked()) stopSlideshow();
  });

  function toggle$3(is_enabled) {
    enabled$1 = is_enabled;
    if (enabled$1) resetTimer();else clearTimeout(timer$1.wait);
    listener$4.send('toggle', {
      status: enabled$1
    });
  }

  function enable$1() {
    toggle$3(true);
  }

  function disable() {
    toggle$3(false);
  }

  function resetTimer() {
    if (!enabled$1) return;
    clearTimeout(timer$1.wait);
    if (!Storage.field('screensaver')) return;
    timer$1.wait = setTimeout(function () {
      if (Storage.field('screensaver_type') == 'nature') startSlideshow();else if (Storage.field('screensaver_type') == 'chrome') startChrome();else if (movies.length === 0) {
        Api.screensavers(function (data) {
          movies = data;
          startSlideshow();
        }, resetTimer);
      } else {
        startSlideshow();
      }
    }, 300 * 1000); //300 * 1000 = 5 минут
  }

  function startChrome() {
    worked = true;
    chrome = $('<div class="screensaver-chrome"><iframe src="https://clients3.google.com/cast/chromecast/home" class="screensaver-chrome__iframe"></iframe><div class="screensaver-chrome__overlay"></div></div>');
    $('body').append(chrome);
  }

  function startSlideshow() {
    if (!Storage.field('screensaver')) return;
    worked = true;
    html$8.fadeIn(300);
    Utils.time(html$8);
    nextSlide();
    timer$1.work = setInterval(function () {
      nextSlide();
    }, 30000);
    timer$1.start = setTimeout(function () {
      html$8.addClass('visible');
    }, 5000);
  }

  function nextSlide() {
    var movie = movies[position];
    var image = Storage.field('screensaver_type') == 'nature' ? 'https://source.unsplash.com/1600x900/?nature&order_by=relevant&v=' + Math.random() : Api.img(movie.backdrop_path, 'original');
    img = null;
    img = new Image();
    img.src = image;

    img.onload = function () {
      var to = $('.screensaver__slides-' + (slides$1 == 'one' ? 'two' : 'one'), html$8);
      to[0].src = img.src;
      to.removeClass(direct.join(' ') + ' animate').addClass(direct[Math.floor(Math.random() * direct.length)]);
      setTimeout(function () {
        $('.screensaver__title', html$8).removeClass('visible');
        $('.screensaver__slides-' + slides$1, html$8).removeClass('visible');
        slides$1 = slides$1 == 'one' ? 'two' : 'one';
        to.addClass('visible').addClass('animate');

        if (movie) {
          setTimeout(function () {
            $('.screensaver__title-name', html$8).text(movie.title || movie.name);
            $('.screensaver__title-tagline', html$8).text(movie.original_title || movie.original_name);
            $('.screensaver__title', html$8).addClass('visible');
          }, 500);
        }
      }, 3000);
    };

    img.onerror = function (e) {
      console.error(e);
    };

    position++;
    if (position >= movies.length) position = 0;
  }

  function stopSlideshow() {
    setTimeout(function () {
      worked = false;
    }, 300);
    html$8.fadeOut(300, function () {
      html$8.removeClass('visible');
    });
    clearInterval(timer$1.work);
    clearTimeout(timer$1.start);
    movies = [];

    if (chrome) {
      chrome.remove();
      chrome = false;
    }
  }

  function init$9() {
    $('body').append(html$8);
    resetTimer();
    Keypad.listener.follow('keydown', function (e) {
      resetTimer();

      if (worked) {
        stopSlideshow();
        e.event.preventDefault(); //чтобы при выходе из скринсейвера не нажалось что-ниубдь в ui
      }
    });
    Keypad.listener.follow('keyup', function (e) {
      if (worked) e.event.preventDefault();
    });
  }

  function isWorked() {
    return enabled$1 ? worked : enabled$1;
  }

  function render$6() {
    return html$8;
  }

  var Screensaver = {
    listener: listener$4,
    init: init$9,
    enable: enable$1,
    render: render$6,
    disable: disable,
    isWorked: isWorked
  };

  var network$2 = new create$r();

  function url() {
    var u = ip();
    return u ? Utils.checkHttp(u) : u;
  }

  function ip() {
    return Storage.get(Storage.field('torrserver_use_link') == 'two' ? 'torrserver_url_two' : 'torrserver_url');
  }

  function my(success, fail) {
    var data = JSON.stringify({
      action: 'list'
    });
    clear$1();
    network$2.silent(url() + '/torrents', function (result) {
      if (result.length) success(result);else fail();
    }, fail, data);
  }

  function add$4(object, success, fail) {
    var data = JSON.stringify({
      action: 'add',
      link: object.link,
      title: '[LAMPA]' + (object.title + '').replace('??', '?'),
      poster: object.poster,
      data: object.data ? JSON.stringify(object.data) : '',
      save_to_db: true
    });
    clear$1();
    network$2.silent(url() + '/torrents', success, fail, data);
  }

  function hash$1(object, success, fail) {
    var data = JSON.stringify({
      action: 'add',
      link: object.link,
      title: '[LAMPA]' + (object.title + '').replace('??', '?'),
      poster: object.poster,
      data: object.data ? JSON.stringify(object.data) : '',
      save_to_db: Storage.get('torrserver_savedb', 'false')
    });
    clear$1();
    network$2.silent(url() + '/torrents', success, function (a, c) {
      fail(network$2.errorDecode(a, c));
    }, data);
  }

  function files$1(hash, success, fail) {
    var data = JSON.stringify({
      action: 'get',
      hash: hash
    });
    clear$1();
    network$2.timeout(2000);
    network$2.silent(url() + '/torrents', function (json) {
      if (json.file_stats) {
        success(json);
      }
    }, fail, data);
  }

  function connected(success, fail) {
    clear$1();
    network$2.timeout(5000);
    network$2.silent(url() + '/settings', function (json) {
      if (typeof json.CacheSize == 'undefined') {
        fail('无法验证 Matrix 版本');
      } else {
        success(json);
      }
    }, function (a, c) {
      fail(network$2.errorDecode(a, c));
    }, JSON.stringify({
      action: 'get'
    }));
  }

  function stream(path, hash, id) {
    return url() + '/stream/' + encodeURIComponent(path.split('\\').pop().split('/').pop()) + '?link=' + hash + '&index=' + id + '&' + (Storage.field('torrserver_preload') ? 'preload' : 'play');
  }

  function drop(hash, success, fail) {
    var data = JSON.stringify({
      action: 'drop',
      hash: hash
    });
    clear$1();
    network$2.silent(url() + '/torrents', success, fail, data, {
      dataType: 'text'
    });
  }

  function remove(hash, success, fail) {
    var data = JSON.stringify({
      action: 'rem',
      hash: hash
    });
    clear$1();
    network$2.silent(url() + '/torrents', success, fail, data, {
      dataType: 'text'
    });
  }

  function parse(file_path, movie, is_file) {
    var path = file_path.toLowerCase();
    var data = {
      hash: '',
      season: 0,
      episode: 0,
      serial: movie.number_of_seasons ? true : false
    };
    var math = path.match(/s([0-9]+)\.?ep?([0-9]+)/);
    if (!math) math = path.match(/s([0-9]{2})([0-9]+)/);
    if (!math) math = path.match(/[ |\[|(]([0-9]{1,2})x([0-9]+)/);

    if (!math) {
      math = path.match(/[ |\[|(]([0-9]{1,3}) of ([0-9]+)/);
      if (math) math = [0, 1, math[1]];
    }

    if (!math) {
      math = path.match(/ep?([0-9]+)/);
      if (math) math = [0, 0, math[1]];
    }

    if (is_file) {
      data.hash = Utils.hash(file_path);
    } else if (math && movie.number_of_seasons) {
      data.season = parseInt(math[1]);
      data.episode = parseInt(math[2]);

      if (data.season === 0) {
        math = path.match(/s([0-9]+)/);
        if (math) data.season = parseInt(math[1]);
      }

      if (data.episode === 0) {
        math = path.match(/ep?([0-9]+)/);
        if (math) data.episode = parseInt(math[1]);
      }

      if (isNaN(data.season)) data.season = 0;
      if (isNaN(data.episode)) data.episode = 0;

      if (data.season && data.episode) {
        data.hash = [Utils.hash(movie.original_title), data.season, data.episode].join('_');
      } else if (data.episode) {
        data.season = 1;
        data.hash = [Utils.hash(movie.original_title), data.season, data.episode].join('_');
      } else {
        hash$1 = Utils.hash(file_path);
      }
    } else if (movie.original_title && !data.serial) {
      data.hash = Utils.hash(movie.original_title);
    } else {
      data.hash = Utils.hash(file_path);
    }

    return data;
  }

  function clear$1() {
    network$2.clear();
  }

  var Torserver = {
    ip: ip,
    my: my,
    add: add$4,
    url: url,
    hash: hash$1,
    files: files$1,
    clear: clear$1,
    drop: drop,
    stream: stream,
    remove: remove,
    connected: connected,
    parse: parse
  };

  var html$7 = Template.get('player');
  html$7.append(Video.render());
  html$7.append(Panel.render());
  html$7.append(Info.render());
  var callback$2;
  var work = false;
  var network$1 = new create$r();
  var preloader = {
    wait: false
  };
  html$7.on('mousemove', function () {
    if (Storage.get('navigation_type') == 'mouse') Panel.mousemove();
  });
  /**
   * Подписываемся на события
   */

  Video.listener.follow('timeupdate', function (e) {
    Panel.update('time', Utils.secondsToTime(e.current | 0, true));
    Panel.update('timenow', Utils.secondsToTime(e.current || 0));
    Panel.update('timeend', Utils.secondsToTime(e.duration || 0));
    Panel.update('position', e.current / e.duration * 100 + '%');

    if (work && work.timeline && e.duration) {
      if (Storage.field('player_timecode') == 'continue' && !work.timeline.continued) {
        var prend = e.duration - 15,
            posit = Math.round(e.duration * work.timeline.percent / 100);
        if (posit > 10) Video.to(posit > prend ? prend : posit);
        work.timeline.continued = true;
      } else {
        work.timeline.percent = Math.round(e.current / e.duration * 100);
      }
    }
  });
  Video.listener.follow('progress', function (e) {
    Panel.update('peding', e.down);
  });
  Video.listener.follow('canplay', function (e) {
    Panel.canplay();
  });
  Video.listener.follow('play', function (e) {
    Screensaver.disable();
    Panel.update('play');
  });
  Video.listener.follow('pause', function (e) {
    Screensaver.enable();
    Panel.update('pause');
  });
  Video.listener.follow('rewind', function (e) {
    Panel.rewind();
  });
  Video.listener.follow('ended', function (e) {
    if (Storage.field('playlist_next')) Playlist.next();
  });
  Video.listener.follow('tracks', function (e) {
    Panel.setTracks(e.tracks);
  });
  Video.listener.follow('subs', function (e) {
    Panel.setSubs(e.subs);
  });
  Video.listener.follow('videosize', function (e) {
    Info.set('size', e);
  });
  Video.listener.follow('error', function (e) {
    Info.set('error', e.error);
  });
  Video.listener.follow('reset_continue', function (e) {
    if (work && work.timeline) work.timeline.continued = false;
  });
  Panel.listener.follow('mouse_rewind', function (e) {
    var vid = Video.video();

    if (vid && vid.duration) {
      e.time.removeClass('hide').text(Utils.secondsToTime(vid.duration * e.percent)).css('left', e.percent * 100 + '%');

      if (e.method == 'click') {
        Video.to(vid.duration * e.percent);
      }
    }
  });
  Panel.listener.follow('playpause', function (e) {
    Video.playpause();
  });
  Panel.listener.follow('playlist', function (e) {
    Playlist.show();
  });
  Panel.listener.follow('size', function (e) {
    Video.size(e.size);
    Storage.set('player_size', e.size);
  });
  Panel.listener.follow('prev', function (e) {
    Playlist.prev();
  });
  Panel.listener.follow('next', function (e) {
    Playlist.next();
  });
  Panel.listener.follow('rprev', function (e) {
    Video.rewind(false);
  });
  Panel.listener.follow('rnext', function (e) {
    Video.rewind(true);
  });
  Panel.listener.follow('subsview', function (e) {
    Video.subsview(e.status);
  });
  Panel.listener.follow('visible', function (e) {
    Info.toggle(e.status);
  });
  Panel.listener.follow('to_start', function (e) {
    Video.to(0);
  });
  Panel.listener.follow('to_end', function (e) {
    Video.to(-1);
  });
  Playlist.listener.follow('select', function (e) {
    destroy$3();
    play(e.item);
    if (e.item.url.indexOf(Torserver.ip()) > -1) Info.set('stat', e.item.url);
  });
  Info.listener.follow('stat', function (e) {
    if (preloader.wait) {
      var pb = e.data.preloaded_bytes || 0,
          ps = e.data.preload_size || 0;
      var progress = Math.min(100, pb * 100 / ps);
      Panel.update('timenow', Math.round(progress) + '%');
      Panel.update('timeend', 100 + '%');
      Panel.update('peding', progress + '%');

      if (progress >= 90 || isNaN(progress)) {
        Panel.update('peding', '0%');
        preloader.wait = false;
        preloader.call();
      }
    }
  });
  /**
   * Главный контроллер
   */

  function toggle$2() {
    Controller.add('player', {
      invisible: true,
      toggle: function toggle() {
        Panel.hide();
      },
      up: function up() {
        Panel.toggle();
      },
      down: function down() {
        Panel.toggle();
      },
      right: function right() {
        Video.rewind(true);
      },
      left: function left() {
        Video.rewind(false);
      },
      gone: function gone() {},
      enter: function enter() {
        Video.playpause();
      },
      playpause: function playpause() {
        Video.playpause();
      },
      play: function play() {
        Video.play();
      },
      pause: function pause() {
        Video.pause();
      },
      rewindForward: function rewindForward() {
        Video.rewind(true);
      },
      rewindBack: function rewindBack() {
        Video.rewind(false);
      },
      back: backward$1
    });
    Controller.toggle('player');
  }

  function togglePreload() {
    Controller.add('player_preload', {
      invisible: true,
      toggle: function toggle() {},
      enter: function enter() {
        Panel.update('peding', '0%');
        preloader.wait = false;
        preloader.call();
      },
      back: backward$1
    });
    Controller.toggle('player_preload');
  }

  function backward$1() {
    destroy$3();
    if (callback$2) callback$2();else Controller.toggle('content');
    callback$2 = false;
  }
  /**
   * Уничтожить
   */


  function destroy$3() {
    if (work.timeline) work.timeline.handler(work.timeline.percent);
    work = false;
    preloader.wait = false;
    preloader.call = null;
    Screensaver.enable();
    Video.destroy();
    Panel.destroy();
    Info.destroy();
    html$7.detach();
  }

  function runWebOS(params) {
    webOS.service.request("luna://com.webos.applicationManager", {
      method: "launch",
      parameters: {
        "id": params.need,
        "params": {
          "payload": [{
            "fullPath": params.url,
            "artist": "",
            "subtitle": "",
            "dlnaInfo": {
              "flagVal": 4096,
              "cleartextSize": "-1",
              "contentLength": "-1",
              "opVal": 1,
              "protocolInfo": "http-get:*:video/x-matroska:DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000",
              "duration": 0
            },
            "mediaType": "VIDEO",
            "thumbnail": "",
            "deviceType": "DMR",
            "album": "",
            "fileName": params.name,
            "lastPlayPosition": -1
          }]
        }
      },
      onSuccess: function onSuccess() {
        console.log("The app is launched");
      },
      onFailure: function onFailure(inError) {
        console.log('Player', "Failed to launch the app (" + params.need + "): ", "[" + inError.errorCode + "]: " + inError.errorText);

        if (params.need == 'com.webos.app.photovideo') {
          params.need = 'com.webos.app.smartshare';
          runWebOS(params);
        } else if (params.need == 'com.webos.app.smartshare') {
          params.need = 'com.webos.app.mediadiscovery';
          runWebOS(params);
        }
      }
    });
  }

  function preload(data, call) {
    if (data.url.indexOf(Torserver.ip()) > -1 && data.url.indexOf('&preload') > -1) {
      preloader.wait = true;
      Info.set('name', data.title);
      $('body').append(html$7);
      Panel.show(true);
      togglePreload();
      network$1.timeout(2000);
      network$1.silent(data.url);

      preloader.call = function () {
        data.url = data.url.replace('&preload', '&play');
        call();
      };
    } else call();
  }
  /**
   * Запустит плеер
   * @param {Object} data 
   */


  function play(data) {
    console.log('Player', 'url:', data.url);

    if (Platform.is('webos') && Storage.field('player') == 'webos') {
      data.url = data.url.replace('&preload', '&play');
      runWebOS({
        need: 'com.webos.app.photovideo',
        url: data.url,
        name: data.path || data.title
      });
    } else if (Platform.is('android') && Storage.field('player') == 'android') {
      data.url = data.url.replace('&preload', '&play');
      Android.openPlayer(data.url, data);
    } else {
      preload(data, function () {
        work = data;
        if (work.timeline) work.timeline.continued = false;
        Playlist.url(data.url);
        Video.url(data.url);
        Video.size(Storage.get('player_size', 'default'));
        Info.set('name', data.title);
        if (!preloader.call) $('body').append(html$7);
        toggle$2();
        Panel.show(true);
      });
    }
  }
  /**
   * Статистика
   * @param {String} url 
   */


  function stat(url) {
    if (work || preloader.wait) Info.set('stat', url);
  }
  /**
   * Установить плейлист
   * @param {Array} playlist 
   */


  function playlist(playlist) {
    if (work || preloader.wait) Playlist.set(playlist);
  }
  /**
   * Установить субтитры
   * @param {Array} subs 
   */


  function subtitles(subs) {
    if (work || preloader.wait) {
      Video.customSubs(subs);
    }
  }
  /**
   * Обратный вызов
   * @param {Function} back 
   */


  function onBack(back) {
    callback$2 = back;
  }

  function render$5() {
    return html$7;
  }

  var Player = {
    play: play,
    playlist: playlist,
    render: render$5,
    stat: stat,
    subtitles: subtitles,
    callback: onBack
  };

  function create$d(data) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var html;
    var last;
    var tbtn;

    var follow = function follow(e) {
      if (e.name == 'parser_use') {
        var status = Storage.get('parser_use');
        tbtn.toggleClass('selector', status).toggleClass('hide', !status);
      }
    };

    Arrays.extend(data.movie, {
      title: data.movie.name,
      original_title: data.movie.original_name,
      runtime: 0,
      img: data.movie.poster_path ? Api.img(data.movie.poster_path, 'w300') : 'img/img_broken.svg'
    });

    this.create = function () {
      var _this = this;

      var genres = (data.movie.genres || ['---']).slice(0, 3).map(function (a) {
        return Utils.capitalizeFirstLetter(a.name);
      }).join(', ');
      html = Template.get('full_start', {
        title: data.movie.title,
        original_title: data.movie.original_title,
        descr: Utils.substr(data.movie.overview || '无描述', 420),
        img: data.movie.img,
        time: Utils.secondsToTime(data.movie.runtime * 60, true),
        genres: genres,
        r_themovie: parseFloat((data.movie.vote_average || 0) + '').toFixed(1),
        seasons: data.movie.number_of_seasons,
        episodes: data.movie.number_of_episodes
      });

      if (data.movie.number_of_seasons) {
        html.find('.is--serial').removeClass('hide');
      }

      tbtn = html.find('.view--torrent');
      tbtn.on('hover:enter', function () {
        var query = data.movie.original_title;
        if (Storage.field('parse_lang') == 'ru' || !/\w{3}/.test(query)) query = data.movie.title;
        Activity$1.push({
          url: '',
          title: '种子',
          component: 'torrents',
          search: query,
          search_one: data.movie.title,
          search_two: data.movie.original_title,
          movie: data.movie,
          page: 1
        });
      });
      html.find('.info__icon').on('hover:enter', function (e) {
        var type = $(e.target).data('type');
        params.object.card = data.movie;
        params.object.card.source = params.object.source;
        Favorite.toggle(type, params.object.card);

        _this.favorite();
      });

      if (data.videos && data.videos.results.length) {
        html.find('.view--trailer').on('hover:enter', function () {
          var items = [];
          data.videos.results.forEach(function (element) {
            items.push({
              title: element.name,
              subtitle: element.official ? '官方' : '非官方',
              id: element.key,
              player: element.player,
              url: element.url
            });
          });
          Select.show({
            title: 'Trailers',
            items: items,
            onSelect: function onSelect(a) {
              _this.toggle();

              if (a.player) {
                Player.play(a);
                Player.playlist([a]);
              } else if (Platform.is('android')) {
                Android.openYoutube(a.id);
              } else YouTube.play(a.id);
            },
            onBack: function onBack() {
              Controller.toggle('full_start');
            }
          });
        });
      } else {
        html.find('.view--trailer').remove();
      }

      Background.immediately(Utils.cardImgBackground(data.movie));
      Storage.listener.follow('change', follow);
      follow({
        name: 'parser_use'
      });
      this.favorite();
    };

    this.groupButtons = function () {
      var buttons = html.find('.full-start__buttons > *').not('.full-start__icons,.info__rate,.open--menu,.view--torrent,.view--trailer');
      var max = 2;

      if (buttons.length > max) {
        buttons.hide(); //buttons = buttons.slice(-(buttons.length-max)).hide()

        html.find('.open--menu').on('hover:enter', function () {
          var enabled = Controller.enabled().name;
          var menu = [];
          var ready = {};
          buttons.each(function () {
            var name = $(this).find('span').text();

            if (ready[name]) {
              ready[name]++;
              name = name + ' ' + ready[name];
            } else {
              ready[name] = 1;
            }

            menu.push({
              title: name,
              subtitle: $(this).data('subtitle'),
              btn: $(this)
            });
          });
          Select.show({
            title: 'Watch',
            items: menu,
            onBack: function onBack() {
              Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              a.btn.trigger('hover:enter');
            }
          });
        });
      } else {
        html.find('.open--menu').hide();
      }
    };

    this.favorite = function () {
      var status = Favorite.check(params.object.card);
      $('.info__icon', html).removeClass('active');
      $('.icon--book', html).toggleClass('active', status.book);
      $('.icon--like', html).toggleClass('active', status.like);
      $('.icon--wath', html).toggleClass('active', status.wath);
    };

    this.toggleBackground = function () {
      Background.immediately(Utils.cardImgBackground(data.movie));
    };

    this.toggle = function () {
      var _this2 = this;

      Controller.add('full_start', {
        toggle: function toggle() {
          var btns = html.find('.full-start__buttons > *').not('.full-start__icons,.info__rate,.open--menu').filter(function () {
            return $(this).is(':visible');
          });
          Controller.collectionSet(_this2.render());
          Controller.collectionFocus(last || (btns.length ? btns.eq(0)[0] : $('.open--menu', html)[0]), _this2.render());
          /*
          let tb = html.find('.view--torrent'),
              tr = html.find('.view--trailer')
            Controller.collectionSet(this.render())
          Controller.collectionFocus(last || (!tb.hasClass('hide') ? tb[0] : !tr.hasClass('hide') && tr.length ? tr[0] : false), this.render())
          */
        },
        right: function right() {
          Navigator.move('right');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        down: this.onDown,
        up: this.onUp,
        gone: function gone() {},
        back: this.onBack
      });
      Controller.toggle('full_start');
    };

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      last = null;
      html.remove();
      Storage.listener.remove('change', follow);
    };
  }

  var html$6, active$2, scroll$2, last$3;

  function open$2(params) {
    active$2 = params;
    html$6 = Template.get('modal', {
      title: params.title
    });
    html$6.on('click', function (e) {
      if (!$(e.target).closest($('.modal__content', html$6)).length) window.history.back();
    });
    title$1(params.title);
    html$6.toggleClass('modal--medium', params.size == 'medium' ? true : false);
    html$6.toggleClass('modal--large', params.size == 'large' ? true : false);
    scroll$2 = new create$q({
      over: true,
      mask: params.mask
    });
    html$6.find('.modal__body').append(scroll$2.render());
    bind$1(params.html);
    scroll$2.append(params.html);
    $('body').append(html$6);
    toggle$1();
  }

  function bind$1(where) {
    where.find('.selector').on('hover:focus', function (e) {
      last$3 = e.target;
      scroll$2.update($(e.target));
    }).on('hover:enter', function (e) {
      if (active$2.onSelect) active$2.onSelect($(e.target));
    });
  }

  function jump(tofoward) {
    var select = scroll$2.render().find('.selector.focus');
    if (tofoward) select = select.nextAll().filter('.selector');else select = select.prevAll().filter('.selector');
    select = select.slice(0, 10);
    select = select.last();

    if (select.length) {
      Controller.collectionFocus(select[0], scroll$2.render());
    }
  }

  function toggle$1() {
    Controller.add('modal', {
      invisible: true,
      toggle: function toggle() {
        Controller.collectionSet(scroll$2.render());
        Controller.collectionFocus(last$3, scroll$2.render());
      },
      up: function up() {
        Navigator.move('up');
      },
      down: function down() {
        Navigator.move('down');
      },
      right: function right() {
        jump(true);
      },
      left: function left() {
        jump(false);
      },
      back: function back() {
        if (active$2.onBack) active$2.onBack();
      }
    });
    Controller.toggle('modal');
  }

  function update$3(new_html) {
    last$3 = false;
    scroll$2.clear();
    scroll$2.append(new_html);
    bind$1(new_html);
    toggle$1();
  }

  function title$1(tit) {
    html$6.find('.modal__title').text(tit);
    html$6.toggleClass('modal--empty-title', tit ? false : true);
  }

  function destroy$2() {
    last$3 = false;
    scroll$2.destroy();
    html$6.remove();
  }

  function close$1() {
    destroy$2();
  }

  var Modal = {
    open: open$2,
    close: close$1,
    update: update$3,
    title: title$1
  };

  function create$c(data) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var html, body, last;

    this.create = function () {
      html = Template.get('items_line', {
        title: '详细信息'
      });
      var genres = data.movie.genres.map(function (a) {
        return '<div class="full-descr__tag selector" data-genre="' + a.id + '" data-url="' + a.url + '">' + a.name + '</div>';
      }).join('');
      var companies = data.movie.production_companies.map(function (a) {
        return '<div class="full-descr__tag selector" data-company="' + a.id + '">' + a.name + '</div>';
      }).join('');
      var countries = data.movie.production_countries.map(function (a) {
        return a.name;
      }).join(', ');
      body = Template.get('full_descr', {
        text: (data.movie.overview || '无描述。') + '<br><br>',
        genres: genres,
        companies: companies,
        relise: data.movie.release_date || data.movie.first_air_date,
        budget: '$ ' + Utils.numberWithSpaces(data.movie.budget || 0),
        countries: countries
      });
      if (!genres) $('.full--genres', body).remove();
      if (!companies) $('.full--companies', body).remove();
      body.find('.selector').on('hover:enter', function (e) {
        var item = $(e.target);

        if (item.data('genre')) {
          var tmdb = params.object.source == 'tmdb' || params.object.source == 'cub';
          Activity$1.push({
            url: tmdb ? 'movie' : item.data('url'),
            component: tmdb ? 'category' : 'category_full',
            genres: item.data('genre'),
            source: params.object.source,
            page: 1
          });
        }

        if (item.data('company')) {
          Api.clear();
          Modal.open({
            title: '公司',
            html: Template.get('modal_loading'),
            size: 'medium',
            onBack: function onBack() {
              Modal.close();
              Controller.toggle('full_descr');
            }
          });
          Api.company({
            id: item.data('company')
          }, function (json) {
            if (Controller.enabled().name == 'modal') {
              Arrays.empty(json, {
                homepage: '---',
                origin_country: '---',
                headquarters: '---'
              });
              Modal.update(Template.get('company', json));
            }
          }, function () {});
        }
      }).on('hover:focus', function (e) {
        last = e.target;
      });
      html.find('.items-line__body').append(body);
    };

    this.toggle = function () {
      var _this = this;

      Controller.add('full_descr', {
        toggle: function toggle() {
          Controller.collectionSet(_this.render());
          Controller.collectionFocus(last, _this.render());
        },
        right: function right() {
          Navigator.move('right');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');else _this.onDown();
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else _this.onUp();
        },
        gone: function gone() {},
        back: this.onBack
      });
      Controller.toggle('full_descr');
    };

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      body.remove();
      html.remove();
      html = null;
      body = null;
    };
  }

  function create$b(persons, params) {
    var html, scroll, last;

    this.create = function () {
      html = Template.get('items_line', {
        title: params.title || '演员'
      });
      scroll = new create$q({
        horizontal: true,
        scroll_by_item: true
      });
      scroll.render().find('.scroll__body').addClass('full-persons');
      html.find('.items-line__body').append(scroll.render());
      persons.forEach(function (element) {
        var person = Template.get('full_person', {
          name: element.name,
          role: element.character || element.job,
          img: element.profile_path ? Api.img(element.profile_path) : element.img || './img/actor.svg'
        });
        person.on('hover:focus', function (e) {
          last = e.target;
          scroll.update($(e.target), true);
        }).on('hover:enter', function () {
          Activity$1.push({
            url: element.url,
            title: '人物',
            component: 'actor',
            id: element.id,
            source: params.object.source
          });
        });
        scroll.append(person);
      });
    };

    this.toggle = function () {
      var _this = this;

      Controller.add('full_descr', {
        toggle: function toggle() {
          Controller.collectionSet(_this.render());
          Controller.collectionFocus(last, _this.render());
        },
        right: function right() {
          Navigator.move('right');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        down: this.onDown,
        up: this.onUp,
        gone: function gone() {},
        back: this.onBack
      });
      Controller.toggle('full_descr');
    };

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      scroll.destroy();
      html.remove();
      html = null;
    };
  }

  function create$a(data) {
    var html, scroll, last;

    this.create = function () {
      html = Template.get('items_line', {
        title: '评论'
      });
      scroll = new create$q({
        horizontal: true
      });
      scroll.render().find('.scroll__body').addClass('full-reviews');
      html.find('.items-line__body').append(scroll.render());
      data.comments.forEach(function (element) {
        var review = Template.get('full_review', element);
        review.on('hover:focus', function (e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        scroll.append(review);
      });
    };

    this.toggle = function () {
      var _this = this;

      Controller.add('full_descr', {
        toggle: function toggle() {
          Controller.collectionSet(_this.render());
          Controller.collectionFocus(last, _this.render());
        },
        right: function right() {
          Navigator.move('right');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        down: this.onDown,
        up: this.onUp,
        gone: function gone() {},
        back: this.onBack
      });
      Controller.toggle('full_descr');
    };

    this.render = function () {
      return html;
    };
  }

  var components$1 = {
    start: create$d,
    descr: create$c,
    persons: create$b,
    recomend: create$m,
    simular: create$m,
    comments: create$a
  };

  function component$b(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true,
      step: 400,
      scroll_by_item: true
    });
    var items = [];
    var active = 0;
    scroll.render().addClass('layer--wheight');

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.full(object, function (data) {
        _this.activity.loader(false);

        if (data.movie) {
          Lampa.Listener.send('full', {
            type: 'start',
            object: object,
            data: data
          });

          _this.build('start', data);

          _this.build('descr', data);

          if (data.persons && data.persons.crew && data.persons.crew.length) {
            var directors = data.persons.crew.filter(function (member) {
              return member.job === 'Director';
            });

            if (directors.length) {
              _this.build('persons', directors, {
                title: '导演'
              });
            }
          }

          if (data.persons && data.persons.cast && data.persons.cast.length) _this.build('persons', data.persons.cast);
          if (data.comments && data.comments.length) _this.build('comments', data);

          if (data.recomend && data.recomend.results.length) {
            data.recomend.title = '推荐';
            data.recomend.noimage = true;

            _this.build('recomend', data.recomend);
          }

          if (data.simular && data.simular.results.length) {
            data.simular.title = '相关';
            data.simular.noimage = true;

            _this.build('simular', data.simular);
          }

          Lampa.Listener.send('full', {
            type: 'complite',
            object: object,
            data: data
          });
          items[0].groupButtons();

          _this.activity.toggle();
        } else {
          _this.empty();
        }
      }, this.empty.bind(this));
      return this.render();
    };

    this.empty = function () {
      var empty = new create$k();
      scroll.append(empty.render());
      this.start = empty.start;
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.build = function (name, data, params) {
      var item = new components$1[name](data, _objectSpread2({
        object: object,
        nomore: true
      }, params));
      item.onDown = this.down;
      item.onUp = this.up;
      item.onBack = this.back;
      item.create();
      items.push(item);
      Lampa.Listener.send('full', {
        type: 'build',
        name: name,
        body: item.render()
      });
      scroll.append(item.render());
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      items[active].toggle();
      scroll.update(items[active].render());
    };

    this.up = function () {
      active--;

      if (active < 0) {
        active = 0;
        Controller.toggle('head');
      } else {
        items[active].toggle();
      }

      scroll.update(items[active].render());
    };

    this.back = function () {
      Activity$1.backward();
    };

    this.start = function () {
      if (items.length) items[0].toggleBackground();
      Controller.add('content', {
        toggle: function toggle() {
          if (items.length) {
            items[active].toggle();
          }
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return scroll.render();
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      items = null;
      network = null;
    };
  }

  function component$a(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true,
      step: 250
    });
    var items = [];
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var total_pages = 0;
    var info;
    var last;
    var waitload;

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.list(object, this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.next = function () {
      var _this2 = this;

      if (waitload) return;

      if (object.page < 15 && object.page < total_pages) {
        waitload = true;
        object.page++;
        Api.list(object, function (result) {
          _this2.append(result);

          waitload = false;
          Controller.enable('content');
        }, function () {});
      }
    };

    this.append = function (data) {
      var _this3 = this;

      data.results.forEach(function (element) {
        var card = new create$o(element, {
          card_category: true,
          object: object
        });
        card.create();

        card.onFocus = function (target, card_data) {
          last = target;
          scroll.update(card.render(), true);
          Background.change(Utils.cardImgBackground(card_data));
          info.update(card_data);
          var maxrow = Math.ceil(items.length / 7) - 1;
          if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this3.next();
        };

        card.onEnter = function (target, card_data) {
          Activity$1.push({
            url: card_data.url,
            component: 'full',
            id: element.id,
            method: card_data.name ? 'tv' : 'movie',
            card: element,
            source: object.source
          });
        };

        card.visible();
        body.append(card.render());
        items.push(card);
      });
    };

    this.build = function (data) {
      total_pages = data.total_pages;
      info = new create$l();
      info.create();
      scroll.render().addClass('layer--wheight').data('mheight', info.render());
      html.append(info.render());
      html.append(scroll.render());
      this.append(data);
      scroll.append(body);
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        right: function right() {
          Navigator.move('right');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      if (info) info.destroy();
      html.remove();
      body.remove();
      network = null;
      items = null;
      html = null;
      body = null;
      info = null;
    };
  }

  function component$9(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true,
      scroll_by_item: true
    });
    var items = [];
    var html = $('<div></div>');
    var viewall = Storage.field('card_views_type') == 'view' || Storage.get('navigation_type') == 'mouse';
    var active = 0;
    var info;
    var lezydata;

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.category(object, this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.build = function (data) {
      lezydata = data;
      info = new create$l();
      info.create();
      scroll.render().addClass('layer--wheight').data('mheight', info.render());
      html.append(info.render());
      html.append(scroll.render());
      data.slice(0, viewall ? data.length : 2).forEach(this.append.bind(this));
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.append = function (element) {
      if (element.ready) return;
      element.ready = true;
      var item = new create$m(element, {
        url: element.url,
        card_small: true,
        genres: object.genres,
        object: object
      });
      item.create();
      item.onDown = this.down.bind(this);
      item.onUp = this.up;
      item.onFocus = info.update;
      item.onBack = this.back;
      item.onFocusMore = info.empty.bind(info);
      scroll.append(item.render());
      items.push(item);
    };

    this.back = function () {
      Activity$1.backward();
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      lezydata.slice(0, active + 2).forEach(this.append.bind(this));
      items[active].toggle();
      scroll.update(items[active].render());
    };

    this.up = function () {
      active--;

      if (active < 0) {
        active = 0;
        Controller.toggle('head');
      } else {
        items[active].toggle();
      }

      scroll.update(items[active].render());
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          if (items.length) {
            items[active].toggle();
          }
        },
        back: this.back
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      if (info) info.destroy();
      html.remove();
      html = null;
      network = null;
      lezydata = null;
    };
  }

  function create$9(data) {
    var html;
    var last;

    this.create = function () {
      html = Template.get('person_start', {
        name: data.name,
        birthday: data.birthday,
        descr: Utils.substr(data.biography, 1020),
        img: data.profile_path ? Api.img(data.profile_path) : data.img || 'img/img_broken.svg',
        place: data.place_of_birth
      });
    };

    this.toggle = function () {
      var _this = this;

      Controller.add('full_start', {
        toggle: function toggle() {
          Controller.collectionSet(_this.render());
          Controller.collectionFocus(last, _this.render());
        },
        right: function right() {
          Navigator.move('right');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        down: this.onDown,
        up: this.onUp,
        gone: function gone() {},
        back: this.onBack
      });
      Controller.toggle('full_start');
    };

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      last = null;
      html.remove();
    };
  }

  var components = {
    start: create$9,
    line: create$m
  };

  function component$8(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true
    });
    var items = [];
    var active = 0;
    scroll.render().addClass('layer--wheight');

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.person(object, function (data) {
        _this.activity.loader(false);

        if (data.person) {
          _this.build('start', data.person);

          if (data.credits && data.credits.knownFor && data.credits.knownFor.length > 0) {
            for (var i = 0; i < Math.min(data.credits.knownFor.length, 3); i++) {
              var departament = data.credits.knownFor[i];

              _this.build('line', {
                title: departament.name,
                noimage: true,
                results: departament.credits
              });
            }
          } else {
            //для обратной совместимости с иви и окко
            if (data.movie && data.movie.results.length) {
              data.movie.title = '电影';
              data.movie.noimage = true;

              _this.build('line', data.movie);
            }

            if (data.tv && data.tv.results.length) {
              data.tv.title = '电视节目';
              data.tv.noimage = true;

              _this.build('line', data.tv);
            }
          }

          _this.activity.toggle();
        } else {
          _this.empty();
        }
      }, this.empty.bind(this));
      return this.render();
    };

    this.empty = function () {
      var empty = new create$k();
      scroll.append(empty.render());
      this.start = empty.start;
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.build = function (name, data) {
      var item = new components[name](data, {
        object: object,
        nomore: true
      });
      item.onDown = this.down;
      item.onUp = this.up;
      item.onBack = this.back;
      item.create();
      items.push(item);
      scroll.append(item.render());
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      items[active].toggle();
      scroll.update(items[active].render());
    };

    this.up = function () {
      active--;

      if (active < 0) {
        active = 0;
        Controller.toggle('head');
      } else {
        items[active].toggle();
      }

      scroll.update(items[active].render());
    };

    this.back = function () {
      Activity$1.backward();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          if (items.length) {
            items[active].toggle();
          }
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return scroll.render();
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      items = null;
      network = null;
    };
  }

  function component$7(object) {
    var _this = this;

    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true,
      step: 250
    });
    var items = [];
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var total_pages = 0;
    var info;
    var last;
    var waitload;

    this.create = function () {
      this.activity.loader(true);
      Api.favorite(object, this.build.bind(this), this.empty.bind(this));
      return this.render();
    };

    this.empty = function () {
      var empty = new create$k();
      html.append(empty.render());
      _this.start = empty.start;

      _this.activity.loader(false);

      _this.activity.toggle();
    };

    this.next = function () {
      var _this2 = this;

      if (waitload) return;

      if (object.page < 15 && object.page < total_pages) {
        waitload = true;
        object.page++;
        Api.favorite(object, function (result) {
          _this2.append(result);

          waitload = false;
          Controller.enable('content');
        }, function () {});
      }
    };

    this.append = function (data) {
      var _this3 = this;

      data.results.forEach(function (element) {
        var card = new create$o(element, {
          card_category: true
        });
        card.create();

        card.onFocus = function (target, card_data) {
          last = target;
          scroll.update(card.render(), true);
          Background.change(Utils.cardImgBackground(card_data));
          info.update(card_data);
          var maxrow = Math.ceil(items.length / 7) - 1;
          if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this3.next();
        };

        card.onEnter = function (target, card_data) {
          Activity$1.push({
            url: card_data.url,
            component: 'full',
            id: element.id,
            method: card_data.name ? 'tv' : 'movie',
            card: element,
            source: card_data.source || 'tmdb'
          });
        };

        if (object.type == 'history') {
          card.onMenu = function (target, card_data) {
            var enabled = Controller.enabled().name;
            Select.show({
              title: '动作',
              items: [{
                title: '从历史记录中删除',
                subtitle: '删除选定的卡片',
                one: true
              }, {
                title: '清除历史记录',
                subtitle: '从历史记录中删除所有卡片',
                all: true
              }],
              onBack: function onBack() {
                Controller.toggle(enabled);
              },
              onSelect: function onSelect(a) {
                if (a.all) {
                  Favorite.clear('history');

                  _this3.clear();

                  html.empty();

                  _this3.empty();
                } else {
                  Favorite.clear('history', card_data);
                  var index = items.indexOf(card);
                  if (index > 0) last = items[index - 1].render()[0];else if (items[index + 1]) last = items[index + 1].render()[0];
                  Arrays.remove(items, card);
                  card.destroy();

                  if (!items.length) {
                    _this3.clear();

                    html.empty();

                    _this3.empty();
                  }
                }

                Controller.toggle(enabled);
              }
            });
          };
        }

        card.visible();
        body.append(card.render());
        items.push(card);
      });
    };

    this.build = function (data) {
      total_pages = data.total_pages;
      info = new create$l();
      info.create();
      scroll.render().addClass('layer--wheight').data('mheight', info.render());
      html.append(info.render());
      html.append(scroll.render());
      this.append(data);
      scroll.append(body);
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        right: function right() {
          Navigator.move('right');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.clear = function () {
      network.clear();
      Arrays.destroy(items);
      items = [];
      if (scroll) scroll.destroy();
      if (info) info.destroy();
      scroll = null;
      info = null;
    };

    this.destroy = function () {
      this.clear();
      html.remove();
      body.remove();
      network = null;
      items = null;
      html = null;
      body = null;
      info = null;
    };
  }

  function create$8() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var html = Template.get('files', params.movie);

    if (params.movie.id) {
      html.find('.selector').on('hover:enter', function () {
        Activity$1.push({
          url: params.movie.url,
          component: 'full',
          id: params.movie.id,
          method: params.movie.name ? 'tv' : 'movie',
          card: params.movie,
          source: params.movie.source
        });
      });
    } else {
      html.find('.selector').removeClass('selector');
    }

    this.render = function () {
      return html;
    };

    this.append = function (add) {
      html.find('.files__body').append(add);
    };

    this.destroy = function () {
      html.remove();
      html = null;
    };

    this.clear = function () {
      html.find('.files__body').empty();
    };
  }

  function create$7() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var search = Template.get('search_box');
    var input = '';

    function destroy() {
      keyboard.destroy();
      search.remove();
      search = null;
    }

    function back() {
      destroy();
      params.onBack();
    }

    function enter() {
      destroy();
      params.onSearch(input);
    }

    function change(text) {
      input = text.trim();

      if (input) {
        search.find('.search-box__input').text(input);
      } else {
        search.find('.search-box__input').text('输入文本...');
      }
    }

    $('body').append(search);
    var keyboard = new create$3({
      layout: {
        'default': ['1 2 3 4 5 6 7 8 9 0 - {bksp}', 'q w e r t y u i o p', 'a s d f g h j k l', 'z x c v b n m .', '{mic} {RU} {space} {search}'],
        'en': ['1 2 3 4 5 6 7 8 9 0 - {bksp}', 'й ц у к е н г ш щ з х ъ', 'ф ы в а п р о л д ж э', 'i hmitby .', '{mic} {EN} {space} {search}']
      }
    });
    keyboard.create();
    keyboard.listener.follow('change', function (event) {
      change(event.value);
    });
    keyboard.listener.follow('back', back);
    keyboard.listener.follow('enter', enter);
    keyboard.value(params.input);
    change(params.input);
    keyboard.toggle();
  }

  function create$6() {
    var _this2 = this;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var line = Template.get('filter');
    var empty = $('<div class="simple-button selector" style="margin: 2em auto 0 auto">优化您的搜索</div>');
    var data = {
      sort: [],
      filter: []
    };
    var similars = [];

    function selectSearch() {
      var _this = this;

      var selected = params.search_one == params.search ? 0 : params.search_two == params.search ? 1 : -1;
      var search = [];

      if (similars.length) {
        similars.forEach(function (sim) {
          search.push({
            title: sim,
            query: sim
          });
        });
      } else {
        if (params.search_one) {
          search.push({
            title: params.search_one,
            query: params.search_one,
            selected: selected == 0
          });
        }

        if (params.search_two) {
          search.push({
            title: params.search_two,
            query: params.search_two,
            selected: selected == 1
          });
        }
      }

      search.push({
        title: '指定标题',
        selected: selected == -1,
        query: ''
      });
      Select.show({
        title: 'Refine',
        items: search,
        onBack: this.onBack,
        onSelect: function onSelect(a) {
          if (!a.query) {
            new create$7({
              input: params.search,
              onSearch: _this.onSearch,
              onBack: _this.onBack
            });
          } else {
            _this.onSearch(a.query);
          }
        }
      });
    }

    empty.on('hover:enter', selectSearch.bind(this));
    line.find('.filter--search').on('hover:enter', selectSearch.bind(this));
    line.find('.filter--sort').on('hover:enter', function () {
      _this2.show('排序', 'sort');
    });
    line.find('.filter--filter').on('hover:enter', function () {
      _this2.show('过滤器', 'filter');
    });

    this.show = function (title, type) {
      var _this3 = this;

      var where = data[type];
      Select.show({
        title: title,
        items: where,
        onBack: this.onBack,
        onSelect: function onSelect(a) {
          _this3.selected(where, a);

          if (a.items) {
            Select.show({
              title: a.title,
              items: a.items,
              onBack: function onBack() {
                _this3.show(title, type);
              },
              onSelect: function onSelect(b) {
                _this3.selected(a.items, b);

                _this3.onSelect(type, a, b);

                _this3.show(title, type);
              },
              onCheck: function onCheck(b) {
                _this3.onCheck(type, a, b);
              }
            });
          } else {
            _this3.onSelect(type, a);
          }
        }
      });
    };

    this.selected = function (items, a) {
      items.forEach(function (element) {
        element.selected = false;
      });
      a.selected = true;
    };

    this.render = function () {
      return line;
    };

    this.append = function (add) {
      html.find('.files__body').append(add);
    };

    this.empty = function () {
      return empty;
    };

    this.toggle = function () {
      line.find('.filter--sort').toggleClass('selector', data.sort.length ? true : false).toggleClass('hide', data.sort.length ? false : true);
      line.find('.filter--filter').toggleClass('selector', data.filter.length ? true : false).toggleClass('hide', data.filter.length ? false : true);
    };

    this.set = function (type, items) {
      data[type] = items;
      this.toggle();
    };

    this.get = function (type) {
      return data[type];
    };

    this.similar = function (sim) {
      similars = sim;
      return empty;
    };

    this.sort = function (items, by) {
      items.sort(function (c, b) {
        if (c[by] < b[by]) return 1;
        if (c[by] > b[by]) return -1;
        return 0;
      });
    };

    this.chosen = function (type, select) {
      line.find('.filter--' + type + ' > div').text(Utils.shortText(select.join(', '), 25)).toggleClass('hide', select.length ? false : true);
    };

    this.destroy = function () {
      empty.remove();
      line.remove();
      empty = null;
      line = null;
      data = null;
    };
  }

  function update$2(params) {
    if (params.hash == 0) return;
    var viewed = Storage.cache('file_view', 10000, {});
    viewed[params.hash] = params.percent;
    Storage.set('file_view', viewed);
    var line = $('.time-line[data-hash="' + params.hash + '"]').toggleClass('hide', params.percent ? false : true);
    $('> div', line).css({
      width: params.percent + '%'
    });
  }

  function view(hash) {
    var viewed = Storage.cache('file_view', 10000, {}),
        curent = typeof viewed[hash] !== 'undefined' ? viewed[hash] : 0;
    return {
      hash: hash,
      percent: curent || 0,
      handler: function handler(percent) {
        return update$2({
          hash: hash,
          percent: percent
        });
      }
    };
  }

  function render$4(params) {
    var line = Template.get('timeline', params);
    line.toggleClass('hide', params.percent ? false : true);
    return line;
  }

  var Timeline = {
    render: render$4,
    update: update$2,
    view: view
  };

  var SERVER = {};
  var timers = {};
  var callback$1;
  var callback_back;
  var formats = ['asf', 'wmv', 'divx', 'avi', 'mp4', 'm4v', 'mov', '3gp', '3g2', 'mkv', 'trp', 'tp', 'mts', 'mpg', 'mpeg', 'dat', 'vob', 'rm', 'rmvb', 'm2ts', 'ts'];
  var formats_individual = ['vob', 'm2ts'];

  function start$3(element, movie) {
    SERVER.object = element;
    if (movie) SERVER.movie = movie;

    if (!Storage.field('internal_torrclient')) {
      openTorrent(SERVER);
      if (movie && movie.id) Favorite.add('history', movie, 100);
      if (callback$1) callback$1();
    } else if (Torserver.url()) {
      loading();
      connect$1();
    } else install();
  }

  function open$1(hash, movie) {
    SERVER.hash = hash;
    if (movie) SERVER.movie = movie;

    if (!Storage.field('internal_torrclient')) {
      playHash(SERVER);
      if (callback$1) callback$1();
    } else if (Torserver.url()) {
      loading();
      files();
    } else install();
  }

  function loading() {
    Modal.open({
      title: '',
      html: Template.get('modal_loading'),
      size: 'large',
      mask: true,
      onBack: function onBack() {
        Modal.close();
        close();
      }
    });
  }

  function connect$1() {
    Torserver.connected(function () {
      hash();
    }, function (echo) {
      var ip = Torserver.ip();
      var tpl = Template.get('torrent_noconnect', {
        title: 'Error',
        text: '连接 TorrServer 失败',
        ip: ip,
        href: window.location.href,
        echo: echo
      });

      if (!(ip.indexOf('127.') >= 0 || ip.indexOf(':8090') == -1)) {
        tpl.find('.nocorect').remove();
      }

      Modal.update(tpl);
    });
  }

  function hash() {
    Torserver.hash({
      title: SERVER.object.title,
      link: SERVER.object.MagnetUri || SERVER.object.Link,
      poster: SERVER.object.poster,
      data: {
        lampa: true,
        movie: SERVER.movie
      }
    }, function (json) {
      SERVER.hash = json.hash;
      files();
    }, function (echo) {
      var jac = Storage.field('parser_torrent_type') == 'jackett';
      var tpl = Template.get('torrent_nohash', {
        title: '错误',
        text: '获取 HASH 失败',
        url: SERVER.object.MagnetUri || SERVER.object.Link,
        echo: echo
      });
      if (jac) tpl.find('.is--torlook').remove();else tpl.find('.is--jackett').remove();
      Modal.update(tpl);
    });
  }

  function files() {
    var repeat = 0;
    timers.files = setInterval(function () {
      repeat++;
      Torserver.files(SERVER.hash, function (json) {
        if (json.file_stats) {
          clearInterval(timers.files);
          show(json.file_stats);
        }
      });

      if (repeat >= 45) {
        Modal.update(Template.get('error', {
          title: '错误',
          text: '超时'
        }));
        Torserver.clear();
        Torserver.drop(SERVER.hash);
      }
    }, 2000);
  }

  function install() {
    Modal.open({
      title: '需要 TorrServer',
      html: $('<div class="about"><div>Для просмотра торрента онлайн, необходимо установить TorrServer. Подробнее что такое TorrServer и как установить, вы можете 查找 на сайте https://github.com/YouROK/TorrServer</div></div>'),
      onBack: function onBack() {
        Modal.close();
        Controller.toggle('content');
      }
    });
  }

  function show(files) {
    var plays = files.filter(function (a) {
      var exe = a.path.split('.').pop().toLowerCase();
      return formats.indexOf(exe) >= 0;
    });
    var active = Activity$1.active(),
        movie = active.movie || SERVER.movie || {};
    var seasons = [];
    plays.forEach(function (element) {
      var info = Torserver.parse(element.path, movie);

      if (info.serial && info.season && seasons.indexOf(info.season) == -1) {
        seasons.push(info.season);
      }
    });

    if (seasons.length) {
      Api.seasons(movie, seasons, function (data) {
        list(plays, {
          movie: movie,
          seasons: data
        });
      });
    } else {
      list(plays, {
        movie: movie
      });
    }
  }

  function list(items, params) {
    var html = $('<div class="torrent-files"></div>');
    var playlist = [];
    items.forEach(function (element) {
      var exe = element.path.split('.').pop().toLowerCase();
      var info = Torserver.parse(element.path, params.movie, formats_individual.indexOf(exe) >= 0);
      var view = Timeline.view(info.hash);
      var item;
      Arrays.extend(element, {
        season: info.season,
        episode: info.episode,
        title: Utils.pathToNormalTitle(element.path),
        size: Utils.bytesToSize(element.length),
        url: Torserver.stream(element.path, SERVER.hash, element.id),
        timeline: view,
        air_date: '--',
        img: './img/img_broken.svg',
        exe: exe
      });

      if (params.seasons) {
        var episodes = params.seasons[info.season];
        element.title = info.episode + ' / ' + Utils.pathToNormalTitle(element.path, false);
        element.fname = element.title;

        if (episodes) {
          var episode = episodes.episodes.filter(function (a) {
            return a.episode_number == info.episode;
          })[0];

          if (episode) {
            element.title = info.episode + ' / ' + episode.name;
            element.air_date = episode.air_date;
            element.fname = episode.name;
            if (episode.still_path) element.img = Api.img(episode.still_path);else if (episode.img) element.img = episode.img;
          }
        }

        item = Template.get('torrent_file_serial', element);
      } else {
        item = Template.get('torrent_file', element);
        if (params.movie.title) element.title = params.movie.title;
      }

      item.append(Timeline.render(view));
      playlist.push(element);
      item.on('hover:enter', function () {
        if (params.movie.id) Favorite.add('history', params.movie, 100);
        Player.play(element);
        Player.callback(function () {
          Controller.toggle('modal');
        });
        Player.playlist(playlist);
        Player.stat(element.url);

        if (callback$1) {
          callback$1();
          callback$1 = false;
        }
      });
      html.append(item);
    });
    if (items.length == 0) html = Template.get('error', {
      title: '空',
      text: '获取匹配文件失败'
    });else Modal.title('文件');
    Modal.update(html);
  }

  function opened(call) {
    callback$1 = call;
  }

  function back$3(call) {
    callback_back = call;
  }

  function close() {
    Torserver.drop(SERVER.hash);
    Torserver.clear();
    clearInterval(timers.files);

    if (callback_back) {
      callback_back();
    } else {
      Controller.toggle('content');
    }

    callback_back = false;
    SERVER = {};
  }

  var Torrent = {
    start: start$3,
    open: open$1,
    opened: opened,
    back: back$3
  };

  function component$6(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true
    });
    var files = new create$8(object);
    var filter = new create$6(object);
    var results = [];
    var filtred = [];
    var total_pages = 1;
    var count = 0;
    var last;
    var last_filter;
    var filter_items = {
      quality: ['任意', '4k', '1080p', '720p'],
      hdr: ['未选中', '是', '否'],
      sub: ['未选中', '是', '否'],
      voice: [],
      tracker: ['任何'],
      year: ['任何']
    };
    var filter_translate = {
      quality: '质量',
      hdr: 'HDR',
      sub: '字幕',
      voice: '翻译',
      tracker: '跟踪器',
      year: '年份'
    };
    var filter_multiple = ['quality', 'voice', 'tracker'];
    var sort_translate = {
      Seeders: '按共享者',
      Size: '按大小',
      Title: '按标题',
      Tracker: '按来源',
      PublisTime: '按日期',
      viewed: '按查看'
    };
    var i = 20,
        y = new Date().getFullYear();

    while (i--) {
      filter_items.year.push(y - (19 - i) + '');
    }

    var viewed = Storage.cache('torrents_view', 5000, []);
    var voices = ["Laci", "Kerob", "LE-Production", "Parovoz Production", "Paradox", "Omskbird", "LostFilm", "Причудики", "BaibaKo", "NewStudio", "AlexFilm", "FocusStudio", "Gears Media", "Jaskier", "ViruseProject", "Кубик в Кубе", "IdeaFilm", "Sunshine Studio", "Ozz.tv", "Hamster Studio", "Сербин", "To4ka", "Кравец", "Victory-Films", "SNK-TV", "GladiolusTV", "Jetvis Studio", "ApofysTeam", "ColdFilm", "Agatha Studdio", "KinoView", "Jimmy J.", "Shadow Dub Project", "Amedia", "Red Media", "Selena International", "Гоблин", "Universal Russia", "Kiitos", "Paramount Comedy", "Кураж-Бамбей", "Студия Пиратского Дубляжа", "Чадов", "Карповский", "RecentFilms", "Первый канал", "Alternative Production", "NEON Studio", "Колобок", "Дольский", "Синема УС", "Гаврилов", "Живов", "SDI Media", "Алексеев", "GreenРай Studio", "Михалев", "Есарев", "Визгунов", "Либергал", "Кузнецов", "Санаев", "ДТВ", "Дохалов", "Sunshine Studio", "Горчаков", "LevshaFilm", "CasStudio", "Володарский", "ColdFilm", "Шварко", "Карцев", "ETV+", "ВГТРК", "Gravi-TV", "1001cinema", "Zone Vision Studio", "Хихикающий доктор", "Murzilka", "turok1990", "FOX", "STEPonee", "Elrom", "Колобок", "HighHopes", "SoftBox", "GreenРай Studio", "NovaFilm", "Четыре в квадрате", "Greb&Creative", "MUZOBOZ", "ZM-Show", "RecentFilms", "Kerems13", "Hamster Studio", "New Dream Media", "Игмар", "Котов", "DeadLine Studio", "Jetvis Studio", "РенТВ", "Андрей Питерский", "Fox Life", "Рыбин", "Trdlo.studio", "Studio Victory Аsia", "Ozeon", "НТВ", "CP Digital", "AniLibria", "STEPonee", "Levelin", "FanStudio", "Cmert", "Интерфильм", "SunshineStudio", "Kulzvuk Studio", "Кашкин", "Вартан Дохалов", "Немахов", "Sedorelli", "СТС", "Яроцкий", "ICG", "ТВЦ", "Штейн", "AzOnFilm", "SorzTeam", "Гаевский", "Мудров", "Воробьев Сергей", "Студия Райдо", "DeeAFilm Studio", "zamez", "ViruseProject", "Иванов", "STEPonee", "РенТВ", "СВ-Дубль", "BadBajo", "Комедия ТВ", "Мастер Тэйп", "5-й канал СПб", "SDI Media", "Гланц", "Ох! Студия", "СВ-Кадр", "2x2", "Котова", "Позитив", "RusFilm", "Назаров", "XDUB Dorama", "Реальный перевод", "Kansai", "Sound-Group", "Николай Дроздов", "ZEE TV", "Ozz.tv", "MTV", "Сыендук", "GoldTeam", "Белов", "Dream Records", "Яковлев", "Vano", "SilverSnow", "Lord32x", "Filiza Studio", "Sony Sci-Fi", "Flux-Team", "NewStation", "XDUB Dorama", "Hamster Studio", "Dream Records", "DexterTV", "ColdFilm", "Good People", "RusFilm", "Levelin", "AniDUB", "SHIZA Project", "AniLibria.TV", "StudioBand", "AniMedia", "Kansai", "Onibaku", "JWA Project", "MC Entertainment", "Oni", "Jade", "Ancord", "ANIvoice", "Nika Lenina", "Bars MacAdams", "JAM", "Anika", "Berial", "Kobayashi", "Cuba77", "RiZZ_fisher", "OSLIKt", "Lupin", "Ryc99", "Nazel & Freya", "Trina_D", "JeFerSon", "Vulpes Vulpes", "Hamster", "KinoGolos", "Fox Crime", "Денис Шадинский", "AniFilm", "Rain Death", "LostFilm", "New Records", "Ancord", "Первый ТВЧ", "RG.Paravozik", "Profix Media", "Tycoon", "RealFake", "HDrezka", "Jimmy J.", "AlexFilm", "Discovery", "Viasat History", "AniMedia", "JAM", "HiWayGrope", "Ancord", "СВ-Дубль", "Tycoon", "SHIZA Project", "GREEN TEA", "STEPonee", "AlphaProject", "AnimeReactor", "Animegroup", "Shachiburi", "Persona99", "3df voice", "CactusTeam", "AniMaunt", "AniMedia", "AnimeReactor", "ShinkaDan", "Jaskier", "ShowJet", "RAIM", "RusFilm", "Victory-Films", "АрхиТеатр", "Project Web Mania", "ko136", "КураСгречей", "AMS", "СВ-Студия", "Храм Дорам ТВ", "TurkStar", "Медведев", "Рябов", "BukeDub", "FilmGate", "FilmsClub", "Sony Turbo", "ТВЦ", "AXN Sci-Fi", "NovaFilm", "DIVA Universal", "Курдов", "Неоклассика", "fiendover", "SomeWax", "Логинофф", "Cartoon Network", "Sony Turbo", "Loginoff", "CrezaStudio", "Воротилин", "LakeFilms", "Andy", "CP Digital", "XDUB Dorama + Колобок", "SDI Media", "KosharaSerials", "Екатеринбург Арт", "Julia Prosenuk", "АРК-ТВ Studio", "Т.О Друзей", "Anifilm", "Animedub", "AlphaProject", "Paramount Channel", "Кириллица", "AniPLague", "Видеосервис", "JoyStudio", "HighHopes", "TVShows", "AniFilm", "GostFilm", "West Video", "Формат AB", "Film Prestige", "West Video", "Екатеринбург Арт", "SovetRomantica", "РуФилмс", "AveBrasil", "Greb&Creative", "BTI Studios", "Пифагор", "Eurochannel", "NewStudio", "Кармен Видео", "Кошкин", "Кравец", "Rainbow World", "Воротилин", "Варус-Видео", "ClubFATE", "HiWay Grope", "Banyan Studio", "Mallorn Studio", "Asian Miracle Group", "Эй Би Видео", "AniStar", "Korean Craze", "LakeFilms", "Невафильм", "Hallmark", "Netflix", "Mallorn Studio", "Sony Channel", "East Dream", "Bonsai Studio", "Lucky Production", "Octopus", "TUMBLER Studio", "CrazyCatStudio", "Amber", "Train Studio", "Анастасия Гайдаржи", "Мадлен Дюваль", "Fox Life", "Sound Film", "Cowabunga Studio", "Фильмэкспорт", "VO-Production", "Sound Film", "Nickelodeon", "MixFilm", "GreenРай Studio", "Sound-Group", "Back Board Cinema", "Кирилл Сагач", "Bonsai Studio", "Stevie", "OnisFilms", "MaxMeister", "Syfy Universal", "TUMBLER Studio", "NewStation", "Neo-Sound", "Муравский", "IdeaFilm", "Рутилов", "Тимофеев", "Лагута", "Дьяконов", "Zone Vision Studio", "Onibaku", "AniMaunt", "Voice Project", "AniStar", "Пифагор", "VoicePower", "StudioFilms", "Elysium", "AniStar", "BeniAffet", "Selena International", "Paul Bunyan", "CoralMedia", "Кондор", "Игмар", "ViP Premiere", "FireDub", "AveTurk", "Sony Sci-Fi", "Янкелевич", "Киреев", "Багичев", "2x2", "Лексикон", "Нота", "Arisu", "Superbit", "AveDorama", "VideoBIZ", "Киномания", "DDV", "Alternative Production", "WestFilm", "Анастасия Гайдаржи + Андрей Юрченко", "Киномания", "Agatha Studdio", "GreenРай Studio", "VSI Moscow", "Horizon Studio", "Flarrow Films", "Amazing Dubbing", "Asian Miracle Group", "Видеопродакшн", "VGM Studio", "FocusX", "CBS Drama", "NovaFilm", "Novamedia", "East Dream", "Дасевич", "Анатолий Гусев", "Twister", "Морозов", "NewComers", "kubik&ko", "DeMon", "Анатолий Ашмарин", "Inter Video", "Пронин", "AMC", "Велес", "Volume-6 Studio", "Хоррор Мэйкер", "Ghostface", "Sephiroth", "Акира", "Деваль Видео", "RussianGuy27", "neko64", "Shaman", "Franek Monk", "Ворон", "Andre1288", "Selena International", "GalVid", "Другое кино", "Студия NLS", "Sam2007", "HaseRiLLoPaW", "Севастьянов", "D.I.M.", "Марченко", "Журавлев", "Н-Кино", "Lazer Video", "SesDizi", "Red Media", "Рудой", "Товбин", "Сергей Дидок", "Хуан Рохас", "binjak", "Карусель", "Lizard Cinema", "Варус-Видео", "Акцент", "RG.Paravozik", "Max Nabokov", "Barin101", "Васька Куролесов", "Фортуна-Фильм", "Amalgama", "AnyFilm", "Студия Райдо", "Козлов", "Zoomvision Studio", "Пифагор", "Urasiko", "VIP Serial HD", "НСТ", "Кинолюкс", "Project Web Mania", "Завгородний", "AB-Video", "Twister", "Universal Channel", "Wakanim", "SnowRecords", "С.Р.И", "Старый Бильбо", "Ozz.tv", "Mystery Film", "РенТВ", "Латышев", "Ващенко", "Лайко", "Сонотек", "Psychotronic", "DIVA Universal", "Gremlin Creative Studio", "Нева-1", "Максим Жолобов", "Good People", "Мобильное телевидение", "Lazer Video", "IVI", "DoubleRec", "Milvus", "RedDiamond Studio", "Astana TV", "Никитин", "КТК", "D2Lab", "НСТ", "DoubleRec", "Black Street Records", "Останкино", "TatamiFilm", "Видеобаза", "Crunchyroll", "Novamedia", "RedRussian1337", "КонтентикOFF", "Creative Sound", "HelloMickey Production", "Пирамида", "CLS Media", "Сонькин", "Мастер Тэйп", "Garsu Pasaulis", "DDV", "IdeaFilm", "Gold Cinema", "Че!", "Нарышкин", "Intra Communications", "OnisFilms", "XDUB Dorama", "Кипарис", "Королёв", "visanti-vasaer", "Готлиб", "Paramount Channel", "СТС", "диктор CDV", "Pazl Voice", "Прямостанов", "Zerzia", "НТВ", "MGM", "Дьяков", "Вольга", "АРК-ТВ Studio", "Дубровин", "МИР", "Netflix", "Jetix", "Кипарис", "RUSCICO", "Seoul Bay", "Филонов", "Махонько", "Строев", "Саня Белый", "Говинда Рага", "Ошурков", "Horror Maker", "Хлопушка", "Хрусталев", "Антонов Николай", "Золотухин", "АрхиАзия", "Попов", "Ultradox", "Мост-Видео", "Альтера Парс", "Огородников", "Твин", "Хабар", "AimaksaLTV", "ТНТ", "FDV", "3df voice", "The Kitchen Russia", "Ульпаней Эльром", "Видеоимпульс", "GoodTime Media", "Alezan", "True Dubbing Studio", "FDV", "Карусель", "Интер", "Contentica", "Мельница", "RealFake", "ИДДК", "Инфо-фильм", "Мьюзик-трейд", "Кирдин | Stalk", "ДиоНиК", "Стасюк", "TV1000", "Hallmark", "Тоникс Медиа", "Бессонов", "Gears Media", "Бахурани", "NewDub", "Cinema Prestige", "Набиев", "New Dream Media", "ТВ3", "Малиновский Сергей", "Superbit", "Кенс Матвей", "LE-Production", "Voiz", "Светла", "Cinema Prestige", "JAM", "LDV", "Videogram", "Индия ТВ", "RedDiamond Studio", "Герусов", "Элегия фильм", "Nastia", "Семыкина Юлия", "Электричка", "Штамп Дмитрий", "Пятница", "Oneinchnales", "Gravi-TV", "D2Lab", "Кинопремьера", "Бусов Глеб", "LE-Production", "1001cinema", "Amazing Dubbing", "Emslie", "1+1", "100 ТВ", "1001 cinema", "2+2", "2х2", "3df voice", "4u2ges", "5 канал", "A. Lazarchuk", "AAA-Sound", "AB-Video", "AdiSound", "ALEKS KV", "AlexFilm", "AlphaProject", "Alternative Production", "Amalgam", "AMC", "Amedia", "AMS", "Andy", "AniLibria", "AniMedia", "Animegroup", "Animereactor", "AnimeSpace Team", "Anistar", "AniUA", "AniWayt", "Anything-group", "AOS", "Arasi project", "ARRU Workshop", "AuraFilm", "AvePremier", "AveTurk", "AXN Sci-Fi", "Azazel", "AzOnFilm", "BadBajo", "BadCatStudio", "BBC Saint-Petersburg", "BD CEE", "Black Street Records", "Bonsai Studio", "Boльгa", "Brain Production", "BraveSound", "BTI Studios", "Bubble Dubbing Company", "Byako Records", "Cactus Team", "Cartoon Network", "CBS Drama", "CDV", "Cinema Prestige", "CinemaSET GROUP", "CinemaTone", "ColdFilm", "Contentica", "CP Digital", "CPIG", "Crunchyroll", "Cuba77", "D1", "D2lab", "datynet", "DDV", "DeadLine", "DeadSno", "DeMon", "den904", "Description", "DexterTV", "Dice", "Discovery", "DniproFilm", "DoubleRec", "DreamRecords", "DVD Classic", "East Dream", "Eladiel", "Elegia", "ELEKTRI4KA", "Elrom", "ELYSIUM", "Epic Team", "eraserhead", "erogg", "Eurochannel", "Extrabit", "F-TRAIN", "Family Fan Edition", "FDV", "FiliZa Studio", "Film Prestige", "FilmGate", "FilmsClub", "FireDub", "Flarrow Films", "Flux-Team", "FocusStudio", "FOX", "Fox Crime", "Fox Russia", "FoxLife", "Foxlight", "Franek Monk", "Gala Voices", "Garsu Pasaulis", "Gears Media", "Gemini", "General Film", "GetSmart", "Gezell Studio", "Gits", "GladiolusTV", "GoldTeam", "Good People", "Goodtime Media", "GoodVideo", "GostFilm", "Gramalant", "Gravi-TV", "GREEN TEA", "GreenРай Studio", "Gremlin Creative Studio", "Hallmark", "HamsterStudio", "HiWay Grope", "Horizon Studio", "hungry_inri", "ICG", "ICTV", "IdeaFilm", "IgVin &amp; Solncekleshka", "ImageArt", "INTERFILM", "Ivnet Cinema", "IНТЕР", "Jakob Bellmann", "JAM", "Janetta", "Jaskier", "JeFerSon", "jept", "JetiX", "Jetvis", "JimmyJ", "KANSAI", "KIHO", "kiitos", "KinoGolos", "Kinomania", "KosharaSerials", "Kолобок", "L0cDoG", "LakeFilms", "LDV", "LE-Production", "LeDoyen", "LevshaFilm", "LeXiKC", "Liga HQ", "Line", "Lisitz", "Lizard Cinema Trade", "Lord32x", "lord666", "LostFilm", "Lucky Production", "Macross", "madrid", "Mallorn Studio", "Marclail", "Max Nabokov", "MC Entertainment", "MCA", "McElroy", "Mega-Anime", "Melodic Voice Studio", "metalrus", "MGM", "MifSnaiper", "Mikail", "Milirina", "MiraiDub", "MOYGOLOS", "MrRose", "MTV", "Murzilka", "MUZOBOZ", "National Geographic", "NemFilm", "Neoclassica", "NEON Studio", "New Dream Media", "NewComers", "NewStation", "NewStudio", "Nice-Media", "Nickelodeon", "No-Future", "NovaFilm", "Novamedia", "Octopus", "Oghra-Brown", "OMSKBIRD", "Onibaku", "OnisFilms", "OpenDub", "OSLIKt", "Ozz TV", "PaDet", "Paramount Comedy", "Paramount Pictures", "Parovoz Production", "PashaUp", "Paul Bunyan", "Pazl Voice", "PCB Translate", "Persona99", "PiratVoice", "Postmodern", "Profix Media", "Project Web Mania", "Prolix", "QTV", "R5", "Radamant", "RainDeath", "RATTLEBOX", "RealFake", "Reanimedia", "Rebel Voice", "RecentFilms", "Red Media", "RedDiamond Studio", "RedDog", "RedRussian1337", "Renegade Team", "RG Paravozik", "RinGo", "RoxMarty", "Rumble", "RUSCICO", "RusFilm", "RussianGuy27", "Saint Sound", "SakuraNight", "Satkur", "Sawyer888", "Sci-Fi Russia", "SDI Media", "Selena", "seqw0", "SesDizi", "SGEV", "Shachiburi", "SHIZA", "ShowJet", "Sky Voices", "SkyeFilmTV", "SmallFilm", "SmallFilm", "SNK-TV", "SnowRecords", "SOFTBOX", "SOLDLUCK2", "Solod", "SomeWax", "Sony Channel", "Sony Turbo", "Sound Film", "SpaceDust", "ssvss", "st.Elrom", "STEPonee", "SunshineStudio", "Superbit", "Suzaku", "sweet couple", "TatamiFilm", "TB5", "TF-AniGroup", "The Kitchen Russia", "The Mike Rec.", "Timecraft", "To4kaTV", "Tori", "Total DVD", "TrainStudio", "Troy", "True Dubbing Studio", "TUMBLER Studio", "turok1990", "TV 1000", "TVShows", "Twister", "Twix", "Tycoon", "Ultradox", "Universal Russia", "VashMax2", "VendettA", "VHS", "VicTeam", "VictoryFilms", "Video-BIZ", "Videogram", "ViruseProject", "visanti-vasaer", "VIZ Media", "VO-production", "Voice Project Studio", "VoicePower", "VSI Moscow", "VulpesVulpes", "Wakanim", "Wayland team", "WestFilm", "WiaDUB", "WVoice", "XL Media", "XvidClub Studio", "zamez", "ZEE TV", "Zendos", "ZM-SHOW", "Zone Studio", "Zone Vision", "Агапов", "Акопян", "Алексеев", "Артемьев", "Багичев", "Бессонов", "Васильев", "Васильцев", "Гаврилов", "Герусов", "Готлиб", "Григорьев", "Дасевич", "Дольский", "Карповский", "Кашкин", "Киреев", "Клюквин", "Костюкевич", "Матвеев", "Михалев", "Мишин", "Мудров", "Пронин", "Савченко", "Смирнов", "Тимофеев", "Толстобров", "Чуев", "Шуваев", "Яковлев", "ААА-sound", "АБыГДе", "Акалит", "Акира", "Альянс", "Амальгама", "АМС", "АнВад", "Анубис", "Anubis", "Арк-ТВ", "АРК-ТВ Studio", "Б. Федоров", "Бибиков", "Бигыч", "Бойков", "Абдулов", "Белов", "Вихров", "Воронцов", "Горчаков", "Данилов", "Дохалов", "Котов", "Кошкин", "Назаров", "Попов", "Рукин", "Рутилов", "Варус Видео", "Васька Куролесов", "Ващенко С.", "Векшин", "Велес", "Весельчак", "Видеоимпульс", "Витя «говорун»", "Войсовер", "Вольга", "Ворон", "Воротилин", "Г. Либергал", "Г. Румянцев", "Гей Кино Гид", "ГКГ", "Глуховский", "Гризли", "Гундос", "Деньщиков", "Есарев", "Нурмухаметов", "Пучков", "Стасюк", "Шадинский", "Штамп", "sf@irat", "Держиморда", "Домашний", "ДТВ", "Дьяконов", "Е. Гаевский", "Е. Гранкин", "Е. Лурье", "Е. Рудой", "Е. Хрусталёв", "ЕА Синема", "Екатеринбург Арт", "Живаго", "Жучков", "З Ранку До Ночі", "Завгородний", "Зебуро", "Зереницын", "И. Еремеев", "И. Клушин", "И. Сафронов", "И. Степанов", "ИГМ", "Игмар", "ИДДК", "Имидж-Арт", "Инис", "Ирэн", "Ист-Вест", "К. Поздняков", "К. Филонов", "К9", "Карапетян", "Кармен Видео", "Карусель", "Квадрат Малевича", "Килька", "Кипарис", "Королев", "Котова", "Кравец", "Кубик в Кубе", "Кураж-Бамбей", "Л. Володарский", "Лазер Видео", "ЛанселаП", "Лапшин", "Лексикон", "Ленфильм", "Леша Прапорщик", "Лизард", "Люсьена", "Заугаров", "Иванов", "Иванова и П. Пашут", "Латышев", "Ошурков", "Чадов", "Яроцкий", "Максим Логинофф", "Малиновский", "Марченко", "Мастер Тэйп", "Махонько", "Машинский", "Медиа-Комплекс", "Мельница", "Мика Бондарик", "Миняев", "Мительман", "Мост Видео", "Мосфильм", "Муравский", "Мьюзик-трейд", "Н-Кино", "Н. Антонов", "Н. Дроздов", "Н. Золотухин", "Н.Севастьянов seva1988", "Набиев", "Наталья Гурзо", "НЕВА 1", "Невафильм", "НеЗупиняйПродакшн", "Неоклассика", "Несмертельное оружие", "НЛО-TV", "Новий", "Новый диск", "Новый Дубляж", "Новый Канал", "Нота", "НСТ", "НТВ", "НТН", "Оверлорд", "Огородников", "Омикрон", "Гланц", "Карцев", "Морозов", "Прямостанов", "Санаев", "Парадиз", "Пепелац", "Первый канал ОРТ", "翻译ман", "Перец", "Петербургский дубляж", "Петербуржец", "Пирамида", "Пифагор", "Позитив-Мультимедиа", "Прайд Продакшн", "Премьер Видео", "Премьер Мультимедиа", "Причудики", "Р. Янкелевич", "Райдо", "Ракурс", "РенТВ", "Россия", "РТР", "俄语 дубляж", "俄语 Репортаж", "РуФилмс", "Рыжий пес", "С. Визгунов", "С. Дьяков", "С. Казаков", "С. Кузнецов", "С. Кузьмичёв", "С. Лебедев", "С. Макашов", "С. Рябов", "С. Щегольков", "С.Р.И.", "Сolumbia Service", "Самарский", "СВ Студия", "СВ-Дубль", "Светла", "Селена Интернешнл", "Синема Трейд", "Синема УС", "Синта Рурони", "Синхрон", "Советский", "Сокуров", "Солодухин", "Сонотек", "Сонькин", "Союз Видео", "Союзмультфильм", "СПД - Сладкая парочка", "Строев", "СТС", "Студии Суверенного Лепрозория", "Студия «Стартрек»", "KOleso", "Студия Горького", "Студия Колобок", "Студия Пиратского Дубляжа", "Студия Райдо", "Студия Трёх", "Гуртом", "Супербит", "Сыендук", "Так Треба Продакшн", "ТВ XXI век", "ТВ СПб", "ТВ-3", "ТВ6", "ТВИН", "ТВЦ", "ТВЧ 1", "ТНТ", "ТО Друзей", "Толмачев", "Точка Zрения", "Трамвай-фильм", "ТРК", "Уолт Дисней Компани", "Хихидок", "Хлопушка", "Цікава Ідея", "Четыре в квадрате", "Швецов", "Штамп", "Штейн", "Ю. Живов", "Ю. Немахов", "Ю. Сербин", "Ю. Товбин", "Я. Беллманн"];
    scroll.minus();
    scroll.body().addClass('torrent-list');

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Background.immediately(Utils.cardImgBackground(object.movie));
      Parser.get(object, function (data) {
        results = data;

        _this.build();

        _this.activity.loader(false);

        _this.activity.toggle();
      }, function (text) {
        _this.empty('回复: ' + text);
      });

      filter.onSearch = function (value) {
        Activity$1.replace({
          search: value,
          clarification: true
        });
      };

      filter.onBack = function () {
        _this.start();
      };

      filter.render().find('.selector').on('hover:focus', function (e) {
        last_filter = e.target;
      });
      return this.render();
    };

    this.empty = function (descr) {
      var empty = new create$k({
        descr: descr
      });
      files.append(empty.render(filter.empty()));
      this.start = empty.start;
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.listEmpty = function () {
      scroll.append(Template.get('list_empty'));
    };

    this.buildSorted = function () {
      var need = Storage.get('torrents_sort', 'Seeders');
      var select = [{
        title: '按种子数',
        sort: 'Seeders'
      }, {
        title: '按大小',
        sort: 'Size'
      }, {
        title: '按名称',
        sort: 'Title'
      }, {
        title: '按来源',
        sort: 'Tracker'
      }, {
        title: '按日期',
        sort: 'PublisTime'
      }, {
        title: '按查看',
        sort: 'viewed'
      }];
      select.forEach(function (element) {
        if (element.sort == need) element.selected = true;
      });
      filter.sort(results.Results, need);
      filter.set('sort', select);
      this.selectedSort();
    };

    this.buildFilterd = function () {
      var need = Storage.get('torrents_filter', '{}');
      var select = [];

      var add = function add(type, title) {
        var items = filter_items[type];
        var subitems = [];
        var multiple = filter_multiple.indexOf(type) >= 0;
        var value = need[type];
        if (multiple) value = Arrays.toArray(value);
        items.forEach(function (name, i) {
          subitems.push({
            title: name,
            selected: multiple ? i == 0 : value == i,
            checked: multiple && value.indexOf(name) >= 0,
            checkbox: multiple && i > 0,
            index: i
          });
        });
        select.push({
          title: title,
          subtitle: multiple ? value.length ? value.join(', ') : items[0] : typeof value == 'undefined' ? items[0] : items[value],
          items: subitems,
          stype: type
        });
      };

      filter_items.voice = ["Any", "Dubbing", "Multi-Voice", "Two-Voice", "Amateur"];
      filter_items.tracker = ['任何'];
      results.Results.forEach(function (element) {
        var title = element.Title.toLowerCase(),
            tracker = element.Tracker;

        for (var _i = 0; _i < voices.length; _i++) {
          var voice = voices[_i].toLowerCase();

          if (title.indexOf(voice) >= 0) {
            if (filter_items.voice.indexOf(voices[_i]) == -1) filter_items.voice.push(voices[_i]);
          }
        }

        if (filter_items.tracker.indexOf(tracker) === -1) filter_items.tracker.push(tracker);
      }); //надо очистить от отсутствующих ключей

      need.voice = Arrays.removeNoIncludes(Arrays.toArray(need.voice), filter_items.voice);
      need.tracker = Arrays.removeNoIncludes(Arrays.toArray(need.tracker), filter_items.tracker);
      Storage.set('torrents_filter', need);
      select.push({
        title: '重置过滤器',
        reset: true
      });
      add('quality', '质量');
      add('hdr', 'HDR');
      add('sub', '字幕');
      add('voice', '翻译');
      add('tracker', '跟踪器');
      add('year', '年份');
      filter.set('filter', select);
      this.selectedFilter();
    };

    this.selectedFilter = function () {
      var need = Storage.get('torrents_filter', '{}'),
          select = [];

      for (var _i2 in need) {
        if (need[_i2]) {
          if (Arrays.isArray(need[_i2])) {
            if (need[_i2].length) select.push(filter_translate[_i2] + ':' + need[_i2].join(', '));
          } else {
            select.push(filter_translate[_i2] + ': ' + filter_items[_i2][need[_i2]]);
          }
        }
      }

      filter.chosen('filter', select);
    };

    this.selectedSort = function () {
      var select = Storage.get('torrents_sort', 'Seeders');
      filter.chosen('sort', [sort_translate[select]]);
    };

    this.build = function () {
      var _this2 = this;

      this.buildSorted();
      this.buildFilterd();
      this.filtred();

      filter.onSelect = function (type, a, b) {
        if (type == 'sort') {
          Storage.set('torrents_sort', a.sort);
          filter.sort(results.Results, a.sort);
        } else {
          if (a.reset) {
            Storage.set('torrents_filter', '{}');

            _this2.buildFilterd();
          } else {
            var filter_data = Storage.get('torrents_filter', '{}');
            filter_data[a.stype] = filter_multiple.indexOf(a.stype) >= 0 ? [] : b.index;
            a.subtitle = b.title;
            Storage.set('torrents_filter', filter_data);
          }
        }

        _this2.applyFilter();

        _this2.start();
      };

      filter.onCheck = function (type, a, b) {
        var data = Storage.get('torrents_filter', '{}'),
            need = Arrays.toArray(data[a.stype]);
        if (b.checked && need.indexOf(b.title)) need.push(b.title);else if (!b.checked) Arrays.remove(need, b.title);
        data[a.stype] = need;
        Storage.set('torrents_filter', data);
        a.subtitle = need.join(', ');

        _this2.applyFilter();
      };

      if (results.Results.length) this.showResults();else {
        this.empty('获取结果失败');
      }
    };

    this.applyFilter = function () {
      this.filtred();
      this.selectedFilter();
      this.selectedSort();
      this.reset();
      this.showResults();
      last = scroll.render().find('.torrent-item:eq(0)')[0];
    };

    this.filtred = function () {
      var filter_data = Storage.get('torrents_filter', '{}');
      var filter_any = false;

      for (var _i3 in filter_data) {
        var filr = filter_data[_i3];

        if (filr) {
          if (Arrays.isArray(filr)) {
            if (filr.length) filter_any = true;
          } else filter_any = true;
        }
      }

      filtred = results.Results.filter(function (element) {
        if (filter_any) {
          var passed = false,
              nopass = false,
              title = element.Title.toLowerCase(),
              tracker = element.Tracker;
          var qua = Arrays.toArray(filter_data.quality),
              hdr = filter_data.hdr,
              sub = filter_data.sub,
              voi = Arrays.toArray(filter_data.voice),
              tra = Arrays.toArray(filter_data.tracker),
              yer = filter_data.year;

          var test = function test(search, test_index) {
            var regex = new RegExp(search);
            return test_index ? title.indexOf(search) >= 0 : regex.test(title);
          };

          var check = function check(search, invert) {
            if (test(search)) {
              if (invert) nopass = true;else passed = true;
            } else {
              if (invert) passed = true;else nopass = true;
            }
          };

          var includes = function includes(type, arr) {
            if (!arr.length) return;
            var any = false;
            arr.forEach(function (a) {
              if (type == 'quality') {
                if (a == '4k' && test('(4k|uhd)[ |\\]|,|$]|2160[pр]|ultrahd')) any = true;
                if (a == '1080p' && test('fullhd|1080[pр]')) any = true;
                if (a == '720p' && test('720[pр]')) any = true;
              }

              if (type == 'voice') {
                var p = filter_items.voice.indexOf(a);

                if (p == 1) {
                  if (test('дублирован|дубляж|  apple| dub| d[,| |$]|[,|\\s]дб[,|\\s|$]')) any = true;
                } else if (p == 2) {
                  if (test('многоголос| p[,| |$]|[,|\\s](лм|пм)[,|\\s|$]')) any = true;
                } else if (p == 3) {
                  if (test('двухголос|двуголос| l2[,| |$]|[,|\\s](лд|пд)[,|\\s|$]')) any = true;
                } else if (p == 4) {
                  if (test('любитель|авторский| l1[,| |$]|[,|\\s](ло|ап)[,|\\s|$]')) any = true;
                } else if (test(a.toLowerCase(), true)) any = true;
              }

              if (type == 'tracker') {
                if (tracker.toLowerCase() == a.toLowerCase()) any = true;
              }
            });
            if (any) passed = true;else nopass = true;
          };

          includes('quality', qua);
          includes('voice', voi);
          includes('tracker', tra);

          if (hdr) {
            if (hdr == 1) check('[\\[| ]hdr[10| |\\]|,|$]');else check('[\\[| ]hdr[10| |\\]|,|$]', true);
          }

          if (sub) {
            if (sub == 1) check(' sub|[,|\\s]ст[,|\\s|$]');else check(' sub|[,|\\s]ст[,|\\s|$]', true);
          }

          if (yer) {
            check(filter_items.year[yer]);
          }

          return nopass ? false : passed;
        } else return true;
      });
    };

    this.showResults = function () {
      total_pages = Math.ceil(filtred.length / 20);
      filter.render().addClass('torrent-filter');
      scroll.append(filter.render());

      if (filtred.length) {
        this.append(filtred.slice(0, 20));
      } else {
        this.listEmpty();
      }

      files.append(scroll.render());
    };

    this.reset = function () {
      last = false;
      filter.render().detach();
      scroll.clear();
    };

    this.next = function () {
      if (object.page < 15 && object.page < total_pages) {
        object.page++;
        var offset = (object.page - 1) * 20;
        this.append(filtred.slice(offset, offset + 20));
        Controller.enable('content');
      }
    };

    this.loadMagnet = function (element, call) {
      var _this3 = this;

      Parser.marnet(element, function () {
        Modal.close();
        element.poster = object.movie.img;

        _this3.start();

        if (call) call();else Torrent.start(element, object.movie);
      }, function (text) {
        Modal.update(Template.get('error', {
          title: '错误',
          text: text
        }));
      });
      Modal.open({
        title: '',
        html: Template.get('modal_pending', {
          text: '请求磁力链接'
        }),
        onBack: function onBack() {
          Modal.close();
          network.clear();
          Controller.toggle('content');
        }
      });
    };

    this.mark = function (element, item, add) {
      if (add) {
        if (viewed.indexOf(element.hash) == -1) {
          viewed.push(element.hash);
          item.append('<div class="torrent-item__viewed">' + Template.get('icon_star', {}, true) + '</div>');
        }
      } else {
        element.viewed = true;
        Arrays.remove(viewed, element.hash);
        item.find('.torrent-item__viewed').remove();
      }

      element.viewed = add;
      Storage.set('torrents_view', viewed);
    };

    this.addToBase = function (element) {
      Torserver.add({
        poster: object.movie.img,
        title: object.movie.title + ' / ' + object.movie.original_title,
        link: element.MagnetUri || element.Link,
        data: {
          lampa: true,
          movie: object.movie
        }
      }, function () {
        Noty.show(object.movie.title + ' -添加到我的种子');
      });
    };

    this.append = function (items) {
      var _this4 = this;

      items.forEach(function (element) {
        count++;
        var date = Utils.parseTime(element.PublishDate);
        var pose = count;
        var bitrate = object.movie.runtime ? Utils.calcBitrate(element.Size, object.movie.runtime) : 0;
        Arrays.extend(element, {
          title: element.Title,
          date: date.full,
          tracker: element.Tracker,
          bitrate: bitrate,
          size: element.Size ? Utils.bytesToSize(element.Size) : element.size,
          seeds: element.Seeders,
          grabs: element.Peers
        });
        var item = Template.get('torrent', element);
        if (!bitrate) item.find('.bitrate').remove();
        if (element.viewed) item.append('<div class="torrent-item__viewed">' + Template.get('icon_star', {}, true) + '</div>');
        item.on('hover:focus', function (e) {
          last = e.target;
          scroll.update($(e.target), true);
          if (pose > object.page * 20 - 4) _this4.next();
        }).on('hover:enter', function () {
          Torrent.opened(function () {
            _this4.mark(element, item, true);
          });

          if (element.reguest && !element.MagnetUri) {
            _this4.loadMagnet(element);
          } else {
            element.poster = object.movie.img;

            _this4.start();

            Torrent.start(element, object.movie);
          }
        }).on('hover:long', function () {
          var enabled = Controller.enabled().name;
          Select.show({
            title: '操作',
            items: [{
              title: '添加到我的种子',
              tomy: true
            }, {
              title: '标志',
              subtitle: '带标志的标志上传（已查看）',
              mark: true
            }, {
              title: '取消标志',
              subtitle: '取消标记此共享（已查看）'
            }],
            onBack: function onBack() {
              Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              if (a.tomy) {
                if (element.reguest && !element.MagnetUri) {
                  _this4.loadMagnet(element, function () {
                    _this4.addToBase(element);
                  });
                } else _this4.addToBase(element);
              } else if (a.mark) {
                _this4.mark(element, item, true);
              } else {
                _this4.mark(element, item, false);
              }

              Controller.toggle(enabled);
            }
          });
        });
        scroll.append(item);
      });
    };

    this.back = function () {
      Activity$1.backward();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render(), files.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        up: function up() {
          if (Navigator.canmove('up')) {
            if (scroll.render().find('.selector').slice(3).index(last) == 0 && last_filter) {
              Controller.collectionFocus(last_filter, scroll.render());
            } else Navigator.move('up');
          } else Controller.toggle('head');
        },
        down: function down() {
          Navigator.move('down');
        },
        right: function right() {
          Navigator.move('right');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        back: this.back
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return files.render();
    };

    this.destroy = function () {
      network.clear();
      Parser.clear();
      files.destroy();
      scroll.destroy();
      results = null;
      network = null;
    };
  }

  function component$5(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true
    });
    var items = [];
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var total_pages = 0;
    var last;
    var torrents = [];

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Torserver.my(this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.next = function () {
      if (object.page < 15 && object.page < total_pages) {
        object.page++;
        var offset = object.page - 1;
        this.append(torrents.slice(20 * offset, 20 * offset + 20));
        Controller.enable('content');
      }
    };

    this.append = function (data) {
      var _this2 = this;

      data.forEach(function (element) {
        element.title = element.title.replace('[LAMPA] ', '');
        var item_data = Arrays.decodeJson(element.data, {});
        var card = new create$o(element, {
          card_category: true
        });
        card.create();

        card.onFocus = function (target, card_data) {
          last = target;
          scroll.update(card.render(), true);
          Background.change(item_data.movie ? Utils.cardImgBackground(item_data.movie) : element.poster);
          var maxrow = Math.ceil(items.length / 7) - 1;
          if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this2.next();
        };

        card.onEnter = function (target, card_data) {
          _this2.start();

          Torrent.open(card_data.hash, item_data.lampa && item_data.movie ? item_data.movie : false);
        };

        card.onMenu = function (target, card_data) {
          var enabled = Controller.enabled().name;
          Select.show({
            title: '操作',
            items: [{
              title: '删除',
              subtitle: '种子将从您的列表中删除'
            }],
            onBack: function onBack() {
              Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              Torserver.remove(card_data.hash);
              Arrays.remove(items, card);
              card.destroy();
              last = false;
              Controller.toggle(enabled);
            }
          });
        };

        card.visible();
        body.append(card.render());
        items.push(card);
      });
    };

    this.build = function (data) {
      torrents = data;
      total_pages = Math.ceil(torrents.length / 20);
      scroll.minus();
      this.append(torrents.slice(0, 20));
      scroll.append(body);
      html.append(scroll.render());
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        right: function right() {
          Navigator.move('right');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      body.remove();
      network = null;
      items = null;
      html = null;
      body = null;
    };
  }

  function component$4(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true,
      step: 250
    });
    var items = [];
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var total_pages = 0;
    var info;
    var last;
    var relises = [];

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.relise(this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.next = function () {
      if (object.page < 15 && object.page < total_pages) {
        object.page++;
        var offset = object.page - 1;
        this.append(relises.slice(20 * offset, 20 * offset + 20));
        Controller.enable('content');
      }
    };

    this.append = function (data) {
      var _this2 = this;

      data.forEach(function (element) {
        var card = new create$o(element, {
          card_category: true,
          card_type: true
        });
        card.create();

        card.onFocus = function (target, card_data) {
          last = target;
          scroll.update(card.render(), true);
          info.update(card_data);
          Background.change(Utils.cardImgBackground(card_data));
          var maxrow = Math.ceil(items.length / 7) - 1;
          if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this2.next();
        };

        card.onEnter = function (target, card_data) {
          if (card_data.tmdbID) {
            card_data.id = card_data.tmdbID;
            Activity$1.push({
              url: '',
              component: 'full',
              id: card_data.tmdbID,
              method: card_data.name ? 'tv' : 'movie',
              card: card_data
            });
          } else {
            Modal.open({
              title: '',
              html: Template.get('modal_loading'),
              size: 'small',
              mask: true,
              onBack: function onBack() {
                Modal.close();
                Api.clear();
                Controller.toggle('content');
              }
            });
            Api.search({
              query: encodeURIComponent(card_data.original_title)
            }, function (find) {
              Modal.close();
              var finded = TMDB.find(find, card_data);

              if (finded) {
                Activity$1.push({
                  url: '',
                  component: 'full',
                  id: finded.id,
                  method: finded.name ? 'tv' : 'movie',
                  card: finded
                });
              } else {
                Noty.show('找不到电影。');
                Controller.toggle('content');
              }
            }, function () {
              Modal.close();
              Noty.show('找不到电影。');
              Controller.toggle('content');
            });
          }
        };

        card.onMenu = function () {};

        card.visible();
        body.append(card.render());
        items.push(card);
      });
    };

    this.build = function (data) {
      relises = data;
      total_pages = Math.ceil(relises.length / 20);
      info = new create$l();
      info.create();
      info.render().find('.info__right').addClass('hide');
      scroll.minus(info.render());
      html.append(info.render());
      html.append(scroll.render());
      this.append(relises.slice(0, 20));
      scroll.append(body);
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        right: function right() {
          Navigator.move('right');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      body.remove();
      if (info) info.destroy();
      network = null;
      items = null;
      html = null;
      body = null;
      info = null;
    };
  }

  function component$3(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true
    });
    var items = [];
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var last;
    var collections = [];
    var waitload;

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.collections(object, this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.next = function () {
      var _this2 = this;

      if (waitload) return;

      if (object.page < 30) {
        waitload = true;
        object.page++;
        Api.collections(object, function (result) {
          _this2.append(result);

          if (result.length) waitload = false;
          Controller.enable('content');
        }, function () {});
      }
    };

    this.append = function (data) {
      var _this3 = this;

      data.forEach(function (element) {
        var card = new create$o(element, {
          card_collection: true,
          object: object
        });
        card.create();

        card.onFocus = function (target, card_data) {
          last = target;
          scroll.update(card.render(), true);
          Background.change(Utils.cardImgBackground(card_data));
          var maxrow = Math.ceil(items.length / 7) - 1;
          if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this3.next();
        };

        card.onEnter = function (target, card_data) {
          Activity$1.push({
            url: card_data.url,
            id: card_data.id,
            title: '合集 -' + card_data.title,
            component: 'collections_view',
            source: object.source,
            page: 1
          });
        };

        card.onMenu = function (target, card_data) {};

        card.visible();
        body.append(card.render());
        items.push(card);
      });
    };

    this.build = function (data) {
      collections = data;
      scroll.minus();
      this.append(collections.slice(0, 20));
      scroll.append(body);
      html.append(scroll.render());
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        right: function right() {
          Navigator.move('right');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      body.remove();
      network = null;
      items = null;
      html = null;
      body = null;
    };
  }

  function component$2(object) {
    var network = new create$r();
    var scroll = new create$q({
      mask: true,
      over: true
    });
    var items = [];
    var html = $('<div></div>');
    var body = $('<div class="category-full"></div>');
    var last;
    var info;
    var collections = [];
    var waitload;

    this.create = function () {
      var _this = this;

      this.activity.loader(true);
      Api.collections(object, this.build.bind(this), function () {
        var empty = new create$k();
        html.append(empty.render());
        _this.start = empty.start;

        _this.activity.loader(false);

        _this.activity.toggle();
      });
      return this.render();
    };

    this.next = function () {
      var _this2 = this;

      if (waitload) return;

      if (object.page < 15) {
        waitload = true;
        object.page++;
        Api.collections(object, function (result) {
          _this2.append(result);

          if (result.length) waitload = false;
          Controller.enable('content');
        }, function () {});
      }
    };

    this.append = function (data) {
      var _this3 = this;

      data.forEach(function (element) {
        var card = new create$o(element, {
          card_category: true,
          object: object
        });
        card.create();

        card.onFocus = function (target, card_data) {
          last = target;
          scroll.update(card.render(), true);
          info.update(card_data);
          Background.change(Utils.cardImgBackground(card_data));
          var maxrow = Math.ceil(items.length / 7) - 1;
          if (Math.ceil(items.indexOf(card) / 7) >= maxrow && items.length > 19) _this3.next();
        };

        card.onEnter = function (target, card_data) {
          Activity$1.push({
            url: card_data.url,
            component: 'full',
            id: card_data.id,
            source: object.source,
            card: element
          });
        };

        card.visible();
        body.append(card.render());
        items.push(card);
      });
    };

    this.build = function (data) {
      collections = data;
      info = new create$l();
      info.create();
      scroll.minus(info.render());
      html.append(info.render());
      html.append(scroll.render());
      this.append(collections);
      scroll.append(body);
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last || false, scroll.render());
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
        },
        right: function right() {
          Navigator.move('right');
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
        },
        down: function down() {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function back() {
          Activity$1.backward();
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      network.clear();
      Arrays.destroy(items);
      scroll.destroy();
      html.remove();
      body.remove();
      if (info) info.destroy();
      network = null;
      items = null;
      html = null;
      body = null;
      info = null;
    };
  }

  function component$1(object) {
    var html = $('<div></div>');
    var empty = new create$k();

    this.create = function () {
      html.append(empty.render());
      this.start = empty.start;
      this.activity.loader(false);
      this.activity.toggle();
    };

    this.start = function () {
      Controller.add('content', {
        toggle: function toggle() {
          Controller.collectionSet(empty.render());
          Controller.collectionFocus(false, empty.render());
        }
      });
      Controller.toggle('content');
    };

    this.pause = function () {};

    this.stop = function () {};

    this.render = function () {
      return html;
    };

    this.destroy = function () {
      html.remove();
    };
  }

  var component = {
    main: component$c,
    full: component$b,
    category: component$9,
    category_full: component$a,
    actor: component$8,
    favorite: component$7,
    torrents: component$6,
    mytorrents: component$5,
    relise: component$4,
    collections: component$3,
    collections_view: component$2,
    nocomponent: component$1
  };

  function create$5(object) {
    if (component[object.component]) {
      return new component[object.component](object);
    } else {
      return new component.nocomponent(object);
    }
  }

  function add$3(name, comp) {
    component[name] = comp;
  }

  function get$2(name) {
    return component[name];
  }

  var Component = {
    create: create$5,
    add: add$3,
    get: get$2
  };

  var where;
  var data = {};
  var notices = [];

  function init$8() {
    data = Storage.get('notice', '{}');
    notices = [{
      time: '2021-12-23 14:00',
      title: '更新 1.3.7',
      descr: 'one. Added voice search.\u003cbr\u003e2. Fixed mouse bugs and added mouse support in the player.\u003cbr\u003e3. Added account binding to CUB.\u003cbr\u003e4. All sorts of other uninteresting little things.'
    }, {
      time: '2021-11-25 13:00',
      title: '更新 1.3.6',
      descr: 'one. Added new catalog CUB.\u003cbr\u003e2. Release source changed, now it works even in MSX.\u003cbr\u003e3. Added anime category ;)'
    }, {
      time: '2021-11-15 11:00',
      title: '更新 1.3.5',
      descr: 'one. Added screensaver from Google ChromeCast.\u003cbr\u003e2. Releases run immediately without searching for .\u003cbr\u003e3. The enter button has been removed from the keyboard.\u003cbr\u003e4. The player has improved rewinding and added buttons (to the end / to the beginning).\u003cbr\u003e5. Added synchronization via gist.github.com service.'
    }, {
      time: '2021-11-10 10:00',
      title: '更新 1.3.4',
      descr: 'one. Fixed timestamp when disabled property (continue from last place).\u003cbr\u003e2. On samsung TVs fixed black dice in the player.\u003cbr\u003e3. Added plugins in settings.'
    }, {
      time: '2021-11-02 10:00',
      title: '更新 1.3.3',
      descr: 'one. Added search by torrents.\u003cbr\u003e2. Fixed loading main with selected source.\u003cbr\u003e3. Added multiple selection in the filter.\u003cbr\u003e4. Added more choices for video scaling.\u003cbr\u003e5. Other minor fixes.'
    }, {
      time: '2021-10-25 15:00',
      title: '更新 1.3.2',
      descr: 'one. Fixed card search, each card has its own source (tmdb,ivi,okko)\u003cbr\u003e2. Ability to switch source to (tmdb,ivi,okko).\u003cbr\u003e3. Updated background work.\u003cbr\u003e4. Added scrolling in torrent files, scrolls left or right by 10 positions.\u003cbr\u003e5. Changed NCR source.\u003cbr\u003e6. Fixed browsing history, now a card is added if you start watching a video.\u003cbr\u003e7. Added comments in source ivi.'
    }, {
      time: '2021-10-20 16:20',
      title: '更新 1.3.1',
      descr: 'one. Added collections with ivi and okko\u003cbr\u003e2. Returned the ability to change the scale of the video.\u003cbr\u003e3. Added digital releases, does not work in MSX.\u003cbr\u003e4. In what language to display data TMDB.\u003cbr\u003e5. In the screensaver added the ability to switch to nature.\u003cbr\u003e6. Possibility to choose in what language to find torrents.\u003cbr\u003e7. Ability to disable continue on timecode.'
    }, {
      time: '2021-10-14 13:00',
      title: '屏幕保护程序',
      descr: 'Added screensaver, starts after 5 minutes if nothing is done.'
    }, {
      time: '2021-10-14 10:00',
      title: '更新 1.2.6',
      descr: 'one. Fixed torrent deletion error.\u003cbr\u003e2. Fixed timestamp.\u003cbr\u003e3. Added a visual for series, in torrent files you can see the series better.\u003cbr\u003e4. Other little things.'
    }, {
      time: '2021-10-12 19:10',
      title: '很高兴知道',
      descr: 'Did you know? That if you hold down the (OK) button on the card for a long time, you can call up the menu for adding to bookmarks. The same method works on torrents, a long tap allows you to add the distribution to the list (My torrents)'
    }, {
      time: '2021-10-12 19:00',
      title: '更新 1.2.4',
      descr: 'one. Added menu (My torrents).\u003cbr\u003e2. Updated filter and sorting in torrents.\u003cbr\u003e3. Added tape (New) in movies and TV shows.\u003cbr\u003e4. Fixed links for Torserver.\u003cbr\u003e5. Added watch mark for serials.\u003cbr\u003e6. Fixed several bugs and bugs.'
    }, {
      time: '2021-10-10 18:00',
      title: '更新 1.2.3',
      descr: 'one. Mouse support added.\u003cbr\u003e2. View position memory added (Movies)\u003cbr\u003e3. Fixed a bug in the player with partially closed tiles.\u003cbr\u003e4. Added additional link to Torserver\u003cbr\u003e5. Viewed torrent mark\u003cbr\u003e6. Added transition from torrent to movie card'
    }, {
      time: '2021-10-09 15:00',
      title: '更新 1.2.2',
      descr: 'one. Added Tizen player\u003cbr\u003e2. Added webOS player\u003cbr\u003e3. Added torrent download statistics to the player.\u003cbr\u003e4. Added rewind bar in player\u003cbr\u003e5. Fixed empty posters for Torserver\u003cbr\u003e6. Fixed other minor bugs and bugs'
    }, {
      time: '2021-10-07 17:00',
      title: '更新 1.2.1',
      descr: 'one. Fixed bug with back button in MSX\u003cbr\u003e2. Fixed bug with search\u003cbr\u003e3. Added filter in torrents\u003cbr\u003e4. Visually improved player\u003cbr\u003e5. Added performance settings\u003cbr\u003e6. Fixed names in torrent files\u003cbr\u003e7. Fixed bug with pause in player\u003cbr\u003e8. Fixed other minor bugs and bugs'
    }, {
      time: '2021-10-03 12:00',
      title: '更新 1.0.10',
      descr: 'one. Improved loading of cards in small mode\u003cbr\u003e2. Added logs, to view the logs hover over the header and click up 10 times'
    }, {
      time: '2021-10-01 09:00',
      title: '更新 1.0.9',
      descr: 'one. Improved background in bookmarks and in movie\u003cbr\u003e2. Changed instructions\u003cbr\u003e3. Completed plugin for Orsay'
    }, {
      time: '2021-09-30 18:00',
      title: 'Update 1.0.8',
      descr: 'one. Improved background\u003cbr\u003e2. The button (Torrents)\u003cbr\u003e3 is displayed. Added sorting of torrents\u003cbr\u003e4. Finished output for Tizen and WebOS\u003cbr\u003e 5. Possibly finished control buttons for Orsay'
    }, {
      time: '2021-09-29 17:00',
      title: 'Update 1.0.7',
      descr: 'one. Optimized main page and catalogs\u003cbr\u003e2. Added authorization for TorServer\u003cbr\u003e 3. Added error hints to TorServer'
    }, {
      time: '2021-09-28 16:00',
      title: 'Fixes',
      descr: 'one. Bug fixed (Unable to get HASH)\u003cbr\u003e2. Completed parser for MSX, now you do not need to specify an explicit link, only if you wish\u003cbr\u003e 3. Improved jac.red parser, now searches more accurately'
    }, {
      time: '2021-09-27 15:00',
      title: 'Parser fixed',
      descr: 'There was a bug in the parser that caused jac.red to not produce results'
    }, {
      time: '2021-09-26 17:00',
      title: 'Welcome!',
      descr: 'This is your first time running the app, we hope you enjoy it. Enjoy your viewing.'
    }];
    Arrays.extend(data, {
      time: 0
    });
  }

  function getNotice(call) {
    Account.notice(function (result) {
      if (result.length) {
        var items = [];
        result.forEach(function (item) {
          var data = JSON.parse(item.data);
          var season = Arrays.getKeys(data.card.seasons);
          items.push({
            time: item.date + ' 12:00',
            title: data.card.name,
            descr: 'New Series\u003cbr\u003e\u003cbr\u003eSeason - \u003cb\u003e, \'' + season[0] + '</b><br>Эпизод - <b>' + data.card.seasons[season[0]] + '</b>',
            card: data.card
          });
        });
        var all = notices.slice(0, 10).concat(items);
        all.sort(function (a, b) {
          var t_a = new Date(a.time).getTime(),
              t_b = new Date(b.time).getTime();
          if (t_a > t_b) return -1;else if (t_a < t_b) return 1;else return 0;
        });
        call(all);
      } else call(notices.slice(0, 10));
    });
  }

  function open() {
    getNotice(function (notice) {
      var html = $('<div></div>');
      notice.forEach(function (element) {
        var item = Template.get(element.card ? 'notice_card' : 'notice', element);

        if (element.card) {
          var img = item.find('img')[0];

          img.onload = function () {};

          img.onerror = function (e) {
            img.src = './img/img_broken.svg';
          };

          img.src = element.card.poster ? element.card.poster : element.card.img ? element.card.img : Utils.protocol() + 'image.tmdb.org/t/p/w300/' + element.card.poster_path;
          item.on('hover:enter', function () {
            Modal.close();
            Activity$1.push({
              url: '',
              component: 'full',
              id: element.card.id,
              method: 'tv',
              card: element.card,
              source: 'cub'
            });
          });
        }

        html.append(item);
      });
      Modal.open({
        title: 'Notifications',
        size: 'medium',
        html: html,
        onBack: function onBack() {
          Modal.close();
          Controller.toggle('head');
        }
      });
      data.time = maxtime(notice);
      Storage.set('notice', data);
      icon(notice);
    });
  }

  function maxtime(notice) {
    var max = 0;
    notice.forEach(function (element) {
      var time = new Date(element.time).getTime();
      max = Math.max(max, time);
    });
    return max;
  }

  function any$1(notice) {
    return maxtime(notice) > data.time;
  }

  function icon(notice) {
    where.find('.notice--icon').toggleClass('active', any$1(notice));
  }

  function start$2(html) {
    where = html;
    getNotice(icon);
  }

  var Notice = {
    open: open,
    start: start$2,
    init: init$8
  };

  var html$5;
  var last$2;

  function init$7() {
    html$5 = Template.get('head');
    Utils.time(html$5);
    Notice.start(html$5);
    html$5.find('.selector').data('controller', 'head').on('hover:focus', function (event) {
      last$2 = event.target;
    });
    html$5.find('.open--settings').on('hover:enter', function () {
      Controller.toggle('settings');
    });
    html$5.find('.open--notice').on('hover:enter', function () {
      Notice.open();
    });
    html$5.find('.open--search').on('hover:enter', function () {
      Controller.toggle('search');
    });
    html$5.find('.head__logo-icon').on('click', function () {
      Controller.toggle('menu');
    });
    Controller.add('head', {
      toggle: function toggle() {
        Controller.collectionSet(html$5);
        Controller.collectionFocus(last$2, html$5);
      },
      right: function right() {
        Navigator.move('right');
      },
      left: function left() {
        if (Navigator.canmove('left')) Navigator.move('left');else Controller.toggle('menu');
      },
      down: function down() {
        Controller.toggle('content');
      },
      back: function back() {
        Activity$1.backward();
      }
    });
  }

  function title(title) {
    html$5.find('.head__title').text(title ? '- ' + title : '');
  }

  function render$3() {
    return html$5;
  }

  var Head = {
    render: render$3,
    title: title,
    init: init$7
  };

  var listener$3 = start$4();
  var activites = [];
  var callback = false;
  var fullout = false;
  var content;
  var slides;
  var maxsave;

  function Activity(component) {
    var slide = Template.get('activity');
    var body = slide.find('.activity__body');
    this.stoped = false;
    this.started = false;
    /**
     * Добовляет активити в список активитис
     */

    this.append = function () {
      slides.append(slide);
    };
    /**
     * Создает новую активность
     */


    this.create = function () {
      component.create(body);
      body.append(component.render());
    };
    /**
     * Показывает загрузку
     * @param {Boolean} status 
     */


    this.loader = function (status) {
      slide.toggleClass('activity--load', status);
    };
    /**
     * Создает повторно
     */


    this.restart = function () {
      this.append();
      this.stoped = false;
      component.start();
    };
    /**
     * Стартуем активную активность
     */


    this.start = function () {
      this.started = true;
      Controller.add('content', {
        invisible: true,
        toggle: function toggle() {},
        left: function left() {
          Controller.toggle('menu');
        },
        up: function up() {
          Controller.toggle('head');
        },
        back: function back() {
          Activity.backward();
        }
      });
      Controller.toggle('content');
      if (this.stoped) this.restart();else component.start();
    };
    /**
     * пауза
     */


    this.pause = function () {
      this.started = false;
      component.pause();
    };
    /**
     * Включаем активность если она активна
     */


    this.toggle = function () {
      if (this.started) this.start();
    };
    /**
     * Стоп
     */


    this.stop = function () {
      this.started = false;
      if (this.stoped) return;
      this.stoped = true;
      component.stop();
      slide.detach();
    };
    /**
     * Рендер
     */


    this.render = function () {
      return slide;
    };
    /**
     * Уничтожаем активность
     */


    this.destroy = function () {
      component.destroy();
      slide.remove();
    };

    this.append();
  }

  function init$6() {
    content = Template.get('activitys');
    slides = content.find('.activitys__slides');
    maxsave = Storage.get('pages_save_total', 5);
    empty();
    window.addEventListener('popstate', function () {
      if (fullout) return;
      empty();
      listener$3.send('popstate', {
        count: activites.length
      });
      if (callback) callback();else {
        backward();
      }
    });
    Storage.listener.follow('change', function (event) {
      if (event.name == 'pages_save_total') maxsave = Storage.get('pages_save_total', 5);
    });
  }
  /**
   * Лимит активностей, уничтожать если больше maxsave
   */


  function limit() {
    var curent = active$1();
    if (curent && curent.activity) curent.activity.pause();
    var tree_stop = activites.slice(-2);
    if (tree_stop.length > 1 && tree_stop[0].activity) tree_stop[0].activity.stop();
    var tree_destroy = activites.slice(-maxsave);

    if (tree_destroy.length > maxsave - 1) {
      var first = tree_destroy[0];

      if (first.activity) {
        first.activity.destroy();
        first.activity = null;
      }
    }
  }
  /**
   * Добавить новую активность
   * @param {Object} object 
   */


  function push(object) {
    limit();
    create$4(object);
    activites.push(object);
    start$1(object);
  }
  /**
   * Создать новую активность
   * @param {Object} object 
   */


  function create$4(object) {
    var comp = Component.create(object);
    object.activity = new Activity(comp);
    comp.activity = object.activity;
    Lampa.Listener.send('activity', {
      component: object.component,
      type: 'init',
      object: object
    });
    object.activity.create();
    Lampa.Listener.send('activity', {
      component: object.component,
      type: 'create',
      object: object
    });
  }

  function back$2() {
    window.history.back();
  }

  function active$1() {
    return activites[activites.length - 1];
  }

  function empty() {
    window.history.pushState(null, null, window.location.pathname);
  }

  function backward() {
    callback = false;
    listener$3.send('backward', {
      count: activites.length
    });
    if (activites.length == 1) return;
    slides.find('>div').removeClass('activity--active');
    var curent = activites.pop();

    if (curent) {
      setTimeout(function () {
        curent.activity.destroy();
        Lampa.Listener.send('activity', {
          component: curent.component,
          type: 'destroy',
          object: curent
        });
      }, 200);
    }

    var previous_tree = activites.slice(-maxsave);

    if (previous_tree.length > maxsave - 1) {
      create$4(previous_tree[0]);
    }

    previous_tree = activites.slice(-1)[0];

    if (previous_tree) {
      if (previous_tree.activity) start$1(previous_tree);else {
        create$4(previous_tree);
        start$1(previous_tree);
      }
    }
  }

  function save$1(object) {
    var saved = {};

    for (var i in object) {
      if (i !== 'activity') saved[i] = object[i];
    }

    Storage.set('activity', saved);
  }

  function extractObject(object) {
    var saved = {};

    for (var i in object) {
      if (i !== 'activity') saved[i] = object[i];
    }

    return saved;
  }

  function start$1(object) {
    save$1(object);
    object.activity.start();
    slides.find('> div').removeClass('activity--active');
    object.activity.render().addClass('activity--active');
    Head.title(object.title);
    Lampa.Listener.send('activity', {
      component: object.component,
      type: 'start',
      object: object
    });
  }

  function last$1() {
    var active = Storage.get('activity', 'false');
    var start_from = Storage.field("start_page") === "last";

    if (active && start_from) {
      if (active.page) active.page = 1; // косяк, при перезагрузке будет последняя страница, надо исправить

      push(active);
    } else {
      push({
        url: '',
        title: 'Home -' + Storage.field('source').toUpperCase(),
        component: 'main',
        source: Storage.field('source'),
        page: 1
      });
    }
  }

  function render$2() {
    return content;
  }

  function call(call) {
    callback = call;
  }

  function out() {
    fullout = true;
    back$2();

    for (var i = 0; i < window.history.length; i++) {
      back$2();
    }

    setTimeout(function () {
      fullout = false;
      empty();
    }, 100);
  }

  function replace() {
    var replace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var object = extractObject(active$1());

    for (var i in replace) {
      object[i] = replace[i];
    }

    active$1().activity.destroy();
    activites.pop();
    push(object);
  }

  var Activity$1 = {
    init: init$6,
    listener: listener$3,
    push: push,
    back: back$2,
    render: render$2,
    backward: backward,
    call: call,
    last: last$1,
    out: out,
    replace: replace,
    active: active$1
  };

  var listener$2 = start$4();
  var active;
  var active_name = '';
  var controlls = {};
  var selects;
  var select_active;
  /**
   * Добавить контроллер
   * @param {String} name 
   * @param {Object} calls 
   */

  function add$2(name, calls) {
    controlls[name] = calls;
  }
  /**
   * Запустить функцию
   * @param {String} name 
   * @param {Object} params 
   */


  function run(name, params) {
    if (active) {
      if (active[name]) {
        if (typeof active[name] == 'function') active[name](params);else if (typeof active[name] == 'string') {
          run(active[name], params);
        }
      }
    }
  }
  /**
   * Двигать
   * @param {String} direction 
   */


  function move(direction) {
    run(direction);
  }
  /**
   * Вызов enter
   */


  function enter() {
    if (active && active.enter) run('enter');else if (select_active) {
      select_active.trigger('hover:enter');
    }
  }
  /**
   * Вызов long
   */


  function _long() {
    if (active && active["long"]) run('long');else if (select_active) {
      select_active.trigger('hover:long');
    }
  }
  /**
   * Завершить
   */


  function finish() {
    run('finish');
  }
  /**
   * Нажали назад
   */


  function back$1() {
    run('back');
  }
  /**
   * Переключить контроллер
   * @param {String} name 
   */


  function toggle(name) {
    //console.log('Contoller','toggle of [',active_name,'] to [',name,']')
    if (active && active.gone) active.gone(name);

    if (controlls[name]) {
      active = controlls[name];
      active_name = name;
      Activity$1.call(function () {
        run('back');
      });
      if (active.toggle) active.toggle();
      updateSelects();
      listener$2.send('toggle', {
        name: name
      });
    }
  }

  function updateSelects() {
    selects = $('.selector');

    if (Storage.get('navigation_type') == 'mouse') {
      selects.unbind('click.hover').on('click.hover', function (e) {
        selects.removeClass('focus enter');
        if (e.keyCode !== 13) $(this).addClass('focus').trigger('hover:enter', [true]);
      }).unbind('mouseover.hover').on('mouseover.hover', function (e) {
        if ($(this).hasClass('selector')) {
          selects.removeClass('focus enter').data('ismouse', false);
          $(this).addClass('focus').data('ismouse', true).trigger('hover:focus', [true]);
          var silent = Navigator.silent;
          Navigator.silent = true;
          Navigator.focus($(this)[0]);
          Navigator.silent = silent;
        }
      });
    }
  }

  function enable(name) {
    if (active_name == name) toggle(name);
  }

  function clearSelects() {
    select_active = false;
    $('.selector').removeClass('focus enter');
    if (selects) selects.unbind('.hover');
  }
  /**
   * Вызвать событие
   * @param {String} name 
   * @param {Object} params 
   */


  function trigger$1(name, params) {
    run(name, params);
  }
  /**
   * Фокус на элементе
   * @param {Object} target 
   */


  function focus(target) {
    if (selects) selects.removeClass('focus enter').data('ismouse', false);
    $(target).addClass('focus').trigger('hover:focus');
    select_active = $(target);
  }

  function collectionSet(html, append) {
    var colection = html.find('.selector').toArray();

    if (append) {
      colection = colection.concat(append.find('.selector').toArray());
    }

    if (colection.length || active.invisible) {
      clearSelects(); //$(colection).data('controller', enabled().name)

      Navigator.setCollection(colection);
    }
  }

  function collectionFocus(target, html) {
    if (target) {
      Navigator.focus(target);
    } else {
      var colection = html.find('.selector').not('.hide').toArray();
      if (colection.length) Navigator.focus(colection[0]);
    }
  }

  function enabled() {
    return {
      name: active_name,
      controller: active
    };
  }

  function toContent() {
    var trys = 0;

    var go = function go() {
      var contrl = enabled();
      trys++;

      if (contrl.name !== 'content') {
        if (contrl.controller.back) contrl.controller.back();
        if (trys < 10) go();
      }
    };

    go();
  }

  var Controller = {
    listener: listener$2,
    add: add$2,
    move: move,
    enter: enter,
    finish: finish,
    toggle: toggle,
    trigger: trigger$1,
    back: back$1,
    focus: focus,
    collectionSet: collectionSet,
    collectionFocus: collectionFocus,
    enable: enable,
    enabled: enabled,
    "long": _long,
    updateSelects: updateSelects,
    toContent: toContent
  };

  function create$3() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _keyClass = window.SimpleKeyboard["default"],
        _keyBord;

    var last;
    var recognition;
    var _default_layout = {
      'default': ['{abc} 1 2 3 4 5 6 7 8 9 0 - + = {bksp}', '{EN} q w e r t y u i o p', 'a s d f g h j k l /', '{shift} z x c v b n m , . : http://', '{space}'],
      'ru-shift': ['{abc} 1 2 3 4 5 6 7 8 9 0 - + = {bksp}', '{EN} Q W E R T Y U I O P', 'A S D F G H J K L /', '{shift} Z X C V B N M , . : http://', '{space}'],
      'abc': ['1 2 3 4 5 6 7 8 9 0 - + = {bksp}', '! @ # $ % ^ & * ( ) [ ]', '- _ = + \\ | [ ] { }', '; : \' " , . < > / ?', '{rus} {space} {eng}'],
      'en': ['{abc} 1 2 3 4 5 6 7 8 9 0 - + = {bksp}', '{RU} й ц у к е н г ш щ з х ъ', 'ф ы в а п р о л д ж э', '{shift} я ч с м и т ь б ю , . : http://', '{space}'],
      'en-shift': ['{abc} 1 2 3 4 5 6 7 8 9 0 - + = {bksp}', '{RU} Й Ц У К Е Н Г Ш Щ З Х Ъ', 'F Y V A P R O L G E', '{shift} Я Ч С М И Т Ь Б Ю , . : http://', '{space}']
    };
    this.listener = start$4();

    this.create = function () {
      var _this = this;

      _keyBord = new _keyClass({
        display: {
          '{bksp}': '&nbsp;',
          '{enter}': '&nbsp;',
          '{shift}': '&nbsp;',
          '{space}': '&nbsp;',
          '{RU}': '&nbsp;',
          '{EN}': '&nbsp;',
          '{abc}': '&nbsp;',
          '{rus}': '俄语',
          '{eng}': 'english',
          '{search}': '查找',
          '{mic}': "<svg style=\"width: 33px; height: 33px;\" viewBox=\"0 0 24 31\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect x=\"5\" width=\"14\" height=\"23\" rx=\"7\" fill=\"currentColor\"/>\n                    <path d=\"M3.39272 18.4429C3.08504 17.6737 2.21209 17.2996 1.44291 17.6073C0.673739 17.915 0.299615 18.7879 0.607285 19.5571L3.39272 18.4429ZM23.3927 19.5571C23.7004 18.7879 23.3263 17.915 22.5571 17.6073C21.7879 17.2996 20.915 17.6737 20.6073 18.4429L23.3927 19.5571ZM0.607285 19.5571C2.85606 25.179 7.44515 27.5 12 27.5V24.5C8.55485 24.5 5.14394 22.821 3.39272 18.4429L0.607285 19.5571ZM12 27.5C16.5549 27.5 21.1439 25.179 23.3927 19.5571L20.6073 18.4429C18.8561 22.821 15.4451 24.5 12 24.5V27.5Z\" fill=\"currentColor\"/>\n                    <rect x=\"10\" y=\"25\" width=\"4\" height=\"6\" rx=\"2\" fill=\"currentColor\"/>\n                    </svg>"
        },
        layout: params.layout || _default_layout,
        onChange: function onChange(value) {
          _this.listener.send('change', {
            value: value
          });
        },
        onKeyPress: function onKeyPress(button) {
          if (button === "{shift}" || button === "{abc}" || button === "{EN}" || button === "{RU}" || button === "{rus}" || button === "{eng}") _this._handle(button);else if (button === '{mic}') {
            if (recognition) {
              try {
                if (recognition.record) recognition.stop();else recognition.start();
              } catch (e) {
                recognition.stop();
              }
            }
          } else if (button === '{enter}' || button === '{search}') {
            _this.listener.send('enter');
          }
        }
      });
      this.speechRecognition();
    };

    this.speechRecognition = function () {
      var _this2 = this;

      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log('Speech', 'status:', SpeechRecognition ? true : false);

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.addEventListener("start", function () {
          console.log('Speech', 'start');
          $('.simple-keyboard [data-skbtn="{mic}"]').css('color', 'red');
          recognition.record = true;
          Noty.show('说话, я слушаю..');
        });
        recognition.addEventListener("end", function () {
          console.log('Speech', 'end');
          $('.simple-keyboard [data-skbtn="{mic}"]').css('color', 'white');
          recognition.record = false;
        });
        recognition.addEventListener("result", function (event) {
          console.log('Speech', 'result:', event.resultIndex, event.results[event.resultIndex]);
          var current = event.resultIndex;
          var transcript = event.results[current][0].transcript;
          console.log('Speech', 'transcript:', transcript);

          if (transcript.toLowerCase().trim() === "stop recording") {
            recognition.stop();
          } else {
            if (transcript.toLowerCase().trim() === "reset input") {
              _this2.value('');
            } else {
              _this2.value(transcript);
            }
          }
        });
        recognition.addEventListener("error", function (event) {
          console.log('Speech', 'error:', event);

          if (event.error == 'not-allowed') {
            Noty.show('无法访问麦克风');
          }

          recognition.stop();
        });
      } else {
        $('.simple-keyboard [data-skbtn="{mic}"]').css('opacity', '0.3');
      }
    };

    this.value = function (value) {
      _keyBord.setInput(value);

      this.listener.send('change', {
        value: value
      });
    };

    this._layout = function () {
      var keys = $('.simple-keyboard .hg-button').addClass('selector');
      Controller.collectionSet($('.simple-keyboard'));
      Controller.collectionFocus(last || keys[0], $('.simple-keyboard'));
      $('.simple-keyboard .hg-button:not(.binded)').on('hover:enter', function (e, click) {
        Controller.collectionFocus($(this)[0]);
        if (!click) _keyBord.handleButtonClicked($(this).attr('data-skbtn'), e);
      }).on('hover:focus', function (e) {
        last = e.target;
      });
      keys.addClass('binded');
    };

    this._handle = function (button) {
      var current_layout = _keyBord.options.layoutName,
          layout = 'default';

      if (button == '{shift}') {
        if (current_layout == 'default') layout = 'ru-shift';else if (current_layout == 'ru-shift') layout = 'default';else if (current_layout == 'en') layout = 'en-shift';else if (current_layout == 'en-shift') layout = 'en';
      } else if (button == '{abc}') layout = 'abc';else if (button == '{EN}' || button == '{eng}') layout = 'en';else if (button == '{RU}' || button == '{rus}') layout = 'default';

      _keyBord.setOptions({
        layoutName: layout
      });

      last = false;
      Controller.toggle('keybord');
    };

    this.toggle = function () {
      var _this3 = this;

      Controller.add('keybord', {
        toggle: function toggle() {
          _this3._layout();
        },
        up: function up() {
          if (!Navigator.canmove('up')) {
            _this3.listener.send('up');
          } else Navigator.move('up');
        },
        down: function down() {
          if (!Navigator.canmove('down')) {
            _this3.listener.send('down');
          } else Navigator.move('down');
        },
        left: function left() {
          if (!Navigator.canmove('left')) {
            _this3.listener.send('left');
          } else Navigator.move('left');
        },
        right: function right() {
          if (!Navigator.canmove('right')) {
            _this3.listener.send('right');
          } else Navigator.move('right');
        },
        back: function back() {
          _this3.listener.send('back');
        }
      });
      Controller.toggle('keybord');
    };

    this.destroy = function () {
      try {
        _keyBord.destroy();
      } catch (e) {}

      this.listener.destroy();
    };
  }

  var html$4, keyboard$1, input$1;

  function edit(params, call) {
    html$4 = Template.get('settings_input');
    input$1 = html$4.find('.settings-input__input');
    $('body').append(html$4);
    keyboard$1 = new create$3();
    keyboard$1.listener.follow('change', function (event) {
      input$1.text(event.value.trim());
    });
    keyboard$1.listener.follow('enter', function (event) {
      var val = input$1.text();
      back();
      call(val);
    });
    html$4.toggleClass('settings-input--free', params.free ? true : false);
    $('.settings-input__links', html$4).toggleClass('hide', params.nosave ? true : false);
    if (params.title) html$4.find('.settings-input__content').prepend('<div class="settings-input__title">' + params.title + '</div>');
    keyboard$1.listener.follow('down', function (event) {
      if (params.nosave) return;
      var members = Storage.get('setting_member', []);
      var links = [];
      links.push({
        title: (members.indexOf(input$1.text()) == -1 ? '添加' : '删除') + '当前值',
        subtitle: input$1.text(),
        add: true
      });
      members.forEach(function (link) {
        links.push({
          title: link,
          subtitle: '自定义链接',
          url: link,
          member: true
        });
      });
      links = links.concat([{
        title: 'jac.red',
        subtitle: '对于种子，Api 密钥 - 空',
        url: 'jac.red'
      }, {
        title: 'j.govno.co.uk',
        subtitle: '对于种子，Api 密钥 - 1',
        url: 'j.govno.co.uk'
      }, {
        title: '127.0 .0.1 8090',
        subtitle: '对于本地 TorrServ',
        url: '127.0.0.1:8090'
      }, {
        title: Utils.shortText('api.scraperapi.com/?url={q}api_key=', 35),
        subtitle: 'scraperapi.com',
        url: 'api.scraperapi.com/?url={q}&api_key='
      }]);
      Select.show({
        title: 'Links',
        items: links,
        onSelect: function onSelect(a) {
          if (a.add) {
            if (members.indexOf(a.subtitle) == -1) {
              Arrays.insert(members, 0, a.subtitle);
              Noty.show('添加 (' + a.subtitle + ')');
            } else {
              Arrays.remove(members, a.subtitle);
              Noty.show('Removed (' + a.subtitle + ')');
            }

            Storage.set('setting_member', members);
          } else {
            keyboard$1.value(a.url);
          }

          keyboard$1.toggle();
        },
        onLong: function onLong(a, elem) {
          if (a.member) {
            Arrays.remove(members, a.url);
            Noty.show('Deleted (' + a.url + ')');
            Storage.set('setting_member', members);
            $(elem).css({
              opacity: 0.4
            });
          }
        },
        onBack: function onBack() {
          keyboard$1.toggle();
        }
      });
    });
    keyboard$1.listener.follow('back', function () {
      var val = input$1.text();
      back();
      call(val);
    });
    keyboard$1.create();
    keyboard$1.value(params.value);
    keyboard$1.toggle();
  }

  function back() {
    destroy$1();
    Controller.toggle('settings_component');
  }

  function destroy$1() {
    keyboard$1.destroy();
    html$4.remove();
    html$4 = null;
    keyboard$1 = null;
    input$1 = null;
  }

  var Input = {
    edit: edit
  };

  var values = {};
  var defaults = {};
  var listener$1 = start$4();

  function init$5() {
    if (Platform.is('tizen')) {
      select('player', {
        'inner': '内置',
        'tizen': 'Tizen'
      }, 'tizen');
    }

    if (Platform.is('orsay')) {
      select('player', {
        'inner': '内置',
        'orsay': 'Orsay'
      }, 'inner');
    } else if (Platform.is('webos')) {
      select('player', {
        'inner': '内置',
        'webos': 'WebOS'
      }, 'inner');
    } else if (Platform.is('android')) {
      select('player', {
        'inner': '内置',
        'android': 'Android'
      }, 'android');
      trigger('internal_torrclient', false);
    }

    Storage.set('player_size', 'default'); //делаем возврат на нормальный масштаб видео
  }
  /**
   * Переключатель
   * @param {String} name - название
   * @param {Boolean} _default - значение по дефолту
   */


  function trigger(name, _default) {
    values[name] = {
      'true': '是',
      'false': '无'
    };
    defaults[name] = _default;
  }
  /**
   * Select
   * @param {String} name - название
   * @param {*} _select - значение
   * @param {String} _default - значение по дефолту
   */


  function select(name, _select, _default) {
    values[name] = _select;
    defaults[name] = _default;
  }
  /**
   * Биндит события на элемент
   * @param {*} elems 
   */


  function bind(elems) {
    elems.on('hover:enter', function (event) {
      var elem = $(event.target);
      var type = elem.data('type');
      var name = elem.data('name');

      if (type == 'toggle') {
        var params = values[name];
        var keys = Arrays.isArray(params) ? params : Arrays.getKeys(params),
            value = Storage.get(name, defaults[name]) + '',
            position = keys.indexOf(value);
        position++;
        if (position >= keys.length) position = 0;
        position = Math.max(0, Math.min(keys.length - 1, position));
        value = keys[position];
        Storage.set(name, value);
        update$1(elem);
      }

      if (type == 'input') {
        Input.edit({
          elem: elem,
          name: name,
          value: elem.data('string') ? window.localStorage.getItem(name) || defaults[name] : Storage.get(name, defaults[name]) + ''
        }, function (new_value) {
          Storage.set(name, new_value);
          update$1(elem);
        });
      }

      if (type == 'button') {
        listener$1.send('button', {
          name: name
        });
      }

      if (type == 'add') {
        Input.edit({
          value: ''
        }, function (new_value) {
          if (new_value && Storage.add(name, new_value)) {
            displayAddItem(elem, new_value);
            listener$1.send('update_scroll');
          }
        });
      }

      if (type == 'select') {
        var _params = values[name];

        var _value = Storage.get(name, defaults[name]) + '';

        var items = [];

        for (var i in _params) {
          items.push({
            title: _params[i],
            value: i,
            selected: i == _value
          });
        }

        var enabled = Controller.enabled().name;
        Select.show({
          title: 'Select',
          items: items,
          onBack: function onBack() {
            Controller.toggle(enabled);
          },
          onSelect: function onSelect(a) {
            Storage.set(name, a.value);
            update$1(elem);
            Controller.toggle(enabled);
          }
        });
      }
    }).each(function () {
      if (!$(this).data('static')) update$1($(this));
    });

    if (elems.eq(0).data('type') == 'add') {
      displayAddList(elems.eq(0));
    }
  }

  function displayAddItem(elem, element) {
    var name = elem.data('name');
    var item = $('<div class="settings-param selector"><div class="settings-param__name">' + element + '</div>' + '</div>');
    item.on('hover:long', function () {
      var list = Storage.get(name, '[]');
      Arrays.remove(list, element);
      Storage.set(name, list);
      item.css({
        opacity: 0.5
      });
    });
    elem.after(item);
  }

  function displayAddList(elem) {
    var list = Storage.get(elem.data('name'), '[]');
    list.forEach(function (element) {
      displayAddItem(elem, element);
    });
    listener$1.send('update_scroll');
  }
  /**
   * Обновляет значения на элементе
   * @param {*} elem 
   */


  function update$1(elem) {
    var name = elem.data('name');
    var key = elem.data('string') ? window.localStorage.getItem(name) || defaults[name] : Storage.get(name, defaults[name] + '');
    var val = typeof values[name] == 'string' ? key : values[name][key] || values[name][defaults[name]];
    var plr = elem.attr('placeholder');
    if (!val && plr) val = plr;
    elem.find('.settings-param__value').text(val);
  }
  /**
   * Получить значение параметра
   * @param {String} name 
   * @returns *
   */


  function field$1(name) {
    return Storage.get(name, defaults[name] + '');
  }
  /**
   * Добовляем селекторы
   */


  select('interface_size', {
    'small': '更小',
    'normal': '正常'
  }, 'normal');
  select('parser_torrent_type', {
    'jackett': 'Jackett',
    'torlook': 'Torlook'
  }, 'torlook');
  select('torlook_parse_type', {
    'native': '直接',
    'site': '通过网站 API'
  }, 'native');
  select('background_type', {
    'complex': '复杂',
    'simple': '简单',
    'poster': '图像'
  }, 'simple');
  select('pages_save_total', {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5'
  }, '5');
  select('player', {
    'inner': '内联'
  }, 'inner');
  select('torrserver_use_link', {
    'one': '基本',
    'two': '额外'
  }, 'one');
  select('subtitles_size', {
    'small': '小',
    'normal': '常规',
    'large': '大'
  }, 'normal');
  select('screensaver_type', {
    'movie': '电影',
    'nature': '自然',
    'chrome': 'ChromeCast'
  }, 'movie');
  select('tmdb_lang', {
      'zh-CN': '简体中文',
      'zh-HK': '繁體中文 - 香港',
      'zh-TW': '繁體中文 - 臺灣',
    'ru': '俄语',
    'en': '英语'
  }, 'zh-CN');
  select('parse_lang', {'zh-CN': '简体中文',
      'zh-HK': '繁體中文 - 香港',
      'zh-TW': '繁體中文 - 臺灣',
      'en': 'English',
    'df': '原始',
    'ru': '俄语'
  }, 'en');
  select('player_timecode', {
    'again': '重新开始',
    'continue': '继续'
  }, 'continue');
  select('player_scale_method', {
    'transform': 'Transform',
    'calculate': '计算'
  }, 'transform');
  select('source', {
    'tmdb': 'TMDB',
      'yyds': 'YYDS',
    'ivi': 'IVI',
    'okko': 'OKKO',
    'cub': 'CUB'
  }, 'yyds');
  select('start_page', {
    'main': '主页',
    'last': '最后'
  }, 'last');
  select('scroll_type', {
    'css': 'CSS',
    'js': 'Javascript'
  }, 'css');
  select('card_views_type', {
    'preload': '加载',
    'view': '全部显示'
  }, 'preload');
  select('navigation_type', {
    'controll': '遥控器',
    'mouse': '鼠标远程'
  }, 'controll');
  select('time_offset', {
    'n-5': '-5',
    'n-4': '-4',
    'n-3': '-3',
    'n-2': '-2',
    'n-1': '-1',
    'n0': '0',
    'n1': '1',
    'n2': '2',
    'n3': '3',
    'n4': '4',
    'n5': '5'
  }, 'n0');
  /**
   * Добовляем тригеры
   */

  trigger('animation', true);
  trigger('background', true);
  trigger('torrserver_savedb', false);
  trigger('torrserver_preload', false);
  trigger('parser_use', false);
  trigger('cloud_use', false);
  trigger('account_use', false);
  trigger('torrserver_auth', false);
  trigger('mask', true);
  trigger('playlist_next', true);
  trigger('internal_torrclient', true);
  trigger('subtitles_stroke', true);
  trigger('subtitles_backdrop', false);
  trigger('screensaver', true);
  /**
   * Добовляем поля
   */

  select('jackett_url', '', 'jac.red');
  select('jackett_key', '', '');
  select('torrserver_url', '', '');
  select('torrserver_url_two', '', '');
  select('torrserver_login', '', '');
  select('torrserver_password', '', '');
  select('parser_website_url', '', '');
  select('torlook_site', '', 'w41.torlook.info');
  select('cloud_token', '', '');
  select('account_email', '', '');
  select('account_password', '', '');
  select('device_name', '', 'Lampa');
  var Params = {
    listener: listener$1,
    init: init$5,
    bind: bind,
    update: update$1,
    field: field$1
  };

  var listener = start$4();

  function get$1(name, empty) {
    var value = window.localStorage.getItem(name) || empty || '';
    var convert = parseInt(value);
    if (!isNaN(convert) && /^\d+$/.test(value)) return convert;

    if (value == 'true' || value == 'false') {
      return value == 'true' ? true : false;
    }

    try {
      value = JSON.parse(value);
    } catch (error) {}

    return value;
  }

  function set(name, value, nolisten) {
    if (Arrays.isObject(value) || Arrays.isArray(value)) {
      var str = JSON.stringify(value);
      window.localStorage.setItem(name, str);
    } else {
      window.localStorage.setItem(name, value);
    }

    if (!nolisten) listener.send('change', {
      name: name,
      value: value
    });
  }

  function add$1(name, new_value) {
    var list = get$1(name, '[]');

    if (list.indexOf(new_value) == -1) {
      list.push(new_value);
      set(name, list);
      listener.send('add', {
        name: name,
        value: new_value
      });
      return true;
    }
  }

  function field(name) {
    return Params.field(name);
  }

  function cache(name, max, empty) {
    var result = get$1(name, JSON.stringify(empty));

    if (Arrays.isObject(empty)) {
      var c = Arrays.getKeys(result);
      if (c.length > max) delete result[c[0]];
      set(name, result);
    } else if (result.length > max) {
      result.shift();
      set(name, result);
    }

    return result;
  }

  var Storage = {
    listener: listener,
    get: get$1,
    set: set,
    field: field,
    cache: cache,
    add: add$1
  };

  function init$4() {
    if (typeof webOS !== 'undefined' && webOS.platform.tv === true) {
      Storage.set('platform', 'webos');
      webOS.deviceInfo(function (e) {
        webOS.sdk_version = parseFloat(e.sdkVersion);
      });
    } else if (typeof webapis !== 'undefined' && typeof tizen !== 'undefined') {
      Storage.set('platform', 'tizen');
      tizen.tvinputdevice.registerKey("MediaPlayPause");
      tizen.tvinputdevice.registerKey("MediaPlay");
      tizen.tvinputdevice.registerKey("MediaStop");
      tizen.tvinputdevice.registerKey("MediaPause");
      tizen.tvinputdevice.registerKey("MediaRewind");
      tizen.tvinputdevice.registerKey("MediaFastForward");
    } else if (navigator.userAgent.toLowerCase().indexOf("lampa_client") > -1) {
      Storage.set('platform', 'android');
    } else if (navigator.userAgent.toLowerCase().indexOf("windows nt") > -1) {
      Storage.set('platform', 'browser');
    } else if (navigator.userAgent.toLowerCase().indexOf("maple") > -1) {
      Storage.set('platform', 'orsay');
    } else {
      Storage.set('platform', '');
    }

    Storage.set('platform', 'android');
      Storage.set('native', Storage.get('platform') ? true : false);
  }
  /**
   * Какая платформа
   * @returns String
   */


  function get() {
    return Storage.get('platform', '');
  }
  /**
   * Если это платформа
   * @param {String} need - какая нужна? tizen, webos, android, orsay
   * @returns Boolean
   */


  function is(need) {
    if (get() == need) return true;
  }
  /**
   * Если хоть одна из платформ tizen, webos, android
   * @returns Boolean
   */


  function any() {
    if (is('tizen') || is('webos') || is('android')) return true;
  }

  var Platform = {
    init: init$4,
    get: get,
    any: any,
    is: is
  };

  var html$3;
  var last;
  var scroll$1;

  function init$3() {
    html$3 = Template.get('menu');
    scroll$1 = new create$q({
      mask: true,
      over: true
    });
    Lampa.Listener.send('menu', {
      type: 'start',
      body: html$3
    });
    $('body').on('mouseup', function () {
      if ($('body').hasClass('menu--open')) {
        $('body').toggleClass('menu--open', false);
        Controller.toggle('content');
      }
    });
    scroll$1.minus();
    scroll$1.append(html$3);
    Lampa.Listener.send('menu', {
      type: 'end'
    });
    Controller.add('menu', {
      toggle: function toggle() {
        Controller.collectionSet(html$3);
        Controller.collectionFocus(last, html$3);
        $('body').toggleClass('menu--open', true);
      },
      right: function right() {
        Controller.toggle('content');
      },
      up: function up() {
        if (Navigator.canmove('up')) Navigator.move('up');else Controller.toggle('head');
      },
      down: function down() {
        Navigator.move('down');
      },
      gone: function gone() {
        $('body').toggleClass('menu--open', false);
      },
      back: function back() {
        Activity$1.backward();
      }
    });
  }

  function ready() {
    html$3.find('.selector').on('hover:enter', function (e) {
      var action = $(e.target).data('action');
      var type = $(e.target).data('type');
      if (action == 'catalog') catalog();

      if (action == 'movie' || action == 'tv' || action == 'anime') {
        Activity$1.push({
          url: action,
          title: (action == 'movie' ? '电影' : action == 'anime' ? '动漫' : '电视剧') + ' - ' + Storage.field('source').toUpperCase(),
          component: 'category',
          source: action == 'anime' ? 'cub' : Storage.field('source')
        });
      }

      if (action == 'main') {
        Activity$1.push({
          url: '',
          title: 'Home -' + Storage.field('source').toUpperCase(),
          component: 'main',
          source: Storage.field('source')
        });
      }

      if (action == 'search') Controller.toggle('search');
      if (action == 'settings') Controller.toggle('settings');

      if (action == 'about') {
        Modal.open({
          title: 'O应用程序',
          html: Template.get('about'),
          size: 'medium',
          onBack: function onBack() {
            Modal.close();
            Controller.toggle('content');
          }
        });
      }

      if (action == 'favorite') {
        Activity$1.push({
          url: '',
          title: type == 'book' ? '书签' : type == 'like' ? '喜欢' : type == 'history' ? '浏览历史' : '稍后',
          component: 'favorite',
          type: type,
          page: 1
        });
      }

      if (action == 'mytorrents') {
        Activity$1.push({
          url: '',
          title: '我的种子',
          component: 'mytorrents',
          page: 1
        });
      }

      if (action == 'relise') {
        Activity$1.push({
          url: '',
          title: '数字发布',
          component: 'relise',
          page: 1
        });
      }

      if (action == 'collections') {
        Select.show({
          title: '合集',
          items: [{
            title: 'ivi 上的合集',
            source: 'ivi'
          }, {
            title: 'okko 上的合集',
            source: 'okko'
          }],
          onSelect: function onSelect(a) {
            Activity$1.push({
              url: '',
              source: a.source,
              title: a.title,
              component: 'collections',
              page: 1
            });
          },
          onBack: function onBack() {
            Controller.toggle('menu');
          }
        });
      }
    }).on('hover:focus', function (e) {
      last = e.target;
      scroll$1.update($(e.target), true);
    });
  }

  function catalog() {
    Api.menu({
      source: Storage.field('source')
    }, function (menu) {
      Select.show({
        title: '目录',
        items: menu,
        onSelect: function onSelect(a) {
          var tmdb = Storage.field('source') == 'tmdb' || Storage.field('source') == 'cub';
          Activity$1.push({
            url: Storage.field('source') == 'tmdb' ? 'movie' : '',
            title: '目录 -' + a.title + ' - ' + Storage.field('source').toUpperCase(),
            component: tmdb ? 'category' : 'category_full',
            genres: a.id,
            id: a.id,
            source: Storage.field('source'),
            card_type: true,
            page: 1
          });
        },
        onBack: function onBack() {
          Controller.toggle('menu');
        }
      });
    });
  }

  function render$1() {
    return scroll$1.render();
  }

  var Menu = {
    render: render$1,
    init: init$3,
    ready: ready
  };

  function create$2() {
    var scroll,
        timer,
        items = [],
        active = 0,
        query;
    this.listener = start$4();

    this.create = function () {
      scroll = new create$q({
        over: true
      });
    };

    this.search = function (value) {
      var _this = this;

      clearTimeout(timer);
      query = value;
      Api.clear();

      if (value.length >= 3) {
        timer = setTimeout(function () {
          Api.search({
            query: encodeURIComponent(value)
          }, function (data) {
            _this.clear();

            if (data.movie && data.movie.results.length) _this.build(data.movie, 'movie');
            if (data.tv && data.tv.results.length) _this.build(data.tv, 'tv');
            if (data.parser && data.parser.results.length) _this.build(data.parser, 'parser');
            var name = Controller.enabled().name;
            if (name == 'items_line' || name == 'search_results') Controller.toggle('search_results');
          });
        }, 1000);
      } else {
        this.clear();
      }
    };

    this.build = function (data, type) {
      var _this2 = this;

      data.noimage = true;
      var params = {
        align_left: true,
        object: {
          source: 'tmdb'
        },
        isparser: type == 'parser'
      };

      if (type == 'parser') {
        params.card_events = {
          onMenu: function onMenu() {}
        };
      }

      var item = new create$m(data, params);
      item.onDown = this.down;
      item.onUp = this.up;
      item.onBack = this.back.bind(this);

      item.onLeft = function () {
        _this2.listener.send('left');
      };

      item.onEnter = function () {
        _this2.listener.send('enter');
      };

      item.onMore = function (e, element) {
        if (type == 'parser') {
          _this2.listener.send('enter');

          Activity$1.push({
            url: '',
            title: 'Torrents',
            component: 'torrents',
            search: query,
            movie: {
              title: query,
              original_title: '',
              img: './img/img_broken.svg',
              genres: []
            },
            page: 1
          });
        } else {
          Activity$1.push({
            url: 'search/' + type,
            title: '搜索 -' + query,
            component: 'category_full',
            page: 2,
            query: encodeURIComponent(query),
            source: 'tmdb'
          });
        }
      };

      if (type == 'parser') {
        item.onEnter = false;

        item.onPrevent = function (e, element) {
          if (element.reguest && !element.MagnetUri) {
            Parser.marnet(element, function () {
              Modal.close();
              Controller.toggle('search_results');
              Torrent.start(element, {
                title: element.Title
              });
              Torrent.back(_this2.toggle.bind(_this2));
            }, function (text) {
              Modal.update(Template.get('error', {
                title: '错误',
                text: text
              }));
            });
            Modal.open({
              title: '',
              html: Template.get('modal_pending', {
                text: '请求磁力链接'
              }),
              onBack: function onBack() {
                Modal.close();

                _this2.toggle();
              }
            });
          } else {
            Controller.toggle('search_results');
            Torrent.start(element, {
              title: element.Title
            });
            Torrent.back(_this2.toggle.bind(_this2));
          }
        };
      }

      item.create();
      items.push(item);
      scroll.append(item.render());
    };

    this.any = function () {
      return items.length;
    };

    this.back = function () {
      this.listener.send('back');
    };

    this.down = function () {
      active++;
      active = Math.min(active, items.length - 1);
      items[active].toggle();
      scroll.update(items[active].render());
    };

    this.up = function () {
      active--;

      if (active < 0) {
        active = 0;
      } else {
        items[active].toggle();
      }

      scroll.update(items[active].render());
    };

    this.clear = function () {
      scroll.reset();
      scroll.append('<div class="selector" style="opacity: 0"></div>');
      active = 0;
      Arrays.destroy(items);
      items = [];
    };

    this.toggle = function () {
      var _this3 = this;

      Controller.add('search_results', {
        invisible: true,
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());

          if (items.length) {
            items[active].toggle();
          }
        },
        back: function back() {
          _this3.listener.send('back');
        },
        left: function left() {
          _this3.listener.send('left');
        }
      });
      Controller.toggle('search_results');
    };

    this.render = function () {
      return scroll.render();
    };

    this.destroy = function () {
      clearTimeout(timer);
      Api.clear();
      this.clear();
      scroll.destroy();
      this.listener.destroy();
    };
  }

  function create$1() {
    var scroll,
        last,
        keys = [];
    this.listener = start$4();

    this.create = function () {
      var _this = this;

      scroll = new create$q({
        over: true,
        mask: false,
        nopadding: true
      });
      keys = Storage.get('search_history', '[]');
      keys.forEach(function (key) {
        _this.append(key);
      });
    };

    this.append = function (value) {
      var _this2 = this;

      var key = $('<div class="search-history-key selector"><div><span>' + value + '</span><div>左方向键 - 删除</div></div></div>');
      key.on('hover:enter', function () {
        _this2.listener.send('enter', {
          value: value
        });
      }).on('hover:focus', function (e) {
        last = e.target;
        scroll.update($(e.target));
      });
      scroll.append(key);
    };

    this.add = function (value) {
      if (keys.indexOf(value) == -1) {
        Arrays.insert(keys, 0, value);
        Storage.set('search_history', keys);
      }
    };

    this.toggle = function () {
      var _this3 = this;

      Controller.add('search_history', {
        toggle: function toggle() {
          Controller.collectionSet(scroll.render());
          Controller.collectionFocus(last, scroll.render());
        },
        up: function up() {
          if (Navigator.canmove('up')) Navigator.move('up');else _this3.listener.send('up');
        },
        down: function down() {
          Navigator.move('down');
        },
        right: function right() {
          _this3.listener.send('right');
        },
        back: function back() {
          _this3.listener.send('back');
        },
        left: function left() {
          var elem = scroll.render().find('.focus'),
              selc = scroll.render().find('.selector');

          if (elem.length) {
            Arrays.remove(keys, $('span', elem).text());
            Storage.set('search_history', keys);
            var index = selc.index(elem);
            if (index > 0) last = selc.eq(index - 1)[0];else if (selc[index + 1]) last = selc.eq(index + 1)[0];
            elem.remove();
            if (selc.length - 1 <= 0) last = false;
            Controller.toggle('search_history');
          }
        }
      });
      Controller.toggle('search_history');
    };

    this.any = function () {
      return keys.length;
    };

    this.render = function () {
      return scroll.render();
    };

    this.destroy = function () {
      scroll.destroy();
      this.listener.destroy();
      keys = null;
      last = null;
    };
  }

  var html$2 = $('<div></div>'),
      search,
      results,
      history,
      keyboard,
      input = '';

  function create() {
    search = Template.get('search');
    html$2.append(search);
    createHistory();
    createResults();
    createKeyboard();
  }

  function createHistory() {
    history = new create$1();
    history.create();
    history.listener.follow('right', function () {
      results.toggle();
    });
    history.listener.follow('up', function () {
      keyboard.toggle();
    });
    history.listener.follow('enter', function (event) {
      results.clear();
      keyboard.value(event.value);
      results.toggle();
    });
    history.listener.follow('back', destroy);
    search.find('.search__history').append(history.render());
  }

  function createResults() {
    results = new create$2();
    results.create();
    results.listener.follow('left', function () {
      keyboard.toggle();
    });
    results.listener.follow('enter', function () {
      if (input) history.add(input);
      destroy();
    });
    results.listener.follow('back', destroy);
    search.find('.search__results').append(results.render());
  }

  function createKeyboard() {
    keyboard = new create$3({
      layout: {
        'default': ['1 2 3 4 5 6 7 8 9 0 -', 'q w e r t y u i o p', 'a s d f g h j k l', 'z x c v b n m .', '{mic} {RU} {space} {bksp}'],
        'en': ['1 2 3 4 5 6 7 8 9 0 -', 'й ц у к е н г ш щ з х ъ', 'ф ы в а п р о л д ж э', 'ё я ч с м и т ь б ю .', '{mic} {EN} {space} {bksp}']
      }
    });
    keyboard.create();
    keyboard.listener.follow('change', function (event) {
      input = event.value.trim();

      if (input) {
        search.find('.search__input').text(input);
        results.search(input);
      } else {
        search.find('.search__input').text('输入文本...');
      }
    });
    keyboard.listener.follow('right', function () {
      if (results.any()) results.toggle();
    });
    keyboard.listener.follow('down', function () {
      if (history.any()) history.toggle();
    });
    keyboard.listener.follow('back', destroy);
    keyboard.toggle();
  }

  function render() {
    return html$2;
  }

  function destroy() {
    keyboard.destroy();
    results.destroy();
    history.destroy();
    search.remove();
    html$2.empty();
    Controller.toggle('content');
  }

  Controller.add('search', {
    invisible: true,
    toggle: function toggle() {
      create();
    },
    back: destroy
  });
  var Search = {
    render: render
  };

  function app() {
    var app = $('#app').empty();
    var wrap = Template.get('wrap');
    wrap.find('.wrap__left').append(Menu.render());
    wrap.find('.wrap__content').append(Activity$1.render());
    app.append(Background.render());
    app.append(Head.render());
    app.append(wrap);
    app.append(Settings.render());
    app.append(Search.render());
    app.append(Noty.render());
  }

  var Render = {
    app: app
  };

  var items = [];
  var times = 0;
  var html$1;
  var scroll;

  function init$2() {
    Keypad.listener.follow('keydown', function (e) {
      if (e.code == 38 || e.code == 29460) {
        var enable = Controller.enabled();

        if (enable.name == 'head') {
          times++;

          if (times > 10) {
            Controller.toggle('console');
          }
        } else {
          times = 0;
        }
      }
    });
    Controller.add('console', {
      toggle: function toggle() {
        build();
        Controller.collectionSet(html$1);
        Controller.collectionFocus(false, html$1);
      },
      up: function up() {
        Navigator.move('up');
      },
      down: function down() {
        Navigator.move('down');
      },
      back: function back() {
        times = 0;
        scroll.destroy();
        html$1.remove();
        Controller.toggle('head');
      }
    });
    follow();
  }

  function build() {
    html$1 = Template.get('console');
    scroll = new create$q({
      over: true
    });
    scroll.minus();
    items.forEach(function (element) {
      var item = $(element);
      item.on('hover:focus', function (e) {
        scroll.update($(e.target));
      });
      scroll.append(item);
    });
    html$1.append(scroll.render());
    $('body').append(html$1);
  }

  function add(message) {
    try {
      Arrays.insert(items, 0, '<div class="console__line selector"><span>' + message + '</span></div>');
    } catch (e) {
      Arrays.insert(items, 0, '<div class="console__line selector"><span>Failed to print line</span></div>');
    }

    if (items.length > 50) items.pop();
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function decode(arr) {
    if (Arrays.isObject(arr) || Arrays.isArray(arr)) {
      arr = JSON.stringify(arr);
    } else if (typeof arr === 'string' || typeof arr === 'number' || typeof arr === 'boolean') {
      arr = escapeHtml(arr + '');
    } else {
      var a = [];

      for (var i in arr) {
        a.push(i + ': ' + arr[i]);
      }

      arr = JSON.stringify(a);
    }

    arr = Utils.shortText(arr, 600);
    return arr;
  }

  function follow() {
    var log = console.log;

    console.log = function () {
      var msgs = [];
      var mcon = [];

      while (arguments.length) {
        var arr = [].shift.call(arguments);
        msgs.push(decode(arr));
        mcon.push(arr);
      }

      msgs[0] = '<span style="color: ' + Utils.stringToHslColor(msgs[0], 50, 65) + '">' + msgs[0] + '</span>';
      add(msgs.join(' '));
      log.apply(console, mcon);
    };

    window.addEventListener("error", function (e) {
      add((e.error || e).message + '<br><br>' + (e.error && e.error.stack ? e.error.stack : e.stack || '').split("\n").join('<br>'));
      Noty.show('Error: ' + (e.error || e).message + '<br><br>' + (e.error && e.error.stack ? e.error.stack : e.stack || '').split("\n").join('<br>'));
    });
  }

  var Console = {
    init: init$2
  };

  var body$1;
  var code = 0;
  var network = new create$r();
  var fields = ['torrents_view', 'plugins', 'favorite', 'file_view'];
  var timer;
  var readed;
  /**
   * Запуск
   */

  function init$1() {
    if (Storage.field('cloud_use')) status(1);
    Settings.listener.follow('open', function (e) {
      body$1 = null;

      if (e.name == 'cloud') {
        body$1 = e.body;
        renderStatus();
      }
    });
    Storage.listener.follow('change', function (e) {
      if (e.name == 'cloud_token') {
        login(start);
      } else if (e.name == 'cloud_use') {
        if (e.value == 'true') login(start);else status(0);
      } else if (fields.indexOf(e.name) >= 0) {
        clearTimeout(timer);
        timer = setTimeout(update, 500);
      }
    });
    login(start);
  }
  /**
   * Статус
   * @param {Int} c - код
   */


  function status(c) {
    code = c;
    renderStatus();
  }
  /**
   * Рендер статуса
   */


  function renderStatus() {
    if (body$1) {
      var item = body$1.find('.settings--cloud-status'),
          name = item.find('.settings-param__name'),
          desc = item.find('.settings-param__descr');

      if (code == 0) {
        name.text('已禁用');
        desc.text('启用同步');
      }

      if (code == 1) {
        name.text('未授权');
        desc.text('需要登录');
      }

      if (code == 2) {
        name.text('授权失败');
        desc.text('请检查您的详细信息，然后重试');
      }

      if (code == 3) {
        name.text('登录');
        desc.text('您已成功登录');
      }

      if (code == 4) {
        var time = Utils.parseTime(Storage.get('cloud_time', '2021.01.01'));
        name.text('同步');
        desc.text(time.full + 'in' + time.time);
      }
    }
  }
  /**
   * Проверка авторизации
   * @param {Function} good - успешно
   * @param {Function} fail - провал
   */


  function login(good, fail) {
    if (Storage.get('cloud_token') && Storage.field('cloud_use')) {
      network.silent('https://api.github.com/gists', function (data) {
        status(3);
        if (good) good();
        network.silent('https://api.github.com/gists/' + data.id, false, false, false, {
          type: 'delete',
          beforeSend: {
            name: 'Authorization',
            value: 'bearer ' + Storage.get('cloud_token')
          },
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
      }, function () {
        status(2);
        if (fail) fail();
      }, JSON.stringify({
        'files': {
          'lampa-login.json': {
            'content': '{"login":true}'
          }
        }
      }), {
        beforeSend: {
          name: 'Authorization',
          value: 'bearer ' + Storage.get('cloud_token')
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    } else {
      status(Storage.field('cloud_use') ? 1 : 0);
      if (fail) fail();
    }
  }
  /**
   * Считываем файл и обновляем данные с облака
   */


  function read(call) {
    var time = Storage.get('cloud_time', '2021.01.01');

    if (time !== readed.item.updated_at) {
      network.silent(readed.file.raw_url, function (data) {
        Storage.set('cloud_time', readed.item.updated_at);

        for (var i in data) {
          Storage.set(i, data[i], true);
        }

        status(4);
        if (call) call();
      });
    } else if (call) call();
  }
  /**
   * Обновляем состояние
   */


  function update() {
    save();
  }
  /**
   * Получаем список файлов
   */


  function start(call) {
    if (Storage.get('cloud_token') && Storage.field('cloud_use')) {
      network.silent('https://api.github.com/gists', function (data) {
        var file;
        var item;
        data.forEach(function (elem) {
          for (var i in elem.files) {
            if (elem.files[i].filename == 'lampa-data.json') {
              item = elem;
              file = elem.files[i];
            }
          }
        });

        if (file) {
          Storage.set('cloud_data_id', item.id);
          readed = {
            file: file,
            item: item
          };
          read(call);
        } else save(call);
      }, function () {}, false, {
        beforeSend: {
          name: 'Authorization',
          value: 'bearer ' + Storage.get('cloud_token')
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    }
  }
  /**
   * Сохраняем закладки в облако
   */


  function save(call) {
    if (Storage.get('cloud_token') && Storage.field('cloud_use')) {
      var conent = JSON.stringify({
        torrents_view: Storage.get('torrents_view', '[]'),
        plugins: Storage.get('plugins', '[]'),
        favorite: Storage.get('favorite', '{}'),
        file_view: Storage.get('file_view', '{}'),
        setting_member: Storage.get('setting_member', '[]')
      }, null, 4);
      var id = Storage.get('cloud_data_id', '');
      network.silent('https://api.github.com/gists' + (id ? '/' + id : ''), function (data) {
        Storage.set('cloud_time', data.updated_at);
        Storage.set('cloud_data_id', data.id);
        status(4);
        if (call) call();
      }, function () {
        Storage.set('cloud_data_id', '');
        status(5);
      }, JSON.stringify({
        'files': {
          'lampa-data.json': {
            'content': conent
          }
        }
      }), {
        beforeSend: {
          name: 'Authorization',
          value: 'bearer ' + Storage.get('cloud_token')
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    }
  }

  var Cloud = {
    init: init$1
  };

  var body;
  /**
   * Запуск
   */

  function init() {
    Settings.listener.follow('open', function (e) {
      body = null;

      if (e.name == 'plugins') {
        body = e.body;
        renderPanel();
      }
    });
  }
  /**
   * Рендер панели плагинов
   */


  function renderPanel() {
    if (body) {
      var list = Storage.get('plugins', '[]');
      $('.selector', body).on('hover:enter', function () {
        Input.edit({
          value: ''
        }, function (new_value) {
          if (new_value && Storage.add('plugins', new_value)) {
            renderPlugin(new_value, {
              is_new: true,
              checked: function checked(error) {
                Modal.open({
                  title: '',
                  html: $('<div class="about"><div class="selector">' + (error ? '检查插件失败, 然而，这并不意味着它不起作用。重新加载应用程序以查看插件是否正在加载。' : '为了让插件工作, необходимо перезагрузить приложение.') + '</div></div>'),
                  onBack: function onBack() {
                    Modal.close();
                    Controller.toggle('settings_component');
                  },
                  onSelect: function onSelect() {
                    Modal.close();
                    Controller.toggle('settings_component');
                  }
                });
              }
            });
            Params.listener.send('update_scroll');
          }
        });
      });
      list.forEach(function (url) {
        renderPlugin(url);
      });
      Account.plugins(function (plugins) {
        plugins.forEach(function (plugin) {
          renderPlugin(plugin.url, {
            is_cub: true,
            plugin: plugin
          });
        });
        Controller.enable('settings_component');
        Params.listener.send('update_scroll');
      });
      Params.listener.send('update_scroll');
    }
  }
  /**
   * Рендер плагина
   */


  function renderPlugin(url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var item = $('<div class="settings-param selector"><div class="settings-param__name">' + url + '</div><div class="settings-param__descr">' + (params.is_cub ? '加载自 CUB' : '点击查看插件') + '</div><div class="settings-param__status"></div></div>');

    var check = function check() {
      var status = $('.settings-param__status', item).removeClass('active error wait').addClass('wait');
      $.ajax({
        dataType: 'text',
        url: url,
        timeout: 2000,
        crossDomain: true,
        success: function success(data) {
          status.removeClass('wait').addClass('active');
          if (params.checked) params.checked();
        },
        error: function error(jqXHR, exception) {
          status.removeClass('wait').addClass('error');
          if (params.checked) params.checked(true);
        }
      });
    };

    if (!params.is_cub) {
      item.on('hover:long', function () {
        var list = Storage.get('plugins', '[]');
        Arrays.remove(list, url);
        Storage.set('plugins', list);
        item.css({
          opacity: 0.5
        });
      });
    } else {
      if (!params.plugin.status) item.css({
        opacity: 0.5
      });
    }

    item.on('hover:enter', check);
    if (params.is_new) check();
    $('.selector:eq(0)', body).after(item);
  }
  /**
   * Загрузка всех плагинов
   */


  function load(call) {
    Account.plugins(function (plugins) {
      var list = plugins.filter(function (plugin) {
        return plugin.status;
      }).map(function (plugin) {
        return plugin.url;
      }).concat(Storage.get('plugins', '[]'));
      console.log('Plugins', 'list:', list);
      Utils.putScript(list, call);
    });
  }

  var Plugins = {
    init: init,
    load: load
  };

  var socket;
  var ping;
  var uid = Utils.uid();

  function connect() {
    clearInterval(ping);

    try {
      socket = new WebSocket('wss://cub.watch:8020');
    } catch (e) {
      console.log('Socket', 'not work');
      return;
    }

    socket.addEventListener('open', function (event) {
      console.log('Socket', 'open');
      send('start', {});
      ping = setInterval(function () {
        send('ping', {});
      }, 5000);
    });
    socket.addEventListener('close', function (event) {
      console.log('Socket', 'close', event.code);
      setTimeout(connect, 5000);
    });
    socket.addEventListener('error', function (event) {
      console.log('Socket', 'error', event.message, event.code);
      socket.close();
    }, false);
    socket.addEventListener('message', function (event) {
      var result = JSON.parse(event.data);

      if (result.method == 'devices') ; else if (result.method == 'open') {
        Controller.toContent();
        Activity$1.push(result.data);
      }
    });
  }

  function send(method, data) {
    data.device_id = uid;
    data.name = Storage.field('device_name');
    data.method = method;
    data.version = 1;
    socket.send(JSON.stringify(data));
  }

  var Socket = {
    init: connect,
    send: send
  };

  window.Lampa = {
    Listener: start$4(),
    Subscribe: start$4,
    Storage: Storage,
    Platform: Platform,
    Utils: Utils,
    Params: Params,
    Menu: Menu,
    Head: Head,
    Notice: Notice,
    Background: Background,
    Favorite: Favorite,
    Select: Select,
    Controller: Controller,
    Activity: Activity$1,
    Keypad: Keypad,
    Template: Template,
    Component: Component,
    Reguest: create$r,
    Filter: create$6,
    Files: create$8,
    Scroll: create$q,
    Empty: create$k,
    Arrays: Arrays,
    Noty: Noty,
    Player: Player,
    Timeline: Timeline,
    Modal: Modal,
    Api: Api,
    Cloud: Cloud,
    Settings: Settings,
    Android: Android,
    Card: create$o,
    Info: create$l,
    Account: Account,
    Socket: Socket,
    Input: Input
  };
  Console.init();

  function startApp() {
    if (window.appready) return;
    Lampa.Listener.send('app', {
      type: 'start'
    });
    Keypad.init();
    Settings.init();
    Platform.init();
    Params.init();
    Favorite.init();
    Background.init();
    Notice.init();
    Head.init();
    Menu.init();
    Activity$1.init();

    if (Platform.is('orsay')) {
      Orsay.init();
    }

    Layer.init();
    Screensaver.init();
    Cloud.init();
    Account.init();
    Plugins.init();
    Socket.init();
    Storage.set('account_password', ''); //надо зачиcтить, не хорошо светить пароль ;)

    Controller.listener.follow('toggle', function () {
      Layer.update();
    });
    Activity$1.listener.follow('backward', function (event) {
      if (event.count == 1) {
        var enabled = Controller.enabled();
        Select.show({
          title: '退出',
          items: [{
            title: '是，退出',
            out: true
          }, {
            title: '继续看'
          }],
          onSelect: function onSelect(a) {
            if (a.out) {
              Activity$1.out();
              Controller.toggle(enabled.name);
              if (Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
              if (Platform.is('webos')) window.close();
              if (Platform.is('android')) Android.exit(); //пока не используем, нужно разобраться почему вызывается активити при загрузке главной

              if (Platform.is('orsay')) Orsay.exit();
            } else {
              Controller.toggle(enabled.name);
            }
          },
          onBack: function onBack() {
            Controller.toggle(enabled.name);
          }
        });
      }
    });
    Navigator.follow('focus', function (event) {
      Controller.focus(event.elem);
    });
    Render.app();
    Layer.update();
    Activity$1.last();
    setTimeout(function () {
      Keypad.enable();
      Screensaver.enable();
      $('.welcome').fadeOut(500);
    }, 1000);
    $('body').addClass('platform--' + Platform.get());

    if (Platform.is('orsay')) {
      Utils.putStyle(['http://lampa.mx/css/app.css'], function () {
        $('link[href="css/app.css"]').remove();
      });
    } else if (window.location.protocol == 'file:') {
      Utils.putStyle(['https://yumata.github.io/lampa/css/app.css'], function () {
        $('link[href="css/app.css"]').remove();
      });
    }

    if (Platform.is('android')) {
      Params.listener.follow('button', function (e) {
        if (e.name === 'reset_player') {
          Android.resetDefaultPlayer();
        }
      });
    }

    Favorite.listener.follow('add,added', function (e) {
      if (e.where == 'history' && e.card.id) {
        $.get(Utils.protocol() + 'tmdb.cub.watch/watch?id=' + e.card.id + '&cat=' + (e.card.original_name ? 'tv' : 'movie'));
      }
    });
    Utils.putScript([window.location.protocol == 'file:' ? 'https://yumata.github.io/lampa/vender/hls/hls.js' : './vender/hls/hls.js'], function () {});
    Lampa.Listener.send('app', {
      type: 'ready'
    });
    Menu.ready();
    window.appready = true; //пометка что уже загружено
  } // принудительно стартовать


  setTimeout(startApp, 1000 * 5);
  Plugins.load(startApp);

})();
