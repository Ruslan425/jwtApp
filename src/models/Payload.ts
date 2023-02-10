import {Types} from "mongoose";

export default interface Payload {
    userId: Types.ObjectId,
    roleId: Types.ObjectId
}
