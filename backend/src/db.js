
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('./config')

const user_db_stub = {}

const register_user = (username, password) => {
    user_db_stub[username] = bcrypt.hashSync(password, 8);
}

const login_user = (username, password) => {
    const validPassword = bcrypt.compareSync(password, user_db_stub[username]);

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

const count_users = () => {
    return Object.keys(user_db_stub).length;
}

module.exports = {
    register_user,
    login_user,
    verify_token,
    count_users
}
