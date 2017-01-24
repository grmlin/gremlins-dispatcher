(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cache = {};

var Emitter = {
  registerHandler: function registerHandler(handlerName, handler, component) {
    if (typeof handler !== 'function') {
      throw new Error('<' + component.name + ' /> — Handler for the interest ' + handlerName + ' is missing!');
    }

    if (cache[handlerName] === undefined) {
      cache[handlerName] = [];
    }

    cache[handlerName].push({
      handler: handler,
      component: component
    });
  },
  unregisterHandler: function unregisterHandler(handlerName, component) {
    if (cache[handlerName] !== undefined) {
      cache[handlerName] = cache[handlerName].filter(function (callbackObj) {
        return callbackObj.component !== component;
      });
    }
  },
  dispatch: function dispatch(handlerName, data, component) {
    if (cache[handlerName] !== undefined) {
      window.setTimeout(function () {
        cache[handlerName].forEach(function (callbackObj) {
          if (callbackObj.component !== component) {
            callbackObj.handler.call(callbackObj.component, data);
          }
        });
      }, 10);
    }
  }
};

function addInterests(component) {
  var listeners = typeof component.getListeners === 'function' ? component.getListeners() : {};

  for (var handler in listeners) {
    if (listeners.hasOwnProperty(handler)) {
      Emitter.registerHandler(handler, component[listeners[handler]], component);
    } else {
      console.warn('registering interest "' + handler + '" failed', component);
    }
  }
}

function removeInterests(component) {
  var listeners = typeof component.getListeners === 'function' ? component.getListeners() : {};
  for (var handler in listeners) {
    if (listeners.hasOwnProperty(handler)) {
      Emitter.unregisterHandler(handler, component);
    }
  }
}

module.exports = {
  attached: function attached() {
    addInterests(this);
  },
  detached: function detached() {
    removeInterests(this);
  },
  emit: function emit(eventName, eventData) {
    Emitter.dispatch(eventName, eventData, this);
  }
};
},{}],2:[function(require,module,exports){
'use strict';

var gremlins   = require('gremlins'),
    dispatcher = require('../../lib/index');

describe('gremlinjs-dispatcher', function () {

  it('augments gremlin instances', function (done) {
    this.timeout(5000);
    var count = 0;

    gremlins.create('interests-gremlin', {
      mixins: [dispatcher],
      getListeners(){
        return {
          'FOO': 'onFoo'
        };
      },
      created() {
        try {
          expect(this.emit).to.be.a('function');
          count++;//done();
        } catch (e) {
          done(e);
        }
      },
      onFoo(data) {
        count++;
        try {
          expect(count).to.equal(3);
          expect(data).to.be.an('object');
          expect(data.foo).to.equal('foo');
          setTimeout(done, 500);
        } catch (e) {
          done(e);
        }
      }
    });

    gremlins.create('interests2-gremlin', {
      mixins: [dispatcher],
      getListeners(){
        return {
          'FOO': 'onFoo'
        };
      },
      attached() {
        window.setTimeout(()=>this.emit('FOO', {foo: 'foo'}), 500);
      },
      onFoo() {
        throw new Error('The dispatching components callback should not be called');
      }
    });

    gremlins.create('interests3-gremlin', {
      mixins: [dispatcher],
      getListeners(){
        return {
          'FOO': 'onFoo'
        };
      },
      created() {

      },
      onFoo() {
        throw new Error('Components outside the dom should not be called');
      }
    });

    var el  = document.createElement('interests-gremlin');
    var el2 = document.createElement('interests2-gremlin');
    var el3 = document.createElement('interests-gremlin');
    var el4 = document.createElement('interests3-gremlin');

    document.body.appendChild(el4);

    setTimeout(() =>{
      document.body.removeChild(el4);
      el4 = null;

      setTimeout(() =>{
        document.body.appendChild(el);
        document.body.appendChild(el2);
        el2 = null;
        el4 = null;
        el = null;
      }, 500);
    }, 500);


  });


});

},{"../../lib/index":1,"gremlins":9}],3:[function(require,module,exports){
"use strict";

var pendingSearches = [];

var hasComponent = function hasComponent(element) {
  return element.__gremlinInstance__ !== undefined;
};

module.exports = {
  addGremlin: function addGremlin(id) {
    pendingSearches = pendingSearches.filter(function (search) {
      var wasSearchedFor = search.element._gid === id;
      if (wasSearchedFor) {
        search.resolve();
      }

      return !wasSearchedFor;
    });
  },
  getGremlinAsync: function getGremlinAsync(element) {
    var timeout = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return new Promise(function (_resolve) {
      if (hasComponent(element)) {
        setTimeout(function () {
          return _resolve(element.__gremlinInstance__);
        }, 10);
      } else {
        (function () {
          var gremlinNotFoundTimeout = timeout !== null ? setTimeout(function () {
            _resolve(null);
          }, timeout) : null;

          pendingSearches.push({
            element: element,
            resolve: function resolve() {
              clearTimeout(gremlinNotFoundTimeout);
              _resolve(element.__gremlinInstance__);
            }
          });
        })();
      }
    });
  }
};
},{}],4:[function(require,module,exports){
'use strict';

var Mixins = require('./Mixins');
var GremlinElement = require('./GremlinElement');

/**
 * ## `Gremlin`
 * The base prototype used for all gremlin components/specs
 *
 *
 */

function extend(obj) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    if (source) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          var descriptor = Object.getOwnPropertyDescriptor(source, prop);
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
}

/*!
 * All the Specs already added.
 *
 * Used to detect multi adds
 */
var specMap = {};

var addSpec = function addSpec(tagName, Spec) {
  return specMap[tagName] = Spec;
};
var hasSpec = function hasSpec(tagName) {
  return specMap[tagName] !== undefined;
};

var Gremlin = {
  created: function created() {},
  attached: function attached() {},
  detached: function detached() {},
  attributeDidChange: function attributeDidChange() {},
  create: function create(tagName) {
    var Spec = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var Parent = this;
    var NewSpec = Object.create(Parent, {
      name: {
        value: tagName,
        writable: true
      }
    });

    if (typeof tagName !== 'string') {
      throw new TypeError('Gremlins.create expects the gremlins tag name as a first argument');
    }
    if (hasSpec(tagName)) {
      throw new Error('Trying to add new Gremlin spec, but a spec for ' + tagName + ' already exists.');
    }
    if (Spec.create !== undefined) {
      console.warn( // eslint-disable-line no-console
      'You are replacing the original create method for the spec of ' + tagName + '. You know what ' + 'you\'re doing, right?');
    }

    // set up the prototype chain
    extend(NewSpec, Spec);
    // extend the spec with it's Mixins
    Mixins.mixinProps(NewSpec);
    // remember this name
    addSpec(tagName, NewSpec);
    // and create the custom element for it
    GremlinElement.register(tagName, NewSpec);
    return NewSpec;
  }
};

module.exports = Gremlin;
},{"./GremlinElement":5,"./Mixins":6}],5:[function(require,module,exports){
'use strict';

var Data = require('./Data');
var uuid = require('./uuid');

var canRegisterElements = typeof document.registerElement === 'function';
var gremlinId = function gremlinId() {
  return 'gremlins_' + uuid();
};

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

module.exports = {
  register: function register(tagName, Spec) {
    var proto = {
      createdCallback: {
        value: function value() {
          var id = gremlinId();
          this._gid = id;
          this.__gremlinInstance__ = Object.create(Spec, {
            _gid: {
              value: id,
              writable: false
            },
            el: {
              value: this,
              writable: false
            }
          });
          Data.addGremlin(id);
          this.__gremlinInstance__.created();
        }
      },
      attachedCallback: {
        value: function value() {
          this.__gremlinInstance__.attached();
        }
      },
      detachedCallback: {
        value: function value() {
          this.__gremlinInstance__.detached();
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          this.__gremlinInstance__.attributeDidChange(name, previousValue, _value);
        }
      }
    };

    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(tagName + ' { display: block }', 0);

    return document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto)
    });
  }
};
},{"./Data":3,"./uuid":10}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var objectAssign = require('object-assign');

