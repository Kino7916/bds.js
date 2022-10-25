"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const FnHandler_1 = require("./FnHandler");
class Context {
    constructor(script) {
        this.script = script;
    }
    ;
    _callIdentifier(node) {
        const fn = this.script.env.get(node.value);
        if (typeof fn === "function") {
            const handler = new FnHandler_1.FnHandler(node, this);
            return fn(handler);
        }
        return fn;
    }
}
exports.Context = Context;
