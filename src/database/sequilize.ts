import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

const databaseName = process.env.DB_NAME || 'production';
const userName = process.env.DB_USERNAME || 'root';
export const sequelize = new Sequelize(databaseName, userName, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
