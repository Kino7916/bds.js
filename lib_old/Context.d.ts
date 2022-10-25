import { NodeIdentifier } from "./Nodes";
import { Script } from "./Script";
declare class Context {
    script: Script;
    constructor(script: Script);
    _callIdentifier(node: NodeIdentifier): any;
}
export { Context };
