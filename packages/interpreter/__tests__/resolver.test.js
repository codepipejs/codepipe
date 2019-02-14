import {
	ModelResolver,
	Expression
} from '../lib';

// let m1 = {
// 	"target": [
// 		'movie',
// 		'director'
// 	]
// };

// let m2 = {
// 	"target": [
// 		{name: 'movie'},
// 		{name: 'director'}
// 	]
// };

// let m3 = {
// 	"target": {
// 			movie: { foo: 'barMovie' },
// 			director: { foo: 'barDirector' }
// 		}
// };

// let m4 = {
// 	"target": {
// 			foo: 'bar'
// 		}
// };

// let m5 = {
// 	"target": "some"
// };

// let m6 = {
// 	"target": {
// 		foo: "bar"
// 	}
// };

// let exp1 = new Expression('$u{target}.controller.js');
// let exp2 = new Expression('${target.name}.controller.js');
// let exp3 = new Expression('${target.$key}.controller.js');
// let exp4 = new Expression('${target.foo}.controller.js');
// let exp5 = new Expression('${target}.controller.js');

// let mr = new ModelResolver();

// console.log(mr.resultOf(m1, exp1));
// console.log(mr.resultOf(m2, exp2));
// console.log(mr.resultOf(m3, exp3));
// console.log(mr.resultOf(m4, exp4));
// console.log(mr.resultOf(m5, exp5));
// console.log(mr.resultOf(m6, exp5));
// console.log(mr.resultOf(m6, exp3));

describe('Resolver', () => {
	describe('#layers', () => {
		class SomeClass {
			bar = 'bar';
		
			foo() {
				return this.bar;
			}
		}
		
		let modelJson = {
			layer: {
				foo: 'bar'
			}
		};
		
		let modelObj = {
			layer: {
				foo: () => {
					return 'bar';
				}
			}
		};
		
		let modelClass = {
			layer: new SomeClass()
		};
	
		let mr = new ModelResolver();
		let exp = new Expression('#foo');
	
		test('should resolve layer in json', () => {
			expect(mr.resultOf(modelJson, exp)).toEqual('bar');
		})
	
		test('should resolve layer in Objects', () => {
			expect(mr.resultOf(modelObj, exp)).toEqual('bar');
		})
	
		test('should resolve layer in Class', () => {
			expect(mr.resultOf(modelClass, exp)).toEqual('bar');
		})
	})
})