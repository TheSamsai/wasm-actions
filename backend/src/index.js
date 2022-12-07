
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
  const wasmFolder = process.cwd() + '/wasm/' + req.body.username 
  const runtimeFolder = process.cwd() + '/storage/' + req.body.username 

  if (!fs.existsSync(wasmFolder)) {
    fs.mkdirSync(wasmFolder, { recursive: true })
  }

  if (!fs.existsSync(runtimeFolder)) {
    fs.mkdirSync(runtimeFolder, { recursive: true })
  }

  await db.register_user(req.body.username, req.body.password);

  res.json({
    "message": `Registered user ${req.body.username}`
  });
})

app.post('/login', async (req, res) => {
  const token = await db.login_user(req.body.username, req.body.password);

  if (!token) {
    res.status(404).json({
      "error": "couldn't find the user"
    })
    return
  }

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
  const alreadyExists = await db.get_action_by_name(req.user.username, req.body.filename)

  if (!alreadyExists) {
    await db.create_action(req.user.username, req.body.filename, req.body.params)

    const actions = await (await db.get_all_actions(req.user.username)).toArray()
    console.log(actions)

    res.json(actions)
  } else {
    res.status(400).json({
      "error": "An Action with this name already exists"
    })
  }

})

app.put('/actions/:actionId', verifiedUser, async (req, res) => {
  const oldAction = await db.get_action(req.params.actionId);

  if (oldAction.owner === req.user.username) {
    console.log(req.body)
    await db.update_action(req.params.actionId, req.body);

    const actions = await (await db.get_all_actions(req.user.username)).toArray();
    console.log(actions);

    res.json(actions);
  } else {
    res.status(403).json({
      "error": "This resource is not owned by you"
    })
  }
})

app.delete('/actions/:actionId', verifiedUser, async (req, res) => {
  console.log(req.params.actionId);

  const oldAction = await db.get_action(req.params.actionId);

  if (!oldAction) {
    res.status(404).json({ error: "Action not found"})
    return
  }

  console.log(oldAction);

  if (oldAction.owner === req.user.username) {
    await db.delete_action(req.params.actionId);

    const wasmFolder = process.cwd() + '/wasm/' + req.user.username 
    const wasmFilePath = wasmFolder + "/" + oldAction.filename

    if (fs.existsSync(wasmFilePath)) {
      fs.rmSync(wasmFilePath)
    }

    const actions = await (await db.get_all_actions(req.user.username)).toArray();
    console.log(actions);

    res.json(actions);
  } else {
    res.status(403).json({
      "error": "this resource is not owned by you"
    })
  }
})

app.get('/logs/:actionId', verifiedUser, async (req, res) => {
  if (!req.user) {
    res.status(403).json({
      "error": "user account not valid"
    })
  } else {
    const action = await db.get_action(req.params.actionId)

    if (action.owner === req.user.username) {
      const logs = await db.get_logs(action._id)

      console.log(logs)

      return res.json(logs)
    } else {
      res.status(403).json({
        "error": "this resource is not owned by you"
      })
    }
  }
})

app.all('/wasm/*', async (req, res) => {
  const regex = /wasm\/(.*)\.wasm/g;

  const matches = req.path.match(regex);

  if (!matches) {
    res.socket.end(`HTTP/1.1 404 File Not Found\n$`);
    return;
  }

  const workload_name = decodeURI(matches[0].replace("wasm/", ""));

  const action_owner = workload_name.split("/")[0]
  const action_name = workload_name.split("/")[1]

  console.log(action_owner)

  console.log(action_name)

  const action_details = await db.get_action_by_name(action_owner, action_name)

  if (!action_details) {
    res.status(404).json({ error : "WASM workload not found"})
    return
  }

  const runtimeFolder = process.cwd() + '/storage/' + action_owner

  const params = {
    method: req.method,
    stdin: JSON.stringify(req.body),
    path_info: req.path,
    query_string: querystring.stringify(req.query),
    args: [],
    fs_path: `${runtimeFolder}/${action_details.params.fs_path}`
  }

  if (action_details.params.protectionToken) {
    const token = req.headers.authorization.split(" ")[1];

    if (token === action_details.params.protectionToken) {
      console.log(`Running protected workload: ${workload_name}`)
      console.log(action_details)

      const response = wasi_runner.run_wasi(workload_name, params);

      res.socket.end(`HTTP/1.1 200 OK\n${response}`)
    } else {
      res.status(401).json({ error: "Unauthorized" })
    }

    return
  }

  console.log(`Running: ${workload_name}`)
  console.log(action_details)

  const response = wasi_runner.run_wasi(workload_name, params);

  console.log(response)

  // TODO: This needs to be done for protected endpoints too
  await db.add_log(action_details._id, { stdout: response.stdout, stderr: response.stderr })

  res.socket.end(`HTTP/1.1 200 OK\n${response.stdout}`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
