const { spawnSync } = require("child_process");

const PATH_PREFIX = "wasm"

const run_wasi = (file, params) => {
  // Set up all the environment variables we intend to pass into the WASM workload
  const env = {
    "HTTP_content-length": params.stdin.length,
    "HTTP_content-type": 'application/json',
    "METHOD": params.method,
    "PATH_INFO": params.path_info,
    "QUERY_STRING": params.query_string
  };

  // Mangle the list of environment variables into a list of commandline arguments
  const env_list = Object.entries(env).map(([key, value]) => {
    return ['--env', `${key}=${value}`];
  }).flat();

  const options = ["--time-limit", "5000"]

  console.log(params)

  if (params.fs_path) {
    options.push("--dir")
    options.push(`.:${params.fs_path}`)
  }

  const result = spawnSync(
    "wasmedge", options.concat(env_list).concat([`${PATH_PREFIX}/${file}`]).concat(params.args.map(v => v.toString())),
    {
      input: params.stdin,
      encoding: "utf8"
    }
  );

  return {
    stdout: result.stdout,
    stderr: result.stderr
  };
};

module.exports = { run_wasi };
