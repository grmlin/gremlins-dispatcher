'use strict';
var cache = {};

var Emitter = {
  registerHandler(handlerName, handler, component) {
    if (typeof handler !== 'function') {
      throw new Error(`<${component.name} /> — Handler for the interest ${handlerName} is missing!`);
    }
    cache[ handlerName ] = cache[ handlerName ] || [];
    cache[ handlerName ].push({
      handler: handler,
      component: component
    });
  },
  dispatch(handlerName, data, component) {
    if (cache[ handlerName ] !== undefined) {
      window.setTimeout(() => {
        cache[ handlerName ].forEach(callbackObj => {
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
      Emitter.registerHandler(handler, component[ listeners[ handler ] ], component);
    }
  }
}

module.exports = {
  created() {
    this.__dispatcherActive = false;
    addInterests(this);
  },
  attached() {
    this.__dispatcherActive = true;
  },
  detached() {
    this.__dispatcherActive = false;
  },
  emit(eventName, eventData) {
    Emitter.dispatch(eventName, eventData, this);
  }
};
