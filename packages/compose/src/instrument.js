import { BaseComposer } from './base';

export class InstrumentComposer extends BaseComposer {
  static modelContextName = 'instrument';
  static model = null;
}

export const instrument = InstrumentComposer.composer();