module.exports = {
  up: async (queryInterface, Sequelize) => {

    // create base table first
    await queryInterface.createTable("Section_Menu_Items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // =========================================
    // FK → Filter_Menu
    // =========================================
    await queryInterface.addColumn("Section_Menu_Items", "filterMenuId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Filter_Menu",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // =========================================
    // FK → Section_Menu
    // =========================================
    await queryInterface.addColumn("Section_Menu_Items", "sectionMenuId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Section_Menu",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // =========================================
    // UNIQUE constraint (VERY IMPORTANT)
    // =========================================
    await queryInterface.addConstraint("Section_Menu_Items", {
      fields: ["filterMenuId", "sectionMenuId"],
      type: "unique",
      name: "unique_filter_section_pair",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Section_Menu_Items");
  },
};