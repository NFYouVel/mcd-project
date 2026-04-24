import { Sequelize } from 'sequelize-typescript';
import { Users } from '../models/Users.js';
import { Orders } from '../models/orders.js';
import { Payment } from '../models/payment.js';
import { Type } from '../models/type.js';
import { OrderItems } from '../models/OrderItems.js';
import { MenuSection } from '../models/menuSection.js';
import { Menu } from '../models/menu.js';
import { FilterMenu } from '../models/filterMenu.js';

import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    models: [Users, Orders, Payment, Type, MenuSection, FilterMenu, Menu, OrderItems]
});