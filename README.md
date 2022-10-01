# bds.js
> Run and simulate string-based BDScript language in JavaScript

## Prerequisites
> This project requires a JavaScript runtime which supports ES2020 and ESModules.

## Table of Contents
- [bds.js](#bdsjs)
  - [Prerequisites](#prerequisites)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Creating Environments](#creating-environments)
    - [Preparing a Script](#preparing-a-script)
    - [Running Script](#running-script)
  - [Goals](#goals)
  - [MIT License](#mit-license)

## Installation
Install bds.js with npm:
```sh
$ npm install bds.js
```
or [getting releases](#) from github

## Usage
### Creating Environments
Environments are used to define variables outside BDScript code

Example of usage:
```js
const Environment = require("bds.js").Environments.Environment;
const env = new Environment();
```
Creating variables and functions:
```js
env.set("hello", "world!");
env.set("age", 24);
env.set("random", () => Math.random())
env.set("random50", (handler) => {
    // Getting raw arguments
    const raw_arguments = handler.getArgs(0, 2);
    // Waiting for arguments to run
    const arguments = handler.waitForArguments(...raw_arguments);
    // Calling functions
    const chance = handler.callIdentifier("random") * 100;
    if (chance > 50) return args[1];
    return args[0];
});
```
### Preparing a Script
Create a file with name `index.bds` and write BDScript code

Preparing a Script for the file:
```js
const ReadyScript = require("bds.js").Scripts.FileScript;
const Script = new FileScript("./index.bds");
Script.getFileInput();
```
### Running Script
> You can use console.log() to print the output to console
```js
const script = Script.prepare_modules();
script.run();
```

## Goals
- [x] Usable
- [ ] Creating Basic Functions
- [ ] Conditions functions
- [ ] Arithmetic support
- [ ] Better Lexer and Parsing
- [ ] Better Interpreter System
- [ ] Compile-able code to JavaScript
- [ ] Easier access and friendly-code

## MIT License
License can be found [here](#)