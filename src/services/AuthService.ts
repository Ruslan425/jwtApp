import bcrypt from 'bcryptjs';
import { UserResponse } from "../models/UserResponse.js"
import TokenService from "../services/TokenService.js";
import UserImp from "../models/User.js";
import RoleImpl from "../models/Role.js";

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
                roles: [userRole.value]
            })
        }
        
        const token = TokenService.generateTokens({userId: user._id, roles: user.roles})

        await TokenService.saveTokens(user._id, token.refreshToken, token.accessToken)

        return {
            userId: user._id.toString(), 
            accessToken: token.accessToken, 
            refreshToken: token.refreshToken}
    }

    async login(username: String, password: string): Promise<UserResponse> {
        const user = await UserImp.findOne({username})
        if (!user) {
            throw new Error("Пользователь не найден")
        }
        const validPass = await bcrypt.compare(password, user.password)
        if(!validPass) {
           throw new Error("Неверный пароль")
        }
        const token = TokenService.generateTokens({userId: user._id, roles: user.roles})
        return {
            userId: user._id.toString(), 
            accessToken: token.accessToken, 
            refreshToken: token.refreshToken}
    }

    async ref() {

    }

    async logout(refreshToken: string) {
        
    }
}

export default new AuthService();