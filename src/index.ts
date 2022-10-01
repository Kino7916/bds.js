import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import * as Nodes from "./Nodes";
import * as Scripts from "./Script";
import * as Environments from "./Environment";
import { isRegExp } from "util/types";
import { inspect } from "util";

class BuiltInEnvironment extends Environments.ProtectedEnvironment {
    public constructor() {
        super();
        // Basic Functions

        // Arithmatics
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
            let v = 0;
            while (args.length > 0) {
                v *= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("div", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 0;
            while (args.length > 0) {
                v /= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("isdigit", (handler) => {
            let arg = handler.waitForArguments(handler.getArg(0));
            return !isNaN(arg[0]);
        });
        this.set("isNaN", (handler) => {
            let arg = handler.waitForArguments(handler.getArg(0));
            return isNaN(arg[0]);
        });

        // Utility functions
        this.set("random", () => Math.random());
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

        this.cache.lock();
    }
}

class Arithmetics extends Environments.ProtectedEnvironment {
    public constructor() {
        this.parent();
    }
}

const Modules = {
    BuiltInEnvironment
}

export {
    Lexer,
    Parser,
    Nodes,
    Scripts,
    Environments,
    Modules
}