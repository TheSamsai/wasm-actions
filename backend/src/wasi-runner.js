const { spawnSync } = require("child_process");

const execSync = require("child_process").spawnSync;
    
// const result = execSync("python celulas.py");
    
// // convert and show the output.
// console.log(result.toString("utf8"));

const run_wasi = (file, args) => {
    const result = spawnSync(
        "node", ["--no-warnings", "--experimental-wasi-unstable-preview1", "./src/wasi-process.mjs", file].concat(args.map(v => v.toString())),
        {
            encoding: "utf8"
        }
    );

    return result.stdout;
};

module.exports = { run_wasi };
