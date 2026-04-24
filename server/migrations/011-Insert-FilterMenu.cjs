const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {

        const sections = await queryInterface.sequelize.query(
            'SELECT id, name FROM "Section_Menu";',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const promo = sections.find(s => s.name === "Promo Deals");
        const main = sections.find(s => s.name === "Main Meals");
        const snacks = sections.find(s => s.name === "Snacks & Drinks");

        await queryInterface.bulkInsert("Filter_Menu", [
            {
                id: uuidv4(),
                name: "Discount",
                description: "Promo discounts",
                sectionMenuId: promo.id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Burgers",
                description: "All burgers",
                sectionMenuId: main.id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Chicken",
                description: "Chicken meals",
                sectionMenuId: main.id,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Drinks",
                description: "Beverages",
                sectionMenuId: snacks.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Filter_Menu", null, {});
    }
};