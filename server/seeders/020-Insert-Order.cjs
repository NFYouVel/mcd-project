'use strict';

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {

    // =========================
    // GET MENU IDS
    // =========================
    const menus = await queryInterface.sequelize.query(
      'SELECT id, name, price FROM "Menu"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getMenu = (name) => {
      const m = menus.find(x => x.name === name);
      if (!m) throw new Error(`Menu not found: ${name}`);
      return m;
    };

    const bigMac = getMenu("Big Mac");
    const ayam   = getMenu("Ayam Krispy");
    const cola   = getMenu("Coca Cola");

    // =========================
    // ORDER IDS
    // =========================
    const order1 = uuidv4();
    const order2 = uuidv4();
    const order3 = uuidv4();

    // =========================
    // INSERT ORDERS
    // =========================
    await queryInterface.bulkInsert("Orders", [
      {
        id: order1,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: order2,
        status: "checkedout",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: order3,
        status: "served",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // =========================
    // INSERT ORDER ITEMS
    // =========================
    await queryInterface.bulkInsert("Order_Items", [

      // 🧾 ORDER 1
      {
        id: uuidv4(),
        orderId: order1,
        menuId: bigMac.id,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        orderId: order1,
        menuId: cola.id,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🧾 ORDER 2
      {
        id: uuidv4(),
        orderId: order2,
        menuId: ayam.id,
        status: "preparing",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 🧾 ORDER 3
      {
        id: uuidv4(),
        orderId: order3,
        menuId: bigMac.id,
        status: "served",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        orderId: order3,
        menuId: cola.id,
        status: "served",
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);

  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Order_Items", null, {});
    await queryInterface.bulkDelete("Orders", null, {});
  }
};
