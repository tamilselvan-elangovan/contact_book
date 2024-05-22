import { Request, Response } from "express"
import { isFieldMissing } from "../../shared/utils"
import { sendFailureMessage, sendSuccessData, sendSuccessMessage } from "../../shared/responder"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { CONSTANT } from "../../shared/constant"
import { Contact, User } from "../../database/schema"

class Controller {
    register = (req: Request, res: Response) => {
        const body = req.body
        const {name, phone, password, email} = body
        if (isFieldMissing(req, res, ['name', 'phone', 'password'])) return
        const encrypted_password = bcrypt.hashSync(password, 10);
        const data: any = {name, phone, password: encrypted_password}
        email && (data['email'] = email)

        User.create(data).then(response => {
            Contact.update({registered: 1}, {where: {phone: data.phone}})
            sendSuccessData(res, 'User registered successfully', response)
        }).catch(error => {
            console.log(error)
            if (error?.parent?.code === 'ER_DUP_ENTRY') sendFailureMessage(res, 'Phone number already registered')
            else sendFailureMessage(res, error.message)
        })
    }

    login = async (req: Request, res: Response) => {
        const body = req.body
        const {phone, email, password} = body
        if (!phone && !email) return sendFailureMessage(res, 'Email or Phone Number is mandatory', 401)
        else if (isFieldMissing(req, res, ['password'])) return
        
        const query: any = {}
        if (phone) query['phone'] = phone
        else if (email) query['email'] = email
        console.log(query)
        let response: any = await User.findOne({where: query})

        const data = response?.dataValues

        console.log(data, password)
        if (!data) sendFailureMessage(res, 'Account not found')
        else if (bcrypt.compareSync(password, data.password)) sendSuccessData(res, 'login successfull', {token: jwt.sign({phone: data.phone, exp: Date.now()+ 24*60*60*1000}, CONSTANT.JWTKEY)})
        else sendFailureMessage(res, 'Invalid credentials', 401)
    }
}

export default new Controller()