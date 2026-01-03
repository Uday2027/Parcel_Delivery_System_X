import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { isActive, IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { StatusCodes } from "http-status-codes";

export const createUserTokens = (user:Partial<IUser>) => {
    const jwtPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        }
    
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_ACCESS_EXPIRESIN);
    
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_TOKEN, envVars.JWT_REFRESH_EXPIRESIN);
    
    return {
        accessToken,
        refreshToken 
    }
    
}

export const newAccessTokenUsingRefreshToken = async (refreshToken:string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN) as JwtPayload;
    
        const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })
        
        if (!isUserExist) {
            throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist!")
        }
    
        if (isUserExist.isActive===isActive.BLOCKED || isUserExist.isActive===isActive.INACTIVE) {
            throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
    
        if (isUserExist.isDeleted) {
            throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted!")
        }
        const jwtPayload = {
            userId: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role
        }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN, envVars.JWT_ACCESS_EXPIRESIN);
    
    return accessToken
}

