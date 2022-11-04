
const express = require('express')

const cors = require('cors')

const fileUpload = require('express-fileupload')

const querystring = require('node:querystring')

const fs = require('node:fs')

const wasi_runner = require('./wasi-runner')

const db = require('./db')

const app = express()
const port = 3001

app.use(express.json());

app.use(cors());

app.use(fileUpload());

const verifiedUser = async function(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];

    const user = await db.verify_token(token);
    req.user = user;

    next();
}

// app.use(wasiRunnerMiddleware);

app.get('/', (req, res) => {
    res.send("Hello, universe!");
})


app.post('/upload', verifiedUser, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.user) {
    return res.status(400).send('No files were uploaded.')
  }

  const wasmFile = req.files.wasmFile
  const uploadFolder = process.cwd() + '/wasm/' + req.user.username 
  const uploadPath = uploadFolder + "/" + wasmFile.name

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder)
  }

  console.log(wasmFile)
  console.log(uploadPath)

  // Use the mv() method to place the file somewhere on your server
  wasmFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
})

app.get('/hidden', verifiedUser, (req, res) => {
  if (!req.user) {
    res.status(403).json({
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

app.get('/actions', verifiedUser, async (req, res) => {
  if (!req.user) {
    res.status(403).json({
      "error": "user account not valid"
    })
  } else {
    const actions = await (await db.get_all_actions(req.user.username)).toArray();

    console.log(actions);

    res.json(actions);
  }
})

app.post('/actions', verifiedUser, async (req, res) => {
    await db.create_action(req.user.username, req.body.filename, req.body.params);

    const actions = await (await db.get_all_actions(req.user.username)).toArray();
    console.log(actions);

    res.json(actions);
})

app.put('/actions/:actionId', verifiedUser, async (req, res) => {
    const oldAction = await db.get_action(req.params.actionId);

    if (oldAction.owner === req.user.username) {
        await db.update_action(req.body);

        const actions = await (await db.get_all_actions(req.user.username)).toArray();
        console.log(actions);

        res.json(actions);
    } else {
        res.status(403).json({
            "error": "this resource is not owned by you"
        })
    }
})

app.delete('/actions/:actionId', verifiedUser, async (req, res) => {
    console.log(req.params.actionId);

    const oldAction = await db.get_action(req.params.actionId);

    console.log(oldAction);

    if (oldAction.owner === req.user.username) {
        await db.delete_action(req.params.actionId);

        const actions = await (await db.get_all_actions(req.user.username)).toArray();
        console.log(actions);

        res.json(actions);
    } else {
        res.status(403).json({
            "error": "this resource is not owned by you"
        })
    }
})

app.all('/wasm/*', async (req, res) => {
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
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
