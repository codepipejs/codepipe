import { has, reduce, flatten, map } from 'lodash';
import { TreeNodeType, INodeTree, INodeTemplate, IContext, ExpressionType, IInterpolation, InterpolationType, IInterpolationValue } from '@codepipe/common';
import { ModelResolver, Expression } from '@codepipe/interpreter';

export class Reducer {
	
	constructor(){
		throw new Error('Singleton class, cannot be instantiated');
	}

	static expand(tree: INodeTree[], model: any = {}): INodeTemplate[] {
		const initialState: IContext = {
			$this: model,
			$model: model
		};

		return this.expand_(tree, initialState);
	}

	private static expand_(tree: INodeTree[], context: IContext): INodeTemplate[] {
		return <INodeTemplate[]>reduce(tree, (res, value) => {
			res.push(this.handler(value, context));
			return flatten(res);
		}, []);
	}

	// private static handler(tree: INodeTree, context: IContext): INodeTemplate | INodeTemplate[] {
	// 	if (tree.type === TreeNodeType.Directory) {
	// 		return this.handleDirectory(tree, context);
	// 	}

	// 	return this.handleFile(tree, context);
	// }

	// private static handleFile(tree: INodeTree, ctx: IContext): INodeTemplate | INodeTemplate[] {
	// 	return null;
	// }

	private static handler(tree: INodeTree, ctx: IContext): INodeTemplate | INodeTemplate[] {
		const exp = new Expression(tree.name);
		const value = ModelResolver.resultOf(ctx.$this, exp);

		if (value === null) {
			throw new Error(`${exp.type}: no candidate for ${tree.name}`);
		}

		if (exp.type === ExpressionType.Layer || exp.type === ExpressionType.Literal) {
			return {
				type: tree.type,
				path: tree.path,
				name: tree.name.replace(exp.expression, value),
				context: ctx,
				children: this.expand_(tree.children, ctx),
				directive: exp.directive
			};
		}

		const int = <IInterpolation>value;

		// Interpolation
		switch (int.type) {
			case InterpolationType.Iteration:
			case InterpolationType.InterationByKey:
			case InterpolationType.IterationObjects:
				return map(<IInterpolationValue[]>int.value, val => {
					let childs;
					const nctx: IContext = {
						$model: ctx.$model,
						$parent: ctx.$this,
						$this: val.$this,
						$key: val.$key
					};
					if (tree.type === TreeNodeType.Directory) {
						childs = this.expand_(tree.children, nctx);
					}
					return {
						type: tree.type,
						path: tree.path,
						name: tree.name.replace(exp.expression, val.value),
						context: nctx,
						children: childs,
						directive: exp.directive
					};
				});
				break;
			case InterpolationType.LiteralValue:
			case InterpolationType.ObjectValue:
			default:
				let childs;
				const val = <IInterpolationValue>int.value;
				const nctx: IContext = {
					$model: ctx.$model,
					$parent: ctx.$this,
					$this: val.$this,
					$key: val.$key
				};
				if (tree.type === TreeNodeType.Directory) {
					childs = this.expand_(tree.children, nctx);
				}
				return {
					type: tree.type,
					path: tree.path,
					name: tree.name.replace(exp.expression, val.value),
					context: nctx,
					children: childs,
					directive: exp.directive
				};
				break;
		}
	}

}