import { Context } from "./Context";

type EnvFunction = (ctx: Context) => any;
class Environment {
    private cache = new Map<string, any>();
    private constant = new Map<string, boolean>();
    public constructor(private parent?: Environment) {
        if (parent && ! (parent instanceof Environment)) throw new Error("parent env must be instanceof Environment!")
    }
    public set(name: string, value: EnvFunction): any;
    public set(name: string, value: any) {
        this.cache.set(name, value);
        return void 0;
    };
    public const() {};
    public get(name: string) {
        return this._recursiveGet(name);
    };
    private _get(name: string) {
        return (this.cache.has(name) ? this.cache.get(name) ?? null : void 0);
    }
    public remove(name: string) {
        return this.cache.delete(name);
    };

    private _recursiveGet(name: string) {
        let env = this as Environment;
        while (true) {
            try {
                let res = env._get(name);
                if (res === void 0) throw new Error(`Identifier ${name} is not defined`);
                return res;
            } catch (err) {
                if (env?.parent) {
                    env = env.parent;
                    continue;
                }
                throw err /*undefined*/;
            }
        }
    }
}

export {
    Environment
}