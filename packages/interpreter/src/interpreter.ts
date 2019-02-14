import * as XRegExp from 'xregexp';
import {
	trim,
	toLower,
	capitalize,
	toUpper,
	camelCase,
	snakeCase,
	kebabCase,
	upperFirst,
	reduce
} from 'lodash';
import { 
  ExpressionType,
  DirectiveType,
  IInterpolationExpression,
  IPathExpression
} from "@codepipe/common";

/**
 * @description
 * 
 * File and folder names inerpretation
 */
export class Interpreter {
	
	constructor(){
		throw new Error('Singleton class, cannot be instantiated');
	}

	static extractLayer(str: string): string {
		let match = XRegExp.exec(
			str.toString(),
			XRegExp('^[#]{1}(?<layer>.+$)', 'x')
		);

		return <string>match['layer'];
	}

	static extractInterpolation(str: string) : IInterpolationExpression | null {
		let match = XRegExp.exec(
			str.toString(),
			XRegExp('\\$(?<modifier>[tlpucsfC]+)?{(?<iexp>[\\$\\w\\.\\-\\_]+)}', 'x')
		);

		if (!match){
			return null;
		}

		return {
			modifier: <string>match['modifier'],
			iexp: <string>match['iexp']
		};
	}

	static extractPath(str: string): IPathExpression | null {
		let match = XRegExp.exec(
			str.toString(),
			XRegExp('^(?<owner>([\\$\\w\\-\\_]+\\.)+)?(?<prop>[\\$\\w\\-\\_]+)$', 'x')
		);

		if (!match){
			return null;
		}

		let owner = <string>match['owner'];
		let prop = <string>match['prop'];

		// remove last dot
		if (owner !== undefined && /\.$/g.test(owner.toString())) {
			owner = owner.replace(/\.$/, '');
		}

		if (prop && !owner){
			owner = prop;
			prop = undefined;
		}

		return {
			owner: owner,
			property: prop
		};
	}

	static getExpressionType(str: string) : ExpressionType {
		if (this.isLayer(str)){
			return ExpressionType.Layer;
		}

		if (this.isInterpolation(str)){
			return ExpressionType.Interpolation;
		}

		return ExpressionType.Literal;
	}

	static getDirectiveType(str: string): DirectiveType {
		if (this.isAuto(str)){
			return DirectiveType.Auto;
		}

		if (this.isInject(str)){
			return DirectiveType.Inject;
		}

		return DirectiveType.None;
	}

	static isLayer(str: string): Boolean {
		return  /^#.+$/i.test(str.toString()) && !/^##.+$/i.test(str.toString());
	}

	static isAuto(str: string): Boolean {
		return /^@.*$/i.test(str.toString()) && !/^@@.*$/i.test(str.toString());
	}

	static isInject(str: string): Boolean {
		return  /^!.*$/i.test(str.toString()) && !/^!!.*$/i.test(str.toString());
	}

	static hasDirective(str: string): Boolean {
		return  /^(@|!).*$/i.test(str.toString()) && !/^!!.*$/i.test(str.toString());
	}

	static isInterpolation(str: string): Boolean {
		return /\$(:?[tlpucsfC]+)?{[\$\w\.\\-\\_]+}/i.test(str.toString());
	}

	static isModifier(str: string): Boolean {
		return /^[tlpucsfC]+$}/i.test(str.toString());
	}

	static resolveModifier(modifier: string, value: string): string {
		if (this.isModifier(modifier)){
			return value;
		}

		const funcs = {
			't': trim,
			'l': toLower,
			'p': capitalize,
			'u': toUpper,
			'c': camelCase,
			's': snakeCase,
			'k': kebabCase,
			'f': upperFirst
		};

		// replace C with cp
		modifier = modifier.replace(/C/g, 'cf');

		return reduce(modifier.split(''), (result, m) => {
			return funcs[m](result);
		}, value);
	}
}