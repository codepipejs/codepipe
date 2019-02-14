import { InterpolationType } from './types';

/**
 * @description
 * 
 * Defines the context at render time in each Template
 * 
 */
export interface IContext {
  $parent: any;
	$this: any;
	$model: any;
}

export interface IEngineOptions { }

/**
 * @description
 * 
 * Defines the transpiler to render the templates
 * 
 */
export interface ITranspiler {
		
	compile(templ: String, engineOptions?: IEngineOptions) : Promise<String> | String;

	render(ctx: IContext) : Promise<String> | String;

}

export interface IInterpolationExpression {
	modifier?: String, 
	iexp?: String
}

export interface IPathExpression {
	owner?: String;
	property?: String;
}

export interface ILayer extends String {}

export interface IInterpolationValue {
	value: any;
	$this: any;
	$key?: String;
}

export interface IInterpolation {
	type: InterpolationType;
	value: IInterpolationValue[] | IInterpolationValue;
}