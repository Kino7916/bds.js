"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeWChildren = exports.NodeProgram = exports.NodeArgument = exports.NodeIdentifier = exports.NodeNumber = exports.NodeString = exports.NodeToken = exports.NodePosition = void 0;
class NodePosition {
    constructor(idx, p, ln) {
        this.idx = idx;
        this.p = p;
        this.ln = ln;
    }
    copy() {
        return new NodePosition(this.idx, this.p, this.ln);
    }
    static from(pos) {
        return new NodePosition(pos.idx, pos.p, pos.ln);
    }
}
exports.NodePosition = NodePosition;
class NodeToken {
    constructor() { }
    visit(ctx) { throw new Error("Unimplemented Err!"); }
}
exports.NodeToken = NodeToken;
class NodeWChildren extends NodeToken {
    constructor() {
        super();
        this.children = new Map();
    }
    _addChild(node) {
        this.children.set(this.children.size, node);
    }
}
exports.NodeWChildren = NodeWChildren;
class NodeString extends NodeToken {
    constructor(value) {
        super();
        this.value = value;
    }
    ;
    visit(ctx) { return this.value; }
    ;
}
exports.NodeString = NodeString;
class NodeNumber extends NodeToken {
    constructor(value) {
        super();
        this.value = value;
    }
    ;
    visit(ctx) { return Number(this.value); }
}
exports.NodeNumber = NodeNumber;
class NodeArgument extends NodeWChildren {
    constructor() { super(); }
    visit(ctx) {
        let values = [];
        const arr = Array.from(this.children.values());
        while (arr.length > 0) {
            const node = arr.shift();
            values.push(node.visit(ctx));
        }
        return this._valueReturn(values);
    }
    _valueReturn(values) {
        if (values.length > 1) {
            return values.reduce((pv, v) => {
                if (!pv)
                    return v;
                if (!isNaN(v) && !/\s/.test(v)) {
                    if (isNaN(pv)) {
                        pv = `${pv}${v}`;
                    }
                    else {
                        pv = Number(`${pv}${v}`);
                    }
                }
                else {
                    pv = `${pv}${v}`;
                }
                return pv;
            }, null);
        }
        else if (values.length > 0) {
            return values[0];
        }
        else
            null;
    }
}
exports.NodeArgument = NodeArgument;
class NodeIdentifier extends NodeWChildren {
    constructor(value) {
        super();
        this.value = value;
    }
    visit(ctx) {
        return ctx._callIdentifier(this);
    }
}
exports.NodeIdentifier = NodeIdentifier;
class NodeProgram extends NodeWChildren {
    constructor(fileName) {
        super();
        this.fileName = fileName;
    }
    ;
    visit(ctx) {
        const arr = Array.from(this.children.values());
        let values = [];
        while (arr.length > 0) {
            const node = arr.shift();
            values.push(node.visit(ctx));
        }
        return this._valueReturn(values);
    }
    ;
    _valueReturn(values) {
        if (values.length > 1) {
            return values.reduce((pv, v) => {
                if (!pv)
                    return v;
                if (!isNaN(v) && !/\s/.test(v)) {
                    if (isNaN(pv)) {
                        pv = `${pv}${v}`;
                    }
                    else {
                        pv = Number(`${pv}${v}`);
                    }
                }
                else {
                    pv = `${pv}${v}`;
                }
                return pv;
            }, null);
        }
        else if (values.length > 0) {
            return values[0];
        }
        else
            null;
    }
}
exports.NodeProgram = NodeProgram;
