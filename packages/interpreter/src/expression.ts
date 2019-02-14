import { ExpressionType, DirectiveType, IPathExpression, NameConvention } from "@codepipe/common";
import { Interpreter } from "./interpreter";

export class Expression {

	private _exp: string;

	type: ExpressionType;

	directive: DirectiveType;

	value: string;

	modifier: string;

	path: IPathExpression = {};

	set expression(exp: string) {
		this._exp = exp;
		this.analyze();
	}

	get expression(): string {
		return this._exp;
	}
	
	constructor(exp: string){
		this.expression = exp;
	}

	private analyze(): void {
		this.type = Interpreter.getExpressionType(this.expression);
		switch(this.type)  {
			case ExpressionType.Layer:
				this.value = Interpreter.extractLayer(this.expression);
				break;
			case ExpressionType.Interpolation:
				let inter = Interpreter.extractInterpolation(this.expression);
				if (inter !== null) {
					this.value = inter.iexp;
					this.modifier = inter.modifier;
					let p = Interpreter.extractPath(this.value.toString());
					this.path = p;
					// warning with this?
					break;
				}
			case ExpressionType.Literal:
			default:
				this.type = ExpressionType.Literal;
				this.value = this.expression
		}
		this.directive = Interpreter.getDirectiveType(this.expression);
	}

	convert(value: string): string {
		// TODO: convert the ## or @@ -> # or @
		if (this.type === ExpressionType.Literal || this.type === ExpressionType.Layer) {
			return value;
		}

		let nvalue = this.expression;

		// cleaning directives
		if (this.directive !== DirectiveType.None) {
			nvalue = this.expression.replace(/^(@|!)/, '');
		}

		// here is an Interpolation
		return nvalue.replace(/\$(:?[tlpucsfC]+)?{[\$\w\.\\-\\_]+}/i, value);
	}

	transform(value: string): string {
		let expValue = value;
		if (this.modifier){
			expValue = Interpreter.resolveModifier(this.modifier, value);
		}

		return this.convert(expValue);
	}

	toString(): string {
		return `[Expression ${this.expression}]`;
	}
}