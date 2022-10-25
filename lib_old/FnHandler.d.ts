import { Context } from "./Context";
import { NodeIdentifier, NodeToken } from "./Nodes";
declare class FnHandler {
    private node;
    private ctx;
    hasArgs: boolean;
    constructor(node: NodeIdentifier, ctx: Context);
    getArgLength(): number;
    getEnv(): import("./Environment").Environment;
    callIdentifier(name: string): any;
    waitForArguments(...args: NodeToken[]): any[];
    getIdentifier(key: string): any;
    getArg(id?: number): NodeToken;
    getArgs(start: number, argCount?: number): NodeToken[];
}
export { FnHandler };
