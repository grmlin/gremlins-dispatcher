(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cache = {};

var Emitter = {
  registerHandler: function registerHandler(handlerName, handler, component) {
    if (typeof handler !== 'function') {
      throw new Error('<' + component.name + ' /> — Handler for the interest ' + handlerName + ' is missing!');
    }
    cache[handlerName] = cache[handlerName] || [];
    cache[handlerName].push({
      handler: handler,
      component: component
    });
  },
  unregisterHandler: function unregisterHandler(handlerName, handler, component) {
    cache[handlerName] = cache[handlerName] || [];
    if (cache[handlerName] !== undefined) {
      cache[handlerName] = cache[handlerName].filter(function (callbackObj) {
        var currentHandler = callbackObj.handler;
        var currentComponent = callbackObj.component;

        return currentHandler !== handler && currentComponent !== component;
      });
    }
  },
  dispatch: function dispatch(handlerName, data, component) {
    console.log('dispatching', handlerName);
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
    }
  }
}

function removeInterests(component) {
  var listeners = typeof component.getListeners === 'function' ? component.getListeners() : {};
  for (var handler in listeners) {
    if (listeners.hasOwnProperty(handler)) {
      Emitter.unregisterHandler(handler, component[listeners[handler]], component);
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
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}],3:[function(require,module,exports){
"use strict";

var pendingSearches = [];

var hasId = function hasId(element) {
  return element._gid !== undefined;
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
      if (hasId(element)) {
        setTimeout(function () {
          return _resolve(element);
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
              _resolve(element);
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
  },
  attributeDidChange: function attributeDidChange() {}
};

module.exports = Gremlin;
},{"./GremlinElement":5,"./Mixins":6}],5:[function(require,module,exports){
'use strict';

var Data = require('./Data');
var uuid = require('./uuid');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var gremlinId = function gremlinId() {
  return 'gremlins_' + uuid();
};
var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

module.exports = {
  register: function register(tagName, Spec) {
    // TODO test for reserved function names ['createdCallback', 'attachedCallback', '']

    var proto = {
      createdCallback: {
        value: function value() {
          this._gid = gremlinId();

          Data.addGremlin(this._gid);
          this.created();
        },

        writable: false
      },
      attachedCallback: {
        value: function value() {
          this.attached();
        }
      },
      detachedCallback: {
        value: function value() {
          this.detached();
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          this.attributeDidChange(name, previousValue, _value);
        }
      }
    };

    for (var key in Spec) {
      // eslint-disable-line guard-for-in
      proto[key] = {
        value: Spec[key]
      };
    }

    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(tagName + ' { display: block }', 0);

    var El = document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto)
    });

    return El;
  }
};
},{"./Data":3,"./uuid":10}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var objectAssign = require('object-assign');

function getMixins(gremlin) {
  if (Array.isArray(gremlin.mixins)) {
    return gremlin.mixins;
  }

  return gremlin.mixins ? [gremlin.mixins] : [];
}

function decorateProperty(gremlin, propertyName, property) {
  var gremlinProperty = gremlin[propertyName];
  var moduleProperty = property;
  var gremlinPropertyType = typeof gremlinProperty === 'undefined' ? 'undefined' : _typeof(gremlinProperty);
  var modulePropertyType = typeof moduleProperty === 'undefined' ? 'undefined' : _typeof(moduleProperty);
  var isSamePropType = gremlinPropertyType === modulePropertyType;

  if (isSamePropType && modulePropertyType === 'function') {
    gremlin[propertyName] = function () {
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
    'Can\'t decorate gremlin property ' + ('<' + gremlin.tagName + ' />#' + propertyName + ':' + gremlinPropertyType + '« ') + ('with »Module#' + propertyName + ':' + modulePropertyType + '«. Only functions can be decorated!'));
  }
}

function mixinModule(gremlin, Module) {
  Object.keys(Module).forEach(function (propertyName) {
    var property = Module[propertyName];

    if (gremlin[propertyName] === undefined) {
      var descriptor = Object.getOwnPropertyDescriptor(Module, propertyName);
      Object.defineProperty(gremlin, propertyName, descriptor);
    } else {
      decorateProperty(gremlin, propertyName, property);
    }
  });
}

module.exports = {
  mixinProps: function mixinProps(gremlin) {
    var modules = getMixins(gremlin);
    // reverse the modules array to call decorated functions in the right order
    modules.reverse().forEach(function (Module) {
      return mixinModule(gremlin, Module);
    });
  }
};
},{"object-assign":11}],7:[function(require,module,exports){
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
},{"./gremlins":8,"document-register-element":2}],10:[function(require,module,exports){
"use strict";

// see https://gist.github.com/jed/982883
module.exports = function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b); // eslint-disable-line max-len
};
},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"../../lib/index":1,"gremlins":9}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudC9idWlsZC9kb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9EYXRhLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvTWl4aW5zLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9jb25zb2xlU2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvZ3JlbWxpbnMuanMiLCJub2RlX21vZHVsZXMvZ3JlbWxpbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi91dWlkLmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ0ZXN0L3NyYy9ncmVtbGlucy1kaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhY2hlID0ge307XG5cbnZhciBFbWl0dGVyID0ge1xuICByZWdpc3RlckhhbmRsZXI6IGZ1bmN0aW9uIHJlZ2lzdGVySGFuZGxlcihoYW5kbGVyTmFtZSwgaGFuZGxlciwgY29tcG9uZW50KSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJzwnICsgY29tcG9uZW50Lm5hbWUgKyAnIC8+IOKAlCBIYW5kbGVyIGZvciB0aGUgaW50ZXJlc3QgJyArIGhhbmRsZXJOYW1lICsgJyBpcyBtaXNzaW5nIScpO1xuICAgIH1cbiAgICBjYWNoZVtoYW5kbGVyTmFtZV0gPSBjYWNoZVtoYW5kbGVyTmFtZV0gfHwgW107XG4gICAgY2FjaGVbaGFuZGxlck5hbWVdLnB1c2goe1xuICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgIGNvbXBvbmVudDogY29tcG9uZW50XG4gICAgfSk7XG4gIH0sXG4gIHVucmVnaXN0ZXJIYW5kbGVyOiBmdW5jdGlvbiB1bnJlZ2lzdGVySGFuZGxlcihoYW5kbGVyTmFtZSwgaGFuZGxlciwgY29tcG9uZW50KSB7XG4gICAgY2FjaGVbaGFuZGxlck5hbWVdID0gY2FjaGVbaGFuZGxlck5hbWVdIHx8IFtdO1xuICAgIGlmIChjYWNoZVtoYW5kbGVyTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FjaGVbaGFuZGxlck5hbWVdID0gY2FjaGVbaGFuZGxlck5hbWVdLmZpbHRlcihmdW5jdGlvbiAoY2FsbGJhY2tPYmopIHtcbiAgICAgICAgdmFyIGN1cnJlbnRIYW5kbGVyID0gY2FsbGJhY2tPYmouaGFuZGxlcjtcbiAgICAgICAgdmFyIGN1cnJlbnRDb21wb25lbnQgPSBjYWxsYmFja09iai5jb21wb25lbnQ7XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRIYW5kbGVyICE9PSBoYW5kbGVyICYmIGN1cnJlbnRDb21wb25lbnQgIT09IGNvbXBvbmVudDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgZGlzcGF0Y2g6IGZ1bmN0aW9uIGRpc3BhdGNoKGhhbmRsZXJOYW1lLCBkYXRhLCBjb21wb25lbnQpIHtcbiAgICBjb25zb2xlLmxvZygnZGlzcGF0Y2hpbmcnLCBoYW5kbGVyTmFtZSk7XG4gICAgaWYgKGNhY2hlW2hhbmRsZXJOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhY2hlW2hhbmRsZXJOYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFja09iaikge1xuICAgICAgICAgIGlmIChjYWxsYmFja09iai5jb21wb25lbnQgIT09IGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY2FsbGJhY2tPYmouaGFuZGxlci5jYWxsKGNhbGxiYWNrT2JqLmNvbXBvbmVudCwgZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFkZEludGVyZXN0cyhjb21wb25lbnQpIHtcbiAgdmFyIGxpc3RlbmVycyA9IHR5cGVvZiBjb21wb25lbnQuZ2V0TGlzdGVuZXJzID09PSAnZnVuY3Rpb24nID8gY29tcG9uZW50LmdldExpc3RlbmVycygpIDoge307XG5cbiAgZm9yICh2YXIgaGFuZGxlciBpbiBsaXN0ZW5lcnMpIHtcbiAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGhhbmRsZXIpKSB7XG4gICAgICBFbWl0dGVyLnJlZ2lzdGVySGFuZGxlcihoYW5kbGVyLCBjb21wb25lbnRbbGlzdGVuZXJzW2hhbmRsZXJdXSwgY29tcG9uZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW50ZXJlc3RzKGNvbXBvbmVudCkge1xuICB2YXIgbGlzdGVuZXJzID0gdHlwZW9mIGNvbXBvbmVudC5nZXRMaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicgPyBjb21wb25lbnQuZ2V0TGlzdGVuZXJzKCkgOiB7fTtcbiAgZm9yICh2YXIgaGFuZGxlciBpbiBsaXN0ZW5lcnMpIHtcbiAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGhhbmRsZXIpKSB7XG4gICAgICBFbWl0dGVyLnVucmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXIsIGNvbXBvbmVudFtsaXN0ZW5lcnNbaGFuZGxlcl1dLCBjb21wb25lbnQpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXR0YWNoZWQ6IGZ1bmN0aW9uIGF0dGFjaGVkKCkge1xuICAgIGFkZEludGVyZXN0cyh0aGlzKTtcbiAgfSxcbiAgZGV0YWNoZWQ6IGZ1bmN0aW9uIGRldGFjaGVkKCkge1xuICAgIHJlbW92ZUludGVyZXN0cyh0aGlzKTtcbiAgfSxcbiAgZW1pdDogZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xuICAgIEVtaXR0ZXIuZGlzcGF0Y2goZXZlbnROYW1lLCBldmVudERhdGEsIHRoaXMpO1xuICB9XG59OyIsIi8qISAoQykgV2ViUmVmbGVjdGlvbiBNaXQgU3R5bGUgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGUsdCxuLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHJ0KGUsdCl7Zm9yKHZhciBuPTAscj1lLmxlbmd0aDtuPHI7bisrKXZ0KGVbbl0sdCl9ZnVuY3Rpb24gaXQoZSl7Zm9yKHZhciB0PTAsbj1lLmxlbmd0aCxyO3Q8bjt0Kyspcj1lW3RdLG50KHIsYltvdChyKV0pfWZ1bmN0aW9uIHN0KGUpe3JldHVybiBmdW5jdGlvbih0KXtqKHQpJiYodnQodCxlKSxydCh0LnF1ZXJ5U2VsZWN0b3JBbGwodyksZSkpfX1mdW5jdGlvbiBvdChlKXt2YXIgdD1lLmdldEF0dHJpYnV0ZShcImlzXCIpLG49ZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpLHI9Uy5jYWxsKHksdD92K3QudG9VcHBlckNhc2UoKTpkK24pO3JldHVybiB0JiYtMTxyJiYhdXQobix0KT8tMTpyfWZ1bmN0aW9uIHV0KGUsdCl7cmV0dXJuLTE8dy5pbmRleE9mKGUrJ1tpcz1cIicrdCsnXCJdJyl9ZnVuY3Rpb24gYXQoZSl7dmFyIHQ9ZS5jdXJyZW50VGFyZ2V0LG49ZS5hdHRyQ2hhbmdlLHI9ZS5hdHRyTmFtZSxpPWUudGFyZ2V0O1EmJighaXx8aT09PXQpJiZ0LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmciE9PVwic3R5bGVcIiYmZS5wcmV2VmFsdWUhPT1lLm5ld1ZhbHVlJiZ0LmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhyLG49PT1lW2FdP251bGw6ZS5wcmV2VmFsdWUsbj09PWVbbF0/bnVsbDplLm5ld1ZhbHVlKX1mdW5jdGlvbiBmdChlKXt2YXIgdD1zdChlKTtyZXR1cm4gZnVuY3Rpb24oZSl7WC5wdXNoKHQsZS50YXJnZXQpfX1mdW5jdGlvbiBsdChlKXtLJiYoSz0hMSxlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihoLGx0KSkscnQoKGUudGFyZ2V0fHx0KS5xdWVyeVNlbGVjdG9yQWxsKHcpLGUuZGV0YWlsPT09bz9vOnMpLEImJnB0KCl9ZnVuY3Rpb24gY3QoZSx0KXt2YXIgbj10aGlzO3EuY2FsbChuLGUsdCksRy5jYWxsKG4se3RhcmdldDpufSl9ZnVuY3Rpb24gaHQoZSx0KXtEKGUsdCksZXQ/ZXQub2JzZXJ2ZShlLHopOihKJiYoZS5zZXRBdHRyaWJ1dGU9Y3QsZVtpXT1aKGUpLGUuYWRkRXZlbnRMaXN0ZW5lcihwLEcpKSxlLmFkZEV2ZW50TGlzdGVuZXIoYyxhdCkpLGUuY3JlYXRlZENhbGxiYWNrJiZRJiYoZS5jcmVhdGVkPSEwLGUuY3JlYXRlZENhbGxiYWNrKCksZS5jcmVhdGVkPSExKX1mdW5jdGlvbiBwdCgpe2Zvcih2YXIgZSx0PTAsbj1GLmxlbmd0aDt0PG47dCsrKWU9Rlt0XSxFLmNvbnRhaW5zKGUpfHwobi0tLEYuc3BsaWNlKHQtLSwxKSx2dChlLG8pKX1mdW5jdGlvbiBkdChlKXt0aHJvdyBuZXcgRXJyb3IoXCJBIFwiK2UrXCIgdHlwZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRcIil9ZnVuY3Rpb24gdnQoZSx0KXt2YXIgbixyPW90KGUpOy0xPHImJih0dChlLGJbcl0pLHI9MCx0PT09cyYmIWVbc10/KGVbb109ITEsZVtzXT0hMCxyPTEsQiYmUy5jYWxsKEYsZSk8MCYmRi5wdXNoKGUpKTp0PT09byYmIWVbb10mJihlW3NdPSExLGVbb109ITAscj0xKSxyJiYobj1lW3QrXCJDYWxsYmFja1wiXSkmJm4uY2FsbChlKSl9aWYociBpbiB0KXJldHVybjt2YXIgaT1cIl9fXCIrcisoTWF0aC5yYW5kb20oKSoxZTU+PjApLHM9XCJhdHRhY2hlZFwiLG89XCJkZXRhY2hlZFwiLHU9XCJleHRlbmRzXCIsYT1cIkFERElUSU9OXCIsZj1cIk1PRElGSUNBVElPTlwiLGw9XCJSRU1PVkFMXCIsYz1cIkRPTUF0dHJNb2RpZmllZFwiLGg9XCJET01Db250ZW50TG9hZGVkXCIscD1cIkRPTVN1YnRyZWVNb2RpZmllZFwiLGQ9XCI8XCIsdj1cIj1cIixtPS9eW0EtWl1bQS1aMC05XSooPzotW0EtWjAtOV0rKSskLyxnPVtcIkFOTk9UQVRJT04tWE1MXCIsXCJDT0xPUi1QUk9GSUxFXCIsXCJGT05ULUZBQ0VcIixcIkZPTlQtRkFDRS1TUkNcIixcIkZPTlQtRkFDRS1VUklcIixcIkZPTlQtRkFDRS1GT1JNQVRcIixcIkZPTlQtRkFDRS1OQU1FXCIsXCJNSVNTSU5HLUdMWVBIXCJdLHk9W10sYj1bXSx3PVwiXCIsRT10LmRvY3VtZW50RWxlbWVudCxTPXkuaW5kZXhPZnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PXRoaXMubGVuZ3RoO3QtLSYmdGhpc1t0XSE9PWU7KTtyZXR1cm4gdH0seD1uLnByb3RvdHlwZSxUPXguaGFzT3duUHJvcGVydHksTj14LmlzUHJvdG90eXBlT2YsQz1uLmRlZmluZVByb3BlcnR5LGs9bi5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsTD1uLmdldE93blByb3BlcnR5TmFtZXMsQT1uLmdldFByb3RvdHlwZU9mLE89bi5zZXRQcm90b3R5cGVPZixNPSEhbi5fX3Byb3RvX18sXz1uLmNyZWF0ZXx8ZnVuY3Rpb24gbXQoZSl7cmV0dXJuIGU/KG10LnByb3RvdHlwZT1lLG5ldyBtdCk6dGhpc30sRD1PfHwoTT9mdW5jdGlvbihlLHQpe3JldHVybiBlLl9fcHJvdG9fXz10LGV9OkwmJms/ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7Zm9yKHZhciBuLHI9TCh0KSxpPTAscz1yLmxlbmd0aDtpPHM7aSsrKW49cltpXSxULmNhbGwoZSxuKXx8QyhlLG4sayh0LG4pKX1yZXR1cm4gZnVuY3Rpb24odCxuKXtkbyBlKHQsbik7d2hpbGUoKG49QShuKSkmJiFOLmNhbGwobix0KSk7cmV0dXJuIHR9fSgpOmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuIGluIHQpZVtuXT10W25dO3JldHVybiBlfSksUD1lLk11dGF0aW9uT2JzZXJ2ZXJ8fGUuV2ViS2l0TXV0YXRpb25PYnNlcnZlcixIPShlLkhUTUxFbGVtZW50fHxlLkVsZW1lbnR8fGUuTm9kZSkucHJvdG90eXBlLEI9IU4uY2FsbChILEUpLGo9Qj9mdW5jdGlvbihlKXtyZXR1cm4gZS5ub2RlVHlwZT09PTF9OmZ1bmN0aW9uKGUpe3JldHVybiBOLmNhbGwoSCxlKX0sRj1CJiZbXSxJPUguY2xvbmVOb2RlLHE9SC5zZXRBdHRyaWJ1dGUsUj1ILnJlbW92ZUF0dHJpYnV0ZSxVPXQuY3JlYXRlRWxlbWVudCx6PVAmJnthdHRyaWJ1dGVzOiEwLGNoYXJhY3RlckRhdGE6ITAsYXR0cmlidXRlT2xkVmFsdWU6ITB9LFc9UHx8ZnVuY3Rpb24oZSl7Sj0hMSxFLnJlbW92ZUV2ZW50TGlzdGVuZXIoYyxXKX0sWCxWPWUucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGZ1bmN0aW9uKGUpe3NldFRpbWVvdXQoZSwxMCl9LCQ9ITEsSj0hMCxLPSEwLFE9ITAsRyxZLFosZXQsdHQsbnQ7T3x8TT8odHQ9ZnVuY3Rpb24oZSx0KXtOLmNhbGwodCxlKXx8aHQoZSx0KX0sbnQ9aHQpOih0dD1mdW5jdGlvbihlLHQpe2VbaV18fChlW2ldPW4oITApLGh0KGUsdCkpfSxudD10dCksQj8oSj0hMSxmdW5jdGlvbigpe3ZhciBlPWsoSCxcImFkZEV2ZW50TGlzdGVuZXJcIiksdD1lLnZhbHVlLG49ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KTt0LmF0dHJOYW1lPWUsdC5wcmV2VmFsdWU9dGhpcy5nZXRBdHRyaWJ1dGUoZSksdC5uZXdWYWx1ZT1udWxsLHRbbF09dC5hdHRyQ2hhbmdlPTIsUi5jYWxsKHRoaXMsZSksdGhpcy5kaXNwYXRjaEV2ZW50KHQpfSxyPWZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpcy5oYXNBdHRyaWJ1dGUoZSkscj1uJiZ0aGlzLmdldEF0dHJpYnV0ZShlKSxpPW5ldyBDdXN0b21FdmVudChjLHtidWJibGVzOiEwfSk7cS5jYWxsKHRoaXMsZSx0KSxpLmF0dHJOYW1lPWUsaS5wcmV2VmFsdWU9bj9yOm51bGwsaS5uZXdWYWx1ZT10LG4/aVtmXT1pLmF0dHJDaGFuZ2U9MTppW2FdPWkuYXR0ckNoYW5nZT0wLHRoaXMuZGlzcGF0Y2hFdmVudChpKX0scz1mdW5jdGlvbihlKXt2YXIgdD1lLmN1cnJlbnRUYXJnZXQsbj10W2ldLHI9ZS5wcm9wZXJ0eU5hbWUscztuLmhhc093blByb3BlcnR5KHIpJiYobj1uW3JdLHM9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KSxzLmF0dHJOYW1lPW4ubmFtZSxzLnByZXZWYWx1ZT1uLnZhbHVlfHxudWxsLHMubmV3VmFsdWU9bi52YWx1ZT10W3JdfHxudWxsLHMucHJldlZhbHVlPT1udWxsP3NbYV09cy5hdHRyQ2hhbmdlPTA6c1tmXT1zLmF0dHJDaGFuZ2U9MSx0LmRpc3BhdGNoRXZlbnQocykpfTtlLnZhbHVlPWZ1bmN0aW9uKGUsbyx1KXtlPT09YyYmdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJnRoaXMuc2V0QXR0cmlidXRlIT09ciYmKHRoaXNbaV09e2NsYXNzTmFtZTp7bmFtZTpcImNsYXNzXCIsdmFsdWU6dGhpcy5jbGFzc05hbWV9fSx0aGlzLnNldEF0dHJpYnV0ZT1yLHRoaXMucmVtb3ZlQXR0cmlidXRlPW4sdC5jYWxsKHRoaXMsXCJwcm9wZXJ0eWNoYW5nZVwiLHMpKSx0LmNhbGwodGhpcyxlLG8sdSl9LEMoSCxcImFkZEV2ZW50TGlzdGVuZXJcIixlKX0oKSk6UHx8KEUuYWRkRXZlbnRMaXN0ZW5lcihjLFcpLEUuc2V0QXR0cmlidXRlKGksMSksRS5yZW1vdmVBdHRyaWJ1dGUoaSksSiYmKEc9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcyxuLHIscztpZih0PT09ZS50YXJnZXQpe249dFtpXSx0W2ldPXI9Wih0KTtmb3IocyBpbiByKXtpZighKHMgaW4gbikpcmV0dXJuIFkoMCx0LHMsbltzXSxyW3NdLGEpO2lmKHJbc10hPT1uW3NdKXJldHVybiBZKDEsdCxzLG5bc10scltzXSxmKX1mb3IocyBpbiBuKWlmKCEocyBpbiByKSlyZXR1cm4gWSgyLHQscyxuW3NdLHJbc10sbCl9fSxZPWZ1bmN0aW9uKGUsdCxuLHIsaSxzKXt2YXIgbz17YXR0ckNoYW5nZTplLGN1cnJlbnRUYXJnZXQ6dCxhdHRyTmFtZTpuLHByZXZWYWx1ZTpyLG5ld1ZhbHVlOml9O29bc109ZSxhdChvKX0sWj1mdW5jdGlvbihlKXtmb3IodmFyIHQsbixyPXt9LGk9ZS5hdHRyaWJ1dGVzLHM9MCxvPWkubGVuZ3RoO3M8bztzKyspdD1pW3NdLG49dC5uYW1lLG4hPT1cInNldEF0dHJpYnV0ZVwiJiYocltuXT10LnZhbHVlKTtyZXR1cm4gcn0pKSx0W3JdPWZ1bmN0aW9uKG4scil7Yz1uLnRvVXBwZXJDYXNlKCksJHx8KCQ9ITAsUD8oZXQ9ZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCl7Zm9yKHZhciBuPTAscj1lLmxlbmd0aDtuPHI7dChlW24rK10pKTt9cmV0dXJuIG5ldyBQKGZ1bmN0aW9uKHIpe2Zvcih2YXIgaSxzLG8sdT0wLGE9ci5sZW5ndGg7dTxhO3UrKylpPXJbdV0saS50eXBlPT09XCJjaGlsZExpc3RcIj8obihpLmFkZGVkTm9kZXMsZSksbihpLnJlbW92ZWROb2Rlcyx0KSk6KHM9aS50YXJnZXQsUSYmcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJmkuYXR0cmlidXRlTmFtZSE9PVwic3R5bGVcIiYmKG89cy5nZXRBdHRyaWJ1dGUoaS5hdHRyaWJ1dGVOYW1lKSxvIT09aS5vbGRWYWx1ZSYmcy5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soaS5hdHRyaWJ1dGVOYW1lLGkub2xkVmFsdWUsbykpKX0pfShzdChzKSxzdChvKSksZXQub2JzZXJ2ZSh0LHtjaGlsZExpc3Q6ITAsc3VidHJlZTohMH0pKTooWD1bXSxWKGZ1bmN0aW9uIEUoKXt3aGlsZShYLmxlbmd0aClYLnNoaWZ0KCkuY2FsbChudWxsLFguc2hpZnQoKSk7VihFKX0pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVJbnNlcnRlZFwiLGZ0KHMpKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLGZ0KG8pKSksdC5hZGRFdmVudExpc3RlbmVyKGgsbHQpLHQuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIixsdCksdC5jcmVhdGVFbGVtZW50PWZ1bmN0aW9uKGUsbil7dmFyIHI9VS5hcHBseSh0LGFyZ3VtZW50cyksaT1cIlwiK2Uscz1TLmNhbGwoeSwobj92OmQpKyhufHxpKS50b1VwcGVyQ2FzZSgpKSxvPS0xPHM7cmV0dXJuIG4mJihyLnNldEF0dHJpYnV0ZShcImlzXCIsbj1uLnRvTG93ZXJDYXNlKCkpLG8mJihvPXV0KGkudG9VcHBlckNhc2UoKSxuKSkpLFE9IXQuY3JlYXRlRWxlbWVudC5pbm5lckhUTUxIZWxwZXIsbyYmbnQocixiW3NdKSxyfSxILmNsb25lTm9kZT1mdW5jdGlvbihlKXt2YXIgdD1JLmNhbGwodGhpcywhIWUpLG49b3QodCk7cmV0dXJuLTE8biYmbnQodCxiW25dKSxlJiZpdCh0LnF1ZXJ5U2VsZWN0b3JBbGwodykpLHR9KSwtMjxTLmNhbGwoeSx2K2MpK1MuY2FsbCh5LGQrYykmJmR0KG4pO2lmKCFtLnRlc3QoYyl8fC0xPFMuY2FsbChnLGMpKXRocm93IG5ldyBFcnJvcihcIlRoZSB0eXBlIFwiK24rXCIgaXMgaW52YWxpZFwiKTt2YXIgaT1mdW5jdGlvbigpe3JldHVybiBmP3QuY3JlYXRlRWxlbWVudChsLGMpOnQuY3JlYXRlRWxlbWVudChsKX0sYT1yfHx4LGY9VC5jYWxsKGEsdSksbD1mP3JbdV0udG9VcHBlckNhc2UoKTpjLGMscDtyZXR1cm4gZiYmLTE8Uy5jYWxsKHksZCtsKSYmZHQobCkscD15LnB1c2goKGY/djpkKStjKS0xLHc9dy5jb25jYXQody5sZW5ndGg/XCIsXCI6XCJcIixmP2wrJ1tpcz1cIicrbi50b0xvd2VyQ2FzZSgpKydcIl0nOmwpLGkucHJvdG90eXBlPWJbcF09VC5jYWxsKGEsXCJwcm90b3R5cGVcIik/YS5wcm90b3R5cGU6XyhIKSxydCh0LnF1ZXJ5U2VsZWN0b3JBbGwodykscyksaX19KSh3aW5kb3csZG9jdW1lbnQsT2JqZWN0LFwicmVnaXN0ZXJFbGVtZW50XCIpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcGVuZGluZ1NlYXJjaGVzID0gW107XG5cbnZhciBoYXNJZCA9IGZ1bmN0aW9uIGhhc0lkKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQuX2dpZCAhPT0gdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZEdyZW1saW46IGZ1bmN0aW9uIGFkZEdyZW1saW4oaWQpIHtcbiAgICBwZW5kaW5nU2VhcmNoZXMgPSBwZW5kaW5nU2VhcmNoZXMuZmlsdGVyKGZ1bmN0aW9uIChzZWFyY2gpIHtcbiAgICAgIHZhciB3YXNTZWFyY2hlZEZvciA9IHNlYXJjaC5lbGVtZW50Ll9naWQgPT09IGlkO1xuICAgICAgaWYgKHdhc1NlYXJjaGVkRm9yKSB7XG4gICAgICAgIHNlYXJjaC5yZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhd2FzU2VhcmNoZWRGb3I7XG4gICAgfSk7XG4gIH0sXG4gIGdldEdyZW1saW5Bc3luYzogZnVuY3Rpb24gZ2V0R3JlbWxpbkFzeW5jKGVsZW1lbnQpIHtcbiAgICB2YXIgdGltZW91dCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBhcmd1bWVudHNbMV07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKF9yZXNvbHZlKSB7XG4gICAgICBpZiAoaGFzSWQoZWxlbWVudCkpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICB9LCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBncmVtbGluTm90Rm91bmRUaW1lb3V0ID0gdGltZW91dCAhPT0gbnVsbCA/IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3Jlc29sdmUobnVsbCk7XG4gICAgICAgICAgfSwgdGltZW91dCkgOiBudWxsO1xuXG4gICAgICAgICAgcGVuZGluZ1NlYXJjaGVzLnB1c2goe1xuICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gICAgICAgICAgICAgIGNsZWFyVGltZW91dChncmVtbGluTm90Rm91bmRUaW1lb3V0KTtcbiAgICAgICAgICAgICAgX3Jlc29sdmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTWl4aW5zID0gcmVxdWlyZSgnLi9NaXhpbnMnKTtcbnZhciBHcmVtbGluRWxlbWVudCA9IHJlcXVpcmUoJy4vR3JlbWxpbkVsZW1lbnQnKTtcblxuLyoqXG4gKiAjIyBgR3JlbWxpbmBcbiAqIFRoZSBiYXNlIHByb3RvdHlwZSB1c2VkIGZvciBhbGwgZ3JlbWxpbiBjb21wb25lbnRzL3NwZWNzXG4gKlxuICpcbiAqL1xuXG5mdW5jdGlvbiBleHRlbmQob2JqKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzb3VyY2VzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIHNvdXJjZXNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcCk7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzY3JpcHRvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG4vKiFcbiAqIEFsbCB0aGUgU3BlY3MgYWxyZWFkeSBhZGRlZC5cbiAqXG4gKiBVc2VkIHRvIGRldGVjdCBtdWx0aSBhZGRzXG4gKi9cbnZhciBzcGVjTWFwID0ge307XG5cbnZhciBhZGRTcGVjID0gZnVuY3Rpb24gYWRkU3BlYyh0YWdOYW1lLCBTcGVjKSB7XG4gIHJldHVybiBzcGVjTWFwW3RhZ05hbWVdID0gU3BlYztcbn07XG52YXIgaGFzU3BlYyA9IGZ1bmN0aW9uIGhhc1NwZWModGFnTmFtZSkge1xuICByZXR1cm4gc3BlY01hcFt0YWdOYW1lXSAhPT0gdW5kZWZpbmVkO1xufTtcblxudmFyIEdyZW1saW4gPSB7XG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQoKSB7fSxcbiAgYXR0YWNoZWQ6IGZ1bmN0aW9uIGF0dGFjaGVkKCkge30sXG4gIGRldGFjaGVkOiBmdW5jdGlvbiBkZXRhY2hlZCgpIHt9LFxuICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZSh0YWdOYW1lKSB7XG4gICAgdmFyIFNwZWMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHZhciBQYXJlbnQgPSB0aGlzO1xuICAgIHZhciBOZXdTcGVjID0gT2JqZWN0LmNyZWF0ZShQYXJlbnQsIHtcbiAgICAgIG5hbWU6IHtcbiAgICAgICAgdmFsdWU6IHRhZ05hbWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIHRhZ05hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdHcmVtbGlucy5jcmVhdGUgZXhwZWN0cyB0aGUgZ3JlbWxpbnMgdGFnIG5hbWUgYXMgYSBmaXJzdCBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoaGFzU3BlYyh0YWdOYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gYWRkIG5ldyBHcmVtbGluIHNwZWMsIGJ1dCBhIHNwZWMgZm9yICcgKyB0YWdOYW1lICsgJyBhbHJlYWR5IGV4aXN0cy4nKTtcbiAgICB9XG4gICAgaWYgKFNwZWMuY3JlYXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybiggLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAnWW91IGFyZSByZXBsYWNpbmcgdGhlIG9yaWdpbmFsIGNyZWF0ZSBtZXRob2QgZm9yIHRoZSBzcGVjIG9mICcgKyB0YWdOYW1lICsgJy4gWW91IGtub3cgd2hhdCAnICsgJ3lvdVxcJ3JlIGRvaW5nLCByaWdodD8nKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpblxuICAgIGV4dGVuZChOZXdTcGVjLCBTcGVjKTtcbiAgICAvLyBleHRlbmQgdGhlIHNwZWMgd2l0aCBpdCdzIE1peGluc1xuICAgIE1peGlucy5taXhpblByb3BzKE5ld1NwZWMpO1xuICAgIC8vIHJlbWVtYmVyIHRoaXMgbmFtZVxuICAgIGFkZFNwZWModGFnTmFtZSwgTmV3U3BlYyk7XG4gICAgLy8gYW5kIGNyZWF0ZSB0aGUgY3VzdG9tIGVsZW1lbnQgZm9yIGl0XG4gICAgR3JlbWxpbkVsZW1lbnQucmVnaXN0ZXIodGFnTmFtZSwgTmV3U3BlYyk7XG4gICAgcmV0dXJuIE5ld1NwZWM7XG4gIH0sXG4gIGF0dHJpYnV0ZURpZENoYW5nZTogZnVuY3Rpb24gYXR0cmlidXRlRGlkQ2hhbmdlKCkge31cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR3JlbWxpbjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBEYXRhID0gcmVxdWlyZSgnLi9EYXRhJyk7XG52YXIgdXVpZCA9IHJlcXVpcmUoJy4vdXVpZCcpO1xuXG52YXIgY2FuUmVnaXN0ZXJFbGVtZW50cyA9IHR5cGVvZiBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQgPT09ICdmdW5jdGlvbic7XG5cbmlmICghY2FuUmVnaXN0ZXJFbGVtZW50cykge1xuICB0aHJvdyBuZXcgRXJyb3IoJ3JlZ2lzdGVyRWxlbWVudCBub3QgYXZhaWxhYmxlLiBEaWQgeW91IGluY2x1ZGUgdGhlIHBvbHlmaWxsIGZvciBvbGRlciBicm93c2Vycz8nKTtcbn1cblxudmFyIGdyZW1saW5JZCA9IGZ1bmN0aW9uIGdyZW1saW5JZCgpIHtcbiAgcmV0dXJuICdncmVtbGluc18nICsgdXVpZCgpO1xufTtcbnZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xudmFyIHN0eWxlU2hlZXQgPSB1bmRlZmluZWQ7XG5cbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbnN0eWxlU2hlZXQgPSBzdHlsZUVsZW1lbnQuc2hlZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZWdpc3RlcjogZnVuY3Rpb24gcmVnaXN0ZXIodGFnTmFtZSwgU3BlYykge1xuICAgIC8vIFRPRE8gdGVzdCBmb3IgcmVzZXJ2ZWQgZnVuY3Rpb24gbmFtZXMgWydjcmVhdGVkQ2FsbGJhY2snLCAnYXR0YWNoZWRDYWxsYmFjaycsICcnXVxuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgICB0aGlzLl9naWQgPSBncmVtbGluSWQoKTtcblxuICAgICAgICAgIERhdGEuYWRkR3JlbWxpbih0aGlzLl9naWQpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlZCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGF0dGFjaGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgIHRoaXMuYXR0YWNoZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRldGFjaGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgIHRoaXMuZGV0YWNoZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmFtZSwgcHJldmlvdXNWYWx1ZSwgX3ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5hdHRyaWJ1dGVEaWRDaGFuZ2UobmFtZSwgcHJldmlvdXNWYWx1ZSwgX3ZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gU3BlYykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBndWFyZC1mb3ItaW5cbiAgICAgIHByb3RvW2tleV0gPSB7XG4gICAgICAgIHZhbHVlOiBTcGVjW2tleV1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gaW5zZXJ0IHRoZSBydWxlIEJFRk9SRSByZWdpc3RlcmluZyB0aGUgZWxlbWVudC4gVGhpcyBpcyBpbXBvcnRhbnQgYmVjYXVzZSB0aGV5IG1heSBiZSBpbmxpbmVcbiAgICAvLyBvdGhlcndpc2Ugd2hlbiBmaXJzdCBpbml0aWFsaXplZC5cbiAgICBzdHlsZVNoZWV0Lmluc2VydFJ1bGUodGFnTmFtZSArICcgeyBkaXNwbGF5OiBibG9jayB9JywgMCk7XG5cbiAgICB2YXIgRWwgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQodGFnTmFtZSwge1xuICAgICAgbmFtZTogdGFnTmFtZSxcbiAgICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHByb3RvKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEVsO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmZ1bmN0aW9uIGdldE1peGlucyhncmVtbGluKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGdyZW1saW4ubWl4aW5zKSkge1xuICAgIHJldHVybiBncmVtbGluLm1peGlucztcbiAgfVxuXG4gIHJldHVybiBncmVtbGluLm1peGlucyA/IFtncmVtbGluLm1peGluc10gOiBbXTtcbn1cblxuZnVuY3Rpb24gZGVjb3JhdGVQcm9wZXJ0eShncmVtbGluLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5KSB7XG4gIHZhciBncmVtbGluUHJvcGVydHkgPSBncmVtbGluW3Byb3BlcnR5TmFtZV07XG4gIHZhciBtb2R1bGVQcm9wZXJ0eSA9IHByb3BlcnR5O1xuICB2YXIgZ3JlbWxpblByb3BlcnR5VHlwZSA9IHR5cGVvZiBncmVtbGluUHJvcGVydHkgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGdyZW1saW5Qcm9wZXJ0eSk7XG4gIHZhciBtb2R1bGVQcm9wZXJ0eVR5cGUgPSB0eXBlb2YgbW9kdWxlUHJvcGVydHkgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKG1vZHVsZVByb3BlcnR5KTtcbiAgdmFyIGlzU2FtZVByb3BUeXBlID0gZ3JlbWxpblByb3BlcnR5VHlwZSA9PT0gbW9kdWxlUHJvcGVydHlUeXBlO1xuXG4gIGlmIChpc1NhbWVQcm9wVHlwZSAmJiBtb2R1bGVQcm9wZXJ0eVR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBncmVtbGluW3Byb3BlcnR5TmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduLCBmdW5jLW5hbWVzXG4gICAgICAvLyBjYWxsIHRoZSBtb2R1bGUgZmlyc3RcbiAgICAgIHZhciBtb2R1bGVSZXN1bHQgPSBtb2R1bGVQcm9wZXJ0eS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgdmFyIGdyZW1saW5SZXN1bHQgPSBncmVtbGluUHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIG9iamVjdEFzc2lnbihtb2R1bGVSZXN1bHQsIGdyZW1saW5SZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gW21vZHVsZVJlc3VsdCwgZ3JlbWxpblJlc3VsdF07XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICdDYW5cXCd0IGRlY29yYXRlIGdyZW1saW4gcHJvcGVydHkgJyArICgnPCcgKyBncmVtbGluLnRhZ05hbWUgKyAnIC8+IycgKyBwcm9wZXJ0eU5hbWUgKyAnOicgKyBncmVtbGluUHJvcGVydHlUeXBlICsgJ8KrICcpICsgKCd3aXRoIMK7TW9kdWxlIycgKyBwcm9wZXJ0eU5hbWUgKyAnOicgKyBtb2R1bGVQcm9wZXJ0eVR5cGUgKyAnwqsuIE9ubHkgZnVuY3Rpb25zIGNhbiBiZSBkZWNvcmF0ZWQhJykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1peGluTW9kdWxlKGdyZW1saW4sIE1vZHVsZSkge1xuICBPYmplY3Qua2V5cyhNb2R1bGUpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgIHZhciBwcm9wZXJ0eSA9IE1vZHVsZVtwcm9wZXJ0eU5hbWVdO1xuXG4gICAgaWYgKGdyZW1saW5bcHJvcGVydHlOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTW9kdWxlLCBwcm9wZXJ0eU5hbWUpO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdyZW1saW4sIHByb3BlcnR5TmFtZSwgZGVzY3JpcHRvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlY29yYXRlUHJvcGVydHkoZ3JlbWxpbiwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eSk7XG4gICAgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1peGluUHJvcHM6IGZ1bmN0aW9uIG1peGluUHJvcHMoZ3JlbWxpbikge1xuICAgIHZhciBtb2R1bGVzID0gZ2V0TWl4aW5zKGdyZW1saW4pO1xuICAgIC8vIHJldmVyc2UgdGhlIG1vZHVsZXMgYXJyYXkgdG8gY2FsbCBkZWNvcmF0ZWQgZnVuY3Rpb25zIGluIHRoZSByaWdodCBvcmRlclxuICAgIG1vZHVsZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKE1vZHVsZSkge1xuICAgICAgcmV0dXJuIG1peGluTW9kdWxlKGdyZW1saW4sIE1vZHVsZSk7XG4gICAgfSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5mdW5jdGlvbiBub29wKCkge31cbnZhciB0eXBlcyA9IFsnbG9nJywgJ2luZm8nLCAnd2FybiddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUoKSB7XG4gICAgaWYgKGNvbnNvbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZ2xvYmFsLmNvbnNvbGUgPSB7fTtcbiAgICB9XG4gICAgdHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlW3R5cGVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnNvbGVbdHlwZV0gPSBub29wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqICMgZ3JlbWxpbi5qc1xuICogZGVhZCBzaW1wbGUgd2ViIGNvbXBvbmVudHNcbiAqXG4gKiAjIyBgZ3JlbWxpbnNgXG4gKiBUaGUgZ3JlbWxpbi5qcyBwdWJsaWMgbmFtZXNwYWNlL21vZHVsZVxuICpcbiAqL1xuXG4vKiFcbiAqIERlcGVuZGVuY2llc1xuICovXG52YXIgY29uc29sZVNoaW0gPSByZXF1aXJlKCcuL2NvbnNvbGVTaGltJyk7XG52YXIgR3JlbWxpbiA9IHJlcXVpcmUoJy4vR3JlbWxpbicpO1xudmFyIERhdGEgPSByZXF1aXJlKCcuL0RhdGEnKTtcblxuLy8gbGV0J3MgYWRkIGEgYnJhbmRpbmcgc28gd2UgY2FuJ3QgaW5jbHVkZSBtb3JlIHRoYW4gb25lIGluc3RhbmNlIG9mIGdyZW1saW4uanNcbnZhciBCUkFORElORyA9ICdncmVtbGluc19jb25uZWN0ZWQnO1xuXG5pZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W0JSQU5ESU5HXSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSB0cmllZCB0byBpbmNsdWRlIGdyZW1saW4uanMgbXVsdGlwbGUgdGltZXMuIFRoaXMgd2lsbCBub3Qgd29yaycpO1xufVxuY29uc29sZVNoaW0uY3JlYXRlKCk7XG5cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtCUkFORElOR10gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZ3JlbWxpbiBzcGVjaWZpY2F0aW9uLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKiAgICAgdmFyIGdyZW1saW5zID0gcmVxdWlyZSgnZ3JlbWxpbnMnKTtcbiAgICpcbiAgICogICAgIGdyZW1saW5zLmNyZWF0ZSh7XG4gICogICAgICAgbmFtZTogJ0ZvbydcbiAgKiAgICAgfSk7XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBTcGVjIFRoZSBncmVtbGluIHNwZWNpZmljYXRpb25cbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZmluYWwgc3BlYyBjcmVhdGVkLCBsYXRlciB1c2VkIGFzIGEgcHJvdG90eXBlIGZvciBuZXcgY29tcG9uZW50cyBvZiB0aGlzXG4gICAqIHR5cGVcbiAgICogQG1ldGhvZCBjcmVhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIGNyZWF0ZTogR3JlbWxpbi5jcmVhdGUuYmluZChHcmVtbGluKSxcbiAgZmluZEdyZW1saW46IGZ1bmN0aW9uIGZpbmRHcmVtbGluKGVsZW1lbnQsIHRpbWVvdXQpIHtcbiAgICByZXR1cm4gRGF0YS5nZXRHcmVtbGluQXN5bmMoZWxlbWVudCwgdGltZW91dCk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiFcbiAqIFRoZSByZWdpc3RlciBlbGVtZW50IHBvbHlmaWxsIGZvciBvbGRlciBicm93c2Vyc1xuICpcbiAqL1xuXG5yZXF1aXJlKCdkb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9ncmVtbGlucycpOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamVkLzk4Mjg4M1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiKGEpIHtcbiAgcmV0dXJuIGEgPyAoYSBeIE1hdGgucmFuZG9tKCkgKiAxNiA+PiBhIC8gNCkudG9TdHJpbmcoMTYpIDogKFsxZTddICsgLTFlMyArIC00ZTMgKyAtOGUzICsgLTFlMTEpLnJlcGxhY2UoL1swMThdL2csIGIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbid1c2Ugc3RyaWN0JztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdyZW1saW5zICAgPSByZXF1aXJlKCdncmVtbGlucycpLFxuICAgIGRpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi8uLi9saWIvaW5kZXgnKTtcblxuZGVzY3JpYmUoJ2dyZW1saW5qcy1kaXNwYXRjaGVyJywgZnVuY3Rpb24gKCkge1xuXG4gIGl0KCdhdWdtZW50cyBncmVtbGluIGluc3RhbmNlcycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdGhpcy50aW1lb3V0KDUwMDApO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBncmVtbGlucy5jcmVhdGUoJ2ludGVyZXN0cy1ncmVtbGluJywge1xuICAgICAgbWl4aW5zOiBbZGlzcGF0Y2hlcl0sXG4gICAgICBnZXRMaXN0ZW5lcnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnRk9PJzogJ29uRm9vJ1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHRoaXMuZW1pdCkudG8uYmUuYSgnZnVuY3Rpb24nKTtcbiAgICAgICAgICBjb3VudCsrOy8vZG9uZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZG9uZShlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uRm9vKGRhdGEpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QoY291bnQpLnRvLmVxdWFsKDMpO1xuICAgICAgICAgIGV4cGVjdChkYXRhKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgICAgICAgZXhwZWN0KGRhdGEuZm9vKS50by5lcXVhbCgnZm9vJyk7XG4gICAgICAgICAgc2V0VGltZW91dChkb25lLCA1MDApO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZG9uZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ3JlbWxpbnMuY3JlYXRlKCdpbnRlcmVzdHMyLWdyZW1saW4nLCB7XG4gICAgICBtaXhpbnM6IFtkaXNwYXRjaGVyXSxcbiAgICAgIGdldExpc3RlbmVycygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdGT08nOiAnb25Gb28nXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgYXR0YWNoZWQoKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpPT50aGlzLmVtaXQoJ0ZPTycsIHtmb286ICdmb28nfSksIDUwMCk7XG4gICAgICB9LFxuICAgICAgb25Gb28oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGRpc3BhdGNoaW5nIGNvbXBvbmVudHMgY2FsbGJhY2sgc2hvdWxkIG5vdCBiZSBjYWxsZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGdyZW1saW5zLmNyZWF0ZSgnaW50ZXJlc3RzMy1ncmVtbGluJywge1xuICAgICAgbWl4aW5zOiBbZGlzcGF0Y2hlcl0sXG4gICAgICBnZXRMaXN0ZW5lcnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnRk9PJzogJ29uRm9vJ1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWQoKSB7XG5cbiAgICAgIH0sXG4gICAgICBvbkZvbygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnRzIG91dHNpZGUgdGhlIGRvbSBzaG91bGQgbm90IGJlIGNhbGxlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGVsICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0cy1ncmVtbGluJyk7XG4gICAgdmFyIGVsMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0czItZ3JlbWxpbicpO1xuICAgIHZhciBlbDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnRlcmVzdHMtZ3JlbWxpbicpO1xuICAgIHZhciBlbDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnRlcmVzdHMzLWdyZW1saW4nKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWw0KTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsNCk7XG4gICAgICBlbDQgPSBudWxsO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbDIpO1xuICAgICAgICBlbDIgPSBudWxsO1xuICAgICAgICBlbDQgPSBudWxsO1xuICAgICAgICBlbCA9IG51bGw7XG4gICAgICB9LCA1MDApO1xuICAgIH0sIDUwMCk7XG5cblxuICB9KTtcblxuXG59KTtcbiJdfQ==
