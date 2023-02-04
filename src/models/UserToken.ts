import { Schema, model } from "mongoose";
import {User} from "./User";

export interface UserToken {
    user: User,
    refreshToken: string
    accessToken: string
}

const UserTokenImp = new Schema<UserToken>({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
    accessToken: {type: String, required: true}
})

export default model<UserToken>('UserToken', UserTokenImp)