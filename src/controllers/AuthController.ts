import AuthService from "../services/AuthService";
import {validationResult} from "express-validator";
import {Request, Response} from "express";
import MyError from "../error/MyError";


class AuthController {

    async reg(req: Request, res: Response) {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                const message = error.array()
                return res.status(400).json(message)
            }
            const {username, password} = req.body

            const userResponse = await AuthService.registration(username, password)

            res.json(userResponse)
        } catch (error) {
            console.log(error)
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
            const {userId, refreshToken} = req.body
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
        try {
            const accessToken = req.headers.authorization
            await AuthService.logout(accessToken)
            return res.status(200).json()
        } catch (error) {
            console.log(error)
            const myError = error as MyError
            res.status(myError.status ?? 500).json({
                message: myError.message
            })
        }
    }

}


export default new AuthController()