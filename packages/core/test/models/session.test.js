import { 
  Harmonicon,
  SessionModel,
  BackgroundRendererModel,
  InteractiveRendererModel,
  SequencedEventModel,
  PositionModel,
  TrackModel,
} from '../../';
import '../helper';


describe('SessionModel', function () {

  describe('#interactiveRenderer', function () {
    it('returns a renderer', function () {
      expect(SessionModel.parse({}).interactiveRenderer).toBeInstanceOf(InteractiveRendererModel);
    });
  });

  describe('#backgroundRenderer', function () {
    it('returns a renderer', function () {
      expect(SessionModel.parse({}).backgroundRenderer)
        .toBeInstanceOf(BackgroundRendererModel);
    });
  })

  describe('#render()', function () {
    describe('interactive', function () {
      it('returns a renderer', async function () {
        expect(await SessionModel.parse({}).render())
          .toBeInstanceOf(InteractiveRendererModel);
      });
    });

    describe('background', function () {
      it('returns a renderer', async function () {
        expect(await SessionModel.parse({}).render({ interactive: false }))
          .toBeInstanceOf(BackgroundRendererModel);
      });
    });
  });

  describe('#elapsedTimeAtPosition()', function () {
    describe('at measure zero', function () {
      it('returns zero', function () {
        const session = SessionModel.parse({
          name: 'test'
        });

        expect(session.elapsedTimeAtPosition(PositionModel.parse('0:0:0'))).toEqual(0)
      });
    });

    describe('with no tempo change', function () {
      it('returns the length', function () {
        const session = SessionModel.parse({
          name: 'test'
        });

        session.events.add(SequencedEventModel.parse({
          at: PositionModel.parse(0),
          type: 'tempo',
          value: 145
        }));

        expect(session.elapsedTimeAtPosition(PositionModel.parse('10:0:0')))
          .toEqual(16.552)
      });
    });

    describe('with tempo changes', function () {
      it('returns the length', function () {
        const session = SessionModel.parse({
          name: 'test'
        });

        session.events.add(SequencedEventModel.parse({
          at: PositionModel.parse(10),
          type: 'tempo',
          value: 145
        }));

        session.events.add(SequencedEventModel.parse({
          at: PositionModel.parse(20),
          type: 'tempo',
          value: 160
        }));

        expect(session.elapsedTimeAtPosition(PositionModel.parse('30:0:0')))
          .toEqual(51.552)
      });
    });
  });
});