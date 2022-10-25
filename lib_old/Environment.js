"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentManager = exports.ProtectedMap = exports.ProtectedEnvironment = exports.Environment = void 0;
class Environment {
    constructor(parent) {
        this.parent = parent;
        this.cache = new Map();
        if (parent && !(parent instanceof Environment))
            throw new Error(`supplied arg1 must be instanceof Environment!`);
    }
    set(key, value) {
        if (/[^a-z_0-9]/i.test(key))
            throw new Error(`invalid key '${key}', should only contain letters and/or underscore '_'`);
        this.cache.set(key, value);
    }
    ;
    _get(key) {
        if (!this.cache.has(key))
            throw new Error(`'${key}' is not defined!`);
        return this.cache.get(key);
    }
    ;
    get(key) {
        return this._recursiveGet(key);
    }
    _recursiveGet(key) {
        let env = this;
        while (true) {
            try {
                return env._get(key);
            }
            catch (err) {
                if (env?.parent) {
                    env = env.parent;
                    continue;
                }
                else
                    throw err;
            }
        }
    }
    del(key) {
        if (!this.cache.has(key))
            throw new Error(`'${key}' is not defined!`);
        return this.cache.delete(key);
    }
    ;
    clear() {
        return this.cache.clear();
    }
}
exports.Environment = Environment;
class ProtectedEnvironment extends Environment {
    constructor() {
        super(...arguments);
        this.cache = new ProtectedMap();
    }
    lock() {
        this.cache.lock();
    }
}
exports.ProtectedEnvironment = ProtectedEnvironment;
class ProtectedMap extends Map {
    constructor() {
        super();
        this.locked = false;
    }
    set(key, value) {
        if (this.locked)
            throw new Error("Map is locked!");
        return super.set(key, value);
    }
    delete(key) {
        if (this.locked)
            throw new Error("Map is locked!");
        return super.delete(key);
    }
    lock() {
        this.locked = true;
    }
    clear() {
        this.locked = false;
        return super.clear();
    }
}
exports.ProtectedMap = ProtectedMap;
class EnvironmentManager extends Environment {
    constructor() {
        super();
        this.envs = new Map();
        this.tracks = new Map();
    }
    ;
    _getEnv(key) {
        if (this.tracks.has(key))
            return this.envs.get(this.tracks.get(key));
        return this._getFromEnvs(key);
    }
    _get(key) {
        if (!this.cache.has(key) && this.envs.size > 0) {
            return this._getEnv(key).get(key);
        }
        return this.cache.get(key);
    }
    ;
    get(key) {
        return this._get(key);
    }
    _getFromEnvs(key) {
        let kenv = "";
        let fn = "";
        let err;
        for (const [k, env] of Array.from(this.envs.entries())) {
            try {
                fn = env.get(key);
                kenv = k;
            }
            catch (error) {
                err = error;
                continue;
            }
        }
        if (!kenv)
            throw err;
        this.tracks.set(fn, kenv);
        return this.envs.get(kenv);
    }
    addEnv(name, env) {
        if (typeof name !== "string" || /^[\s]+/.test(name))
            throw new Error("name must be not empty and typeof string!");
        if (!(env instanceof Environment))
            throw new Error("env must be instanceof Environment!");
        if (this.envs.has(name))
            throw new Error("Environment with name already exist!");
        this.envs.set(name, env);
        return this;
    }
    getEnv(name) {
        return this.envs.get(name);
    }
    removeEnv(name) {
        return this.envs.delete(name);
    }
}
exports.EnvironmentManager = EnvironmentManager;
