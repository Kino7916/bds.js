import { Context } from "./Context";
declare class NodePosition {
    idx: number;
    p: number;
    ln: number;
    constructor(idx: number, p: number, ln: number);
    copy(): NodePosition;
    static from(pos: NodePosition): NodePosition;
}
declare abstract class NodeToken {
    constructor();
    visit(ctx: Context): void;
}
declare abstract class NodeWChildren extends NodeToken {
    children: Map<number, NodeToken>;
    constructor();
    _addChild(node: NodeToken): void;
}
declare class NodeString extends NodeToken {
    value: string;
    constructor(value: string);
    visit(ctx: Context): string;
}
declare class NodeNumber extends NodeToken {
    value: string;
    constructor(value: string);
    visit(ctx: Context): number;
}
declare class NodeArgument extends NodeWChildren {
    constructor();
    visit(ctx: Context): any;
    _valueReturn(values: any[]): any;
}
declare class NodeIdentifier extends NodeWChildren {
    value: string;
    constructor(value: string);
    visit(ctx: Context): any;
}
declare class NodeProgram extends NodeWChildren {
    fileName: string;
    constructor(fileName: string);
    visit(ctx: Context): any;
    _valueReturn(values: any[]): any;
}
export { NodePosition, NodeToken, NodeString, NodeNumber, NodeIdentifier, NodeArgument, NodeProgram, NodeWChildren };
