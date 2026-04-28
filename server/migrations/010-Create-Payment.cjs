module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Payment', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('paid', 'unpaid'),
                allowNull: false,
                defaultValue: 'unpaid'
            },
            payment_method: {
                type: Sequelize.ENUM('e-wallet', 'cash', 'card'),
                allowNull: false,
                defaultValue: 'cash'
            },
            total_price: {
                type: Sequelize.DECIMAL(10, 2),
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
        await queryInterface.addColumn('Payment', 'orderId', {
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
        await queryInterface.dropTable('Payment');
    }
}