import { ITranspiler, ITemplate, IContext } from '@codepipe/common';
import { TemplateCache } from './cache';
import * as fs from 'fs-extra';

const ENCODING = process.env.CODEPIPE_DEFAULT_ENCODING = 'utf-8';

export class Transpiler {

  private cache = TemplateCache;

  constructor(private engine: ITranspiler) { }

  private async getOrSet(filename: string, encoding: string = ENCODING): Promise<ITemplate> {
    if (!this.cache.get(filename)) {
      const content =  await fs.readFile(filename, encoding);
      const templateFunc = await this.engine.compile(content);
      this.cache.set(filename, { render: templateFunc });
      return { render: templateFunc };
    }
    return this.cache.get(filename);
  }

  async render(filename: string, context: IContext, encoding: string = ENCODING): Promise<string> {
    const template = await this.getOrSet(filename, encoding);

    return template.render(context);
  }

}