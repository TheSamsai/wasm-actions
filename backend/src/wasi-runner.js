const { spawnSync } = require("child_process");

const execSync = require("child_process").spawnSync;
    
const PATH_PREFIX = "wasm"

const run_wasi = (file, stdin, args) => {
    // Set up all the environment variables we intend to pass into the WASM workload
    const env = {
        "HTTP_content-length": stdin.length,
        "HTTP_content-type": 'application/json'
    };

    // Mangle the list of environment variables into a list of commandline arguments
    const env_list = Object.entries(env).map(([key, value]) => {
        return ['--env', `${key}=${value}`];
    }).flat();

    console.log(env_list);

    const result = spawnSync(
        "wasmedge", env_list.concat([`${PATH_PREFIX}/${file}`]).concat(args.map(v => v.toString())),
        {
            input: stdin,
            encoding: "utf8"
        }
    );

    return result.stdout;
};

module.exports = { run_wasi };
