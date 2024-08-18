import { DataTypes, fn, Model } from 'sequelize';
import { sequelize } from '../../db/index.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    subscription: {
      type: DataTypes.ENUM,
      values: ['starter', 'pro', 'business'],
      defaultValue: 'starter'
    },
    token: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    avatarURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  },
  { sequelize, modelName: 'users' }
);
