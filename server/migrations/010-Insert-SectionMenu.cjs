const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // get Type IDs dynamically (recommended)
        const types = await queryInterface.sequelize.query(
            'SELECT id, description FROM "Type";',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const promotion = types.find(t => t.description === "promotion");
        const heavy = types.find(t => t.description === "heavy");
        const light = types.find(t => t.description === "light");

        await queryInterface.bulkInsert("Section_Menu", [
            {
                id: uuidv4(),
                name: "Promo Deals",
                description: "Special promotions",
                Type: promotion.id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Main Meals",
                description: "Heavy meals",
                Type: heavy.id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Snacks & Drinks",
                description: "Light menu",
                Type: light.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Section_Menu", null, {});
    }
};