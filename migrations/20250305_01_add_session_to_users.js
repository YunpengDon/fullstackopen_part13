const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
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
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
    await queryInterface.dropTable("users");
  },
};
