import jwt from "jsonwebtoken";
import dotnet from "dotenv";

class TokenService {
    generateAccessToken(username, roles) {
        const playload = {
            username,
            roles
        }
        dotnet.config()
        return jwt.sign(playload, process.env.TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIVE})
    }
}

export default new TokenService()