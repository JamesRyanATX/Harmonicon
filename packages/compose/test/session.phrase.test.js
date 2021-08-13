import {
  session,
  whole,
  half,
  quarter,
  eighth,
  sixteenth,
  thirtysecond,
  sixtyfourth,
} from '../';

async function testPhrase() {
  const results = {};

  await session('my-song', async function ({ session }) {
    session.phrase('a-phrase', ({ phrase }) => {
      phrase.steps(
        whole.note(0),
        half.note(1),
        quarter.note(2),
        eighth.note(3),
        sixteenth.note(4),
        thirtysecond.note(5),
        sixtyfourth.note(6),
      );

      results.phrase = phrase;
      results.session = session;
    });
  });

  return results;
}

describe('session.phrase', function () {
  it('parses phrases', async function () {
    const { session, phrase } = await testPhrase();
    
    expect(session.model.phrases.length).toEqual(1);
    expect(phrase.model.name).toEqual('a-phrase');
    expect(phrase.model.steps.length).toEqual(7);
  });
});