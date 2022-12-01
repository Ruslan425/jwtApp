
import Role from "../models/Role.js";
import User from "../models/User.js";
import UserToken from "../models/UserToken.js"
import bcrypt from "bcryptjs";
import UserResponse from "../models/UserResponse.js"
import TokenService from "../services/TokenService.js";


class AuthService {
    async registration(username, password) {
        const check = await User.findOne({username})
        if(check) {
            throw new Error("Такой пользователь уже есть")
        }
        const userRole = await Role.findOne({value: "user"})
        const hashPass = await bcrypt.hash(password, 2)
        const user = await User.create({
            username: username, 
            password: hashPass,
            roles: [userRole.value]
        })
        
        const token = TokenService.generateTokens({userId: user._id, roles: user.roles})

        TokenService.saveTokens(user._id, token.refreshToken, token.accessToken)

        return new UserResponse(user._id, token)
    }

    async login(username, password) {
        const user = await User.findOne({username})
        if (!user) {
            throw new Error("Пользователь не найден")
        }
        const validPass = await bcrypt.compare(password, user.password)
        if(!validPass) {
           throw new Error("Не верный пароль")
        }
        const token = TokenService.generateTokens(user.username, user.roles)
        return new UserResponse(user.username, token)
    }

    async ref() {

    }
}

export default new AuthService();