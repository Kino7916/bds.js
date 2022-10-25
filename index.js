const lib = require("./lib/index");
// const lexer = new lib.Lexer("Af$input[Ab;$puli;$tp[f;$pi;15f];12]");
// const parser = new lib.Parser();
// const env = new (require("./lib/Environment").Environment)();
// const ctx = new (require("./lib/Context").Context)("<module>", env);
// const evaluator = new lib.Evaluator(ctx);
// const ast = parser.parseToAst(lexer.main());
// const result = evaluator.evaluate(ast);
const runtime = new lib.Runtime();
runtime.global.set('$print', async (ctx) => {
    console.log(await ctx.evaluateArgs(ctx.getArgs())[0]);
    return "";
});
runtime.global.set('$udin', (ctx) => {
    return "Udin";
});
runtime.global.set('$vp', (ctx) => {
    return Promise.resolve('1')
});
runtime.global.set('$swait', (ctx) => {
    return new Promise((res, rej) => setTimeout(() => res(''), 1000))
});
runtime.global.set('$async', (ctx) => {
    new Promise((res, rej) => {
        Promise.all(ctx.evaluateArgs(ctx.getArgs()))
        .then(res)
        .catch(rej)
    });
    return ''
});

const input = "14fast$async[$swait $print[1]]$vp";
const result = runtime.runInput(__filename, input);
result.then(v => console.log(v))
