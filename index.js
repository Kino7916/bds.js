const lib = require("./lib/index");
const lexer = new lib.Lexer("AQ$input[$Ping;$g[f1;12;$gf];00]");
const parser = new lib.Parser();
const env = new (require("./lib/Environment").Environment)();
const ctx = new (require("./lib/Context").Context)("module", env);
const evaluator = new lib.Evaluator(null, ctx);

const ast = parser.parseToAst(lexer.main());
evaluator