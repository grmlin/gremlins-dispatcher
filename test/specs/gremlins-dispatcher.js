(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cache = {};

var Emitter = {
    registerHandler: function registerHandler(handlerName, handler, spec) {
        if (typeof handler !== 'function') {
            throw new Error('Handler for the interest ' + handlerName + ' is missing!');
        }
        cache[handlerName] = cache[handlerName] || [];
        cache[handlerName].push({
            handler: handler,
            spec: spec
        });
    },
    dispatch: function dispatch(handlerName, data) {
        if (cache[handlerName] !== undefined) {
            window.setTimeout(function () {
                cache[handlerName].forEach(function (callbackObj) {
                    return callbackObj.handler.call(callbackObj.spec, data);
                });
            }, 10);
        }
    }
};

function addInterests(spec) {
    var listeners = typeof spec.getListeners === 'function' ? spec.getListeners() : {};

    for (var handler in listeners) {
        if (listeners.hasOwnProperty(handler)) {
            Emitter.registerHandler(handler, spec[listeners[handler]], spec);
        }
    }
}

module.exports = {
    initialize: function initialize() {
        addInterests(this);
    },
    emit: function emit(eventName, eventData) {
        Emitter.dispatch(eventName, eventData);
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
  },
  getGremlin: function getGremlin(element) {
    var id = getId(element);
    var gremlin = cache[id];

    if (gremlin === undefined) {
      // console.warn(`This dom element does not use any gremlins!`, element);
    }
    return gremlin === undefined ? null : gremlin;
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
  initialize: function initialize() {},
  destroy: function destroy() {},
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

function addInstance(element, Spec) {
  var gremlin = Factory.createInstance(element, Spec);
  Data.addGremlin(gremlin, element);
  gremlin.initialize();
}

function removeInstance(element) {
  Data.getGremlin(element).destroy();
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
      attachedCallback: {
        value: function value() {
          addInstance(this, Spec);
        }
      },
      detachedCallback: {
        value: function value() {
          removeInstance(this);
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
  findGremlin: function findGremlin(element) {
    return Data.getGremlin(element);
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
      initialize() {
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
          expect(count).to.equal(2);
          expect(data).to.be.an('object');
          expect(data.foo).to.equal('foo');
          done();
        } catch (e) {
          done(e);
        }
      }
    });

    gremlins.create('interests2-gremlin', {
      mixins: [dispatcher],
      initialize() {
        window.setTimeout(()=>this.emit('FOO', {foo: 'foo'}), 500);
      }
    });

    var el  = document.createElement('interests-gremlin');
    var el2 = document.createElement('interests2-gremlin');
    document.body.appendChild(el);
    document.body.appendChild(el2);
  });


});

},{"../../lib/index":1,"gremlins":10}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9jdW1lbnQtcmVnaXN0ZXItZWxlbWVudC9idWlsZC9kb2N1bWVudC1yZWdpc3Rlci1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9EYXRhLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9GYWN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9HcmVtbGluRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvTWl4aW5zLmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi9jb25zb2xlU2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9ncmVtbGlucy9saWIvZ3JlbWxpbnMuanMiLCJub2RlX21vZHVsZXMvZ3JlbWxpbnMvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dyZW1saW5zL2xpYi91dWlkLmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ0ZXN0L3NyYy9ncmVtbGlucy1kaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FjaGUgPSB7fTtcblxudmFyIEVtaXR0ZXIgPSB7XG4gICAgcmVnaXN0ZXJIYW5kbGVyOiBmdW5jdGlvbiByZWdpc3RlckhhbmRsZXIoaGFuZGxlck5hbWUsIGhhbmRsZXIsIHNwZWMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hhbmRsZXIgZm9yIHRoZSBpbnRlcmVzdCAnICsgaGFuZGxlck5hbWUgKyAnIGlzIG1pc3NpbmchJyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FjaGVbaGFuZGxlck5hbWVdID0gY2FjaGVbaGFuZGxlck5hbWVdIHx8IFtdO1xuICAgICAgICBjYWNoZVtoYW5kbGVyTmFtZV0ucHVzaCh7XG4gICAgICAgICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgICAgICAgc3BlYzogc3BlY1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaChoYW5kbGVyTmFtZSwgZGF0YSkge1xuICAgICAgICBpZiAoY2FjaGVbaGFuZGxlck5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWNoZVtoYW5kbGVyTmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2tPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrT2JqLmhhbmRsZXIuY2FsbChjYWxsYmFja09iai5zcGVjLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGFkZEludGVyZXN0cyhzcGVjKSB7XG4gICAgdmFyIGxpc3RlbmVycyA9IHR5cGVvZiBzcGVjLmdldExpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJyA/IHNwZWMuZ2V0TGlzdGVuZXJzKCkgOiB7fTtcblxuICAgIGZvciAodmFyIGhhbmRsZXIgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoaGFuZGxlcikpIHtcbiAgICAgICAgICAgIEVtaXR0ZXIucmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXIsIHNwZWNbbGlzdGVuZXJzW2hhbmRsZXJdXSwgc3BlYyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGFkZEludGVyZXN0cyh0aGlzKTtcbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpIHtcbiAgICAgICAgRW1pdHRlci5kaXNwYXRjaChldmVudE5hbWUsIGV2ZW50RGF0YSk7XG4gICAgfVxufTsiLCIvKiEgKEMpIFdlYlJlZmxlY3Rpb24gTWl0IFN0eWxlIExpY2Vuc2UgKi9cbihmdW5jdGlvbihlLHQsbixyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBydChlLHQpe2Zvcih2YXIgbj0wLHI9ZS5sZW5ndGg7bjxyO24rKyl2dChlW25dLHQpfWZ1bmN0aW9uIGl0KGUpe2Zvcih2YXIgdD0wLG49ZS5sZW5ndGgscjt0PG47dCsrKXI9ZVt0XSxudChyLGJbb3QocildKX1mdW5jdGlvbiBzdChlKXtyZXR1cm4gZnVuY3Rpb24odCl7aih0KSYmKHZ0KHQsZSkscnQodC5xdWVyeVNlbGVjdG9yQWxsKHcpLGUpKX19ZnVuY3Rpb24gb3QoZSl7dmFyIHQ9ZS5nZXRBdHRyaWJ1dGUoXCJpc1wiKSxuPWUubm9kZU5hbWUudG9VcHBlckNhc2UoKSxyPVMuY2FsbCh5LHQ/dit0LnRvVXBwZXJDYXNlKCk6ZCtuKTtyZXR1cm4gdCYmLTE8ciYmIXV0KG4sdCk/LTE6cn1mdW5jdGlvbiB1dChlLHQpe3JldHVybi0xPHcuaW5kZXhPZihlKydbaXM9XCInK3QrJ1wiXScpfWZ1bmN0aW9uIGF0KGUpe3ZhciB0PWUuY3VycmVudFRhcmdldCxuPWUuYXR0ckNoYW5nZSxyPWUuYXR0ck5hbWUsaT1lLnRhcmdldDtRJiYoIWl8fGk9PT10KSYmdC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJnIhPT1cInN0eWxlXCImJmUucHJldlZhbHVlIT09ZS5uZXdWYWx1ZSYmdC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2socixuPT09ZVthXT9udWxsOmUucHJldlZhbHVlLG49PT1lW2xdP251bGw6ZS5uZXdWYWx1ZSl9ZnVuY3Rpb24gZnQoZSl7dmFyIHQ9c3QoZSk7cmV0dXJuIGZ1bmN0aW9uKGUpe1gucHVzaCh0LGUudGFyZ2V0KX19ZnVuY3Rpb24gbHQoZSl7SyYmKEs9ITEsZS5jdXJyZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoaCxsdCkpLHJ0KChlLnRhcmdldHx8dCkucXVlcnlTZWxlY3RvckFsbCh3KSxlLmRldGFpbD09PW8/bzpzKSxCJiZwdCgpfWZ1bmN0aW9uIGN0KGUsdCl7dmFyIG49dGhpcztxLmNhbGwobixlLHQpLEcuY2FsbChuLHt0YXJnZXQ6bn0pfWZ1bmN0aW9uIGh0KGUsdCl7RChlLHQpLGV0P2V0Lm9ic2VydmUoZSx6KTooSiYmKGUuc2V0QXR0cmlidXRlPWN0LGVbaV09WihlKSxlLmFkZEV2ZW50TGlzdGVuZXIocCxHKSksZS5hZGRFdmVudExpc3RlbmVyKGMsYXQpKSxlLmNyZWF0ZWRDYWxsYmFjayYmUSYmKGUuY3JlYXRlZD0hMCxlLmNyZWF0ZWRDYWxsYmFjaygpLGUuY3JlYXRlZD0hMSl9ZnVuY3Rpb24gcHQoKXtmb3IodmFyIGUsdD0wLG49Ri5sZW5ndGg7dDxuO3QrKyllPUZbdF0sRS5jb250YWlucyhlKXx8KG4tLSxGLnNwbGljZSh0LS0sMSksdnQoZSxvKSl9ZnVuY3Rpb24gZHQoZSl7dGhyb3cgbmV3IEVycm9yKFwiQSBcIitlK1wiIHR5cGUgaXMgYWxyZWFkeSByZWdpc3RlcmVkXCIpfWZ1bmN0aW9uIHZ0KGUsdCl7dmFyIG4scj1vdChlKTstMTxyJiYodHQoZSxiW3JdKSxyPTAsdD09PXMmJiFlW3NdPyhlW29dPSExLGVbc109ITAscj0xLEImJlMuY2FsbChGLGUpPDAmJkYucHVzaChlKSk6dD09PW8mJiFlW29dJiYoZVtzXT0hMSxlW29dPSEwLHI9MSksciYmKG49ZVt0K1wiQ2FsbGJhY2tcIl0pJiZuLmNhbGwoZSkpfWlmKHIgaW4gdClyZXR1cm47dmFyIGk9XCJfX1wiK3IrKE1hdGgucmFuZG9tKCkqMWU1Pj4wKSxzPVwiYXR0YWNoZWRcIixvPVwiZGV0YWNoZWRcIix1PVwiZXh0ZW5kc1wiLGE9XCJBRERJVElPTlwiLGY9XCJNT0RJRklDQVRJT05cIixsPVwiUkVNT1ZBTFwiLGM9XCJET01BdHRyTW9kaWZpZWRcIixoPVwiRE9NQ29udGVudExvYWRlZFwiLHA9XCJET01TdWJ0cmVlTW9kaWZpZWRcIixkPVwiPFwiLHY9XCI9XCIsbT0vXltBLVpdW0EtWjAtOV0qKD86LVtBLVowLTldKykrJC8sZz1bXCJBTk5PVEFUSU9OLVhNTFwiLFwiQ09MT1ItUFJPRklMRVwiLFwiRk9OVC1GQUNFXCIsXCJGT05ULUZBQ0UtU1JDXCIsXCJGT05ULUZBQ0UtVVJJXCIsXCJGT05ULUZBQ0UtRk9STUFUXCIsXCJGT05ULUZBQ0UtTkFNRVwiLFwiTUlTU0lORy1HTFlQSFwiXSx5PVtdLGI9W10sdz1cIlwiLEU9dC5kb2N1bWVudEVsZW1lbnQsUz15LmluZGV4T2Z8fGZ1bmN0aW9uKGUpe2Zvcih2YXIgdD10aGlzLmxlbmd0aDt0LS0mJnRoaXNbdF0hPT1lOyk7cmV0dXJuIHR9LHg9bi5wcm90b3R5cGUsVD14Lmhhc093blByb3BlcnR5LE49eC5pc1Byb3RvdHlwZU9mLEM9bi5kZWZpbmVQcm9wZXJ0eSxrPW4uZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLEw9bi5nZXRPd25Qcm9wZXJ0eU5hbWVzLEE9bi5nZXRQcm90b3R5cGVPZixPPW4uc2V0UHJvdG90eXBlT2YsTT0hIW4uX19wcm90b19fLF89bi5jcmVhdGV8fGZ1bmN0aW9uIG10KGUpe3JldHVybiBlPyhtdC5wcm90b3R5cGU9ZSxuZXcgbXQpOnRoaXN9LEQ9T3x8KE0/ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5fX3Byb3RvX189dCxlfTpMJiZrP2Z1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe2Zvcih2YXIgbixyPUwodCksaT0wLHM9ci5sZW5ndGg7aTxzO2krKyluPXJbaV0sVC5jYWxsKGUsbil8fEMoZSxuLGsodCxuKSl9cmV0dXJuIGZ1bmN0aW9uKHQsbil7ZG8gZSh0LG4pO3doaWxlKChuPUEobikpJiYhTi5jYWxsKG4sdCkpO3JldHVybiB0fX0oKTpmdW5jdGlvbihlLHQpe2Zvcih2YXIgbiBpbiB0KWVbbl09dFtuXTtyZXR1cm4gZX0pLFA9ZS5NdXRhdGlvbk9ic2VydmVyfHxlLldlYktpdE11dGF0aW9uT2JzZXJ2ZXIsSD0oZS5IVE1MRWxlbWVudHx8ZS5FbGVtZW50fHxlLk5vZGUpLnByb3RvdHlwZSxCPSFOLmNhbGwoSCxFKSxqPUI/ZnVuY3Rpb24oZSl7cmV0dXJuIGUubm9kZVR5cGU9PT0xfTpmdW5jdGlvbihlKXtyZXR1cm4gTi5jYWxsKEgsZSl9LEY9QiYmW10sST1ILmNsb25lTm9kZSxxPUguc2V0QXR0cmlidXRlLFI9SC5yZW1vdmVBdHRyaWJ1dGUsVT10LmNyZWF0ZUVsZW1lbnQsej1QJiZ7YXR0cmlidXRlczohMCxjaGFyYWN0ZXJEYXRhOiEwLGF0dHJpYnV0ZU9sZFZhbHVlOiEwfSxXPVB8fGZ1bmN0aW9uKGUpe0o9ITEsRS5yZW1vdmVFdmVudExpc3RlbmVyKGMsVyl9LFgsVj1lLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxmdW5jdGlvbihlKXtzZXRUaW1lb3V0KGUsMTApfSwkPSExLEo9ITAsSz0hMCxRPSEwLEcsWSxaLGV0LHR0LG50O098fE0/KHR0PWZ1bmN0aW9uKGUsdCl7Ti5jYWxsKHQsZSl8fGh0KGUsdCl9LG50PWh0KToodHQ9ZnVuY3Rpb24oZSx0KXtlW2ldfHwoZVtpXT1uKCEwKSxodChlLHQpKX0sbnQ9dHQpLEI/KEo9ITEsZnVuY3Rpb24oKXt2YXIgZT1rKEgsXCJhZGRFdmVudExpc3RlbmVyXCIpLHQ9ZS52YWx1ZSxuPWZ1bmN0aW9uKGUpe3ZhciB0PW5ldyBDdXN0b21FdmVudChjLHtidWJibGVzOiEwfSk7dC5hdHRyTmFtZT1lLHQucHJldlZhbHVlPXRoaXMuZ2V0QXR0cmlidXRlKGUpLHQubmV3VmFsdWU9bnVsbCx0W2xdPXQuYXR0ckNoYW5nZT0yLFIuY2FsbCh0aGlzLGUpLHRoaXMuZGlzcGF0Y2hFdmVudCh0KX0scj1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuaGFzQXR0cmlidXRlKGUpLHI9biYmdGhpcy5nZXRBdHRyaWJ1dGUoZSksaT1uZXcgQ3VzdG9tRXZlbnQoYyx7YnViYmxlczohMH0pO3EuY2FsbCh0aGlzLGUsdCksaS5hdHRyTmFtZT1lLGkucHJldlZhbHVlPW4/cjpudWxsLGkubmV3VmFsdWU9dCxuP2lbZl09aS5hdHRyQ2hhbmdlPTE6aVthXT1pLmF0dHJDaGFuZ2U9MCx0aGlzLmRpc3BhdGNoRXZlbnQoaSl9LHM9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5jdXJyZW50VGFyZ2V0LG49dFtpXSxyPWUucHJvcGVydHlOYW1lLHM7bi5oYXNPd25Qcm9wZXJ0eShyKSYmKG49bltyXSxzPW5ldyBDdXN0b21FdmVudChjLHtidWJibGVzOiEwfSkscy5hdHRyTmFtZT1uLm5hbWUscy5wcmV2VmFsdWU9bi52YWx1ZXx8bnVsbCxzLm5ld1ZhbHVlPW4udmFsdWU9dFtyXXx8bnVsbCxzLnByZXZWYWx1ZT09bnVsbD9zW2FdPXMuYXR0ckNoYW5nZT0wOnNbZl09cy5hdHRyQ2hhbmdlPTEsdC5kaXNwYXRjaEV2ZW50KHMpKX07ZS52YWx1ZT1mdW5jdGlvbihlLG8sdSl7ZT09PWMmJnRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiZ0aGlzLnNldEF0dHJpYnV0ZSE9PXImJih0aGlzW2ldPXtjbGFzc05hbWU6e25hbWU6XCJjbGFzc1wiLHZhbHVlOnRoaXMuY2xhc3NOYW1lfX0sdGhpcy5zZXRBdHRyaWJ1dGU9cix0aGlzLnJlbW92ZUF0dHJpYnV0ZT1uLHQuY2FsbCh0aGlzLFwicHJvcGVydHljaGFuZ2VcIixzKSksdC5jYWxsKHRoaXMsZSxvLHUpfSxDKEgsXCJhZGRFdmVudExpc3RlbmVyXCIsZSl9KCkpOlB8fChFLmFkZEV2ZW50TGlzdGVuZXIoYyxXKSxFLnNldEF0dHJpYnV0ZShpLDEpLEUucmVtb3ZlQXR0cmlidXRlKGkpLEomJihHPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbixyLHM7aWYodD09PWUudGFyZ2V0KXtuPXRbaV0sdFtpXT1yPVoodCk7Zm9yKHMgaW4gcil7aWYoIShzIGluIG4pKXJldHVybiBZKDAsdCxzLG5bc10scltzXSxhKTtpZihyW3NdIT09bltzXSlyZXR1cm4gWSgxLHQscyxuW3NdLHJbc10sZil9Zm9yKHMgaW4gbilpZighKHMgaW4gcikpcmV0dXJuIFkoMix0LHMsbltzXSxyW3NdLGwpfX0sWT1mdW5jdGlvbihlLHQsbixyLGkscyl7dmFyIG89e2F0dHJDaGFuZ2U6ZSxjdXJyZW50VGFyZ2V0OnQsYXR0ck5hbWU6bixwcmV2VmFsdWU6cixuZXdWYWx1ZTppfTtvW3NdPWUsYXQobyl9LFo9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0LG4scj17fSxpPWUuYXR0cmlidXRlcyxzPTAsbz1pLmxlbmd0aDtzPG87cysrKXQ9aVtzXSxuPXQubmFtZSxuIT09XCJzZXRBdHRyaWJ1dGVcIiYmKHJbbl09dC52YWx1ZSk7cmV0dXJuIHJ9KSksdFtyXT1mdW5jdGlvbihuLHIpe2M9bi50b1VwcGVyQ2FzZSgpLCR8fCgkPSEwLFA/KGV0PWZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbihlLHQpe2Zvcih2YXIgbj0wLHI9ZS5sZW5ndGg7bjxyO3QoZVtuKytdKSk7fXJldHVybiBuZXcgUChmdW5jdGlvbihyKXtmb3IodmFyIGkscyxvLHU9MCxhPXIubGVuZ3RoO3U8YTt1KyspaT1yW3VdLGkudHlwZT09PVwiY2hpbGRMaXN0XCI/KG4oaS5hZGRlZE5vZGVzLGUpLG4oaS5yZW1vdmVkTm9kZXMsdCkpOihzPWkudGFyZ2V0LFEmJnMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiZpLmF0dHJpYnV0ZU5hbWUhPT1cInN0eWxlXCImJihvPXMuZ2V0QXR0cmlidXRlKGkuYXR0cmlidXRlTmFtZSksbyE9PWkub2xkVmFsdWUmJnMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGkuYXR0cmlidXRlTmFtZSxpLm9sZFZhbHVlLG8pKSl9KX0oc3Qocyksc3QobykpLGV0Lm9ic2VydmUodCx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KSk6KFg9W10sVihmdW5jdGlvbiBFKCl7d2hpbGUoWC5sZW5ndGgpWC5zaGlmdCgpLmNhbGwobnVsbCxYLnNoaWZ0KCkpO1YoRSl9KSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Ob2RlSW5zZXJ0ZWRcIixmdChzKSksdC5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIixmdChvKSkpLHQuYWRkRXZlbnRMaXN0ZW5lcihoLGx0KSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsbHQpLHQuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihlLG4pe3ZhciByPVUuYXBwbHkodCxhcmd1bWVudHMpLGk9XCJcIitlLHM9Uy5jYWxsKHksKG4/djpkKSsobnx8aSkudG9VcHBlckNhc2UoKSksbz0tMTxzO3JldHVybiBuJiYoci5zZXRBdHRyaWJ1dGUoXCJpc1wiLG49bi50b0xvd2VyQ2FzZSgpKSxvJiYobz11dChpLnRvVXBwZXJDYXNlKCksbikpKSxRPSF0LmNyZWF0ZUVsZW1lbnQuaW5uZXJIVE1MSGVscGVyLG8mJm50KHIsYltzXSkscn0sSC5jbG9uZU5vZGU9ZnVuY3Rpb24oZSl7dmFyIHQ9SS5jYWxsKHRoaXMsISFlKSxuPW90KHQpO3JldHVybi0xPG4mJm50KHQsYltuXSksZSYmaXQodC5xdWVyeVNlbGVjdG9yQWxsKHcpKSx0fSksLTI8Uy5jYWxsKHksditjKStTLmNhbGwoeSxkK2MpJiZkdChuKTtpZighbS50ZXN0KGMpfHwtMTxTLmNhbGwoZyxjKSl0aHJvdyBuZXcgRXJyb3IoXCJUaGUgdHlwZSBcIituK1wiIGlzIGludmFsaWRcIik7dmFyIGk9ZnVuY3Rpb24oKXtyZXR1cm4gZj90LmNyZWF0ZUVsZW1lbnQobCxjKTp0LmNyZWF0ZUVsZW1lbnQobCl9LGE9cnx8eCxmPVQuY2FsbChhLHUpLGw9Zj9yW3VdLnRvVXBwZXJDYXNlKCk6YyxjLHA7cmV0dXJuIGYmJi0xPFMuY2FsbCh5LGQrbCkmJmR0KGwpLHA9eS5wdXNoKChmP3Y6ZCkrYyktMSx3PXcuY29uY2F0KHcubGVuZ3RoP1wiLFwiOlwiXCIsZj9sKydbaXM9XCInK24udG9Mb3dlckNhc2UoKSsnXCJdJzpsKSxpLnByb3RvdHlwZT1iW3BdPVQuY2FsbChhLFwicHJvdG90eXBlXCIpP2EucHJvdG90eXBlOl8oSCkscnQodC5xdWVyeVNlbGVjdG9yQWxsKHcpLHMpLGl9fSkod2luZG93LGRvY3VtZW50LE9iamVjdCxcInJlZ2lzdGVyRWxlbWVudFwiKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dWlkID0gcmVxdWlyZSgnLi91dWlkJyk7XG5cbnZhciBleHAgPSAnZ3JlbWxpbnNfJyArIHV1aWQoKTtcbnZhciBjYWNoZSA9IHt9O1xuXG52YXIgZ3JlbWxpbklkID0gZnVuY3Rpb24gZ3JlbWxpbklkKCkge1xuICB2YXIgaWQgPSAxO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBpZCsrO1xuICB9O1xufSgpO1xuXG52YXIgaGFzSWQgPSBmdW5jdGlvbiBoYXNJZChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50W2V4cF0gIT09IHVuZGVmaW5lZDtcbn07XG52YXIgc2V0SWQgPSBmdW5jdGlvbiBzZXRJZChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50W2V4cF0gPSBncmVtbGluSWQoKTtcbn07IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbnZhciBnZXRJZCA9IGZ1bmN0aW9uIGdldElkKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGhhc0lkKGVsZW1lbnQpID8gZWxlbWVudFtleHBdIDogc2V0SWQoZWxlbWVudCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkR3JlbWxpbjogZnVuY3Rpb24gYWRkR3JlbWxpbihncmVtbGluLCBlbGVtZW50KSB7XG4gICAgdmFyIGlkID0gZ2V0SWQoZWxlbWVudCk7XG5cbiAgICBpZiAoY2FjaGVbaWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybignWW91IGNhblxcJ3QgYWRkIGFub3RoZXIgZ3JlbWxpbiB0byB0aGlzIGVsZW1lbnQsIGl0IGFscmVhZHkgdXNlcyBvbmUhJywgZWxlbWVudCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSwgbWF4LWxlblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNhY2hlW2lkXSA9IGdyZW1saW47XG4gICAgICB9XG4gIH0sXG4gIGdldEdyZW1saW46IGZ1bmN0aW9uIGdldEdyZW1saW4oZWxlbWVudCkge1xuICAgIHZhciBpZCA9IGdldElkKGVsZW1lbnQpO1xuICAgIHZhciBncmVtbGluID0gY2FjaGVbaWRdO1xuXG4gICAgaWYgKGdyZW1saW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gY29uc29sZS53YXJuKGBUaGlzIGRvbSBlbGVtZW50IGRvZXMgbm90IHVzZSBhbnkgZ3JlbWxpbnMhYCwgZWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBncmVtbGluID09PSB1bmRlZmluZWQgPyBudWxsIDogZ3JlbWxpbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZUluc3RhbmNlOiBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShlbGVtZW50LCBTcGVjKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoU3BlYywge1xuICAgICAgZWw6IHtcbiAgICAgICAgdmFsdWU6IGVsZW1lbnQsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1peGlucyA9IHJlcXVpcmUoJy4vTWl4aW5zJyk7XG52YXIgR3JlbWxpbkVsZW1lbnQgPSByZXF1aXJlKCcuL0dyZW1saW5FbGVtZW50Jyk7XG5cbi8qKlxuICogIyMgYEdyZW1saW5gXG4gKiBUaGUgYmFzZSBwcm90b3R5cGUgdXNlZCBmb3IgYWxsIGdyZW1saW4gY29tcG9uZW50cy9zcGVjc1xuICpcbiAqXG4gKi9cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc291cmNlcyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBzb3VyY2VzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3ApO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuLyohXG4gKiBBbGwgdGhlIFNwZWNzIGFscmVhZHkgYWRkZWQuXG4gKlxuICogVXNlZCB0byBkZXRlY3QgbXVsdGkgYWRkc1xuICovXG52YXIgc3BlY01hcCA9IHt9O1xuXG52YXIgYWRkU3BlYyA9IGZ1bmN0aW9uIGFkZFNwZWModGFnTmFtZSwgU3BlYykge1xuICByZXR1cm4gc3BlY01hcFt0YWdOYW1lXSA9IFNwZWM7XG59O1xudmFyIGhhc1NwZWMgPSBmdW5jdGlvbiBoYXNTcGVjKHRhZ05hbWUpIHtcbiAgcmV0dXJuIHNwZWNNYXBbdGFnTmFtZV0gIT09IHVuZGVmaW5lZDtcbn07XG5cbnZhciBHcmVtbGluID0ge1xuICBpbml0aWFsaXplOiBmdW5jdGlvbiBpbml0aWFsaXplKCkge30sXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7fSxcbiAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUodGFnTmFtZSkge1xuICAgIHZhciBTcGVjID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIgUGFyZW50ID0gdGhpcztcbiAgICB2YXIgTmV3U3BlYyA9IE9iamVjdC5jcmVhdGUoUGFyZW50LCB7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHZhbHVlOiB0YWdOYW1lLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHR5cGVvZiB0YWdOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignR3JlbWxpbnMuY3JlYXRlIGV4cGVjdHMgdGhlIGdyZW1saW5zIHRhZyBuYW1lIGFzIGEgZmlyc3QgYXJndW1lbnQnKTtcbiAgICB9XG4gICAgaWYgKGhhc1NwZWModGFnTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIGFkZCBuZXcgR3JlbWxpbiBzcGVjLCBidXQgYSBzcGVjIGZvciAnICsgdGFnTmFtZSArICcgYWxyZWFkeSBleGlzdHMuJyk7XG4gICAgfVxuICAgIGlmIChTcGVjLmNyZWF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgJ1lvdSBhcmUgcmVwbGFjaW5nIHRoZSBvcmlnaW5hbCBjcmVhdGUgbWV0aG9kIGZvciB0aGUgc3BlYyBvZiAnICsgdGFnTmFtZSArICcuIFlvdSBrbm93IHdoYXQgJyArICd5b3VcXCdyZSBkb2luZywgcmlnaHQ/Jyk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW5cbiAgICBleHRlbmQoTmV3U3BlYywgU3BlYyk7XG4gICAgLy8gZXh0ZW5kIHRoZSBzcGVjIHdpdGggaXQncyBNaXhpbnNcbiAgICBNaXhpbnMubWl4aW5Qcm9wcyhOZXdTcGVjKTtcbiAgICAvLyByZW1lbWJlciB0aGlzIG5hbWVcbiAgICBhZGRTcGVjKHRhZ05hbWUsIE5ld1NwZWMpO1xuICAgIC8vIGFuZCBjcmVhdGUgdGhlIGN1c3RvbSBlbGVtZW50IGZvciBpdFxuICAgIEdyZW1saW5FbGVtZW50LnJlZ2lzdGVyKHRhZ05hbWUsIE5ld1NwZWMpO1xuICAgIHJldHVybiBOZXdTcGVjO1xuICB9LFxuICBhdHRyaWJ1dGVEaWRDaGFuZ2U6IGZ1bmN0aW9uIGF0dHJpYnV0ZURpZENoYW5nZSgpIHt9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyZW1saW47IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRmFjdG9yeSA9IHJlcXVpcmUoJy4vRmFjdG9yeScpO1xudmFyIERhdGEgPSByZXF1aXJlKCcuL0RhdGEnKTtcblxudmFyIGNhblJlZ2lzdGVyRWxlbWVudHMgPSB0eXBlb2YgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50ID09PSAnZnVuY3Rpb24nO1xuXG5pZiAoIWNhblJlZ2lzdGVyRWxlbWVudHMpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdyZWdpc3RlckVsZW1lbnQgbm90IGF2YWlsYWJsZS4gRGlkIHlvdSBpbmNsdWRlIHRoZSBwb2x5ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnM/Jyk7XG59XG5cbnZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xudmFyIHN0eWxlU2hlZXQgPSB1bmRlZmluZWQ7XG5cbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbnN0eWxlU2hlZXQgPSBzdHlsZUVsZW1lbnQuc2hlZXQ7XG5cbmZ1bmN0aW9uIGFkZEluc3RhbmNlKGVsZW1lbnQsIFNwZWMpIHtcbiAgdmFyIGdyZW1saW4gPSBGYWN0b3J5LmNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIFNwZWMpO1xuICBEYXRhLmFkZEdyZW1saW4oZ3JlbWxpbiwgZWxlbWVudCk7XG4gIGdyZW1saW4uaW5pdGlhbGl6ZSgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVJbnN0YW5jZShlbGVtZW50KSB7XG4gIERhdGEuZ2V0R3JlbWxpbihlbGVtZW50KS5kZXN0cm95KCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF0dHIoZWxlbWVudCwgbmFtZSwgcHJldmlvdXNWYWx1ZSwgdmFsdWUpIHtcbiAgdmFyIGdyZW1saW4gPSBEYXRhLmdldEdyZW1saW4oZWxlbWVudCk7XG5cbiAgaWYgKGdyZW1saW4gIT09IG51bGwpIHtcbiAgICBncmVtbGluLmF0dHJpYnV0ZURpZENoYW5nZShuYW1lLCBwcmV2aW91c1ZhbHVlLCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3Rlcih0YWdOYW1lLCBTcGVjKSB7XG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgYXR0YWNoZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICAgICAgYWRkSW5zdGFuY2UodGhpcywgU3BlYyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZXRhY2hlZENhbGxiYWNrOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICAgICAgICByZW1vdmVJbnN0YW5jZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmFtZSwgcHJldmlvdXNWYWx1ZSwgX3ZhbHVlKSB7XG4gICAgICAgICAgdXBkYXRlQXR0cih0aGlzLCBuYW1lLCBwcmV2aW91c1ZhbHVlLCBfdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIGluc2VydCB0aGUgcnVsZSBCRUZPUkUgcmVnaXN0ZXJpbmcgdGhlIGVsZW1lbnQuIFRoaXMgaXMgaW1wb3J0YW50IGJlY2F1c2UgdGhleSBtYXkgYmUgaW5saW5lXG4gICAgLy8gb3RoZXJ3aXNlIHdoZW4gZmlyc3QgaW5pdGlhbGl6ZWQuXG4gICAgc3R5bGVTaGVldC5pbnNlcnRSdWxlKHRhZ05hbWUgKyAnIHsgZGlzcGxheTogYmxvY2sgfScsIDApO1xuXG4gICAgdmFyIEVsID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KHRhZ05hbWUsIHtcbiAgICAgIG5hbWU6IHRhZ05hbWUsXG4gICAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCBwcm90bylcbiAgICB9KTtcblxuICAgIHJldHVybiBFbDtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5mdW5jdGlvbiBnZXRNaXhpbnMoZ3JlbWxpbikge1xuICBpZiAoQXJyYXkuaXNBcnJheShncmVtbGluLm1peGlucykpIHtcbiAgICByZXR1cm4gZ3JlbWxpbi5taXhpbnM7XG4gIH1cblxuICByZXR1cm4gZ3JlbWxpbi5taXhpbnMgPyBbZ3JlbWxpbi5taXhpbnNdIDogW107XG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlUHJvcGVydHkoZ3JlbWxpbiwgcHJvcGVydHlOYW1lLCBwcm9wZXJ0eSkge1xuICB2YXIgZ3JlbWxpblByb3BlcnR5ID0gZ3JlbWxpbltwcm9wZXJ0eU5hbWVdO1xuICB2YXIgbW9kdWxlUHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgdmFyIGdyZW1saW5Qcm9wZXJ0eVR5cGUgPSB0eXBlb2YgZ3JlbWxpblByb3BlcnR5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihncmVtbGluUHJvcGVydHkpO1xuICB2YXIgbW9kdWxlUHJvcGVydHlUeXBlID0gdHlwZW9mIG1vZHVsZVByb3BlcnR5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihtb2R1bGVQcm9wZXJ0eSk7XG4gIHZhciBpc1NhbWVQcm9wVHlwZSA9IGdyZW1saW5Qcm9wZXJ0eVR5cGUgPT09IG1vZHVsZVByb3BlcnR5VHlwZTtcblxuICBpZiAoaXNTYW1lUHJvcFR5cGUgJiYgbW9kdWxlUHJvcGVydHlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZ3JlbWxpbltwcm9wZXJ0eU5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnbiwgZnVuYy1uYW1lc1xuICAgICAgLy8gY2FsbCB0aGUgbW9kdWxlIGZpcnN0XG4gICAgICB2YXIgbW9kdWxlUmVzdWx0ID0gbW9kdWxlUHJvcGVydHkuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHZhciBncmVtbGluUmVzdWx0ID0gZ3JlbWxpblByb3BlcnR5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBvYmplY3RBc3NpZ24obW9kdWxlUmVzdWx0LCBncmVtbGluUmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFttb2R1bGVSZXN1bHQsIGdyZW1saW5SZXN1bHRdO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAnQ2FuXFwndCBkZWNvcmF0ZSBncmVtbGluIHByb3BlcnR5ICcgKyAoJzwnICsgZ3JlbWxpbi50YWdOYW1lICsgJyAvPiMnICsgcHJvcGVydHlOYW1lICsgJzonICsgZ3JlbWxpblByb3BlcnR5VHlwZSArICfCqyAnKSArICgnd2l0aCDCu01vZHVsZSMnICsgcHJvcGVydHlOYW1lICsgJzonICsgbW9kdWxlUHJvcGVydHlUeXBlICsgJ8KrLiBPbmx5IGZ1bmN0aW9ucyBjYW4gYmUgZGVjb3JhdGVkIScpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtaXhpbk1vZHVsZShncmVtbGluLCBNb2R1bGUpIHtcbiAgT2JqZWN0LmtleXMoTW9kdWxlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICB2YXIgcHJvcGVydHkgPSBNb2R1bGVbcHJvcGVydHlOYW1lXTtcblxuICAgIGlmIChncmVtbGluW3Byb3BlcnR5TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1vZHVsZSwgcHJvcGVydHlOYW1lKTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShncmVtbGluLCBwcm9wZXJ0eU5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWNvcmF0ZVByb3BlcnR5KGdyZW1saW4sIHByb3BlcnR5TmFtZSwgcHJvcGVydHkpO1xuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtaXhpblByb3BzOiBmdW5jdGlvbiBtaXhpblByb3BzKGdyZW1saW4pIHtcbiAgICB2YXIgbW9kdWxlcyA9IGdldE1peGlucyhncmVtbGluKTtcbiAgICAvLyByZXZlcnNlIHRoZSBtb2R1bGVzIGFycmF5IHRvIGNhbGwgZGVjb3JhdGVkIGZ1bmN0aW9ucyBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgICBtb2R1bGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uIChNb2R1bGUpIHtcbiAgICAgIHJldHVybiBtaXhpbk1vZHVsZShncmVtbGluLCBNb2R1bGUpO1xuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuZnVuY3Rpb24gbm9vcCgpIHt9XG52YXIgdHlwZXMgPSBbJ2xvZycsICdpbmZvJywgJ3dhcm4nXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKCkge1xuICAgIGlmIChjb25zb2xlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGdsb2JhbC5jb25zb2xlID0ge307XG4gICAgfVxuICAgIHR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZVt0eXBlXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zb2xlW3R5cGVdID0gbm9vcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiAjIGdyZW1saW4uanNcbiAqIGRlYWQgc2ltcGxlIHdlYiBjb21wb25lbnRzXG4gKlxuICogIyMgYGdyZW1saW5zYFxuICogVGhlIGdyZW1saW4uanMgcHVibGljIG5hbWVzcGFjZS9tb2R1bGVcbiAqXG4gKi9cblxuLyohXG4gKiBEZXBlbmRlbmNpZXNcbiAqL1xudmFyIGNvbnNvbGVTaGltID0gcmVxdWlyZSgnLi9jb25zb2xlU2hpbScpO1xudmFyIEdyZW1saW4gPSByZXF1aXJlKCcuL0dyZW1saW4nKTtcbnZhciBEYXRhID0gcmVxdWlyZSgnLi9EYXRhJyk7XG5cbi8vIGxldCdzIGFkZCBhIGJyYW5kaW5nIHNvIHdlIGNhbid0IGluY2x1ZGUgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZSBvZiBncmVtbGluLmpzXG52YXIgQlJBTkRJTkcgPSAnZ3JlbWxpbnNfY29ubmVjdGVkJztcblxuaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtCUkFORElOR10pIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdZb3UgdHJpZWQgdG8gaW5jbHVkZSBncmVtbGluLmpzIG11bHRpcGxlIHRpbWVzLiBUaGlzIHdpbGwgbm90IHdvcmsnKTtcbn1cbmNvbnNvbGVTaGltLmNyZWF0ZSgpO1xuXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbQlJBTkRJTkddID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGdyZW1saW4gc3BlY2lmaWNhdGlvbi5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICogICAgIHZhciBncmVtbGlucyA9IHJlcXVpcmUoJ2dyZW1saW5zJyk7XG4gICAqXG4gICAqICAgICBncmVtbGlucy5jcmVhdGUoe1xuICAqICAgICAgIG5hbWU6ICdGb28nXG4gICogICAgIH0pO1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gU3BlYyBUaGUgZ3JlbWxpbiBzcGVjaWZpY2F0aW9uXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGZpbmFsIHNwZWMgY3JlYXRlZCwgbGF0ZXIgdXNlZCBhcyBhIHByb3RvdHlwZSBmb3IgbmV3IGNvbXBvbmVudHMgb2YgdGhpc1xuICAgKiB0eXBlXG4gICAqIEBtZXRob2QgY3JlYXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBjcmVhdGU6IEdyZW1saW4uY3JlYXRlLmJpbmQoR3JlbWxpbiksXG4gIGZpbmRHcmVtbGluOiBmdW5jdGlvbiBmaW5kR3JlbWxpbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIERhdGEuZ2V0R3JlbWxpbihlbGVtZW50KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qIVxuICogVGhlIHJlZ2lzdGVyIGVsZW1lbnQgcG9seWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKlxuICovXG5cbnJlcXVpcmUoJ2RvY3VtZW50LXJlZ2lzdGVyLWVsZW1lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2dyZW1saW5zJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHNlZSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qZWQvOTgyODgzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGIoYSkge1xuICByZXR1cm4gYSA/IChhIF4gTWF0aC5yYW5kb20oKSAqIDE2ID4+IGEgLyA0KS50b1N0cmluZygxNikgOiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgYik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxufTsiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ3JlbWxpbnMgICA9IHJlcXVpcmUoJ2dyZW1saW5zJyksXG4gICAgZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uLy4uL2xpYi9pbmRleCcpO1xuXG5kZXNjcmliZSgnZ3JlbWxpbmpzLWRpc3BhdGNoZXInLCBmdW5jdGlvbiAoKSB7XG5cbiAgaXQoJ2F1Z21lbnRzIGdyZW1saW4gaW5zdGFuY2VzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgZ3JlbWxpbnMuY3JlYXRlKCdpbnRlcmVzdHMtZ3JlbWxpbicsIHtcbiAgICAgIG1peGluczogW2Rpc3BhdGNoZXJdLFxuICAgICAgZ2V0TGlzdGVuZXJzKCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgJ0ZPTyc6ICdvbkZvbydcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4cGVjdCh0aGlzLmVtaXQpLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG4gICAgICAgICAgY291bnQrKzsvL2RvbmUoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRvbmUoZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvbkZvbyhkYXRhKSB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KGNvdW50KS50by5lcXVhbCgyKTtcbiAgICAgICAgICBleHBlY3QoZGF0YSkudG8uYmUuYW4oJ29iamVjdCcpO1xuICAgICAgICAgIGV4cGVjdChkYXRhLmZvbykudG8uZXF1YWwoJ2ZvbycpO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRvbmUoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGdyZW1saW5zLmNyZWF0ZSgnaW50ZXJlc3RzMi1ncmVtbGluJywge1xuICAgICAgbWl4aW5zOiBbZGlzcGF0Y2hlcl0sXG4gICAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKT0+dGhpcy5lbWl0KCdGT08nLCB7Zm9vOiAnZm9vJ30pLCA1MDApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGVsICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0cy1ncmVtbGluJyk7XG4gICAgdmFyIGVsMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ludGVyZXN0czItZ3JlbWxpbicpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwyKTtcbiAgfSk7XG5cblxufSk7XG4iXX0=
