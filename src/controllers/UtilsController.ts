import {Request, Response} from "express";
import UserImp, {User} from "../models/User";
import MyError from "../error/MyError";

class UtilsController {
    async getUsersList(req: Request, res: Response) {
        try {
            const users: Array<User> = await UserImp.find();
            return res.status(200).json({users})
        } catch (error) {
            const myError = error as MyError
            res.status(myError.status ?? 500).json({
                message: myError.message
            })
        }
    }
}

export default new UtilsController()