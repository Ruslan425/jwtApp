import jwt, {JwtPayload} from 'jsonwebtoken';
import UserTokenImp from "../models/UserToken";
import Payload from "../models/Payload";
import {accessTokenLive} from "../Config";
import MyError from "../error/MyError";

class TokenService {
    generateTokens(payload: Payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET!!, {expiresIn: accessTokenLive()})
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

    async verificationAccessToken(accessToken: string | undefined): Promise<Payload> {
        let userInfo: JwtPayload | string
        if (!accessToken) {
            throw new MyError(401, 'Missing authorization token')
        }
        try {
            userInfo = await jwt.verify(accessToken, process.env.ACCESS_SECRET!!)
        } catch (e) {
            throw new MyError(401, 'Unauthorized')
        }
        return userInfo as Payload
    }
}

export default new TokenService()