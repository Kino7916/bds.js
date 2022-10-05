import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import * as Nodes from "./Nodes";
import * as Scripts from "./Script";
import * as Environments from "./Environment";
import { isRegExp } from "util/types";
import { inspect } from "util";
import * as os from "os";
import * as fs from "fs";
import path from "path";

class Utility extends Environments.ProtectedEnvironment {
    public constructor() {
        super();
        
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
        this.set("instanceof", (handler) => {
            let arg = handler.waitForArguments(...handler.getArgs(0, 2));
            return arg.shift() instanceof arg.shift();
        });
        this.set("substr", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 3));
            if (typeof args[0] !== "string") throw new Error("arg0 must be typeof string!");
            return args.shift().substring(...args);
        });
        this.set("contains", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            if (typeof args[0] !== "string") throw new Error("arg0 must be typeof string!");
            return (args.shift() as string).includes(args.shift());
        });
        this.set("indexOf", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            if (typeof args[0] !== "string") throw new Error("arg0 must be typeof string!");
            return (args.shift() as string).indexOf(args.shift());
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
        this.set("throw", (handler) => {
            throw handler.waitForArguments(handler.getArg(0)).shift();
        });
        this.set("eval", (handler) => {
            if (handler.argLength < 1) throw new Error("Expected 3 arguments, instead got " + handler.argLength + "!");
            let [evalStr, env=handler.getEnv(), returnOut=false] = handler.waitForArguments(...handler.getArgs(0, 3)) ?? [];
            if (typeof evalStr !== "string") throw new Error("arg0 must be typeof string!");
            let script = new Scripts.Script("eval", evalStr, env);
            script.prepareModules();
            let out = script.run();
            if (returnOut) return out;
        });

        this.set("Error", () => Error);

        this.cache.lock();
    }
}

class Path extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("resolve", (handler) => {
            return path.resolve(...handler.waitForArguments(...handler.getArgs(0, handler.argLength)));
        });
        this.set("join", (handler) => {
            return path.join(...handler.waitForArguments(...handler.getArgs(0, handler.argLength)));
        });
        this.set("isAbsolute", (handler) => {
            return path.isAbsolute(handler.waitForArguments(...handler.getArgs(0, 1)).shift());
        });
        this.set("dirname", (handler) => {
            return path.dirname(handler.waitForArguments(...handler.getArgs(0, 1)).shift());
        });
        this.set("basename", (handler) => {
            return path.basename(handler.waitForArguments(...handler.getArgs(0, 1)).shift());
        });
        this.set("extname", (handler) => {
            return path.extname(handler.waitForArguments(...handler.getArgs(0, 1)).shift());
        });

        this.cache.lock();
    }
}

class FileSystem extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("readdirSync", (handler) => {
            return fs.readdirSync(handler.waitForArguments(handler.getArg(0)).shift());
        });
        this.set("readFileSync", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,2))
            return fs.readFileSync(args.shift(), args.shift());
        });
        this.set("writeFileSync", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,3));
            fs.writeFileSync(args.shift(), args.shift(), args.shift());
            return "";
        });
        this.set("mkdirSync", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,2));
            fs.mkdirSync(args.shift(), args.shift());
            return "";
        });
        this.set("unlinkSync", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,1));
            fs.unlinkSync(args.shift());
            return "";
        });
        this.set("existsSync", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,1));
            return fs.existsSync(args.shift());
        });
        this.set("statSync", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0,2));
            return fs.statSync(args.shift(), args.shift());
        });

        this.cache.lock();
    }
}

class Process extends Environments.ProtectedEnvironment {
    public constructor() {
        super();
        
        this.set("print", (handler) => {
            console.log(...handler.waitForArguments(...handler.getArgs(0,handler.argLength)));
            return "";
        });
        this.set("warn", (handler) => {
            console.warn(...handler.waitForArguments(...handler.getArgs(0,handler.argLength)));
            return "";
        });
        this.set("error", (handler) => {
            console.error(...handler.waitForArguments(...handler.getArgs(0,handler.argLength)));
            return "";
        });
        this.set("memoryUsage", () => process.memoryUsage());
        this.set("pid", process.pid);
        this.set("platform", process.platform);
        this.set("title", process.title);
        this.set("hrtime", process.hrtime);
        this.set("uptime", () => process.uptime());
        this.set("version", process.version);
        this.set("cwd", process.cwd());
        this.set("write", (handler) => {
            process.stdin.write(handler.waitForArguments(handler.getArg(0)).shift());
            return "";
        });

        this.cache.lock();
    }
}

class ObjectInteract extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("new", (handler) => {
            if (handler.argLength > 0) {
                let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
                if (args[0]?.constructor) return new (args.shift() as any)(...args)
            } else return {};
        });
        
        this.set("get", (handler) => {
            if (handler.argLength < 2) throw new Error("Expected 2 argument, got 0");
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            return args.shift()[args.shift()];
        });

        this.set("set", (handler) => {
            if (handler.argLength < 3) throw new Error("Expected 3 argument, got 0");
            let [obj, key, value] = handler.waitForArguments(...handler.getArgs(0, 3));
            obj[key] = value;
            return obj;
        });

        this.set("delete", (handler) => {
            if (handler.argLength < 2) throw new Error("Expected 2 argument, got 0");
            let [obj, key] = handler.waitForArguments(...handler.getArgs(0, 2));
            delete obj[key]
            return obj;
        });
        this.cache.lock();
    }
}

class OS extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("tmpdir", () => os.tmpdir());
        this.set("type", () => os.type())
        this.set("platform", () => os.platform());
        this.set("arch", () => os.arch());
        this.set("freemem", () => os.freemem());
        this.set("totalmem", () => os.totalmem());
        this.set("cpus", () => os.cpus());
        this.cache.lock();
    }
}
 
class Arithmetics extends Environments.ProtectedEnvironment {
    public constructor() {
        super()
        this.set("sum", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = 0;
            while (args.length > 0) {
                v += Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("sub", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = 0;
            while (args.length > 0) {
                v -= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("multi", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = 1;
            while (args.length > 0) {
                v *= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("div", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
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
            let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            return Math.min(...args);
        });
        this.set("max", (handler) => {
            let args = handler.waitForArguments(...handler.getArgs(0, handler.argLength));
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
    OS,
    FileSystem,
    Path
}

export {
    Lexer,
    Parser,
    Nodes,
    Scripts,
    Environments,
    Modules
}