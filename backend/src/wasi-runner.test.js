
const wasi_runner = require('./wasi-runner')

test('Running add.wasm with parameters [1, 1] adds to 2', () => {
    expect(wasi_runner.run_wasi("add.wasm", "", [1, 1])).toEqual("2\n");
});

test('Running add.wasm with parameters [1, 1, 1] adds to 3', () => {
    expect(wasi_runner.run_wasi("add.wasm", "", [1, 1, 1])).toEqual("3\n");
});

test('Running pong.wasm returns HTTP response', () => {
    expect(wasi_runner.run_wasi("pong.wasm", "", [])).toEqual("Content-Type: text/plain\n\npong\n");
});

test('Running add-json.wasm with JSON body returns correct sum', () => {
    const stdin = JSON.stringify({
        numbers: [1, 1]
    });

    expect(wasi_runner.run_wasi("add-json.wasm", stdin, [])).toContain('{"result":2}');
});
