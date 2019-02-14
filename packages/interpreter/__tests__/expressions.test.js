import { Expression } from '../lib';
import { ExpressionType, DirectiveType } from "@codepipe/common";

describe('Expressions', () => {

  test('should know\'s directives', () => {
    let exp = new Expression('@foo');
    expect(exp.directive).toEqual(DirectiveType.Auto);
    exp = new Expression('@@foo');
    expect(exp.directive).toEqual(DirectiveType.None);
    exp = new Expression('!foo');
    expect(exp.directive).toEqual(DirectiveType.Inject);
    exp = new Expression('!!foo');
    expect(exp.directive).toEqual(DirectiveType.None);
  })

  test('should know\'s layers', () => {
    let exp = new Expression('#foo');
    expect(exp.type).toEqual(ExpressionType.Layer);
    exp = new Expression('##foo');
    expect(exp.type).toEqual(ExpressionType.Literal);
  })

  test('should know\'s interpolations', () => {
    let exp = new Expression('@${foo.bar}.file.js');
    expect(exp.type).toEqual(ExpressionType.Interpolation);
    exp = new Expression('${foo.bar}.file.js');
    expect(exp.type).toEqual(ExpressionType.Interpolation);
    exp = new Expression('some-${foo.bar}.file.js');
    expect(exp.type).toEqual(ExpressionType.Interpolation);
    exp = new Expression('$foo.bar.file.js');
    expect(exp.type).toEqual(ExpressionType.Literal);
  })

  test('should analyze layers', () => {
    let exp = new Expression('#foo');
    expect(exp.value).toEqual('foo');
    exp = new Expression('##foo');
    expect(exp.value).toEqual('##foo');
  })

  test('should analyze interpolations', () => {
    let exp = new Expression('@${foo.bar}.file.js');
    expect(exp.value).toEqual('foo.bar');
    expect(exp.modifier).toEqual(undefined);

    exp = new Expression('@file.${foo.bar}.file.js');
    expect(exp.value).toEqual('foo.bar');
    expect(exp.modifier).toEqual(undefined);

    exp = new Expression('@$l{foo.bar}.file.js');
    expect(exp.modifier).toEqual('l');

    exp = new Expression('@$lc{foo.bar}.file.js');
    expect(exp.modifier).toEqual('lc');

    exp = new Expression('@$lcC{foo.bar}.file.js');
    expect(exp.modifier).toEqual('lcC');

    exp = new Expression('@$foo.bar.js');
    expect(exp.value).toEqual('@$foo.bar.js');
  })
})