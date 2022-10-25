import { Context } from "./Context";
import { Token, TokenArgument, TokenCall, TokenProgram} from "./Lexer";

class Evaluator {
    public constructor(public programNode: TokenProgram, public context: Context) {}

    evaluate(ast: Token) {
        return this.visitArgument(ast as TokenArgument)
    }

    visit(node: Token) {
        if (node.type === "string") return node.value;
        if (node.type === "number") return node.value;
        if (node.type === "operator") return node.value;
        if (node.type === "call") return this.visitCall(node);
        if (node.type === "argument") return this.visitArgument(node);
        throw new Error("Unknown type of " + node.type + "!");
    };
    visitCall(node: TokenCall) {
        return this.context.callIdentifier(node);
    };
    visitArgument(arg: TokenArgument) {
        let arr = arg.child.copyWithin(-1, -1);
        let v = []
        while (arr.length > 0) {
            let node = arr.shift();
            let res = this.visit(node);
            v.push(res);
        }
        return this.mapValues(v);
    };

    mapValues(values: any[]) {
        if (values.length < 1) return values[0];
        return values.map(v => String(v)).join("");
    }
}

export {
    Evaluator
}