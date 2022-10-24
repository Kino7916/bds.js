import { Context } from "./Context";
import { Environment } from "./Environment";
import { Evaluator } from "./Evaluator";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import { RuntimeBag } from "./RuntimeBag";

interface RuntimeOptions {
    alwaysStrict: boolean
}

class Runtime {
    public global = new Environment();
    private contexts = new Map<string, Context>();
    private evaluator = Evaluator;
    public options: RuntimeOptions = {
        alwaysStrict: false
    }

    public runInput(fileName: string, input: string) {
        const ast = new Parser().parseToAst(/* Tokens */ new Lexer(input).main(), this);
        const ctx = this.prepareContext(fileName);
        return this.evaluator.evaluate(ast, ctx);
    }

    public prepareContext(fileName: string) {
        let env = new Environment(this.global)
        let bag = new RuntimeBag();
        let ctx = new Context(fileName, bag, env, this);
        this.contexts.set(fileName, ctx);

        return ctx;
    }

    public getContext(fileName: string) {
        return this.contexts.get(fileName);
    }
}

export {
    Runtime,
    RuntimeOptions
}