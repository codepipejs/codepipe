import { InterpolationType, TreeNodeType, DirectiveType } from './types';

/**
 * @description
 * 
 * Defines the context at render time in each Template
 * 
 */
export interface IContext {
	$model: any;
	$parent?: any;
	$this: any;
	$key?: string; // current interpolation key
}

export interface IEngineOptions { }

export interface ITemplate {
	render(context: IContext | any) : Promise<string> | string | any;
}

/**
 * @description
 * 
 * Defines the transpiler to render the templates
 * 
 */
export interface ITranspiler {
		
	compile(templ: string, engineOptions?: IEngineOptions | any) : Promise<ITemplate> | ITemplate | any;

}

export interface IInterpolationExpression {
	modifier?: string, 
	iexp?: string
}

export interface IPathExpression {
	owner?: string;
	property?: string;
}

export interface ILayer extends String {}

export interface IInterpolationValue {
	value: any;
	$this: any;
	$key?: string;
}

export interface IInterpolation {
	type: InterpolationType;
	value: IInterpolationValue[] | IInterpolationValue;
}

export interface INodeTree {
	type: TreeNodeType;
	path: string;
	name: string;
	size: string;
	extension?: string;
	children?: INodeTree[];
}

export interface INodeTemplate {
	type: TreeNodeType;
	path: string;
	name: string;
	relative?: string;
	extension?: string;
	children?: INodeTemplate[];
	context: IContext;
	directive?: DirectiveType;
}