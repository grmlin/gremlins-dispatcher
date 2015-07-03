# gremlins-dispatcher

gremlin.js dispatcher mixin. Easy component interoperability.

## Installation

### NPM

    $ npm install gremlins-dispatcher
    
### Bower
    
    $ bower install gremlins-dispatcher
    
### Classic

download from `dist` 

    <script src="gremlins-dispatcher.js" />

## Usage

```html
<listener-gremlin>
</listener-gremlin>

<dispatcher-gremlin>
</dispatcher-gremlin>
```

```js
var gremlins = require('gremlins'),
  dispatcher = require('gremlins-dispatcher'); 
  
gremlins.create('listener-gremlin', {
    mixins: [dispatcher],
    listeners: {
      'FOO': 'onFoo'
    },
    onFoo(data) {
        console.log(data.foo);
    }
});  

gremlins.create('dispatcher-gremlin', {
    mixins: [dispatcher],
    someAction(){
      this.emit('FOO', {
        foo: 'foo'
      });
    }
});
```
