import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import Status from "http-status-codes"
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(Status.BAD_REQUEST, "No token Received!");
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        const veriFiedToken = verifyToken(token, envVars.JWT_ACCESS_TOKEN) as JwtPayload;

        if (!authRoles.includes(veriFiedToken.role)) {
            throw new AppError(Status.FORBIDDEN, "You are not permitted to view this route!!!")
        }

        req.user = veriFiedToken;

        next();

    } catch (error) {
        next(error)
    }
}