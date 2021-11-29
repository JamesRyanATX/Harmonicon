import { ExpressionModel } from '@composer/core';
import { ModelValidationError } from '@composer/util';

import {
  session,
  whole,
  half,
  quarter,
  eighth,
  sixteenth,
  thirtySecond,
  sixtyFourth,
} from '../';

function testPhrase(sequence) {
  const results = {};

  session('my-song', function ({ session }) {
    session.phrase('a-phrase', ({ phrase }) => {
      if (sequence) {
        phrase.sequence(sequence);
      }
      else {
        phrase.sequence(
          whole.note(0),
          half.note(1),
          quarter.note(2),
          eighth.note(3),
          sixteenth.note(4),
          thirtySecond.note(5),
          sixtyFourth.note(6),
        );  
      }

      results.phrase = phrase;
      results.session = session;
    });
  });

  return results;
}

describe('session.phrase', function () {
  it('parses phrases', function () {
    const { session, phrase } = testPhrase();
    
    expect(session.model.phrases.length).toEqual(1);
    expect(phrase.model.name).toEqual('a-phrase');
    expect(phrase.model.sequence).toBeInstanceOf(ExpressionModel);
    expect(phrase.model.sequence.length).toEqual(7);
  });

  it('parses phrases as arrays', function () {
    const { session, phrase } = testPhrase([
      whole.note(0),
      half.note(1),
      quarter.note(2),
      eighth.note(3),
      sixteenth.note(4),
      thirtySecond.note(5),
      sixtyFourth.note(6),
    ]);
    
    expect(session.model.phrases.length).toEqual(1);
    expect(phrase.model.name).toEqual('a-phrase');
    expect(phrase.model.sequence.length).toEqual(7);
  });

  it('parses phrases without a function', function () {
    const composer = session('my-song', function ({ session }) {
      session.phrase('a-phrase', [
        whole.note(0),
        half.note(1),
        quarter.note(2),
        eighth.note(3),
        sixteenth.note(4),
        thirtySecond.note(5),
        sixtyFourth.note(6),
      ]);
    });

    const phrase = composer.model.phrases.first();

    expect(composer.model.phrases.length).toEqual(1);
    expect(phrase.name).toEqual('a-phrase');
    expect(phrase.sequence.length).toEqual(7);
  });

  it('rejects invalid types', function () {
    expect(() => {
      session('my-song', function ({ session }) {
        session.phrase('a-phrase', 'potato');
      });
    }).toThrow(ModelValidationError);
  });
});