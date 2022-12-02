
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('./config');

const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(config.MONGODB);

const db = client.db("wasmActions");

const user_db_stub = {};

const clear_db = async () => {
  const users = db.collection("users")

  await users.deleteMany({})

  const actions = db.collection("actions")

  await actions.deleteMany({})

  const logs = db.collection("actions-logs")

  await logs.deleteMany({})
}

const disconnect_db = () => {
  client.close();
}

const register_user = async (username, password) => {
  const users = db.collection("users")
  
  if (await users.findOne({ username: username })) {
    return false
  }

  const user = await users.insertOne({
    username: username,
    password: bcrypt.hashSync(password, 8)
  })

  return user
}

const login_user = async (username, password) => {
  if (!username || !password) {
    return false;
  }

  const users = db.collection("users");

  const user = await users.findOne({ username: username });

  if (!user) {
    return false
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return false;
  }

  const token = jwt.sign({
    username: username
  }, config.SECRET_KEY, {
  });

  return token;
}

const verify_token = async (token) => {
  try {
    const decoded_token = jwt.verify(token, config.SECRET_KEY)

    const users = db.collection("users")

    const user = await users.findOne({ username: decoded_token.username })

    if (user) {
      return decoded_token
    } else {
      return null
    }
  } catch (error) {
    return null;
  }
}

const count_users = async () => {
  const users = db.collection("users");

  return users.estimatedDocumentCount();
}

const create_action = async (username, filename, params) => {
  const actions = db.collection("actions");

  const action = await actions.insertOne({
    owner: username,
    filename: filename,
    params
  });

  return action;
}

const get_all_actions = async (username) => {
  const actions = db.collection("actions");

  return actions.find({ owner: username });
}

const get_action = async (id) => {
  const oid = ObjectId(id);

  const actions = db.collection("actions");

  return await actions.findOne({ _id: oid });
}

const get_action_by_name = async (username, filename) => {
  const actions = db.collection("actions");

  return await actions.findOne({ owner: username, filename: filename });
}

const update_action = async (id, action) => {
  const oid = ObjectId(id);

  const actions = db.collection("actions");

  return await actions.replaceOne({ _id: oid}, action);
}

const delete_action = async (id) => {
  const oid = ObjectId(id);

  const actions = db.collection("actions");

  const result = await actions.deleteOne({
    _id: oid
  });
}

const add_log = async (id, message) => {
  const oid = ObjectId(id)

  const logs = db.collection("actions-logs")

  const session = client.startSession()

  await session.withTransaction(async () => {
    const action_logs = await logs.find({ action: oid }).sort({ created_at: -1}).toArray()

    while (action_logs.length > 9) {
      const log = action_logs.pop()

      await logs.deleteOne({ _id: log._id })
    }

    await logs.insertOne({
      action: oid,
      message
    })
  })
}

const get_logs = async (id) => {
  const oid = ObjectId(id)

  const logs = db.collection("actions-logs")

  return await logs.find({ action: oid }).sort({ created_at: 1}).toArray()
}

module.exports = {
  clear_db,
  disconnect_db,
  register_user,
  login_user,
  verify_token,
  count_users,

  create_action,
  get_all_actions,
  get_action,
  get_action_by_name,
  update_action,
  delete_action,

  add_log,
  get_logs,
}
