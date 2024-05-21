import { Request, Response } from "express"
import { contact_book, user } from "../../database/schema"
import { sendFailureMessage, sendSuccessData, sendSuccessMessage } from "../../shared/responder"
import { Op, fn } from "sequelize"
import { NOT } from "sequelize/types/deferrable"

class Controller {
    markAsSpam = async (req: Request, res: Response) => {
        const response1 = await user.findOne({where: {phone: req.params.phone}})
        const userData = response1?.dataValues
        let response2;
        if(userData) response2 = await user.update({spam: userData.spam+1}, {where: {phone: userData.phone}})
        else response2 = await contact_book.create({name: '', phone: req.params.phone, spam: 1})
        if (response2) sendSuccessMessage(res, 'user has been reported')
        else sendFailureMessage(res, 'Something went wrong, Please try again')
    }

    getUsers = (req: Request, res: Response) => {
        const {name, phone} = req.query
        if (name) this.searchUserByName(req, res)
        else if (phone) this.searchUserByPhone(req, res)
    }

    searchUserByName = async (req: Request, res: Response) => { 
        const name = req.query.name
        const userStartFilter = user.findAll({where: {name:{
            [Op.like]:fn('LOWER', name + '%')
        }}})
        const userContainFilter = user.findAll({where: {name:{
            [Op.notLike]:fn('LOWER', name + '%'),
            [Op.like]:fn('LOWER', '%' + name + '%')
        }}})
        const contactStartFilter = contact_book.findAll({where: {name:{
            [Op.like]:fn('LOWER', name + '%')
        }, registered: 0
        }})
        const contactContainFilter = contact_book.findAll({where: {name:{
            [Op.notLike]:fn('LOWER', name + '%'),
            [Op.like]:fn('LOWER', '%' + name + '%')
        }, registered: 0
        }})
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
            attributes: ['phone', 'name']
        })
        const contactData = contact_book.findAll({
            where: {phone, registered: 0},
            attributes: ['phone', 'name']
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
        const phone = req.params.phone
        const userPhone = req.headers.phone

        const contactData = await contact_book.findAll({where: {
            phone,
            reference: userPhone
        }})
        const attributes = ['phone', 'name']
        if (contactData.length) attributes.push('email')
        const userData = await user.findOne({where: {
            phone,
        }, attributes})
        if (userData?.dataValues) sendSuccessData(res, 'User details', userData.dataValues)
        else sendFailureMessage(res, 'Cannot get user details') 
    }
}

export default new Controller()