const lib = require("./lib");
const path = require("path");
const script = new lib.Scripts.FileScript("./index.bds");
script.getFileInput();
const env_mgr = new lib.Environments.EnvironmentManager();
env_mgr.addEnv("native-math", new lib.Modules.Arithmetics);
env_mgr.addEnv("native-util", new lib.Modules.Utility);
env_mgr.addEnv("native-os", new lib.Modules.OS);
env_mgr.addEnv("native-process", new lib.Modules.Process);
env_mgr.addEnv("native-OI", new lib.Modules.ObjectInteract);
env_mgr.addEnv("native-path", new lib.Modules.Path);
env_mgr.addEnv("native-fs", new lib.Modules.FileSystem);
env_mgr.set("test", async (handler) => {
    return await handler.waitForArguments(...handler.getArgs(0, handler.argLength));
});
env_mgr.set("v1", (handler) => {
    return "v1awd"
});
env_mgr.set("v2", async () => {
    return Promise.resolve(14)
});
const sc = script.prepareModules(env_mgr);
sc.run().then(console.log)