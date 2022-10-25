import { Environment } from "./Environment"
import { RuntimeBag } from "./RuntimeBag";
import { TokenArgument, TokenCall } from "./Lexer";
import { Runtime } from "./Runtime";
import { Evaluator } from "./Evaluator";
type FnFunction = (ctx: Context) => any;

class Context {
    private _target: TokenCall = null;
    public constructor(public fileName: string, public bag: RuntimeBag, public env: Environment, public runtime: Runtime) {}
    async callIdentifier(node: TokenCall) {
        const fn = this.env.get(node.value);
        let lastTarget = this._target;
        if (typeof fn === "function") {
            this._target = node;
            return (fn as FnFunction)(this);
        }
        this._target = lastTarget;
        return fn;
    }
    argsCheck(amount = 1) {
        if (this._target.child.length < amount)
            throw new Error(`Expected ${amount} arguments but got ${this._target.child.length}`)
    }
    getArgs(start = 0, end = 1) {
        if (end < 0) {
            return this._target.child.slice(start);
        }
        return this._target.child.slice(start, end+1)
    }

    evaluateArgs(args: TokenArgument[]) {
        return args.map((v) => Evaluator.visitArgument(v, this));
    }
}

export {
    Context
}