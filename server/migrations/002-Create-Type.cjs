module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Type', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            foodTypeId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            description: {
                type: Sequelize.ENUM('heavy', 'light', 'promotion', 'drinks', 'dessert', 'rice'),
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
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('Type');
    }
};
