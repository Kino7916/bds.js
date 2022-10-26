const lib = require("./lib/index");
const fs = require('fs');
const runtime = new lib.Runtime();
const input = fs.readFileSync('index.bds', {encoding: "utf8"})
const result = runtime.runInput('index.bds', input);
result.then(output => console.log(output));
