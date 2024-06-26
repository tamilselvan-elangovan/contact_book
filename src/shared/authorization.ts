import { Request, Response, NextFunction } from "express"
import { sendFailureMessage } from "./responder"
import jwt from "jsonwebtoken"
import { CONSTANT } from "./constant"
import { User } from "../database/schema"

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization
    const token = authorization?.split(' ')?.[1]
    if (!token) return sendFailureMessage(res, 'No authorization', 401)
    jwt.verify(token, CONSTANT.JWTKEY, async (error, decoded) => {
        if (!decoded) return sendFailureMessage(res, 'Invalid token', 401)
        else if (typeof decoded === 'string') return sendFailureMessage(res, decoded)
        const userData = await User.findOne({where: {phone: decoded.phone}})
        if (!userData?.dataValues) return sendFailureMessage(res, 'Unauthorized access', 401)
        req.headers.phone = decoded.phone
        
        next()
    })
}