import { Context } from "./Context";
import { Token } from "./Lexer";

class NodePosition {
    public constructor(public idx: number, public p: number, public ln: number) {}
    public copy() {
        return new NodePosition(this.idx, this.p, this.ln);
    }
    static from(pos: NodePosition) {
        return new NodePosition(pos.idx, pos.p, pos.ln);
    }
}
abstract class NodeToken {
    public constructor() {}
    public visit(ctx: Context) {throw new Error("Unimplemented Err!")}
}

abstract class NodeWChildren<T extends NodeToken | Token = NodeToken> extends NodeToken {
    public children = new Map<number, T>();
    public constructor() {super()}
    public _addChild(node: T) {
        this.children.set(this.children.size, node);
    }
}

class NodeString extends NodeToken {
    public constructor(public value: string) {super()};
    public visit(ctx: Context) {return this.value};
}

class NodeNumber extends NodeToken {
    public constructor(public value: string) {super()};
    public visit(ctx: Context) {return Number(this.value)}
}

class NodeArgument extends NodeWChildren {
    public constructor() {super()}
    public visit(ctx: Context) {
        let values = [];
        const arr = Array.from(this.children.values());
        while (arr.length > 0) {
            const node = arr.shift();
            values.push(node.visit(ctx));
        }
        return this._valueReturn(values)
    }
    public _valueReturn(values: any[]) {
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

class NodeIdentifier extends NodeWChildren {
    public constructor(public value: string) {super()}
    public visit(ctx: Context) {
        return ctx._callIdentifier(this);
    }
}

class NodeOp extends NodeToken {
    public constructor(public value: string) {super()}
    public visit(ctx: Context) {
        return this.value;
    }
}

class NodeProgram extends NodeWChildren {
    public constructor(public fileName: string) {super()};
    public visit(ctx: Context) {
        const arr = Array.from(this.children.values());
        let values = [];
        while (arr.length > 0) {
            const node = arr.shift();
            values.push(node.visit(ctx))
        }
        return this._valueReturn(values);
    };

    public _valueReturn(values: any[]) {
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
    NodePosition,
    NodeToken,
    NodeString,
    NodeNumber,
    NodeIdentifier,
    NodeArgument,
    NodeProgram,
    NodeWChildren,
    NodeOp
}