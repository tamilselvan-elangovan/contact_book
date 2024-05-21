import { Request, Response, NextFunction } from "express"
import { sendFailureMessage } from "./responder"
import jwt from 'jsonwebtoken'
import { CONSTANT } from "./constant"

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization
    const token = authorization?.split(' ')?.[1]
    if (!token) return sendFailureMessage(res, 'No authorization')
    jwt.verify(token, CONSTANT.JWTKEY, async (error, decoded) => {
        if (!decoded) return sendFailureMessage(res, 'Invalid token')
        else if (typeof decoded === 'string') return sendFailureMessage(res, decoded)
        req.headers.phone = decoded.phone
        next()
    })
}