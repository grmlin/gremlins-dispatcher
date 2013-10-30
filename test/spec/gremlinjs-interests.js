// TODO: event map exceptions


describe('gremlinjs-interests', function () {

    it('reads interests from a gremlin and listens', function (done) {
        var elA = document.createElement('div'),
            elB = document.createElement('div'),
            elC = document.createElement('div'),
            data = {
                foo: 'foo'
            },
            eventsCatched = 0;

        elA.setAttribute('data-gremlin', 'InterestsMapDispatcher');
        elB.setAttribute('data-gremlin', 'InterestsMapListener');
        elC.setAttribute('data-gremlin', 'InterestsMapListener');

        document.body.appendChild(elB);
        document.body.appendChild(elC);
        document.body.appendChild(elA);

        G.define('InterestsMapDispatcher', function () {
                this.emit('FOO', data)
            },
            {

            },
            {
                include: 'interests'
            }
        );
        G.define('InterestsMapListener', function () {

            },
            {
                onFoo: function (evtData) {
                    try {
                        expect(evtData).to.eql(data);
                        if (++eventsCatched === 2) {
                            done();
                        }
                    } catch (e) {
                        done(e);
                    }
                }
            },
            {
                include: 'interests',
                interests: {
                    'FOO': 'onFoo'
                }
            }
        );
    });

});