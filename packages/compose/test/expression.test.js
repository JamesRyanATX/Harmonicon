import { expression } from '../src/expression';
import { eighth, whole } from '../';
import { NoteModel } from '@composer/core';

describe('expression', function () {

  it('compiles chained expressions', function () {
    const subject = expression([
      eighth.note('c3')
        .multiply(64)
        .cycle('pitch', [ 0, 2, 4, 8, -7, -1 ]),
      eighth.note('c3')
        .multiply(16)
        .cycle('pitch', [ 'Bb2', 'D3', 'F3', 'D3', 'G3' ]),
      whole.note('*Bbmaj7', { octave: 2 }),
    ]);

    const compiled = subject.compile();

    expect(compiled).toBeInstanceOf(Array);
    expect(compiled.length).toEqual(81);
  });

  it('compiles basic chord progressions', function () {
    const subject = expression([
      whole.note('c2 e2 a2'),
      whole.note('*Bbmaj7', { octave: 2 }),
    ]);

    const compiled = subject.compile();

    expect(compiled).toBeInstanceOf(Array);
    expect(compiled.length).toEqual(2);

    expect(compiled[0]).toBeInstanceOf(Array);
    expect(compiled[0].length).toEqual(3);
    expect(compiled[0][0]).toBeInstanceOf(NoteModel);
    expect(compiled[0][1]).toBeInstanceOf(NoteModel);
    expect(compiled[0][2]).toBeInstanceOf(NoteModel);

    expect(compiled[1]).toBeInstanceOf(Array);
    expect(compiled[1].length).toEqual(4);
    expect(compiled[1][0]).toBeInstanceOf(NoteModel);
    expect(compiled[1][1]).toBeInstanceOf(NoteModel);
    expect(compiled[1][2]).toBeInstanceOf(NoteModel);
    expect(compiled[1][3]).toBeInstanceOf(NoteModel);

  });

  it('noops nested expressions', function () {
    const subject = expression([
      expression(whole.note('c2 e2 a2')),
      expression(whole.note('*Bbmaj7', { octave: 2 })),
    ]);

    const compiled = subject.compile();

    expect(compiled).toBeInstanceOf(Array);
    expect(compiled.length).toEqual(2);

    expect(compiled[0]).toBeInstanceOf(Array);
    expect(compiled[0].length).toEqual(3);
    expect(compiled[0][0]).toBeInstanceOf(NoteModel);
    expect(compiled[0][1]).toBeInstanceOf(NoteModel);
    expect(compiled[0][2]).toBeInstanceOf(NoteModel);

    expect(compiled[1]).toBeInstanceOf(Array);
    expect(compiled[1].length).toEqual(4);
    expect(compiled[1][0]).toBeInstanceOf(NoteModel);
    expect(compiled[1][1]).toBeInstanceOf(NoteModel);
    expect(compiled[1][2]).toBeInstanceOf(NoteModel);
    expect(compiled[1][3]).toBeInstanceOf(NoteModel);
  });
});