import { Request, Response } from "express"
import { Contact, User } from "../../database/schema"
import { sendFailureMessage, sendSuccessData, sendSuccessMessage } from "../../shared/responder"
import { Op, fn } from "sequelize"
import { sequelize } from "../../database/sequilize"

class Controller {
    markAsSpam = async (req: Request, res: Response) => {
        const phone = req.params.phone
        const userQuery = User.findOne({where: {phone}})
        const contactQuery = Contact.findAll({where: {phone}})
        let [userRes, contactRes] = await Promise.all([userQuery, contactQuery])
        let response
        console.log(userRes, contactRes)
        if(userRes || contactRes.length) {
            userRes && (response = await User.update({spam: sequelize.literal('spam + 1')}, {where: {phone}}))
            contactRes && (response = await Contact.update({spam: sequelize.literal('spam + 1')}, {where: {phone}}))
        } else response = await Contact.create({name: '', phone: req.params.phone, spam: 1})
        if (response) sendSuccessMessage(res, 'User has been reported')
        else sendFailureMessage(res, 'Something went wrong, Please try again')
    }

    getUsers = (req: Request, res: Response) => {
        const {name, phone} = req.query
        if (name) this.searchUserByName(req, res)
        else if (phone) this.searchUserByPhone(req, res)
    }

    searchUserByName = async (req: Request, res: Response) => { 
        const name = req.query.name
        const attributes = ['phone', 'name', 'spam']
        const userStartFilter = User.findAll({where: {name:{
            [Op.like]:fn('LOWER', name + '%')
        }}, attributes
        })
        const userContainFilter = User.findAll({where: {name:{
            [Op.notLike]:fn('LOWER', name + '%'),
            [Op.like]:fn('LOWER', '%' + name + '%')
        }}, attributes
        })
        const contactStartFilter = Contact.findAll({where: {name:{
            [Op.like]:fn('LOWER', name + '%')
        }, registered: 0
        }, attributes
        })
        const contactContainFilter = Contact.findAll({where: {name:{
            [Op.notLike]:fn('LOWER', name + '%'),
            [Op.like]:fn('LOWER', '%' + name + '%')
        }, registered: 0
        }, attributes
        })
        Promise.all([userStartFilter, userContainFilter, contactStartFilter, contactContainFilter])
            .then(([userStartRes, userContainRes, contactStartRes, contactContainRes]) => {
                const users: any = []
                userStartRes.forEach(data => {
                    users.push(data.dataValues)
                })
                contactStartRes.forEach(data => {
                    users.push(data.dataValues)
                })
                userContainRes.forEach(data => {
                    users.push(data.dataValues)
                })
                contactContainRes.forEach(data => {
                    users.push(data.dataValues)
                })
                sendSuccessMessage(res, users)
            }).catch(error => sendFailureMessage(res, error.message))
    }

    searchUserByPhone = (req: Request, res: Response) => {
        const phone = req.query.phone
        const userData = User.findAll({
            where: {phone},
            attributes: ['phone', 'name', 'spam']
        })
        const contactData = Contact.findAll({
            where: {phone, registered: 0},
            attributes: ['phone', 'name', 'spam']
        })
        Promise.all([userData, contactData]).then(([userRes, contactRes]) => {
            const users: any = []
            userRes.forEach(data => {
                users.push(data)
            })
            contactRes.forEach(data => {
                users.push(data)
            })
            sendSuccessMessage(res, users)
        }).catch(error => sendFailureMessage(res, error.message))
    }

    getDetails = async (req: Request, res: Response) => {
        const id = req.params.id
        const userPhone = req.headers.phone

        let response = await User.findOne({where: {
            id,
        }})

        let userData;
        // console.log('User response', response)
        if (!response?.dataValues) response = await Contact.findOne({where: {id}})
        else {
            console.log({phone: userPhone, reference: response.dataValues.phone})
            userData = response.dataValues
            const data = await Contact.findOne({where: {phone: userPhone, reference: response.dataValues.phone}})
            console.log('Contact book data', data)
            if (!data?.dataValues) delete userData.email
        }
        
        if (userData) sendSuccessData(res, 'User details', userData)
        else sendFailureMessage(res, 'Cannot get user details') 
    }
}

export default new Controller()