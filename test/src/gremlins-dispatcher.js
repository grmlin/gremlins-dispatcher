'use strict';

var gremlins   = require('gremlins'),
    dispatcher = require('../../lib/index');

describe('gremlinjs-dispatcher', function () {

  it('augments gremlin instances', function (done) {
    var count = 0;

    gremlins.create('interests-gremlin', {
      mixins: [dispatcher],
      getListeners(){
        return {
          'FOO': 'onFoo'
        };
      },
      created() {
        try {
          expect(this.emit).to.be.a('function');
          count++;//done();
        } catch (e) {
          done(e);
        }
      },
      onFoo(data) {
        count++;
        try {
          expect(count).to.equal(2);
          expect(data).to.be.an('object');
          expect(data.foo).to.equal('foo');
          done();
        } catch (e) {
          done(e);
        }
      }
    });

    gremlins.create('interests2-gremlin', {
      mixins: [dispatcher],
      getListeners(){
        return {
          'FOO': 'onFoo'
        };
      },
      created() {
        window.setTimeout(()=>this.emit('FOO', {foo: 'foo'}), 500);
      },
      onFoo() {
        throw new Error('The dispatching components callback should not be called');
      }
    });

    var el  = document.createElement('interests-gremlin');
    var el2 = document.createElement('interests2-gremlin');
    document.body.appendChild(el);
    document.body.appendChild(el2);
  });


});
