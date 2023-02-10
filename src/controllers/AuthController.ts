import AuthService from "../services/AuthService";
import {validationResult} from "express-validator";
import e, {Request, Response} from "express";


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
                res.status(400).json({message: error.message})
            }
        }
    }

    async refreshTokens(req: Request, res: Response) {
        try {
            const { userId, refreshToken } = req.body
            const userResponse = await AuthService.getNewTokens(userId, refreshToken)
            return res.status(200).json(userResponse)
        } catch (error) {
            if (error instanceof Error) {
                console.log(error)
                res.status(500).json({
                    message: error.message
                })
            }
        }
    }

    async logout(req: Request, res: Response) {

    }
}


export default new AuthController()