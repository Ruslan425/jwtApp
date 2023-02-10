import UserImp, {User} from "../models/User";
import MyError from "../error/MyError";
import jwt, {JwtPayload} from "jsonwebtoken";
import RoleImpl from "../models/Role";
import Payload from "../models/Payload";

class UtilsService {

    async getUsersList(accessToken: string | undefined): Promise<Array<User>> {
        if (!accessToken) {
            throw new MyError(401, 'Missing authorization token')
        }
        let userInfo: JwtPayload | string

        try {
            userInfo = await jwt.verify(accessToken, process.env.ACCESS_SECRET!!)
        } catch (e) {
            throw new MyError(401, 'Unauthorized')
        }

        const payload = userInfo as Payload

        const role = await RoleImpl.findById(payload.roleId)

        if (role?.value === 'admin') {
            return UserImp.find();
        } else {
            throw new MyError(403, '"Forbidden". The client does not have permission.')
        }
    }
}

export default new UtilsService()