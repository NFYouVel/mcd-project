import { Sequelize } from 'sequelize-typescript';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    models: [path.join(__dirname, "../src/models")],
});