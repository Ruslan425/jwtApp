import { Schema, model } from "mongoose";
import { Role } from "./Role";

export interface User {
    username: string
    password: string
    roles: Array<UserRole>
}

export interface UserRole {
    type: string
    ref: Role
}

const UserImp = new Schema<User>({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{
        type: String,
        ref: 'Role'
    }]
})

export default model<User>('User', UserImp)