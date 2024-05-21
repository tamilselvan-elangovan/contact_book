import { DataTypes } from "sequelize";
import { sequelize } from "./sequilize";

export const user = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spam: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: true
  },
);

export const contact_book = sequelize.define(
  'Contact_book',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spam: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    registered: {
      type: DataTypes.TINYINT,
      defaultValue: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: true
  }
)
