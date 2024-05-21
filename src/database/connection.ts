import { user, contact_book } from "./schema";
import { sequelize } from "./sequilize";

const db_user = user
const db_contact_book = contact_book

export const connect = () => {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.')
    }).catch(error => {
        console.log('Unable to connect to the database:', error)
    })
    // sequelize.sync({ force: true }).then(response => {
    //     console.log('All models where synchronized')
    // })
}
