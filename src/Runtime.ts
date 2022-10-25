import { Context } from "./Context";
import { Environment } from "./Environment";

class RuntimeEnvironment extends Environment {
    public globalEnvironments = new Map<string, Environment>();
}

class Runtime {
    public env = new RuntimeEnvironment();
    private contexts = new Map<string, Context>();

    public prepareContext(fileName: string) {
        let env = new Environment(this.env)
        let ctx = new Context(fileName, env);
        this.contexts.set(fileName, ctx);
    }

    public getContext(fileName: string) {
        return this.contexts.get(fileName);
    }
}

export {
    Runtime
}