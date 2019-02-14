import { ExpressionType, DirectiveType, IPathExpression } from "@codepipe/common";
import { Interpreter } from "./interpreter";

export class Expression {

	private _exp: String;

	type: ExpressionType;

	directive: DirectiveType;

	value: String;

	modifier: String;

	path: IPathExpression = {};

	set expression(exp: String) {
		this._exp = exp;
		this.analyze();
	}

	get expression(): String {
		return this._exp;
	}
	
	constructor(exp: String){
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

	transform(value: String): String {
		if (!this.modifier){
			return value;
		}

		return Interpreter.resolveModifier(this.modifier, value);
	}

	toString(): String {
		return `[Expression ${this.expression}]`;
	}
}