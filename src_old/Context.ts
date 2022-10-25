import { FnHandler } from "./FnHandler";
import { NodeIdentifier } from "./Nodes";
import { Script } from "./Script";

class Context {
    public constructor(public script:Script) {};
    public async _callIdentifier(node: NodeIdentifier) {
        const fn = this.script.env.get(node.value);
        if (typeof fn === "function") {
            const handler = new FnHandler(node, this);
            return fn(handler);
        }
        return fn;
    }
    public mapValues(values: any[]) {
        if (values.length > 1) {
            return values.reduce((pv, v) => {
                if (!pv) return v;
                if (!isNaN(v) && !/\s/.test(v)) {
                    if (isNaN(pv)) {
                        pv = `${pv}${v}`;
                    } else {
                        pv = Number(`${pv}${v}`)
                    }
                } else {
                    pv = `${pv}${v}`;
                }
                return pv;
            }, null)
        } else if (values.length > 0) {
            return values[0];
        } else null;
    }
}

export {
    Context
}