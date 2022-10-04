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
const sc = script.prepareModules(env_mgr);
console.log(sc.run())