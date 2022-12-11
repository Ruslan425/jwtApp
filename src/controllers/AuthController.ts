import AuthService from "../services/AuthService.js";
import{ validationResult} from "express-validator";
import { Request, Response } from "express";

class AuthController {

    async reg (req: Request, res: Response) { 
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

    async ref(req: Request, res: Response) {
        try {
            res.json(req)
        } catch (error) {
            res.status(400).json(error)
        }
    }
}


export default new AuthController()