import { ExpressionModel, NoteModel, QuarterUnit } from '../../';
import '../helper';

describe('ExpressionModel', function () {

  function testNote({
    pitch = 0,
    duration = QuarterUnit
  } = {}) {
    return new NoteModel({ pitch, duration });
  }

  function testExpression({
    source = null,
    transform = 'multiply',
    options = { n: 4 },
    note = {}
  } = {}) {
    return new ExpressionModel({
      source: source || [ testNote(note) ], transform, options
    });
  }

  describe('transforms', function () {

    describe('curve', function () {
      describe('pitch', function () {
        it.todo('curves single notes');
        it.skip('curves expressions', function () {
          const expression = new ExpressionModel({
            source: testExpression(),
            transform: 'curve',
            options: {
              property: 'pitch',
              shape: 'linear',
              from: 'c4',
              to: 'd5'
            }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(4);
          expect(notes[0].pitch).toEqual('c4');
          expect(notes[1].pitch).toEqual('F#2');
          expect(notes[2].pitch).toEqual('F#2');
          expect(notes[3].pitch).toEqual('c5');
        });
      });

      describe('volume', function () {
        it.todo('curves single notes');

        it.skip('curves expressions', function () {
          const expression = new ExpressionModel({
            source: testExpression(),
            transform: 'curve',
            options: {
              property: 'volume',
              shape: 'linear',
              from: -15,
              to: 0
            }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(4);
          expect(notes[0].volume).toEqual(-15);
          expect(notes[1].volume).toEqual(-10);
          expect(notes[2].volume).toEqual(-5);
          expect(notes[3].volume).toEqual(0);
        });
      });

      it.skip('multiplies expressions', function () {
        const expression = new ExpressionModel({
          source: testExpression({ note: { pitch: 'd2' }}),
          transform: 'transpose',
          options: { interval: '3M' }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual('F#2');
        expect(notes[1].pitch).toEqual('F#2');
        expect(notes[2].pitch).toEqual('F#2');
        expect(notes[3].pitch).toEqual('F#2');
      });
    });

    describe('transpose', function () {
      it('transposes single notes', function () {
        const expression = new ExpressionModel({
          source: [ testNote({ pitch: 'c4' }) ],
          transform: 'transpose',
          options: { interval: '3M' }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(1);
        expect(notes[0].pitch).toEqual('E4');
      });

      it('multiplies expressions', function () {
        const expression = new ExpressionModel({
          source: testExpression({ note: { pitch: 'd2' }}),
          transform: 'transpose',
          options: { interval: '3M' }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual('F#2');
        expect(notes[1].pitch).toEqual('F#2');
        expect(notes[2].pitch).toEqual('F#2');
        expect(notes[3].pitch).toEqual('F#2');
      });
    });

    describe('multiply', function () {
      it('multiplies single notes', function () {
        const expression = new ExpressionModel({
          source: [ testNote() ],
          transform: 'multiply',
          options: { n: 2 }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(2);
        expect(notes[0].pitch).toEqual(0);
        expect(notes[0].duration).toEqual(QuarterUnit);
        expect(notes[1].pitch).toEqual(0);
        expect(notes[1].duration).toEqual(QuarterUnit);
      });

      it('multiplies expressions', function () {
        const expression = new ExpressionModel({
          source: testExpression(),
          transform: 'multiply',
          options: { n: 2 }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(8);
        expect(notes[0].pitch).toEqual(0);
        expect(notes[1].pitch).toEqual(0);
        expect(notes[2].pitch).toEqual(0);
        expect(notes[3].pitch).toEqual(0);
      });
    });

    describe('each', function () {
      it('transforms notes', function () {
        const expression = new ExpressionModel({
          source: [ testNote() ],
          transform: 'each',
          options: {
            fn: (note) => {
              return note.clone({ pitch: 18 });
            }
          }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(1);
        expect(notes[0].pitch).toEqual(18);
      });
      
      it('transforms expressions', function () {
        const expression = new ExpressionModel({
          source: testExpression(),
          transform: 'each',
          options: {
            fn: (note) => {
              return note.clone({ pitch: 18 });
            }
          }
        });

        const notes = expression.compile();

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual(18);
        expect(notes[1].pitch).toEqual(18);
        expect(notes[2].pitch).toEqual(18);
        expect(notes[3].pitch).toEqual(18);
      });
    });

    describe('randomize', function () {
      describe('pitch', function () {

        it('randomizes notes', function () {
          const expression = new ExpressionModel({
            source: [ testNote() ],
            transform: 'randomize',
            options: { property: 'pitch', values: [ 1, 2, 3, 4 ] }
          });

          const notes = expression.compile();

          expect(notes.length).toEqual(1);
          expect(expression.options.values.indexOf(notes[0].pitch)).toBeGreaterThan(-1);
        });
      
        it('randomizes expressions', function () {
          const expression = new ExpressionModel({
            source: testExpression(),
            transform: 'randomize',
            options: { property: 'pitch', values: [ 1, 2, 3, 4 ] }
          });

          const notes = expression.compile();

          expect(notes.length).toEqual(4);

          expect(expression.options.values.indexOf(notes[0].pitch))
            .toBeGreaterThan(-1);
          expect(expression.options.values.indexOf(notes[1].pitch))
            .toBeGreaterThan(-1);
          expect(expression.options.values.indexOf(notes[2].pitch))
            .toBeGreaterThan(-1);
          expect(expression.options.values.indexOf(notes[3].pitch))
            .toBeGreaterThan(-1);
        });
      });
    });

    describe('cycle', function () {
      describe('pitch', function () {
        it('cycles notes', function () {
          const expression = new ExpressionModel({
            source: testNote(),
            transform: 'cycle',
            options: { property: 'pitch', values: [ 1, 2, 3 ] }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(1);
          expect(notes[0].pitch).toEqual(1);
        });

        it('cycles expressions', function () {
          const expression = new ExpressionModel({
            source: testExpression(),
            transform: 'cycle',
            options: { property: 'pitch', values: [ 1, 2, 3 ] }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(4);
          expect(notes[0].pitch).toEqual(1);
          expect(notes[1].pitch).toEqual(2);
          expect(notes[2].pitch).toEqual(3);
          expect(notes[3].pitch).toEqual(1);
        });

        it('cycles expressions in reverse', function () {
          const expression = new ExpressionModel({
            source: testExpression(),
            transform: 'cycle',
            options: { reverse: true, property: 'pitch', values: [ 1, 2, 3 ] }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(4);
          expect(notes[0].pitch).toEqual(3);
          expect(notes[1].pitch).toEqual(2);
          expect(notes[2].pitch).toEqual(1);
          expect(notes[3].pitch).toEqual(3);
        });  
      });
    });

    describe('bounce', function () {
      describe('pitch', function () {
        it('bounces notes', function () {
          const expression = new ExpressionModel({
            source: testNote(),
            transform: 'cycle',
            options: { property: 'pitch', values: [ 1, 2, 3 ] }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(1);
          expect(notes[0].pitch).toEqual(1);
        });

        it('bounces expressions', function () {
          const expression = new ExpressionModel({
            source: testExpression({ options: { n: 8 }}),
            transform: 'bounce',
            options: { property: 'pitch', values: [ 1, 2, 3 ] }
          });
  
          const notes = expression.compile();
  
          expect(notes.length).toEqual(8);
          expect(notes[0].pitch).toEqual(1);
          expect(notes[1].pitch).toEqual(2);
          expect(notes[2].pitch).toEqual(3);
          expect(notes[3].pitch).toEqual(2);
          expect(notes[4].pitch).toEqual(1);
          expect(notes[5].pitch).toEqual(2);
          expect(notes[6].pitch).toEqual(3);
          expect(notes[7].pitch).toEqual(2);
        });  
      });
    });
  });

});