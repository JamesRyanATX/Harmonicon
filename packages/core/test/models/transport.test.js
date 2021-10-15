import { TransportModel } from '../../src/models/transport';
import { PositionModel } from '../../src/models/position';
import jest from 'jest-mock';

import '../helper';

describe('TransportModel', function () {
  let transport, renderer, mocks;

  beforeEach(() => {
    mocks = {
      play: jest.fn(),
      pause: jest.fn(),
      stop: jest.fn(),
      setLoop: jest.fn(),
      setLoopFrom: jest.fn(),
      setLoopTo: jest.fn(),
      setPosition: jest.fn(),
      observePosition: jest.fn(),
    }

    renderer = {
      driverRenderer: {
        position: {
          measure: 0,
          beat: 0,
          subdivision: 0
        },
      },
      delegate: function (mock, ...args) {
        if (!mocks[mock]) {
          throw new Error(`missing mock "${mock}"`);
        }
        else {
          mocks[mock].apply(this, args);
        }
      }
    }

    transport = TransportModel.parse();
  });

  describe('properties', function () {
    it('sets default values', function () {
      expect(transport.playFrom).toEqual(PositionModel.parse(0));
      expect(transport.playTo).toEqual(null);
      expect(transport.loop).toEqual(false);
      expect(transport.loopFrom).toEqual(null);
      expect(transport.loopTo).toEqual(null);
      expect(transport.position).toEqual(PositionModel.parse(0));
      expect(transport.key).toEqual('C');
      expect(transport.scale).toEqual('major');
      expect(transport.tempo).toEqual(120);
      expect(transport.realtime).toEqual(0);
      expect(transport.meter).toEqual([ 4, 4 ]);
      expect(transport.swing).toEqual(0);
      expect(transport.ticks).toEqual(0);
    });

    describe('#state', function () {
      it('must be started, stopped, paused, or busy', function () {
        transport.state = 'started';
        transport.state = 'stopped';
        transport.state = 'paused';
        transport.state = 'busy';

        expect(() => {
          transport.state = 'nope';
        }).toThrow(TypeError('state must be one of: started, stopped, paused, busy'));
      });
    })
  });

  describe('getters and setters', function () {
    describe('#setPosition', function () {
      it('checks for PositionModel', function () {
        expect(() => {
          transport.setPosition('0:0:0');
        }).toThrow('Expected instance of PositionModel')
      });

      describe('with renderer', function () {
        it('sets the position', function () {
          const position = PositionModel.parse('1:2:3');

          transport.renderer = renderer;
          transport.setPosition(position);

          expect(transport.position).toEqual(position);
          expect(mocks.setPosition).toHaveBeenCalledWith(position);
        });
      });

      describe('without renderer', function () {
        it('sets the position', function () {
          const position = PositionModel.parse('1:2:3');

          transport.setPosition(position);

          expect(transport.position).toEqual(position);
          expect(mocks.setPosition).not.toHaveBeenCalled();
        });
      });
    });  
  });

  describe('player controls', function () {

    describe('#forwards()', function () {
      describe('with renderer', function () {
        describe('stopped', function () {
          it('rewinds by one measure', function () {
            transport.state = 'stopped';
            transport.renderer = renderer;
            transport.playFrom = PositionModel.parse(10);
            transport.forwards();

            expect(transport.playFrom.toMBS()).toEqual('11:0:0');
          });  
        });

        describe('paused', function () {
          it('rewinds by one measure', function () {
            transport.state = 'paused';
            transport.renderer = renderer
            transport.playFrom = PositionModel.parse(10);
            transport.position = PositionModel.parse(5);
            transport.forwards();

            expect(mocks.setPosition).toHaveBeenCalledWith(PositionModel.parse(6));
          });  
        });

        describe('started', function () {
          it('rewinds by one measure', function () {
            transport.state = 'started';
            transport.renderer = renderer
            transport.playFrom = PositionModel.parse(10);
            transport.position = PositionModel.parse(5);
            transport.forwards();

            expect(mocks.setPosition).toHaveBeenCalledWith(PositionModel.parse(6));
          });  
        });
      });

      describe('without renderer', function () {
        it('rewinds by one measure', function () {
          transport.state = 'stopped';
          transport.playFrom = PositionModel.parse(10);
          transport.forwards();

          expect(transport.playFrom.toMBS()).toEqual('11:0:0');
        });
      });
    });

    describe('#backwards()', function () {
      describe('with renderer', function () {
        describe('stopped', function () {
          it('rewinds by one measure', function () {
            transport.state = 'stopped';
            transport.renderer = renderer;
            transport.playFrom = PositionModel.parse(10);
            transport.backwards();

            expect(transport.playFrom.toMBS()).toEqual('9:0:0');
          });  
        });

        describe('paused', function () {
          it('rewinds by one measure', function () {
            transport.state = 'paused';
            transport.renderer = renderer
            transport.playFrom = PositionModel.parse(10);
            transport.position = PositionModel.parse(5);
            transport.backwards();

            expect(mocks.setPosition).toHaveBeenCalledWith(PositionModel.parse(4));
          });  
        });

        describe('started', function () {
          it('rewinds by one measure', function () {
            transport.state = 'started';
            transport.renderer = renderer
            transport.playFrom = PositionModel.parse(10);
            transport.position = PositionModel.parse(5);
            transport.backwards();

            expect(mocks.setPosition).toHaveBeenCalledWith(PositionModel.parse(4));
          });  
        });
      });

      describe('without renderer', function () {
        it('rewinds by one measure', function () {
          transport.state = 'stopped';
          transport.playFrom = PositionModel.parse(10);
          transport.backwards();

          expect(transport.playFrom.toMBS()).toEqual('9:0:0');
        });
      });
    });

    describe('#stop', function () {
      it('calls driver', function () {
        transport.renderer = renderer;
        transport.stop();

        expect(mocks.stop).toHaveBeenCalled()
      });
    });

    describe('#play', function () {
      describe('with renderer', function () {
        describe('with loop', function () {
          it('sets position to loopFrom', function () {
            transport.renderer = renderer;
            transport.setProperties({
              loop: true,
              loopFrom: PositionModel.parse(10),
              loopTo: PositionModel.parse(15),
              playFrom: PositionModel.parse(5),
            });

            transport.play();
    
            expect(mocks.setLoop).toHaveBeenCalledWith(true);
            expect(mocks.setLoopFrom).toHaveBeenCalledWith(transport.loopFrom);
            expect(mocks.setLoopTo).toHaveBeenCalledWith(transport.loopTo);
            expect(mocks.play).toHaveBeenCalledWith({
              position: transport.playFrom
            });
          });
        });

        describe('without loop', function () {
          it('sets position to playFrom', function () {
            transport.renderer = renderer;
            transport.setProperties({
              loop: false,
              loopFrom: PositionModel.parse(10),
              loopTo: PositionModel.parse(15),
              playFrom: PositionModel.parse(5),
            });

            transport.play();

            expect(mocks.setLoop).toHaveBeenCalledWith(false);
            expect(mocks.setLoopFrom).toHaveBeenCalledWith(transport.loopFrom);
            expect(mocks.setLoopTo).toHaveBeenCalledWith(transport.loopTo);
            expect(mocks.play).toHaveBeenCalledWith({
              position: transport.playFrom
            });
          });
        });
      });
    });

    describe('#pause()', function () {
      it('calls driver', function () {
        transport.renderer = renderer;
        transport.pause();

        expect(mocks.pause).toHaveBeenCalled()
      });
    });

    describe('#reset', function () {
      it('restores defaults', function () {
        transport.playFrom = PositionModel.parse(5);
        transport.playTo = PositionModel.parse(5);
        transport.loop = false;
        transport.loopFrom = PositionModel.parse(5);
        transport.loopTo = PositionModel.parse(5);
        transport.position = PositionModel.parse(5);

        transport.reset();

        expect(transport.playFrom).toEqual(PositionModel.parse(0));
        expect(transport.playTo).toEqual(null);
        expect(transport.loop).toEqual(false);
        expect(transport.loopFrom).toEqual(null);
        expect(transport.loopTo).toEqual(null);
        expect(transport.position).toEqual(PositionModel.parse(0));
      });
    });
  });

});