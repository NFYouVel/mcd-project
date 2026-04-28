module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Order_Items', {
            id : {
                type : Sequelize.UUID,
                defaultValue : Sequelize.UUIDV4,
                primaryKey : true,
                allowNull : false
            },
            status : {
                type : Sequelize.ENUM('pending', 'preparing', 'served', 'cancelled'),
                allowNull : false,
                defaultValue : 'pending'
            },
            quantity : {
                type : Sequelize.INTEGER,
                allowNull : false,
                defaultValue : 1
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

        await queryInterface.addColumn('Order_Items', 'menuId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Menu',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
        await queryInterface.addColumn('Order_Items', 'orderId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Order_Items');
    }

}