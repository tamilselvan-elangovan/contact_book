import { User, Contact } from "./schema";
import { sequelize } from "./sequilize";

const db_user = User
const db_contact = Contact

export const connect = () => {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.')
    }).catch(error => {
        console.log('Unable to connect to the database:', error)
    })
    sequelize.sync({ force: true }).then(response => {
        console.log('All models where synchronized')
    })
}
