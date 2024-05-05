import { Sequelize } from 'sequelize';
import initModels from './models/init-models.js';

export const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });
export const db = initModels(sequelize);