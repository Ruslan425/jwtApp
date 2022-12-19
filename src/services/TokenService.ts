import jwt from 'jsonwebtoken';
import UserToken from "../models/UserToken.js";
import config from '../config.js';


class TokenService {
    generateTokens(playload: object) {
        const secret_accses = Buffer.from(config.secret_access, 'base64'
        ).toString('ascii') 

        const secret_refresh = Buffer.from(config.secret_refresh, 'base64'
        ).toString('ascii') 
        
        const accessToken = jwt.sign(playload,secret_accses, {expiresIn: process.env.ACCESS_TOKEN_LIVE})
        const refreshToken = jwt.sign(playload,secret_refresh , {expiresIn: process.env.REFRESH_TOKEN_LIVE})

        return {
            refreshToken,
            accessToken
        }
    }

    async saveTokens(userId: any, refreshToken: string, accessToken: string) {
        const checkUser = await UserToken.findOne({user: userId})
        if (checkUser) {
           const newUserToken = await UserToken.findOneAndUpdate({user: userId}, {user: userId, refreshToken, accessToken}, {new: true})
           return newUserToken
        }
        const userToken = await UserToken.create({user: userId, refreshToken, accessToken})
        return userToken
    }
}

export default new TokenService()