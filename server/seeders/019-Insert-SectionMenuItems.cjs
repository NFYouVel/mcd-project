const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // =========================
    // GET SECTIONS
    // =========================
    const sections = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Section_Menu"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const sectionMap = {};
    sections.forEach(s => {
      sectionMap[s.name] = s.id;
    });

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

    const getSection = (name) => {
      if (!sectionMap[name]) throw new Error(`Section not found: ${name}`);
      return sectionMap[name];
    };

    const getFilter = (name) => {
      if (!filterMap[name]) throw new Error(`Filter not found: ${name}`);
      return filterMap[name];
    };

    // =========================
    // INSERT JUNCTION (M:N)
    // =========================
    await queryInterface.bulkInsert("Section_Menu_Items", [

      // 🍔 Burger section
      {
        id: uuidv4(),
        sectionMenuId: getSection("Burger & McNuggets"),
        filterMenuId: getFilter("Sapi"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Burger & McNuggets"),
        filterMenuId: getFilter("Ayam"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Burger & McNuggets"),
        filterMenuId: getFilter("Ikan"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Burger & McNuggets"),
        filterMenuId: getFilter("McNuggets"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍗 Krispy Chicken section
      {
        id: uuidv4(),
        sectionMenuId: getSection("Ayam McD Krispy"),
        filterMenuId: getFilter("Ayam Krispy"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🌶️ Spicy Chicken section
      {
        id: uuidv4(),
        sectionMenuId: getSection("Ayam McD Spicy"),
        filterMenuId: getFilter("Ayam Spicy"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🧃 Drinks section (M:N drinks filters)
      {
        id: uuidv4(),
        sectionMenuId: getSection("Minuman"),
        filterMenuId: getFilter("Minuman Soda"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Minuman"),
        filterMenuId: getFilter("Teh"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Minuman"),
        filterMenuId: getFilter("Kopi"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Minuman"),
        filterMenuId: getFilter("McCafe"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍟 Snack section
      {
        id: uuidv4(),
        sectionMenuId: getSection("Camilan"),
        filterMenuId: getFilter("Camilan"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Camilan"),
        filterMenuId: getFilter("Pie"),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🍦 Dessert section
      {
        id: uuidv4(),
        sectionMenuId: getSection("Pencuci Mulut"),
        filterMenuId: getFilter("McFlurry"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Menu Receh"),
        filterMenuId: getFilter("McFlurry"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Paket HeBat"),
        filterMenuId: getFilter("Ayam"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Paket HeBat"),
        filterMenuId: getFilter("Sapi"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        sectionMenuId: getSection("Paket HeBat"),
        filterMenuId: getFilter("Ikan"),
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);

  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Section_Menu_Items", null, {});
  }
};