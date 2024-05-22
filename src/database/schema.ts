import { DataTypes } from "sequelize";
import { sequelize } from "./sequilize";

function generateRandomKey() {
  return [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
}

export const user = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    timestamps: true,
    hooks: {
        beforeValidate: (user: any) => {
            user.id = generateRandomKey()
        }
    }
  },
);

export const contact_book = sequelize.define(
  'Contact_book',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
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
    timestamps: true,
    hooks: {
      beforeValidate: (user: any) => {
          user.id = generateRandomKey()
      }
  }
  }
)
