# bds.js
Run and simulate string-based BDScript language in JavaScript

## Prerequisites
> This project requires a JavaScript runtime which supports ES2020 and ESModules.

## Changelog v1.1.1
### Added / New
- Rewritten code for easy to use
- Reworked `Context`
- Reworked `Lexer`
- Reworked `Parser`
- Added `Evaluator`
- Added `Runtime`
- Fixed `operator` type breaks punctuations
- Readded some utility calls
- Added `$async`, `$wait`, `$safejs`, `$if`
### Breaking
- Removed `FNHandler`
- Removed `Script`
- Removed `Nodes`

## Table of Contents
- [bds.js](#bdsjs)
  - [Prerequisites](#prerequisites)
  - [Changelog v1.1.1](#changelog-v111)
    - [Added / New](#added--new)
    - [Breaking](#breaking)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [API & Usage](#api--usage)
    - [Example](#example)
    - [Runtime](#runtime)
    - [Evaluator](#evaluator)
    - [Context](#context)
    - [Variables](#variables)
    - [Global Variables](#global-variables)
  - [Goals](#goals)
  - [MIT License](#mit-license)

## Installation
Install bds.js with npm:
```sh
$ npm install bds.js
```
or [getting releases](https://github.com/Kino7916/bds.js) from github

## API & Usage
### Example
```js
const lib = require('bds.js');
const runtime = new lib.Runtime();

const input = '$async[$swait $print[Hello world!]] This bottom text is async output!'
const result = runtime.runInput('helloWorld.bds', input);
result.then(output => console.log(output));
```
### Runtime
> v1.1 is using Runtime and Evaluator, different from v1.0
> This approach is used for the reason; Runtime error and error tracing within code for easier debugging
```js
const runtime = new lib.Runtime();
const input = "$print[Hello World!]";
// Running an input
runtime.runInput('myInput.js', input);
```
### Evaluator
> Currently v1.1 use Interpreter system which can impact the performance for large-scale productions.
> Later versions to be improved, can also be a change of system.
```js
// Creating a AST
const input = "> This is the code$print[> Hello World!]"
const lexer = new lib.Lexer(input);
const parser = new lib.Parser();
const Ast = parser.parseToAst(lexer.main() /* Tokenizing input */) // Parsing tokens to AST

// Evaluating the AST as simple as possible
const evaluator = lib.Evaluator.singleton // One instance is for one process
const result = evaluator.evaluate(Ast) // Evaluating AST

// Printing the output of input
result.then(output => console.log(output))
```
### Context
> Context instance are usually used to handle functions in code
```js
const env = new lib.Environment();
env.set('luckyfn', async (context) => {
  context.argsCheck(1); // Check if has required arguments (1), throws error if below from required
  const arguments = context.getArgs() // Getting arguments
  const minimum_chance = await context.evaluateArgs(arguments)[0] // Get the first argument of evaluated arguments
  // Calling other identifiers (Advanced use)
  const chance = await context.callIdentifier({type: "call", value: "$random"}) * 100;
  if (chance > minimum_chance) {
    return 'You are lucky!'
  } else {
    return 'A sad day for no luck...'
  }
});
```
### Variables
> In bds.js, variables are accessed from the `Environment` class instance

```js
const os = require("node:os");
const env = new lib.Environment();
// Creating static variables
env.set('myname', 'Nivry'); // result in string
env.set('myage', 14); // result in number
env.set('mycats', ['Kitty', 'Rivi']) // result in array
env.set('totalmem', os.totalmem); // Run function
env.set('lowercase', async (ctx) => {
  ctx.argsCheck(1); // Built-in args check, automatically throws error if arguments size is below the required
  const arguments = ctx.getArgs();
  // Evaluate / Run the arguments beforehand
  const text = await ctx.evaluateArgs(arguments)[0] // The first compiled arg
  return text.toLowerCase();
});
```
### Global Variables
> Global variables are sourced from `Runtime.global`, allowing many codes to access the global environment while also keeping its own.
```js
const runtime = new lib.Runtime();
runtime.global.set('$helloWorld', 'Hello World!');
```

## Goals
- [x] Usable
- [ ] Basic utility Functions (4%)
- [x] Conditions / Logic support
- [x] Arithmetic support
- [ ] Compile-able code to JavaScript
- [x] Friendly-code for beginners
- [x] Native code (JavaScript) support
- [ ] Import & Export
- [ ] Runtime Error
- [x] Async promise support

## MIT License
License can be found [here](https://github.com/Kino7916/bds.js/blob/master/LICENSE)