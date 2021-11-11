import { ExpressionModel, NoteModel, QuarterUnit } from '../../';
import '../helper';

describe('ExpressionModel', function () {

  function testNote({
    pitch = 0,
    duration = QuarterUnit,
    velocity = null,
  } = {}) {
    return NoteModel.parse({ pitch, duration, velocity });
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

    function compileExpression({ transform, source, options }) {
      const expression = new ExpressionModel({
        transform, source, options
      });

      return expression.compile();
    }

    describe('curve', function () {

      function compileCurveExpression({ source, ...options }) {
        return compileExpression({
          transform: 'curve', source, options
        });
      }

      describe('pitch', function () {

        describe('relative', function () {
          describe('fixed to/from', function () {
            it('curves single notes', function () {
              const notes = compileCurveExpression({
                source: [ testNote({ pitch: 'c4' }) ],
                property: 'pitch',
                from: 12,
                to: 20
              });
            
              expect(notes.length).toEqual(1);
              expect(notes[0].pitch).toEqual(12);
            });

            it('curves in-key expressions', function () {
              const notes = compileCurveExpression({
                source: testExpression({ note: { pitch: 7 }}),
                property: 'pitch',
                from: 0,
                to: 11,
                chromatic: false
              });
            
              expect(notes.length).toEqual(4);
              expect(notes[0].pitch).toEqual(0);
              expect(notes[1].pitch).toEqual(4);
              expect(notes[2].pitch).toEqual(7);
              expect(notes[3].pitch).toEqual(11);
            });
            
            it('curves chromatic expressions', function () {
              const notes = compileCurveExpression({
                source: testExpression({ note: { pitch: 7 }}),
                property: 'pitch',
                from: 0,
                to: 11
              });
            
              expect(notes.length).toEqual(4);
              expect(notes[0].pitch).toEqual(0);
              expect(notes[1].pitch).toEqual(3.5);
              expect(notes[2].pitch).toEqual(7.5);
              expect(notes[3].pitch).toEqual(11);
            });
          });
        });

        describe('absolute', function () {

          describe('variable origin', function () {
            it('curves single notes', function () {
              const notes = compileCurveExpression({
                source: [ testNote({ pitch: 'c4' }) ],
                property: 'pitch',
                from: null,
                to: 'd5'
              });
            
              expect(notes.length).toEqual(1);
              expect(notes[0].pitch).toEqual('C4');
            });
            
            it('curves expressions', function () {
              const notes = compileCurveExpression({
                source: testExpression({ note: { pitch: 'c0' }}),
                property: 'pitch',
                from: null,
                to: 'd5'
              });
            
              expect(notes.length).toEqual(4);
              expect(notes[0].pitch).toEqual('C0');
              expect(notes[1].pitch).toEqual('A1');
              expect(notes[2].pitch).toEqual('F3');
              expect(notes[3].pitch).toEqual('D5');
            });
          });

          describe('fixed to/from', function () {
            it('curves single notes', function () {
              const notes = compileCurveExpression({
                source: [ testNote({ pitch: 'c4' }) ],
                property: 'pitch',
                from: 'c0',
                to: 'd5'
              });
            
              expect(notes.length).toEqual(1);
              expect(notes[0].pitch).toEqual('C0');
            });
            
            it('curves expressions', function () {
              const notes = compileCurveExpression({
                source: testExpression({ note: { pitch: 'c4' }}),
                property: 'pitch',
                from: 'c0',
                to: 'd5'
              });
            
              expect(notes.length).toEqual(4);
              expect(notes[0].pitch).toEqual('C0');
              expect(notes[1].pitch).toEqual('A1');
              expect(notes[2].pitch).toEqual('F3');
              expect(notes[3].pitch).toEqual('D5');
            });
          });
        });
      });

      describe('velocity', function () {
        describe('variable origin', function () {
          it('curves single notes', function () {
            const notes = compileCurveExpression({
              source: [ testNote({ pitch: 'c4', velocity: 0 }) ],
              property: 'velocity',
              from: null,
              to: 1
            });
          
            expect(notes.length).toEqual(1);
            expect(notes[0].velocity).toEqual(0);
          });
          
          it('curves expressions', function () {
            const notes = compileCurveExpression({
              source: testExpression({ note: { pitch: 'c0', velocity: 1 }}),
              property: 'velocity',
              from: null,
              to: 0.5
            });
          
            expect(notes.length).toEqual(4);
            expect(notes[0].velocity).toEqual(1);
            expect(notes[1].velocity).toEqual(0.83);
            expect(notes[2].velocity).toEqual(0.67);
            expect(notes[3].velocity).toEqual(0.5);
          });
        });

        describe('fixed to/from', function () {
          it('curves single notes', function () {
            const notes = compileCurveExpression({
              source: [ testNote({ pitch: 'c4' }) ],
              property: 'velocity',
              from: 0.1,
              to: 0.15
            });
          
            expect(notes.length).toEqual(1);
            expect(notes[0].velocity).toEqual(0.1);
          });
          
          it('curves descending expressions', function () {
            const notes = compileCurveExpression({
              source: testExpression({ note: { pitch: 'c4' }}),
              property: 'velocity',
              from: 1,
              to: 0.2
            });
          
            expect(notes.length).toEqual(4);
            expect(notes[0].velocity).toEqual(1);
            expect(notes[1].velocity).toEqual(0.73);
            expect(notes[2].velocity).toEqual(0.47);
            expect(notes[3].velocity).toEqual(0.20);
          });

          it('curves ascending expressions', function () {
            const notes = compileCurveExpression({
              source: testExpression({ note: { pitch: 'c4' }}),
              property: 'velocity',
              from: 0.01,
              to: 1
            });
          
            expect(notes.length).toEqual(4);
            expect(notes[0].velocity).toEqual(0.01);
            expect(notes[1].velocity).toEqual(0.34);
            expect(notes[2].velocity).toEqual(0.67);
            expect(notes[3].velocity).toEqual(1);
          });
        });
      });
    });

    describe('transpose', function () {

      function compileTransposeExpression({ source, ...options }) {
        return compileExpression({
          transform: 'transpose', source, options
        });
      }

      it('transposes single notes', function () {
        const notes = compileTransposeExpression({
          source: [ testNote({ pitch: 'c4' }) ],
          interval: '3M'
        });

        expect(notes.length).toEqual(1);
        expect(notes[0].pitch).toEqual('E4');
      });

      it('multiplies expressions', function () {
        const notes = compileTransposeExpression({
          source: testExpression({ note: { pitch: 'd2' }}),
          interval: '3M'
        });

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual('F#2');
        expect(notes[1].pitch).toEqual('F#2');
        expect(notes[2].pitch).toEqual('F#2');
        expect(notes[3].pitch).toEqual('F#2');
      });
    });

    describe('multiply', function () {

      function compileMultiplyExpression({ source, ...options }) {
        return compileExpression({
          transform: 'multiply', source, options
        });
      }

      it('multiplies single notes', function () {
        const notes = compileMultiplyExpression({
          source: [ testNote() ],
          n: 2
        });

        expect(notes.length).toEqual(2);
        expect(notes[0].pitch).toEqual(0);
        expect(notes[0].duration).toEqual(QuarterUnit);
        expect(notes[1].pitch).toEqual(0);
        expect(notes[1].duration).toEqual(QuarterUnit);
      });

      it('multiplies expressions', function () {
        const notes = compileMultiplyExpression({
          source: testExpression(),
          n: 2
        });

        expect(notes.length).toEqual(8);
        expect(notes[0].pitch).toEqual(0);
        expect(notes[1].pitch).toEqual(0);
        expect(notes[2].pitch).toEqual(0);
        expect(notes[3].pitch).toEqual(0);
      });
    });

    describe('each', function () {

      function compileEachExpression({ source, ...options }) {
        return compileExpression({
          transform: 'each', source, options 
        });
      }

      it('transforms notes', function () {
        const notes = compileEachExpression({
          source: [ testNote() ],
          fn: (note) => {
            return note.clone({ pitch: 18 });
          }
        });

        expect(notes.length).toEqual(1);
        expect(notes[0].pitch).toEqual(18);
      });
      
      it('transforms expressions', function () {
        const notes = compileEachExpression({
          source: testExpression(),
          fn: (note) => {
            return note.clone({ pitch: 18 });
          }
        });

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual(18);
        expect(notes[1].pitch).toEqual(18);
        expect(notes[2].pitch).toEqual(18);
        expect(notes[3].pitch).toEqual(18);
      });
    });

    describe('randomize', function () {

      function compileRandomizeExpression({ source, ...options }) {
        return compileExpression({
          transform: 'randomize', source, options
        });
      }

      describe('pitch', function () {

        it('randomizes notes', function () {
          const notes = compileRandomizeExpression({
            source: [ testNote() ],
            property: 'pitch',
            values: [ 1, 2, 3, 4 ]
          });

          expect(notes.length).toEqual(1);
          expect([ 1, 2, 3, 4 ]).toContain(notes[0].pitch);
        });
      
        it('randomizes expressions', function () {
          const notes = compileRandomizeExpression({
            source: testExpression(),
            property: 'pitch',
            values: [ 1, 2, 3, 4 ]
          });

          expect(notes.length).toEqual(4);

          expect([ 1, 2, 3, 4 ]).toContain(notes[0].pitch);
          expect([ 1, 2, 3, 4 ]).toContain(notes[1].pitch);
          expect([ 1, 2, 3, 4 ]).toContain(notes[2].pitch);
          expect([ 1, 2, 3, 4 ]).toContain(notes[3].pitch);
        });
      });
    });

    describe('cycle', function () {

      function compileCycleExpression({ source, ...options }) {
        return compileExpression({
          transform: 'cycle', source, options
        });
      }

      describe('pitch', function () {
        it('cycles notes', function () {
          const notes = compileCycleExpression({
            source: testNote(),
            property: 'pitch',
            values: [ 1, 2, 3 ]
          });
    
          expect(notes.length).toEqual(1);
          expect(notes[0].pitch).toEqual(1);
        });

        it('cycles expressions', function () {
          const notes = compileCycleExpression({
            source: testExpression(),
            property: 'pitch',
            values: [ 1, 2, 3 ]
          });
  
          expect(notes.length).toEqual(4);
          expect(notes[0].pitch).toEqual(1);
          expect(notes[1].pitch).toEqual(2);
          expect(notes[2].pitch).toEqual(3);
          expect(notes[3].pitch).toEqual(1);
        });

        it('cycles expressions in reverse', function () {
          const notes = compileCycleExpression({
            source: testExpression(),
            property: 'pitch',
            values: [ 1, 2, 3 ],
            reverse: true,
          });
    
          expect(notes.length).toEqual(4);
          expect(notes[0].pitch).toEqual(3);
          expect(notes[1].pitch).toEqual(2);
          expect(notes[2].pitch).toEqual(1);
          expect(notes[3].pitch).toEqual(3);
        });  
      });
    });

    describe('bounce', function () {

      function compileBounceExpression({ source, ...options }) {
        return compileExpression({
          transform: 'bounce', source, options
        });
      }

      describe('pitch', function () {
        it('bounces notes', function () {
          const notes = compileBounceExpression({
            source: testNote(),
            property: 'pitch',
            values: [ 1, 2, 3 ],
          });
    
          expect(notes.length).toEqual(1);
          expect(notes[0].pitch).toEqual(1);
        });

        it('bounces expressions', function () {
          const notes = compileBounceExpression({
            source: testExpression({ options: { n: 8 }}),
            property: 'pitch',
            values: [ 1, 2, 3 ]
          });
  
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

    describe('ascend', function () {

      function compileAscendExpression({ source, ...options }) {
        return compileExpression({
          transform: 'ascend', source, options
        });
      }

      it('supports notes', function () {
        const notes = compileAscendExpression({
          source: testNote({ pitch: 'c4' }),
          to: 'c7',
        });
  
        expect(notes.length).toEqual(1);
        expect(notes[0].pitch).toEqual('C4');
      });

      it('supports expressions', function () {
        const notes = compileAscendExpression({
          source: testExpression({ note: { pitch: 'a3' }}),
          to: 'c7',
        });

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual('A3');
        expect(notes[1].pitch).toEqual('Bb4');
        expect(notes[2].pitch).toEqual('B5');
        expect(notes[3].pitch).toEqual('C7');
      });  
    });

    describe('descend', function () {

      function compileDescendExpression({ source, ...options }) {
        return compileExpression({
          transform: 'descend', source, options
        });
      }

      it('supports notes', function () {
        const notes = compileDescendExpression({
          source: testNote({ pitch: 'c4' }),
          to: 'c0',
        });
  
        expect(notes.length).toEqual(1);
        expect(notes[0].pitch).toEqual('C4');
      });

      it('supports expressions', function () {
        const notes = compileDescendExpression({
          source: testExpression({ note: { pitch: 'ab3' }}),
          to: 'c0',
        });

        expect(notes.length).toEqual(4);
        expect(notes[0].pitch).toEqual('Ab3');
        expect(notes[1].pitch).toEqual('F2');
        expect(notes[2].pitch).toEqual('Eb1');
        expect(notes[3].pitch).toEqual('C0');
      });  
    });
  });

});