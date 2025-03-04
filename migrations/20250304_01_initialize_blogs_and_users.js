const { DataTypes } = require("sequelize");
const { update } = require("../models/user");
const { types } = require("pg");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("blogs", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isAcceptedYear(value) {
            const currentYear = new Date().getFullYear()
            if ( parseInt(value) < 1991) {
              throw new Error('Only year after 1991 is accepted');
            }
            if (parseInt(value) > currentYear) {
              throw new Error('Year must not bigger than current year');
            }
          }
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Validation isEmail on username failed",
          },
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    try {
      await queryInterface.addColumn("blogs", "user_id", {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      });
    } catch (error) {
      console.log('Foreign key constraint already exists');
    }
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("blogs");
    await queryInterface.dropTable("users");
  },
};
