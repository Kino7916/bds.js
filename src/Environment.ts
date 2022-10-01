import { FnHandler } from "./FnHandler";

type FnFunction = (handler: FnHandler) => any;
type ValueLike = string | number | FnFunction;

class Environment {
    protected cache = new Map<string, any>();
    public constructor(public parent?: Environment) {
        if (parent && ! (parent instanceof Environment)) 
            throw new Error(`supplied arg1 must be instanceof Environment!`);
    }

    public set(key: string, value: ValueLike) {
        if (/[^a-z_0-9]/i.test(key)) throw new Error(`invalid key '${key}', should only contain letters and/or underscore '_'`);
        this.cache.set(key, value);
    };
    private _get(key: string) {
        if (! this.cache.has(key)) throw new Error(`'${key}' is not defined!`);
        return this.cache.get(key);
    };
    public get(key: string) {
        return this._recursiveGet(key);
    }
    private _recursiveGet(key: string) {
        let env = this as Environment;
        while (true) {
            try {
                return env._get(key);
            } catch (err) {
                if (env?.parent) {
                    env = env.parent;
                    continue;
                } else throw err;
            }
        }
    }
    public del(key: string) {
        if (! this.cache.has(key)) throw new Error(`'${key}' is not defined!`);
        return this.cache.delete(key);
    };
}

class ProtectedEnvironment extends Environment {
    protected cache = new ProtectedMap<string, any>();
    public lock() {
        this.cache.lock();
    }
}

class ProtectedMap<K extends any, V extends any> extends Map {
    protected locked = false;
    public constructor() {
        super();
    }
    public set(key: K, value: V): this {
        if (this.locked) throw new Error("Map is locked!");
        return super.set(key, value);
    }
    public delete(key: any): boolean {
        if (this.locked) throw new Error("Map is locked!");
        return super.delete(key);
    }
    public lock() {
        this.locked = true;
    }
}

// Variables Tools

export {
    Environment,
    ProtectedEnvironment,
    ProtectedMap
}