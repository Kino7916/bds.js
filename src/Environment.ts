class Environment {
    protected cache = new Map<string, any>();
    protected constant = new Map<string, boolean>();
    public constructor(private parent?: Environment) {
        if (! (parent instanceof Environment)) throw new Error("parent env must be instanceof Environment!")
    }

    public set(name: string, value: string) {
        this.cache.set(name, value);
        return void 0;
    };
    public const() {};
    public get(name: string) {
        return this._recursiveGet(name);
    };
    public remove(name: string) {
        return this.cache.delete(name);
    };

    private _recursiveGet(name: string) {
        let env = this as Environment;
        while (true) {
            try {
                return env.get(name)
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