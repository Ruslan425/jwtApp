import bcrypt from 'bcryptjs';
import {UserResponse} from "../models/UserResponse"
import TokenService from "../services/TokenService";
import UserImp, {User} from "../models/User";
import RoleImpl from "../models/Role";
import jwt, {JwtPayload} from "jsonwebtoken";
import MyError from "../error/MyError";
import Payload from "../models/Payload";


class AuthService {

    async registration(username: string, password: string): Promise<UserResponse> {
        const check = await UserImp.findOne({username})
        if (check) {
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
            refreshToken: token.refreshToken
        }
    }

    async login(username: string, password: string): Promise<UserResponse> {
        const user = await UserImp.findOne({username})
        if (!user) {
            throw new Error("Пользователь не найден")
        }
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) {
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
            refreshToken: token.refreshToken
        }
    }

    async getNewTokens(userId: string, refreshToken: string) {
        const user = await UserImp.findById(userId)
        if (!user) {
            throw new MyError(404, 'User does not exist')
        }

        try {
            await jwt.verify(refreshToken, process.env.REFRESH_SECRET!!)
        } catch (error) {
            console.log(error)
            throw new MyError(401, 'Unauthorized')
        }
        const newPayload: Payload = {
            userId: user._id,
            roleId: user.roles[0]
        }
        const newTokens = TokenService.generateTokens(newPayload)
        await TokenService.saveTokens(user._id, newTokens.refreshToken, newTokens.accessToken)

        return {
            userId: user._id,
            refreshToken: newTokens.refreshToken,
            accessToken: newTokens.accessToken
        }
    }

    async logout(refreshToken: string) {

    }

}

export default new AuthService();