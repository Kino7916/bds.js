const lib = require("./lib/index");
// const lexer = new lib.Lexer("Af$input[Ab;$puli;$tp[f;$pi;15f];12]");
// const parser = new lib.Parser();
// const env = new (require("./lib/Environment").Environment)();
// const ctx = new (require("./lib/Context").Context)("<module>", env);
// const evaluator = new lib.Evaluator(ctx);
// const ast = parser.parseToAst(lexer.main());
// const result = evaluator.evaluate(ast);
const runtime = new lib.Runtime();
runtime.global.set('$print', (ctx) => {
    console.log(ctx.evaluateArgs(ctx.getArgs())[0]);
    return "";
});
const input = "14fast$print[ab]"
const result = runtime.runInput(__filename, input);
console.log(result);
