
import Role from "../models/Role.js";
import User from "../models/User.js";
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
        const hashPass = bcrypt.hashSync(password, 2)
        const user = new User({
           username: username,
           password: hashPass,
           roles: [userRole.value]
        })
        user.save()
        const token = TokenService.generateAccessToken(username, user.roles)
        return new UserResponse(username, token)
    }

    async login(username, password) {
        const user = await User.findOne({username})
        if (!user) {
            throw new Error("Пользователь не найден")
        }
        const validPass = bcrypt.compareSync(password, user.password)
        if(!validPass) {
           throw new Error("Не верный пароль")
        }
        const token = TokenService.generateAccessToken(user.username, user.roles)
        return new UserResponse(user.username, token)
    }
}

export default new AuthService();