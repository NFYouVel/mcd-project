module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Menu_Variant_Groups', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
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

        await queryInterface.addColumn('Menu_Variant_Groups', 'menuId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Menu',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        await queryInterface.addColumn('Menu_Variant_Groups', 'variantGroupId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Variant_Groups',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Menu_Variant_Groups');
    }
}