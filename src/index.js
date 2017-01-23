'use strict';
const cache = {};

const Emitter = {
  registerHandler(handlerName, handler, component) {
    if (typeof handler !== 'function') {
      throw new Error(`<${component.name} /> — Handler for the interest ${handlerName} is missing!`);
    }

    if (cache[ handlerName ] === undefined) {
      cache[ handlerName ] = [];
    }

    cache[ handlerName ].push({
      handler: handler,
      component: component
    });
  },
  unregisterHandler(handlerName, component) {
    if (cache[ handlerName ] !== undefined) {
      cache[ handlerName ] = cache[ handlerName ].filter(callbackObj => callbackObj.component !== component);
    }
  },
  dispatch(handlerName, data, component) {
    if (cache[ handlerName ] !== undefined) {
      window.setTimeout(() => {
        cache[ handlerName ].forEach(callbackObj => {
          if (callbackObj.component !== component) {
            callbackObj.handler.call(callbackObj.component, data);
          }
        });
      }, 10);
    }
  }
};

function addInterests(component) {
  const listeners = typeof component.getListeners === 'function' ? component.getListeners() : {};

  for (const handler in listeners) {
    if (listeners.hasOwnProperty(handler)) {
      Emitter.registerHandler(handler, component[ listeners[ handler ] ], component);
    } else {
      console.warn(`registering interest "${handler}" failed`, component)
    }
  }
}

function removeInterests(component) {
  const listeners = typeof component.getListeners === 'function' ? component.getListeners() : {};
  for (const handler in listeners) {
    if (listeners.hasOwnProperty(handler)) {
      Emitter.unregisterHandler(handler, component);
    }
  }
}

module.exports = {
  attached() {
    addInterests(this);
  },
  detached() {
    removeInterests(this);
  },
  emit(eventName, eventData) {
    Emitter.dispatch(eventName, eventData, this);
  }
};
