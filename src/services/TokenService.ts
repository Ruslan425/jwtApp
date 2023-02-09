import jwt, {JwtPayload} from 'jsonwebtoken';
import UserTokenImp from "../models/UserToken";
import {Payload} from "./AuthService";

class TokenService {
    generateTokens(payload: Payload) {

        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET!!, {expiresIn: process.env.ACCESS_TOKEN_LIVE})
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!! , {expiresIn: process.env.REFRESH_TOKEN_LIVE})

        return {
            refreshToken,
            accessToken
        }
    }

    async saveTokens(userId: any, refreshToken: string, accessToken: string){
        const checkUser = await UserTokenImp.findOne({user: userId})
        if (checkUser) {
            return UserTokenImp.findOneAndUpdate({user: userId}, {
                user: userId,
                refreshToken,
                accessToken
            }, {new: true});
        }
        return await UserTokenImp.create({user: userId, refreshToken, accessToken})
    }

    async deleteTokens(refreshToken: string | undefined) {
        const deleteToken = await UserTokenImp.deleteOne({refreshToken: refreshToken})
        if (deleteToken.deletedCount == 1) {
            return 'logout'
        } else {
            return 'Some Error'
        }
        
    }
}

export default new TokenService()