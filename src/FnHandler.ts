import { Context } from "./Context";
import { NodeArgument, NodeIdentifier, NodeToken } from "./Nodes";

class FnHandler {
    public constructor(private node: NodeIdentifier, private ctx: Context) {
        
    }
    public getArgLength() {
        return this.node.children.size;
    }
    public getEnv() {
        return this.ctx.script.env;
    }
    public callIdentifier(name: string) {
        return this.ctx._callIdentifier(new NodeIdentifier(name));
    }
    public waitForArguments(...args: NodeToken[]) {
        let i = 0;
        let values = [];
        while (args.length > i) {
            const node = args[i++];
            values.push(node.visit(this.ctx));
        }
        return values;
    };
    public getIdentifier(key: string) {
        return this.ctx.script.env.get(key);
    }
    public getArg(id = 0) {
        return this.node.children.get(id);
    }
    public getArgs(start: number, argCount = 1) {
        if (isNaN(start)) throw new Error("Requires starting point!");
        return Array.from(this.node.children.values()).splice(start, argCount+1);
    }
}

export {
    FnHandler
}