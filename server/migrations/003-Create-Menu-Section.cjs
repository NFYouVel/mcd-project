module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Section_Menu', {
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
            description: {
                type: Sequelize.STRING,
                allowNull: true
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

        await queryInterface.addColumn('Section_Menu', 'Type', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Type',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('Section_Menu');
    }
};
