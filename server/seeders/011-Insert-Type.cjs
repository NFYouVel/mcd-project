const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Type', [
            {
                id: uuidv4(),
                foodTypeId: 1,
                description: 'promotion',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                foodTypeId: 2,
                description: 'heavy',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                foodTypeId: 3,
                description: 'light',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                foodTypeId: 4,
                description: 'drinks',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                foodTypeId: 5,
                description: 'dessert',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                foodTypeId: 6,
                description: 'rice',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Type', null, {});
    }
};