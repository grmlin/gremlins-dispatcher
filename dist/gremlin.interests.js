//@ sourceMappingURL=gremlin.interests.map
(function() {
  var Controller, addInterests;

  Controller = (function() {
    var cache;

    function Controller() {}

    cache = {};

    Controller.registerHandler = function(interest, handler, ctx) {
      var _ref;
      cache[interest] = (_ref = cache[interest]) != null ? _ref : [];
      return cache[interest].push({
        handler: handler,
        ctx: ctx
      });
    };

    Controller.dispatch = function(interest, data) {
      var _this = this;
      if (cache[interest] !== void 0) {
        return window.setTimeout(function() {
          var item, _i, _len, _ref, _results;
          _ref = cache[interest];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(item.handler.call(item.ctx, data));
          }
          return _results;
        }, 10);
      }
    };

    return Controller;

  })();

  addInterests = function() {
    var handler, interest, interests, _ref, _results;
    interests = (_ref = this.klass.interests) != null ? _ref : {};
    _results = [];
    for (interest in interests) {
      handler = interests[interest];
      if (typeof this[handler] !== 'function') {
        throw new Error("Handler \"" + handler + "\" for the interest \"" + interest + "\" is missing!");
      }
      _results.push(Controller.registerHandler(interest, this[handler], this));
    }
    return _results;
  };

  Gremlin.Module('interests', {
    extend: function(Gremlin) {
      return Gremlin.prototype.emit = function(name, data) {
        return Controller.dispatch(name, data);
      };
    },
    bind: function(gremlinInstance) {
      return addInterests.call(gremlinInstance);
    }
  });

}).call(this);
