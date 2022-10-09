# bds.js
Run and simulate string-based BDScript language in JavaScript

## Prerequisites
> This project requires a JavaScript runtime which supports ES2020 and ESModules.

## Changelog v1.0.11
### Added / New
- Support Promises (I/O Blocking)
### Breaking
- Execution system is changed to asynchronous
- `waitForArguments` return asynchronous
- `callIdentifier` return asynchronous

## Table of Contents
- [bds.js](#bdsjs)
  - [Prerequisites](#prerequisites)
  - [Changelog v1.0.11](#changelog-v1011)
    - [Added / New](#added--new)
    - [Breaking](#breaking)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Creating Environments](#creating-environments)
    - [Creating variables and functions](#creating-variables-and-functions)
    - [Preparing FileScript](#preparing-filescript)
    - [Multiple Environments](#multiple-environments)
    - [Running Script](#running-script)
    - [Working with Functions](#working-with-functions)
  - [Goals](#goals)
  - [MIT License](#mit-license)

## Installation
Install bds.js with npm:
```sh
$ npm install bds.js
```
or [getting releases](https://github.com/Kino7916/bds.js) from github

## Usage
### Creating Environments
Environments are used to define variables outside BDScript code

Example of usage:
```js
const Environment = require("bds.js").Environments.Environment;
const env = new Environment();
```
### Creating variables and functions
The use of Environments are to define variables and functions. These "identifiers" can be created by static value or using a function, it doesn't matter if you need extra arguments or not.
> Inputting arguments to a identifier (example $sum) is to use brackets ([ and ])
> Example > $sum[2;3;4] is (2 + 3 + 4)

Creating identifiers:
```js
env.set("hello", "world!"); // A string value identifier
env.set("age", 24); // Number value identifier
env.set("random", () => Math.random()); // Function without argument (The use of [])
env.set("random50", async (handler) => {
    // Getting raw arguments
    const raw_arguments = handler.getArgs(0, 2);
    // Waiting for arguments to run
    const arguments = await handler.waitForArguments(...raw_arguments);
    // Calling functions
    const chance = await handler.callIdentifier("random") * 100;
    if (chance > 50) return args[1];
    return args[0];
});
```
### Preparing FileScript
Create a file with name `index.bds` and fill with BDScript code

Preparing a Script for the file:
```js
const FileScript = require("bds.js").Scripts.FileScript;
const Script = new FileScript("./index.bds");
Script.getFileInput();
```
### Multiple Environments
A way to utilize multiple environments without the need to chain. It is also to support third-party libraries

Initializing Environment Manager:
```js
const lib = require("bds.js");
const { Arithmetics, Utility } = lib.Modules;
const envManager = lib.Environments.EnvironmentManager;
// Adding arithmetics and utility modules
envManager.add("math", new Arithmetics()).add("util", new Utility());
```
### Running Script
> You can use console.log() to print the output to console
```js
const runScript = Script.prepareModules(envManager);
runScript.run();                              
```
### Working with Functions
> These are modules / environments ready-for-use to help your development:
- `Arithmetics`
- `Utility`
- `Process`
- `ObjectInteract`
- `OS`
- `Path`
- `FileSystem`

Functions can return non-string Objects as long as it is not interferred by other type.
> Functions are case-sensitive, if the function is not found the runtime will error

As example with $pi (from Arithmetics module) and $typeof (Utility):
```py
$typeof[$pi] # number
$typeof[Pi is $pi] #string
```

## Goals
- [x] Usable
- [ ] Basic utility Functions (50%)
- [ ] Conditions / Logic support
- [x] Arithmetic support
- [ ] Compile-able code to JavaScript
- [ ] Easier access and friendly-code
- [ ] Native code (JavaScript) support
- [ ] Import & Export
- [ ] Runtime Error
- [ ] Discord Client
- [x] Async promise support

## MIT License
License can be found [here](https://github.com/Kino7916/bds.js/blob/master/LICENSE)