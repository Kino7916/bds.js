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
        
        this.set("regexp", async (handler) => {
            const [pattern, flag] = await handler.waitForArguments(...handler.getArgs(0,2));
            if (!pattern) throw new Error('pattern is required!');
            return RegExp(pattern, flag);
        });
        this.set("inspect", async (handler) => {
            const [obj, showHidden, deep, color] = await handler.waitForArguments(...handler.getArgs(0,4));
            return inspect(obj, showHidden, deep, color);
        });
        this.set("replace", async (handler) => {
            let [text, target, replace="", count=-1] = await handler.waitForArguments(...handler.getArgs(0, 4));
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
        this.set("typeof", async (handler) => {
            let arg = await handler.waitForArguments(handler.getArg(0));
            return typeof arg.shift();
        });
        this.set("instanceof", async (handler) => {
            let arg = await handler.waitForArguments(...handler.getArgs(0, 2));
            return arg.shift() instanceof arg.shift();
        });
        this.set("substr", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, 3));
            if (typeof args[0] !== "string") throw new Error("arg0 must be typeof string!");
            return args.shift().substring(...args);
        });
        this.set("contains", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, 2));
            if (typeof args[0] !== "string") throw new Error("arg0 must be typeof string!");
            return (args.shift() as string).includes(args.shift());
        });
        this.set("indexOf", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, 2));
            if (typeof args[0] !== "string") throw new Error("arg0 must be typeof string!");
            return (args.shift() as string).indexOf(args.shift());
        });
        this.set("len", async (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").length;
        });
        this.set("uppercase", async (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toUpperCase();
        });
        this.set("lowercase", async (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toLowerCase();
        });
        this.set("localuppercase", async (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toLocaleUpperCase();
        });
        this.set("locallowercase", async (handler) => {
            return String(handler.waitForArguments(handler.getArg(0)) ?? "").toLocaleLowerCase();
        });
        this.set("throw", async (handler) => {
            throw (await handler.waitForArguments(handler.getArg(0))).shift();
        });
        this.set("eval", async (handler) => {
            if (handler.argLength < 1) throw new Error("Expected 3 arguments, instead got " + handler.argLength + "!");
            let [evalStr, env=handler.getEnv(), returnOut=false] = await handler.waitForArguments(...handler.getArgs(0, 3)) ?? [];
            if (typeof evalStr !== "string") throw new Error("arg0 must be typeof string!");
            let script = new Scripts.Script("eval", evalStr, env);
            script.prepareModules();
            let out = script.run();
            if (returnOut) return out;
        });

        this.set("Error", async () => Error);

        this.cache.lock();
    }
}

class Path extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("resolve", async (handler) => {
            return path.resolve(...await handler.waitForArguments(...handler.getArgs(0, handler.argLength)));
        });
        this.set("join", async (handler) => {
            return path.join(...await handler.waitForArguments(...handler.getArgs(0, handler.argLength)));
        });
        this.set("isAbsolute", async (handler) => {
            return path.isAbsolute((await handler.waitForArguments(...handler.getArgs(0, 1))).shift());
        });
        this.set("dirname", async (handler) => {
            return path.dirname((await handler.waitForArguments(...handler.getArgs(0, 1))).shift());
        });
        this.set("basename", async (handler) => {
            return path.basename((await handler.waitForArguments(...handler.getArgs(0, 1))).shift());
        });
        this.set("extname", async (handler) => {
            return path.extname((await handler.waitForArguments(...handler.getArgs(0, 1))).shift());
        });

        this.cache.lock();
    }
}

class FileSystem extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("readdirSync", async (handler) => {
            return fs.readdirSync((await handler.waitForArguments(handler.getArg(0))).shift());
        });
        this.set("readFileSync", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0,2))
            return fs.readFileSync(args.shift(), args.shift());
        });
        this.set("writeFileSync", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0,3));
            fs.writeFileSync(args.shift(), args.shift(), args.shift());
            return "";
        });
        this.set("mkdirSync", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0,2));
            fs.mkdirSync(args.shift(), args.shift());
            return "";
        });
        this.set("unlinkSync", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0,1));
            fs.unlinkSync(args.shift());
            return "";
        });
        this.set("existsSync", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0,1));
            return fs.existsSync(args.shift());
        });
        this.set("statSync", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0,2));
            return fs.statSync(args.shift(), args.shift());
        });

        this.cache.lock();
    }
}

