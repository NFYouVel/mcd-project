module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('payment', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            status : {
                type : Sequelize.ENUM('paid', 'unpaid'),
                allowNull : false,
                defaultValue : 'unpaid'
            },
            payment_method : {
                type : Sequelize.ENUM('e-wallet','cash', 'card'),
                allowNull : false,
                defaultValue : 'cash'
            },
            total_price : {
                type : Sequelize.DECIMAL(10, 2),
                allowNull : false       
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('payment');
    }
}