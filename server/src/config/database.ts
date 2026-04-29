import { Sequelize } from 'sequelize-typescript';
import { Users } from '../models/Users.js';
import { Orders } from '../models/Orders.js';
import { Payment } from '../models/Payment.js';
import { Type } from '../models/Type.js';
import { OrderItems } from '../models/OrderItems.js';
import { MenuSection } from '../models/MenuSection.js';
import { Menu } from '../models/Menu.js';
import { FilterMenu } from '../models/FilterMenu.js';
import { IngredientItems } from '../models/IngredientItems.js';
import { Ingredients } from '../models/Ingredients.js';
import { VariantGroups } from '../models/VariantGroups.js';
import { VariantItems } from '../models/VariantItems.js';
import { MenuVariantGroups } from '../models/MenuVariantGroups.js';
import { PackageItems } from '../models/PackageItems.js';

import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    models: [
  Users,
  Type,
  Menu,
  Orders,
  OrderItems,
  Payment,
  FilterMenu,
  MenuSection,
  Ingredients,
  IngredientItems,
  VariantGroups,
  VariantItems,
  MenuVariantGroups,
  PackageItems
]
});