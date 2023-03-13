import {registrationService, refreshService, loginService, logoutService} from "../services/AuthService";
import {validationResult} from "express-validator";
import {Request, Response} from "express";
import MyError from "../error/MyError";


export const registration = async (req: Request, res: Response) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            const message = error.array()
            return res.status(400).json(message)
        }
        const {username, password} = req.body

        const userResponse = await registrationService(username, password)

        res.json(userResponse)
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            res.status(400).json({message: error.message})
        }
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        const userResponse = await loginService(username, password)
        res.json(userResponse)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({message: error.message})
        }
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const {userId, refreshToken} = req.body
        const userResponse = await refreshService(userId, refreshToken)
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

export const logout = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization
        await logoutService(accessToken)
        return res.status(200).json()
    } catch (error) {
        console.log(error)
        const myError = error as MyError
        res.status(myError.status ?? 500).json({
            message: myError.message
        })
    }
}
