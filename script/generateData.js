// populate.js
const bcrypt = require('bcrypt');
const faker = require('faker');
const sequelize = require('../dist/src/database/sequilize.js')
const { User, Contact } = require('../dist/src/database/schema.js');

async function createRandomUser() {
    const name = faker.name.findName();
    const phone = faker.phone.phoneNumberFormat();
    const email = faker.internet.email();
    const spam = faker.datatype.number({ min: 0, max: 1 });
    const password = await bcrypt.hash('password', 10);

    const user = await User.create({
        name,
        phone,
        email,
        spam,
        password
    });

    const contacts = [];
    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
        contacts.push({
            name: faker.name.findName(),
            phone: faker.phone.phoneNumberFormat(),
            reference: i % 7 == 0 ? null : user.id,
            spam: faker.datatype.number({ min: 0, max: 1 }),
        });
    }

    for (let i = 0; i < contacts.length; i++) {
        await Contact.create(contacts[i]);
    }

    return user;
}

async function populateDatabase() {
    let registered_users = [];
    let contacts = [];

    for (let i = 0; i < 100; i++) {
        let user = await createRandomUser();

        if(i % 5 == 0) {
            registered_users.push(user)
        }
    }

    for (let i = 0; i < registered_users.length; i++) {
        let user = registered_users[i];
        contacts.push({
            registered: true,
            phone: user.phone,
            name: faker.name.findName(),
            reference: i % 3 == 0 ? null : user.id,
            spam: faker.datatype.number({ min: 0, max: 1 }),
        });
    }

    for (let i = 0; i < contacts.length; i++) {
        await Contact.create(contacts[i]);
    }
}

populateDatabase().then(() => console.log('Database populated with sample data'));
