import type { Dialect } from "sequelize";

const pe = process.env;

export const appConfig = {
  database: {
    host: pe.DB_HOST || 'localhost',
    port: pe.DB_PORT || '5432',
    username: pe.DB_USERNAME || 'postgres',
    password: pe.DB_PASSWORD || 'Elly9394',
    database: pe.DB_NAME || 'database_mcd',
    dialect: (pe.DB_DIALECT || 'postgres') as Dialect
  },
};