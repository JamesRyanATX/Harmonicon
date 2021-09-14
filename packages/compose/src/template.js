import { BaseScriptComposer } from './base/script';

export class TemplateComposer extends BaseScriptComposer {
  static composerContextName = 'template';
}

export const template = TemplateComposer.composer();