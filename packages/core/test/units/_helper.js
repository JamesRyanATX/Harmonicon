export function testUnit(unit, expectations) {

  describe(unit.name, function () {

    describe('.definition', function () {
      it('returns the correct values', function () {
        expect(unit.definition).toEqual(expectations.definition);
      });
    });

    describe('.toBeats', function () {
      expectations.toBeats.forEach((beat) => {
        it(`returns the correct value for ${beat.timeSignature[0]}/${beat.timeSignature[1]}`, function () {
          expect(unit.toBeats(beat.timeSignature)).toEqual(beat.expectedValue);
        });  
      });
    })

    describe('.toDecimal', function () {
      it('returns the correct value', function () {
        expect(unit.toDecimal()).toEqual(expectations.toDecimal);
      });
    });

  });

}