import fs from "fs";
import { Context } from "./Context";
import { Environment } from "./Environment";
import path from "path";
import { Lexer } from "./Lexer";
import { NodeProgram } from "./Nodes";
import { Parser } from "./Parser";
class FileScript {
    private input: string;
    public constructor(public fileName: string = "<module>") {};
    public getInput() {
        return this.input;
    }
    public getFileInput() {
        if (this.fileName === "<module>") return;
        if (! fs.existsSync(this.fileName)) throw new Error("path doesn't exist!");
        if (! fs.statSync(this.fileName).isFile()) throw new Error("path is not file!");
        this.input = fs.readFileSync(this.fileName, {encoding: "utf8"});
    }
    public prepareModules(parentEnv?: Environment) {
        const script = new Script(this.fileName, this.input, parentEnv);
        return script.prepareModules();
    }

    private _read_ext_bds() {};
}

class Script {
    public env: Environment;
    private context: Context;
    private ast: NodeProgram;
    private lex: Lexer;
    private parser: Parser;
    public constructor(public fileName: string, public input: string, public parentEnv?: Environment) {};

    public prepareModules() {
        this.env = new Environment(this.parentEnv);
        this.context = new Context(this);
        this.lex = new Lexer(this.input);
        this.parser = new Parser(this.lex.main());
        this.ast = this.parser.main();

        if (this.fileName === "<module>") {
            this.env.set("__dirname", this.fileName);
            this.env.set("__filename", this.fileName);
        } else {
            this.env.set("__filename", this.fileName);
            this.env.set("__dirname", path.join(this.fileName, ".."));
        }

        this.env.set("let", (handler) => {
            if (handler.getArgLength() < 2) throw new Error("Expected 2 argument, got 0");
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            this.env.set(args.shift(), args.shift());
            return "";
        });

        this.env.set("get", (handler) => {
            if (handler.getArgLength() < 1) throw new Error("Expected 1 argument, got 0");
            let args = handler.waitForArguments(handler.getArg(0));
            return this.env.get(args.shift());
        });

        this.env.set("tryAndCatch", (handler) => {
            try {
                return handler.waitForArguments(handler.getArg(0)).shift();
            } catch (err) {
                return err;
            }
        });

        return this;
    }

    public run() {
        return this.ast.visit(this.context);
    }
}

export {
    Script,
    FileScript
}