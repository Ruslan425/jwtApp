import bcrypt from 'bcryptjs';
import {UserResponse} from "../models/UserResponse"
import TokenService from "../services/TokenService";
import UserImp, {User} from "../models/User";
import RoleImpl from "../models/Role";
import {Types} from "mongoose";
import jwt, {JwtPayload} from "jsonwebtoken";
import MyError from "../error/MyError";


export interface Payload {
    userId: Types.ObjectId,
    roleId: Types.ObjectId
}

class AuthService {

    async registration(username: string, password: string): Promise<UserResponse> {
        const check = await UserImp.findOne({username})
        if(check) {
            throw new Error("Такой пользователь уже есть")
        }
        const userRole = await RoleImpl.findOne({value: "user"})
        const hashPass = await bcrypt.hash(password, 2)
        let user = new UserImp()
        if (userRole) {
            user = await UserImp.create({
                username: username, 
                password: hashPass,
                roles: [userRole._id]
            })
        }
        const payload: Payload = {
            userId: user._id,
            roleId: userRole!._id
        }

        const token = TokenService.generateTokens(payload)
        await TokenService.saveTokens(user._id, token.refreshToken, token.accessToken)
        return {
            userId: user._id.toString(), 
            accessToken: token.accessToken, 
            refreshToken: token.refreshToken}
    }

    async login(username: string, password: string): Promise<UserResponse> {
        const user = await UserImp.findOne({username})
        if (!user) {
            throw new Error("Пользователь не найден")
        }
        const validPass = await bcrypt.compare(password, user.password)
        if(!validPass) {
           throw new Error("Неверный пароль")
        }

        const payload: Payload = {
            userId: user._id,
            roleId: user.roles[0]
        }
        const token = TokenService.generateTokens(payload)
        await TokenService.saveTokens(user._id, token.refreshToken, token.accessToken)

        return {
            userId: user._id.toString(), 
            accessToken: token.accessToken, 
            refreshToken: token.refreshToken}
    }

    async logout(refreshToken: string) {

    }

    async getNewTokens(userId: string, refreshToken: string) {

    }


    async getUsersList(accessToken: string | undefined): Promise<Array<User>> {
        if (!accessToken) {
            throw new MyError(401, 'Missing authorization token')
        }
        let userInfo: JwtPayload | string

        try {
            userInfo = await jwt.verify(accessToken!, process.env.ACCESS_SECRET!!)
        } catch (e) {
            throw new MyError(401, 'Unauthorized')
        }

        const payload = userInfo as Payload
        console.log(payload)
        const role = await RoleImpl.findById(payload.roleId)

        if (role?.value === 'admin') {
            return UserImp.find();
        } else {
            throw new MyError(403, '"Forbidden". The client does not have permission.')
        }
    }
}

export default new AuthService();