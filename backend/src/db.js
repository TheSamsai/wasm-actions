
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('./config');

const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(config.MONGODB);

const db = client.db("wasmActions");

const user_db_stub = {};

const clear_db = async () => {
    const users = db.collection("users");

    await users.deleteMany({});

    const actions = db.collection("actions");

    await actions.deleteMany({});
}

const disconnect_db = () => {
    client.close();
}

const register_user = async (username, password) => {
    const users = db.collection("users");
    
    const user = await users.insertOne({
        username: username,
        password: bcrypt.hashSync(password, 8)
    });

    return user;
}

const login_user = async (username, password) => {
    if (!username || !password) {
        return false;
    }

    const users = db.collection("users");

    const user = await users.findOne({ username: username });

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

const verify_token = (token) => {
    try {
        const decoded_token = jwt.verify(token, config.SECRET_KEY);

        return decoded_token;
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

const update_action = async (action) => {
    const actions = db.collection("actions");

    return await actions.replaceOne({ _id: action._id}, action);
}

const delete_action = async (id) => {
    const oid = ObjectId(id);

    const actions = db.collection("actions");

    const result = await actions.deleteOne({
        _id: oid
    });

    console.log(result);
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
    update_action,
    delete_action
}
