module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Package_Items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addColumn('Package_Items', 'packageId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Menu',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        await queryInterface.addColumn('Package_Items', 'packageItemId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Menu',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Package_Items');
    }
};