function getMixins(Spec) {
  if (Array.isArray(Spec.mixins)) {
    return Spec.mixins;
  }

  return Spec.mixins ? [Spec.mixins] : [];
}

function decorateProperty(Spec, propertyName, property) {
  var gremlinProperty = Spec[propertyName];
  var moduleProperty = property;
  var gremlinPropertyType = typeof gremlinProperty === 'undefined' ? 'undefined' : _typeof(gremlinProperty);
  var modulePropertyType = typeof moduleProperty === 'undefined' ? 'undefined' : _typeof(moduleProperty);
  var isSamePropType = gremlinPropertyType === modulePropertyType;

  if (isSamePropType && modulePropertyType === 'function') {
    Spec[propertyName] = function () {
      // eslint-disable-line no-param-reassign, func-names
      // call the module first
      var moduleResult = moduleProperty.apply(this, arguments);
      var gremlinResult = gremlinProperty.apply(this, arguments);

      try {
        return objectAssign(moduleResult, gremlinResult);
      } catch (e) {
        return [moduleResult, gremlinResult];
      }
    };
  } else {
    console.warn( // eslint-disable-line no-console
    'Can\'t decorate gremlin property ' + ('<' + Spec.tagName + ' />#' + propertyName + ':' + gremlinPropertyType + '« ') + ('with »Module#' + propertyName + ':' + modulePropertyType + '«. Only functions can be decorated!'));
  }
}

function mixinModule(Spec, Module) {
  Object.keys(Module).forEach(function (propertyName) {
    var property = Module[propertyName];

    if (Spec[propertyName] === undefined) {
      var descriptor = Object.getOwnPropertyDescriptor(Module, propertyName);
      Object.defineProperty(Spec, propertyName, descriptor);
    } else {
      decorateProperty(Spec, propertyName, property);
    }
  });
}

