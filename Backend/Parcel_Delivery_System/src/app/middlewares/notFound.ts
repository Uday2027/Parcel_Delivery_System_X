import { Request, Response } from "express"
import Status from "http-status-codes"

export const notFound = ((req: Request, res: Response) => {
    res.status(Status.NOT_FOUND).json({
        success: false,
        message: "Route not found!"
    })
})