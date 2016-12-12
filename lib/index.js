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