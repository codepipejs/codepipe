import { ITemplate } from '@codepipe/common';

/**
 * Memory temaplte cache
 */
export class TemplateCache {
  
  static data_ = {};
  
	constructor(){
		throw new Error('Singleton class, cannot be instantiated');
  }

  static set(key: string, value: ITemplate) {
    this.data_[key] = value;
  }

  static get(key: string): ITemplate {
    return this.data_[key];
  }
  
  static reset() {
    this.data_ = {};
  }

}