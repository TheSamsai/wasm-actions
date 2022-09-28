
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const MONGODB = process.env.MONGODB;

module.exports = {
    SECRET_KEY,
    MONGODB
};
