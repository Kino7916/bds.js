"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FnHandler = void 0;
const Nodes_1 = require("./Nodes");
class FnHandler {
    constructor(node, ctx) {
        this.node = node;
        this.ctx = ctx;
        this.hasArgs = false;
        if (this.node.children.size > 0)
            this.hasArgs = true;
    }
    getArgLength() {
        return this.node.children.size;
    }
    getEnv() {
        return this.ctx.script.env;
    }
    callIdentifier(name) {
        return this.ctx._callIdentifier(new Nodes_1.NodeIdentifier(name));
    }
    waitForArguments(...args) {
        let i = 0;
        let values = [];
        while (args.length > i) {
            const node = args[i++];
            values.push(node.visit(this.ctx));
        }
        return values;
    }
    ;
    getIdentifier(key) {
        return this.ctx.script.env.get(key);
    }
    getArg(id = 0) {
        return this.node.children.get(id);
    }
    getArgs(start, argCount = 1) {
        if (isNaN(start))
            throw new Error("Requires starting point!");
        return Array.from(this.node.children.values()).splice(start, argCount + 1);
    }
}
exports.FnHandler = FnHandler;
