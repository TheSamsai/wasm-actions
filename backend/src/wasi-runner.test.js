
const wasi_runner = require('./wasi-runner')

test('Running add.wasm with parameters [1, 1] adds to 2', () => {
    expect(wasi_runner.run_wasi("add.wasm",
                                {
                                    method: "GET",
                                    stdin: "",
                                    args: [1,1]
                                })).toEqual("2\n");
});

test('Running add.wasm with parameters [1, 1, 1] adds to 3', () => {
    expect(wasi_runner.run_wasi("add.wasm",
                                {
                                    method: "GET",
                                    stdin: "",
                                    args: [1,1,1]
                                })).toEqual("3\n");
});

test('Running pong.wasm returns HTTP response', () => {
    expect(wasi_runner.run_wasi("pong.wasm", {
        method: "GET",
        stdin: "",
        args: []
    })).toEqual("Content-Type: text/plain\n\npong\n");
});

test('Running add-json.wasm with JSON body returns correct sum', () => {
    const stdin = JSON.stringify({
        numbers: [1, 1]
    });

    expect(wasi_runner.run_wasi("add-json.wasm",
                                {
                                    method: "GET",
                                    stdin: stdin,
                                    args: []
                                })).toContain('{"result":2}');
});


test('Running hello-cgi.wasm returns HTTP response', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    stdin: "",
                                    args: []
                                })).toContain("Content-type: text/plain");
});

test('Running hello-cgi.wasm accepts BODY', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    stdin: "hello",
                                    args: []
                                })).toContain('BODY: "hello"');
});

test('Running hello-cgi.wasm receives METHOD', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    stdin: "hello",
                                    args: []
                                })).toContain('METHOD: Some("GET")');
});

test('Running hello-cgi.wasm receives PATH_INFO', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    path_info: "/hello/",
                                    stdin: "hello",
                                    args: []
                                })).toContain('PATH_INFO: Some("/hello/")');
});


test('Running hello-cgi.wasm receives QUERY_STRING', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    query_string: "?msg=hello",
                                    stdin: "hello",
                                    args: []
                                })).toContain('QUERY_STRING: Some("?msg=hello")');
});


test('Running hello-cgi.wasm parses QUERY_STRING', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    query_string: "?msg=hello",
                                    stdin: "hello",
                                    args: []
                                })).toContain('msg: hello');
});
