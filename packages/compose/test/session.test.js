import { SessionModel } from '@composer/core';
import { session, SessionComposer, ComposerError } from '../';

describe('session', function () {
  it('creates a session', function () {
    const result = session('my-song', ({ session }) => {
      session.at(0).meter([ 4, 4 ]);
      session.at(0).tempo(100);
      session.at(0).swing(0.4);
      session.at(0).key('c');
      session.at(0).scale('major');
    });

    expect(result).toBeInstanceOf(SessionComposer);
    expect(result.model).toBeInstanceOf(SessionModel);
    expect(result.model.events.length).toEqual(5);

    const events = result.model.events.records;

    expect(events[0].at.toMBS()).toEqual('0:0:0')
    expect(events[1].at.toMBS()).toEqual('0:0:0')
    expect(events[2].at.toMBS()).toEqual('0:0:0')
    expect(events[3].at.toMBS()).toEqual('0:0:0')
    expect(events[4].at.toMBS()).toEqual('0:0:0')
  });

  describe('#at()', function () {
    describe("valid locators", function () {
      [
        {
          input: [ 1 ],
          output: '1:0:0'
        },
        {
          input: [ 1, 2 ],
          output: '1:2:0'
        },
        {
          input: [ 1, 2, 3 ],
          output: '1:2:3'
        },
        {
          input: [ '1' ],
          output: '1:0:0'
        },
        {
          input: [ '1', '2' ],
          output: '1:2:0'
        },
        {
          input: [ '1', '2', '3' ],
          output: '1:2:3'
        },
        {
          input: [ '1', '4.255', '0.456' ],
          output: '1:4.255:0.456'
        },
        {
          input: [ '1:2:3' ],
          output: '1:2:3'
        },
        {
          input: [ '1:4.255:0.456' ],
          output: '1:4.255:0.456'
        },
      ].forEach((scenario) => {
        it(`accepts "${scenario.input}"`, () => {
          const results = session('test', ({ session }) => {
            session.at.apply(session, scenario.input).key('a');
          });

          expect(results.model.events.first().at.toMBS()).toEqual(scenario.output);
        });  
      });
    });

    describe("invalid locators", function () {
      [
        [ "bob" ],
        [ "0:x:4" ],
        [ 0, 4, "x" ],
        [ "1:2:3", 4, 5 ],
      ].forEach((args) => {
        it(`rejects "bob"`, () => {
          expect(() => {
            session('test', ({ session }) => {
              session.at.apply(session, args).key('a');
            })
          }).toThrow(ComposerError);
        });  
      });
    });
  });

  describe("proxied functions", function () {

    describe('#annotate()', function () {
      it('adds an annotation record', function () {
        const results = session('test', ({ session }) => {
          session.at(10).annotate('verse-1');
        });

        const annotations = results.model.annotations;
        const annotation = annotations.first();

        expect(annotations.length).toEqual(1);

        expect(annotation.position.measure).toEqual(10);
        expect(annotation.position.beat).toEqual(0);
        expect(annotation.position.subdivision).toEqual(0);
        expect(annotation.name).toEqual('verse-1');
      });

      it('ensures annotations are unique', function () {
        expect(() => {
          session('test', ({ session }) => {
            session.at(10).annotate('verse-1');
            session.at(20).annotate('verse-1');
          });
        }).toThrow(ComposerError);
      });

      it('can be used by at()', function () {
        const results = session('test', ({ session }) => {
          session.at(10).annotate('verse-1');
          session.at('verse-1').tempo(120);
        });

        const events = results.model.events;
        const event = events.first();

        expect(event.at.measure).toEqual(10);
        expect(event.at.beat).toEqual(0);
        expect(event.at.subdivision).toEqual(0);
        expect(event.value).toEqual(120);
        expect(event.type).toEqual('tempo');
      });
    });

    describe("#meter()", function () {
      describe("valid arguments", function () {
        [
          {
            input: [ 'a' ],
            output: 'A'
          },
          {
            input: [ 'ab' ],
            output: 'Ab'
          },
          {
            input: [ 'c####' ],
            output: 'E'
          },
        ].forEach((scenario) => {
          it(`accepts "${scenario.input}"`, () => {
            const results = session('test', ({ session }) => {
              session.at(0).key(scenario.input);
            });
  
            expect(results.model.events.first().value[0]).toEqual(scenario.output);
          });  
        });
      });
      describe("invalid arguments", function () {
        [
          [ "bob" ],
          [ "0:x:4" ],
          [ 12345 ]
        ].forEach((scenario) => {
          it(`rejects "${scenario}"`, () => {
            expect(() => {
              session('test', ({ session }) => {
                session.at(0).key(scenario);
              })
            }).toThrow(ComposerError);
          });  
        });
      });
    });

    describe("#tempo()", function () {
      describe("valid arguments", function () {
        it.todo("creates an event");
      });
      describe("invalid arguments", function () {
        it.todo("throws an error");
      });
    });

    describe("#swing()", function () {
      describe("valid arguments", function () {
        it.todo("creates an event");
      });
      describe("invalid arguments", function () {
        it.todo("throws an error");
      });
    });

    describe("#key()", function () {
      describe("valid arguments", function () {
        it.todo("creates an event");
      });
      describe("invalid arguments", function () {
        it.todo("throws an error");
      });
    });

    describe("#scale()", function () {
      describe("valid arguments", function () {
        it.todo("creates an event");
      });
      describe("invalid arguments", function () {
        it.todo("throws an error");
      });
    });


  });

});