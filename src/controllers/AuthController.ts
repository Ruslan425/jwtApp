import AuthService, {Payload} from "../services/AuthService";
import {validationResult} from "express-validator";
import e, {Request, Response} from "express";
import {User} from "../models/User";
import jwt from 'jsonwebtoken'
import RoleImpl from "../models/Role";
import MyError from "../error/MyError";

class AuthController {

    async reg(req: Request, res: Response) {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json(error)
            }
            const {username, password} = req.body

            const userResponse = await AuthService.registration(username, password)

            res.json(userResponse)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error)
                res.status(400).json({message: error.message})
            }
        }
    }


    async login(req: Request, res: Response) {
        try {
            const {username, password} = req.body
            const userResponse = await AuthService.login(username, password)
            res.json(userResponse)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error)
                res.status(400).json({message: error.message})
            }
        }
    }

    async getUsersList(req: Request, res: Response) {
        try {
            const accessToken = req.headers.authorization
            const users: Array<User> = await AuthService.getUsersList(accessToken)
            res.status(200).json({users})
        } catch (error) {
            console.log(error)
            const myError = error as MyError
            res.status(myError.status ?? 500).json({
                message: myError.message
            })
        }
    }

    async refreshTokens(req: Request, res: Response) {

        await AuthService.getNewTokens()
    }

    async logout(req: Request, res: Response) {

    }
}


export default new AuthController()