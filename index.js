'use strict';
var cache = {};

var Emitter = {
	registerHandler(interest, handler, spec) {
		if (typeof handler !== 'function') {
			throw new Error(`Handler for the interest ${interest} is missing!`);
		}
		cache[interest] = cache[interest] || [];
		cache[interest].push({
			handler: handler,
			spec: spec
		});
	},
	dispatch(interest, data) {
		if (cache[interest] !== undefined) {
			window.setTimeout(()=> {
				cache[interest].forEach(callbackObj => callbackObj.handler.call(callbackObj.spec, data));
			}, 10);
		}
	}
};

function addInterests(spec) {
	var interests = spec.interests || {};

	for (var interest in interests) {
		if (interests.hasOwnProperty(interest)) {
			Emitter.registerHandler(interest, spec[interests[interest]], spec);
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
