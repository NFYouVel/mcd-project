// const { v4: uuidv4 } = require("uuid");

// module.exports = {
//     up: async (queryInterface, Sequelize) => {
//         const filters = await queryInterface.sequelize.query(
//             'SELECT id, name FROM "Filter_Menu"',
//             { type: Sequelize.QueryTypes.SELECT }
//         );

//         const filterMap = {};

//         filters.forEach(filter => {
//             filterMap[filter.name] = filter.id;
//         });

//         await queryInterface.bulkInsert("Menu", [
//             {
//                 id: uuidv4(),
//                 name: "Big Mac",
//                 description: "Classic beef burger",
//                 price: 35000,
//                 isNew: true,
//                 isAvailable: true,
//                 imageUrl: "bigmac",
//                 filterMenuId: filterMap["Burgers"],
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             },
//             {
//                 id: uuidv4(),
//                 name: "Ayam Goreng",
//                 description: "Crispy fried chicken",
//                 price: 28000,
//                 isNew: false,
//                 isAvailable: true,
//                 imageUrl: "chicken",
//                 filterMenuId: filterMap["Chicken"],
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             },
//             {
//                 id: uuidv4(),
//                 name: "Coca Cola Float",
//                 description: "Cold drink",
//                 price: 12000,
//                 isNew: false,
//                 isAvailable: true,
//                 imageUrl: "cocafloat",
//                 filterMenuId: filterMap["Drinks"],
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             }
//         ]);
//     },

//     down: async (queryInterface) => {
//         await queryInterface.bulkDelete("Menu", null, {});
//     }
// };

// seeders/XXXXXX-seed-menu.js
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

        // Store IDs so we can reference them in Package_Items later
        const bigMacId    = uuidv4();
        const ayamId      = uuidv4();
        const colaId      = uuidv4();
        const paketAId    = uuidv4();
        const paketBId    = uuidv4();
        const nasiPutihId = uuidv4();

        await queryInterface.bulkInsert("Menu", [
            {
                id: bigMacId,
                name: "Big Mac",
                description: "Classic beef burger",
                price: 35000,
                isPackage: false,
                isNew: true,
                isAvailable: true,
                imageUrl: "bigmac",
                filterMenuId: filterMap["Burgers"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: ayamId,
                name: "Ayam Goreng",
                description: "Crispy fried chicken",
                price: 28000,
                isPackage: false,
                isNew: false,
                isAvailable: true,
                imageUrl: "chicken",
                filterMenuId: filterMap["Chicken"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: colaId,
                name: "Coca Cola Float",
                description: "Cold drink",
                price: 12000,
                isPackage: false,
                isNew: false,
                isAvailable: true,
                imageUrl: "cocafloat",
                filterMenuId: filterMap["Drinks"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: nasiPutihId,
                name: "White Rice",
                description: "Nasi Putih",
                price: 8000,
                isPackage: false,
                isNew: false,
                isAvailable: true,
                imageUrl: "whiterice",
                filterMenuId: filterMap["Rice"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // --- Packages ---
            {
                id: paketAId,
                name: "Paket Burger Komplit",
                description: "Big Mac + Coca Cola Float",
                price: 42000,           // cheaper than buying separately (35k + 12k = 47k)
                isPackage: true,
                isNew: true,
                isAvailable: true,
                imageUrl: "paket_burger",
                filterMenuId: filterMap["Packages"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: paketBId,
                name: "PaNas 1",
                description: "Ayam Goreng + Coca Cola + Nasi",
                price: 35000,           // cheaper than buying separately (28k + 12k = 40k)
                isPackage: true,
                isNew: false,
                isAvailable: true,
                imageUrl: "paket_ayam",
                filterMenuId: filterMap["Packages"],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        // Link packages to their component items
        await queryInterface.bulkInsert("Package_Items", [
            // Paket Burger Komplit
            { id: uuidv4(), packageId: paketAId, packageItemId: bigMacId, quantity: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: uuidv4(), packageId: paketAId, packageItemId: colaId,   quantity: 1, createdAt: new Date(), updatedAt: new Date() },

            // Paket Ayam Hemat
            { id: uuidv4(), packageId: paketBId, packageItemId: ayamId,   quantity: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: uuidv4(), packageId: paketBId, packageItemId: colaId,   quantity: 1, createdAt: new Date(), updatedAt: new Date() }
        ]);
    },

    down: async (queryInterface) => {
        // Delete in reverse dependency order
        await queryInterface.bulkDelete("Package_Items", null, {});
        await queryInterface.bulkDelete("Menu", null, {});
    }
};