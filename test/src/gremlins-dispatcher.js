'use strict';

var gremlins   = require('gremlins'),
    dispatcher = require('../../lib/index');

describe('gremlinjs-dispatcher', function () {

  it('augments gremlin instances', function (done) {
    this.timeout(5000);
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
          expect(count).to.equal(3);
          expect(data).to.be.an('object');
          expect(data.foo).to.equal('foo');
          setTimeout(done, 500);
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
      attached() {
        window.setTimeout(()=>this.emit('FOO', {foo: 'foo'}), 500);
      },
      onFoo() {
        throw new Error('The dispatching components callback should not be called');
      }
    });

    gremlins.create('interests3-gremlin', {
      mixins: [dispatcher],
      getListeners(){
        return {
          'FOO': 'onFoo'
        };
      },
      created() {

      },
      onFoo() {
        throw new Error('Components outside the dom should not be called');
      }
    });

    var el  = document.createElement('interests-gremlin');
    var el2 = document.createElement('interests2-gremlin');
    var el3 = document.createElement('interests-gremlin');
    var el4 = document.createElement('interests3-gremlin');

    document.body.appendChild(el4);

    setTimeout(() =>{
      document.body.removeChild(el4);
      el4 = null;

      setTimeout(() =>{
        document.body.appendChild(el);
        document.body.appendChild(el2);
        el2 = null;
        el4 = null;
        el = null;
      }, 500);
    }, 500);


  });


});
