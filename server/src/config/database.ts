import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Import semua models
import { Type } from '../models/type.js';
import { MenuSection } from '../models/menuSection.js';
import { FilterMenu } from '../models/filterMenu.js';
import { Menu } from '../models/menu.js';
import { OrderItems } from '../models/OrderItems.js';
import { Orders } from '../models/orders.js';
import { IngredientItems } from '../models/ingredientItems.js';
import { Payment } from '../models/payment.js';
import { Ingredients } from '../models/ingredients.js';
import { Users } from '../models/Users.js';
// Tambahkan model lain kalo ada (User, Order, Payment, dll)
// import { User } from '../models/user.js';
// import { Order } from '../models/order.js';
// import { Payment } from '../models/payment.js';

dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    models: [
        Type,
        MenuSection,
        FilterMenu,   // 👈 harus AFTER MenuSection
        Menu,         // 👈 harus AFTER FilterMenu
        OrderItems,
        Orders,
        IngredientItems,
        Payment,
        Ingredients,
        Users
    ],
    logging: false,
});