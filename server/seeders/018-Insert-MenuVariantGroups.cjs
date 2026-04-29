const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get Menu + Variant Groups first
    const menus = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Menu"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const groups = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Variant_Groups"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const menuMap = {};
    menus.forEach(m => {
      menuMap[m.name] = m.id;
    });

    const groupMap = {};
    groups.forEach(g => {
      groupMap[g.name] = g.id;
    });

    await queryInterface.bulkInsert("Menu_Variant_Groups", [
      // Ayam Goreng supports both groups
      {
        id: uuidv4(),
        menuId: menuMap["Ayam Goreng"],
        variantGroupId: groupMap["Chicken Part"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        menuId: menuMap["Ayam Goreng"],
        variantGroupId: groupMap["Chicken Type"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Menu_Variant_Groups", null, {});
  }
};