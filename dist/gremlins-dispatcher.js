(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlinsDispatcher = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var cache = {};

var Emitter = {
	registerHandler: function registerHandler(handlerName, handler, spec) {
		if (typeof handler !== "function") {
			throw new Error("Handler for the interest " + handlerName + " is missing!");
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
	var handlers = spec.listeners || {};

	for (var handler in handlers) {
		if (handlers.hasOwnProperty(handler)) {
			Emitter.registerHandler(handler, spec[handlers[handler]], spec);
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

},{}]},{},[1])(1)
});