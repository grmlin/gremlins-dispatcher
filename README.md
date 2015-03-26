# gremlins-interests

gremlin.js interests (PubSub) extension

## Installation

### NPM

    $ npm install gremlins-interests
    
### Bower
    
    $ bower install gremlins-interests
    
### Classic

download from `dist` 

    <script src="gremlins-interests.js" />

## Usage

```html
<listener-gremlin>
</listener-gremlin>

<dispatcher-gremlin>
</dispatcher-gremlin>
```

```js
var gremlins = require('gremlins'),
  gremlinsInterests = require('gremlins-interests');
  
gremlins.create({
    mixins: [gremlinsInterests],
    name: 'listener',
    interests: {
      'FOO': 'onFoo'
    },
    onFoo(data) {
        console.log(data.foo);
    }
});  

gremlins.create({
    mixins: [gremlinsInterests],
    name: 'dispatcher',
    someAction(){
      this.emit('FOO', {
        foo: 'foo'
      });
    }
});
```
