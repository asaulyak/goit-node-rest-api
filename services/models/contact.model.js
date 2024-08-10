import {DataTypes, fn, Model} from 'sequelize'
import { sequelize } from '../../db/index.js';

export class Contact extends Model {}

Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [3, 40]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(36),
      allowNull: false,
      validate: {
        len: [4, 15]
      }
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    owner: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  },
  { sequelize, indexes: [{ fields: ['name'] }], modelName: 'contacts' }
);
