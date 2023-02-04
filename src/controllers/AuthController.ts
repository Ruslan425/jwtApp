import AuthService from "../services/AuthService";
import{ validationResult} from "express-validator";
import { Request, Response } from "express";
import UserImp from "../models/User";

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
            const users = await UserImp.find()
            res.json({
                users
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async logout(req: Request, res: Response) {
        
    }
}


export default new AuthController()