import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import sendResponse from "../utils/sendResponse"
import Status from 'http-status-codes'
import { AuthServices } from "./auth.service"
import AppError from "../errorHelpers/AppError"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const loginInfo = await AuthServices.credentialLogin(req.body);

    res.cookie("accessToken", loginInfo.accessToken, {
        httpOnly: true,
        secure:false
    })

    res.cookie("refreshToken", loginInfo.refreshToken, {
        secure: false,
        httpOnly:true
    })
    
    sendResponse(res, {
        success: true,
        Status: Status.OK,
        message: "User logged in Successfully!",
        data: loginInfo,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        throw new AppError(Status.BAD_REQUEST,"Refresh token not received!");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    res.cookie("accessToken", tokenInfo.accessToken, {
        httpOnly: true,
        secure:false
    })
    
    sendResponse(res, {
        success: true,
        Status: Status.OK,
        message: "User logged in Successfully!",
        data: tokenInfo,
    })
})
 
export const AuthControllers = {
    credentialLogin,
    getNewAccessToken
}