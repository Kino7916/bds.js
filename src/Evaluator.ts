import { Context } from "./Context";
import { Token, TokenArgument, TokenCall, TokenProgram} from "./Lexer";

class EvaluatorImpl {
    public constructor() {}

    evaluate(ast: TokenProgram, ctx: Context) {
        return this.visitArgument(ast, ctx);
    }
    visit(node: Token, ctx: Context) {
        if (node.type === "string") return node.value;
        if (node.type === "number") return node.value;
        if (node.type === "operator") return node.value;
        if (node.type === "call") return this.visitCall(node, ctx);
        if (node.type === "argument") return this.visitArgument(node, ctx);
        throw new Error("Unknown type of " + node.type + "!");
    };
    visitCall(node: TokenCall, ctx: Context) {
        return ctx.callIdentifier(node);
    };
    visitArgument(arg: TokenProgram | TokenArgument, ctx: Context) {
        let arr = arg.child.copyWithin(-1, -1);
        let v = []
        while (arr.length > 0) {
            let node = arr.shift();
            let res = this.visit(node, ctx);
            v.push(res);
        }
        return this.mapValues(v);
    };

    mapValues(values: any[]) {
        if (values.length < 1) return values[0];
        return values.map(v => String(v)).join("");
    }
}
const Evaluator = new EvaluatorImpl()
export {
    Evaluator,
    EvaluatorImpl
}