import { Sequelize } from 'sequelize-typescript';
import { fileURLToPath } from 'url';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    models: [path.join(__dirname, "../src/models")],
});