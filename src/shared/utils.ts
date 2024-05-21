import { Request, Response } from "express";
import { sendFailureMessage } from "./responder";

export const isFieldMissing = (req: Request, res: Response, fields: string[]) => {
    const body = req.body
    let error = false
    let missingFields = ''
    fields.forEach(field => {
        if (!body[field]) missingFields += field[0].toUpperCase() + field.slice(1) + ', '
    })
    if (!!missingFields) {
        const plural = missingFields.split(',').length > 2
        sendFailureMessage(res, `${missingFields.slice(0, missingFields.length - 2)} ${plural ? 'are' : 'is a'} mandatory field${plural ? 's' : ''}`)
        error = true
    }
    return error
}