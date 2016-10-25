# gremlins-dispatcher

gremlin.js dispatcher mixin. Easy component interoperability.

## Installation

**requires `gremlins@1.1.x`**

### NPM

    $ npm install gremlins-dispatcher

## Usage

*At the moment, all listeners will be called, even if the component is not added to the visual dom*

```html
<listener-gremlin>
</listener-gremlin>

<dispatcher-gremlin>
</dispatcher-gremlin>
```

```js
const gremlins = require('gremlins');
const dispatcher = require('gremlins-dispatcher');
  
gremlins.create('listener-gremlin', {
    mixins: [dispatcher],
    getListeners(){
        return {
          'FOO': 'onFoo'
        };
    },
    onFoo(data) {
        console.log(data.foo);
    }
});  

gremlins.create('dispatcher-gremlin', {
    mixins: [dispatcher],

    ...

    someAction(){
      this.emit('FOO', {
        foo: 'foo'
      });
    }
});
```

## TODO

- add some sort of queue to have a consistent state across all components, even if they are not created yet.
