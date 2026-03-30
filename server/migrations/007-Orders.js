module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
            id : {
                type : Sequelize.UUID,
                defaultValue : Sequelize.UUIDV4,
                primaryKey : true,
                allowNull : false
            },
            status : {
                type : Sequelize.ENUM('pending', 'checkedout', 'served', 'cancelled'),
                allowNull : false,
                defaultValue : 'pending'
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
        await queryInterface.dropTable('Orders');
    }
}