class Process extends Environments.ProtectedEnvironment {
    public constructor() {
        super();
        
        this.set("print", async (handler) => {
            console.log(...await handler.waitForArguments(...handler.getArgs(0, handler.argLength)));
            return "";
        });
        this.set("warn", async (handler) => {
            console.warn(... await handler.waitForArguments(...handler.getArgs(0,handler.argLength)));
            return "";
        });
        this.set("error", async (handler) => {
            console.error(... await handler.waitForArguments(...handler.getArgs(0,handler.argLength)));
            return "";
        });
        this.set("memoryUsage", async () => process.memoryUsage());
        this.set("pid", process.pid);
        this.set("platform", process.platform);
        this.set("title", process.title);
        this.set("hrtime", process.hrtime);
        this.set("uptime", async () => process.uptime());
        this.set("version", process.version);
        this.set("cwd", process.cwd());
        this.set("write", async (handler) => {
            process.stdin.write((await handler.waitForArguments(handler.getArg(0))).shift());
            return "";
        });

        this.cache.lock();
    }
}

class ObjectInteract extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("new", async (handler) => {
            if (handler.argLength > 0) {
                let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
                if (args[0]?.constructor) return new (args.shift() as any)(...args)
            } else return {};
        });
        
        this.set("get", async (handler) => {
            if (handler.argLength < 2) throw new Error("Expected 2 argument, got 0");
            let args = await handler.waitForArguments(...handler.getArgs(0, 2));
            return args.shift()[args.shift()];
        });

        this.set("set", async (handler) => {
            if (handler.argLength < 3) throw new Error("Expected 3 argument, got 0");
            let [obj, key, value] = await handler.waitForArguments(...handler.getArgs(0, 3));
            obj[key] = value;
            return obj;
        });

        this.set("delete", async (handler) => {
            if (handler.argLength < 2) throw new Error("Expected 2 argument, got 0");
            let [obj, key] = await handler.waitForArguments(...handler.getArgs(0, 2));
            delete obj[key]
            return obj;
        });
        this.cache.lock();
    }
}

class OS extends Environments.ProtectedEnvironment {
    public constructor() {
        super();

        this.set("tmpdir", async () => os.tmpdir());
        this.set("type", async () => os.type())
        this.set("platform", async () => os.platform());
        this.set("arch", async () => os.arch());
        this.set("freemem", async () => os.freemem());
        this.set("totalmem", async () => os.totalmem());
        this.set("cpus", async () => os.cpus());
        this.cache.lock();
    }
}
 
class Arithmetics extends Environments.ProtectedEnvironment {
    public constructor() {
        super()
        this.set("sum", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = 0;
            while (args.length > 0) {
                v += Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("sub", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = 0;
            while (args.length > 0) {
                v -= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("multi", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = 1;
            while (args.length > 0) {
                v *= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("div", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            let v = Number(args.shift());
            while (args.length > 0) {
                v /= Number(args.shift());
                if (isNaN(v)) break;
            }
            return v;
        });
        this.set("modulo", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, 2));
            return args.shift() % args.shift();
        });

        // Utilities
        this.set("isdigit", async (handler) => {
            let arg = await handler.waitForArguments(handler.getArg(0));
            return !isNaN(arg[0]);
        });
        this.set("isNaN", async (handler) => {
            let arg = await handler.waitForArguments(handler.getArg(0));
            return isNaN(arg[0]);
        });
        this.set("random", async () => Math.random());
        this.set("pi", async () => Math.PI);
        this.set("round", async (handler) => {
            let args = await handler.waitForArguments(handler.getArg(0));
            return Math.round(args.shift());
        });
        this.set("floor", async (handler) => {
            let args = await handler.waitForArguments(handler.getArg(0));
            return Math.floor(args.shift());
        });
        this.set("ceil", async (handler) => {
            let args = await handler.waitForArguments(handler.getArg(0));
            return Math.ceil(args.shift());
        });
        this.set("trunc", async (handler) => {
            let args = await handler.waitForArguments(handler.getArg(0));
            return Math.trunc(args.shift());
        });
        this.set("min", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            return Math.min(...args);
        });
        this.set("max", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
            return Math.max(...args);
        });
        this.set("pow", async (handler) => {
            let args = await handler.waitForArguments(...handler.getArgs(0, 2));
            return Math.pow(args.shift(), args.shift());
        });
        this.set("abs", async (handler) => {
            let args = await handler.waitForArguments(handler.getArg(0));
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