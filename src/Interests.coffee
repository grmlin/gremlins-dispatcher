class Controller
  cache = {}
  @registerHandler: (interest, handler, ctx) ->
    cache[interest] = cache[interest] ? []
    cache[interest].push {handler: handler, ctx: ctx}

  @dispatch: (interest, data) ->
    unless cache[interest] is undefined
      window.setTimeout =>
        item.handler.call item.ctx, data for item in cache[interest]
      , 10

addInterests = ->
  interests = @klass.interests ? {}
  for interest, handler of interests
    #console.log interest, @[handler]
    throw new Error("Handler \"#{handler}\" for the interest \"#{interest}\" is missing!") if typeof @[handler] isnt 'function'
    Controller.registerHandler interest, @[handler], @

Gremlin.Module 'interests',
  extend: (Gremlin) ->
    Gremlin::emit = (name, data) ->
      Controller.dispatch name, data

  bind: (gremlinInstance) ->
    addInterests.call gremlinInstance