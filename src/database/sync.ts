import { sequelize } from "./sequilize"

sequelize.sync({ force: true }).then(response => {
    console.log('All models where synchronized')
})