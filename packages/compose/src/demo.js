import { BaseScriptComposer } from './base/script';

export class DemoComposer extends BaseScriptComposer {
  static composerContextName = 'demo';
}

export const demo = DemoComposer.composer();