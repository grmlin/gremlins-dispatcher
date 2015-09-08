'use strict';
var cache = {};

var Emitter = {
    registerHandler(handlerName, handler, spec) {
        if (typeof handler !== 'function') {
            throw new Error(`Handler for the interest ${handlerName} is missing!`);
        }
        cache[handlerName] = cache[handlerName] || [];
        cache[handlerName].push({
            handler: handler,
            spec: spec
        });
    },
    dispatch(handlerName, data) {
        if (cache[handlerName] !== undefined) {
            window.setTimeout(()=> {
                cache[handlerName].forEach(callbackObj => callbackObj.handler.call(callbackObj.spec, data));
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
    initialize() {
        addInterests(this);
    },
    emit(eventName, eventData) {
        Emitter.dispatch(eventName, eventData);
    }
};
