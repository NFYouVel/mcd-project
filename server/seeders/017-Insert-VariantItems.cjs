const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get Variant Groups first
    const groups = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Variant_Groups"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const groupMap = {};
    groups.forEach(g => {
      groupMap[g.name] = g.id;
    });

    await queryInterface.bulkInsert('Variant_Items', [
      // Chicken Part (vg-1)
      {
        id: uuidv4(),
        name: 'Thigh',
        priceModifier: 0,
        variantGroupId: groupMap['Chicken Part'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Chest',
        priceModifier: 2000,
        variantGroupId: groupMap['Chicken Part'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Wing',
        priceModifier: 0,
        variantGroupId: groupMap['Chicken Part'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'drumstick',
        priceModifier: 0,
        variantGroupId: groupMap['Chicken Part'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Variant_Items', {
      name: ['Thigh', 'Chest', 'Wing', 'drumstick', 'Krispy', 'Hot']
    });
  }
};