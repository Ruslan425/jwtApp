import {Request, Response} from "express";
import {User} from "../models/User";
import MyError from "../error/MyError";
import UtilsService from "../services/UtilsService";

class UtilsController {

    async getUsersList(req: Request, res: Response) {
        try {
            const accessToken = req.headers.authorization
            const users: Array<User> = await UtilsService.getUsersList(accessToken)
            res.status(200).json({users})
        } catch (error) {
            const myError = error as MyError
            res.status(myError.status ?? 500).json({
                message: myError.message
            })
        }
    }
}

export default new UtilsController()