module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('menu', {
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
        });

        await queryInterface.addColumn('menu', 'filter_menu_id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
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
        await queryInterface.dropTable('menu');
    }
}