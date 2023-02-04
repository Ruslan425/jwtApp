import {Schema, model, Types} from "mongoose";
import { Role } from "./Role";

export interface User {
    username: string
    password: string
    roles: Array<Types.ObjectId>
}

const UserImp = new Schema<User>({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: Types.ObjectId, ref: 'Role'}]
})

export default model<User>('User', UserImp)