import { BaseModel } from './base';
import { PositionModel } from './position';
import { Harmonicon } from '@composer/core';
import { measure } from '@composer/util';

export class TransportModel extends BaseModel {

  static properties = {
    renderer: {},

    state: {
      type: String,
      defaultValue: 'stopped',
      oneOf: [ 'started', 'stopped', 'paused', 'busy' ]
    },

    loop: {
      type: Boolean,
      defaultValue: false,
    },

    loopFrom: {
      type: PositionModel,
      defaultValue: null,
    },

    loopTo: {
      type: PositionModel,
      defaultValue: null,
    },

    playFrom: {
      type: PositionModel,
      defaultValue: () => (PositionModel.parse(0))
    },

    playTo: {
      type: PositionModel,
      defaultValue: null
    },

    position: {
      type: PositionModel,
      defaultValue: () => (PositionModel.parse(0))
    },

    key: {
      type: String,
      defaultValue: 'C'
    },

    scale: {
      type: String,
      defaultValue: 'major',
    },

    tempo: {
      type: Number,
      defaultValue: 120
    },

    meter: {
      type: Array,
      defaultValue: [ 4, 4 ]
    },

    realtime: {
      type: Number,
      defaultValue: 0,
    },

    swing: {
      type: Number,
      defaultValue: 0,
    },

    ticks: {
      type: Number,
      defaultValue: 0,
    },

  }

  get paused() { return this.state === 'paused'; }
  get stopped() { return this.state === 'stopped'; }
  get started() { return this.state === 'started'; }
  get busy() { return this.state === 'busy'; }

  get canStop() { return this.paused || this.started; }
  get canPause() { return !this.stopped; }
  get canPlay() { return !this.busy; }
  get canBackwards() { return !this.position.zero; }
  get canForwards() { return true; }
  get canRestart() { return !this.position.zero; }
  get canBlock() { return this.stopped || this.paused; }

  get driver() { return Harmonicon.drivers.audio; }

  constructor(properties = {}) {
    super(properties);

    // Catch low-level driver events
    this.driver.on('start', this.onDriverStart.bind(this));
    this.driver.on('stop', this.onDriverStop.bind(this));
    this.driver.on('pause', this.onDriverPause.bind(this));
    this.driver.on('loop', this.onDriverLoop.bind(this));

    this.on('changed:renderer', () => {
      this.delegate('observePosition', this.onDriverPositionChange.bind(this));
    });

    this.on('changed:loop', ({ newValue }) => { this.delegate('setLoop', newValue); });
    this.on('changed:loopFrom', ({ newValue }) => { this.delegate('setLoopFrom', newValue); }); 
    this.on('changed:loopTo', ({ newValue }) => { this.delegate('setLoopTo', newValue); });
  }

  onDriverStart() {
    this.state = 'started';
  }

  onDriverStop() {
    this.state = 'stopped';
  }

  onDriverPause() {
    this.state = 'stopped';
  }

  onDriverLoop() {
  }

  onDriverPositionChange({
    beat,
    key,
    measure,
    meter,
    realtime,
    scale,
    subdivision,
    swing,
    tempo,
    ticks,
  }) {
    this.setProperties({
      position: PositionModel.parse({ measure, beat, subdivision }),
      key,
      scale,
      tempo,
      meter,
      realtime,
      swing,
      ticks
    })
  }

  pull() {
    if (this.renderer) {
      this.position = PositionModel.parse(this.renderer.driverRenderer.position);
    }
  }

  push() {
    this.delegate('setPosition', this.position);
  }

  setPosition(position) {
    if (position instanceof PositionModel) {
      this.position = position;
    }
    else {
      throw new TypeError('Expected instance of PositionModel');
    }

    this.push();
  }

  forwards() {
    if (this.started || this.paused) {
      this.setPosition(PositionModel.parse({
        measure: this.position.measure + 1,
        beat: 0,
        subdivision: 0,
      }));
    }
    else {
      this.playFrom = this.playFrom.add(1, 'measure');
    }
  }

  backwards() {
    if (this.started || this.paused) {
      this.setPosition(PositionModel.parse({
        measure: this.position.measure === 0 ? 0 : this.position.measure - 1,
        beat: 0,
        subdivision: 0,
      }));
    }
    else {
      this.playFrom = this.playFrom.subtract(1, 'measure');
    }
  }

  restart() {
    if (this.loop) {
      this.setPosition(this.loopFrom);
    }
    else {
      this.setPosition(this.playFrom);
    }
  }

  stop() {
    this.delegate('stop');
    this.state = 'stopped';

    this.setPosition(this.playFrom);
  }

  play() {
    this.state = 'started';
    
    this.delegate('setLoop', this.loop);
    this.delegate('setLoopFrom', this.loopFrom);
    this.delegate('setLoopTo', this.loopTo);

    this.delegate('play', {
      position: this.playFrom,
    });
  }

  pause() {
    if (this.state === 'paused') {
      this.delegate('play');
      this.state = 'started';
    }
    else {
      this.state = 'paused';
      this.delegate('pause');
      this.pull();
    }
  }

  reset() {
    this.delegate('stop');

    this.setProperties({
      loop: false,
      loopFrom: null,
      loopTo: null,
      playFrom: PositionModel.parse('0:0:0'),
      playTo: null,
      position: PositionModel.parse('0:0:0'),
      state: 'stopped',
    });

    this.push();
  }

  delegate() {
    if (this.renderer) {
      return this.renderer.delegate.apply(this.renderer, arguments);
    }
  }

  blockWhile(task) {
    if (!this.canBlock) {
      throw new Error('Transport cannot enter blocking state.');
    }

    this.state = 'busy';

    // task.on('run', (error) => {
    //   debugger
    // });

    // task.on('success', (error) => {
    //   debugger
    // });

    // task.on('error', (error) => {
    //   debugger
    // });

    task.on('done', () => {
      if (this.busy) {
        this.state = 'stopped';
      }
    });

    return task.run();
  }

}

TransportModel.init();

// Add metric observers
[
  'blockWhile',
].forEach((fn) => {
  measure(TransportModel.prototype, fn, {
    label: `#${fn}()`
  });
});