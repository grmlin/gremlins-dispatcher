# gremlins-interests

gremlin.js interests (PubSub) extension

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
  
gremlins.create({
    mixins: [dispatcher],
    name: 'listener',
    handlers: {
      'FOO': 'onFoo'
    },
    onFoo(data) {
        console.log(data.foo);
    }
});  

gremlins.create({
    mixins: [dispatcher],
    name: 'dispatcher',
    someAction(){
      this.emit('FOO', {
        foo: 'foo'
      });
    }
});
```
