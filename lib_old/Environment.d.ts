import { FnHandler } from "./FnHandler";
declare type FnFunction = (handler: FnHandler) => any;
declare type ValueLike = string | number | FnFunction;
declare class Environment {
    parent?: Environment;
    protected cache: Map<string, any>;
    constructor(parent?: Environment);
    set(key: string, value: ValueLike): void;
    _get(key: string): any;
    get(key: string): any;
    private _recursiveGet;
    del(key: string): boolean;
    clear(): void;
}
declare class ProtectedEnvironment extends Environment {
    protected cache: ProtectedMap<string, any>;
    lock(): void;
}
declare class ProtectedMap<K extends any, V extends any> extends Map {
    protected locked: boolean;
    constructor();
    set(key: K, value: V): this;
    delete(key: any): boolean;
    lock(): void;
    clear(): void;
}
declare class EnvironmentManager extends Environment {
    protected envs: Map<string, Environment>;
    private tracks;
    constructor();
    private _getEnv;
    _get(key: string): any;
    get(key: string): any;
    private _getFromEnvs;
    addEnv(name: string, env: Environment): this;
    getEnv(name: string): Environment;
    removeEnv(name: string): boolean;
}
export { Environment, ProtectedEnvironment, ProtectedMap, EnvironmentManager };
