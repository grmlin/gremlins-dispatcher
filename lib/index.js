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