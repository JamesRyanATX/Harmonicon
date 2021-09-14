import { BaseScriptComposer } from './base/script';

export class SnippetComposer extends BaseScriptComposer {
  static composerContextName = 'snippet';
}

export const snippet = SnippetComposer.composer();