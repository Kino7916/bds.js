"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileScript = exports.Script = void 0;
const fs_1 = __importDefault(require("fs"));
const Context_1 = require("./Context");
const Environment_1 = require("./Environment");
const path_1 = __importDefault(require("path"));
const Lexer_1 = require("./Lexer");
const Parser_1 = require("./Parser");
class FileScript {
    constructor(fileName = "<module>") {
        this.fileName = fileName;
    }
    ;
    getInput() {
        return this.input;
    }
    getFileInput() {
        if (this.fileName === "<module>")
            return;
        if (!fs_1.default.existsSync(this.fileName))
            throw new Error("path doesn't exist!");
        if (!fs_1.default.statSync(this.fileName).isFile())
            throw new Error("path is not file!");
        this.input = fs_1.default.readFileSync(this.fileName, { encoding: "utf8" });
    }
    prepareModules(parentEnv) {
        const script = new Script(this.fileName, this.input, parentEnv);
        return script.prepareModules();
    }
    _read_ext_bds() { }
    ;
}
exports.FileScript = FileScript;
class Script {
    constructor(fileName, input, parentEnv) {
        this.fileName = fileName;
        this.input = input;
        this.parentEnv = parentEnv;
    }
    ;
    prepareModules() {
        this.env = new Environment_1.Environment(this.parentEnv);
        this.context = new Context_1.Context(this);
        this.lex = new Lexer_1.Lexer(this.input);
        this.parser = new Parser_1.Parser(this.lex.main());
        this.ast = this.parser.main();
        if (this.fileName === "<module>") {
            this.env.set("__dirname", this.fileName);
            this.env.set("__filename", this.fileName);
        }
        else {
            this.env.set("__filename", this.fileName);
            this.env.set("__dirname", path_1.default.join(this.fileName, ".."));
        }
        this.env.set("let", (handler) => {
            if (handler.getArgLength() < 2)
                throw new Error("Expected 2 argument, got 0");
            let args = handler.waitForArguments(...handler.getArgs(0, 2));
            this.env.set(args.shift(), args.shift());
            return "";
        });
        this.env.set("get", (handler) => {
            if (handler.getArgLength() < 1)
                throw new Error("Expected 1 argument, got 0");
            let args = handler.waitForArguments(handler.getArg(0));
            return this.env.get(args.shift());
        });
        return this;
    }
    run() {
        return this.ast.visit(this.context);
    }
}
exports.Script = Script;
