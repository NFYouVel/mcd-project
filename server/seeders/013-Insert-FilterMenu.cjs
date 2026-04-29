const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sections = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Section_Menu"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const sectionMap = {};

    sections.forEach(section => {
      sectionMap[section.name] = section.id;
    });

    console.log(sectionMap);

    await queryInterface.bulkInsert("Filter_Menu", [
      {
        id: uuidv4(),
        name: "Discount",
        description: "Promo discounts",
        sectionMenuId: sectionMap["Promo Deals"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Burgers",
        description: "All burgers",
        sectionMenuId: sectionMap["Main Meals"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Rice",
        description: "Rice",
        sectionMenuId: sectionMap["Snacks & Drinks"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Chicken",
        description: "Chicken meals",
        sectionMenuId: sectionMap["Main Meals"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Drinks",
        description: "Beverages",
        sectionMenuId: sectionMap["Snacks & Drinks"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Packages",
        description: "Cheap Bundles",
        sectionMenuId: sectionMap["Main Meals"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Filter_Menu", null, {});
  }
};