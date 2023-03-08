import {Request, Response} from "express";
import UserImp, {User} from "../models/User";
import MyError from "../error/MyError";
import RoleImpl from "../models/Role";

export const getUsersList = async (req: Request, res: Response) => {
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

export const changeRole = async (req: Request, res: Response) => {
    const userId = req.body.body.id
    const role = req.body.body.role
    const adminRole = await RoleImpl.findOne({value: role})
    await UserImp.findOneAndUpdate({_id: userId}, {$set: {roles: [adminRole!._id]}})
    res.status(200).json({})
}
