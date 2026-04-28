const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const filters = await queryInterface.sequelize.query(
            'SELECT id, name FROM "Filter_Menu"',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const filterMap = {};

        filters.forEach(filter => {
            filterMap[filter.name] = filter.id;
        });

        await queryInterface.bulkInsert("Menu", [
            {
                id: uuidv4(),
                name: "Big Mac",
                description: "Classic beef burger",
                price: 35000,
                isNew: true,
                isAvailable: true,
                imageUrl: "bigmac",
                filterMenuId: filterMap["Burgers"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Ayam Goreng",
                description: "Crispy fried chicken",
                price: 28000,
                isNew: false,
                isAvailable: true,
                imageUrl: "chicken",
                filterMenuId: filterMap["Chicken"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Coca Cola Float",
                description: "Cold drink",
                price: 12000,
                isNew: false,
                isAvailable: true,
                imageUrl: "cocafloat",
                filterMenuId: filterMap["Drinks"],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Menu", null, {});
    }
};