module.exports = {
  mixinProps: function mixinProps(Spec) {
    var modules = getMixins(Spec);
    // reverse the modules array to call decorated functions in the right order
    modules.reverse().forEach(function (Module) {
      return mixinModule(Spec, Module);
    });
  }
};
},{"object-assign":12}],7:[function(require,module,exports){
(function (global){
'use strict';

/* eslint-disable no-console */
function noop() {}
var types = ['log', 'info', 'warn'];

module.exports = {
  create: function create() {
    if (console === undefined) {
      global.console = {};
    }
    types.forEach(function (type) {
      if (typeof console[type] !== 'function') {
        console[type] = noop();
      }
    });
  }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
'use strict';

/**
 * # gremlin.js
 * dead simple web components
 *
 * ## `gremlins`
 * The gremlin.js public namespace/module
 *
 */

/*!
 * Dependencies
 */
var consoleShim = require('./consoleShim');
var Gremlin = require('./Gremlin');
var Data = require('./Data');

// let's add a branding so we can't include more than one instance of gremlin.js
var BRANDING = 'gremlins_connected';

if (document.documentElement[BRANDING]) {
  throw new Error('You tried to include gremlin.js multiple times. This will not work');
}
consoleShim.create();

document.documentElement[BRANDING] = true;

module.exports = {
  /**
   * Creates a new gremlin specification.
   *
   * ### Example
   *     var gremlins = require('gremlins');
   *
   *     gremlins.create({
  *       name: 'Foo'
  *     });
   *
   * @param {Object} Spec The gremlin specification
   * @return {Object} The final spec created, later used as a prototype for new components of this
   * type
   * @method create
   * @api public
   */
  create: Gremlin.create.bind(Gremlin),
  findGremlin: function findGremlin(element, timeout) {
    return Data.getGremlinAsync(element, timeout);
  }
};
},{"./Data":3,"./Gremlin":4,"./consoleShim":7}],9:[function(require,module,exports){
'use strict';

/*!
 * The register element polyfill for older browsers
 *
 */

require('document-register-element');

module.exports = require('./gremlins');
},{"./gremlins":8,"document-register-element":11}],10:[function(require,module,exports){
"use strict";

// see https://gist.github.com/jed/982883
module.exports = function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b); // eslint-disable-line max-len
};
},{}],11:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}],12:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJ0ZXN0L3NyYy9ncmVtbGlucy1kaXNwYXRjaGVyLmpzIiwiLi4vZ3JlbWxpbnMvbGliL0RhdGEuanMiLCIuLi9ncmVtbGlucy9saWIvR3JlbWxpbi5qcyIsIi4uL2dyZW1saW5zL2xpYi9HcmVtbGluRWxlbWVudC5qcyIsIi4uL2dyZW1saW5zL2xpYi9NaXhpbnMuanMiLCIuLi9ncmVtbGlucy9saWIvY29uc29sZVNoaW0uanMiLCIuLi9ncmVtbGlucy9saWIvZ3JlbWxpbnMuanMiLCIuLi9ncmVtbGlucy9saWIvaW5kZXguanMiLCIuLi9ncmVtbGlucy9saWIvdXVpZC5qcyIsIi4uL2dyZW1saW5zL25vZGVfbW9kdWxlcy9kb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50L2J1aWxkL2RvY3VtZW50LXJlZ2lzdGVyLWVsZW1lbnQuanMiLCIuLi9ncmVtbGlucy9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhY2hlID0ge307XG5cbnZhciBFbWl0dGVyID0ge1xuICByZWdpc3RlckhhbmRsZXI6IGZ1bmN0aW9uIHJlZ2lzdGVySGFuZGxlcihoYW5kbGVyTmFtZSwgaGFuZGxlciwgY29tcG9uZW50KSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJzwnICsgY29tcG9uZW50Lm5hbWUgKyAnIC8+IOKAlCBIYW5kbGVyIGZvciB0aGUgaW50ZXJlc3QgJyArIGhhbmRsZXJOYW1lICsgJyBpcyBtaXNzaW5nIScpO1xuICAgIH1cblxuICAgIGlmIChjYWNoZVtoYW5kbGVyTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FjaGVbaGFuZGxlck5hbWVdID0gW107XG4gICAgfVxuXG4gICAgY2FjaGVbaGFuZGxlck5hbWVdLnB1c2goe1xuICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50XG4gICAgfSk7XG4gIH0sXG4gIHVucmVnaXN0ZXJIYW5kbGVyOiBmdW5jdGlvbiB1bnJlZ2lzdGVySGFuZGxlcihoYW5kbGVyTmFtZSwgY29tcG9uZW50KSB7XG4gICAgaWYgKGNhY2hlW2hhbmRsZXJOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWNoZVtoYW5kbGVyTmFtZV0gPSBjYWNoZVtoYW5kbGVyTmFtZV0uZmlsdGVyKGZ1bmN0aW9uIChjYWxsYmFja09iaikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2tPYmouY29tcG9uZW50ICE9PSBjb21wb25lbnQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaChoYW5kbGVyTmFtZSwgZGF0YSwgY29tcG9uZW50KSB7XG4gICAgaWYgKGNhY2hlW2hhbmRsZXJOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhY2hlW2hhbmRsZXJOYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFja09iaikge1xuICAgICAgICAgIGlmIChjYWxsYmFja09iai5jb21wb25lbnQgIT09IGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY2FsbGJhY2tPYmouaGFuZGxlci5jYWxsKGNhbGxiYWNrT2JqLmNvbXBvbmVudCwgZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFkZEludGVyZXN0cyhjb21wb25lbnQpIHtcbiAgdmFyIGxpc3RlbmVycyA9IHR5cGVvZiBjb21wb25lbnQuZ2V0TGlzdGVuZXJzID09PSAnZnVuY3Rpb24nID8gY29tcG9uZW50LmdldExpc3RlbmVycygpIDoge307XG5cbiAgZm9yICh2YXIgaGFuZGxlciBpbiBsaXN0ZW5lcnMpIHtcbiAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGhhbmRsZXIpKSB7XG4gICAgICBFbWl0dGVyLnJlZ2lzdGVySGFuZGxlcihoYW5kbGVyLCBjb21wb25lbnRbbGlzdGVuZXJzW2hhbmRsZXJdXSwgY29tcG9uZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdyZWdpc3RlcmluZyBpbnRlcmVzdCBcIicgKyBoYW5kbGVyICsgJ1wiIGZhaWxlZCcsIGNvbXBvbmVudCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUludGVyZXN0cyhjb21wb25lbnQpIHtcbiAgdmFyIGxpc3RlbmVycyA9IHR5cGVvZiBjb21wb25lbnQuZ2V0TGlzdGVuZXJzID09PSAnZnVuY3Rpb24nID8gY29tcG9uZW50LmdldExpc3RlbmVycygpIDoge307XG4gIGZvciAodmFyIGhhbmRsZXIgaW4gbGlzdGVuZXJzKSB7XG4gICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShoYW5kbGVyKSkge1xuICAgICAgRW1pdHRlci51bnJlZ2lzdGVySGFuZGxlcihoYW5kbGVyLCBjb21wb25lbnQpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXR0YWNoZWQ6IGZ1bmN0aW9uIGF0dGFjaGVkKCkge1xuICAgIGFkZEludGVyZXN0cyh0aGlzKTtcbiAgfSxcbiAgZGV0YWNoZWQ6IGZ1bmN0aW9uIGRldGFjaGVkKCkge1xuICAgIHJlbW92ZUludGVyZXN0cyh0aGlzKTtcbiAgfSxcbiAgZW1pdDogZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xuICAgIEVtaXR0ZXIuZGlzcGF0Y2goZXZlbnROYW1lLCBldmVudERhdGEsIHRoaXMpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdyZW1saW5zICAgPSByZXF1aXJlKCdncmVtbGlucycpLFxuICAgIGRpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvaW5kZXgnKTtcblxuZGVzY3JpYmUoJ2dyZW1saW5qcy1kaXNwYXRjaGVyJywgZnVuY3Rpb24gKCkge1xuXG4gIGl0KCdhdWdtZW50cyBncmVtbGluIGluc3RhbmNlcycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdGhpcy50aW1lb3V0KDUwMDApO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBncmVtbGlucy5jcmVhdGUoJ2ludGVyZXN0cy1ncmVtbGluJywge1xuICAgICAgbWl4aW5zOiBbZGlzcGF0Y2hlcl0sXG4gICAgICBnZXRMaXN0ZW5lcnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnRk9PJzogJ29uRm9vJ1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHRoaXMuZW1pdCkudG8uYmUuYSgnZnVuY3Rpb24nKTtcbiAgICAgICAgICBjb3VudCsrOy8vZG9uZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZG9uZShlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uRm9vKGRhdGEpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QoY291bnQpLnRvLmVxdWFsKDMpO1xuICAgICAgICAgIGV4cGVjdChkYXRhKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgICAgICAgZXhwZWN0KGRhdGEuZm9vKS50by5lcXVhbCgnZm9vJyk7XG4gICAgICAgICAgc2V0VGltZW91dChkb25lLCA1MDApO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZG9uZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ3JlbWxpbnMuY3JlYXRlKCdpbnRlcmVzdHMyLWdyZW1saW4nLCB7XG4gICAgICBtaXhpbnM6IFtkaXNwYXRjaGVyXSxcbiAgICAgIGdldExpc3RlbmVycygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdGT08nOiAnb25Gb28nXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgYXR0YWNoZWQoKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpPT50aGlzLmVtaXQoJ0ZPTycsIHtmb286ICdmb28nfSksIDUwMCk7XG4gICAgICB9LFxuICAgICAgb25Gb28oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGRpc3BhdGNoaW5nIGNvbXBvbmVudHMgY2FsbGJhY2sgc2hvdWxkIG5vdCBiZSBjYWxsZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGdyZW1saW5zLmNyZWF0ZSgnaW50ZXJlc3RzMy1ncmVtbGluJywge1xuICAgICAgbWl4aW5zOiBbZGlzcGF0Y2hlcl0sXG4gICAgICBnZXRMaXN0ZW5lcnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnRk9PJzogJ29uRm9vJ1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWQoKSB7XG5cbiAgICAgIH0sXG4gICAgICBvbkZvbygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnRzIG91dHNpZGUgdGhlIGRvbSBzaG91bGQgbm90IGJlIGNhbGxlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGVsICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0cy1ncmVtbGluJyk7XG4gICAgdmFyIGVsMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0czItZ3JlbWxpbicpO1xuICAgIHZhciBlbDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnRlcmVzdHMtZ3JlbWxpbicpO1xuICAgIHZhciBlbDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnRlcmVzdHMzLWdyZW1saW4nKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWw0KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsNCk7XG4gICAgICBlbDQgPSBudWxsO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbDIpO1xuICAgICAgICBlbDIgPSBudWxsO1xuICAgICAgICBlbDQgPSBudWxsO1xuICAgICAgICBlbCA9IG51bGw7XG4gICAgICB9LCA1MDApO1xuICAgIH0sIDUwMCk7XG5cblxuICB9KTtcblxuXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcGVuZGluZ1NlYXJjaGVzID0gW107XG5cbnZhciBoYXNDb21wb25lbnQgPSBmdW5jdGlvbiBoYXNDb21wb25lbnQoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5fX2dyZW1saW5JbnN0YW5jZV9fICE9PSB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkR3JlbWxpbjogZnVuY3Rpb24gYWRkR3JlbWxpbihpZCkge1xuICAgIHBlbmRpbmdTZWFyY2hlcyA9IHBlbmRpbmdTZWFyY2hlcy5maWx0ZXIoZnVuY3Rpb24gKHNlYXJjaCkge1xuICAgICAgdmFyIHdhc1NlYXJjaGVkRm9yID0gc2VhcmNoLmVsZW1lbnQuX2dpZCA9PT0gaWQ7XG4gICAgICBpZiAod2FzU2VhcmNoZWRGb3IpIHtcbiAgICAgICAgc2VhcmNoLnJlc29sdmUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICF3YXNTZWFyY2hlZEZvcjtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0R3JlbWxpbkFzeW5jOiBmdW5jdGlvbiBnZXRHcmVtbGluQXN5bmMoZWxlbWVudCkge1xuICAgIHZhciB0aW1lb3V0ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoX3Jlc29sdmUpIHtcbiAgICAgIGlmIChoYXNDb21wb25lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZXNvbHZlKGVsZW1lbnQuX19ncmVtbGluSW5zdGFuY2VfXyk7XG4gICAgICAgIH0sIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGdyZW1saW5Ob3RGb3VuZFRpbWVvdXQgPSB0aW1lb3V0ICE9PSBudWxsID8gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICB9LCB0aW1lb3V0KSA6IG51bGw7XG5cbiAgICAgICAgICBwZW5kaW5nU2VhcmNoZXMucHVzaCh7XG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSgpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGdyZW1saW5Ob3RGb3VuZFRpbWVvdXQpO1xuICAgICAgICAgICAgICBfcmVzb2x2ZShlbGVtZW50Ll9fZ3JlbWxpbkluc3RhbmNlX18pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1peGlucyA9IHJlcXVpcmUoJy4vTWl4aW5zJyk7XG52YXIgR3JlbWxpbkVsZW1lbnQgPSByZXF1aXJlKCcuL0dyZW1saW5FbGVtZW50Jyk7XG5cbi8qKlxuICogIyMgYEdyZW1saW5gXG4gKiBUaGUgYmFzZSBwcm90b3R5cGUgdXNlZCBmb3IgYWxsIGdyZW1saW4gY29tcG9uZW50cy9zcGVjc1xuICpcbiAqXG4gKi9cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc291cmNlcyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBzb3VyY2VzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3ApO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyohXG4gKiBBbGwgdGhlIFNwZWNzIGFscmVhZHkgYWRkZWQuXG4gKlxuICogVXNlZCB0byBkZXRlY3QgbXVsdGkgYWRkc1xuICovXG52YXIgc3BlY01hcCA9IHt9O1xuXG52YXIgYWRkU3BlYyA9IGZ1bmN0aW9uIGFkZFNwZWModGFnTmFtZSwgU3BlYykge1xuICByZXR1cm4gc3BlY01hcFt0YWdOYW1lXSA9IFNwZWM7XG59O1xudmFyIGhhc1NwZWMgPSBmdW5jdGlvbiBoYXNTcGVjKHRhZ05hbWUpIHtcbiAgcmV0dXJuIHNwZWNNYXBbdGFnTmFtZV0gIT09IHVuZGVmaW5lZDtcbn07XG5cbnZhciBHcmVtbGluID0ge1xuICBjcmVhdGVkOiBmdW5jdGlvbiBjcmVhdGVkKCkge30sXG4gIGF0dGFjaGVkOiBmdW5jdGlvbiBhdHRhY2hlZCgpIHt9LFxuICBkZXRhY2hlZDogZnVuY3Rpb24gZGV0YWNoZWQoKSB7fSxcbiAgYXR0cmlidXRlRGlkQ2hhbmdlOiBmdW5jdGlvbiBhdHRyaWJ1dGVEaWRDaGFuZ2UoKSB7fSxcbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUodGFnTmFtZSkge1xuICAgIHZhciBTcGVjID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIgUGFyZW50ID0gdGhpcztcbiAgICB2YXIgTmV3U3BlYyA9IE9iamVjdC5jcmVhdGUoUGFyZW50LCB7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHZhbHVlOiB0YWdOYW1lLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiB0YWdOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignR3JlbWxpbnMuY3JlYXRlIGV4cGVjdHMgdGhlIGdyZW1saW5zIHRhZyBuYW1lIGFzIGEgZmlyc3QgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGhhc1NwZWModGFnTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGFkZCBuZXcgR3JlbWxpbiBzcGVjLCBidXQgYSBzcGVjIGZvciAnICsgdGFnTmFtZSArICcgYWxyZWFkeSBleGlzdHMuJyk7XG4gICAgfVxuICAgIGlmIChTcGVjLmNyZWF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgJ1lvdSBhcmUgcmVwbGFjaW5nIHRoZSBvcmlnaW5hbCBjcmVhdGUgbWV0aG9kIGZvciB0aGUgc3BlYyBvZiAnICsgdGFnTmFtZSArICcuIFlvdSBrbm93IHdoYXQgJyArICd5b3VcXCdyZSBkb2luZywgcmlnaHQ/Jyk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW5cbiAgICBleHRlbmQoTmV3U3BlYywgU3BlYyk7XG4gICAgLy8gZXh0ZW5kIHRoZSBzcGVjIHdpdGggaXQncyBNaXhpbnNcbiAgICBNaXhpbnMubWl4aW5Qcm9wcyhOZXdTcGVjKTtcbiAgICAvLyByZW1lbWJlciB0aGlzIG5hbWVcbiAgICBhZGRTcGVjKHRhZ05hbWUsIE5ld1NwZWMpO1xuICAgIC8vIGFuZCBjcmVhdGUgdGhlIGN1c3RvbSBlbGVtZW50IGZvciBpdFxuICAgIEdyZW1saW5FbGVtZW50LnJlZ2lzdGVyKHRhZ05hbWUsIE5ld1NwZWMpO1xuICAgIHJldHVybiBOZXdTcGVjO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyZW1saW47IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGF0YSA9IHJlcXVpcmUoJy4vRGF0YScpO1xudmFyIHV1aWQgPSByZXF1aXJlKCcuL3V1aWQnKTtcblxudmFyIGNhblJlZ2lzdGVyRWxlbWVudHMgPSB0eXBlb2YgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50ID09PSAnZnVuY3Rpb24nO1xudmFyIGdyZW1saW5JZCA9IGZ1bmN0aW9uIGdyZW1saW5JZCgpIHtcbiAgcmV0dXJuICdncmVtbGluc18nICsgdXVpZCgpO1xufTtcblxuaWYgKCFjYW5SZWdpc3RlckVsZW1lbnRzKSB7XG4gIHRocm93IG5ldyBFcnJvcigncmVnaXN0ZXJFbGVtZW50IG5vdCBhdmFpbGFibGUuIERpZCB5b3UgaW5jbHVkZSB0aGUgcG9seWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzPycpO1xufVxuXG52YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbnZhciBzdHlsZVNoZWV0ID0gdW5kZWZpbmVkO1xuXG5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5zdHlsZVNoZWV0ID0gc3R5bGVFbGVtZW50LnNoZWV0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyKHRhZ05hbWUsIFNwZWMpIHtcbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBjcmVhdGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgIHZhciBpZCA9IGdyZW1saW5JZCgpO1xuICAgICAgICAgIHRoaXMuX2dpZCA9IGlkO1xuICAgICAgICAgIHRoaXMuX19ncmVtbGluSW5zdGFuY2VfXyA9IE9iamVjdC5jcmVhdGUoU3BlYywge1xuICAgICAgICAgICAgX2dpZDoge1xuICAgICAgICAgICAgICB2YWx1ZTogaWQsXG4gICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVsOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLFxuICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBEYXRhLmFkZEdyZW1saW4oaWQpO1xuICAgICAgICAgIHRoaXMuX19ncmVtbGluSW5zdGFuY2VfXy5jcmVhdGVkKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhdHRhY2hlZENhbGxiYWNrOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgICB0aGlzLl9fZ3JlbWxpbkluc3RhbmNlX18uYXR0YWNoZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRldGFjaGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgIHRoaXMuX19ncmVtbGluSW5zdGFuY2VfXy5kZXRhY2hlZCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuYW1lLCBwcmV2aW91c1ZhbHVlLCBfdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLl9fZ3JlbWxpbkluc3RhbmNlX18uYXR0cmlidXRlRGlkQ2hhbmdlKG5hbWUsIHByZXZpb3VzVmFsdWUsIF92YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaW5zZXJ0IHRoZSBydWxlIEJFRk9SRSByZWdpc3RlcmluZyB0aGUgZWxlbWVudC4gVGhpcyBpcyBpbXBvcnRhbnQgYmVjYXVzZSB0aGV5IG1heSBiZSBpbmxpbmVcbiAgICAvLyBvdGhlcndpc2Ugd2hlbiBmaXJzdCBpbml0aWFsaXplZC5cbiAgICBzdHlsZVNoZWV0Lmluc2VydFJ1bGUodGFnTmFtZSArICcgeyBkaXNwbGF5OiBibG9jayB9JywgMCk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIHtcbiAgICAgIG5hbWU6IHRhZ05hbWUsXG4gICAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCBwcm90bylcbiAgICB9KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5mdW5jdGlvbiBnZXRNaXhpbnMoU3BlYykge1xuICBpZiAoQXJyYXkuaXNBcnJheShTcGVjLm1peGlucykpIHtcbiAgICByZXR1cm4gU3BlYy5taXhpbnM7XG4gIH1cblxuICByZXR1cm4gU3BlYy5taXhpbnMgPyBbU3BlYy5taXhpbnNdIDogW107XG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlUHJvcGVydHkoU3BlYywgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eSkge1xuICB2YXIgZ3JlbWxpblByb3BlcnR5ID0gU3BlY1twcm9wZXJ0eU5hbWVdO1xuICB2YXIgbW9kdWxlUHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgdmFyIGdyZW1saW5Qcm9wZXJ0eVR5cGUgPSB0eXBlb2YgZ3JlbWxpblByb3BlcnR5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihncmVtbGluUHJvcGVydHkpO1xuICB2YXIgbW9kdWxlUHJvcGVydHlUeXBlID0gdHlwZW9mIG1vZHVsZVByb3BlcnR5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihtb2R1bGVQcm9wZXJ0eSk7XG4gIHZhciBpc1NhbWVQcm9wVHlwZSA9IGdyZW1saW5Qcm9wZXJ0eVR5cGUgPT09IG1vZHVsZVByb3BlcnR5VHlwZTtcblxuICBpZiAoaXNTYW1lUHJvcFR5cGUgJiYgbW9kdWxlUHJvcGVydHlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgU3BlY1twcm9wZXJ0eU5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnbiwgZnVuYy1uYW1lc1xuICAgICAgLy8gY2FsbCB0aGUgbW9kdWxlIGZpcnN0XG4gICAgICB2YXIgbW9kdWxlUmVzdWx0ID0gbW9kdWxlUHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHZhciBncmVtbGluUmVzdWx0ID0gZ3JlbWxpblByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvYmplY3RBc3NpZ24obW9kdWxlUmVzdWx0LCBncmVtbGluUmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFttb2R1bGVSZXN1bHQsIGdyZW1saW5SZXN1bHRdO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAnQ2FuXFwndCBkZWNvcmF0ZSBncmVtbGluIHByb3BlcnR5ICcgKyAoJzwnICsgU3BlYy50YWdOYW1lICsgJyAvPiMnICsgcHJvcGVydHlOYW1lICsgJzonICsgZ3JlbWxpblByb3BlcnR5VHlwZSArICfCqyAnKSArICgnd2l0aCDCu01vZHVsZSMnICsgcHJvcGVydHlOYW1lICsgJzonICsgbW9kdWxlUHJvcGVydHlUeXBlICsgJ8KrLiBPbmx5IGZ1bmN0aW9ucyBjYW4gYmUgZGVjb3JhdGVkIScpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtaXhpbk1vZHVsZShTcGVjLCBNb2R1bGUpIHtcbiAgT2JqZWN0LmtleXMoTW9kdWxlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICB2YXIgcHJvcGVydHkgPSBNb2R1bGVbcHJvcGVydHlOYW1lXTtcblxuICAgIGlmIChTcGVjW3Byb3BlcnR5TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgcHJvcGVydHlOYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTcGVjLCBwcm9wZXJ0eU5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWNvcmF0ZVByb3BlcnR5KFNwZWMsIHByb3BlcnR5TmFtZSwgcHJvcGVydHkpO1xuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtaXhpblByb3BzOiBmdW5jdGlvbiBtaXhpblByb3BzKFNwZWMpIHtcbiAgICB2YXIgbW9kdWxlcyA9IGdldE1peGlucyhTcGVjKTtcbiAgICAvLyByZXZlcnNlIHRoZSBtb2R1bGVzIGFycmF5IHRvIGNhbGwgZGVjb3JhdGVkIGZ1bmN0aW9ucyBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgICBtb2R1bGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uIChNb2R1bGUpIHtcbiAgICAgIHJldHVybiBtaXhpbk1vZHVsZShTcGVjLCBNb2R1bGUpO1xuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuZnVuY3Rpb24gbm9vcCgpIHt9XG52YXIgdHlwZXMgPSBbJ2xvZycsICdpbmZvJywgJ3dhcm4nXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKCkge1xuICAgIGlmIChjb25zb2xlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGdsb2JhbC5jb25zb2xlID0ge307XG4gICAgfVxuICAgIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZVt0eXBlXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zb2xlW3R5cGVdID0gbm9vcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiAjIGdyZW1saW4uanNcbiAqIGRlYWQgc2ltcGxlIHdlYiBjb21wb25lbnRzXG4gKlxuICogIyMgYGdyZW1saW5zYFxuICogVGhlIGdyZW1saW4uanMgcHVibGljIG5hbWVzcGFjZS9tb2R1bGVcbiAqXG4gKi9cblxuLyohXG4gKiBEZXBlbmRlbmNpZXNcbiAqL1xudmFyIGNvbnNvbGVTaGltID0gcmVxdWlyZSgnLi9jb25zb2xlU2hpbScpO1xudmFyIEdyZW1saW4gPSByZXF1aXJlKCcuL0dyZW1saW4nKTtcbnZhciBEYXRhID0gcmVxdWlyZSgnLi9EYXRhJyk7XG5cbi8vIGxldCdzIGFkZCBhIGJyYW5kaW5nIHNvIHdlIGNhbid0IGluY2x1ZGUgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZSBvZiBncmVtbGluLmpzXG52YXIgQlJBTkRJTkcgPSAnZ3JlbWxpbnNfY29ubmVjdGVkJztcblxuaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtCUkFORElOR10pIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdZb3UgdHJpZWQgdG8gaW5jbHVkZSBncmVtbGluLmpzIG11bHRpcGxlIHRpbWVzLiBUaGlzIHdpbGwgbm90IHdvcmsnKTtcbn1cbmNvbnNvbGVTaGltLmNyZWF0ZSgpO1xuXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbQlJBTkRJTkddID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGdyZW1saW4gc3BlY2lmaWNhdGlvbi5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICogICAgIHZhciBncmVtbGlucyA9IHJlcXVpcmUoJ2dyZW1saW5zJyk7XG4gICAqXG4gICAqICAgICBncmVtbGlucy5jcmVhdGUoe1xuICAqICAgICAgIG5hbWU6ICdGb28nXG4gICogICAgIH0pO1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gU3BlYyBUaGUgZ3JlbWxpbiBzcGVjaWZpY2F0aW9uXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZpbmFsIHNwZWMgY3JlYXRlZCwgbGF0ZXIgdXNlZCBhcyBhIHByb3RvdHlwZSBmb3IgbmV3IGNvbXBvbmVudHMgb2YgdGhpc1xuICAgKiB0eXBlXG4gICAqIEBtZXRob2QgY3JlYXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBjcmVhdGU6IEdyZW1saW4uY3JlYXRlLmJpbmQoR3JlbWxpbiksXG4gIGZpbmRHcmVtbGluOiBmdW5jdGlvbiBmaW5kR3JlbWxpbihlbGVtZW50LCB0aW1lb3V0KSB7XG4gICAgcmV0dXJuIERhdGEuZ2V0R3JlbWxpbkFzeW5jKGVsZW1lbnQsIHRpbWVvdXQpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyohXG4gKiBUaGUgcmVnaXN0ZXIgZWxlbWVudCBwb2x5ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqXG4gKi9cblxucmVxdWlyZSgnZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZ3JlbWxpbnMnKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gc2VlIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2plZC85ODI4ODNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYihhKSB7XG4gIHJldHVybiBhID8gKGEgXiBNYXRoLnJhbmRvbSgpICogMTYgPj4gYSAvIDQpLnRvU3RyaW5nKDE2KSA6IChbMWU3XSArIC0xZTMgKyAtNGUzICsgLThlMyArIC0xZTExKS5yZXBsYWNlKC9bMDE4XS9nLCBiKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG59OyIsIi8qISAoQykgV2ViUmVmbGVjdGlvbiBNaXQgU3R5bGUgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGUsdCxuLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHJ0KGUsdCl7Zm9yKHZhciBuPTAscj1lLmxlbmd0aDtuPHI7bisrKXZ0KGVbbl0sdCl9ZnVuY3Rpb24gaXQoZSl7Zm9yKHZhciB0PTAsbj1lLmxlbmd0aCxyO3Q8bjt0Kyspcj1lW3RdLG50KHIsYltvdChyKV0pfWZ1bmN0aW9uIHN0KGUpe3JldHVybiBmdW5jdGlvbih0KXtqKHQpJiYodnQodCxlKSxydCh0LnF1ZXJ5U2VsZWN0b3JBbGwodyksZSkpfX1mdW5jdGlvbiBvdChlKXt2YXIgdD1lLmdldEF0dHJpYnV0ZShcImlzXCIpLG49ZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpLHI9Uy5jYWxsKHksdD92K3QudG9VcHBlckNhc2UoKTpkK24pO3JldHVybiB0JiYtMTxyJiYhdXQobix0KT8tMTpyfWZ1bmN0aW9uIHV0KGUsdCl7cmV0dXJuLTE8dy5pbmRleE9mKGUrJ1tpcz1cIicrdCsnXCJdJyl9ZnVuY3Rpb24gYXQoZSl7dmFyIHQ9ZS5jdXJyZW50VGFyZ2V0LG49ZS5hdHRyQ2hhbmdlLHI9ZS5hdHRyTmFtZSxpPWUudGFyZ2V0O1EmJighaXx8aT09PXQpJiZ0LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmciE9PVwic3R5bGVcIiYmZS5wcmV2VmFsdWUhPT1lLm5ld1ZhbHVlJiZ0LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhyLG49PT1lW2FdP251bGw6ZS5wcmV2VmFsdWUsbj09PWVbbF0/bnVsbDplLm5ld1ZhbHVlKX1mdW5jdGlvbiBmdChlKXt2YXIgdD1zdChlKTtyZXR1cm4gZnVuY3Rpb24oZSl7WC5wdXNoKHQsZS50YXJnZXQpfX1mdW5jdGlvbiBsdChlKXtLJiYoSz0hMSxlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihoLGx0KSkscnQoKGUudGFyZ2V0fHx0KS5xdWVyeVNlbGVjdG9yQWxsKHcpLGUuZGV0YWlsPT09bz9vOnMpLEImJnB0KCl9ZnVuY3Rpb24gY3QoZSx0KXt2YXIgbj10aGlzO3EuY2FsbChuLGUsdCksRy5jYWxsKG4se3RhcmdldDpufSl9ZnVuY3Rpb24gaHQoZSx0KXtEKGUsdCksZXQ/ZXQub2JzZXJ2ZShlLHopOihKJiYoZS5zZXRBdHRyaWJ1dGU9Y3QsZVtpXT1aKGUpLGUuYWRkRXZlbnRMaXN0ZW5lcihwLEcpKSxlLmFkZEV2ZW50TGlzdGVuZXIoYyxhdCkpLGUuY3JlYXRlZENhbGxiYWNrJiZRJiYoZS5jcmVhdGVkPSEwLGUuY3JlYXRlZENhbGxiYWNrKCksZS5jcmVhdGVkPSExKX1mdW5jdGlvbiBwdCgpe2Zvcih2YXIgZSx0PTAsbj1GLmxlbmd0aDt0PG47dCsrKWU9Rlt0XSxFLmNvbnRhaW5zKGUpfHwobi0tLEYuc3BsaWNlKHQtLSwxKSx2dChlLG8pKX1mdW5jdGlvbiBkdChlKXt0aHJvdyBuZXcgRXJyb3IoXCJBIFwiK2UrXCIgdHlwZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRcIil9ZnVuY3Rpb24gdnQoZSx0KXt2YXIgbixyPW90KGUpOy0xPHImJih0dChlLGJbcl0pLHI9MCx0PT09cyYmIWVbc10/KGVbb109ITEsZVtzXT0hMCxyPTEsQiYmUy5jYWxsKEYsZSk8MCYmRi5wdXNoKGUpKTp0PT09byYmIWVbb10mJihlW3NdPSExLGVbb109ITAscj0xKSxyJiYobj1lW3QrXCJDYWxsYmFja1wiXSkmJm4uY2FsbChlKSl9aWYociBpbiB0KXJldHVybjt2YXIgaT1cIl9fXCIrcisoTWF0aC5yYW5kb20oKSoxZTU+PjApLHM9XCJhdHRhY2hlZFwiLG89XCJkZXRhY2hlZFwiLHU9XCJleHRlbmRzXCIsYT1cIkFERElUSU9OXCIsZj1cIk1PRElGSUNBVElPTlwiLGw9XCJSRU1PVkFMXCIsYz1cIkRPTUF0dHJNb2RpZmllZFwiLGg9XCJET01Db250ZW50TG9hZGVkXCIscD1cIkRPTVN1YnRyZWVNb2RpZmllZFwiLGQ9XCI8XCIsdj1cIj1cIixtPS9eW0EtWl1bQS1aMC05XSooPzotW0EtWjAtOV0rKSskLyxnPVtcIkFOTk9UQVRJT04tWE1MXCIsXCJDT0xPUi1QUk9GSUxFXCIsXCJGT05ULUZBQ0VcIixcIkZPTlQtRkFDRS1TUkNcIixcIkZPTlQtRkFDRS1VUklcIixcIkZPTlQtRkFDRS1GT1JNQVRcIixcIkZPTlQtRkFDRS1OQU1FXCIsXCJNSVNTSU5HLUdMWVBIXCJdLHk9W10sYj1bXSx3PVwiXCIsRT10LmRvY3VtZW50RWxlbWVudCxTPXkuaW5kZXhPZnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PXRoaXMubGVuZ3RoO3QtLSYmdGhpc1t0XSE9PWU7KTtyZXR1cm4gdH0seD1uLnByb3RvdHlwZSxUPXguaGFzT3duUHJvcGVydHksTj14LmlzUHJvdG90eXBlT2YsQz1uLmRlZmluZVByb3BlcnR5LGs9bi5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsTD1uLmdldE93blByb3BlcnR5TmFtZXMsQT1uLmdldFByb3RvdHlwZU9mLE89bi5zZXRQcm90b3R5cGVPZixNPSEhbi5fX3Byb3RvX18sXz1uLmNyZWF0ZXx8ZnVuY3Rpb24gbXQoZSl7cmV0dXJuIGU/KG10LnByb3RvdHlwZT1lLG5ldyBtdCk6dGhpc30sRD1PfHwoTT9mdW5jdGlvbihlLHQpe3JldHVybiBlLl9fcHJvdG9fXz10LGV9OkwmJms/ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7Zm9yKHZhciBuLHI9TCh0KSxpPTAscz1yLmxlbmd0aDtpPHM7aSsrKW49cltpXSxULmNhbGwoZSxuKXx8QyhlLG4sayh0LG4pKX1yZXR1cm4gZnVuY3Rpb24odCxuKXtkbyBlKHQsbik7d2hpbGUoKG49QShuKSkmJiFOLmNhbGwobix0KSk7cmV0dXJuIHR9fSgpOmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuIGluIHQpZVtuXT10W25dO3JldHVybiBlfSksUD1lLk11dGF0aW9uT2JzZXJ2ZXJ8fGUuV2ViS2l0TXV0YXRpb25PYnNlcnZlcixIPShlLkhUTUxFbGVtZW50fHxlLkVsZW1lbnR8fGUuTm9kZSkucHJvdG90eXBlLEI9IU4uY2FsbChILEUpLGo9Qj9mdW5jdGlvbihlKXtyZXR1cm4gZS5ub2RlVHlwZT09PTF9OmZ1bmN0aW9uKGUpe3JldHVybiBOLmNhbGwoSCxlKX0sRj1CJiZbXSxJPUguY2xvbmVOb2RlLHE9SC5zZXRBdHRyaWJ1dGUsUj1ILnJlbW92ZUF0dHJpYnV0ZSxVPXQuY3JlYXRlRWxlbWVudCx6PVAmJnthdHRyaWJ1dGVzOiEwLGNoYXJhY3RlckRhdGE6ITAsYXR0cmlidXRlT2xkVmFsdWU6ITB9LFc9UHx8ZnVuY3Rpb24oZSl7Sj0hMSxFLnJlbW92ZUV2ZW50TGlzdGVuZXIoYyxXKX0sWCxWPWUucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGZ1bmN0aW9uKGUpe3NldFRpbWVvdXQoZSwxMCl9LCQ9ITEsSj0hMCxLPSEwLFE9ITAsRyxZLFosZXQsdHQsbnQ7T3x8TT8odHQ9ZnVuY3Rpb24oZSx0KXtOLmNhbGwodCxlKXx8aHQoZSx0KX0sbnQ9aHQpOih0dD1mdW5jdGlvbihlLHQpe2VbaV18fChlW2ldPW4oITApLGh0KGUsdCkpfSxudD10dCksQj8oSj0hMSxmdW5jdGlvbigpe3ZhciBlPWsoSCxcImFkZEV2ZW50TGlzdGVuZXJcIiksdD1lLnZhbHVlLG49ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KTt0LmF0dHJOYW1lPWUsdC5wcmV2VmFsdWU9dGhpcy5nZXRBdHRyaWJ1dGUoZSksdC5uZXdWYWx1ZT1udWxsLHRbbF09dC5hdHRyQ2hhbmdlPTIsUi5jYWxsKHRoaXMsZSksdGhpcy5kaXNwYXRjaEV2ZW50KHQpfSxyPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5oYXNBdHRyaWJ1dGUoZSkscj1uJiZ0aGlzLmdldEF0dHJpYnV0ZShlKSxpPW5ldyBDdXN0b21FdmVudChjLHtidWJibGVzOiEwfSk7cS5jYWxsKHRoaXMsZSx0KSxpLmF0dHJOYW1lPWUsaS5wcmV2VmFsdWU9bj9yOm51bGwsaS5uZXdWYWx1ZT10LG4/aVtmXT1pLmF0dHJDaGFuZ2U9MTppW2FdPWkuYXR0ckNoYW5nZT0wLHRoaXMuZGlzcGF0Y2hFdmVudChpKX0scz1mdW5jdGlvbihlKXt2YXIgdD1lLmN1cnJlbnRUYXJnZXQsbj10W2ldLHI9ZS5wcm9wZXJ0eU5hbWUscztuLmhhc093blByb3BlcnR5KHIpJiYobj1uW3JdLHM9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KSxzLmF0dHJOYW1lPW4ubmFtZSxzLnByZXZWYWx1ZT1uLnZhbHVlfHxudWxsLHMubmV3VmFsdWU9bi52YWx1ZT10W3JdfHxudWxsLHMucHJldlZhbHVlPT1udWxsP3NbYV09cy5hdHRyQ2hhbmdlPTA6c1tmXT1zLmF0dHJDaGFuZ2U9MSx0LmRpc3BhdGNoRXZlbnQocykpfTtlLnZhbHVlPWZ1bmN0aW9uKGUsbyx1KXtlPT09YyYmdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJnRoaXMuc2V0QXR0cmlidXRlIT09ciYmKHRoaXNbaV09e2NsYXNzTmFtZTp7bmFtZTpcImNsYXNzXCIsdmFsdWU6dGhpcy5jbGFzc05hbWV9fSx0aGlzLnNldEF0dHJpYnV0ZT1yLHRoaXMucmVtb3ZlQXR0cmlidXRlPW4sdC5jYWxsKHRoaXMsXCJwcm9wZXJ0eWNoYW5nZVwiLHMpKSx0LmNhbGwodGhpcyxlLG8sdSl9LEMoSCxcImFkZEV2ZW50TGlzdGVuZXJcIixlKX0oKSk6UHx8KEUuYWRkRXZlbnRMaXN0ZW5lcihjLFcpLEUuc2V0QXR0cmlidXRlKGksMSksRS5yZW1vdmVBdHRyaWJ1dGUoaSksSiYmKEc9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxuLHIscztpZih0PT09ZS50YXJnZXQpe249dFtpXSx0W2ldPXI9Wih0KTtmb3IocyBpbiByKXtpZighKHMgaW4gbikpcmV0dXJuIFkoMCx0LHMsbltzXSxyW3NdLGEpO2lmKHJbc10hPT1uW3NdKXJldHVybiBZKDEsdCxzLG5bc10scltzXSxmKX1mb3IocyBpbiBuKWlmKCEocyBpbiByKSlyZXR1cm4gWSgyLHQscyxuW3NdLHJbc10sbCl9fSxZPWZ1bmN0aW9uKGUsdCxuLHIsaSxzKXt2YXIgbz17YXR0ckNoYW5nZTplLGN1cnJlbnRUYXJnZXQ6dCxhdHRyTmFtZTpuLHByZXZWYWx1ZTpyLG5ld1ZhbHVlOml9O29bc109ZSxhdChvKX0sWj1mdW5jdGlvbihlKXtmb3IodmFyIHQsbixyPXt9LGk9ZS5hdHRyaWJ1dGVzLHM9MCxvPWkubGVuZ3RoO3M8bztzKyspdD1pW3NdLG49dC5uYW1lLG4hPT1cInNldEF0dHJpYnV0ZVwiJiYocltuXT10LnZhbHVlKTtyZXR1cm4gcn0pKSx0W3JdPWZ1bmN0aW9uKG4scil7Yz1uLnRvVXBwZXJDYXNlKCksJHx8KCQ9ITAsUD8oZXQ9ZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCl7Zm9yKHZhciBuPTAscj1lLmxlbmd0aDtuPHI7dChlW24rK10pKTt9cmV0dXJuIG5ldyBQKGZ1bmN0aW9uKHIpe2Zvcih2YXIgaSxzLG8sdT0wLGE9ci5sZW5ndGg7dTxhO3UrKylpPXJbdV0saS50eXBlPT09XCJjaGlsZExpc3RcIj8obihpLmFkZGVkTm9kZXMsZSksbihpLnJlbW92ZWROb2Rlcyx0KSk6KHM9aS50YXJnZXQsUSYmcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJmkuYXR0cmlidXRlTmFtZSE9PVwic3R5bGVcIiYmKG89cy5nZXRBdHRyaWJ1dGUoaS5hdHRyaWJ1dGVOYW1lKSxvIT09aS5vbGRWYWx1ZSYmcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soaS5hdHRyaWJ1dGVOYW1lLGkub2xkVmFsdWUsbykpKX0pfShzdChzKSxzdChvKSksZXQub2JzZXJ2ZSh0LHtjaGlsZExpc3Q6ITAsc3VidHJlZTohMH0pKTooWD1bXSxWKGZ1bmN0aW9uIEUoKXt3aGlsZShYLmxlbmd0aClYLnNoaWZ0KCkuY2FsbChudWxsLFguc2hpZnQoKSk7VihFKX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVJbnNlcnRlZFwiLGZ0KHMpKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLGZ0KG8pKSksdC5hZGRFdmVudExpc3RlbmVyKGgsbHQpLHQuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIixsdCksdC5jcmVhdGVFbGVtZW50PWZ1bmN0aW9uKGUsbil7dmFyIHI9VS5hcHBseSh0LGFyZ3VtZW50cyksaT1cIlwiK2Uscz1TLmNhbGwoeSwobj92OmQpKyhufHxpKS50b1VwcGVyQ2FzZSgpKSxvPS0xPHM7cmV0dXJuIG4mJihyLnNldEF0dHJpYnV0ZShcImlzXCIsbj1uLnRvTG93ZXJDYXNlKCkpLG8mJihvPXV0KGkudG9VcHBlckNhc2UoKSxuKSkpLFE9IXQuY3JlYXRlRWxlbWVudC5pbm5lckhUTUxIZWxwZXIsbyYmbnQocixiW3NdKSxyfSxILmNsb25lTm9kZT1mdW5jdGlvbihlKXt2YXIgdD1JLmNhbGwodGhpcywhIWUpLG49b3QodCk7cmV0dXJuLTE8biYmbnQodCxiW25dKSxlJiZpdCh0LnF1ZXJ5U2VsZWN0b3JBbGwodykpLHR9KSwtMjxTLmNhbGwoeSx2K2MpK1MuY2FsbCh5LGQrYykmJmR0KG4pO2lmKCFtLnRlc3QoYyl8fC0xPFMuY2FsbChnLGMpKXRocm93IG5ldyBFcnJvcihcIlRoZSB0eXBlIFwiK24rXCIgaXMgaW52YWxpZFwiKTt2YXIgaT1mdW5jdGlvbigpe3JldHVybiBmP3QuY3JlYXRlRWxlbWVudChsLGMpOnQuY3JlYXRlRWxlbWVudChsKX0sYT1yfHx4LGY9VC5jYWxsKGEsdSksbD1mP3JbdV0udG9VcHBlckNhc2UoKTpjLGMscDtyZXR1cm4gZiYmLTE8Uy5jYWxsKHksZCtsKSYmZHQobCkscD15LnB1c2goKGY/djpkKStjKS0xLHc9dy5jb25jYXQody5sZW5ndGg/XCIsXCI6XCJcIixmP2wrJ1tpcz1cIicrbi50b0xvd2VyQ2FzZSgpKydcIl0nOmwpLGkucHJvdG90eXBlPWJbcF09VC5jYWxsKGEsXCJwcm90b3R5cGVcIik/YS5wcm90b3R5cGU6XyhIKSxydCh0LnF1ZXJ5U2VsZWN0b3JBbGwodykscyksaX19KSh3aW5kb3csZG9jdW1lbnQsT2JqZWN0LFwicmVnaXN0ZXJFbGVtZW50XCIpOyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4ndXNlIHN0cmljdCc7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iXX0=
