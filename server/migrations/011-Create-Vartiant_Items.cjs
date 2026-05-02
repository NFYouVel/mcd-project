module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Variant_Items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            priceModifier: {
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
        await queryInterface.addColumn('Variant_Items', 'variantGroupId', {
            type: Sequelize.UUID,
            allowNull: false,
            references:{
                model : 'Variant_Groups',
                key : 'id'
            },
            onUpdate : 'CASCADE',
            onDelete : 'CASCADE'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Variant_Items');
    }
}