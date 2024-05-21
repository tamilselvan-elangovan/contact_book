import { Request, Response } from "express"
import { isFieldMissing } from "../../shared/utils"
import { sendFailureMessage, sendSuccessData, sendSuccessMessage } from "../../shared/responder"
import aprMd5 from "apache-md5"
import jwt from 'jsonwebtoken'
import { CONSTANT } from "../../shared/constant"
import { contact_book, user } from "../../database/schema"

class Controller {
    register = (req: Request, res: Response) => {
        const body = req.body
        const {name, phone, password, email} = body
        if (isFieldMissing(req, res, ['name', 'phone', 'password'])) return
        const encrypted_password = aprMd5(password)
        const data: any = {name, phone, password: encrypted_password}
        email && (data['email'] = email)

        user.create(data).then(response => {
            contact_book.update({registered: 1}, {where: {phone: data.phone}})
            sendSuccessData(res, 'User registered successfully', response)
        }).catch(error => {
            if (error?.parent?.code === 'ER_DUP_ENTRY') sendFailureMessage(res, 'User already registered')
            else sendFailureMessage(res, error.message)
        })
    }

    login = async (req: Request, res: Response) => {
        const body = req.body
        const {phone, email, password} = body
        if (!phone && !email) return sendFailureMessage(res, 'Email or Phone Number is mandatory')
        else if (isFieldMissing(req, res, ['password'])) return
        
        const query: any = {}
        if (phone) query['phone'] = phone
        else if (email) query['email'] = email
        let response: any = await user.findOne({where: query})

        const data = response.dataValues

        console.log(data, password)
        if (aprMd5(password, data.password) == data.password) sendSuccessData(res, 'login successfull', {token: jwt.sign({phone: data.phone, exp: Date.now()+ 24*60*60*1000}, CONSTANT.JWTKEY)})
        else sendFailureMessage(res, 'Invalid credentials')
    }
}

export default new Controller()