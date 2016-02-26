# gremlins-dispatcher

gremlin.js dispatcher mixin. Easy component interoperability.

## Installation

### NPM

    $ npm install gremlins-dispatcher

## Usage

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
