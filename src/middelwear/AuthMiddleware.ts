import {NextFunction, Request, Response} from "express";
import TokenService from "../services/TokenService";
import MyError from "../error/MyError";
import RoleImpl, {Role} from "../models/Role";
import UserImp, {User} from "../models/User";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        const userInfo = await TokenService.verificationAccessToken(accessToken)
        const role: Role | null = await RoleImpl.findById(userInfo.roleId)
        req.body = {...userInfo, role: role?.value}
        next()
    } catch (error) {
        const myError = error as MyError
        res.status(myError.status ?? 500).json({
            message: myError.message
        })
    }
}

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role !== 'admin') {
       return res.status(403).json({
            message: '"Forbidden". The client does not have permission.'
        })
    }
    next()
}