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