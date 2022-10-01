import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import * as Nodes from "./Nodes";
import * as Scripts from "./Script";
import * as Environments from "./Environment";

class BuiltInEnvironment extends Environments.Environment {
    public constructor() {
        super();
        // Basic Functions
        this.set("print", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            console.log(...args)
        });
        this.set("sum", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.getArgLength()));
            let v = 0;
            while (args.length > 0) {
                v += Number(args.shift());
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
        this.set("random", (handler) => {
            return Math.random() * 100;
        });
        this.set("random50", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,1));
            let chance = handler.callIdentifier("random");
            if (chance > 50) return args[1];
            return args[0];
        })
    }
}

const ReadyEnvironments = {
    BuiltInEnvironment
}

export {
    Lexer,
    Parser,
    Nodes,
    Scripts,
    Environments,
    ReadyEnvironments
}