import { Environment } from "./Environment"
import { RuntimeBag } from "./RuntimeBag";
import { TokenArgument, TokenCall } from "./Lexer";
import { Runtime, RuntimeOptions } from "./Runtime";
import { Evaluator } from "./Evaluator";
type FnFunction = (ctx: Context) => any;

class Context {
    private _target: TokenCall = null;
    public options: RuntimeOptions;
    public constructor(public fileName: string, public bag: RuntimeBag, public env: Environment, public runtime: Runtime) {
        this.options = runtime.options;
    }
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
    /**
     * Returns a true if provided arguments exists
     * @param amount - Amount of argument required
     * @param throwError - Throw error automatically
     * @returns 
     */
    argsCheck(amount = 1, throwError = true) {
        if (this._target.child.length < amount)
           if (throwError) throw new Error(`Expected ${amount} arguments but got ${this._target.child.length}`)
           else return false;
        return true;
    }
    /**
     * Return arguments from `start` up to `end`
     * @param start - The start of index
     * @param end - Amount of argument returned
     * @returns 
     */
    getArgs(start = -1, end = 1) {
        if (start < 0) {
            return this._target.child.copyWithin(start, start);
        }
        return this._target.child.slice(start, end+1)
    }

    /**
     * Evaluate and run provided arguments
     * @param args - Arguments to run
     * @returns 
     */
    evaluateArgs(args: TokenArgument[]) {
        return Promise.all(args.map((v) => Evaluator.singleton.visitArgument(v, this)));
    }
}

export {
    Context
}