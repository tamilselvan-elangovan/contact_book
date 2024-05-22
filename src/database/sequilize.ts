import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('authenticate', 'root', 'Admin@1234', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
