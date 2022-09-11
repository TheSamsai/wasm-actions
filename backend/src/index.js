
const express = require('express')

const wasi_runner = require('./wasi-runner')

const app = express()
const port = 3001

const wasiRunnerMiddleware = function (req, res, next) {
    console.log(req.path)

    if (req.path.startsWith("/wasm/")) {
        const response = wasi_runner.run_wasi("hello-cgi.wasm", [])

        res.socket.end(`HTTP/1.1 200 OK\n${response}`)

        return;
    }

    next()
}

app.use(wasiRunnerMiddleware)

app.get('/', (req, res) => {
    res.send("Hello, universe!")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
