import { FnHandler } from "./FnHandler";
import { NodeIdentifier } from "./Nodes";
import { Script } from "./Script";

class Context {
    public constructor(public script:Script) {};
    public call_identifier(node: NodeIdentifier) {
        const fn = this.script.env.get(node.value);
        if (typeof fn === "function") {
            const handler = new FnHandler(node, this);
            return fn(handler);
        }
        return fn;
    }
}

export {
    Context
}