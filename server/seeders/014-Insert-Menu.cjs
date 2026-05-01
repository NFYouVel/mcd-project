const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // =========================
    // GET FILTERS
    // =========================
    const filters = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Filter_Menu"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const filterMap = {};
    filters.forEach(f => {
      filterMap[f.name] = f.id;
    });

    const getFilterId = (name) => {
      if (!filterMap[name]) {
        throw new Error(`Filter not found: ${name}`);
      }
      return filterMap[name];
    };

    // =========================
    // IDS
    // =========================
    const bigMacId    = uuidv4();
    const ayamId      = uuidv4();
    const colaId      = uuidv4();
    const nasiId      = uuidv4();
    const mcflurryId  = uuidv4();
    const paketAId    = uuidv4();
    const paketBId    = uuidv4();

    // =========================
    // MENU INSERT
    // =========================
    await queryInterface.bulkInsert("Menu", [

      // 🍔 BURGER
      {
        id: bigMacId,
        name: "Big Mac",
        description: "Classic beef burger",
        price: 35000,
        isPackage: false,
        isNew: true,
        isAvailable: true,
        imageUrl: "/uploads/menu/bigmac.webp",
        filterMenuId: getFilterId("Sapi"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍗 CHICKEN
      {
        id: ayamId,
        name: "Ayam Krispy",
        description: "Crispy fried chicken",
        price: 28000,
        isPackage: false,
        isNew: false,
        isAvailable: true,
        imageUrl: "/uploads/menu/ayam_krispy.webp",
        filterMenuId: getFilterId("Ayam Krispy"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🧃 DRINK
      {
        id: colaId,
        name: "Coca Cola",
        description: "Cold soda drink",
        price: 12000,
        isPackage: false,
        isNew: false,
        isAvailable: true,
        imageUrl: "/uploads/menu/coca_cola.webp",
        filterMenuId: getFilterId("Minuman Soda"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍚 RICE (FIXED)
      {
        id: nasiId,
        name: "Nasi Putih",
        description: "White rice",
        price: 8000,
        isPackage: false,
        isNew: false,
        isAvailable: true,
        imageUrl: "/uploads/menu/nasi.webp",
        filterMenuId: getFilterId("Camilan"), // ⚠️ better: create "Nasi" filter later
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍦 DESSERT
      {
        id: mcflurryId,
        name: "McFlurry Oreo",
        description: "Vanilla ice cream with Oreo",
        price: 18000,
        isPackage: false,
        isNew: false,
        isAvailable: true,
        imageUrl: "/uploads/menu/mflurry",
        filterMenuId: getFilterId("McFlurry"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // =========================
      // 📦 PACKAGES
      // =========================
      {
        id: paketAId,
        name: "Paket Burger Komplit",
        description: "Big Mac + Coca Cola",
        price: 42000,
        isPackage: true,
        isNew: true,
        isAvailable: true,
        imageUrl: "/uploads/menu/paket_burger.webp",
        filterMenuId: getFilterId("Camilan"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: paketBId,
        name: "PaNas 1",
        description: "Ayam + Coca Cola + Nasi",
        price: 35000,
        isPackage: true,
        isNew: false,
        isAvailable: true,
        imageUrl: "/uploads/menu/paket_ayam.webp",
        filterMenuId: getFilterId("Camilan"),
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);

    // =========================
    // PACKAGE ITEMS
    // =========================
    await queryInterface.bulkInsert("Package_Items", [

      // 🍔 Paket Burger
      {
        id: uuidv4(),
        packageId: paketAId,
        packageItemId: bigMacId,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        packageId: paketAId,
        packageItemId: colaId,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍗 PaNas 1
      {
        id: uuidv4(),
        packageId: paketBId,
        packageItemId: ayamId,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        packageId: paketBId,
        packageItemId: colaId,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        packageId: paketBId,
        packageItemId: nasiId,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);

  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Package_Items", null, {});
    await queryInterface.bulkDelete("Menu", null, {});
  }
};