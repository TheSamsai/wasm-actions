const { spawnSync } = require("child_process");

const execSync = require("child_process").spawnSync;
    
const PATH_PREFIX = "wasm"

const run_wasi = (file, args) => {
    const result = spawnSync(
        "wasmedge", [`${PATH_PREFIX}/${file}`].concat(args.map(v => v.toString())),
        {
            encoding: "utf8"
        }
    );

    return result.stdout;
};

module.exports = { run_wasi };
