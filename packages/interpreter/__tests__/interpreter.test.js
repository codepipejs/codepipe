import { Interpreter } from '../lib';

describe('Interpreter', () => {
  test('should resolve modifiers', () => {
    expect(Interpreter.resolveModifier('t', ' foo ')).toEqual('foo');
    expect(Interpreter.resolveModifier('l', 'FoO')).toEqual('foo');
    expect(Interpreter.resolveModifier('p', 'foo')).toEqual('Foo');
    expect(Interpreter.resolveModifier('u', 'foo')).toEqual('FOO');
    expect(Interpreter.resolveModifier('c', 'foo bar')).toEqual('fooBar');
    expect(Interpreter.resolveModifier('s', 'Foo Bar')).toEqual('foo_bar');
    expect(Interpreter.resolveModifier('k', 'Foo Bar')).toEqual('foo-bar');
    expect(Interpreter.resolveModifier('C', 'fooBar')).toEqual('FooBar');
    // pipe?
    expect(Interpreter.resolveModifier('su', 'Foo Bar')).toEqual('FOO_BAR');
  })

  test('should resolve paths', () => {
    let exp;
    exp = Interpreter.extractPath('');
    expect(exp).toEqual(null);

    exp = Interpreter.extractPath('hola');
    expect(exp.owner).toEqual('hola');
    expect(exp.property).toEqual(undefined);

    exp = Interpreter.extractPath('hola.mundo');
    expect(exp.owner).toEqual('hola');
    expect(exp.property).toEqual('mundo');

    exp = Interpreter.extractPath('hola.mundo.com');
    expect(exp.owner).toEqual('hola.mundo');
    expect(exp.property).toEqual('com');

    exp = Interpreter.extractPath('$this');
    expect(exp.owner).toEqual('$this');
    expect(exp.property).toEqual(undefined);

    exp = Interpreter.extractPath('$this.$key');
    expect(exp.owner).toEqual('$this');
    expect(exp.property).toEqual('$key');

    exp = Interpreter.extractPath('hol-a.mundo');
    expect(exp.owner).toEqual('hol-a');
    expect(exp.property).toEqual('mundo');
   })
})
