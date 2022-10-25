import { Environment } from "./Environment";
declare class FileScript {
    fileName: string;
    private input;
    constructor(fileName?: string);
    getInput(): string;
    getFileInput(): void;
    prepareModules(parentEnv?: Environment): Script;
    private _read_ext_bds;
}
declare class Script {
    fileName: string;
    input: string;
    parentEnv?: Environment;
    env: Environment;
    private context;
    private ast;
    private lex;
    private parser;
    constructor(fileName: string, input: string, parentEnv?: Environment);
    prepareModules(): this;
    run(): any;
}
export { Script, FileScript };
