const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const saltRounds = 10;

        await queryInterface.bulkInsert("Users", [
            {
                id: uuidv4(),
                name: "Marvel Manager",
                email: "manager1@mail.com",
                password: await bcrypt.hash("123456", saltRounds),
                address: "Bandung",
                birth_of_date: new Date("1998-05-10"),
                salary: 8000000.00,
                role: "manager",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Tony Manager",
                email: "manager2@mail.com",
                password: await bcrypt.hash("123456", saltRounds),
                address: "Jakarta",
                birth_of_date: new Date("1995-08-15"),
                salary: 9000000.00,
                role: "manager",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Peter Staff",
                email: "staff1@mail.com",
                password: await bcrypt.hash("123456", saltRounds),
                address: "Surabaya",
                birth_of_date: new Date("2000-01-20"),
                salary: 5000000.00,
                role: "staff",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            {
                id: uuidv4(),
                name: "Steve Staff",
                email: "staff2@mail.com",
                password: await bcrypt.hash("123456", saltRounds),
                address: "Bekasi",
                birth_of_date: new Date("2001-11-25"),
                salary: 4500000.00,
                role: "staff",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Users", null, {});
    }
};
