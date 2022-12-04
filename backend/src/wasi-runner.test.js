
const wasi_runner = require('./wasi-runner')

test('Running add.wasm with parameters [1, 1] adds to 2', () => {
    expect(wasi_runner.run_wasi("add.wasm",
                                {
                                    method: "GET",
                                    stdin: "",
                                    args: [1,1]
                                }).stdout).toEqual("2\n");
});

test('Running add.wasm with parameters [1, 1, 1] adds to 3', () => {
    expect(wasi_runner.run_wasi("add.wasm",
                                {
                                    method: "GET",
                                    stdin: "",
                                    args: [1,1,1]
                                }).stdout).toEqual("3\n");
});

test('Running pong.wasm returns HTTP response', () => {
    expect(wasi_runner.run_wasi("pong.wasm", {
        method: "GET",
        stdin: "",
        args: []
    }).stdout).toEqual("Content-Type: text/plain\n\npong\n");
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
                                }).stdout).toContain('{"result":2}');
});

test('Running add-json.wasm with invalid JSON body results in an error', () => {
    const stdin = JSON.stringify({
        numbers: ["hello", "world"]
    });

    expect(wasi_runner.run_wasi("add-json.wasm",
                                {
                                    method: "GET",
                                    stdin: stdin,
                                    args: []
                                }).stderr).toContain('Err');
});

test('Running hello-cgi.wasm returns HTTP response', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    stdin: "",
                                    args: []
                                }).stdout).toContain("Content-type: text/plain");
});

test('Running hello-cgi.wasm accepts BODY', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    stdin: "hello",
                                    args: []
                                }).stdout).toContain('BODY: "hello"');
});

test('Running hello-cgi.wasm receives METHOD', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    stdin: "hello",
                                    args: []
                                }).stdout).toContain('METHOD: Some("GET")');
});

test('Running hello-cgi.wasm receives PATH_INFO', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    path_info: "/hello/",
                                    stdin: "hello",
                                    args: []
                                }).stdout).toContain('PATH_INFO: Some("/hello/")');
});


test('Running hello-cgi.wasm receives QUERY_STRING', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    query_string: "?msg=hello",
                                    stdin: "hello",
                                    args: []
                                }).stdout).toContain('QUERY_STRING: Some("?msg=hello")');
});


test('Running hello-cgi.wasm parses QUERY_STRING', () => {
    expect(wasi_runner.run_wasi("hello-cgi.wasm",
                                {
                                    method: "GET",
                                    query_string: "?msg=hello",
                                    stdin: "hello",
                                    args: []
                                }).stdout).toContain('msg: hello');
});

test('Running file-test.wasm without filesystem permissions', () => {
  expect(wasi_runner.run_wasi("file-test.wasm",
                              {
                                method: "GET",
                                query_string: "",
                                stdin: "",
                                args: []
                              }
                             ).stdout).not.toContain("file-test.wasm")
})


test('Running file-test.wasm with filesystem permissions', () => {
  expect(wasi_runner.run_wasi("file-test.wasm",
                              {
                                method: "GET",
                                query_string: "",
                                stdin: "",
                                args: [],
                                fs_path: "./wasm"
                              }
                             ).stdout).toContain("file-test.wasm")
})

test('Running file-test.wasm with filesystem permissions, cannot pass ..', () => {
  expect(wasi_runner.run_wasi("file-test.wasm",
                              {
                                method: "GET",
                                query_string: "",
                                stdin: "",
                                args: [],
                                fs_path: "../"
                              }
                             ).stdout).toContain("error")
})
