import { Response } from "express";

export const sendMessage = (res: Response, success: boolean,  message: string, data: any = null, statusCode: number = 200) => {
    const responses: any = {success, message}
    if (data) responses['data'] = data 
    res.setHeader('content-type', 'application/json').status(statusCode).send(JSON.stringify(responses));
}

export const sendSuccessMessage = (res: Response, message: string) => sendMessage(res, true, message);
export const sendSuccessData = (res: Response, message: string, data: any = null) => sendMessage(res, true, message, data)
export const sendFailureMessage = (res: Response, message: string, statusCode: number = 200) => sendMessage(res, false, message, '', statusCode)