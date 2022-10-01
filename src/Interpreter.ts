import { Environment } from "./Environment";
import { NodeProgram } from "./Nodes";
import path from "path";
import { Context } from "./Context";
import { FnHandler } from "./FnHandler";


// Unused
class Interpreter {
    public mainEnvironment = new Environment();
    public constructor() {
        this.mainEnvironment.set("__filename", "<module>");
        this.mainEnvironment.set("__dirname", "<module>");
        this.mainEnvironment.set("print", (handler: FnHandler) => {
            const arg0 = handler.getArg(0);
            console.log(arg0);
        });
    };

    // Prepare execution and generate Tools for script
    // Environment variables
    // Function handling
    // Error dumping / bags
    // Plugins Injection
    public prepareEnv(fileName: string) {
        const env = new Environment(this.mainEnvironment);
        env.set("__filename", fileName);
        env.set("__dirname", path.join(fileName, ".."));
        
        return env;
    }
}

export {
    Interpreter
}