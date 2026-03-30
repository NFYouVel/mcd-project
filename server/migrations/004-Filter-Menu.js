module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Filter_Menu', {
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

        await queryInterface.addColumn('Filter_Menu', 'section_menu_id', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            references:{
                model : 'Section_Menu',
                key : 'id'
            },
            onUpdate : 'CASCADE',
            onDelete : 'CASCADE'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Filter_Menu');
    }
}