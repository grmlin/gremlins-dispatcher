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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudC9idWlsZC9kb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9EYXRhLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvTWl4aW5zLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9jb25zb2xlU2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvZ3JlbWxpbnMuanMiLCJub2RlX21vZHVsZXMvZ3JlbWxpbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi91dWlkLmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ0ZXN0L3NyYy9ncmVtbGlucy1kaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FjaGUgPSB7fTtcblxudmFyIEVtaXR0ZXIgPSB7XG4gIHJlZ2lzdGVySGFuZGxlcjogZnVuY3Rpb24gcmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXJOYW1lLCBoYW5kbGVyLCBjb21wb25lbnQpIHtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignPCcgKyBjb21wb25lbnQubmFtZSArICcgLz4g4oCUIEhhbmRsZXIgZm9yIHRoZSBpbnRlcmVzdCAnICsgaGFuZGxlck5hbWUgKyAnIGlzIG1pc3NpbmchJyk7XG4gICAgfVxuXG4gICAgaWYgKGNhY2hlW2hhbmRsZXJOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWNoZVtoYW5kbGVyTmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICBjYWNoZVtoYW5kbGVyTmFtZV0ucHVzaCh7XG4gICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnRcbiAgICB9KTtcbiAgfSxcbiAgdW5yZWdpc3RlckhhbmRsZXI6IGZ1bmN0aW9uIHVucmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXJOYW1lLCBjb21wb25lbnQpIHtcbiAgICBpZiAoY2FjaGVbaGFuZGxlck5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNhY2hlW2hhbmRsZXJOYW1lXSA9IGNhY2hlW2hhbmRsZXJOYW1lXS5maWx0ZXIoZnVuY3Rpb24gKGNhbGxiYWNrT2JqKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFja09iai5jb21wb25lbnQgIT09IGNvbXBvbmVudDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgZGlzcGF0Y2g6IGZ1bmN0aW9uIGRpc3BhdGNoKGhhbmRsZXJOYW1lLCBkYXRhLCBjb21wb25lbnQpIHtcbiAgICBpZiAoY2FjaGVbaGFuZGxlck5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FjaGVbaGFuZGxlck5hbWVdLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrT2JqKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrT2JqLmNvbXBvbmVudCAhPT0gY29tcG9uZW50KSB7XG4gICAgICAgICAgICBjYWxsYmFja09iai5oYW5kbGVyLmNhbGwoY2FsbGJhY2tPYmouY29tcG9uZW50LCBkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgMTApO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gYWRkSW50ZXJlc3RzKGNvbXBvbmVudCkge1xuICB2YXIgbGlzdGVuZXJzID0gdHlwZW9mIGNvbXBvbmVudC5nZXRMaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicgPyBjb21wb25lbnQuZ2V0TGlzdGVuZXJzKCkgOiB7fTtcblxuICBmb3IgKHZhciBoYW5kbGVyIGluIGxpc3RlbmVycykge1xuICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoaGFuZGxlcikpIHtcbiAgICAgIEVtaXR0ZXIucmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXIsIGNvbXBvbmVudFtsaXN0ZW5lcnNbaGFuZGxlcl1dLCBjb21wb25lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3JlZ2lzdGVyaW5nIGludGVyZXN0IFwiJyArIGhhbmRsZXIgKyAnXCIgZmFpbGVkJywgY29tcG9uZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW50ZXJlc3RzKGNvbXBvbmVudCkge1xuICB2YXIgbGlzdGVuZXJzID0gdHlwZW9mIGNvbXBvbmVudC5nZXRMaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicgPyBjb21wb25lbnQuZ2V0TGlzdGVuZXJzKCkgOiB7fTtcbiAgZm9yICh2YXIgaGFuZGxlciBpbiBsaXN0ZW5lcnMpIHtcbiAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGhhbmRsZXIpKSB7XG4gICAgICBFbWl0dGVyLnVucmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXIsIGNvbXBvbmVudCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhdHRhY2hlZDogZnVuY3Rpb24gYXR0YWNoZWQoKSB7XG4gICAgYWRkSW50ZXJlc3RzKHRoaXMpO1xuICB9LFxuICBkZXRhY2hlZDogZnVuY3Rpb24gZGV0YWNoZWQoKSB7XG4gICAgcmVtb3ZlSW50ZXJlc3RzKHRoaXMpO1xuICB9LFxuICBlbWl0OiBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XG4gICAgRW1pdHRlci5kaXNwYXRjaChldmVudE5hbWUsIGV2ZW50RGF0YSwgdGhpcyk7XG4gIH1cbn07IiwiLyohIChDKSBXZWJSZWZsZWN0aW9uIE1pdCBTdHlsZSBMaWNlbnNlICovXG4oZnVuY3Rpb24oZSx0LG4scil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcnQoZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjtuKyspdnQoZVtuXSx0KX1mdW5jdGlvbiBpdChlKXtmb3IodmFyIHQ9MCxuPWUubGVuZ3RoLHI7dDxuO3QrKylyPWVbdF0sbnQocixiW290KHIpXSl9ZnVuY3Rpb24gc3QoZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe2oodCkmJih2dCh0LGUpLHJ0KHQucXVlcnlTZWxlY3RvckFsbCh3KSxlKSl9fWZ1bmN0aW9uIG90KGUpe3ZhciB0PWUuZ2V0QXR0cmlidXRlKFwiaXNcIiksbj1lLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkscj1TLmNhbGwoeSx0P3YrdC50b1VwcGVyQ2FzZSgpOmQrbik7cmV0dXJuIHQmJi0xPHImJiF1dChuLHQpPy0xOnJ9ZnVuY3Rpb24gdXQoZSx0KXtyZXR1cm4tMTx3LmluZGV4T2YoZSsnW2lzPVwiJyt0KydcIl0nKX1mdW5jdGlvbiBhdChlKXt2YXIgdD1lLmN1cnJlbnRUYXJnZXQsbj1lLmF0dHJDaGFuZ2Uscj1lLmF0dHJOYW1lLGk9ZS50YXJnZXQ7USYmKCFpfHxpPT09dCkmJnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiZyIT09XCJzdHlsZVwiJiZlLnByZXZWYWx1ZSE9PWUubmV3VmFsdWUmJnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHIsbj09PWVbYV0/bnVsbDplLnByZXZWYWx1ZSxuPT09ZVtsXT9udWxsOmUubmV3VmFsdWUpfWZ1bmN0aW9uIGZ0KGUpe3ZhciB0PXN0KGUpO3JldHVybiBmdW5jdGlvbihlKXtYLnB1c2godCxlLnRhcmdldCl9fWZ1bmN0aW9uIGx0KGUpe0smJihLPSExLGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGgsbHQpKSxydCgoZS50YXJnZXR8fHQpLnF1ZXJ5U2VsZWN0b3JBbGwodyksZS5kZXRhaWw9PT1vP286cyksQiYmcHQoKX1mdW5jdGlvbiBjdChlLHQpe3ZhciBuPXRoaXM7cS5jYWxsKG4sZSx0KSxHLmNhbGwobix7dGFyZ2V0Om59KX1mdW5jdGlvbiBodChlLHQpe0QoZSx0KSxldD9ldC5vYnNlcnZlKGUseik6KEomJihlLnNldEF0dHJpYnV0ZT1jdCxlW2ldPVooZSksZS5hZGRFdmVudExpc3RlbmVyKHAsRykpLGUuYWRkRXZlbnRMaXN0ZW5lcihjLGF0KSksZS5jcmVhdGVkQ2FsbGJhY2smJlEmJihlLmNyZWF0ZWQ9ITAsZS5jcmVhdGVkQ2FsbGJhY2soKSxlLmNyZWF0ZWQ9ITEpfWZ1bmN0aW9uIHB0KCl7Zm9yKHZhciBlLHQ9MCxuPUYubGVuZ3RoO3Q8bjt0KyspZT1GW3RdLEUuY29udGFpbnMoZSl8fChuLS0sRi5zcGxpY2UodC0tLDEpLHZ0KGUsbykpfWZ1bmN0aW9uIGR0KGUpe3Rocm93IG5ldyBFcnJvcihcIkEgXCIrZStcIiB0eXBlIGlzIGFscmVhZHkgcmVnaXN0ZXJlZFwiKX1mdW5jdGlvbiB2dChlLHQpe3ZhciBuLHI9b3QoZSk7LTE8ciYmKHR0KGUsYltyXSkscj0wLHQ9PT1zJiYhZVtzXT8oZVtvXT0hMSxlW3NdPSEwLHI9MSxCJiZTLmNhbGwoRixlKTwwJiZGLnB1c2goZSkpOnQ9PT1vJiYhZVtvXSYmKGVbc109ITEsZVtvXT0hMCxyPTEpLHImJihuPWVbdCtcIkNhbGxiYWNrXCJdKSYmbi5jYWxsKGUpKX1pZihyIGluIHQpcmV0dXJuO3ZhciBpPVwiX19cIityKyhNYXRoLnJhbmRvbSgpKjFlNT4+MCkscz1cImF0dGFjaGVkXCIsbz1cImRldGFjaGVkXCIsdT1cImV4dGVuZHNcIixhPVwiQURESVRJT05cIixmPVwiTU9ESUZJQ0FUSU9OXCIsbD1cIlJFTU9WQUxcIixjPVwiRE9NQXR0ck1vZGlmaWVkXCIsaD1cIkRPTUNvbnRlbnRMb2FkZWRcIixwPVwiRE9NU3VidHJlZU1vZGlmaWVkXCIsZD1cIjxcIix2PVwiPVwiLG09L15bQS1aXVtBLVowLTldKig/Oi1bQS1aMC05XSspKyQvLGc9W1wiQU5OT1RBVElPTi1YTUxcIixcIkNPTE9SLVBST0ZJTEVcIixcIkZPTlQtRkFDRVwiLFwiRk9OVC1GQUNFLVNSQ1wiLFwiRk9OVC1GQUNFLVVSSVwiLFwiRk9OVC1GQUNFLUZPUk1BVFwiLFwiRk9OVC1GQUNFLU5BTUVcIixcIk1JU1NJTkctR0xZUEhcIl0seT1bXSxiPVtdLHc9XCJcIixFPXQuZG9jdW1lbnRFbGVtZW50LFM9eS5pbmRleE9mfHxmdW5jdGlvbihlKXtmb3IodmFyIHQ9dGhpcy5sZW5ndGg7dC0tJiZ0aGlzW3RdIT09ZTspO3JldHVybiB0fSx4PW4ucHJvdG90eXBlLFQ9eC5oYXNPd25Qcm9wZXJ0eSxOPXguaXNQcm90b3R5cGVPZixDPW4uZGVmaW5lUHJvcGVydHksaz1uLmdldE93blByb3BlcnR5RGVzY3JpcHRvcixMPW4uZ2V0T3duUHJvcGVydHlOYW1lcyxBPW4uZ2V0UHJvdG90eXBlT2YsTz1uLnNldFByb3RvdHlwZU9mLE09ISFuLl9fcHJvdG9fXyxfPW4uY3JlYXRlfHxmdW5jdGlvbiBtdChlKXtyZXR1cm4gZT8obXQucHJvdG90eXBlPWUsbmV3IG10KTp0aGlzfSxEPU98fChNP2Z1bmN0aW9uKGUsdCl7cmV0dXJuIGUuX19wcm90b19fPXQsZX06TCYmaz9mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXtmb3IodmFyIG4scj1MKHQpLGk9MCxzPXIubGVuZ3RoO2k8cztpKyspbj1yW2ldLFQuY2FsbChlLG4pfHxDKGUsbixrKHQsbikpfXJldHVybiBmdW5jdGlvbih0LG4pe2RvIGUodCxuKTt3aGlsZSgobj1BKG4pKSYmIU4uY2FsbChuLHQpKTtyZXR1cm4gdH19KCk6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9KSxQPWUuTXV0YXRpb25PYnNlcnZlcnx8ZS5XZWJLaXRNdXRhdGlvbk9ic2VydmVyLEg9KGUuSFRNTEVsZW1lbnR8fGUuRWxlbWVudHx8ZS5Ob2RlKS5wcm90b3R5cGUsQj0hTi5jYWxsKEgsRSksaj1CP2Z1bmN0aW9uKGUpe3JldHVybiBlLm5vZGVUeXBlPT09MX06ZnVuY3Rpb24oZSl7cmV0dXJuIE4uY2FsbChILGUpfSxGPUImJltdLEk9SC5jbG9uZU5vZGUscT1ILnNldEF0dHJpYnV0ZSxSPUgucmVtb3ZlQXR0cmlidXRlLFU9dC5jcmVhdGVFbGVtZW50LHo9UCYme2F0dHJpYnV0ZXM6ITAsY2hhcmFjdGVyRGF0YTohMCxhdHRyaWJ1dGVPbGRWYWx1ZTohMH0sVz1QfHxmdW5jdGlvbihlKXtKPSExLEUucmVtb3ZlRXZlbnRMaXN0ZW5lcihjLFcpfSxYLFY9ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tc1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oZSl7c2V0VGltZW91dChlLDEwKX0sJD0hMSxKPSEwLEs9ITAsUT0hMCxHLFksWixldCx0dCxudDtPfHxNPyh0dD1mdW5jdGlvbihlLHQpe04uY2FsbCh0LGUpfHxodChlLHQpfSxudD1odCk6KHR0PWZ1bmN0aW9uKGUsdCl7ZVtpXXx8KGVbaV09bighMCksaHQoZSx0KSl9LG50PXR0KSxCPyhKPSExLGZ1bmN0aW9uKCl7dmFyIGU9ayhILFwiYWRkRXZlbnRMaXN0ZW5lclwiKSx0PWUudmFsdWUsbj1mdW5jdGlvbihlKXt2YXIgdD1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pO3QuYXR0ck5hbWU9ZSx0LnByZXZWYWx1ZT10aGlzLmdldEF0dHJpYnV0ZShlKSx0Lm5ld1ZhbHVlPW51bGwsdFtsXT10LmF0dHJDaGFuZ2U9MixSLmNhbGwodGhpcyxlKSx0aGlzLmRpc3BhdGNoRXZlbnQodCl9LHI9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmhhc0F0dHJpYnV0ZShlKSxyPW4mJnRoaXMuZ2V0QXR0cmlidXRlKGUpLGk9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KTtxLmNhbGwodGhpcyxlLHQpLGkuYXR0ck5hbWU9ZSxpLnByZXZWYWx1ZT1uP3I6bnVsbCxpLm5ld1ZhbHVlPXQsbj9pW2ZdPWkuYXR0ckNoYW5nZT0xOmlbYV09aS5hdHRyQ2hhbmdlPTAsdGhpcy5kaXNwYXRjaEV2ZW50KGkpfSxzPWZ1bmN0aW9uKGUpe3ZhciB0PWUuY3VycmVudFRhcmdldCxuPXRbaV0scj1lLnByb3BlcnR5TmFtZSxzO24uaGFzT3duUHJvcGVydHkocikmJihuPW5bcl0scz1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pLHMuYXR0ck5hbWU9bi5uYW1lLHMucHJldlZhbHVlPW4udmFsdWV8fG51bGwscy5uZXdWYWx1ZT1uLnZhbHVlPXRbcl18fG51bGwscy5wcmV2VmFsdWU9PW51bGw/c1thXT1zLmF0dHJDaGFuZ2U9MDpzW2ZdPXMuYXR0ckNoYW5nZT0xLHQuZGlzcGF0Y2hFdmVudChzKSl9O2UudmFsdWU9ZnVuY3Rpb24oZSxvLHUpe2U9PT1jJiZ0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmdGhpcy5zZXRBdHRyaWJ1dGUhPT1yJiYodGhpc1tpXT17Y2xhc3NOYW1lOntuYW1lOlwiY2xhc3NcIix2YWx1ZTp0aGlzLmNsYXNzTmFtZX19LHRoaXMuc2V0QXR0cmlidXRlPXIsdGhpcy5yZW1vdmVBdHRyaWJ1dGU9bix0LmNhbGwodGhpcyxcInByb3BlcnR5Y2hhbmdlXCIscykpLHQuY2FsbCh0aGlzLGUsbyx1KX0sQyhILFwiYWRkRXZlbnRMaXN0ZW5lclwiLGUpfSgpKTpQfHwoRS5hZGRFdmVudExpc3RlbmVyKGMsVyksRS5zZXRBdHRyaWJ1dGUoaSwxKSxFLnJlbW92ZUF0dHJpYnV0ZShpKSxKJiYoRz1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG4scixzO2lmKHQ9PT1lLnRhcmdldCl7bj10W2ldLHRbaV09cj1aKHQpO2ZvcihzIGluIHIpe2lmKCEocyBpbiBuKSlyZXR1cm4gWSgwLHQscyxuW3NdLHJbc10sYSk7aWYocltzXSE9PW5bc10pcmV0dXJuIFkoMSx0LHMsbltzXSxyW3NdLGYpfWZvcihzIGluIG4paWYoIShzIGluIHIpKXJldHVybiBZKDIsdCxzLG5bc10scltzXSxsKX19LFk9ZnVuY3Rpb24oZSx0LG4scixpLHMpe3ZhciBvPXthdHRyQ2hhbmdlOmUsY3VycmVudFRhcmdldDp0LGF0dHJOYW1lOm4scHJldlZhbHVlOnIsbmV3VmFsdWU6aX07b1tzXT1lLGF0KG8pfSxaPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdCxuLHI9e30saT1lLmF0dHJpYnV0ZXMscz0wLG89aS5sZW5ndGg7czxvO3MrKyl0PWlbc10sbj10Lm5hbWUsbiE9PVwic2V0QXR0cmlidXRlXCImJihyW25dPXQudmFsdWUpO3JldHVybiByfSkpLHRbcl09ZnVuY3Rpb24obixyKXtjPW4udG9VcHBlckNhc2UoKSwkfHwoJD0hMCxQPyhldD1mdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjt0KGVbbisrXSkpO31yZXR1cm4gbmV3IFAoZnVuY3Rpb24ocil7Zm9yKHZhciBpLHMsbyx1PTAsYT1yLmxlbmd0aDt1PGE7dSsrKWk9clt1XSxpLnR5cGU9PT1cImNoaWxkTGlzdFwiPyhuKGkuYWRkZWROb2RlcyxlKSxuKGkucmVtb3ZlZE5vZGVzLHQpKToocz1pLnRhcmdldCxRJiZzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmaS5hdHRyaWJ1dGVOYW1lIT09XCJzdHlsZVwiJiYobz1zLmdldEF0dHJpYnV0ZShpLmF0dHJpYnV0ZU5hbWUpLG8hPT1pLm9sZFZhbHVlJiZzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhpLmF0dHJpYnV0ZU5hbWUsaS5vbGRWYWx1ZSxvKSkpfSl9KHN0KHMpLHN0KG8pKSxldC5vYnNlcnZlKHQse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSkpOihYPVtdLFYoZnVuY3Rpb24gRSgpe3doaWxlKFgubGVuZ3RoKVguc2hpZnQoKS5jYWxsKG51bGwsWC5zaGlmdCgpKTtWKEUpfSksdC5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZUluc2VydGVkXCIsZnQocykpLHQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVSZW1vdmVkXCIsZnQobykpKSx0LmFkZEV2ZW50TGlzdGVuZXIoaCxsdCksdC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLGx0KSx0LmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgcj1VLmFwcGx5KHQsYXJndW1lbnRzKSxpPVwiXCIrZSxzPVMuY2FsbCh5LChuP3Y6ZCkrKG58fGkpLnRvVXBwZXJDYXNlKCkpLG89LTE8cztyZXR1cm4gbiYmKHIuc2V0QXR0cmlidXRlKFwiaXNcIixuPW4udG9Mb3dlckNhc2UoKSksbyYmKG89dXQoaS50b1VwcGVyQ2FzZSgpLG4pKSksUT0hdC5jcmVhdGVFbGVtZW50LmlubmVySFRNTEhlbHBlcixvJiZudChyLGJbc10pLHJ9LEguY2xvbmVOb2RlPWZ1bmN0aW9uKGUpe3ZhciB0PUkuY2FsbCh0aGlzLCEhZSksbj1vdCh0KTtyZXR1cm4tMTxuJiZudCh0LGJbbl0pLGUmJml0KHQucXVlcnlTZWxlY3RvckFsbCh3KSksdH0pLC0yPFMuY2FsbCh5LHYrYykrUy5jYWxsKHksZCtjKSYmZHQobik7aWYoIW0udGVzdChjKXx8LTE8Uy5jYWxsKGcsYykpdGhyb3cgbmV3IEVycm9yKFwiVGhlIHR5cGUgXCIrbitcIiBpcyBpbnZhbGlkXCIpO3ZhciBpPWZ1bmN0aW9uKCl7cmV0dXJuIGY/dC5jcmVhdGVFbGVtZW50KGwsYyk6dC5jcmVhdGVFbGVtZW50KGwpfSxhPXJ8fHgsZj1ULmNhbGwoYSx1KSxsPWY/clt1XS50b1VwcGVyQ2FzZSgpOmMsYyxwO3JldHVybiBmJiYtMTxTLmNhbGwoeSxkK2wpJiZkdChsKSxwPXkucHVzaCgoZj92OmQpK2MpLTEsdz13LmNvbmNhdCh3Lmxlbmd0aD9cIixcIjpcIlwiLGY/bCsnW2lzPVwiJytuLnRvTG93ZXJDYXNlKCkrJ1wiXSc6bCksaS5wcm90b3R5cGU9YltwXT1ULmNhbGwoYSxcInByb3RvdHlwZVwiKT9hLnByb3RvdHlwZTpfKEgpLHJ0KHQucXVlcnlTZWxlY3RvckFsbCh3KSxzKSxpfX0pKHdpbmRvdyxkb2N1bWVudCxPYmplY3QsXCJyZWdpc3RlckVsZW1lbnRcIik7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBwZW5kaW5nU2VhcmNoZXMgPSBbXTtcblxudmFyIGhhc0lkID0gZnVuY3Rpb24gaGFzSWQoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5fZ2lkICE9PSB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkR3JlbWxpbjogZnVuY3Rpb24gYWRkR3JlbWxpbihpZCkge1xuICAgIHBlbmRpbmdTZWFyY2hlcyA9IHBlbmRpbmdTZWFyY2hlcy5maWx0ZXIoZnVuY3Rpb24gKHNlYXJjaCkge1xuICAgICAgdmFyIHdhc1NlYXJjaGVkRm9yID0gc2VhcmNoLmVsZW1lbnQuX2dpZCA9PT0gaWQ7XG4gICAgICBpZiAod2FzU2VhcmNoZWRGb3IpIHtcbiAgICAgICAgc2VhcmNoLnJlc29sdmUoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICF3YXNTZWFyY2hlZEZvcjtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0R3JlbWxpbkFzeW5jOiBmdW5jdGlvbiBnZXRHcmVtbGluQXN5bmMoZWxlbWVudCkge1xuICAgIHZhciB0aW1lb3V0ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoX3Jlc29sdmUpIHtcbiAgICAgIGlmIChoYXNJZChlbGVtZW50KSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3Jlc29sdmUoZWxlbWVudCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGdyZW1saW5Ob3RGb3VuZFRpbWVvdXQgPSB0aW1lb3V0ICE9PSBudWxsID8gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICB9LCB0aW1lb3V0KSA6IG51bGw7XG5cbiAgICAgICAgICBwZW5kaW5nU2VhcmNoZXMucHVzaCh7XG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSgpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGdyZW1saW5Ob3RGb3VuZFRpbWVvdXQpO1xuICAgICAgICAgICAgICBfcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBNaXhpbnMgPSByZXF1aXJlKCcuL01peGlucycpO1xudmFyIEdyZW1saW5FbGVtZW50ID0gcmVxdWlyZSgnLi9HcmVtbGluRWxlbWVudCcpO1xuXG4vKipcbiAqICMjIGBHcmVtbGluYFxuICogVGhlIGJhc2UgcHJvdG90eXBlIHVzZWQgZm9yIGFsbCBncmVtbGluIGNvbXBvbmVudHMvc3BlY3NcbiAqXG4gKlxuICovXG5cbmZ1bmN0aW9uIGV4dGVuZChvYmopIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHNvdXJjZXMgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgc291cmNlc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wKTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8qIVxuICogQWxsIHRoZSBTcGVjcyBhbHJlYWR5IGFkZGVkLlxuICpcbiAqIFVzZWQgdG8gZGV0ZWN0IG11bHRpIGFkZHNcbiAqL1xudmFyIHNwZWNNYXAgPSB7fTtcblxudmFyIGFkZFNwZWMgPSBmdW5jdGlvbiBhZGRTcGVjKHRhZ05hbWUsIFNwZWMpIHtcbiAgcmV0dXJuIHNwZWNNYXBbdGFnTmFtZV0gPSBTcGVjO1xufTtcbnZhciBoYXNTcGVjID0gZnVuY3Rpb24gaGFzU3BlYyh0YWdOYW1lKSB7XG4gIHJldHVybiBzcGVjTWFwW3RhZ05hbWVdICE9PSB1bmRlZmluZWQ7XG59O1xuXG52YXIgR3JlbWxpbiA9IHtcbiAgY3JlYXRlZDogZnVuY3Rpb24gY3JlYXRlZCgpIHt9LFxuICBhdHRhY2hlZDogZnVuY3Rpb24gYXR0YWNoZWQoKSB7fSxcbiAgZGV0YWNoZWQ6IGZ1bmN0aW9uIGRldGFjaGVkKCkge30sXG4gIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKHRhZ05hbWUpIHtcbiAgICB2YXIgU3BlYyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gICAgdmFyIFBhcmVudCA9IHRoaXM7XG4gICAgdmFyIE5ld1NwZWMgPSBPYmplY3QuY3JlYXRlKFBhcmVudCwge1xuICAgICAgbmFtZToge1xuICAgICAgICB2YWx1ZTogdGFnTmFtZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgdGFnTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0dyZW1saW5zLmNyZWF0ZSBleHBlY3RzIHRoZSBncmVtbGlucyB0YWcgbmFtZSBhcyBhIGZpcnN0IGFyZ3VtZW50Jyk7XG4gICAgfVxuICAgIGlmIChoYXNTcGVjKHRhZ05hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byBhZGQgbmV3IEdyZW1saW4gc3BlYywgYnV0IGEgc3BlYyBmb3IgJyArIHRhZ05hbWUgKyAnIGFscmVhZHkgZXhpc3RzLicpO1xuICAgIH1cbiAgICBpZiAoU3BlYy5jcmVhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS53YXJuKCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICdZb3UgYXJlIHJlcGxhY2luZyB0aGUgb3JpZ2luYWwgY3JlYXRlIG1ldGhvZCBmb3IgdGhlIHNwZWMgb2YgJyArIHRhZ05hbWUgKyAnLiBZb3Uga25vdyB3aGF0ICcgKyAneW91XFwncmUgZG9pbmcsIHJpZ2h0PycpO1xuICAgIH1cblxuICAgIC8vIHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluXG4gICAgZXh0ZW5kKE5ld1NwZWMsIFNwZWMpO1xuICAgIC8vIGV4dGVuZCB0aGUgc3BlYyB3aXRoIGl0J3MgTWl4aW5zXG4gICAgTWl4aW5zLm1peGluUHJvcHMoTmV3U3BlYyk7XG4gICAgLy8gcmVtZW1iZXIgdGhpcyBuYW1lXG4gICAgYWRkU3BlYyh0YWdOYW1lLCBOZXdTcGVjKTtcbiAgICAvLyBhbmQgY3JlYXRlIHRoZSBjdXN0b20gZWxlbWVudCBmb3IgaXRcbiAgICBHcmVtbGluRWxlbWVudC5yZWdpc3Rlcih0YWdOYW1lLCBOZXdTcGVjKTtcbiAgICByZXR1cm4gTmV3U3BlYztcbiAgfSxcbiAgYXR0cmlidXRlRGlkQ2hhbmdlOiBmdW5jdGlvbiBhdHRyaWJ1dGVEaWRDaGFuZ2UoKSB7fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmVtbGluOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIERhdGEgPSByZXF1aXJlKCcuL0RhdGEnKTtcbnZhciB1dWlkID0gcmVxdWlyZSgnLi91dWlkJyk7XG5cbnZhciBjYW5SZWdpc3RlckVsZW1lbnRzID0gdHlwZW9mIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJztcblxuaWYgKCFjYW5SZWdpc3RlckVsZW1lbnRzKSB7XG4gIHRocm93IG5ldyBFcnJvcigncmVnaXN0ZXJFbGVtZW50IG5vdCBhdmFpbGFibGUuIERpZCB5b3UgaW5jbHVkZSB0aGUgcG9seWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzPycpO1xufVxuXG52YXIgZ3JlbWxpbklkID0gZnVuY3Rpb24gZ3JlbWxpbklkKCkge1xuICByZXR1cm4gJ2dyZW1saW5zXycgKyB1dWlkKCk7XG59O1xudmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG52YXIgc3R5bGVTaGVldCA9IHVuZGVmaW5lZDtcblxuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuc3R5bGVTaGVldCA9IHN0eWxlRWxlbWVudC5zaGVldDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3Rlcih0YWdOYW1lLCBTcGVjKSB7XG4gICAgLy8gVE9ETyB0ZXN0IGZvciByZXNlcnZlZCBmdW5jdGlvbiBuYW1lcyBbJ2NyZWF0ZWRDYWxsYmFjaycsICdhdHRhY2hlZENhbGxiYWNrJywgJyddXG5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBjcmVhdGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgIHRoaXMuX2dpZCA9IGdyZW1saW5JZCgpO1xuXG4gICAgICAgICAgRGF0YS5hZGRHcmVtbGluKHRoaXMuX2dpZCk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVkKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgICB9LFxuICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2hlZCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGV0YWNoZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgICAgdGhpcy5kZXRhY2hlZCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuYW1lLCBwcmV2aW91c1ZhbHVlLCBfdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmF0dHJpYnV0ZURpZENoYW5nZShuYW1lLCBwcmV2aW91c1ZhbHVlLCBfdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBTcGVjKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGd1YXJkLWZvci1pblxuICAgICAgcHJvdG9ba2V5XSA9IHtcbiAgICAgICAgdmFsdWU6IFNwZWNba2V5XVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBpbnNlcnQgdGhlIHJ1bGUgQkVGT1JFIHJlZ2lzdGVyaW5nIHRoZSBlbGVtZW50LiBUaGlzIGlzIGltcG9ydGFudCBiZWNhdXNlIHRoZXkgbWF5IGJlIGlubGluZVxuICAgIC8vIG90aGVyd2lzZSB3aGVuIGZpcnN0IGluaXRpYWxpemVkLlxuICAgIHN0eWxlU2hlZXQuaW5zZXJ0UnVsZSh0YWdOYW1lICsgJyB7IGRpc3BsYXk6IGJsb2NrIH0nLCAwKTtcblxuICAgIHZhciBFbCA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCh0YWdOYW1lLCB7XG4gICAgICBuYW1lOiB0YWdOYW1lLFxuICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwgcHJvdG8pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gRWw7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIG9iamVjdEFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuZnVuY3Rpb24gZ2V0TWl4aW5zKGdyZW1saW4pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZ3JlbWxpbi5taXhpbnMpKSB7XG4gICAgcmV0dXJuIGdyZW1saW4ubWl4aW5zO1xuICB9XG5cbiAgcmV0dXJuIGdyZW1saW4ubWl4aW5zID8gW2dyZW1saW4ubWl4aW5zXSA6IFtdO1xufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZVByb3BlcnR5KGdyZW1saW4sIHByb3BlcnR5TmFtZSwgcHJvcGVydHkpIHtcbiAgdmFyIGdyZW1saW5Qcm9wZXJ0eSA9IGdyZW1saW5bcHJvcGVydHlOYW1lXTtcbiAgdmFyIG1vZHVsZVByb3BlcnR5ID0gcHJvcGVydHk7XG4gIHZhciBncmVtbGluUHJvcGVydHlUeXBlID0gdHlwZW9mIGdyZW1saW5Qcm9wZXJ0eSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoZ3JlbWxpblByb3BlcnR5KTtcbiAgdmFyIG1vZHVsZVByb3BlcnR5VHlwZSA9IHR5cGVvZiBtb2R1bGVQcm9wZXJ0eSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YobW9kdWxlUHJvcGVydHkpO1xuICB2YXIgaXNTYW1lUHJvcFR5cGUgPSBncmVtbGluUHJvcGVydHlUeXBlID09PSBtb2R1bGVQcm9wZXJ0eVR5cGU7XG5cbiAgaWYgKGlzU2FtZVByb3BUeXBlICYmIG1vZHVsZVByb3BlcnR5VHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGdyZW1saW5bcHJvcGVydHlOYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ24sIGZ1bmMtbmFtZXNcbiAgICAgIC8vIGNhbGwgdGhlIG1vZHVsZSBmaXJzdFxuICAgICAgdmFyIG1vZHVsZVJlc3VsdCA9IG1vZHVsZVByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB2YXIgZ3JlbWxpblJlc3VsdCA9IGdyZW1saW5Qcm9wZXJ0eS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gb2JqZWN0QXNzaWduKG1vZHVsZVJlc3VsdCwgZ3JlbWxpblJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBbbW9kdWxlUmVzdWx0LCBncmVtbGluUmVzdWx0XTtcbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybiggLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgJ0NhblxcJ3QgZGVjb3JhdGUgZ3JlbWxpbiBwcm9wZXJ0eSAnICsgKCc8JyArIGdyZW1saW4udGFnTmFtZSArICcgLz4jJyArIHByb3BlcnR5TmFtZSArICc6JyArIGdyZW1saW5Qcm9wZXJ0eVR5cGUgKyAnwqsgJykgKyAoJ3dpdGggwrtNb2R1bGUjJyArIHByb3BlcnR5TmFtZSArICc6JyArIG1vZHVsZVByb3BlcnR5VHlwZSArICfCqy4gT25seSBmdW5jdGlvbnMgY2FuIGJlIGRlY29yYXRlZCEnKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWl4aW5Nb2R1bGUoZ3JlbWxpbiwgTW9kdWxlKSB7XG4gIE9iamVjdC5rZXlzKE1vZHVsZSkuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgdmFyIHByb3BlcnR5ID0gTW9kdWxlW3Byb3BlcnR5TmFtZV07XG5cbiAgICBpZiAoZ3JlbWxpbltwcm9wZXJ0eU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNb2R1bGUsIHByb3BlcnR5TmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ3JlbWxpbiwgcHJvcGVydHlOYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVjb3JhdGVQcm9wZXJ0eShncmVtbGluLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5KTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWl4aW5Qcm9wczogZnVuY3Rpb24gbWl4aW5Qcm9wcyhncmVtbGluKSB7XG4gICAgdmFyIG1vZHVsZXMgPSBnZXRNaXhpbnMoZ3JlbWxpbik7XG4gICAgLy8gcmV2ZXJzZSB0aGUgbW9kdWxlcyBhcnJheSB0byBjYWxsIGRlY29yYXRlZCBmdW5jdGlvbnMgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gICAgbW9kdWxlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAoTW9kdWxlKSB7XG4gICAgICByZXR1cm4gbWl4aW5Nb2R1bGUoZ3JlbWxpbiwgTW9kdWxlKTtcbiAgICB9KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmZ1bmN0aW9uIG5vb3AoKSB7fVxudmFyIHR5cGVzID0gWydsb2cnLCAnaW5mbycsICd3YXJuJ107XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgICBpZiAoY29uc29sZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBnbG9iYWwuY29uc29sZSA9IHt9O1xuICAgIH1cbiAgICB0eXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGVbdHlwZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc29sZVt0eXBlXSA9IG5vb3AoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogIyBncmVtbGluLmpzXG4gKiBkZWFkIHNpbXBsZSB3ZWIgY29tcG9uZW50c1xuICpcbiAqICMjIGBncmVtbGluc2BcbiAqIFRoZSBncmVtbGluLmpzIHB1YmxpYyBuYW1lc3BhY2UvbW9kdWxlXG4gKlxuICovXG5cbi8qIVxuICogRGVwZW5kZW5jaWVzXG4gKi9cbnZhciBjb25zb2xlU2hpbSA9IHJlcXVpcmUoJy4vY29uc29sZVNoaW0nKTtcbnZhciBHcmVtbGluID0gcmVxdWlyZSgnLi9HcmVtbGluJyk7XG52YXIgRGF0YSA9IHJlcXVpcmUoJy4vRGF0YScpO1xuXG4vLyBsZXQncyBhZGQgYSBicmFuZGluZyBzbyB3ZSBjYW4ndCBpbmNsdWRlIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2Ugb2YgZ3JlbWxpbi5qc1xudmFyIEJSQU5ESU5HID0gJ2dyZW1saW5zX2Nvbm5lY3RlZCc7XG5cbmlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbQlJBTkRJTkddKSB7XG4gIHRocm93IG5ldyBFcnJvcignWW91IHRyaWVkIHRvIGluY2x1ZGUgZ3JlbWxpbi5qcyBtdWx0aXBsZSB0aW1lcy4gVGhpcyB3aWxsIG5vdCB3b3JrJyk7XG59XG5jb25zb2xlU2hpbS5jcmVhdGUoKTtcblxuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W0JSQU5ESU5HXSA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBncmVtbGluIHNwZWNpZmljYXRpb24uXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqICAgICB2YXIgZ3JlbWxpbnMgPSByZXF1aXJlKCdncmVtbGlucycpO1xuICAgKlxuICAgKiAgICAgZ3JlbWxpbnMuY3JlYXRlKHtcbiAgKiAgICAgICBuYW1lOiAnRm9vJ1xuICAqICAgICB9KTtcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFNwZWMgVGhlIGdyZW1saW4gc3BlY2lmaWNhdGlvblxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBmaW5hbCBzcGVjIGNyZWF0ZWQsIGxhdGVyIHVzZWQgYXMgYSBwcm90b3R5cGUgZm9yIG5ldyBjb21wb25lbnRzIG9mIHRoaXNcbiAgICogdHlwZVxuICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cbiAgY3JlYXRlOiBHcmVtbGluLmNyZWF0ZS5iaW5kKEdyZW1saW4pLFxuICBmaW5kR3JlbWxpbjogZnVuY3Rpb24gZmluZEdyZW1saW4oZWxlbWVudCwgdGltZW91dCkge1xuICAgIHJldHVybiBEYXRhLmdldEdyZW1saW5Bc3luYyhlbGVtZW50LCB0aW1lb3V0KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qIVxuICogVGhlIHJlZ2lzdGVyIGVsZW1lbnQgcG9seWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKlxuICovXG5cbnJlcXVpcmUoJ2RvY3VtZW50LXJlZ2lzdGVyLWVsZW1lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2dyZW1saW5zJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHNlZSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qZWQvOTgyODgzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGIoYSkge1xuICByZXR1cm4gYSA/IChhIF4gTWF0aC5yYW5kb20oKSAqIDE2ID4+IGEgLyA0KS50b1N0cmluZygxNikgOiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgYik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxufTsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ3JlbWxpbnMgICA9IHJlcXVpcmUoJ2dyZW1saW5zJyksXG4gICAgZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pbmRleCcpO1xuXG5kZXNjcmliZSgnZ3JlbWxpbmpzLWRpc3BhdGNoZXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgaXQoJ2F1Z21lbnRzIGdyZW1saW4gaW5zdGFuY2VzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB0aGlzLnRpbWVvdXQoNTAwMCk7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGdyZW1saW5zLmNyZWF0ZSgnaW50ZXJlc3RzLWdyZW1saW4nLCB7XG4gICAgICBtaXhpbnM6IFtkaXNwYXRjaGVyXSxcbiAgICAgIGdldExpc3RlbmVycygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdGT08nOiAnb25Gb28nXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgY3JlYXRlZCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodGhpcy5lbWl0KS50by5iZS5hKCdmdW5jdGlvbicpO1xuICAgICAgICAgIGNvdW50Kys7Ly9kb25lKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkb25lKGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25Gb28oZGF0YSkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4cGVjdChjb3VudCkudG8uZXF1YWwoMyk7XG4gICAgICAgICAgZXhwZWN0KGRhdGEpLnRvLmJlLmFuKCdvYmplY3QnKTtcbiAgICAgICAgICBleHBlY3QoZGF0YS5mb28pLnRvLmVxdWFsKCdmb28nKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGRvbmUsIDUwMCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkb25lKGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBncmVtbGlucy5jcmVhdGUoJ2ludGVyZXN0czItZ3JlbWxpbicsIHtcbiAgICAgIG1peGluczogW2Rpc3BhdGNoZXJdLFxuICAgICAgZ2V0TGlzdGVuZXJzKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ0ZPTyc6ICdvbkZvbydcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBhdHRhY2hlZCgpIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuZW1pdCgnRk9PJywge2ZvbzogJ2Zvbyd9KSwgNTAwKTtcbiAgICAgIH0sXG4gICAgICBvbkZvbygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZGlzcGF0Y2hpbmcgY29tcG9uZW50cyBjYWxsYmFjayBzaG91bGQgbm90IGJlIGNhbGxlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ3JlbWxpbnMuY3JlYXRlKCdpbnRlcmVzdHMzLWdyZW1saW4nLCB7XG4gICAgICBtaXhpbnM6IFtkaXNwYXRjaGVyXSxcbiAgICAgIGdldExpc3RlbmVycygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdGT08nOiAnb25Gb28nXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgY3JlYXRlZCgpIHtcblxuICAgICAgfSxcbiAgICAgIG9uRm9vKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudHMgb3V0c2lkZSB0aGUgZG9tIHNob3VsZCBub3QgYmUgY2FsbGVkJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgZWwgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW50ZXJlc3RzLWdyZW1saW4nKTtcbiAgICB2YXIgZWwyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW50ZXJlc3RzMi1ncmVtbGluJyk7XG4gICAgdmFyIGVsMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0cy1ncmVtbGluJyk7XG4gICAgdmFyIGVsNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0czMtZ3JlbWxpbicpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbDQpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PntcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWw0KTtcbiAgICAgIGVsNCA9IG51bGw7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsMik7XG4gICAgICAgIGVsMiA9IG51bGw7XG4gICAgICAgIGVsNCA9IG51bGw7XG4gICAgICAgIGVsID0gbnVsbDtcbiAgICAgIH0sIDUwMCk7XG4gICAgfSwgNTAwKTtcblxuXG4gIH0pO1xuXG5cbn0pO1xuIl19
