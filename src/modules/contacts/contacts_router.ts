import express from 'express'
import controller from '../../modules/contacts/contacts_controller'

const app = express()

app.route('/users').get(controller.getUsers)
app.route('/spam/:phone').post(controller.markAsSpam)
app.route('/details/:id').get(controller.getDetails)

module.exports = app