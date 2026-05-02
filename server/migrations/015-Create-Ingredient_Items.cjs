module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Ingredient_Items', {
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
            price: {
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
        await queryInterface.addColumn('Ingredient_Items', 'ingredientsId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Ingredients',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
        await queryInterface.addColumn('Ingredient_Items', 'orderItemsId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Order_Items',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Ingredient_Items');
    }
}