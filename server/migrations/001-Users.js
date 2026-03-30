module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                type : Sequelize.UUID,
                defaultValue : Sequelize.UUIDV4,
                primaryKey : true,
                alowNull : false
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            birth_of_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            salary: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            role: {
                type: Sequelize.ENUM('staff', 'manager'),
                allowNull: false,
                defaultValue: 'staff'
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
        await queryInterface.dropTable('Users');
    }
};