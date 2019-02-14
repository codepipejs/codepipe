import * as _ from 'lodash';
import { 
  ExpressionType,
  InterpolationType,
  ILayer,
  IInterpolationValue,
  IInterpolation,
  NameConvention
} from "@codepipe/common";
import { Expression } from "./expression";

export class ModelResolver {
	
	constructor(){
		throw new Error('Singleton class, cannot be instantiated');
	}
	
	private static result_(model: any, attr: string): any {
		if (!_.hasIn(model, attr.toString())){
			return null;
		}

		return _.result(model, attr.toString(), null);
	}

	private static resolveInterpolation(model: any, exp: Expression): IInterpolation | null {
		if (!_.hasIn(model, exp.path.owner.toString()) && !/\$key|\$this/ig.test(exp.path.owner.toString())){
			return null;
		}

		let owner = (exp.path.property && !exp.path.owner) ? exp.path.property : exp.path.owner;

		let $this = _.result(
			model, 
			owner.toString()
		);

		// change the model for $this/$key expressions
		if (owner === '$this') {
			$this = model;
		}
		
		if (owner === '$key') {
			$this = model;
		}

		if (_.isArray($this)){
			let vi;
			if (!exp.path.property){
				let ivalue = _.map($this, (item) => {
					if (_.isFunction(item)){
						let v = <Function>item.call(item, [$this]);
						return <IInterpolationValue>{
							value: exp.transform(v.toString()),
							$this: v
						};
					}
					return <IInterpolationValue>{
						value: exp.transform(item.toString()),
						$this: item
					};
				});

				return <IInterpolation>{
					type: InterpolationType.Iteration,
					value: <IInterpolationValue[]>ivalue
				};
			}

			let ivalue = _.map($this, (item) => {
				return <IInterpolationValue>{
					value: exp.transform(<string>this.result_(item, exp.path.property)),
					$this: item
				};
			});
			
			return <IInterpolation>{
				type: InterpolationType.IterationObjects,
				value: <IInterpolationValue[]>ivalue
			};
		}

		if (_.isObject($this)){
			let keys = _.keys($this);
			let ivalue: IInterpolationValue | IInterpolationValue[];

			if (exp.path.property == undefined || exp.path.property == '$key'){
				ivalue = _.map(keys, (key) => {
					return <IInterpolationValue>{
						value: exp.transform(<string>key),
						$this: $this[key],
						$key: key
					};
				});

				return <IInterpolation>{
					type: InterpolationType.InterationByKey,
					value: <IInterpolationValue[]>ivalue
				};
			}
			
			return <IInterpolation>{
				type: InterpolationType.ObjectValue,
				value: <IInterpolationValue>{
					value: exp.transform(_.result($this, exp.path.property.toString())),
					$this: $this
				}
			};
			
		}

		if (!exp.path.property) {
			return <IInterpolation>{
				type: InterpolationType.LiteralValue,
				value: <IInterpolationValue>{
					value: exp.transform($this.toString()),
					$this: $this
				}
			};
		}
		
		return null;
	}

	static resultOf(model: any, exp: Expression): ILayer | IInterpolation | any {
		if (exp.type === ExpressionType.Layer){
			return <ILayer>this.result_(model, `${NameConvention.LAYER_ATTRIBUTE_NAME}.${exp.value}`);
		}

		if (exp.type === ExpressionType.Interpolation){
			return this.resolveInterpolation(model, exp);
		}

		return exp.value;
	}
}