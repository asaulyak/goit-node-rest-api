import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME } = process.env;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
    useNativeUUID: true
  },
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});
