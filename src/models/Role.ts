import { Schema, model } from "mongoose";

export interface Role {
    value: string
}

const RoleImpl = new Schema<Role>({
    value: {type: String, unique: true, default: "user"}
})

export default model<Role>('Role', RoleImpl);