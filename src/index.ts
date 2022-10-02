import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import * as Nodes from "./Nodes";
import * as Scripts from "./Script";
import * as Environments from "./Environment";
import { isRegExp } from "util/types";
import { inspect } from "util";

class Utility extends Environments.ProtectedEnvironment {
    public constructor() {
        super();
        this.set("print", (handler) => {
            console.log(...handler.waitForArguments(...handler.getArgs(0,handler.getArgLength())));
            return "";
        });
        this.set("regexp", (handler) => {
            const [pattern, flag] = handler.waitForArguments(...handler.getArgs(0,2));
            if (!pattern) throw new Error('pattern is required!');
            return RegExp(pattern, flag);
        });
        this.set("inspect", (handler) => {
            const [obj, showHidden, deep, color] = handler.waitForArguments(...handler.getArgs(0,4));
            return inspect(obj, showHidden, deep, color);
        });
        this.set("replace", (handler) => {
            let [text, target, replace="", count=-1] = handler.waitForArguments(...handler.getArgs(0, 4));
            if (!text) throw new Error("text is required!");
            if (!target) throw new Error("target is required!");
            text = String(text);
            if (isRegExp(target)) {
                return (text as string).replace(target, replace);
            } else {
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
    }
}

class Arithmetics extends Environments.ProtectedEnvironment {
    public constructor() {
        super()
        this.set("sum", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 0;
            while (args.length > 0) {
                v += Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("sub", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 0;
            while (args.length > 0) {
                v -= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("multi", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 1;
            while (args.length > 0) {
                v *= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("div", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = Number(args.shift());
            while (args.length > 0) {
                v /= Number(args.shift());
                if (isNaN(v)) break;
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
    Arithmetics
}

export {
    Lexer,
    Parser,
    Nodes,
    Scripts,
    Environments,
    Modules
}