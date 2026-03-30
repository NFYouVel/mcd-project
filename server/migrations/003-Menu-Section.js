module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Section_Menu', {
            id: {
                type : Sequelize.UUID,
                defaultValue : Sequelize.UUIDV4,
                primaryKey : true,
                alowNull : false
            },
            name: {
                type: Sequelize.STRING,
                alowNull: false
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

        await queryInterface.addColumn('Section_Menu', 'type', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references:{
                model: 'Type',
                key: 'food_type_id'
            },
            onUpdate : 'CASCADE',
            onDelete : 'CASCADE'
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('MenuSections');
    }
};