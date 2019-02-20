<big><h1 align="center">CodePipe</h1></big>

***Project under development***

Organize and use templates

# CLI

```
npm i -g @codepipe/cli
or
yarn global add @codepipe/cli
```

# Usage

```
codepipe --help
```

# Model

The model is just a json/object

```
{
  foo: 'bar'
}

or

{
  foo: function() {
    return 'bar'
  }
}
```


# Filenames and Foldernames expressions

## File

```
---> directive
' 
' 
@$l{target.value}.file.js
 |'              |
 |'              |
 |'->modifier    |
 |               |
 '---atttibute---'

{
  target: [
    { value: 'Foo' },
    { value: 'Bar' },
  ]
}

// convert to
 - foo.file.js
 - bar.file.js
```

## Folder
```
---> is a layer
'
#somelayer // replace with path/to/

$l{target.value}
|'             |
|'             |
|'->modifier   |
|              |
'---atttibute--'

{
  somelayer: 'path/to/',
  target: [
    { value: 'foo' },
    { value: 'bar' },
  ]
}
 - foo
 - bar
```

expression|usage      |description
----------|-----------|-----------
\#        |\#layername|layer/folder names
@         |@filename  |automatic file (overrides)
!         |!filename  |injector file (not supported yet)
${}       |${target}  |iteration/value by target
$this     |${$this}   |current iteration instance for array/collections
$key      |${$key}    |current iteration key for collections

**examples outputs:**

`@$l{name}.file.js`

```
// model
{ "name": "BAR" }

// output
bar.file.js
```

`@$l{name}.file.js`

```
// model
{ "name": [ "foo", "BAR" ] }

// output
foo.file.js
bar.file.js
```

`@$l{target.name}.file.js`

```
// model
{
  "target": {
    "name": "foo",
    "name": "bar"
  }
}

// output
foo.file.js
bar.file.js
```

```
 - #somelayer
      | - @${target.value}.file.js

{
  somelayer: 'path/to/',
  target: [
    { value: 'foo' },
    { value: 'bar' },
  ]
}

// output
path/to/foo.file.js
path/to/bar.file.js
```

```
 - ${target.value}
      | - @${target.value}.file.js

{
  list: [ 'one', 'two' ],
  target: [
    { value: 'foo' },
    { value: 'bar' },
  ]
}

// output
one/foo.file.js
one/bar.file.js
two/foo.file.js
two/bar.file.js
```

pipes on attribute modifiers

```
{ "name": "Foo Bar" }
```

`$su{name}.file.js` -> `FOO_BAR.file.js`

**Modifiers**
  
character|usage     |description
---------|----------|-----------
c        |$c{target}|write the target as [camelCase*](https://lodash.com/docs#camelCase)
C        |$C{target}|write the target as [camelCase*](https://lodash.com/docs#camelCase) + [upperFirst*](https://lodash.com/docs#upperFirst)
f        |$f{target}|write the target as [capitalize*](https://lodash.com/docs#upperFirst)
k        |$k{target}|write the target as [kebabCase*](https://lodash.com/docs#kebabCase)
l        |$l{target}|write the target as [lower*](https://lodash.com/docs#toLower)
p        |$p{target}|write the target as [capitalize*](https://lodash.com/docs#capitalize)
s        |$s{target}|write the target as [snakeCase*](https://lodash.com/docs#snakeCase)
u        |$u{target}|write the target as [upper*](https://lodash.com/docs#toUpper)

**please see the [lodash](https://lodash.com/docs) documentation*

NOTE: automatic means that the file will be overrides in the transpiler process

## License

MIT License © [Delmo](https://github.com/codepipejs/codepipe-core)
