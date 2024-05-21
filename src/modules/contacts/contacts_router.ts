import express from 'express'
import controller from './contacts_controller'

const app = express()

app.route('/users').get(controller.getUsers)
app.route('/spam/:phone').post(controller.markAsSpam)
app.route('/details/:phone').get(controller.getDetails)

module.exports = app