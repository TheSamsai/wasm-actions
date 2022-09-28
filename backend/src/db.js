
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('./config');

const { MongoClient } = require('mongodb');

const client = new MongoClient(config.MONGODB);

const db = client.db("wasmActions");

const user_db_stub = {};

const clear_db = async () => {
    const users = db.collection("users");

    await users.deleteMany({});
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

module.exports = {
    clear_db,
    disconnect_db,
    register_user,
    login_user,
    verify_token,
    count_users
}
