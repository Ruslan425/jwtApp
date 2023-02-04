import jwt from 'jsonwebtoken';
import UserToken from "../models/UserToken.js";

class TokenService {
    generateTokens(playload: object) {

        const accessToken = jwt.sign(playload, process.env.ACCESS_SECRET!!, {expiresIn: process.env.ACCESS_TOKEN_LIVE})
        const refreshToken = jwt.sign(playload, process.env.REFRESH_SECRET!! , {expiresIn: process.env.REFRESH_TOKEN_LIVE})

        return {
            refreshToken,
            accessToken
        }
    }

    async saveTokens(userId: any, refreshToken: string, accessToken: string){
        const checkUser = await UserToken.findOne({user: userId})
        if (checkUser) {
            return UserToken.findOneAndUpdate({user: userId}, {
                user: userId,
                refreshToken,
                accessToken
            }, {new: true});
        }
        return await UserToken.create({user: userId, refreshToken, accessToken})
    }

    async deleteTokens(refreshToken: string | undefined) {
        const deleteToken = await UserToken.deleteOne({refreshToken: refreshToken})
        console.log(deleteToken)
        if (deleteToken.deletedCount == 1) {
            return 'logout'
        } else {
            return 'Some Error'
        }
        
    }
}

export default new TokenService()