import { Request, Response } from "express"
import { contact_book, user } from "../../database/schema"
import { sendFailureMessage, sendSuccessData, sendSuccessMessage } from "../../shared/responder"
import { Op, fn } from "sequelize"
import { NOT } from "sequelize/types/deferrable"
import { sequelize } from "../../database/sequilize"

class Controller {
    markAsSpam = async (req: Request, res: Response) => {
        const phone = req.params.phone
        const userQuery = user.findOne({where: {phone}})
        const contactQuery = contact_book.findAll({where: {phone}})
        let [userRes, contactRes] = await Promise.all([userQuery, contactQuery])
        let response
        console.log(userRes, contactRes)
        if(userRes || contactRes.length) {
            userRes && (response = await user.update({spam: sequelize.literal('spam + 1')}, {where: {phone}}))
            contactRes && (response = await contact_book.update({spam: sequelize.literal('spam + 1')}, {where: {phone}}))
        } else response = await contact_book.create({name: '', phone: req.params.phone, spam: 1})
        if (response) sendSuccessMessage(res, 'user has been reported')
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
        const userStartFilter = user.findAll({where: {name:{
            [Op.like]:fn('LOWER', name + '%')
        }}, attributes
        })
        const userContainFilter = user.findAll({where: {name:{
            [Op.notLike]:fn('LOWER', name + '%'),
            [Op.like]:fn('LOWER', '%' + name + '%')
        }}, attributes
        })
        const contactStartFilter = contact_book.findAll({where: {name:{
            [Op.like]:fn('LOWER', name + '%')
        }, registered: 0
        }, attributes
        })
        const contactContainFilter = contact_book.findAll({where: {name:{
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
        const userData = user.findAll({
            where: {phone},
            attributes: ['phone', 'name', 'spam']
        })
        const contactData = contact_book.findAll({
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

        let response = await user.findOne({where: {
            id,
        }})

        let userData;
        // console.log('user response', response)
        if (!response?.dataValues) response = await contact_book.findOne({where: {id}})
        else {
            console.log({phone: userPhone, reference: response.dataValues.phone})
            userData = response.dataValues
            const data = await contact_book.findOne({where: {phone: userPhone, reference: response.dataValues.phone}})
            console.log('contact book data', data)
            if (!data?.dataValues) delete userData.email
        }
        
        if (userData) sendSuccessData(res, 'User details', userData)
        else sendFailureMessage(res, 'Cannot get user details') 
    }
}

export default new Controller()