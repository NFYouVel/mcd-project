const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const types = await queryInterface.sequelize.query(
            'SELECT id, description FROM "Type"',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const typeMap = {};

        types.forEach(type => {
            typeMap[type.description] = type.id;
        });

        console.log(typeMap);

        await queryInterface.bulkInsert("Section_Menu", [
            {
                id: uuidv4(),
                name: "Promo Deals",
                description: "Special promotions",
                Type: typeMap["promotion"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Main Meals",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Snacks & Drinks",
                description: "Light menu",
                Type: typeMap["light"],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Section_Menu", null, {});
    }
};