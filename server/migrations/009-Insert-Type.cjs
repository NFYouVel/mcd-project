module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Type', [
            {
                foodTypeId: 1,
                description: 'promotion',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                foodTypeId: 2,
                description: 'heavy',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                foodTypeId: 3,
                description: 'light',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Type', null, {});
    }
};
