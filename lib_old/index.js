"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modules = exports.Environments = exports.Scripts = exports.Nodes = exports.Parser = exports.Lexer = void 0;
const Lexer_1 = require("./Lexer");
Object.defineProperty(exports, "Lexer", { enumerable: true, get: function () { return Lexer_1.Lexer; } });
const Parser_1 = require("./Parser");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return Parser_1.Parser; } });
const Nodes = __importStar(require("./Nodes"));
exports.Nodes = Nodes;
const Scripts = __importStar(require("./Script"));
exports.Scripts = Scripts;
const Environments = __importStar(require("./Environment"));
exports.Environments = Environments;
const types_1 = require("util/types");
const util_1 = require("util");
class Utility extends Environments.ProtectedEnvironment {
    constructor() {
        super();
        this.set("regexp", (handler) => {
            const [pattern, flag] = handler.waitForArguments(...handler.getArgs(0, 2));
            if (!pattern)
                throw new Error('pattern is required!');
            return RegExp(pattern, flag);
        });
        this.set("inspect", (handler) => {
            const [obj, showHidden, deep, color] = handler.waitForArguments(...handler.getArgs(0, 4));
            return (0, util_1.inspect)(obj, showHidden, deep, color);
        });
        this.set("replace", (handler) => {
            let [text, target, replace = "", count = -1] = handler.waitForArguments(...handler.getArgs(0, 4));
            if (!text)
                throw new Error("text is required!");
            if (!target)
                throw new Error("target is required!");
            text = String(text);
            if ((0, types_1.isRegExp)(target)) {
                return text.replace(target, replace);
            }
            else {
                let i = 0;
                while (i < count) {
                    i++;
                    text = text.replace(String(target), replace);
                }
                return text;
            }
        });
        this.set("typeof", (handler) => {
            let arg = handler.waitForArguments(handler.getArg(0));
            return typeof arg.shift();
        });
        this.set("instanceof", (handler) => {
            let arg = handler.waitForArguments(...handler.getArgs(0, 2));
            return arg.shift() instanceof arg.shift();
        });
        this.set("substr", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 3));
            if (typeof args[0] !== "string")
                throw new Error("arg0 must be typeof string!");
            return args.shift().substring(...args);
        });
        this.set("contains", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            if (typeof args[0] !== "string")
                throw new Error("arg0 must be typeof string!");
            return args.shift().includes(args.shift());
        });
        this.set("indexOf", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            if (typeof args[0] !== "string")
                throw new Error("arg0 must be typeof string!");
            return args.shift().indexOf(args.shift());
        });
        this.set("len", (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").length;
        });
        this.set("uppercase", (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toUpperCase();
        });
        this.set("lowercase", (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toLowerCase();
        });
        this.set("localuppercase", (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toLocaleUpperCase();
        });
        this.set("locallowercase", (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toLocaleLowerCase();
        });
        this.cache.lock();
    }
}
class Process extends Environments.ProtectedEnvironment {
    constructor() {
        super();
        this.set("print", (handler) => {
            console.log(...handler.waitForArguments(...handler.getArgs(0, handler.getArgLength())));
            return "";
        });
        this.set("warn", (handler) => {
            console.warn(...handler.waitForArguments(...handler.getArgs(0, handler.getArgLength())));
            return "";
        });
        this.set("error", (handler) => {
            console.error(...handler.waitForArguments(...handler.getArgs(0, handler.getArgLength())));
            return "";
        });
        this.set("memoryUsage", () => process.memoryUsage());
        this.cache.lock();
    }
}
class ObjectInteract extends Environments.ProtectedEnvironment {
    constructor() {
        super();
        this.set("new", (handler) => {
            if (handler.getArgLength() > 0) {
                let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
                if (args[0]?.constructor)
                    return new (args.shift())();
            }
            else
                return {};
        });
        this.set("get", (handler) => {
            if (handler.getArgLength() < 2)
                throw new Error("Expected 2 argument, got 0");
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            return args.shift()[args.shift()];
        });
        this.set("set", (handler) => {
            if (handler.getArgLength() < 3)
                throw new Error("Expected 3 argument, got 0");
            let args = handler.waitForArguments(...handler.getArgs(0, 3));
            return args.shift()[args.shift()] = args.shift();
        });
        this.set("delete", (handler) => {
            if (handler.getArgLength() < 2)
                throw new Error("Expected 2 argument, got 0");
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            delete args.shift()[args.shift()];
            return "";
        });
        this.cache.lock();
    }
}
class OS extends Environments.ProtectedEnvironment {
    constructor() {
        super();
        this.cache.lock();
    }
}
class Arithmetics extends Environments.ProtectedEnvironment {
    constructor() {
        super();
        this.set("sum", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 0;
            while (args.length > 0) {
                v += Number(args.shift());
                if (isNaN(v))
                    break;
            }
            return v;
        });
        this.set("sub", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 0;
            while (args.length > 0) {
                v -= Number(args.shift());
                if (isNaN(v))
                    break;
            }
            return v;
        });
        this.set("multi", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 1;
            while (args.length > 0) {
                v *= Number(args.shift());
                if (isNaN(v))
                    break;
            }
            return v;
        });
        this.set("div", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = Number(args.shift());
            while (args.length > 0) {
                v /= Number(args.shift());
                if (isNaN(v))
                    break;
            }
            return v;
        });
        this.set("modulo", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            return args.shift() % args.shift();
        });
        // Utilities
        this.set("isdigit", (handler) => {
            let arg = handler.waitForArguments(handler.getArg(0));
            return !isNaN(arg[0]);
        });
        this.set("isNaN", (handler) => {
            let arg = handler.waitForArguments(handler.getArg(0));
            return isNaN(arg[0]);
        });
        this.set("random", () => Math.random());
        this.set("pi", () => Math.PI);
        this.set("round", (handler) => {
            let args = handler.waitForArguments(handler.getArg(0));
            return Math.round(args.shift());
        });
        this.set("floor", (handler) => {
            let args = handler.waitForArguments(handler.getArg(0));
            return Math.floor(args.shift());
        });
        this.set("ceil", (handler) => {
            let args = handler.waitForArguments(handler.getArg(0));
            return Math.ceil(args.shift());
        });
        this.set("trunc", (handler) => {
            let args = handler.waitForArguments(handler.getArg(0));
            return Math.trunc(args.shift());
        });
        this.set("min", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            return Math.min(...args);
        });
        this.set("max", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            return Math.max(...args);
        });
        this.set("pow", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            return Math.pow(args.shift(), args.shift());
        });
        this.set("abs", (handler) => {
            let args = handler.waitForArguments(handler.getArg(0));
            return Math.abs(args.shift());
        });
        this.cache.lock();
    }
}
const Modules = {
    Utility,
    Arithmetics,
    Process,
    ObjectInteract,
    OS
};
exports.Modules = Modules;
