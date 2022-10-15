
const express = require('express');

const cors = require('cors')

const fileUpload = require('express-fileupload');

const querystring = require('node:querystring')

const wasi_runner = require('./wasi-runner');

const db = require('./db')

const app = express();
const port = 3001;

app.use(express.json());

app.use(cors());

app.use(fileUpload());

const wasiRunnerMiddleware = function (req, res, next) {
    console.log(req.path);

    if (req.path.startsWith("/wasm/")) {
        const regex = /wasm\/(.*)\.wasm/g;

        const matches = req.path.match(regex);

        if (!matches) {
            res.socket.end(`HTTP/1.1 404 File Not Found\n$`);
            return;
        }

        const workload_name = matches[0].replace("wasm/", "");

        console.log(`Running: ${workload_name}`);

        const response = wasi_runner.run_wasi(workload_name, {
            method: req.method,
            stdin: JSON.stringify(req.body),
            path_info: req.path,
            query_string: querystring.stringify(req.query),
            args: []
        });

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


app.post('/upload', (req, res) => {
    let wasmFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    wasmFile = req.files.wasmFile;
    uploadPath = process.cwd() + '/wasm/' + wasmFile.name;

    console.log(wasmFile);

    console.log(uploadPath);

    // Use the mv() method to place the file somewhere on your server
    wasmFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
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
