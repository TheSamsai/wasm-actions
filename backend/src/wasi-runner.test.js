
const wasi_runner = require('./wasi-runner')

test('Running add.wasm with parameters [1, 1] adds to 2', () => {
    expect(wasi_runner.run_wasi("add.wasm", [1, 1])).toEqual("2\n");
});

test('Running add.wasm with parameters [1, 1, 1] adds to 3', () => {
    expect(wasi_runner.run_wasi("add.wasm", [1, 1, 1])).toEqual("3\n");
});
