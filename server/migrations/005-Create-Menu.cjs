module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Menu', {
            id : {
                type : Sequelize.UUID,
                defaultValue : Sequelize.UUIDV4,
                primaryKey : true,
                alowNull : false
            },
            name : {
                type : Sequelize.STRING,
                allowNull : false,
            },
            description : {
                type : Sequelize.STRING,
                allowNull : true,
            },
            price : {
                type : Sequelize.INTEGER,
                allowNull : false,
            },
            isNew : {
                type : Sequelize.BOOLEAN,
                defaultValue : true,
                allowNull : false,
            },
            isAvailable : {
                type : Sequelize.BOOLEAN,
                defaultValue : true,
                allowNull : false,
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
            },
            imageUrl: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });

        await queryInterface.addColumn('Menu', 'filterMenuId', {
            type: Sequelize.UUID,
            allowNull: false,
            references:{
                model : 'Filter_Menu',
                key : 'id'
            },
            onUpdate : 'CASCADE',
            onDelete : 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Menu');
    }
}