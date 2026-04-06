import dotenv from 'dotenv';
dotenv.config();

export default {
    development: {
        username: process.env.USER,
        password: process.env.PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    },
};