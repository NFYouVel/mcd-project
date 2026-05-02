const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // =========================
    // GET MENU
    // =========================
    const menus = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Menu"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const menuMap = {};
    menus.forEach(m => {
      menuMap[m.name] = m.id;
    });

    // =========================
    // GET VARIANT GROUPS
    // =========================
    const groups = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Variant_Groups"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const groupMap = {};
    groups.forEach(g => {
      groupMap[g.name] = g.id;
    });

    // 🔥 helper to prevent silent FK bugs
    const getMenuId = (name) => {
      if (!menuMap[name]) {
        throw new Error(`Menu not found: ${name}`);
      }
      return menuMap[name];
    };

    const getGroupId = (name) => {
      if (!groupMap[name]) {
        throw new Error(`VariantGroup not found: ${name}`);
      }
      return groupMap[name];
    };

    // =========================
    // INSERT RELATIONS
    // =========================
    await queryInterface.bulkInsert("Menu_Variant_Groups", [

      // 🍗 Ayam Krispy supports both groups
      {
        id: uuidv4(),
        menuId: getMenuId("Ayam Krispy"), // ✅ FIXED
        variantGroupId: getGroupId("Chicken Part"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        menuId: getMenuId("PaNas 1"), // ✅ FIXED
        variantGroupId: getGroupId("Chicken Part"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Menu_Variant_Groups", null, {});
  }
};