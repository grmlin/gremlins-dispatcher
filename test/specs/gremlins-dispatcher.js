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
  dispatch: function dispatch(handlerName, data, component) {
    if (cache[handlerName] !== undefined) {
      window.setTimeout(function () {
        cache[handlerName].forEach(function (callbackObj) {
          if (callbackObj.component !== component && callbackObj.component.__dispatcherActive) {
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

module.exports = {
  created: function created() {
    this.__dispatcherActive = false;
    addInterests(this);
  },
  attached: function attached() {
    this.__dispatcherActive = true;
  },
  detached: function detached() {
    this.__dispatcherActive = false;
  },
  emit: function emit(eventName, eventData) {
    Emitter.dispatch(eventName, eventData, this);
  }
};
},{}],2:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}],3:[function(require,module,exports){
'use strict';

var uuid = require('./uuid');

var exp = 'gremlins_' + uuid();
var cache = {};
var pendingSearches = [];

var gremlinId = function gremlinId() {
  var id = 1;
  return function () {
    return id++;
  };
}();

var hasId = function hasId(element) {
  return element[exp] !== undefined;
};
var setId = function setId(element) {
  return element[exp] = gremlinId();
}; // eslint-disable-line no-param-reassign
var getId = function getId(element) {
  return hasId(element) ? element[exp] : setId(element);
};

module.exports = {
  addGremlin: function addGremlin(gremlin, element) {
    var id = getId(element);

    if (cache[id] !== undefined) {
      console.warn('You can\'t add another gremlin to this element, it already uses one!', element); // eslint-disable-line no-console, max-len
    } else {
        cache[id] = gremlin;
      }

    pendingSearches = pendingSearches.filter(function (search) {
      var wasSearchedFor = search.element === element;
      if (wasSearchedFor) {
        search.created(gremlin);
      }

      return !wasSearchedFor;
    });
  },
  getGremlin: function getGremlin(element) {
    var id = getId(element);
    var gremlin = cache[id];

    if (gremlin === undefined) {
      // console.warn(`This dom element does not use any gremlins!`, element);
    }
    return gremlin === undefined ? null : gremlin;
  },
  getGremlinAsync: function getGremlinAsync(element) {
    var _this = this;

    var timeout = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return new Promise(function (resolve) {
      var currentGremlin = _this.getGremlin(element);

      if (currentGremlin !== null) {
        resolve(currentGremlin);
      } else {
        (function () {
          var gremlinNotFoundTimeout = timeout !== null ? setTimeout(function () {
            resolve(null);
          }, timeout) : null;

          pendingSearches.push({
            element: element,
            created: function created(createdGremlin) {
              clearTimeout(gremlinNotFoundTimeout);
              resolve(createdGremlin);
            }
          });
        })();
      }
    });
  }
};
},{"./uuid":11}],4:[function(require,module,exports){
"use strict";

module.exports = {
  createInstance: function createInstance(element, Spec) {
    return Object.create(Spec, {
      el: {
        value: element,
        writable: false
      }
    });
  }
};
},{}],5:[function(require,module,exports){
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
},{"./GremlinElement":6,"./Mixins":7}],6:[function(require,module,exports){
'use strict';

var Factory = require('./Factory');
var Data = require('./Data');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

function createInstance(element, Spec) {
  var existingGremlins = Data.getGremlin(element);

  if (existingGremlins === null) {
    var gremlin = Factory.createInstance(element, Spec);
    Data.addGremlin(gremlin, element);

    if (typeof gremlin.initialize === 'function') {
      console.warn('<' + element.tagName + ' />\n' + 'the use of the `initialize` callback of a gremlin component is deprecated. ' + 'Use the `created` callback instead.');
      gremlin.initialize();
    } else {
      gremlin.created();
    }
  } else {
    // console.warn('exisiting gremlin found');
  }
}

function attachInstance(element) {
  var gremlin = Data.getGremlin(element);
  gremlin.attached();
}

function detachInstance(element) {
  var gremlin = Data.getGremlin(element);

  if (typeof gremlin.destroy === 'function') {
    console.warn('<' + element.tagName + ' />\n' + 'the use of the `destroy` callback of a gremlin component is deprecated. Use ' + 'the `detached` callback instead.');
    gremlin.destroy();
  } else {
    gremlin.detached();
  }
}

function updateAttr(element, name, previousValue, value) {
  var gremlin = Data.getGremlin(element);

  if (gremlin !== null) {
    gremlin.attributeDidChange(name, previousValue, value);
  }
}

module.exports = {
  register: function register(tagName, Spec) {
    var proto = {
      createdCallback: {
        value: function value() {
          createInstance(this, Spec);
        }
      },
      attachedCallback: {
        value: function value() {
          attachInstance(this);
        }
      },
      detachedCallback: {
        value: function value() {
          detachInstance(this);
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          updateAttr(this, name, previousValue, _value);
        }
      }
    };

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
},{"./Data":3,"./Factory":4}],7:[function(require,module,exports){
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
},{"object-assign":12}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
},{"./Data":3,"./Gremlin":5,"./consoleShim":8}],10:[function(require,module,exports){
'use strict';

/*!
 * The register element polyfill for older browsers
 *
 */

require('document-register-element');

module.exports = require('./gremlins');
},{"./gremlins":9,"document-register-element":2}],11:[function(require,module,exports){
"use strict";

// see https://gist.github.com/jed/982883
module.exports = function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b); // eslint-disable-line max-len
};
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

},{}],13:[function(require,module,exports){
'use strict';

var gremlins   = require('gremlins'),
    dispatcher = require('../../lib/index');

describe('gremlinjs-dispatcher', function () {

  it('augments gremlin instances', function (done) {
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
      created() {
        window.setTimeout(()=>this.emit('FOO', {foo: 'foo'}), 500);
      },
      onFoo() {
        throw new Error('The dispatching components callback should not be called');
      }
    });

    var el  = document.createElement('interests-gremlin');
    var el2 = document.createElement('interests2-gremlin');
    var el3 = document.createElement('interests-gremlin');
    document.body.appendChild(el);
    document.body.appendChild(el2);
  });


});

},{"../../lib/index":1,"gremlins":10}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudC9idWlsZC9kb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9EYXRhLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9GYWN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvTWl4aW5zLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9jb25zb2xlU2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvZ3JlbWxpbnMuanMiLCJub2RlX21vZHVsZXMvZ3JlbWxpbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi91dWlkLmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ0ZXN0L3NyYy9ncmVtbGlucy1kaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWNoZSA9IHt9O1xuXG52YXIgRW1pdHRlciA9IHtcbiAgcmVnaXN0ZXJIYW5kbGVyOiBmdW5jdGlvbiByZWdpc3RlckhhbmRsZXIoaGFuZGxlck5hbWUsIGhhbmRsZXIsIGNvbXBvbmVudCkge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCc8JyArIGNvbXBvbmVudC5uYW1lICsgJyAvPiDigJQgSGFuZGxlciBmb3IgdGhlIGludGVyZXN0ICcgKyBoYW5kbGVyTmFtZSArICcgaXMgbWlzc2luZyEnKTtcbiAgICB9XG4gICAgY2FjaGVbaGFuZGxlck5hbWVdID0gY2FjaGVbaGFuZGxlck5hbWVdIHx8IFtdO1xuICAgIGNhY2hlW2hhbmRsZXJOYW1lXS5wdXNoKHtcbiAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICBjb21wb25lbnQ6IGNvbXBvbmVudFxuICAgIH0pO1xuICB9LFxuICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goaGFuZGxlck5hbWUsIGRhdGEsIGNvbXBvbmVudCkge1xuICAgIGlmIChjYWNoZVtoYW5kbGVyTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjYWNoZVtoYW5kbGVyTmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2tPYmopIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tPYmouY29tcG9uZW50ICE9PSBjb21wb25lbnQgJiYgY2FsbGJhY2tPYmouY29tcG9uZW50Ll9fZGlzcGF0Y2hlckFjdGl2ZSkge1xuICAgICAgICAgICAgY2FsbGJhY2tPYmouaGFuZGxlci5jYWxsKGNhbGxiYWNrT2JqLmNvbXBvbmVudCwgZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sIDEwKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFkZEludGVyZXN0cyhjb21wb25lbnQpIHtcbiAgdmFyIGxpc3RlbmVycyA9IHR5cGVvZiBjb21wb25lbnQuZ2V0TGlzdGVuZXJzID09PSAnZnVuY3Rpb24nID8gY29tcG9uZW50LmdldExpc3RlbmVycygpIDoge307XG5cbiAgZm9yICh2YXIgaGFuZGxlciBpbiBsaXN0ZW5lcnMpIHtcbiAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGhhbmRsZXIpKSB7XG4gICAgICBFbWl0dGVyLnJlZ2lzdGVySGFuZGxlcihoYW5kbGVyLCBjb21wb25lbnRbbGlzdGVuZXJzW2hhbmRsZXJdXSwgY29tcG9uZW50KTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQoKSB7XG4gICAgdGhpcy5fX2Rpc3BhdGNoZXJBY3RpdmUgPSBmYWxzZTtcbiAgICBhZGRJbnRlcmVzdHModGhpcyk7XG4gIH0sXG4gIGF0dGFjaGVkOiBmdW5jdGlvbiBhdHRhY2hlZCgpIHtcbiAgICB0aGlzLl9fZGlzcGF0Y2hlckFjdGl2ZSA9IHRydWU7XG4gIH0sXG4gIGRldGFjaGVkOiBmdW5jdGlvbiBkZXRhY2hlZCgpIHtcbiAgICB0aGlzLl9fZGlzcGF0Y2hlckFjdGl2ZSA9IGZhbHNlO1xuICB9LFxuICBlbWl0OiBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XG4gICAgRW1pdHRlci5kaXNwYXRjaChldmVudE5hbWUsIGV2ZW50RGF0YSwgdGhpcyk7XG4gIH1cbn07IiwiLyohIChDKSBXZWJSZWZsZWN0aW9uIE1pdCBTdHlsZSBMaWNlbnNlICovXG4oZnVuY3Rpb24oZSx0LG4scil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcnQoZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjtuKyspdnQoZVtuXSx0KX1mdW5jdGlvbiBpdChlKXtmb3IodmFyIHQ9MCxuPWUubGVuZ3RoLHI7dDxuO3QrKylyPWVbdF0sbnQocixiW290KHIpXSl9ZnVuY3Rpb24gc3QoZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe2oodCkmJih2dCh0LGUpLHJ0KHQucXVlcnlTZWxlY3RvckFsbCh3KSxlKSl9fWZ1bmN0aW9uIG90KGUpe3ZhciB0PWUuZ2V0QXR0cmlidXRlKFwiaXNcIiksbj1lLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkscj1TLmNhbGwoeSx0P3YrdC50b1VwcGVyQ2FzZSgpOmQrbik7cmV0dXJuIHQmJi0xPHImJiF1dChuLHQpPy0xOnJ9ZnVuY3Rpb24gdXQoZSx0KXtyZXR1cm4tMTx3LmluZGV4T2YoZSsnW2lzPVwiJyt0KydcIl0nKX1mdW5jdGlvbiBhdChlKXt2YXIgdD1lLmN1cnJlbnRUYXJnZXQsbj1lLmF0dHJDaGFuZ2Uscj1lLmF0dHJOYW1lLGk9ZS50YXJnZXQ7USYmKCFpfHxpPT09dCkmJnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiZyIT09XCJzdHlsZVwiJiZlLnByZXZWYWx1ZSE9PWUubmV3VmFsdWUmJnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHIsbj09PWVbYV0/bnVsbDplLnByZXZWYWx1ZSxuPT09ZVtsXT9udWxsOmUubmV3VmFsdWUpfWZ1bmN0aW9uIGZ0KGUpe3ZhciB0PXN0KGUpO3JldHVybiBmdW5jdGlvbihlKXtYLnB1c2godCxlLnRhcmdldCl9fWZ1bmN0aW9uIGx0KGUpe0smJihLPSExLGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGgsbHQpKSxydCgoZS50YXJnZXR8fHQpLnF1ZXJ5U2VsZWN0b3JBbGwodyksZS5kZXRhaWw9PT1vP286cyksQiYmcHQoKX1mdW5jdGlvbiBjdChlLHQpe3ZhciBuPXRoaXM7cS5jYWxsKG4sZSx0KSxHLmNhbGwobix7dGFyZ2V0Om59KX1mdW5jdGlvbiBodChlLHQpe0QoZSx0KSxldD9ldC5vYnNlcnZlKGUseik6KEomJihlLnNldEF0dHJpYnV0ZT1jdCxlW2ldPVooZSksZS5hZGRFdmVudExpc3RlbmVyKHAsRykpLGUuYWRkRXZlbnRMaXN0ZW5lcihjLGF0KSksZS5jcmVhdGVkQ2FsbGJhY2smJlEmJihlLmNyZWF0ZWQ9ITAsZS5jcmVhdGVkQ2FsbGJhY2soKSxlLmNyZWF0ZWQ9ITEpfWZ1bmN0aW9uIHB0KCl7Zm9yKHZhciBlLHQ9MCxuPUYubGVuZ3RoO3Q8bjt0KyspZT1GW3RdLEUuY29udGFpbnMoZSl8fChuLS0sRi5zcGxpY2UodC0tLDEpLHZ0KGUsbykpfWZ1bmN0aW9uIGR0KGUpe3Rocm93IG5ldyBFcnJvcihcIkEgXCIrZStcIiB0eXBlIGlzIGFscmVhZHkgcmVnaXN0ZXJlZFwiKX1mdW5jdGlvbiB2dChlLHQpe3ZhciBuLHI9b3QoZSk7LTE8ciYmKHR0KGUsYltyXSkscj0wLHQ9PT1zJiYhZVtzXT8oZVtvXT0hMSxlW3NdPSEwLHI9MSxCJiZTLmNhbGwoRixlKTwwJiZGLnB1c2goZSkpOnQ9PT1vJiYhZVtvXSYmKGVbc109ITEsZVtvXT0hMCxyPTEpLHImJihuPWVbdCtcIkNhbGxiYWNrXCJdKSYmbi5jYWxsKGUpKX1pZihyIGluIHQpcmV0dXJuO3ZhciBpPVwiX19cIityKyhNYXRoLnJhbmRvbSgpKjFlNT4+MCkscz1cImF0dGFjaGVkXCIsbz1cImRldGFjaGVkXCIsdT1cImV4dGVuZHNcIixhPVwiQURESVRJT05cIixmPVwiTU9ESUZJQ0FUSU9OXCIsbD1cIlJFTU9WQUxcIixjPVwiRE9NQXR0ck1vZGlmaWVkXCIsaD1cIkRPTUNvbnRlbnRMb2FkZWRcIixwPVwiRE9NU3VidHJlZU1vZGlmaWVkXCIsZD1cIjxcIix2PVwiPVwiLG09L15bQS1aXVtBLVowLTldKig/Oi1bQS1aMC05XSspKyQvLGc9W1wiQU5OT1RBVElPTi1YTUxcIixcIkNPTE9SLVBST0ZJTEVcIixcIkZPTlQtRkFDRVwiLFwiRk9OVC1GQUNFLVNSQ1wiLFwiRk9OVC1GQUNFLVVSSVwiLFwiRk9OVC1GQUNFLUZPUk1BVFwiLFwiRk9OVC1GQUNFLU5BTUVcIixcIk1JU1NJTkctR0xZUEhcIl0seT1bXSxiPVtdLHc9XCJcIixFPXQuZG9jdW1lbnRFbGVtZW50LFM9eS5pbmRleE9mfHxmdW5jdGlvbihlKXtmb3IodmFyIHQ9dGhpcy5sZW5ndGg7dC0tJiZ0aGlzW3RdIT09ZTspO3JldHVybiB0fSx4PW4ucHJvdG90eXBlLFQ9eC5oYXNPd25Qcm9wZXJ0eSxOPXguaXNQcm90b3R5cGVPZixDPW4uZGVmaW5lUHJvcGVydHksaz1uLmdldE93blByb3BlcnR5RGVzY3JpcHRvcixMPW4uZ2V0T3duUHJvcGVydHlOYW1lcyxBPW4uZ2V0UHJvdG90eXBlT2YsTz1uLnNldFByb3RvdHlwZU9mLE09ISFuLl9fcHJvdG9fXyxfPW4uY3JlYXRlfHxmdW5jdGlvbiBtdChlKXtyZXR1cm4gZT8obXQucHJvdG90eXBlPWUsbmV3IG10KTp0aGlzfSxEPU98fChNP2Z1bmN0aW9uKGUsdCl7cmV0dXJuIGUuX19wcm90b19fPXQsZX06TCYmaz9mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSx0KXtmb3IodmFyIG4scj1MKHQpLGk9MCxzPXIubGVuZ3RoO2k8cztpKyspbj1yW2ldLFQuY2FsbChlLG4pfHxDKGUsbixrKHQsbikpfXJldHVybiBmdW5jdGlvbih0LG4pe2RvIGUodCxuKTt3aGlsZSgobj1BKG4pKSYmIU4uY2FsbChuLHQpKTtyZXR1cm4gdH19KCk6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4gaW4gdCllW25dPXRbbl07cmV0dXJuIGV9KSxQPWUuTXV0YXRpb25PYnNlcnZlcnx8ZS5XZWJLaXRNdXRhdGlvbk9ic2VydmVyLEg9KGUuSFRNTEVsZW1lbnR8fGUuRWxlbWVudHx8ZS5Ob2RlKS5wcm90b3R5cGUsQj0hTi5jYWxsKEgsRSksaj1CP2Z1bmN0aW9uKGUpe3JldHVybiBlLm5vZGVUeXBlPT09MX06ZnVuY3Rpb24oZSl7cmV0dXJuIE4uY2FsbChILGUpfSxGPUImJltdLEk9SC5jbG9uZU5vZGUscT1ILnNldEF0dHJpYnV0ZSxSPUgucmVtb3ZlQXR0cmlidXRlLFU9dC5jcmVhdGVFbGVtZW50LHo9UCYme2F0dHJpYnV0ZXM6ITAsY2hhcmFjdGVyRGF0YTohMCxhdHRyaWJ1dGVPbGRWYWx1ZTohMH0sVz1QfHxmdW5jdGlvbihlKXtKPSExLEUucmVtb3ZlRXZlbnRMaXN0ZW5lcihjLFcpfSxYLFY9ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tc1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oZSl7c2V0VGltZW91dChlLDEwKX0sJD0hMSxKPSEwLEs9ITAsUT0hMCxHLFksWixldCx0dCxudDtPfHxNPyh0dD1mdW5jdGlvbihlLHQpe04uY2FsbCh0LGUpfHxodChlLHQpfSxudD1odCk6KHR0PWZ1bmN0aW9uKGUsdCl7ZVtpXXx8KGVbaV09bighMCksaHQoZSx0KSl9LG50PXR0KSxCPyhKPSExLGZ1bmN0aW9uKCl7dmFyIGU9ayhILFwiYWRkRXZlbnRMaXN0ZW5lclwiKSx0PWUudmFsdWUsbj1mdW5jdGlvbihlKXt2YXIgdD1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pO3QuYXR0ck5hbWU9ZSx0LnByZXZWYWx1ZT10aGlzLmdldEF0dHJpYnV0ZShlKSx0Lm5ld1ZhbHVlPW51bGwsdFtsXT10LmF0dHJDaGFuZ2U9MixSLmNhbGwodGhpcyxlKSx0aGlzLmRpc3BhdGNoRXZlbnQodCl9LHI9ZnVuY3Rpb24oZSx0KXt2YXIgbj10aGlzLmhhc0F0dHJpYnV0ZShlKSxyPW4mJnRoaXMuZ2V0QXR0cmlidXRlKGUpLGk9bmV3IEN1c3RvbUV2ZW50KGMse2J1YmJsZXM6ITB9KTtxLmNhbGwodGhpcyxlLHQpLGkuYXR0ck5hbWU9ZSxpLnByZXZWYWx1ZT1uP3I6bnVsbCxpLm5ld1ZhbHVlPXQsbj9pW2ZdPWkuYXR0ckNoYW5nZT0xOmlbYV09aS5hdHRyQ2hhbmdlPTAsdGhpcy5kaXNwYXRjaEV2ZW50KGkpfSxzPWZ1bmN0aW9uKGUpe3ZhciB0PWUuY3VycmVudFRhcmdldCxuPXRbaV0scj1lLnByb3BlcnR5TmFtZSxzO24uaGFzT3duUHJvcGVydHkocikmJihuPW5bcl0scz1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pLHMuYXR0ck5hbWU9bi5uYW1lLHMucHJldlZhbHVlPW4udmFsdWV8fG51bGwscy5uZXdWYWx1ZT1uLnZhbHVlPXRbcl18fG51bGwscy5wcmV2VmFsdWU9PW51bGw/c1thXT1zLmF0dHJDaGFuZ2U9MDpzW2ZdPXMuYXR0ckNoYW5nZT0xLHQuZGlzcGF0Y2hFdmVudChzKSl9O2UudmFsdWU9ZnVuY3Rpb24oZSxvLHUpe2U9PT1jJiZ0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmdGhpcy5zZXRBdHRyaWJ1dGUhPT1yJiYodGhpc1tpXT17Y2xhc3NOYW1lOntuYW1lOlwiY2xhc3NcIix2YWx1ZTp0aGlzLmNsYXNzTmFtZX19LHRoaXMuc2V0QXR0cmlidXRlPXIsdGhpcy5yZW1vdmVBdHRyaWJ1dGU9bix0LmNhbGwodGhpcyxcInByb3BlcnR5Y2hhbmdlXCIscykpLHQuY2FsbCh0aGlzLGUsbyx1KX0sQyhILFwiYWRkRXZlbnRMaXN0ZW5lclwiLGUpfSgpKTpQfHwoRS5hZGRFdmVudExpc3RlbmVyKGMsVyksRS5zZXRBdHRyaWJ1dGUoaSwxKSxFLnJlbW92ZUF0dHJpYnV0ZShpKSxKJiYoRz1mdW5jdGlvbihlKXt2YXIgdD10aGlzLG4scixzO2lmKHQ9PT1lLnRhcmdldCl7bj10W2ldLHRbaV09cj1aKHQpO2ZvcihzIGluIHIpe2lmKCEocyBpbiBuKSlyZXR1cm4gWSgwLHQscyxuW3NdLHJbc10sYSk7aWYocltzXSE9PW5bc10pcmV0dXJuIFkoMSx0LHMsbltzXSxyW3NdLGYpfWZvcihzIGluIG4paWYoIShzIGluIHIpKXJldHVybiBZKDIsdCxzLG5bc10scltzXSxsKX19LFk9ZnVuY3Rpb24oZSx0LG4scixpLHMpe3ZhciBvPXthdHRyQ2hhbmdlOmUsY3VycmVudFRhcmdldDp0LGF0dHJOYW1lOm4scHJldlZhbHVlOnIsbmV3VmFsdWU6aX07b1tzXT1lLGF0KG8pfSxaPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdCxuLHI9e30saT1lLmF0dHJpYnV0ZXMscz0wLG89aS5sZW5ndGg7czxvO3MrKyl0PWlbc10sbj10Lm5hbWUsbiE9PVwic2V0QXR0cmlidXRlXCImJihyW25dPXQudmFsdWUpO3JldHVybiByfSkpLHRbcl09ZnVuY3Rpb24obixyKXtjPW4udG9VcHBlckNhc2UoKSwkfHwoJD0hMCxQPyhldD1mdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjt0KGVbbisrXSkpO31yZXR1cm4gbmV3IFAoZnVuY3Rpb24ocil7Zm9yKHZhciBpLHMsbyx1PTAsYT1yLmxlbmd0aDt1PGE7dSsrKWk9clt1XSxpLnR5cGU9PT1cImNoaWxkTGlzdFwiPyhuKGkuYWRkZWROb2RlcyxlKSxuKGkucmVtb3ZlZE5vZGVzLHQpKToocz1pLnRhcmdldCxRJiZzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmaS5hdHRyaWJ1dGVOYW1lIT09XCJzdHlsZVwiJiYobz1zLmdldEF0dHJpYnV0ZShpLmF0dHJpYnV0ZU5hbWUpLG8hPT1pLm9sZFZhbHVlJiZzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhpLmF0dHJpYnV0ZU5hbWUsaS5vbGRWYWx1ZSxvKSkpfSl9KHN0KHMpLHN0KG8pKSxldC5vYnNlcnZlKHQse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSkpOihYPVtdLFYoZnVuY3Rpb24gRSgpe3doaWxlKFgubGVuZ3RoKVguc2hpZnQoKS5jYWxsKG51bGwsWC5zaGlmdCgpKTtWKEUpfSksdC5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZUluc2VydGVkXCIsZnQocykpLHQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVSZW1vdmVkXCIsZnQobykpKSx0LmFkZEV2ZW50TGlzdGVuZXIoaCxsdCksdC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLGx0KSx0LmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24oZSxuKXt2YXIgcj1VLmFwcGx5KHQsYXJndW1lbnRzKSxpPVwiXCIrZSxzPVMuY2FsbCh5LChuP3Y6ZCkrKG58fGkpLnRvVXBwZXJDYXNlKCkpLG89LTE8cztyZXR1cm4gbiYmKHIuc2V0QXR0cmlidXRlKFwiaXNcIixuPW4udG9Mb3dlckNhc2UoKSksbyYmKG89dXQoaS50b1VwcGVyQ2FzZSgpLG4pKSksUT0hdC5jcmVhdGVFbGVtZW50LmlubmVySFRNTEhlbHBlcixvJiZudChyLGJbc10pLHJ9LEguY2xvbmVOb2RlPWZ1bmN0aW9uKGUpe3ZhciB0PUkuY2FsbCh0aGlzLCEhZSksbj1vdCh0KTtyZXR1cm4tMTxuJiZudCh0LGJbbl0pLGUmJml0KHQucXVlcnlTZWxlY3RvckFsbCh3KSksdH0pLC0yPFMuY2FsbCh5LHYrYykrUy5jYWxsKHksZCtjKSYmZHQobik7aWYoIW0udGVzdChjKXx8LTE8Uy5jYWxsKGcsYykpdGhyb3cgbmV3IEVycm9yKFwiVGhlIHR5cGUgXCIrbitcIiBpcyBpbnZhbGlkXCIpO3ZhciBpPWZ1bmN0aW9uKCl7cmV0dXJuIGY/dC5jcmVhdGVFbGVtZW50KGwsYyk6dC5jcmVhdGVFbGVtZW50KGwpfSxhPXJ8fHgsZj1ULmNhbGwoYSx1KSxsPWY/clt1XS50b1VwcGVyQ2FzZSgpOmMsYyxwO3JldHVybiBmJiYtMTxTLmNhbGwoeSxkK2wpJiZkdChsKSxwPXkucHVzaCgoZj92OmQpK2MpLTEsdz13LmNvbmNhdCh3Lmxlbmd0aD9cIixcIjpcIlwiLGY/bCsnW2lzPVwiJytuLnRvTG93ZXJDYXNlKCkrJ1wiXSc6bCksaS5wcm90b3R5cGU9YltwXT1ULmNhbGwoYSxcInByb3RvdHlwZVwiKT9hLnByb3RvdHlwZTpfKEgpLHJ0KHQucXVlcnlTZWxlY3RvckFsbCh3KSxzKSxpfX0pKHdpbmRvdyxkb2N1bWVudCxPYmplY3QsXCJyZWdpc3RlckVsZW1lbnRcIik7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXVpZCA9IHJlcXVpcmUoJy4vdXVpZCcpO1xuXG52YXIgZXhwID0gJ2dyZW1saW5zXycgKyB1dWlkKCk7XG52YXIgY2FjaGUgPSB7fTtcbnZhciBwZW5kaW5nU2VhcmNoZXMgPSBbXTtcblxudmFyIGdyZW1saW5JZCA9IGZ1bmN0aW9uIGdyZW1saW5JZCgpIHtcbiAgdmFyIGlkID0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaWQrKztcbiAgfTtcbn0oKTtcblxudmFyIGhhc0lkID0gZnVuY3Rpb24gaGFzSWQoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudFtleHBdICE9PSB1bmRlZmluZWQ7XG59O1xudmFyIHNldElkID0gZnVuY3Rpb24gc2V0SWQoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudFtleHBdID0gZ3JlbWxpbklkKCk7XG59OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG52YXIgZ2V0SWQgPSBmdW5jdGlvbiBnZXRJZChlbGVtZW50KSB7XG4gIHJldHVybiBoYXNJZChlbGVtZW50KSA/IGVsZW1lbnRbZXhwXSA6IHNldElkKGVsZW1lbnQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZEdyZW1saW46IGZ1bmN0aW9uIGFkZEdyZW1saW4oZ3JlbWxpbiwgZWxlbWVudCkge1xuICAgIHZhciBpZCA9IGdldElkKGVsZW1lbnQpO1xuXG4gICAgaWYgKGNhY2hlW2lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1lvdSBjYW5cXCd0IGFkZCBhbm90aGVyIGdyZW1saW4gdG8gdGhpcyBlbGVtZW50LCBpdCBhbHJlYWR5IHVzZXMgb25lIScsIGVsZW1lbnQpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsIG1heC1sZW5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjYWNoZVtpZF0gPSBncmVtbGluO1xuICAgICAgfVxuXG4gICAgcGVuZGluZ1NlYXJjaGVzID0gcGVuZGluZ1NlYXJjaGVzLmZpbHRlcihmdW5jdGlvbiAoc2VhcmNoKSB7XG4gICAgICB2YXIgd2FzU2VhcmNoZWRGb3IgPSBzZWFyY2guZWxlbWVudCA9PT0gZWxlbWVudDtcbiAgICAgIGlmICh3YXNTZWFyY2hlZEZvcikge1xuICAgICAgICBzZWFyY2guY3JlYXRlZChncmVtbGluKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICF3YXNTZWFyY2hlZEZvcjtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0R3JlbWxpbjogZnVuY3Rpb24gZ2V0R3JlbWxpbihlbGVtZW50KSB7XG4gICAgdmFyIGlkID0gZ2V0SWQoZWxlbWVudCk7XG4gICAgdmFyIGdyZW1saW4gPSBjYWNoZVtpZF07XG5cbiAgICBpZiAoZ3JlbWxpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oYFRoaXMgZG9tIGVsZW1lbnQgZG9lcyBub3QgdXNlIGFueSBncmVtbGlucyFgLCBlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGdyZW1saW4gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBncmVtbGluO1xuICB9LFxuICBnZXRHcmVtbGluQXN5bmM6IGZ1bmN0aW9uIGdldEdyZW1saW5Bc3luYyhlbGVtZW50KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciB0aW1lb3V0ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgdmFyIGN1cnJlbnRHcmVtbGluID0gX3RoaXMuZ2V0R3JlbWxpbihlbGVtZW50KTtcblxuICAgICAgaWYgKGN1cnJlbnRHcmVtbGluICE9PSBudWxsKSB7XG4gICAgICAgIHJlc29sdmUoY3VycmVudEdyZW1saW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgZ3JlbWxpbk5vdEZvdW5kVGltZW91dCA9IHRpbWVvdXQgIT09IG51bGwgPyBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgfSwgdGltZW91dCkgOiBudWxsO1xuXG4gICAgICAgICAgcGVuZGluZ1NlYXJjaGVzLnB1c2goe1xuICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uIGNyZWF0ZWQoY3JlYXRlZEdyZW1saW4pIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGdyZW1saW5Ob3RGb3VuZFRpbWVvdXQpO1xuICAgICAgICAgICAgICByZXNvbHZlKGNyZWF0ZWRHcmVtbGluKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZUluc3RhbmNlOiBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShlbGVtZW50LCBTcGVjKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoU3BlYywge1xuICAgICAgZWw6IHtcbiAgICAgICAgdmFsdWU6IGVsZW1lbnQsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1peGlucyA9IHJlcXVpcmUoJy4vTWl4aW5zJyk7XG52YXIgR3JlbWxpbkVsZW1lbnQgPSByZXF1aXJlKCcuL0dyZW1saW5FbGVtZW50Jyk7XG5cbi8qKlxuICogIyMgYEdyZW1saW5gXG4gKiBUaGUgYmFzZSBwcm90b3R5cGUgdXNlZCBmb3IgYWxsIGdyZW1saW4gY29tcG9uZW50cy9zcGVjc1xuICpcbiAqXG4gKi9cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc291cmNlcyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBzb3VyY2VzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3ApO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyohXG4gKiBBbGwgdGhlIFNwZWNzIGFscmVhZHkgYWRkZWQuXG4gKlxuICogVXNlZCB0byBkZXRlY3QgbXVsdGkgYWRkc1xuICovXG52YXIgc3BlY01hcCA9IHt9O1xuXG52YXIgYWRkU3BlYyA9IGZ1bmN0aW9uIGFkZFNwZWModGFnTmFtZSwgU3BlYykge1xuICByZXR1cm4gc3BlY01hcFt0YWdOYW1lXSA9IFNwZWM7XG59O1xudmFyIGhhc1NwZWMgPSBmdW5jdGlvbiBoYXNTcGVjKHRhZ05hbWUpIHtcbiAgcmV0dXJuIHNwZWNNYXBbdGFnTmFtZV0gIT09IHVuZGVmaW5lZDtcbn07XG5cbnZhciBHcmVtbGluID0ge1xuICBjcmVhdGVkOiBmdW5jdGlvbiBjcmVhdGVkKCkge30sXG4gIGF0dGFjaGVkOiBmdW5jdGlvbiBhdHRhY2hlZCgpIHt9LFxuICBkZXRhY2hlZDogZnVuY3Rpb24gZGV0YWNoZWQoKSB7fSxcbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUodGFnTmFtZSkge1xuICAgIHZhciBTcGVjID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIgUGFyZW50ID0gdGhpcztcbiAgICB2YXIgTmV3U3BlYyA9IE9iamVjdC5jcmVhdGUoUGFyZW50LCB7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHZhbHVlOiB0YWdOYW1lLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiB0YWdOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignR3JlbWxpbnMuY3JlYXRlIGV4cGVjdHMgdGhlIGdyZW1saW5zIHRhZyBuYW1lIGFzIGEgZmlyc3QgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGhhc1NwZWModGFnTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGFkZCBuZXcgR3JlbWxpbiBzcGVjLCBidXQgYSBzcGVjIGZvciAnICsgdGFnTmFtZSArICcgYWxyZWFkeSBleGlzdHMuJyk7XG4gICAgfVxuICAgIGlmIChTcGVjLmNyZWF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgJ1lvdSBhcmUgcmVwbGFjaW5nIHRoZSBvcmlnaW5hbCBjcmVhdGUgbWV0aG9kIGZvciB0aGUgc3BlYyBvZiAnICsgdGFnTmFtZSArICcuIFlvdSBrbm93IHdoYXQgJyArICd5b3VcXCdyZSBkb2luZywgcmlnaHQ/Jyk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW5cbiAgICBleHRlbmQoTmV3U3BlYywgU3BlYyk7XG4gICAgLy8gZXh0ZW5kIHRoZSBzcGVjIHdpdGggaXQncyBNaXhpbnNcbiAgICBNaXhpbnMubWl4aW5Qcm9wcyhOZXdTcGVjKTtcbiAgICAvLyByZW1lbWJlciB0aGlzIG5hbWVcbiAgICBhZGRTcGVjKHRhZ05hbWUsIE5ld1NwZWMpO1xuICAgIC8vIGFuZCBjcmVhdGUgdGhlIGN1c3RvbSBlbGVtZW50IGZvciBpdFxuICAgIEdyZW1saW5FbGVtZW50LnJlZ2lzdGVyKHRhZ05hbWUsIE5ld1NwZWMpO1xuICAgIHJldHVybiBOZXdTcGVjO1xuICB9LFxuICBhdHRyaWJ1dGVEaWRDaGFuZ2U6IGZ1bmN0aW9uIGF0dHJpYnV0ZURpZENoYW5nZSgpIHt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyZW1saW47IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRmFjdG9yeSA9IHJlcXVpcmUoJy4vRmFjdG9yeScpO1xudmFyIERhdGEgPSByZXF1aXJlKCcuL0RhdGEnKTtcblxudmFyIGNhblJlZ2lzdGVyRWxlbWVudHMgPSB0eXBlb2YgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50ID09PSAnZnVuY3Rpb24nO1xuXG5pZiAoIWNhblJlZ2lzdGVyRWxlbWVudHMpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdyZWdpc3RlckVsZW1lbnQgbm90IGF2YWlsYWJsZS4gRGlkIHlvdSBpbmNsdWRlIHRoZSBwb2x5ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnM/Jyk7XG59XG5cbnZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xudmFyIHN0eWxlU2hlZXQgPSB1bmRlZmluZWQ7XG5cbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbnN0eWxlU2hlZXQgPSBzdHlsZUVsZW1lbnQuc2hlZXQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIFNwZWMpIHtcbiAgdmFyIGV4aXN0aW5nR3JlbWxpbnMgPSBEYXRhLmdldEdyZW1saW4oZWxlbWVudCk7XG5cbiAgaWYgKGV4aXN0aW5nR3JlbWxpbnMgPT09IG51bGwpIHtcbiAgICB2YXIgZ3JlbWxpbiA9IEZhY3RvcnkuY3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgU3BlYyk7XG4gICAgRGF0YS5hZGRHcmVtbGluKGdyZW1saW4sIGVsZW1lbnQpO1xuXG4gICAgaWYgKHR5cGVvZiBncmVtbGluLmluaXRpYWxpemUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignPCcgKyBlbGVtZW50LnRhZ05hbWUgKyAnIC8+XFxuJyArICd0aGUgdXNlIG9mIHRoZSBgaW5pdGlhbGl6ZWAgY2FsbGJhY2sgb2YgYSBncmVtbGluIGNvbXBvbmVudCBpcyBkZXByZWNhdGVkLiAnICsgJ1VzZSB0aGUgYGNyZWF0ZWRgIGNhbGxiYWNrIGluc3RlYWQuJyk7XG4gICAgICBncmVtbGluLmluaXRpYWxpemUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JlbWxpbi5jcmVhdGVkKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGNvbnNvbGUud2FybignZXhpc2l0aW5nIGdyZW1saW4gZm91bmQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhdHRhY2hJbnN0YW5jZShlbGVtZW50KSB7XG4gIHZhciBncmVtbGluID0gRGF0YS5nZXRHcmVtbGluKGVsZW1lbnQpO1xuICBncmVtbGluLmF0dGFjaGVkKCk7XG59XG5cbmZ1bmN0aW9uIGRldGFjaEluc3RhbmNlKGVsZW1lbnQpIHtcbiAgdmFyIGdyZW1saW4gPSBEYXRhLmdldEdyZW1saW4oZWxlbWVudCk7XG5cbiAgaWYgKHR5cGVvZiBncmVtbGluLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLndhcm4oJzwnICsgZWxlbWVudC50YWdOYW1lICsgJyAvPlxcbicgKyAndGhlIHVzZSBvZiB0aGUgYGRlc3Ryb3lgIGNhbGxiYWNrIG9mIGEgZ3JlbWxpbiBjb21wb25lbnQgaXMgZGVwcmVjYXRlZC4gVXNlICcgKyAndGhlIGBkZXRhY2hlZGAgY2FsbGJhY2sgaW5zdGVhZC4nKTtcbiAgICBncmVtbGluLmRlc3Ryb3koKTtcbiAgfSBlbHNlIHtcbiAgICBncmVtbGluLmRldGFjaGVkKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cihlbGVtZW50LCBuYW1lLCBwcmV2aW91c1ZhbHVlLCB2YWx1ZSkge1xuICB2YXIgZ3JlbWxpbiA9IERhdGEuZ2V0R3JlbWxpbihlbGVtZW50KTtcblxuICBpZiAoZ3JlbWxpbiAhPT0gbnVsbCkge1xuICAgIGdyZW1saW4uYXR0cmlidXRlRGlkQ2hhbmdlKG5hbWUsIHByZXZpb3VzVmFsdWUsIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyKHRhZ05hbWUsIFNwZWMpIHtcbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBjcmVhdGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgIGNyZWF0ZUluc3RhbmNlKHRoaXMsIFNwZWMpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgICAgYXR0YWNoSW5zdGFuY2UodGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZXRhY2hlZENhbGxiYWNrOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgICBkZXRhY2hJbnN0YW5jZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmFtZSwgcHJldmlvdXNWYWx1ZSwgX3ZhbHVlKSB7XG4gICAgICAgICAgdXBkYXRlQXR0cih0aGlzLCBuYW1lLCBwcmV2aW91c1ZhbHVlLCBfdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIGluc2VydCB0aGUgcnVsZSBCRUZPUkUgcmVnaXN0ZXJpbmcgdGhlIGVsZW1lbnQuIFRoaXMgaXMgaW1wb3J0YW50IGJlY2F1c2UgdGhleSBtYXkgYmUgaW5saW5lXG4gICAgLy8gb3RoZXJ3aXNlIHdoZW4gZmlyc3QgaW5pdGlhbGl6ZWQuXG4gICAgc3R5bGVTaGVldC5pbnNlcnRSdWxlKHRhZ05hbWUgKyAnIHsgZGlzcGxheTogYmxvY2sgfScsIDApO1xuXG4gICAgdmFyIEVsID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIHtcbiAgICAgIG5hbWU6IHRhZ05hbWUsXG4gICAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCBwcm90bylcbiAgICB9KTtcblxuICAgIHJldHVybiBFbDtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5mdW5jdGlvbiBnZXRNaXhpbnMoZ3JlbWxpbikge1xuICBpZiAoQXJyYXkuaXNBcnJheShncmVtbGluLm1peGlucykpIHtcbiAgICByZXR1cm4gZ3JlbWxpbi5taXhpbnM7XG4gIH1cblxuICByZXR1cm4gZ3JlbWxpbi5taXhpbnMgPyBbZ3JlbWxpbi5taXhpbnNdIDogW107XG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlUHJvcGVydHkoZ3JlbWxpbiwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eSkge1xuICB2YXIgZ3JlbWxpblByb3BlcnR5ID0gZ3JlbWxpbltwcm9wZXJ0eU5hbWVdO1xuICB2YXIgbW9kdWxlUHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgdmFyIGdyZW1saW5Qcm9wZXJ0eVR5cGUgPSB0eXBlb2YgZ3JlbWxpblByb3BlcnR5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihncmVtbGluUHJvcGVydHkpO1xuICB2YXIgbW9kdWxlUHJvcGVydHlUeXBlID0gdHlwZW9mIG1vZHVsZVByb3BlcnR5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihtb2R1bGVQcm9wZXJ0eSk7XG4gIHZhciBpc1NhbWVQcm9wVHlwZSA9IGdyZW1saW5Qcm9wZXJ0eVR5cGUgPT09IG1vZHVsZVByb3BlcnR5VHlwZTtcblxuICBpZiAoaXNTYW1lUHJvcFR5cGUgJiYgbW9kdWxlUHJvcGVydHlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZ3JlbWxpbltwcm9wZXJ0eU5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnbiwgZnVuYy1uYW1lc1xuICAgICAgLy8gY2FsbCB0aGUgbW9kdWxlIGZpcnN0XG4gICAgICB2YXIgbW9kdWxlUmVzdWx0ID0gbW9kdWxlUHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHZhciBncmVtbGluUmVzdWx0ID0gZ3JlbWxpblByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvYmplY3RBc3NpZ24obW9kdWxlUmVzdWx0LCBncmVtbGluUmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFttb2R1bGVSZXN1bHQsIGdyZW1saW5SZXN1bHRdO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAnQ2FuXFwndCBkZWNvcmF0ZSBncmVtbGluIHByb3BlcnR5ICcgKyAoJzwnICsgZ3JlbWxpbi50YWdOYW1lICsgJyAvPiMnICsgcHJvcGVydHlOYW1lICsgJzonICsgZ3JlbWxpblByb3BlcnR5VHlwZSArICfCqyAnKSArICgnd2l0aCDCu01vZHVsZSMnICsgcHJvcGVydHlOYW1lICsgJzonICsgbW9kdWxlUHJvcGVydHlUeXBlICsgJ8KrLiBPbmx5IGZ1bmN0aW9ucyBjYW4gYmUgZGVjb3JhdGVkIScpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtaXhpbk1vZHVsZShncmVtbGluLCBNb2R1bGUpIHtcbiAgT2JqZWN0LmtleXMoTW9kdWxlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICB2YXIgcHJvcGVydHkgPSBNb2R1bGVbcHJvcGVydHlOYW1lXTtcblxuICAgIGlmIChncmVtbGluW3Byb3BlcnR5TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgcHJvcGVydHlOYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShncmVtbGluLCBwcm9wZXJ0eU5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWNvcmF0ZVByb3BlcnR5KGdyZW1saW4sIHByb3BlcnR5TmFtZSwgcHJvcGVydHkpO1xuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtaXhpblByb3BzOiBmdW5jdGlvbiBtaXhpblByb3BzKGdyZW1saW4pIHtcbiAgICB2YXIgbW9kdWxlcyA9IGdldE1peGlucyhncmVtbGluKTtcbiAgICAvLyByZXZlcnNlIHRoZSBtb2R1bGVzIGFycmF5IHRvIGNhbGwgZGVjb3JhdGVkIGZ1bmN0aW9ucyBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgICBtb2R1bGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uIChNb2R1bGUpIHtcbiAgICAgIHJldHVybiBtaXhpbk1vZHVsZShncmVtbGluLCBNb2R1bGUpO1xuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuZnVuY3Rpb24gbm9vcCgpIHt9XG52YXIgdHlwZXMgPSBbJ2xvZycsICdpbmZvJywgJ3dhcm4nXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKCkge1xuICAgIGlmIChjb25zb2xlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGdsb2JhbC5jb25zb2xlID0ge307XG4gICAgfVxuICAgIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZVt0eXBlXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zb2xlW3R5cGVdID0gbm9vcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiAjIGdyZW1saW4uanNcbiAqIGRlYWQgc2ltcGxlIHdlYiBjb21wb25lbnRzXG4gKlxuICogIyMgYGdyZW1saW5zYFxuICogVGhlIGdyZW1saW4uanMgcHVibGljIG5hbWVzcGFjZS9tb2R1bGVcbiAqXG4gKi9cblxuLyohXG4gKiBEZXBlbmRlbmNpZXNcbiAqL1xudmFyIGNvbnNvbGVTaGltID0gcmVxdWlyZSgnLi9jb25zb2xlU2hpbScpO1xudmFyIEdyZW1saW4gPSByZXF1aXJlKCcuL0dyZW1saW4nKTtcbnZhciBEYXRhID0gcmVxdWlyZSgnLi9EYXRhJyk7XG5cbi8vIGxldCdzIGFkZCBhIGJyYW5kaW5nIHNvIHdlIGNhbid0IGluY2x1ZGUgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZSBvZiBncmVtbGluLmpzXG52YXIgQlJBTkRJTkcgPSAnZ3JlbWxpbnNfY29ubmVjdGVkJztcblxuaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtCUkFORElOR10pIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdZb3UgdHJpZWQgdG8gaW5jbHVkZSBncmVtbGluLmpzIG11bHRpcGxlIHRpbWVzLiBUaGlzIHdpbGwgbm90IHdvcmsnKTtcbn1cbmNvbnNvbGVTaGltLmNyZWF0ZSgpO1xuXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbQlJBTkRJTkddID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGdyZW1saW4gc3BlY2lmaWNhdGlvbi5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICogICAgIHZhciBncmVtbGlucyA9IHJlcXVpcmUoJ2dyZW1saW5zJyk7XG4gICAqXG4gICAqICAgICBncmVtbGlucy5jcmVhdGUoe1xuICAqICAgICAgIG5hbWU6ICdGb28nXG4gICogICAgIH0pO1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gU3BlYyBUaGUgZ3JlbWxpbiBzcGVjaWZpY2F0aW9uXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZpbmFsIHNwZWMgY3JlYXRlZCwgbGF0ZXIgdXNlZCBhcyBhIHByb3RvdHlwZSBmb3IgbmV3IGNvbXBvbmVudHMgb2YgdGhpc1xuICAgKiB0eXBlXG4gICAqIEBtZXRob2QgY3JlYXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBjcmVhdGU6IEdyZW1saW4uY3JlYXRlLmJpbmQoR3JlbWxpbiksXG4gIGZpbmRHcmVtbGluOiBmdW5jdGlvbiBmaW5kR3JlbWxpbihlbGVtZW50LCB0aW1lb3V0KSB7XG4gICAgcmV0dXJuIERhdGEuZ2V0R3JlbWxpbkFzeW5jKGVsZW1lbnQsIHRpbWVvdXQpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyohXG4gKiBUaGUgcmVnaXN0ZXIgZWxlbWVudCBwb2x5ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqXG4gKi9cblxucmVxdWlyZSgnZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZ3JlbWxpbnMnKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gc2VlIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2plZC85ODI4ODNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYihhKSB7XG4gIHJldHVybiBhID8gKGEgXiBNYXRoLnJhbmRvbSgpICogMTYgPj4gYSAvIDQpLnRvU3RyaW5nKDE2KSA6IChbMWU3XSArIC0xZTMgKyAtNGUzICsgLThlMyArIC0xZTExKS5yZXBsYWNlKC9bMDE4XS9nLCBiKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG59OyIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4ndXNlIHN0cmljdCc7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBncmVtbGlucyAgID0gcmVxdWlyZSgnZ3JlbWxpbnMnKSxcbiAgICBkaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vLi4vbGliL2luZGV4Jyk7XG5cbmRlc2NyaWJlKCdncmVtbGluanMtZGlzcGF0Y2hlcicsIGZ1bmN0aW9uICgpIHtcblxuICBpdCgnYXVnbWVudHMgZ3JlbWxpbiBpbnN0YW5jZXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBncmVtbGlucy5jcmVhdGUoJ2ludGVyZXN0cy1ncmVtbGluJywge1xuICAgICAgbWl4aW5zOiBbZGlzcGF0Y2hlcl0sXG4gICAgICBnZXRMaXN0ZW5lcnMoKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAnRk9PJzogJ29uRm9vJ1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHRoaXMuZW1pdCkudG8uYmUuYSgnZnVuY3Rpb24nKTtcbiAgICAgICAgICBjb3VudCsrOy8vZG9uZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZG9uZShlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uRm9vKGRhdGEpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QoY291bnQpLnRvLmVxdWFsKDMpO1xuICAgICAgICAgIGV4cGVjdChkYXRhKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgICAgICAgZXhwZWN0KGRhdGEuZm9vKS50by5lcXVhbCgnZm9vJyk7XG4gICAgICAgICAgc2V0VGltZW91dChkb25lLCA1MDApO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZG9uZShlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ3JlbWxpbnMuY3JlYXRlKCdpbnRlcmVzdHMyLWdyZW1saW4nLCB7XG4gICAgICBtaXhpbnM6IFtkaXNwYXRjaGVyXSxcbiAgICAgIGdldExpc3RlbmVycygpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICdGT08nOiAnb25Gb28nXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgY3JlYXRlZCgpIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuZW1pdCgnRk9PJywge2ZvbzogJ2Zvbyd9KSwgNTAwKTtcbiAgICAgIH0sXG4gICAgICBvbkZvbygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZGlzcGF0Y2hpbmcgY29tcG9uZW50cyBjYWxsYmFjayBzaG91bGQgbm90IGJlIGNhbGxlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGVsICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0cy1ncmVtbGluJyk7XG4gICAgdmFyIGVsMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0czItZ3JlbWxpbicpO1xuICAgIHZhciBlbDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnRlcmVzdHMtZ3JlbWxpbicpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwyKTtcbiAgfSk7XG5cblxufSk7XG4iXX0=
