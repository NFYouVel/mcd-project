const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("Ingredients", [
            {
                id: uuidv4(),
                name: "Cheese",
                price: 5000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Lettuce",
                price: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Chopped Onions",
                price: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Pickles",
                price: 3000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Beef Patty",
                price: 6000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Tomato Sauce",
                price: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Chili Sauce",
                price: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            }
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Ingredients", null, {});
    }
};