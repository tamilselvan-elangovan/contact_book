import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('test', 'root', 'passw0rd', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
