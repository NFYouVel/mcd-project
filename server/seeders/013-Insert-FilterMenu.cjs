const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Filter_Menu", [
      {
        id: uuidv4(),
        name: "Sapi",
        description: "beef",
      },
      {
        id: uuidv4(),
        name: "Camilan",
        description: "Appetizers",
      },
      {
        id: uuidv4(),
        name: "Ayam",
        description: "Chicken",
      },
      {
        id: uuidv4(),
        name: "Ikan",
        description: "Fish",
      },
      {
        id: uuidv4(),
        name: "McNuggets",
        description: "McNuggets",
      },
      {
        id: uuidv4(),
        name: "Ayam Krispy",
        description: "Crispy Chicken",
      },
      {
        id: uuidv4(),
        name: "Ayam Spicy",
        description: "Spicy Chicken",
      },
      {
        id: uuidv4(),
        name: "Minuman Soda",
        description: "Sodas",
      },
      {
        id: uuidv4(),
        name: "Teh",
        description: "Tea",
      },
      {
        id: uuidv4(),
        name: "Kopi",
        description: "Coffee",
      },
      {
        id: uuidv4(),
        name: "McCafe",
        description: "McCafe Drinks",
      },
      {
        id: uuidv4(),
        name: "Pie",
        description: "McD Pies",
      },
      {
        id: uuidv4(),
        name: "McFlurry",
        description: "IceCreams",
      }
    ].map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    })));
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Filter_Menu", null, {});
  }
};