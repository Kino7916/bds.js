const lib = require("./lib");
const path = require("path");
const script = new lib.Scripts.FileScript("./index.bds");
script.getFileInput();
const sc = script.prepare_modules(new lib.ReadyEnvironments.BuiltInEnvironment());
console.log(sc.run())