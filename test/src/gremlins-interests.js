var gremlins = require('gremlins'),
	gremlinsInterests = require('../../index');

describe('gremlinjs-interests', function () {

	it('augments gremlin instances', function (done) {
		var count = 0;

		gremlins.create({
			mixins: [gremlinsInterests],
			name: 'interests',
			interests: {
				'FOO': 'onFoo'
			},
			initialize() {
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

		gremlins.create({
			mixins: [gremlinsInterests],
			name: 'interests2',
			initialize() {
				window.setTimeout(()=>this.emit('FOO', {foo: 'foo'}), 100);
			}
		});

		var el = document.createElement('interests-gremlin');
		var el2 = document.createElement('interests2-gremlin');
		document.body.appendChild(el);
		document.body.appendChild(el2);
	});


});
