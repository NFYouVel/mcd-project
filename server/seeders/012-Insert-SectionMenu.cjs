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
                name: "Promosi",
                description: "Special promotions",
                Type: typeMap["promotion"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Burger & McNuggets",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Ayam McD Krispy",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Ayam McD Spicy",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Paket Keluarga",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Happy Meal",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Paket HeBat",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Menu Receh",
                description: "Cheaper meals",
                Type: typeMap["light"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "McSpaghetti",
                description: "Heavy meals",
                Type: typeMap["heavy"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Camilan",
                description: "Light meals",
                Type: typeMap["light"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Minuman",
                description: "drinks",
                Type: typeMap["drinks"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Pencuci Mulut",
                description: "Palette Cleansers",
                Type: typeMap["dessert"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: "Nasi",
                description: "rice",
                Type: typeMap["rice"],
                createdAt: new Date(),
                updatedAt: new Date()
            }

        ]);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Section_Menu", null, {});
    }
};