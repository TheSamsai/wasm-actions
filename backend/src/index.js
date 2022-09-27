
const express = require('express');

const wasi_runner = require('./wasi-runner');

const db = require('./db')

const app = express();
const port = 3001;

app.use(express.json());

const wasiRunnerMiddleware = function (req, res, next) {
    console.log(req.path);

    if (req.path.startsWith("/wasm/")) {
        const response = wasi_runner.run_wasi("hello-cgi.wasm", []);

        res.socket.end(`HTTP/1.1 200 OK\n${response}`);

        return;
    }

    next();
}

const verifiedUser = function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1];

    const user = db.verify_token(token);

    req.user = user;

    next();
}

app.use(wasiRunnerMiddleware);

app.get('/', (req, res) => {
    res.send("Hello, universe!");
})


app.get('/hidden', verifiedUser, (req, res) => {
    if (!req.user) {
        res.json({
            "error": "invalid token"
        });
    }


    res.json({
        "message": "42"
    });
})

app.post('/register', async (req, res) => {
    await db.register_user(req.body.username, req.body.password);

    res.json({
        "message": `Registered user ${req.body.username}`
    });
})

app.post('/login', async (req, res) => {
    const token = await db.login_user(req.body.username, req.body.password);

    res.json({
        "token": token
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
