module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Menu', 'isPackage', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Menu');
    }
}