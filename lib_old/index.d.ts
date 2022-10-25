import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import * as Nodes from "./Nodes";
import * as Scripts from "./Script";
import * as Environments from "./Environment";
declare class Utility extends Environments.ProtectedEnvironment {
    constructor();
}
declare class Process extends Environments.ProtectedEnvironment {
    constructor();
}
declare class ObjectInteract extends Environments.ProtectedEnvironment {
    constructor();
}
declare class OS extends Environments.ProtectedEnvironment {
    constructor();
}
declare class Arithmetics extends Environments.ProtectedEnvironment {
    constructor();
}
declare const Modules: {
    Utility: typeof Utility;
    Arithmetics: typeof Arithmetics;
    Process: typeof Process;
    ObjectInteract: typeof ObjectInteract;
    OS: typeof OS;
};
export { Lexer, Parser, Nodes, Scripts, Environments, Modules };
