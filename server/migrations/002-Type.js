const { down } = require("./001-Users.js");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Type', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                alowNull: false
            },
            food_type_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            description: {
                type: Sequelize.ENUM('heavy', 'light', 'promotion'),
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
        down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Type');
        }
    }
};